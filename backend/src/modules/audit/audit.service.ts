interface AuditLogInput {
  entityType: AuditEntityType;
  entityId: string;
  action: string;
  performedBy: string;
  performedByName?: string;
  metadata?: Record<string, unknown>;
}

interface AuditFilters {
  entityType?: string;
  entityId?: string;
  performedBy?: string;
  limit?: number;
}

export const recordAuditLog = async (input: AuditLogInput) => {
  return AuditLogModel.create({
    entityType: input.entityType,
    entityId: input.entityId,
    action: input.action,
    performedBy: input.performedBy,
    performedByName: input.performedByName,
    metadata: input.metadata,
  });
};

export const listAuditLogs = async (filters: AuditFilters) => {
  const where: WhereOptions = {};

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

import type { WhereOptions } from 'sequelize';

import { AuditLogModel, type AuditEntityType } from './audit.model.js';

