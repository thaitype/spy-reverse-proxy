import type { Options as HttpProxyMiddlewareOptions } from 'http-proxy-middleware';
import { createProxyMiddleware, responseInterceptor } from 'http-proxy-middleware';
import { env } from '@/environment/env.js';
import { stringLogger } from '@/logger/logger.js';
import { SpyRulePlugin } from './spy-rule-plugin.js';
/**
 * Configure proxy middleware
 */
export const spyMiddleware = createProxyMiddleware({
  target: env.srpUpstreamUrl,
  changeOrigin: true, // for vhosted sites, changes host header to match to target's host
  selfHandleResponse: true, // manually call res.end(); IMPORTANT: res.end() is called internally by responseInterceptor()
  onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
    return await new SpyRulePlugin(env.srpUpstreamUrl).handleResponse({ responseBuffer, proxyRes, req, res });
  }),
  /**
   * TODO: Validate input later
   */
  logLevel: env.srpLoggerLevel as HttpProxyMiddlewareOptions['logLevel'],
  logProvider: () => stringLogger,
});
