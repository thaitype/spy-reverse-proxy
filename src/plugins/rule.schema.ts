import { z } from 'zod';

export const actionExpressionValue = z.object({
  type: z.literal('value'),
  action: z.string(),
  value: z.string(),
});

export const actionExpressionKeyValue = z.object({
  type: z.literal('keyValue'),
  action: z.string(),
  key: z.string(),
  value: z.string(),
});

export const ruleSchema = z.object({
  ruleName: z.string(),
  path: z.string(),
  method: z.string().optional(),
  plugin: z.string(),
  actionExpressions: z.array(z.union([actionExpressionValue, actionExpressionKeyValue])),
  enabled: z.boolean(),
  createdAt: z.string(),
});

export const ruleConfigSchema = z.object({
  rules: z.array(ruleSchema),
});

export type Rule = z.infer<typeof ruleSchema>;