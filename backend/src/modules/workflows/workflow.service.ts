import { NotFoundError } from '@core/errors.js';
import { logger } from '@core/logger.js';

import { RealtimeChannels } from '@core/events.js';
import { publishMessage } from '@core/queue.js';
import { broadcastEvent } from '@core/socket.js';
import { recordAuditLog } from '@modules/audit/audit.service.js';

import { WorkflowModel } from './workflow.model.js';
import type { AdvanceWorkflowInput, CreateWorkflowInput } from './workflow.types.js';

export const createWorkflow = async (input: CreateWorkflowInput) => {
  const workflow = await WorkflowModel.create({
    name: input.name,
    documentId: input.documentId,
    initiator: input.initiator,
    status: 'active',
    currentStep: 1,
    steps: input.steps.map((step, index) => ({
      stepNumber: index + 1,
      name: step.name,
      assignees: step.assignees,
      status: index === 0 ? 'in-progress' : 'pending',
      dueDate: step.dueDate ? new Date(step.dueDate) : undefined,
    })),
  });

  logger.info({ workflowId: workflow.id }, 'Workflow created');
  await recordAuditLog({
    entityType: 'workflow',
    entityId: workflow.id,
    action: 'workflow.created',
    performedBy: input.initiator,
    metadata: {
      documentId: input.documentId,
      steps: workflow.steps.length,
    },
  });
  await publishMessage({
    routingKey: 'workflows.created',
    payload: {
      workflowId: workflow.id,
      documentId: input.documentId,
    },
  });
  broadcastEvent(RealtimeChannels.WORKFLOW_UPDATED, {
    workflowId: workflow.id,
    event: 'created',
  });
  return workflow;
};

export const listWorkflows = async () => {
  return WorkflowModel.find().lean();
};

export const getWorkflow = async (workflowId: string) => {
  const workflow = await WorkflowModel.findById(workflowId);
  if (!workflow) {
    throw new NotFoundError('Workflow not found');
  }

  return workflow;
};

export const advanceWorkflow = async (
  workflowId: string,
  input: AdvanceWorkflowInput,
  performedBy: string,
) => {
  const workflow = await getWorkflow(workflowId);
  const currentStep = workflow.steps.find((step) => step.stepNumber === workflow.currentStep);

  if (!currentStep) {
    throw new NotFoundError('Current workflow step not found');
  }

  if (input.action === 'approve') {
    currentStep.status = 'approved';
    currentStep.completedAt = new Date();
    currentStep.comments = input.comments;

    const nextStep = workflow.steps.find((step) => step.stepNumber === workflow.currentStep + 1);
    if (nextStep) {
      workflow.currentStep += 1;
      nextStep.status = 'in-progress';
      workflow.status = 'active';
    } else {
      workflow.status = 'completed';
    }
  } else if (input.action === 'reject') {
    currentStep.status = 'rejected';
    currentStep.comments = input.comments;
    workflow.status = 'cancelled';
  } else if (input.action === 'reassign' && input.assignees?.length) {
    currentStep.assignees = input.assignees;
    currentStep.status = 'in-progress';
    currentStep.comments = input.comments;
  }

  await workflow.save();
  logger.info({ workflowId: workflow.id, action: input.action }, 'Workflow advanced');
  await recordAuditLog({
    entityType: 'workflow',
    entityId: workflow.id,
    action: `workflow.${input.action}`,
    performedBy,
    metadata: {
      step: workflow.currentStep,
      status: workflow.status,
    },
  });
  await publishMessage({
    routingKey: `workflows.${input.action}`,
    payload: {
      workflowId: workflow.id,
      documentId: workflow.documentId,
      status: workflow.status,
    },
  });
  broadcastEvent(RealtimeChannels.WORKFLOW_UPDATED, {
    workflowId: workflow.id,
    event: input.action,
    currentStep: workflow.currentStep,
    status: workflow.status,
  });

  return workflow;
};

