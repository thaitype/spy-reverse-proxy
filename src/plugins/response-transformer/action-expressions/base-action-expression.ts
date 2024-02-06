import type { HandleResponseParams } from '@/plugins';
import type { ExpressionValidateResult } from '../response-transformer-expression';
import { logger } from '@/logger';

export abstract class BaseActionExpression {
  constructor(
    public params: HandleResponseParams,
    public actionParams: string
  ) {}
  abstract validate(): ExpressionValidateResult;
  abstract executeAction(): void;
  execute(): ExpressionValidateResult {
    const result = this.validate();
    if (!result.success) {
      return result;
    }
    this.executeAction();
    logger.info(`[ResponseTransformer] Action: ${this.constructor.name}, params: ${this.actionParams}, executed`);
    return {
      success: true,
    };
  }
}
