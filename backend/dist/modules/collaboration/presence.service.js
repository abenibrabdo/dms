import { Op } from 'sequelize';
import { NotFoundError } from '@core/errors.js';
import { logger } from '@core/logger.js';
import { broadcastEvent } from '@core/socket.js';
import { RealtimeChannels } from '@core/events.js';
import { DocumentSessionModel, } from './presence.model.js';
const PRESENCE_STALE_THRESHOLD_MS = 2 * 60 * 1000; // 2 minutes
const emitPresenceUpdate = async (documentId) => {
    const sessions = await listActiveSessions(documentId);
    broadcastEvent(RealtimeChannels.DOCUMENT_PRESENCE_UPDATED, {
        documentId,
        sessions,
    });
};
const deactivateStaleSessions = async () => {
    const cutoff = new Date(Date.now() - PRESENCE_STALE_THRESHOLD_MS);
    await DocumentSessionModel.update({ isActive: false }, {
        where: {
            isActive: true,
            lastSeenAt: { [Op.lt]: cutoff },
        },
    });
};
export const joinPresence = async (input) => {
    await deactivateStaleSessions();
    const activeSession = await DocumentSessionModel.findOne({
        where: {
            documentId: input.documentId,
            userId: input.userId,
            isActive: true,
        },
    });
    if (activeSession) {
        activeSession.status = input.status;
        activeSession.userName = input.userName ?? activeSession.userName;
        activeSession.deviceInfo = input.deviceInfo ?? activeSession.deviceInfo;
        activeSession.capabilities = input.capabilities ?? activeSession.capabilities;
        activeSession.lastSeenAt = new Date();
        await activeSession.save();
        logger.info({ sessionId: activeSession.id }, 'Updated existing presence session');
        await emitPresenceUpdate(input.documentId);
        return activeSession.get({ plain: true });
    }
    const session = await DocumentSessionModel.create({
        documentId: input.documentId,
        userId: input.userId,
        userName: input.userName,
        status: input.status,
        deviceInfo: input.deviceInfo,
        capabilities: input.capabilities,
        startedAt: new Date(),
        lastSeenAt: new Date(),
        isActive: true,
    });
    logger.info({ sessionId: session.id }, 'Presence session created');
    await emitPresenceUpdate(input.documentId);
    return session.get({ plain: true });
};
export const heartbeatPresence = async (input) => {
    const session = await DocumentSessionModel.findByPk(input.sessionId);
    if (!session || !session.isActive) {
        throw new NotFoundError('Presence session not found');
    }
    if (input.status) {
        session.status = input.status;
    }
    if (input.userName) {
        session.userName = input.userName;
    }
    if (input.deviceInfo) {
        session.deviceInfo = input.deviceInfo;
    }
    if (input.capabilities) {
        session.capabilities = input.capabilities;
    }
    session.lastSeenAt = new Date();
    await session.save();
    await emitPresenceUpdate(session.documentId);
    return session.get({ plain: true });
};
export const leavePresence = async (sessionId) => {
    const session = await DocumentSessionModel.findByPk(sessionId);
    if (!session || !session.isActive) {
        return null;
    }
    session.isActive = false;
    session.lastSeenAt = new Date();
    await session.save();
    await emitPresenceUpdate(session.documentId);
    logger.info({ sessionId }, 'Presence session closed');
    return session.get({ plain: true });
};
export const listActiveSessions = async (documentId) => {
    await deactivateStaleSessions();
    const cutoff = new Date(Date.now() - PRESENCE_STALE_THRESHOLD_MS);
    const sessions = await DocumentSessionModel.findAll({
        where: {
            documentId,
            isActive: true,
            lastSeenAt: { [Op.gte]: cutoff },
        },
        order: [['lastSeenAt', 'DESC']],
    });
    return sessions.map((session) => session.get({ plain: true }));
};
export const setPresenceStatus = async (documentId, userId, status) => {
    const session = await DocumentSessionModel.findOne({
        where: {
            documentId,
            userId,
            isActive: true,
        },
    });
    if (!session) {
        throw new NotFoundError('Presence session not found');
    }
    session.status = status;
    session.lastSeenAt = new Date();
    await session.save();
    await emitPresenceUpdate(documentId);
    return session.get({ plain: true });
};
