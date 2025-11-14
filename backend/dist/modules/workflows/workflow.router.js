import { Router } from 'express';
import { authenticate, authorize } from '@middlewares/auth.js';
import { validate } from '@middlewares/validation.js';
import { advanceWorkflowHandler, createWorkflowHandler, getWorkflowHandler, listWorkflowsHandler, } from './workflow.controller.js';
import { advanceWorkflowSchema, createWorkflowSchema } from './workflow.schema.js';
const router = Router();
router.use(authenticate);
router
    .route('/')
    .get(listWorkflowsHandler)
    .post(authorize(['admin', 'workflow-manager']), validate(createWorkflowSchema), createWorkflowHandler);
router
    .route('/:workflowId')
    .get(getWorkflowHandler)
    .post(authorize(['admin', 'workflow-manager']), validate(advanceWorkflowSchema), advanceWorkflowHandler);
export const workflowRouter = router;
