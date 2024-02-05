import { logger } from '@/logger';
import type { IncomingMessage, ServerResponse } from 'node:http';

export interface HandleResponseParams {
  responseBuffer: Buffer;
  proxyRes: IncomingMessage;
  req: IncomingMessage;
  res: ServerResponse<IncomingMessage>;
}

export class SpyPlugin {
  async handleResponse(params: HandleResponseParams): Promise<string> {
    const { responseBuffer, req, res } = params;

    res.setHeader('Powered-by', 'thaitype/spy-reverse-proxy');

    // if (req.url === env.TARGET_PATH) {
    //   res.statusCode = 500;
    // }

    logger.info(`Proxying request to: ${req.url}`);

    return responseBuffer.toString();
  }
}
