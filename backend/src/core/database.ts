import { env } from '@config/index.js';
import { logger } from './logger.js';

import { Sequelize, type SequelizeOptions } from 'sequelize';

import '@modules/auth/auth.model.js';
import '@modules/auth/password-reset.model.js';
import '@modules/auth/access-control.model.js';
import '@modules/documents/document.model.js';
import '@modules/documents/upload-session.model.js';
import '@modules/workflows/workflow.model.js';
import '@modules/collaboration/comment.model.js';
import '@modules/collaboration/presence.model.js';
import '@modules/notifications/notification.model.js';
import '@modules/audit/audit.model.js';
import '@modules/localization/localization.model.js';

const sequelizeOptions: SequelizeOptions = {
  dialect: 'mysql',
  host: env.database.host,
  port: env.database.port,
  username: env.database.username,
  password: env.database.password,
  database: env.database.name,
  logging: env.database.logging ? (msg) => logger.debug(msg) : false,
  define: {
    underscored: true,
    paranoid: false,
  },
};

export const sequelize = new Sequelize(sequelizeOptions);

export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    if (env.database.sync) {
      await sequelize.sync();
    }
    logger.info('Connected to MySQL database');
  } catch (error) {
    logger.error({ err: error }, 'MySQL connection failed');
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  await sequelize.close();
  logger.info('Disconnected from MySQL');
};

