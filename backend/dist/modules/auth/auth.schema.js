import Joi from 'joi';
export const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    department: Joi.string().optional(),
    roles: Joi.array().items(Joi.string()).optional(),
    permissions: Joi.array().items(Joi.string()).optional(),
});
export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});
