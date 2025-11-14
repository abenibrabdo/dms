import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@core/database.js';
export class NotificationModel extends Model {
}
NotificationModel.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    recipient: {
        type: DataTypes.STRING(191),
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('task', 'workflow', 'system', 'reminder'),
        allowNull: false,
        defaultValue: 'system',
    },
    status: {
        type: DataTypes.ENUM('unread', 'read'),
        allowNull: false,
        defaultValue: 'unread',
    },
    metadata: {
        type: DataTypes.JSON,
        allowNull: true,
    },
}, {
    sequelize,
    tableName: 'notifications',
    timestamps: true,
    indexes: [
        { fields: ['recipient', 'status'] },
        { fields: ['createdAt'] },
    ],
});
