import Joi from 'joi';

export const createCommentSchema = Joi.object({
  message: Joi.string().min(1).required(),
  mentions: Joi.array().items(Joi.string()).default([]),
  authorName: Joi.string().optional(),
});

export const lockDocumentSchema = Joi.object({
  force: Joi.boolean().default(false),
});

