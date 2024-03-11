import type { RuleConfig } from '@/plugins/rule.schema.js';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

export const trimStartAndEndSlash = (path?: string) => path?.trim().replace(/^\/+|\/+$/g, '');

export function extractErorMessage(error: unknown): string {
  if (error instanceof ZodError) {
    return fromZodError(error).message;
  }

  if (error instanceof Error) {
    return `${error.message} ${error.stack}`;
  }

  return String(error);
}

export function mergeRuleConfig(ruleConfig: RuleConfig, newRuleConfig: RuleConfig): RuleConfig {
  const mergedRuleConfig: RuleConfig = {
    rules: { ...ruleConfig.rules, ...newRuleConfig.rules },
    errorMessages: [...ruleConfig.errorMessages, ...newRuleConfig.errorMessages],
  };

  return mergedRuleConfig;
}