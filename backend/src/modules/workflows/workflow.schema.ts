import Joi from 'joi';

export const createWorkflowSchema = Joi.object({
  name: Joi.string().required(),
  documentId: Joi.string().required(),
  initiator: Joi.string().required(),
  steps: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        assignees: Joi.array().items(Joi.string()).min(1).required(),
        dueDate: Joi.date().optional(),
      }),
    )
    .min(1)
    .required(),
});

export const advanceWorkflowSchema = Joi.object({
  action: Joi.string().valid('approve', 'reject', 'reassign').required(),
  comments: Joi.string().optional(),
  assignees: Joi.array().items(Joi.string()).optional(),
});

