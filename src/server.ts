import express from 'express';
import { env } from '@/environment';
import { logger } from '@/logger';
import { registerSpyPlugin } from './plugins';

export async function server() {
  const app = express();
  const port = env.srpPort;

   await registerSpyPlugin(app);

  // Start the server
  app.listen(port, () => {
    logger.info(`Server is running on: http://localhost:${port}`);
  });
}
