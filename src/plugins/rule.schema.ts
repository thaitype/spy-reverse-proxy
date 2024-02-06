import { z } from 'zod';

export const actionExpression = z.object({
  action: z.string(),
  param: z.string(),
});

export const ruleSchema = z.object({
  ruleName: z.string(),
  path: z.string(),
  method: z.string().optional(),
  plugin: z.string(),
  actionExpressions: z.array(actionExpression),
  enabled: z.boolean(),
  createdAt: z.string(),
});

export type Rule = z.infer<typeof ruleSchema>;

export interface RuleConfig {
  rules: Rule[];
  errorMessages: string[];
}
