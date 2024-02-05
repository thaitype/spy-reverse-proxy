import { logger } from '@/logger';
import type { SpyConfigRuleEntityAzureTable } from '../entities/spy-config-rule.entity';
import type { AzureTable } from './azure-table';
import { v4 as uuidv4 } from 'uuid';

export class SpyConfigRuleService {
  constructor(public readonly tableClient: AzureTable<SpyConfigRuleEntityAzureTable>) {}

  async listRules() {
    await this.tableClient.createTable();
    return this.tableClient.list();
  }

  async insertRule(rule: Omit<SpyConfigRuleEntityAzureTable, 'partitionKey' | 'rowKey'>) {
    await this.tableClient.createTable();
    await this.tableClient.insert({
      ...rule,
      partitionKey: rule.upstreamUrl,
      rowKey: uuidv4(),
    });
  }
}

export const sampleRuleName = 'sample';

/***
 * Fix later
 */
export async function isSampleRuleExist(service: SpyConfigRuleService): Promise<boolean> {
  const result = service.tableClient.list({
    filter: `ruleName eq '${sampleRuleName}'`,
  });
  let count = 0;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for await (const entry of result) {
    count++;
  }
  return count > 0;
}

export async function initSampleRule(service: SpyConfigRuleService) {
  if (await isSampleRuleExist(service)) {
    return logger.info('Sample rule already exists');
  }

  logger.info('Initializing sample rule');
  await service.insertRule({
    ruleName: sampleRuleName,
    upstreamUrl: 'http://localhost:3000',
    /**
     * The sample rule is always false
     */
    condition: false,
    method: 'GET',
    path: '/api',
    plugin: 'response-transformer',
    data: 'replace.status_code=400',
  });
}
