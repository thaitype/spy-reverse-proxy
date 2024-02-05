
import { createProxyMiddleware, responseInterceptor } from 'http-proxy-middleware';
import { getEnv } from './env';
const env = getEnv();

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

    console.log(`path`, req.url);

    return responseBuffer.toString();
  }),
  logLevel: 'debug',
});
