import type { ExpressionValidateResult } from '../response-transformer-expression';
import { BaseActionExpression } from './base-action-expression';

export class ReplaceStatusCodeActionExpression extends BaseActionExpression {
  validate(): ExpressionValidateResult {
    const statusCode = parseInt(this.actionParams);
    if (isNaN(statusCode)) {
      return {
        success: false,
        errorMessages: [`Invalid status code: ${this.actionParams}`],
      };
    }
    return {
      success: true,
    };
  }

  executeAction() {
    const statusCode = parseInt(this.actionParams);
    this.params.res.statusCode = statusCode;
  }
}
