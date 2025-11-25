#  surge 二期

## 日志

首页的 events 可以看到一些日志

more - settings - advanced - show log

## 搭配 mihomo，sub store 使用

surge 支持的协议有点少，然后如果想用 vless 协议的话，你可以用 mihomo 来实现，这个要搭配 sub store 使用比较方便

## 全局模式

## 局域网 网关

在 Surge Mac 中启用“增强模式”或“VM 网关”。

将需要被接管的设备的网关地址修改为 Surge Mac 所在设备的 IP 地址

将其 DNS 服务器地址修改为 198.18.0.2

这里还可以让 surge 配置 dhcp

## http 代理/socks5 代理

## quic

surge 是默认阻断 quic 的

阻断 quic 的好处是防止客户端自己解析 dns 这样分流规则就失效了

当然你可以配置不阻断

## snell 协议

snell 是 surge 推出的代理协议，不开源，发布服务端的二进制

## 增强模式 utm 虚拟机

打开 surge 时 并且启动增强模式 共享网络 就可以代理虚拟机

当出现网络问题，比如企业微信下载文件失败，可尝试关闭增强模式
