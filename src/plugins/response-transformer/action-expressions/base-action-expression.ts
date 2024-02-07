import type { HandleResponseParams } from '@/plugins';
import type { ExpressionOptions, ExpressionValidateResult } from '../response-transformer-expression';
import { logger } from '@/logger';

export abstract class BaseActionExpression {
  constructor(
    public actionParams: string,
    public params?: HandleResponseParams,
    public options?: ExpressionOptions,
  ) {}
  abstract validate(): ExpressionValidateResult;
  abstract executeAction(): void;
  execute(): ExpressionValidateResult {
    const result = this.validate();
    if (!result.success) {
      return result;
    }
    if (this.options?.validateOnly === true) {
      logger.info(`[ResponseTransformer] Action: ${this.constructor.name}, params: ${this.actionParams}, validated only`);
      return {
        success: true,
      };
    }
    
    this.executeAction();
    logger.info(`[ResponseTransformer] Action: ${this.constructor.name}, params: ${this.actionParams}, executed`);
    return {
      success: true,
    };
  }
}
