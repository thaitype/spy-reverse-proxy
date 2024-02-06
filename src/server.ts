import express from 'express';
import { spyMiddleware } from './spy-middleware';
import { env } from '@/environment';
import { httpLogger, logger } from '@/logger';
import { initSampleRule, spyConfigRuleService } from './database';

export async function server() {
  await initSampleRule(spyConfigRuleService);
  logger.info(`Start proxy with upstream url: ${env.srpUpstreamUrl}`);

  const app = express();
  const port = env.srpPort;

  app.use(httpLogger);

  app.get(env.srpAdminRootPath, (req, res) => {
    res.send('Welcome to SRP Admin');
  });

  app.use(spyMiddleware);

  // Start the server
  app.listen(port, () => {
    logger.info(`Server is running on: http://localhost:${port}`);
  });
}
