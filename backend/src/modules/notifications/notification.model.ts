import { DataTypes, Model, type Optional } from 'sequelize';

import { sequelize } from '@core/database.js';

export type NotificationType = 'task' | 'workflow' | 'system' | 'reminder';
export type NotificationStatus = 'unread' | 'read';

export interface NotificationAttributes {
  id: string;
  recipient: string;
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  metadata?: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

export type NotificationCreationAttributes = Optional<
  NotificationAttributes,
  'id' | 'status' | 'metadata' | 'createdAt' | 'updatedAt'
>;

export class NotificationModel
  extends Model<NotificationAttributes, NotificationCreationAttributes>
  implements NotificationAttributes
{
  declare id: string;
  declare recipient: string;
  declare title: string;
  declare message: string;
  declare type: NotificationType;
  declare status: NotificationStatus;
  declare metadata: Record<string, unknown> | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

NotificationModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    recipient: {
      type: DataTypes.STRING(191),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('task', 'workflow', 'system', 'reminder'),
      allowNull: false,
      defaultValue: 'system',
    },
    status: {
      type: DataTypes.ENUM('unread', 'read'),
      allowNull: false,
      defaultValue: 'unread',
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'notifications',
    timestamps: true,
    indexes: [
      { fields: ['recipient', 'status'] },
      { fields: ['createdAt'] },
    ],
  },
);

