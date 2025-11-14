import { Router } from 'express';
import { authenticate, authorize } from '@middlewares/auth.js';
import { validate } from '@middlewares/validation.js';
import { listAuditLogsHandler } from './audit.controller.js';
import { listAuditLogsSchema } from './audit.schema.js';
const router = Router();
router.use(authenticate, authorize(['admin', 'auditor']));
router.get('/', validate(listAuditLogsSchema, 'query'), listAuditLogsHandler);
export const auditRouter = router;
