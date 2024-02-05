import type { AzureTableEntityBase } from '../database/azure-table';

export interface SpyConfigRuleEntity {
  /**
   * The name of the rule
   */
  ruleName: string;
  /**
   * the target URL that want the spy server to proxy to
   */
  upstreamUrl: string;
  /**
   * the path that the spy server will match
   */
  path: string;
  /**
   * the HTTP method that the spy server will match
   */
  method: string;
  /**
   * enable or disable the rule
   */
  condition: boolean;
  /**
   * the plugin name that the spy server will use to transform
   */
  plugin: string;
  /**
   * the data that the plugin will use to transform
   */
  data: string;
}

export type SpyConfigRuleEntityAzureTable = SpyConfigRuleEntity & AzureTableEntityBase;
