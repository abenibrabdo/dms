import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@core/database.js';
export class AuditLogModel extends Model {
}
AuditLogModel.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    entityType: {
        type: DataTypes.ENUM('document', 'workflow', 'user', 'notification', 'system'),
        allowNull: false,
    },
    entityId: {
        type: DataTypes.STRING(191),
        allowNull: false,
    },
    action: {
        type: DataTypes.STRING(191),
        allowNull: false,
    },
    performedBy: {
        type: DataTypes.STRING(191),
        allowNull: false,
    },
    performedByName: {
        type: DataTypes.STRING(191),
        allowNull: true,
    },
    metadata: {
        type: DataTypes.JSON,
        allowNull: true,
    },
}, {
    sequelize,
    tableName: 'audit_logs',
    timestamps: true,
    updatedAt: false,
    indexes: [
        { fields: ['entityType', 'entityId', 'createdAt'] },
        { fields: ['performedBy', 'createdAt'] },
        { fields: ['action'] },
    ],
});
