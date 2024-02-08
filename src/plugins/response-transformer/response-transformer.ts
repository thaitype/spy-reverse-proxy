import { logger } from '@/logger';
import type { HandleResponseParams } from '../spy-rule-plugin';
import { ResponseTransformerExpression } from './response-transformer-expression';
import type { Rule } from '../rule.schema';

export class ResponseTransformerPlugin {
  static name = 'response-transformer';
  constructor(protected readonly rule: Rule) {}

  async handleResponse(params: HandleResponseParams) {
    const { responseBuffer } = params;

    const result = new ResponseTransformerExpression(this.rule, params).execute();
    if (!result.success) {
      logger.error(
        `[${this.rule.plugin}] Rule: ${this.rule.ruleName} => ${this.rule.path}, error: ${result.errorMessages.join(', ')}`
      );
    }
    return responseBuffer.toString();
  }
}
