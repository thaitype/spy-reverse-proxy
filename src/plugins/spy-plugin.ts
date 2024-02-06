import { initSampleRule, spyConfigRuleService } from '../database';
import { env } from '../environment';
import { httpLogger, logger } from '../logger';
import type express from 'express';
import { spyMiddleware } from './spy-middleware';

export async function initRulePlugin() {
  console.log('initRulePlugin');
  await initSampleRule(spyConfigRuleService);
  logger.info(`Start proxy with upstream url: ${env.srpUpstreamUrl}`);
}

export async function registerSpyPlugin(app: express.Application) {
  await initRulePlugin();

  app.use(httpLogger);
  app.get(env.srpAdminRootPath, handleRootAdmin);
  app.use(spyMiddleware);
}

/**
 * Responds to the root admin path
 * - Revalidate rule from data store and cache it.
 */

export async function handleRootAdmin(req: express.Request, res: express.Response) {
  res.send('Welcome to SRP Admin');
}
