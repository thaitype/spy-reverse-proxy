import { logger } from '@/logger/logger.js';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { ResponseTransformerPlugin } from './response-transformer/response-transformer.js';
import { getSpyConfig } from './bootstrap.js';
import { isMatchedRule } from './rule-matcher.js';
import type { RuleConfig } from './rule.schema.js';

export interface HandleResponseParams {
  responseBuffer: Buffer;
  proxyRes: IncomingMessage;
  req: IncomingMessage;
  res: ServerResponse<IncomingMessage>;
}

export class SpyRulePlugin {
  constructor(protected upstreamUrl: string) {}

  async handleResponse(params: HandleResponseParams): Promise<string> {
    const { responseBuffer, req, res } = params;

    res.setHeader('Powered-by', 'thaitype/spy-reverse-proxy');

    const rule = await getSpyConfig();
    for (const value of Object.values<RuleConfig['rules'][number]>(rule.rules)) {
      if (isMatchedRule(value, req)) {
        if (value.plugin === ResponseTransformerPlugin.name) {
          const plugin = new ResponseTransformerPlugin(value);
          return plugin.handleResponse(params);
        }
      }
    }

    logger.debug(`No rule found for ${req.url}`);
    return responseBuffer.toString();
  }
}
