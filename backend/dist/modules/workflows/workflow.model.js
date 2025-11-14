import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@core/database.js';
export class WorkflowModel extends Model {
}
export class WorkflowStepModel extends Model {
}
WorkflowModel.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(191),
        allowNull: false,
    },
    documentId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    initiator: {
        type: DataTypes.STRING(191),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('draft', 'active', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'draft',
    },
    currentStep: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 1,
    },
}, {
    sequelize,
    tableName: 'workflows',
    timestamps: true,
});
WorkflowStepModel.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    workflowId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    stepNumber: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(191),
        allowNull: false,
    },
    assignees: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
    },
    status: {
        type: DataTypes.ENUM('pending', 'in-progress', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
    },
    dueDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    comments: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    sequelize,
    tableName: 'workflow_steps',
    timestamps: true,
    indexes: [
        { fields: ['workflowId', 'stepNumber'], unique: true },
        { fields: ['status'] },
    ],
});
WorkflowModel.hasMany(WorkflowStepModel, {
    as: 'steps',
    foreignKey: 'workflowId',
    sourceKey: 'id',
    onDelete: 'CASCADE',
});
WorkflowStepModel.belongsTo(WorkflowModel, {
    as: 'workflow',
    foreignKey: 'workflowId',
    targetKey: 'id',
});
