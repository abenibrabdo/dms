import type { Response } from 'express';

import type { AuthenticatedRequest } from '@middlewares/auth.js';

import {
  bulkUpsertLocalizationResources,
  deleteLocalizationResource,
  getLocalizationResources,
} from './localization.service.js';
import type { LocalizationPayload } from './localization.types.js';

export const getLocalizationResourcesHandler = async (req: AuthenticatedRequest, res: Response) => {
  const result = await getLocalizationResources({
    language: req.query.lang?.toString(),
    namespace: req.query.namespace?.toString(),
  });

  res.status(200).json({
    success: true,
    data: result,
  });
};

export const upsertLocalizationResourcesHandler = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const payload = req.body as LocalizationPayload[];
  const resources = await bulkUpsertLocalizationResources(payload, userId);

  res.status(200).json({
    success: true,
    data: resources,
  });
};

export const deleteLocalizationResourceHandler = async (req: AuthenticatedRequest, res: Response) => {
  const { namespace, key, language } = req.params;
  await deleteLocalizationResource(namespace, key, language);

  res.status(204).send();
};


