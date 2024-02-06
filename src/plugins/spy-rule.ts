import type { SpyConfigRuleEntity } from '@/entities';
import type { Rule, RuleConfig } from './rule.schema';

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

export class SpyRule {
  // public errorMessages: string[] = [];
  // public rules: Rule[] = [];
  public actionExpressions: string[] = [];

  constructor(public readonly spyConfigRules: SpyConfigRuleEntity[]) {}

  parse(): RuleConfig {
    const errorMessages: string[] = [];
    const rules: Rule[] = [];
    for (const spyConfigRule of this.spyConfigRules) {
      rules.push({
        ruleName: spyConfigRule.ruleName,
        path: spyConfigRule.path,
        method: spyConfigRule.method ?? undefined,
        plugin: spyConfigRule.plugin,
        actionExpressions: this.parseActionExpressions(spyConfigRule.data),
        enabled: spyConfigRule.condition === true ? true : false,
        createdAt: new Date().toISOString(),
      });
    }

    return {
      rules,
      errorMessages,
    };
  }

  parseActionExpressions(data: string): Rule['actionExpressions'] {
    const actionExpressions: Rule['actionExpressions'] = [];
    const rawExpressions = data.split(',').map(actionExpression => actionExpression.trim());
    for (const rawExpression of rawExpressions) {
      const [action, param] = rawExpression.split('=');
      actionExpressions.push({
        action: action.trim(),
        param: param.trim(),
      });
    }
    return actionExpressions;
  }
}
