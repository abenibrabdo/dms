import Joi from 'joi';
export const createNotificationSchema = Joi.object({
    recipient: Joi.string().required(),
    title: Joi.string().required(),
    message: Joi.string().required(),
    type: Joi.string().valid('task', 'workflow', 'system', 'reminder').default('system'),
    metadata: Joi.object().optional(),
});
