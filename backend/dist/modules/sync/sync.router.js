import { Router } from 'express';
import { authenticate } from '@middlewares/auth.js';
import { validate } from '@middlewares/validation.js';
import { getSyncSnapshotHandler } from './sync.controller.js';
import { syncQuerySchema } from './sync.schema.js';
const router = Router();
router.use(authenticate);
router.get('/', validate(syncQuerySchema, 'query'), getSyncSnapshotHandler);
export const syncRouter = router;
