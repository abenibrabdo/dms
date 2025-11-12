import type { ObjectSchema } from 'joi';
import type { NextFunction, Request, Response } from 'express';

import { ValidationError } from '@core/errors.js';

type Segment = 'body' | 'query' | 'params';

export const validate =
  (schema: ObjectSchema, segment: Segment = 'body') =>
  (req: Request, _res: Response, next: NextFunction) => {
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

