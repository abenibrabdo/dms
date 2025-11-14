import { NotFoundError } from '@core/errors.js';
import { logger } from '@core/logger.js';
import { sequelize } from '@core/database.js';
import { RealtimeChannels } from '@core/events.js';
import { publishMessage } from '@core/queue.js';
import { broadcastEvent } from '@core/socket.js';
import { recordAuditLog } from '@modules/audit/audit.service.js';
import { WorkflowModel, WorkflowStepModel } from './workflow.model.js';
const workflowInclude = [
    {
        model: WorkflowStepModel,
        as: 'steps',
    },
];
export const toWorkflowInstance = (workflow) => {
    const steps = (workflow.steps ?? []).map((step) => {
        const plain = step.get({ plain: true });
        return plain;
    });
    return {
        id: workflow.id,
        name: workflow.name,
        documentId: workflow.documentId,
        initiator: workflow.initiator,
        status: workflow.status,
        steps,
        currentStep: workflow.currentStep,
        createdAt: workflow.createdAt,
        updatedAt: workflow.updatedAt,
    };
};
export const createWorkflow = async (input) => {
    const workflowId = await sequelize.transaction(async (transaction) => {
        const workflow = await WorkflowModel.create({
            name: input.name,
            documentId: input.documentId,
            initiator: input.initiator,
            status: 'active',
            currentStep: 1,
        }, { transaction });
        if (input.steps.length > 0) {
            await WorkflowStepModel.bulkCreate(input.steps.map((step, index) => ({
                workflowId: workflow.id,
                stepNumber: index + 1,
                name: step.name,
                assignees: step.assignees,
                status: index === 0 ? 'in-progress' : 'pending',
                dueDate: step.dueDate ? new Date(step.dueDate) : null,
            })), { transaction });
        }
        logger.info({ workflowId: workflow.id }, 'Workflow created');
        return workflow.id;
    });
    const workflow = await getWorkflow(workflowId);
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
    const workflows = await WorkflowModel.findAll({
        include: workflowInclude,
        order: [
            ['createdAt', 'DESC'],
            [{ model: WorkflowStepModel, as: 'steps' }, 'stepNumber', 'ASC'],
        ],
    });
    return workflows.map(toWorkflowInstance);
};
export const getWorkflow = async (workflowId) => {
    const workflow = await WorkflowModel.findByPk(workflowId, {
        include: workflowInclude,
        order: [[{ model: WorkflowStepModel, as: 'steps' }, 'stepNumber', 'ASC']],
    });
    if (!workflow) {
        throw new NotFoundError('Workflow not found');
    }
    return toWorkflowInstance(workflow);
};
export const advanceWorkflow = async (workflowId, input, performedBy) => {
    await sequelize.transaction(async (transaction) => {
        const workflow = await WorkflowModel.findByPk(workflowId, {
            transaction,
            lock: transaction.LOCK.UPDATE,
        });
        if (!workflow) {
            throw new NotFoundError('Workflow not found');
        }
        const steps = await WorkflowStepModel.findAll({
            where: { workflowId },
            order: [['stepNumber', 'ASC']],
            transaction,
            lock: transaction.LOCK.UPDATE,
        });
        const currentStep = steps.find((step) => step.stepNumber === workflow.currentStep);
        if (!currentStep) {
            throw new NotFoundError('Current workflow step not found');
        }
        if (input.action === 'approve') {
            currentStep.status = 'approved';
            currentStep.completedAt = new Date();
            currentStep.comments = input.comments ?? null;
            const nextStep = steps.find((step) => step.stepNumber === workflow.currentStep + 1);
            if (nextStep) {
                workflow.currentStep += 1;
                workflow.status = 'active';
                nextStep.status = 'in-progress';
                await nextStep.save({ transaction });
            }
            else {
                workflow.status = 'completed';
            }
        }
        else if (input.action === 'reject') {
            currentStep.status = 'rejected';
            currentStep.comments = input.comments ?? null;
            currentStep.completedAt = new Date();
            workflow.status = 'cancelled';
        }
        else if (input.action === 'reassign' && input.assignees?.length) {
            currentStep.assignees = input.assignees;
            currentStep.status = 'in-progress';
            currentStep.comments = input.comments ?? null;
        }
        await currentStep.save({ transaction });
        await workflow.save({ transaction });
        logger.info({ workflowId: workflow.id, action: input.action }, 'Workflow advanced');
    });
    const workflow = await getWorkflow(workflowId);
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
