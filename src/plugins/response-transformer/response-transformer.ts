import type { SpyConfigRuleEntity } from '@/entities';
import { logger } from '@/logger';
import type { HandleResponseParams } from '..';

export function responseTransformerPlugin() {
  const data = {
    upstreamUrl: 'upstreamUrl',
    method: 'httpMethod',
    condition: true,
  } as SpyConfigRuleEntity;
  return data;
}

export class ResponseTransformerPlugin {
  static name = 'response-transformer';
  constructor(protected readonly rule: SpyConfigRuleEntity) {
    logger.info(
      `[${rule.plugin}] Rule: ${rule.ruleName} => ${rule.path}, data: ${rule.data}`
    );
  }

  async handleResponse(params: HandleResponseParams) {
    const { responseBuffer } = params;
    const condition = this.rule.condition ?? true;
    if(!this.rule.data || !condition) return responseBuffer.toString();

    logger.info(`Response transformer plugin is running for rule: ${this.rule.ruleName}`);
    // Basic response transformer
    const [action, value] = this.rule.data.split('=');
    if(action === 'replace.status_code') {
      logger.info(`Replacing status code to ${value}`);
      params.res.statusCode = parseInt(value);
    }
    return responseBuffer.toString();
  }
}
