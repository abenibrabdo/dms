import { heartbeatPresence, joinPresence, leavePresence, listActiveSessions, setPresenceStatus, } from './presence.service.js';
export const listPresenceHandler = async (req, res) => {
    const sessions = await listActiveSessions(req.params.documentId);
    res.status(200).json({
        success: true,
        data: sessions,
    });
};
export const joinPresenceHandler = async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new Error('Authenticated user is required');
    }
    const payload = await joinPresence({
        documentId: req.params.documentId,
        userId: user.id,
        userName: req.body.userName ?? `${user.id}`,
        status: req.body.status,
        deviceInfo: req.body.deviceInfo,
        capabilities: req.body.capabilities,
    });
    res.status(201).json({
        success: true,
        data: payload,
    });
};
export const heartbeatPresenceHandler = async (req, res) => {
    const session = await heartbeatPresence({
        sessionId: req.params.sessionId,
        status: req.body.status,
        userName: req.body.userName,
        deviceInfo: req.body.deviceInfo,
        capabilities: req.body.capabilities,
    });
    res.status(200).json({
        success: true,
        data: session,
    });
};
export const leavePresenceHandler = async (req, res) => {
    const session = await leavePresence(req.params.sessionId);
    res.status(200).json({
        success: true,
        data: session,
    });
};
export const setPresenceStatusHandler = async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new Error('Authenticated user is required');
    }
    const session = await setPresenceStatus(req.params.documentId, user.id, req.body.status);
    res.status(200).json({
        success: true,
        data: session,
    });
};
