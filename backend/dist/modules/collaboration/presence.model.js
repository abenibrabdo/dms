import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@core/database.js';
export class DocumentSessionModel extends Model {
}
DocumentSessionModel.init({
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
}, {
    sequelize,
    tableName: 'document_sessions',
    timestamps: true,
    indexes: [
        { fields: ['documentId'] },
        { fields: ['userId'] },
        { fields: ['documentId', 'userId', 'isActive'] },
    ],
});
