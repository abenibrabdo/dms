import mongoose from 'mongoose';

import { env } from '@config/index.js';
import { logger } from './logger.js';

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.mongoUri);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error({ err: error }, 'MongoDB connection failed');
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
  logger.info('Disconnected from MongoDB');
};

