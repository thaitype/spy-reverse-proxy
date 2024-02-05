import express from 'express';
import { spyMiddleware } from './spy-middleware';
import { env } from '@/environment';
import { logger } from '@/logger';
import pinoHttp from 'pino-http';
import { initSampleRule, spyConfigRuleService } from './database';

export async function server() {
  await initSampleRule(spyConfigRuleService);

  const app = express();
  const port = env.srpPort;

  app.use(
    pinoHttp({
      logger,
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
    })
  );

  app.get(env.srpAdminRootPath, (req, res) => {
    res.send('Welcome to SRP Admin');
  });

  app.use(spyMiddleware);

  // Start the server
  app.listen(port, () => {
    logger.info(`Server is running on: http://localhost:${port}`);
  });
}
