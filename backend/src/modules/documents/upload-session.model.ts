import { DataTypes, Model } from 'sequelize';

import { sequelize } from '@core/database.js';

export interface UploadSessionAttributes {
  id: string;
  title: string;
  type: string;
  category?: string | null;
  owner: string;
  department?: string | null;
  tags: string[];
  status: 'draft' | 'in-review' | 'approved' | 'archived';
  filename: string;
  mimeType?: string | null;
  totalSize: number;
  chunkSize: number;
  receivedChunks: number[];
  checksum?: string | null;
  tempDir: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UploadSessionModel extends Model<UploadSessionAttributes> implements UploadSessionAttributes {
  declare id: string;
  declare title: string;
  declare type: string;
  declare category: string | null;
  declare owner: string;
  declare department: string | null;
  declare tags: string[];
  declare status: 'draft' | 'in-review' | 'approved' | 'archived';
  declare filename: string;
  declare mimeType: string | null;
  declare totalSize: number;
  declare chunkSize: number;
  declare receivedChunks: number[];
  declare checksum: string | null;
  declare tempDir: string;
  declare createdBy: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

UploadSessionModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: { type: DataTypes.STRING(191), allowNull: false },
    type: { type: DataTypes.STRING(191), allowNull: false },
    category: { type: DataTypes.STRING(191), allowNull: true },
    owner: { type: DataTypes.STRING(191), allowNull: false },
    department: { type: DataTypes.STRING(191), allowNull: true },
    tags: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: 'draft' },
    filename: { type: DataTypes.STRING(191), allowNull: false },
    mimeType: { type: DataTypes.STRING(191), allowNull: true },
    totalSize: { type: DataTypes.INTEGER, allowNull: false },
    chunkSize: { type: DataTypes.INTEGER, allowNull: false },
    receivedChunks: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
    checksum: { type: DataTypes.STRING(191), allowNull: true },
    tempDir: { type: DataTypes.STRING(191), allowNull: false },
    createdBy: { type: DataTypes.STRING(191), allowNull: false },
  },
  {
    sequelize,
    tableName: 'upload_sessions',
    indexes: [{ fields: ['owner'] }],
  },
);

