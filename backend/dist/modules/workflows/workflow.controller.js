import { advanceWorkflow, createWorkflow, getWorkflow, listWorkflows } from './workflow.service.js';
export const createWorkflowHandler = async (req, res) => {
    const payload = req.body;
    const workflow = await createWorkflow(payload);
    res.status(201).json({
        success: true,
        data: workflow,
    });
};
export const listWorkflowsHandler = async (_req, res) => {
    const workflows = await listWorkflows();
    res.status(200).json({
        success: true,
        data: workflows,
    });
};
export const getWorkflowHandler = async (req, res) => {
    const { workflowId } = req.params;
    const workflow = await getWorkflow(workflowId);
    res.status(200).json({
        success: true,
        data: workflow,
    });
};
export const advanceWorkflowHandler = async (req, res) => {
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
