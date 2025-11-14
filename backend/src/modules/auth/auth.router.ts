import { Router } from 'express';

import { authenticate, authorize } from '@middlewares/auth.js';
import { validate } from '@middlewares/validation.js';

import { loginSchema, registerSchema, mfaSetupSchema, mfaVerifySchema, mfaDisableSchema, requestPasswordResetSchema, confirmPasswordResetSchema, accessControlsSchema } from './auth.schema.js';
import { listUsersHandler, loginHandler, registerHandler, mfaSetupHandler, mfaVerifyHandler, mfaDisableHandler, requestPasswordResetHandler, confirmPasswordResetHandler, getAccessControlsHandler, updateAccessControlsHandler } from './auth.controller.js';

const router = Router();

router.post('/register', authenticate, authorize(['admin']), validate(registerSchema), registerHandler);
router.post('/login', validate(loginSchema), loginHandler);
router.get('/', authenticate, authorize(['admin']), listUsersHandler);
router.post('/mfa/setup', authenticate, validate(mfaSetupSchema), mfaSetupHandler);
router.post('/mfa/verify', authenticate, validate(mfaVerifySchema), mfaVerifyHandler);
router.post('/mfa/disable', authenticate, validate(mfaDisableSchema), mfaDisableHandler);
router.post('/reset/request', validate(requestPasswordResetSchema), requestPasswordResetHandler);
router.post('/reset/confirm', validate(confirmPasswordResetSchema), confirmPasswordResetHandler);
router.get('/access-controls', authenticate, authorize(['admin']), getAccessControlsHandler);
router.put('/access-controls', authenticate, authorize(['admin']), validate(accessControlsSchema), updateAccessControlsHandler);

export const authRouter = router;

