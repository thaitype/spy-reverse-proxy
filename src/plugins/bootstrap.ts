import { initSampleRule, spyConfigRuleService } from '../database';
import { env } from '../environment';
import { httpLogger, logger } from '../logger';
import type express from 'express';
import { spyMiddleware } from './spy-middleware';
import fs from 'fs';
import fsPromise from 'fs/promises';
import type { SpyConfigRuleEntityAzureTable } from '@/entities';
import { SpyRule } from './spy-rule';

export async function initRulePlugin() {
  await handleRootAdmin(env.srpUpstreamUrl);
  await initSampleRule(spyConfigRuleService);
  logger.info(`Start proxy with upstream url: ${env.srpUpstreamUrl}`);
}

export async function registerSpyPlugin(app: express.Application) {
  await initRulePlugin();

  app.use(httpLogger);
  app.get(env.srpAdminRootPath, async (req, res) => {
    await handleRootAdmin(env.srpUpstreamUrl);
    res.send('Welcome to SRP Admin');
  });
  app.use(spyMiddleware);
}

/**
 * Responds to the root admin path
 * - Revalidate rule from data store and cache it.
 */

const rootTmpDir = '.srp/configs';

export async function handleRootAdmin(upstreamUrl: string) {
  if (!fs.existsSync(rootTmpDir)) fs.mkdirSync(rootTmpDir, { recursive: true });
  const rawRules = await spyConfigRuleService.listAllMatchUpstreamUrlRules(upstreamUrl);
  const rules: SpyConfigRuleEntityAzureTable[] = [];
  // TODO: Fix later, this might be slow if there are many rules
  for await (const rawRule of rawRules) {
    rules.push(rawRule);
  }
  const ruleConfig = new SpyRule(rules).parse();
  const ruleConfigPath = `${rootTmpDir}/rule-config.json`;
  fsPromise.writeFile(ruleConfigPath, JSON.stringify(ruleConfig, null, 2), 'utf8');
}
