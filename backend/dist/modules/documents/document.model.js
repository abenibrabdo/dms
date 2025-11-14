import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@core/database.js';
export class DocumentModel extends Model {
}
export class DocumentVersionModel extends Model {
}
DocumentModel.init({
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
}, {
    sequelize,
    tableName: 'documents',
    timestamps: true,
    indexes: [
        { fields: ['title'] },
        { fields: ['owner'] },
        { fields: ['status'] },
    ],
});
DocumentVersionModel.init({
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
}, {
    sequelize,
    tableName: 'document_versions',
    timestamps: true,
    indexes: [
        { fields: ['documentId', 'versionNumber'], unique: true },
        { fields: ['createdBy'] },
    ],
});
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
