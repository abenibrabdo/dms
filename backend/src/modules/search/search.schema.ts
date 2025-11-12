import Joi from 'joi';

export const searchSchema = Joi.object({
  q: Joi.string().allow('').default(''),
  owner: Joi.string().optional(),
  type: Joi.string().optional(),
  status: Joi.string().valid('draft', 'in-review', 'approved', 'archived').optional(),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

