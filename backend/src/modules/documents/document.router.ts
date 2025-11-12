import { Router } from 'express';

import { authenticate, authorize } from '@middlewares/auth.js';
import { validate } from '@middlewares/validation.js';
import { upload } from '@middlewares/upload.js';

import {
  addDocumentVersionHandler,
  createDocumentHandler,
  downloadDocumentHandler,
  downloadDocumentVersionHandler,
  getDocumentHandler,
  listDocumentsHandler,
  updateDocumentHandler,
  uploadDocumentHandler,
  uploadDocumentVersionHandler,
} from './document.controller.js';
import { addVersionSchema, createDocumentSchema, updateDocumentSchema } from './document.schema.js';

const router = Router();

router.use(authenticate);

router
  .route('/')
  .get(listDocumentsHandler)
  .post(authorize(['editor', 'admin']), validate(createDocumentSchema), createDocumentHandler);

router.post(
  '/upload',
  authorize(['editor', 'admin']),
  upload.single('file'),
  uploadDocumentHandler,
);

router
  .route('/:documentId')
  .get(getDocumentHandler)
  .patch(authorize(['editor', 'admin']), validate(updateDocumentSchema), updateDocumentHandler);

router.get('/:documentId/download', downloadDocumentHandler);

router.post(
  '/:documentId/versions',
  authorize(['editor', 'admin']),
  validate(addVersionSchema),
  addDocumentVersionHandler,
);

router.post(
  '/:documentId/versions/upload',
  authorize(['editor', 'admin']),
  upload.single('file'),
  uploadDocumentVersionHandler,
);

router.get(
  '/:documentId/versions/:versionNumber/download',
  downloadDocumentVersionHandler,
);

export const documentRouter = router;

