import express from 'express';
import { env } from '@/environment/env.js';
import { logger } from '@/logger/logger.js';
import { registerSpyPlugin } from './plugins/index.js';

export async function server() {
  const app = express();
  const port = env.srpPort;

  await registerSpyPlugin(app);

  // Start the server
  app.listen(port, () => {
    logger.info(`Server is running on: http://localhost:${port}`);
  });
}
