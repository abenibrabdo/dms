import { Router } from 'express';

import { authenticate } from '@middlewares/auth.js';
import { validate } from '@middlewares/validation.js';

import {
  addCommentHandler,
  listCommentsHandler,
  lockDocumentHandler,
  unlockDocumentHandler,
} from './collaboration.controller.js';
import {
  createCommentSchema,
  lockDocumentSchema,
  joinPresenceSchema,
  heartbeatPresenceSchema,
  updatePresenceStatusSchema,
} from './collaboration.schema.js';
import {
  listPresenceHandler,
  joinPresenceHandler,
  heartbeatPresenceHandler,
  leavePresenceHandler,
  setPresenceStatusHandler,
} from './presence.controller.js';

const router = Router({ mergeParams: true });

router.use(authenticate);

router
  .route('/:documentId/comments')
  .get(listCommentsHandler)
  .post(validate(createCommentSchema), addCommentHandler);

router.post('/:documentId/lock', validate(lockDocumentSchema, 'body'), lockDocumentHandler);
router.post('/:documentId/unlock', unlockDocumentHandler);

router
  .route('/:documentId/presence')
  .get(listPresenceHandler)
  .post(validate(joinPresenceSchema, 'body'), joinPresenceHandler);

router.patch(
  '/:documentId/presence/status',
  validate(updatePresenceStatusSchema, 'body'),
  setPresenceStatusHandler,
);

router
  .route('/:documentId/presence/:sessionId')
  .patch(validate(heartbeatPresenceSchema, 'body'), heartbeatPresenceHandler)
  .delete(leavePresenceHandler);

export const collaborationRouter = router;

