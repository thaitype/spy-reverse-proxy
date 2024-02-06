import { initSampleRule, spyConfigRuleService } from '../database';
import { env } from '../environment';
import { httpLogger, logger } from '../logger';
import type express from 'express';
import { spyMiddleware } from './spy-middleware';
import type { SpyConfigRuleEntityAzureTable } from '@/entities';
import { SpyRule } from './spy-rule';
import { cache } from '@/cache';
import type { RuleConfig} from './rule.schema';
import { ruleConfigSchema } from './rule.schema';

export async function initRulePlugin() {
  await parseSpyConfig(env.srpUpstreamUrl);
  await initSampleRule(spyConfigRuleService);
  logger.info(`Start proxy with upstream url: ${env.srpUpstreamUrl}`);
}

export async function registerSpyPlugin(app: express.Application) {
  await initRulePlugin();

  app.use(httpLogger);
  app.get(env.srpAdminRootPath, async (req, res) => {
    await getSpyConfig({ 
      forceReset: true
    });
    res.send('Welcome to SRP Admin');
  });
  app.use(spyMiddleware);
}

/**
 * Responds to the root admin path
 * - Revalidate rule from data store and cache it.
 */

export async function parseSpyConfig(upstreamUrl: string): Promise<RuleConfig> {
  const rawRules = await spyConfigRuleService.listAllMatchUpstreamUrlRules(upstreamUrl);
  const rules: SpyConfigRuleEntityAzureTable[] = [];
  // TODO: Fix later, this might be slow if there are many rules
  for await (const rawRule of rawRules) {
    rules.push(rawRule);
  }

  return new SpyRule(rules).parse();
}

export async function getSpyConfig(option?: { forceReset?: boolean }): Promise<RuleConfig> {
  if (option?.forceReset) {
    logger.info('Force reset spyConfig');
    cache.delete('spyConfig');
  }
  if (cache.get('spyConfig') === undefined) {
    logger.info('spyConfig not found in cache, set spy config in cache');
    const ruleConfig = await parseSpyConfig(env.srpUpstreamUrl);
    cache.set('spyConfig', JSON.stringify(ruleConfig));
    return ruleConfig;
  }
  const ruleConfigString = cache.get('spyConfig');
  if (!ruleConfigString) {
    return parseSpyConfig(env.srpUpstreamUrl);
  }
  try {
    return ruleConfigSchema.parse(JSON.parse(ruleConfigString));
  } catch (e) {
    logger.error('Error parsing spyConfig from cache', e);
    logger.info('Reparse spyConfig from data store');
    return parseSpyConfig(env.srpUpstreamUrl);
  }
}
