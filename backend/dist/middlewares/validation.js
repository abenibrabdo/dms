import { ValidationError } from '@core/errors.js';
export const validate = (schema, segment = 'body') => (req, _res, next) => {
    const { error, value } = schema.validate(req[segment], {
        abortEarly: false,
        stripUnknown: true,
    });
    if (error) {
        throw new ValidationError('Request validation failed', error.details);
    }
    Object.assign(req[segment], value);
    next();
};
