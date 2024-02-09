import { logger } from '@/logger/index.js';
import type { HandleResponseParams } from '../spy-rule-plugin.js';
import { ResponseTransformerExpression } from './response-transformer-expression.js';
import type { Rule } from '../rule.schema.js';

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
