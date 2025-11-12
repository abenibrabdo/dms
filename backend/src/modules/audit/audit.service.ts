import { AuditLogModel } from './audit.model.js';

interface AuditLogInput {
  entityType: 'document' | 'workflow' | 'user' | 'notification' | 'system';
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
  const query: Record<string, unknown> = {};

  if (filters.entityType) {
    query.entityType = filters.entityType;
  }
  if (filters.entityId) {
    query.entityId = filters.entityId;
  }
  if (filters.performedBy) {
    query.performedBy = filters.performedBy;
  }

  const limit = filters.limit ?? 50;

  return AuditLogModel.find(query).sort({ createdAt: -1 }).limit(limit).lean();
};

