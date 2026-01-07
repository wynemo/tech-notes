# Surge 二期

## 基础功能

### 日志查看

Surge 提供两种日志查看方式：

1. **首页事件日志**：首页的 Events 区域可查看基本日志
2. **详细日志**：More → Settings → Advanced → Show Log

### 协议扩展

Surge 原生支持的协议有限，如需使用 vless + reality 等协议，可通过 Mihomo 代理。建议配合 Sub Store 管理订阅，操作更便捷。

### Snell 协议

Snell 是 Surge 官方推出的代理协议，特点：

- 不开源
- 仅发布服务端二进制文件

---

## 代理模式

### HTTP/SOCKS5 代理

Surge 支持作为 HTTP 代理和 SOCKS5 代理服务器，供局域网内其他设备使用。

### 全局模式

开启全局模式后，所有流量都会经过 Surge 处理，适合需要完全代理的场景。

### 临时规则

临时规则是指在 Surge 中临时添加的规则，不会保存到配置文件中。

- 在 Chrome 打开网页时，会出现「Add Rule for Current Webpage...」选项
- 在 Dashboard 中，也可以为域名、进程名添加规则

---

## 网络设置

### QUIC 阻断

Surge 默认阻断 QUIC 协议。

**阻断原因**：QUIC 会导致客户端绕过 Surge 自行解析 DNS，使分流规则失效。

如有需要，可在设置中关闭阻断。

### 增强模式与虚拟机

开启增强模式并启用网络共享后，可代理 UTM 等虚拟机的流量。

**注意**：如遇到网络问题（如企业微信下载文件失败），可尝试关闭增强模式排查。

---

## 局域网网关

将 Surge Mac 作为网关，代理局域网内其他设备的流量：

1. 在 Surge Mac 中启用「增强模式」或「VM 网关」
2. 将需要代理的设备网关地址设为 Surge Mac 的 IP 地址
3. 将 DNS 服务器地址设为 `198.18.0.2`

此外，Surge 还支持配置 DHCP 服务，自动为设备分配网络配置。

**查看 Remote Clients**：在 Surge Dashboard 中可以看到 remote clients 的网络活动，位于 local clients 之下。

---

## 远程控制

Surge 支持远程控制和无人值守模式，可通过以下方式实现：

### Remote Controller

- **Allow**：勾选后允许 Surge Dashboard 从其他机器访问
- **Port**：默认端口 6170
- 需要设置密码用于身份验证

### HTTP API

- **Allow**：启用后可使用 HTTP API 控制 Surge
- **Port**：默认端口 6166
- **HTTPS**：启用 HTTPS 加密
- **Allow access from other machines**：允许其他机器访问 API
- 需要设置 API 密码

启用 HTTP API 后，可通过编程方式控制 Surge，详见官方手册。

### Web Dashboard

- **Enable**：启用后可通过浏览器控制 Surge
- 前提条件：必须先启用 HTTP API
- Web Dashboard 与 HTTP API 共享同一端口
