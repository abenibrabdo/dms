import { DataTypes, Model, type Optional } from 'sequelize';

import { sequelize } from '@core/database.js';

export interface UserAttributes {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department?: string | null;
  roles: string[];
  permissions: string[];
  isMfaEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserCreationAttributes = Optional<
  UserAttributes,
  'id' | 'roles' | 'permissions' | 'department' | 'isMfaEnabled' | 'createdAt' | 'updatedAt'
>;

export class UserModel extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: string;
  declare email: string;
  declare password: string;
  declare firstName: string;
  declare lastName: string;
  declare department: string | null;
  declare roles: string[];
  declare permissions: string[];
  declare isMfaEnabled: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(191),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(191),
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING(191),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(191),
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING(191),
      allowNull: true,
    },
    roles: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: ['user'],
    },
    permissions: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    isMfaEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'users',
    indexes: [
      {
        unique: true,
        fields: ['email'],
      },
    ],
  },
);

