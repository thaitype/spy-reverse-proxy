import type { SpyConfigRuleEntity } from '@/entities';
import { logger } from '@/logger';
import { isMatchedRule } from '../rule-matcher';
import type { HandleResponseParams } from '../spy-rule-plugin';
import { ResponseTransformerExpression } from './response-transformer-expression';

export class ResponseTransformerPlugin {
  static name = 'response-transformer';
  constructor(protected readonly rule: SpyConfigRuleEntity) {}

  async handleResponse(params: HandleResponseParams) {
    const { responseBuffer } = params;
    if (!isMatchedRule(this.rule, params.req)) return responseBuffer.toString();
    const result = new ResponseTransformerExpression(params, this.rule.data).validateAndExecute({ withExecute: true });
    if (!result.success) {
      logger.error(
        `[${this.rule.plugin}] Rule: ${this.rule.ruleName} => ${this.rule.path}, data: ${this.rule.data}, error: ${result.errorMessages.join(', ')}`
      );
    }
    return responseBuffer.toString();
  }
}
