import { Schema, model, type Document, type Model } from 'mongoose';

export interface AuditLogDocument extends Document {
  entityType: 'document' | 'workflow' | 'user' | 'notification' | 'system';
  entityId: string;
  action: string;
  performedBy: string;
  performedByName?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const AuditLogSchema = new Schema<AuditLogDocument>(
  {
    entityType: {
      type: String,
      enum: ['document', 'workflow', 'user', 'notification', 'system'],
      required: true,
    },
    entityId: { type: String, required: true, index: true },
    action: { type: String, required: true, index: true },
    performedBy: { type: String, required: true },
    performedByName: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

AuditLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });
AuditLogSchema.index({ performedBy: 1, createdAt: -1 });

export const AuditLogModel: Model<AuditLogDocument> = model<AuditLogDocument>('AuditLog', AuditLogSchema);

