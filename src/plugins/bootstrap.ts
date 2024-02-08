import { initSampleRule, spyConfigRuleService } from '../database';
import { env } from '../environment';
import { httpLogger, logger, stringLogger } from '../logger';
import type express from 'express';
import { spyMiddleware } from './spy-middleware';
import type { SpyConfigRuleEntityAzureTable } from '@/entities';
import { SpyRule } from './spy-rule';
import { cache } from '@/cache';
import type { RuleConfig } from './rule.schema';
import { ruleConfigSchema } from './rule.schema';
import { DataViewer, DataContainer } from '@thaitype/data-viewer-server';

export async function initRulePlugin() {
  logger.info('Connecting to Azure Table');
  await initSampleRule(spyConfigRuleService);
  logger.info(`Start proxy with upstream url: ${env.srpUpstreamUrl}`);
  return parseSpyConfig(env.srpUpstreamUrl);
}

export function convertRuleToTable(rule: RuleConfig['rules']): Record<string, unknown>[] {
  const result: Record<string, unknown>[] = [];
  for (const value of Object.values(rule)) {
    const { actionExpressions, ...rest } = value;
    const row: Record<string, unknown> = rest;
    let i = 0;
    for (const actionExpression of actionExpressions) {
      row[`actionExpressions[${i++}]`] = `${actionExpression.action} = ${actionExpression.param}`;
    }
    result.push(row);
  }
  return result;
}

export function convertErrorMessagesToTable(rules: RuleConfig['errorMessages']): Record<string, unknown>[] {
  const result: Record<string, unknown>[] = [];
  for (const rule of rules) {
    result.push({
      'Error Message': rule,
    });
  }
  return result;
}

export function defineRuleReport(rules: RuleConfig): DataContainer {
  const container = new DataContainer();
  container.addHeader('SRP Config');
  container.addTable([
    {
      'Upstream URL': env.srpUpstreamUrl,
    },
  ]);
  container.addHeader('Validated Rules');
  container.addTable(convertRuleToTable(rules.rules));
  container.addHeader('Error Rules');
  container.addTable(convertErrorMessagesToTable(rules.errorMessages));
  return container;
}

export async function registerSpyPlugin(app: express.Express) {
  await initRulePlugin();
  const dataViewer = new DataViewer({
    path: env.srpAdminRootPath,
    logger: stringLogger,
  });

  /**
   * Add middleware to admin path, to revalidate rule from data store and cache it.
   */
  app.use(env.srpAdminRootPath, async (req, res, next) => {
    const result = await getSpyConfig({
      forceReset: true,
    });
    // Set dataViewer to show the new rule
    dataViewer.set(defineRuleReport(result));
    logger.info('Revalidate spyConfig');
    next();
  });
  dataViewer.registerMiddleware(app);

  app.use(httpLogger);

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

  try {
    return new SpyRule(rules).parse();
  } catch (e) {
    logger.error('Error parsing spyConfig', e);
    let errorMessage = '';
    if (e instanceof Error) {
      errorMessage = e.message + '\n' + e.stack;
    } else {
      errorMessage = `Unknown error, ${String(e)}`;
    }
    return {
      rules: {},
      errorMessages: [`Error parsing spyConfig: ${errorMessage}`, ...rules.map(rule => JSON.stringify(rule))],
    };
  }
}

export async function getSpyConfig(option?: { forceReset?: boolean }): Promise<RuleConfig> {
  if (option?.forceReset) {
    logger.debug('Force reset spyConfig');
    cache.delete('spyConfig');
  }
  if (cache.get('spyConfig') === undefined) {
    logger.debug('spyConfig not found in cache, set spy config in cache');
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
