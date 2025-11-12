import Joi from 'joi';

export const createCommentSchema = Joi.object({
  message: Joi.string().min(1).required(),
  mentions: Joi.array().items(Joi.string()).default([]),
  authorName: Joi.string().optional(),
});

export const lockDocumentSchema = Joi.object({
  force: Joi.boolean().default(false),
});

const presenceStatus = Joi.string().valid('viewing', 'editing', 'idle');

export const joinPresenceSchema = Joi.object({
  status: presenceStatus.required(),
  userName: Joi.string().allow('', null),
  deviceInfo: Joi.object().optional(),
  capabilities: Joi.array().items(Joi.string()).default([]),
});

export const heartbeatPresenceSchema = Joi.object({
  status: presenceStatus.optional(),
  userName: Joi.string().allow('', null),
  deviceInfo: Joi.object().optional(),
  capabilities: Joi.array().items(Joi.string()).optional(),
});

export const updatePresenceStatusSchema = Joi.object({
  status: presenceStatus.required(),
});


