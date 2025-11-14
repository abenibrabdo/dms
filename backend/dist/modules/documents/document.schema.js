import Joi from 'joi';
export const createDocumentSchema = Joi.object({
    title: Joi.string().required(),
    type: Joi.string().required(),
    category: Joi.string().optional(),
    owner: Joi.string().required(),
    department: Joi.string().optional(),
    tags: Joi.array().items(Joi.string()).default([]),
    status: Joi.string()
        .valid('draft', 'in-review', 'approved', 'archived')
        .default('draft'),
    filename: Joi.string().required(),
    storageKey: Joi.string().required(),
    size: Joi.number().optional(),
    checksum: Joi.string().optional(),
    mimeType: Joi.string().optional(),
});
export const updateDocumentSchema = Joi.object({
    title: Joi.string().optional(),
    category: Joi.string().optional(),
    department: Joi.string().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    status: Joi.string().valid('draft', 'in-review', 'approved', 'archived').optional(),
});
export const addVersionSchema = Joi.object({
    filename: Joi.string().required(),
    storageKey: Joi.string().required(),
    checksum: Joi.string().optional(),
    size: Joi.number().optional(),
    mimeType: Joi.string().optional(),
});
