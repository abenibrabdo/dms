import { Schema, model, type Document, type Model } from 'mongoose';

export interface WorkflowStep {
  stepNumber: number;
  name: string;
  assignees: string[];
  status: 'pending' | 'in-progress' | 'approved' | 'rejected';
  dueDate?: Date;
  completedAt?: Date;
  comments?: string;
}

export interface WorkflowInstance extends Document {
  name: string;
  documentId: string;
  initiator: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  steps: WorkflowStep[];
  currentStep: number;
  createdAt: Date;
  updatedAt: Date;
}

const StepSchema = new Schema<WorkflowStep>(
  {
    stepNumber: { type: Number, required: true },
    name: { type: String, required: true },
    assignees: { type: [String], default: [] },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'approved', 'rejected'],
      default: 'pending',
    },
    dueDate: { type: Date },
    completedAt: { type: Date },
    comments: { type: String },
  },
  { _id: false },
);

const WorkflowSchema = new Schema<WorkflowInstance>(
  {
    name: { type: String, required: true },
    documentId: { type: String, required: true },
    initiator: { type: String, required: true },
    status: {
      type: String,
      enum: ['draft', 'active', 'completed', 'cancelled'],
      default: 'draft',
    },
    steps: { type: [StepSchema], default: [] },
    currentStep: { type: Number, default: 1 },
  },
  { timestamps: true },
);

export const WorkflowModel: Model<WorkflowInstance> = model<WorkflowInstance>('Workflow', WorkflowSchema);

