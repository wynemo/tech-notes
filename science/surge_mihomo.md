## Sub-Store `_exec` 参数说明

### 概述

`_exec` 是 Sub-Store 中的节点字段，用于指定 mihomo (Clash Meta) 可执行文件的路径。

### 参数详情

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `_exec` | mihomo 可执行文件路径 | `/usr/local/bin/mihomo` |
| `_localPort` | 本地端口号（逐个递减） | `65535` |
| `_defaultNameserver` | 默认 DNS 服务器 | `['180.76.76.76', '52.80.52.52', '119.28.28.28', '223.6.6.6']` |
| `_nameserver` | DoH DNS 服务器 | `['https://doh.pub/dns-query', 'https://dns.alidns.com/dns-query', 'https://doh-pure.onedns.net/dns-query']` |

### 使用场景

当使用 **Surge for macOS** 时，如果遇到 Surge 本身不支持的协议，Sub-Store 会通过 mihomo 作为外部代理程序 (External Proxy Program) 来支援这些协议。

#### 启用方式

1. 手动指定链接参数 `target=SurgeMac`
2. 或在「同步配置」中指定 `SurgeMac`

### 代码实现

源码位置: `backend/src/core/proxy-utils/producers/surgemac.js`

```javascript
function mihomo(proxy, type, opts) {
    const clashProxy = ClashMeta_Producer().produce([proxy], 'internal')?.[0];
    if (clashProxy) {
        const localPort = opts?.localPort || proxy._localPort || 65535;
        const external_proxy = {
            name: proxy.name,
            type: 'external',
            exec: proxy._exec || '/usr/local/bin/mihomo',
            'local-port': localPort,
            args: [
                '-config',
                Base64.encode(JSON.stringify({
                    'mixed-port': localPort,
                    // ... mihomo 配置
                })),
            ],
            addresses: [],
        };
        // ...
    }
}
```

### 使用示例

```json
{"name":"us-ss-落地节点","type":"ss","server":"example.com","port":12345,"cipher":"2022-blake3-aes-256-gcm","password":"your-password-here","_exec":"/opt/homebrew/bin/mihomo"}
```

在这个例子中，`_exec` 指定了 mihomo 的路径为 `/opt/homebrew/bin/mihomo`（Homebrew 安装路径），而非默认的 `/usr/local/bin/mihomo`。

### 工作原理

1. Sub-Store 检测到 Surge 不支持的协议
2. 自动生成 mihomo 配置（包含 DNS、代理节点等）
3. 将配置 Base64 编码后作为参数传递给 mihomo
4. mihomo 作为 Surge 的 External Proxy Program 运行
5. Surge 通过本地端口连接到 mihomo

### 参考链接

- [Sub-Store 链接参数说明](https://github.com/sub-store-org/Sub-Store/wiki/%E9%93%BE%E6%8E%A5%E5%8F%82%E6%95%B0%E8%AF%B4%E6%98%8E)
- [Surge External Proxy 文档](https://manual.nssurge.com/policy/external-proxy.html)
- [详细说明 (Telegram)](https://t.me/zhetengsha/1735)

## 全局守护进程方案

另一种方式是运行一个全局的 mihomo 守护进程，Surge 通过 HTTP 代理连接。

### 配置方式

**1. mihomo 配置（允许局域网连接）**

```yaml
mixed-port: 7890          # 混合端口（HTTP + SOCKS5）
allow-lan: true           # 允许局域网连接
bind-address: "*"         # 绑定所有地址
```

**2. Surge 添加代理 [Proxy]**

```
mihomo = http, 127.0.0.1, 7890
```

**3. Surge 添加规则 [Rule]（放在靠前位置，避免循环代理）**

```
PROCESS-NAME,mihomo,DIRECT
```

### 两种方案对比

| | Sub-Store `_exec` 方案 | 全局守护进程方案 |
|---|---|---|
| 进程数量 | 每个节点一个 mihomo 进程 | 只有一个 mihomo 守护进程 |
| 僵尸进程 | 可能产生 | 不会（launchd 管理） |
| 配置复杂度 | 节点级别配置 | 统一配置 |
| 资源占用 | 较高 | 较低 |
| 适用场景 | 少量特殊协议节点 | 大量节点/长期使用 |
