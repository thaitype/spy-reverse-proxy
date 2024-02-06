import type { SpyConfigRuleEntity } from "@/entities";
import type { IncomingMessage } from 'node:http';

export function isMatchedRule(rule: SpyConfigRuleEntity, req: IncomingMessage) {
  if (rule.condition === undefined) return false;
  return (
    rule.method === req.method &&
    rule.path === req.url &&
    rule.condition
  );
}