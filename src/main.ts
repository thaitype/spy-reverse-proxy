import express from 'express';
import { spyMiddleware } from './spy-middleware';
import { extractErorMessage } from './utils';
import { env } from '@/environment';
import { logger } from '@/logger';

async function main() {
  const app = express();
  const port = env.srpPort;

  app.get(env.srpAdminRootPath, (req, res) => {
    res.send('Welcome to SRP Admin');
  });

  app.use(spyMiddleware);

  // Start the server
  app.listen(port, () => {
    logger.info(`Server is running on: http://localhost:${port}`);
  });
}

main().catch(extractErorMessage);
