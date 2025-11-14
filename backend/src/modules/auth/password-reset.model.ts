import { DataTypes, Model } from 'sequelize';

import { sequelize } from '@core/database.js';

export interface PasswordResetAttributes {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class PasswordResetModel extends Model<PasswordResetAttributes> implements PasswordResetAttributes {
  declare id: string;
  declare userId: string;
  declare token: string;
  declare expiresAt: Date;
  declare used: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

PasswordResetModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING(191),
      allowNull: false,
      unique: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    used: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'password_resets',
    indexes: [
      { fields: ['token'], unique: true },
      { fields: ['userId'] },
    ],
  },
);

