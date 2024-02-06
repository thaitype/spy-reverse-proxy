import type { SpyConfigRuleEntity } from '@/entities';
import { logger } from '@/logger';
import { isMatchedRule } from '../rule-matcher';
import type { HandleResponseParams } from '../spy-plugin';

export class ResponseTransformerPlugin {
  static name = 'response-transformer';
  constructor(protected readonly rule: SpyConfigRuleEntity) {}

  async handleResponse(params: HandleResponseParams) {
    const { responseBuffer } = params;
    if (!isMatchedRule(this.rule, params.req)) return responseBuffer.toString();

    // Basic response transformer
    const [action, value] = this.rule.data.split('=');
    if (action === 'replace.status_code') {
      logger.info(`[${this.rule.plugin}] Rule: ${this.rule.ruleName} => ${this.rule.path}, data: ${this.rule.data}`);
      params.res.statusCode = parseInt(value);
    }
    return responseBuffer.toString();
  }
}
