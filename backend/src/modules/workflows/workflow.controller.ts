import type { Response } from 'express';

import type { AuthenticatedRequest } from '@middlewares/auth.js';

import { advanceWorkflow, createWorkflow, getWorkflow, listWorkflows } from './workflow.service.js';
import type { CreateWorkflowInput } from './workflow.types.js';

export const createWorkflowHandler = async (req: AuthenticatedRequest, res: Response) => {
  const payload = req.body as CreateWorkflowInput;
  const workflow = await createWorkflow(payload);

  res.status(201).json({
    success: true,
    data: workflow,
  });
};

export const listWorkflowsHandler = async (_req: AuthenticatedRequest, res: Response) => {
  const workflows = await listWorkflows();
  res.status(200).json({
    success: true,
    data: workflows,
  });
};

export const getWorkflowHandler = async (req: AuthenticatedRequest, res: Response) => {
  const { workflowId } = req.params;
  const workflow = await getWorkflow(workflowId);
  res.status(200).json({
    success: true,
    data: workflow,
  });
};

export const advanceWorkflowHandler = async (req: AuthenticatedRequest, res: Response) => {
  const { workflowId } = req.params;
  const workflow = await advanceWorkflow(workflowId, {
    workflowId,
    ...req.body,
  }, req.user?.id ?? 'system');

  res.status(200).json({
    success: true,
    data: workflow,
  });
};

