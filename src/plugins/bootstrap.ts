import { initSampleRule, spyConfigRuleService } from '../database';
import { env } from '../environment';
import { httpLogger, logger } from '../logger';
import type express from 'express';
import { spyMiddleware } from './spy-middleware';
import fs from 'fs';

export async function initRulePlugin() {
  await handleRootAdmin();
  await initSampleRule(spyConfigRuleService);
  logger.info(`Start proxy with upstream url: ${env.srpUpstreamUrl}`);
}

export async function registerSpyPlugin(app: express.Application) {
  await initRulePlugin();

  app.use(httpLogger);
  app.get(env.srpAdminRootPath, async (req, res) => {
    await handleRootAdmin();
    res.send('Welcome to SRP Admin');
  });
  app.use(spyMiddleware);
}

/**
 * Responds to the root admin path
 * - Revalidate rule from data store and cache it.
 */

const rootTmpDir = '.srp/configs';

export async function handleRootAdmin() {
  if (!fs.existsSync(rootTmpDir)) fs.mkdirSync(rootTmpDir, { recursive: true });
}
