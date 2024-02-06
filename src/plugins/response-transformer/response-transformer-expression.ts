import type { HandleResponseParams } from '../spy-plugin';
import { ReplaceStatusCodeActionExpression } from './action-expressions';

export type ExpressionValidateResult =
  | {
      success: true;
    }
  | {
      success: false;
      errorMessages: string[];
    };

export interface ValidateAndExecuteOptions {
  withExecute: boolean;
  skipActionExpression?: boolean;
}

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
    public readonly params: HandleResponseParams,
    public readonly expression: string
  ) {
    this.prepare();
  }

  prepare() {
    this.actionExpressions = this.expression.split(',');
    this.actionExpressions = this.actionExpressions.map((actionExpression) => actionExpression.trim());
  }

  validateAndExecute(option: ValidateAndExecuteOptions): ExpressionValidateResult {
    const errorMessages: string[] = [];
    for (const actionExpression of this.actionExpressions) {
      const [action, value] = actionExpression.split('=');
      if (!action || !value) {
        errorMessages.push(`Invalid action expression: ${actionExpression}`);
      }

      if(option.skipActionExpression === true) continue;
      const result = this.validateAndExecuteActions(action, value, option);
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

  validateAndExecuteActions(action: string, actionParams: string, option: ValidateAndExecuteOptions): ExpressionValidateResult {
    switch (action) {
      case 'replace.status_code':
        return new ReplaceStatusCodeActionExpression(this.params, actionParams, option).execute();
      default:
        return {
          success: false,
          errorMessages: [`Unsupport action: ${action}`],
        };
    }
  }
}
