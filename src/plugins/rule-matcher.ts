import type { IncomingMessage } from 'node:http';
import { trimStartAndEndSlash } from '@/utils';

export function isMatchedRule(
  rule: {
    path?: string;
    method?: string;
    condition?: boolean;
  },
  req: IncomingMessage
) {
  if (rule.condition === undefined) return false;
  if (rule.path === undefined || rule.path === null || rule.path.trim() === '') return false;
  const rulePath = trimStartAndEndSlash(rule.path.trim())?.toLowerCase();
  const reqPath = trimStartAndEndSlash(req.url?.trim())?.toLowerCase();
  if (
    rule.method === undefined ||
    rule.method === null ||
    rule.method.trim() === '' ||
    rule.method.trim() === '*' ||
    req.method === undefined
  )
    return rulePath === reqPath && rule.condition === true;
  return (
    rule.method.trim().toUpperCase() === req.method.toUpperCase() && rulePath === reqPath && rule.condition === true
  );
}
