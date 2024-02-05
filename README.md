# SRP: Spy Reverse Proxy
Read more for [Design Specification](https://github.com/thaitype/spy-reverse-proxy/issues/2)

## Problem Statement


Many may wonder why we don't use tools like Nginx, Traefik, or Kong, which already serve as gateways. From my observations, these options do not necessarily provide a configuration simplicity that end-users can easily manage. Additionally, it appears that, for the most part, these tools are designed for static values that can be transformed in the response, without the ability to incorporate additional conditions, such as based on the path or specific requests.

If anyone is familiar with a project that addresses similar concerns, I would appreciate some recommendations. Thank you.

### References for API Gateways/Reverse Proxy Server:

- nginx: [https://nginx.org/en/docs/http/ngx_http_proxy_module.html...](https://nginx.org/en/docs/http/ngx_http_proxy_module.html?fbclid=IwAR0GYOk0oVt31DUXdKLbZFN97DXjvInv8M9cs-iHPUHhMFuNPl5fpgrEnyU#proxy_intercept_errors)
- traefik: [https://plugins.traefik.io/.../628c9f.../replace-status-code](https://plugins.traefik.io/plugins/628c9f0f108ecc83915d7771/replace-status-code?fbclid=IwAR0GYOk0oVt31DUXdKLbZFN97DXjvInv8M9cs-iHPUHhMFuNPl5fpgrEnyU)
[https://github.com/traefik/plugin-rewritebody](https://github.com/traefik/plugin-rewritebody?fbclid=IwAR3K6xmlO7XIVY5BLZMeyHglp_V2T8lIDNLoKeoPBsuODYXrnoATTvwrbjg)
[https://github.com/traefik/traefik/issues/2039](https://github.com/traefik/traefik/issues/2039?fbclid=IwAR0fCVUyVz8K_BhBeP6Ggf93kZpyCX0517B853GtfYs_lDoZBZfHQozobZw)
- Kong: [https://docs.konghq.com/hub/kong-inc/response-transformer/](https://docs.konghq.com/hub/kong-inc/response-transformer/?fbclid=IwAR3dOS1Id0f3jo4uWOC8QUNM3BdX9E2jVxCYerjWAZ0g8JrB-yTgU6byVoM)
- YARP [https://github.com/microsoft/reverse-proxy/blob/release/1.1/docs/docfx/articles/transforms.md](https://github.com/microsoft/reverse-proxy/blob/release/1.1/docs/docfx/articles/transforms.md)
- lua-nginx-module: <https://gist.github.com/ejlp12/b3949bb40e748ae8367e17c193fa9602>
- Tyk: <https://tyk.io/docs/advanced-configuration/transform-traffic/response-body/#response-body-transformation>

### References for Stubbing & Double Test:
> Some tools can also be proxy or gateway:

- wiremock: <https://wiremock.org/>
- mountebank: <https://www.mbtest.org/>


## How the spy work?
Modify HTTP Response Reverse Proxy

![image](https://github.com/thaitype/spy-reverse-proxy/assets/3647850/73ea58af-4cea-4e88-bbb7-39374cb8b635)


## Local

build for M1

```
docker buildx build --platform linux/amd64 -t spy . 
docker run --rm -p 3333:3333 spy
```
