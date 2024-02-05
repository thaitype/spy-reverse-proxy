import { spyConfigRuleService } from '@/database';
import { logger } from '@/logger';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { ResponseTransformerPlugin } from './response-transformer';

export interface HandleResponseParams {
  responseBuffer: Buffer;
  proxyRes: IncomingMessage;
  req: IncomingMessage;
  res: ServerResponse<IncomingMessage>;
}

export class SpyPlugin {
  constructor(protected upstreamUrl: string) {}

  async handleResponse(params: HandleResponseParams): Promise<string> {
    const { responseBuffer, req, res } = params;

    res.setHeader('Powered-by', 'thaitype/spy-reverse-proxy');
    const rules = await spyConfigRuleService.listAllMatchUpstreamUrlRules(this.upstreamUrl);
    for await (const rule of rules) {
      logger.info(`Rule: ${rule.ruleName} with: ${rule.upstreamUrl} and ${rule.path}`);
      if (rule.plugin === ResponseTransformerPlugin.name) {
        const plugin = new ResponseTransformerPlugin(rule);
        return plugin.handleResponse(params);
      }
    }

    // if (req.url === env.TARGET_PATH) {
    //   res.statusCode = 500;
    // }
    logger.info(`No rule found for ${req.url}`);

    return responseBuffer.toString();
  }
}
