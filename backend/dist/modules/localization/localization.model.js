import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@core/database.js';
export class LocalizationResourceModel extends Model {
}
LocalizationResourceModel.init({
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
}, {
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
});
