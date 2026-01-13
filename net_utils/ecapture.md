# eCapture (旁观者)

基于 eBPF 技术的 Linux/Android 工具，可以在**不需要 CA 证书**的情况下捕获 SSL/TLS 加密流量的明文。

## 功能支持

| 模块 | 支持的库/应用 |
|------|--------------|
| TLS/SSL 捕获 | OpenSSL、BoringSSL、GnuTLS、NSS |
| Go TLS | Go 原生 crypto/tls 实现 |
| 数据库审计 | MySQL 5.6/5.7/8.0+、PostgreSQL 10+ |
| Shell 审计 | Bash 命令捕获 |

## 系统要求

- Linux 内核：x86_64 4.18+ 或 aarch64 5.5+
- 需要 ROOT 权限
- **不支持** Windows/macOS

## 安装

```bash
# Docker 安装
docker pull gojue/ecapture:latest

# 或下载预编译二进制文件
# https://github.com/gojue/ecapture/releases
```

## 捕获模式

- **Pcap/PcapNG**: 将明文存储为 pcap-NG 文件，可用 Wireshark 分析
- **Keylog**: 导出 TLS 主密钥，供外部解密数据包
- **Text**: 直接输出明文到控制台或文件

## 基本用法

```bash
# 捕获所有 TLS 流量
sudo ecapture tls

# Pcap 模式，指定网卡
sudo ecapture tls -m pcap -i eth0

# 捕获 Go TLS 流量
sudo ecapture gotls --elfpath=/path/to/binary
```

## 抓取容器中的 Go 程序

以 new-api 为例：

```bash
ecapture gotls --elfpath=/proc/$(pgrep -f '/new-api' | head -1)/root/new-api --hex > /tmp/1.hex
```

**注意**: Go 程序编译时不能使用 `-s -w` 标志，需要保留符号表才能正常抓取。

- `-s`: 移除符号表（会导致 eCapture 无法定位 TLS 函数）
- `-w`: 移除调试信息

参考: [wynemo/new-api#1](https://github.com/wynemo/new-api/pull/1/changes)

## 高级功能

- **动态配置**: 通过 HTTP API 运行时更新参数
- **事件转发**: 可集成 Burp Suite 等工具
- **eCaptureQ**: 跨平台 GUI 客户端（基于 Rust/Tauri/React）

## 参考链接

- GitHub: https://github.com/gojue/ecapture
