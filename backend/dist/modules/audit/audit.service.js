export const recordAuditLog = async (input) => {
    return AuditLogModel.create({
        entityType: input.entityType,
        entityId: input.entityId,
        action: input.action,
        performedBy: input.performedBy,
        performedByName: input.performedByName,
        metadata: input.metadata,
    });
};
export const listAuditLogs = async (filters) => {
    const where = {};
    if (filters.entityType) {
        Object.assign(where, { entityType: filters.entityType });
    }
    if (filters.entityId) {
        Object.assign(where, { entityId: filters.entityId });
    }
    if (filters.performedBy) {
        Object.assign(where, { performedBy: filters.performedBy });
    }
    const limit = filters.limit ?? 50;
    const logs = await AuditLogModel.findAll({
        where,
        order: [['createdAt', 'DESC']],
        limit,
    });
    return logs.map((log) => log.get({ plain: true }));
};
import { AuditLogModel } from './audit.model.js';
