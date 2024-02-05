import type { SpyConfigRuleEntity } from '@/entities';

export function responseTransformerPlugin() {
  const data = {
    upstreamUrl: 'upstreamUrl',
    method: 'httpMethod',
    condition: true,
  } as SpyConfigRuleEntity;
  return data;
}
