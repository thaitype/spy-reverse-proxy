import type { HandleResponseParams } from '../spy-plugin';
import { replaceStatusCode } from './action-expressions';

export type ExpressionValidateResult =
  | {
      success: true;
    }
  | {
      success: false;
      errorMessages: string[];
    };

/**
 * Spec
 * 
 *     - Expression syntax for `**response_transformer**`
        1. `<action> = <value>`, the value is JSON-compatibility data
        2. `<action> = <key> : <value>`, the value is JSON-compatibility data
        3. Multiple expression⇒ 
            1. Ex:  `<action> = <value> , <action> = <value>`
            2. Ex: `<action> = <value> , <action> = <key> : <value>`
    - Allow Actions
        - replace.status_code
            - `replace.status_code=400`
 */

export class ResponseTransformerExpression {
  public actionExpressions: string[] = [];
  constructor(
    protected readonly params: HandleResponseParams,
    protected readonly expression: string
  ) {
    this.prepare();
  }

  prepare() {
    this.actionExpressions = this.expression.split(',');
  }

  validate(): ExpressionValidateResult {
    const errorMessages: string[] = [];
    for (const actionExpression of this.actionExpressions) {
      const [action, value] = actionExpression.split('=');
      if (!action || !value) {
        errorMessages.push(`Invalid action expression: ${actionExpression}`);
      }

      const result = this.validateActions(action, value);
      if (!result.success) {
        errorMessages.push(...result.errorMessages);
      }
    }

    if (errorMessages.length > 0) {
      return {
        success: false,
        errorMessages,
      };
    }
    return {
      success: true,
    };
  }

  validateActions(action: string, actionParams: string): ExpressionValidateResult {
    switch (action) {
      case 'replace.status_code':
        return replaceStatusCode(this.params, actionParams);
      default:
        return {
          success: false,
          errorMessages: [`Unsupport action: ${action}`],
        };
    }
  }
}
