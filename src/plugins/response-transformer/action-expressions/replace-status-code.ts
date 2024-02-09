import type { ExpressionValidateResult } from '../response-transformer-expression.js';
import { BaseActionExpression } from './base-action-expression.js';

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
    if (!this.params)
      throw new Error(
        'HandleResponseParams is not defined, this is happen when `dryRun` is true only, but this is not the case here.'
      );
    const statusCode = parseInt(this.actionParams);
    this.params.res.statusCode = statusCode;
  }
}
