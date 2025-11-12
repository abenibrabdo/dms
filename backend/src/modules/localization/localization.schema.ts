import Joi from 'joi';

import { env } from '@config/index.js';

const languageSchema = Joi.string()
  .valid(...env.localization.supportedLocales)
  .required();

const resourceSchema = Joi.object({
  namespace: Joi.string().default('common'),
  key: Joi.string().required(),
  language: languageSchema,
  value: Joi.string().required(),
  description: Joi.string().allow('', null),
});

export const getLocalizationResourcesSchema = Joi.object({
  lang: Joi.string()
    .valid(...env.localization.supportedLocales)
    .optional(),
  namespace: Joi.string().optional(),
});

export const upsertLocalizationResourcesSchema = Joi.array().items(resourceSchema).min(1);


