import 'express-async-errors';

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { env } from '@config/index.js';
import { logger } from '@core/logger.js';
import { errorHandler } from '@middlewares/error-handler.js';
import { apiRateLimiter } from '@middlewares/rate-limit.js';
import { requestContext } from '@middlewares/request-context.js';
import { notFoundHandler } from '@middlewares/not-found.js';
import { apiRouter } from '@routes/index.js';

export const createApp = () => {
  const app = express();
  app.disable('x-powered-by');

  app.use(requestContext);

  app.use(helmet({ crossOriginResourcePolicy: false }));

  const allowedOrigins = env.corsOrigins;
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(null, false);
      },
      credentials: true,
      optionsSuccessStatus: 204,
    }),
  );

  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true }));

  morgan.token('id', (req) => req.requestId ?? '-');
  if (env.nodeEnv !== 'test') {
    app.use(
      morgan(':id :method :url :status :response-time ms', {
        stream: {
          write: (message) =>
            logger.debug(
              message.trim(),
            ),
        },
      }),
    );
  }

  app.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api', apiRateLimiter, apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.on('error', (error) => {
    logger.error({ err: error }, 'Express app error');
  });

  return app;
};

