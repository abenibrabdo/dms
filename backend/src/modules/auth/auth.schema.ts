import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(12)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, 'complexity')
    .required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  department: Joi.string().optional(),
  roles: Joi.array().items(Joi.string()).optional(),
  permissions: Joi.array().items(Joi.string()).optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  mfaCode: Joi.string().length(6).pattern(/^[0-9]+$/).optional(),
});

export const mfaSetupSchema = Joi.object({});

export const mfaVerifySchema = Joi.object({
  code: Joi.string().length(6).pattern(/^[0-9]+$/).required(),
});

export const mfaDisableSchema = Joi.object({});

export const requestPasswordResetSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const confirmPasswordResetSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string()
    .min(12)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, 'complexity')
    .required(),
});

export const accessControlsSchema = Joi.object({
  allowedIp: Joi.array().items(Joi.string()).optional(),
  blockedIp: Joi.array().items(Joi.string()).optional(),
  allowedDevice: Joi.array().items(Joi.string()).optional(),
});

