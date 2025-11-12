import { DataTypes, Model, type Optional } from 'sequelize';

import { sequelize } from '@core/database.js';

export type AuditEntityType = 'document' | 'workflow' | 'user' | 'notification' | 'system';

export interface AuditLogAttributes {
  id: string;
  entityType: AuditEntityType;
  entityId: string;
  action: string;
  performedBy: string;
  performedByName?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

export type AuditLogCreationAttributes = Optional<
  AuditLogAttributes,
  'id' | 'performedByName' | 'metadata' | 'createdAt' | 'updatedAt'
>;

export class AuditLogModel
  extends Model<AuditLogAttributes, AuditLogCreationAttributes>
  implements AuditLogAttributes
{
  declare id: string;
  declare entityType: AuditEntityType;
  declare entityId: string;
  declare action: string;
  declare performedBy: string;
  declare performedByName: string | null;
  declare metadata: Record<string, unknown> | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

AuditLogModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    entityType: {
      type: DataTypes.ENUM('document', 'workflow', 'user', 'notification', 'system'),
      allowNull: false,
    },
    entityId: {
      type: DataTypes.STRING(191),
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING(191),
      allowNull: false,
    },
    performedBy: {
      type: DataTypes.STRING(191),
      allowNull: false,
    },
    performedByName: {
      type: DataTypes.STRING(191),
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'audit_logs',
    timestamps: true,
    updatedAt: false,
    indexes: [
      { fields: ['entityType', 'entityId', 'createdAt'] },
      { fields: ['performedBy', 'createdAt'] },
      { fields: ['action'] },
    ],
  },
);

