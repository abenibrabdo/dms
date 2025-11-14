import { DataTypes, Model, type Optional } from 'sequelize';

import { sequelize } from '@core/database.js';

export interface DocumentMetadata {
  title: string;
  type: string;
  category?: string | null;
  owner: string;
  department?: string | null;
  tags: string[];
  status: 'draft' | 'in-review' | 'approved' | 'archived';
}

export interface DocumentAttributes {
  id: string;
  title: string;
  type: string;
  category?: string | null;
  owner: string;
  department?: string | null;
  tags: string[];
  status: 'draft' | 'in-review' | 'approved' | 'archived';
  currentVersion: number;
  isLocked: boolean;
  lockOwner?: string | null;
  favoriteBy: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type DocumentCreationAttributes = Optional<
  DocumentAttributes,
  | 'id'
  | 'category'
  | 'department'
  | 'tags'
  | 'status'
  | 'currentVersion'
  | 'isLocked'
  | 'lockOwner'
  | 'favoriteBy'
  | 'createdAt'
  | 'updatedAt'
>;

export interface DocumentVersionAttributes {
  id: string;
  documentId: string;
  versionNumber: number;
  filename: string;
  storageKey: string;
  fileUrl: string;
  mimeType?: string | null;
  createdBy: string;
  checksum?: string | null;
  size?: number | null;
  contentText?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type DocumentVersionCreationAttributes = Optional<
  DocumentVersionAttributes,
  'id' | 'mimeType' | 'checksum' | 'size' | 'contentText' | 'createdAt' | 'updatedAt'
>;

export class DocumentModel
  extends Model<DocumentAttributes, DocumentCreationAttributes>
  implements DocumentAttributes
{
  declare id: string;
  declare title: string;
  declare type: string;
  declare category: string | null;
  declare owner: string;
  declare department: string | null;
  declare tags: string[];
  declare status: 'draft' | 'in-review' | 'approved' | 'archived';
  declare currentVersion: number;
  declare isLocked: boolean;
  declare lockOwner: string | null;
  declare favoriteBy: string[];
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare versions?: DocumentVersionModel[];
}

export class DocumentVersionModel
  extends Model<DocumentVersionAttributes, DocumentVersionCreationAttributes>
  implements DocumentVersionAttributes
{
  declare id: string;
  declare documentId: string;
  declare versionNumber: number;
  declare filename: string;
  declare storageKey: string;
  declare fileUrl: string;
  declare mimeType: string | null;
  declare createdBy: string;
  declare checksum: string | null;
  declare size: number | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare document?: DocumentModel;
}

DocumentModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    owner: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    status: {
      type: DataTypes.ENUM('draft', 'in-review', 'approved', 'archived'),
      allowNull: false,
      defaultValue: 'draft',
    },
    currentVersion: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    isLocked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    lockOwner: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    favoriteBy: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    sequelize,
    tableName: 'documents',
    timestamps: true,
    indexes: [
      { fields: ['title'] },
      { fields: ['owner'] },
      { fields: ['status'] },
    ],
  },
);

DocumentVersionModel.init(
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
    versionNumber: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    filename: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    storageKey: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    fileUrl: {
      type: DataTypes.STRING(512),
      allowNull: false,
    },
    mimeType: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    checksum: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    size: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    contentText: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'document_versions',
    timestamps: true,
    indexes: [
      { fields: ['documentId', 'versionNumber'], unique: true },
      { fields: ['createdBy'] },
    ],
  },
);

DocumentModel.hasMany(DocumentVersionModel, {
  as: 'versions',
  foreignKey: 'documentId',
  sourceKey: 'id',
  onDelete: 'CASCADE',
});

DocumentVersionModel.belongsTo(DocumentModel, {
  as: 'document',
  foreignKey: 'documentId',
  targetKey: 'id',
});

export interface ManagedDocument {
  id: string;
  metadata: DocumentMetadata;
  versions: DocumentVersionAttributes[];
  currentVersion: number;
  isLocked: boolean;
  lockOwner?: string | null;
  favoriteBy: string[];
  createdAt: Date;
  updatedAt: Date;
}


