import { Router } from 'express';

import { authenticate } from '@middlewares/auth.js';
import { validate } from '@middlewares/validation.js';

import {
  addCommentHandler,
  listCommentsHandler,
  lockDocumentHandler,
  unlockDocumentHandler,
} from './collaboration.controller.js';
import { createCommentSchema, lockDocumentSchema } from './collaboration.schema.js';

const router = Router({ mergeParams: true });

router.use(authenticate);

router
  .route('/:documentId/comments')
  .get(listCommentsHandler)
  .post(validate(createCommentSchema), addCommentHandler);

router.post('/:documentId/lock', validate(lockDocumentSchema, 'body'), lockDocumentHandler);
router.post('/:documentId/unlock', unlockDocumentHandler);

export const collaborationRouter = router;

