import { Router } from 'express';

import { authenticate } from '@middlewares/auth.js';
import { validate } from '@middlewares/validation.js';

import { searchDocumentsHandler } from './search.controller.js';
import { searchSchema } from './search.schema.js';

const router = Router();

router.use(authenticate);

router.get('/documents', validate(searchSchema, 'query'), searchDocumentsHandler);

export const searchRouter = router;

