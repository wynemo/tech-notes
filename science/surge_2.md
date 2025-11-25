# Surge 二期

## 日志查看

Surge 提供两种日志查看方式：

1. **首页事件日志**：首页的 Events 区域可查看基本日志
2. **详细日志**：More → Settings → Advanced → Show Log

## 搭配 Mihomo 和 Sub Store 使用

Surge 原生支持的协议有限，如需使用 VLESS 等协议，可通过 Mihomo 实现。建议配合 Sub Store 管理订阅，操作更便捷。

## 代理模式

### HTTP/SOCKS5 代理

Surge 支持作为 HTTP 代理和 SOCKS5 代理服务器，供局域网内其他设备使用。

### 全局模式

开启全局模式后，所有流量都会经过 Surge 处理，适合需要完全代理的场景。

### 临时规则

临时规则是指在 Surge 中临时添加的规则，不会保存到配置文件中。

你在 chrome 打开网页时，会出现一个“Add Rule for Current Webpage..”
在 dashboard 中，也可以为域名、进程名添加规则


## 局域网网关

将 Surge Mac 作为网关，代理局域网内其他设备的流量：

1. 在 Surge Mac 中启用「增强模式」或「VM 网关」
2. 将需要代理的设备网关地址设为 Surge Mac 的 IP 地址
3. 将 DNS 服务器地址设为 `198.18.0.2`

此外，Surge 还支持配置 DHCP 服务，自动为设备分配网络配置。

## QUIC 阻断

Surge 默认阻断 QUIC 协议。

**阻断原因**：QUIC 会导致客户端绕过 Surge 自行解析 DNS，使分流规则失效。

如有需要，可在设置中关闭阻断。

## Snell 协议

Snell 是 Surge 官方推出的代理协议，特点：

- 不开源
- 仅发布服务端二进制文件

## 增强模式与虚拟机

开启增强模式并启用网络共享后，可代理 UTM 等虚拟机的流量。

**注意**：如遇到网络问题（如企业微信下载文件失败），可尝试关闭增强模式排查。
