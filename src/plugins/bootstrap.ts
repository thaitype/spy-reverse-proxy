import { initSampleRule, spyConfigRuleService } from '../database';
import { env } from '../environment';
import { httpLogger, logger } from '../logger';
import type express from 'express';
import { spyMiddleware } from './spy-middleware';
import type { SpyConfigRuleEntityAzureTable } from '@/entities';
import { SpyRule } from './spy-rule';
import { cache } from '@/cache';

export async function initRulePlugin() {
  await getSpyConfig(env.srpUpstreamUrl);
  await initSampleRule(spyConfigRuleService);
  logger.info(`Start proxy with upstream url: ${env.srpUpstreamUrl}`);
}

export async function registerSpyPlugin(app: express.Application) {
  await initRulePlugin();

  app.use(httpLogger);
  app.get(env.srpAdminRootPath, async (req, res) => {
    await getSpyConfig(env.srpUpstreamUrl);
    res.send('Welcome to SRP Admin');
  });
  app.use(spyMiddleware);
}

/**
 * Responds to the root admin path
 * - Revalidate rule from data store and cache it.
 */

export async function getSpyConfig(upstreamUrl: string) {
  const rawRules = await spyConfigRuleService.listAllMatchUpstreamUrlRules(upstreamUrl);
  const rules: SpyConfigRuleEntityAzureTable[] = [];
  // TODO: Fix later, this might be slow if there are many rules
  for await (const rawRule of rawRules) {
    rules.push(rawRule);
  }

  return new SpyRule(rules).parse();
}

export function setSpyConfig() {
  if (cache.get('spyConfig') !== undefined) {
    cache.set('spyConfig', JSON.stringify(getSpyConfig(env.srpUpstreamUrl)));
  }
  logger.info('Set spy config in cache');
}
