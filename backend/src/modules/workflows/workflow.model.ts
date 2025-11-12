import { DataTypes, Model, type Optional } from 'sequelize';

import { sequelize } from '@core/database.js';

export type WorkflowStatus = 'draft' | 'active' | 'completed' | 'cancelled';
export type WorkflowStepStatus = 'pending' | 'in-progress' | 'approved' | 'rejected';

export interface WorkflowAttributes {
  id: string;
  name: string;
  documentId: string;
  initiator: string;
  status: WorkflowStatus;
  currentStep: number;
  createdAt: Date;
  updatedAt: Date;
}

export type WorkflowCreationAttributes = Optional<
  WorkflowAttributes,
  'id' | 'status' | 'currentStep' | 'createdAt' | 'updatedAt'
>;

export interface WorkflowStepAttributes {
  id: string;
  workflowId: string;
  stepNumber: number;
  name: string;
  assignees: string[];
  status: WorkflowStepStatus;
  dueDate?: Date | null;
  completedAt?: Date | null;
  comments?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type WorkflowStepCreationAttributes = Optional<
  WorkflowStepAttributes,
  'id' | 'status' | 'dueDate' | 'completedAt' | 'comments' | 'createdAt' | 'updatedAt'
>;

export class WorkflowModel
  extends Model<WorkflowAttributes, WorkflowCreationAttributes>
  implements WorkflowAttributes
{
  declare id: string;
  declare name: string;
  declare documentId: string;
  declare initiator: string;
  declare status: WorkflowStatus;
  declare currentStep: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare steps?: WorkflowStepModel[];
}

export class WorkflowStepModel
  extends Model<WorkflowStepAttributes, WorkflowStepCreationAttributes>
  implements WorkflowStepAttributes
{
  declare id: string;
  declare workflowId: string;
  declare stepNumber: number;
  declare name: string;
  declare assignees: string[];
  declare status: WorkflowStepStatus;
  declare dueDate: Date | null;
  declare completedAt: Date | null;
  declare comments: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare workflow?: WorkflowModel;
}

WorkflowModel.init(
  {
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
  },
  {
    sequelize,
    tableName: 'workflows',
    timestamps: true,
  },
);

WorkflowStepModel.init(
  {
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
  },
  {
    sequelize,
    tableName: 'workflow_steps',
    timestamps: true,
    indexes: [
      { fields: ['workflowId', 'stepNumber'], unique: true },
      { fields: ['status'] },
    ],
  },
);

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

export interface WorkflowStep extends Omit<WorkflowStepAttributes, 'workflowId' | 'createdAt' | 'updatedAt'> {
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowInstance {
  id: string;
  name: string;
  documentId: string;
  initiator: string;
  status: WorkflowStatus;
  steps: WorkflowStep[];
  currentStep: number;
  createdAt: Date;
  updatedAt: Date;
}

