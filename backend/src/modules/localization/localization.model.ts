import { DataTypes, Model, type Optional } from 'sequelize';

import { sequelize } from '@core/database.js';

export interface LocalizationResourceAttributes {
  id: string;
  namespace: string;
  key: string;
  language: string;
  value: string;
  description?: string | null;
  updatedBy?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type LocalizationResourceCreationAttributes = Optional<
  LocalizationResourceAttributes,
  'id' | 'description' | 'updatedBy' | 'createdAt' | 'updatedAt'
>;

export class LocalizationResourceModel
  extends Model<LocalizationResourceAttributes, LocalizationResourceCreationAttributes>
  implements LocalizationResourceAttributes
{
  declare id: string;
  declare namespace: string;
  declare key: string;
  declare language: string;
  declare value: string;
  declare description: string | null;
  declare updatedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

LocalizationResourceModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    namespace: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'common',
    },
    key: {
      type: DataTypes.STRING(191),
      allowNull: false,
    },
    language: {
      type: DataTypes.STRING(8),
      allowNull: false,
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    updatedBy: {
      type: DataTypes.STRING(191),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'localization_resources',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['namespace', 'key', 'language'],
      },
      {
        fields: ['language'],
      },
    ],
  },
);


