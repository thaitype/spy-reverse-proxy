import type { Rule } from '../rule.schema.js';
import type { HandleResponseParams } from '../spy-rule-plugin.js';
import { ReplaceStatusCodeActionExpression } from './action-expressions/index.js';

export type ExpressionValidateResult =
  | {
      success: true;
    }
  | {
      success: false;
      errorMessages: string[];
    };

export interface ExpressionOptions {
  /**
   * If true, the expression will not execute the action, only validate the expression
   *
   * @default false
   */
  validateOnly: boolean;
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
  constructor(
    public readonly rule: Rule,
    public readonly params?: HandleResponseParams
  ) {}

  execute(): ExpressionValidateResult {
    const validateOnly = this.params ? false : true;
    for (const { action, param } of this.rule.actionExpressions) {
      const result = this.executeActions(action, param, { validateOnly });
      if (!result.success) {
        return result;
      }
    }
    return {
      success: true,
    };
  }

  executeActions(action: string, actionParams: string, options: ExpressionOptions): ExpressionValidateResult {
    switch (action) {
      case 'replace.status_code':
        return new ReplaceStatusCodeActionExpression(actionParams, this.params, options).execute();
      default:
        return {
          success: false,
          errorMessages: [`Unsupport action: ${action}`],
        };
    }
  }

  // validateAndExecute(option: ValidateAndExecuteOptions): ExpressionValidateResult {
  //   const errorMessages: string[] = [];
  //   for (const actionExpression of this.actionExpressions) {
  //     const [action, value] = actionExpression.split('=');
  //     if (!action || !value) {
  //       errorMessages.push(`Invalid action expression: ${actionExpression}`);
  //     }

  //     if (option.skipActionExpression === true) continue;
  //     const result = this.validateAndExecuteActions(action, value, option);
  //     if (!result.success) {
  //       errorMessages.push(...result.errorMessages);
  //     }
  //   }

  //   if (errorMessages.length > 0) {
  //     return {
  //       success: false,
  //       errorMessages,
  //     };
  //   }
  //   return {
  //     success: true,
  //   };
  // }
}
