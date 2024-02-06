import { logger } from '@/logger';
import type { SpyConfigRuleEntityAzureTable } from '../entities/spy-config-rule.entity';
import { AzureTable } from './azure-table';
import invariant from 'tiny-invariant';
import { TableClient } from '@azure/data-tables';
import { env } from '@/environment';
import { ODataExpression } from 'ts-odata-client';
import { trimStartAndEndSlash } from '@/utils';

export class SpyConfigRuleService {
  private oDataExpresion = ODataExpression.forV4<SpyConfigRuleEntityAzureTable>();

  constructor(public readonly tableClient: AzureTable<SpyConfigRuleEntityAzureTable>) {}

  async listAllMatchUpstreamUrlRules(upstreamUrl: string) {
    const url = trimStartAndEndSlash(upstreamUrl);
    await this.tableClient.createTable();
    return this.tableClient.list(
      this.oDataExpresion
        .filter(p =>
          p.upstreamUrl
            .$equals('')
            .or(p.upstreamUrl.$equals(null))
            .or(p.upstreamUrl.$equals(url))
            .or(p.upstreamUrl.$equals(`${url}/`))
        )
        .build()
    );
  }

  async insertRule(rule: Omit<SpyConfigRuleEntityAzureTable, 'partitionKey' | 'rowKey'>) {
    await this.tableClient.createTable();
    await this.tableClient.insert({
      ...rule,
      partitionKey: rule.environment ?? 'default',
      rowKey: rule.ruleName,
    });
  }
}

export const sampleRuleName = 'sample';

/***
 * Fix later
 */
export async function isSampleRuleExist(service: SpyConfigRuleService): Promise<boolean> {
  await service.tableClient.createTable();
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
  logger.info('Sample rule initialized');
}

export function getSpyConfigRuleInstance() {
  invariant(env.srpDataAzureTableConnectionString, 'Azure table connection string is required');
  const tableClient = TableClient.fromConnectionString(
    env.srpDataAzureTableConnectionString,
    `${env.srpDataAzureTableNamePrefix}SpyConfigRule`
  );
  const azureTable = new AzureTable<SpyConfigRuleEntityAzureTable>(tableClient);
  return new SpyConfigRuleService(azureTable);
}
/**
 * The spy config rule service
 * Singleton instance
 */
export const spyConfigRuleService = getSpyConfigRuleInstance();
