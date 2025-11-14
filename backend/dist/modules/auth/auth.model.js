import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@core/database.js';
export class UserModel extends Model {
}
UserModel.init({
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
}, {
    sequelize,
    tableName: 'users',
    indexes: [
        {
            unique: true,
            fields: ['email'],
        },
    ],
});
