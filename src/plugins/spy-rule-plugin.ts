import { logger } from '@/logger';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { ResponseTransformerPlugin } from './response-transformer';
import { getSpyConfig } from './bootstrap';
import { isMatchedRule } from './rule-matcher';

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
    for(const value of Object.values(rule.rules)) {
      if(isMatchedRule(value, req)) {
        if(value.plugin === ResponseTransformerPlugin.name) {
          const plugin = new ResponseTransformerPlugin(value);
          return plugin.handleResponse(params);
        }
      }
    }

    // const rules = await spyConfigRuleService.listAllMatchUpstreamUrlRules(this.upstreamUrl);
    // // TODO: Fix later, this might be slow if there are many rules
    // for await (const rule of rules) {
    //   if (rule.plugin === ResponseTransformerPlugin.name) {
    //     const plugin = new ResponseTransformerPlugin(rule);
    //     return plugin.handleResponse(params);
    //   }
    // }

    logger.info(`No rule found for ${req.url}`);
    return responseBuffer.toString();
  }
}
