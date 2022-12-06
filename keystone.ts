import 'dotenv/config';
import { config } from '@keystone-6/core';

import { lists } from './schemas';

import { withAuth, session } from './auth';
import { insertSeedData } from './seed-data';

export default withAuth(
  config({
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL as string],
        credentials: true,
      },
      healthCheck: {
        path: '/health-check',
        data: () => ({
          status: 'healthy',
          timestamp: Date.now(),
          uptime: process.uptime(),
        }),
      },
    },
    db: {
      provider: 'postgresql',
      url: process.env.DATABASE_URL as string,
      async onConnect(keystone) {
        if (process.argv.includes('--seed-data')) {
          await insertSeedData(keystone);
        }
      },
    },
    // This config allows us to set up features of the Admin UI https://keystonejs.com/docs/apis/config#ui
    ui: {
      // TODO: change this for role...
      // TODO: add user info in the session
      // For our starter, we check that someone has session data before letting them see the Admin UI.
      isAccessAllowed: (context) => !!context.session?.data,
    },
    lists,
    session,
  })
);
