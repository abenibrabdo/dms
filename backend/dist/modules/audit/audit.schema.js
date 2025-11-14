import Joi from 'joi';
export const listAuditLogsSchema = Joi.object({
    entityType: Joi.string().valid('document', 'workflow', 'user', 'notification', 'system').optional(),
    entityId: Joi.string().optional(),
    performedBy: Joi.string().optional(),
    limit: Joi.number().integer().min(1).max(200).default(50),
});
