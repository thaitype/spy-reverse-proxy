import type { AzureTableEntityBase } from '../database/azure-table';

export interface SpyConfigRuleEntity {
  /**
   * The name of the rule
   */
  ruleName: string;
  /**
   * Environment name
   *
   * For supporting multiple environments
   * @default `default`
   */
  environment?: string;
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
   * 
   * When undefined, the spy server will match all methods
   */
  method?: string | null;
  /**
   * enable or disable the rule
   */
  condition?: boolean;
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
