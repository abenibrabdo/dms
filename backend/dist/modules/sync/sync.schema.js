import Joi from 'joi';
export const syncQuerySchema = Joi.object({
    since: Joi.date().iso().optional(),
    limit: Joi.number().integer().min(1).max(1000).optional(),
    topics: Joi.string().pattern(/^(documents|workflows|notifications|comments)(,(documents|workflows|notifications|comments))*$/),
});
