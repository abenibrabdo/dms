import { DataTypes, Model } from 'sequelize';

import { sequelize } from '@core/database.js';

export type AccessControlType = 'allowedIp' | 'blockedIp' | 'allowedDevice';

export interface AccessControlAttributes {
  id: string;
  type: AccessControlType;
  value: string;
  createdBy?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class AccessControlModel extends Model<AccessControlAttributes> implements AccessControlAttributes {
  declare id: string;
  declare type: AccessControlType;
  declare value: string;
  declare createdBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

AccessControlModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING(191),
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'access_controls',
    indexes: [
      { fields: ['type', 'value'], unique: true },
    ],
  },
);

