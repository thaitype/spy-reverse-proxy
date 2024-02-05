import { createProxyMiddleware, responseInterceptor } from 'http-proxy-middleware';
import { env } from '@/environment';
import { logger, stringLogger } from '@/logger';
/**
 * Configure proxy middleware
 */
export const spyMiddleware = createProxyMiddleware({
  target: env.srpUpstreamUrl,
  changeOrigin: true, // for vhosted sites, changes host header to match to target's host
  selfHandleResponse: true, // manually call res.end(); IMPORTANT: res.end() is called internally by responseInterceptor()
  onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
    res.setHeader('Powered-by', 'thaitype/spy-reverse-proxy');

    // if (req.url === env.TARGET_PATH) {
    //   res.statusCode = 500;
    // }

    logger.info(`Proxying request to: ${req.url}`);

    return responseBuffer.toString();
  }),
  logLevel: 'debug',
  logProvider: () => stringLogger
});
