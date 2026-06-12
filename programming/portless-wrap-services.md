# Portless 包裹任意服务

## 工作原理

portless 是一个**本地反向代理 + 域名路由器**，默认监听在 `:1355` 端口，配合系统 DNS 将 `*.localhost` 流量统一接管。

```
浏览器请求 api.myapp.localhost
    ↓
portless（监听 :1355，系统 DNS 将 *.localhost 指向它）
    ↓
根据子域名路由到对应服务的随机端口（如 :52341）
    ↓
实际服务进程
```

**启动服务时的流程：**

1. 执行 `portless api.myapp uv run main.py`
2. portless 随机分配一个空闲端口，注入 `PORT=52341` 环境变量
3. 服务进程监听 `:52341`
4. portless 注册路由：`api.myapp.localhost` → `localhost:52341`
5. 浏览器访问 `api.myapp.localhost`，portless 转发流量

`portless alias` 跳过了第 2-3 步，直接给已在运行的服务注册域名路由。

## portless 直接包裹任意服务

只要服务支持 `PORT` 环境变量，portless 就能直接包裹：

```bash
portless api.myapp uv run --env-file settings.env main.py   # FastAPI / uvicorn
portless user.myapp bun --bun next dev                       # Next.js
portless brain.myapp bun proxy.mjs                           # 自定义代理
```

portless 自动分配端口并注入 `PORT`，服务启动后通过 `.localhost` 域名访问，无需手动管理端口。

## portless alias——代理已有端口

portless 不只能包裹启动命令，也可以直接给一个已在运行的服务注册域名：

```bash
portless alias <name> <port>          # 注册静态路由
portless alias <name> <port> --force  # 覆盖已有路由
portless alias --remove <name>        # 删除路由
```

适合场景：Docker 容器、已有后端服务、不想改启动命令的服务。

## 为什么不能完全替代 proxy.mjs

portless alias 只做端口转发，**不能修改响应头**。

如果需要把页面嵌入 iframe，浏览器会被以下响应头阻止：

- `x-frame-options`
- `content-security-policy`

这种情况需要在 portless 和目标服务之间加一层代理，在代理层删掉这两个响应头。

## proxy.mjs 方案

```js
import http from "http";
import httpProxy from "http-proxy";

const TARGET = process.env.PROXY_TARGET || "http://localhost:3000";
const PORT = process.env.PORT || 8010;

const proxy = httpProxy.createProxyServer({ target: TARGET, changeOrigin: true });

proxy.on("proxyRes", (proxyRes) => {
  delete proxyRes.headers["x-frame-options"];
  delete proxyRes.headers["content-security-policy"];
});

proxy.on("error", (err, req, res) => {
  res.writeHead(502);
  res.end(`Proxy error: ${err.message}`);
});

http.createServer((req, res) => proxy.web(req, res)).listen(PORT, () => {
  console.log(`Proxy :${PORT} -> ${TARGET}`);
});
```

安装依赖：

```bash
bun add http-proxy
```

## 完整架构

```
portless (域名 + 端口分配)
  └─> proxy.mjs (删除 iframe 限制响应头)
        └─> Next.js dev server
```

启动方式：

```bash
portless brain.myapp bun proxy.mjs
```

portless 注入 `PORT` 环境变量给 proxy.mjs，proxy.mjs 再把流量转发给 Next.js。
