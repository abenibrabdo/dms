import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@core/database.js';
export class CommentModel extends Model {
}
CommentModel.init({
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
}, {
    sequelize,
    tableName: 'comments',
    timestamps: true,
    indexes: [{ fields: ['documentId', 'createdAt'] }],
});
