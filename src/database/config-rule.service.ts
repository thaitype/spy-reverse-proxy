import type { SpyConfigRuleEntityAzureTable } from '../entities/spy-config-rule.entity';
import type { AzureTable } from './azure-table';
import { v4 as uuidv4 } from 'uuid';

export class SpyConfigRuleService {
  constructor(private readonly tableClient: AzureTable<SpyConfigRuleEntityAzureTable>) {}

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
