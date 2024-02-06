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
  condition: z.boolean().optional(),
});

export const ruleConfigSchema = z.object({
  rules: z.record(ruleSchema),
  errorMessages: z.array(z.string()),
});

export type Rule = z.infer<typeof ruleSchema>;
export type RuleConfig = z.infer<typeof ruleConfigSchema>;
