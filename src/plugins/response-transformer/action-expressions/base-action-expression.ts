import type { HandleResponseParams } from '@/plugins';
import type { ExpressionValidateResult, ValidateAndExecuteOptions } from '../response-transformer-expression';
import { logger } from '@/logger';

export abstract class BaseActionExpression {
  constructor(
    public params: HandleResponseParams,
    public actionParams: string,
    public options: ValidateAndExecuteOptions
  ) {}
  abstract validate(): ExpressionValidateResult;
  abstract executeAction(): void;
  execute(): ExpressionValidateResult {
    const result = this.validate();
    if (!result.success) {
      return result;
    }
    if (this.options.withExecute) {
      this.executeAction();
      logger.info(`[ResponseTransformer] Action: ${this.constructor.name}, params: ${this.actionParams}, executed`);
    } else {
      logger.info(`[ResponseTransformer] Action: ${this.constructor.name}, params: ${this.actionParams}, skipping execute`);
    }
    return {
      success: true,
    };
  }
}
