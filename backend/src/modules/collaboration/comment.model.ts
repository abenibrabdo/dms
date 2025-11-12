import { DataTypes, Model, type Optional } from 'sequelize';

import { sequelize } from '@core/database.js';

export interface CommentAttributes {
  id: string;
  documentId: string;
  authorId: string;
  authorName: string;
  message: string;
  mentions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type CommentCreationAttributes = Optional<
  CommentAttributes,
  'id' | 'mentions' | 'createdAt' | 'updatedAt'
>;

export class CommentModel extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
  declare id: string;
  declare documentId: string;
  declare authorId: string;
  declare authorName: string;
  declare message: string;
  declare mentions: string[];
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

CommentModel.init(
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
    authorId: {
      type: DataTypes.STRING(191),
      allowNull: false,
    },
    authorName: {
      type: DataTypes.STRING(191),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    mentions: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    sequelize,
    tableName: 'comments',
    timestamps: true,
    indexes: [{ fields: ['documentId', 'createdAt'] }],
  },
);

