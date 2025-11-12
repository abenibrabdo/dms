#!/usr/bin/env ts-node
import '../config/env.js';

import { env } from '@config/index.js';
import { connectDatabase, disconnectDatabase } from '@core/database.js';
import { logger } from '@core/logger.js';
import { hashPassword } from '@utils/password.js';
import { UserModel } from '@modules/auth/auth.model.js';

const main = async () => {
  await connectDatabase();

  const existing = await UserModel.findOne({ email: env.adminSeed.email });
  if (existing) {
    logger.info(
      { email: env.adminSeed.email },
      'Admin user already exists. Skipping seed operation.',
    );
    return;
  }

  const hashedPassword = await hashPassword(env.adminSeed.password);
  await UserModel.create({
    email: env.adminSeed.email,
    password: hashedPassword,
    firstName: env.adminSeed.firstName,
    lastName: env.adminSeed.lastName,
    department: env.adminSeed.department,
    roles: ['admin'],
    permissions: ['*'],
    isMfaEnabled: false,
  });

  logger.info({ email: env.adminSeed.email }, 'Admin user seeded successfully');
};

void main()
  .catch((error) => {
    logger.error({ err: error }, 'Failed to seed admin user');
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDatabase().catch((error) =>
      logger.error({ err: error }, 'Failed to close database connection'),
    );
  });

