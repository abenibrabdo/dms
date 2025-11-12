import { DataTypes, Model, type Optional } from 'sequelize';

import { sequelize } from '@core/database.js';

export type PresenceStatus = 'viewing' | 'editing' | 'idle';

export interface DocumentSessionAttributes {
  id: string;
  documentId: string;
  userId: string;
  userName?: string | null;
  status: PresenceStatus;
  deviceInfo?: Record<string, unknown> | null;
  capabilities?: string[] | null;
  startedAt: Date;
  lastSeenAt: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type DocumentSessionCreationAttributes = Optional<
  DocumentSessionAttributes,
  'id' | 'userName' | 'deviceInfo' | 'capabilities' | 'startedAt' | 'lastSeenAt' | 'isActive' | 'createdAt' | 'updatedAt'
>;

export class DocumentSessionModel
  extends Model<DocumentSessionAttributes, DocumentSessionCreationAttributes>
  implements DocumentSessionAttributes
{
  declare id: string;
  declare documentId: string;
  declare userId: string;
  declare userName: string | null;
  declare status: PresenceStatus;
  declare deviceInfo: Record<string, unknown> | null;
  declare capabilities: string[] | null;
  declare startedAt: Date;
  declare lastSeenAt: Date;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

DocumentSessionModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    documentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    userName: {
      type: DataTypes.STRING(191),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('viewing', 'editing', 'idle'),
      allowNull: false,
      defaultValue: 'viewing',
    },
    deviceInfo: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    capabilities: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    startedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    lastSeenAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'document_sessions',
    timestamps: true,
    indexes: [
      { fields: ['documentId'] },
      { fields: ['userId'] },
      { fields: ['documentId', 'userId', 'isActive'] },
    ],
  },
);


