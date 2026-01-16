# QuantumultX 链式代理配置指南

链式代理（Proxy Chain）允许流量经过多个代理节点转发，常用于：
- 解锁特定服务（如 OpenAI）
- 提高隐私性
- 绕过某些限制

## 工作原理

```
设备 → 中转节点（机场） → 落地 VPS → 目标网站
```

## 配置步骤

### 1. 配置资源解析器

在 `[general]` 中添加：

```ini
[general]
resource_parser_url = https://raw.githubusercontent.com/KOP-XIAO/QuantumultX/master/Scripts/resource-parser.js
```

### 2. 配置落地 VPS 节点

在 `[server_local]` 中添加你的落地 VPS 节点，tag 命名为 `vps`：

```ini
[server_local]
shadowsocks=your_domain:5443,method=2022-blake3-aes-256-gcm,password=DgrOjcmCMEr97iLy2V99BUelOI2b08vApCrR+osYsJs=, fast-open=true, udp-relay=true, tag=vps-落地节点
```

### 3. 配置分流规则

在 `[filter_local]` 中，将落地 VPS 的 IP 指向中转节点策略组：

```ini
[filter_local]
# 让访问 VPS 的流量走机场中转
ip-cidr, vps_ip/32, 节点选择
```

> **说明**：`vps_ip` 替换为你实际的 VPS IP 地址，`节点选择` 是你的机场策略组名称。

### 4. 配置远程分流规则

在 `[filter_remote]` 中，使用 `#via=` 参数指定代理链：

```ini
[filter_remote]
# OpenAI 规则走代理链
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/QuantumultX/OpenAI/OpenAI.list#via=%TUN%, tag=🤖OpenAI, force-policy=OpenAI, update-interval=172800, opt-parser=true, enabled=true
```

### 5. 配置策略组

在 `[policy]` 中配置策略组：

```ini
[policy]
# 机场节点选择策略组
static=节点选择, 自动选择, 香港, 台湾, 日本, 韩国, 新加坡, 美国, PROXY, DIRECT, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/Static.png

# OpenAI 专用策略组，选择 vps 即可走代理链
static=OpenAI, vps-落地节点, DIRECT, 香港, 台湾, 日本, 韩国, 新加坡, 美国, 节点选择, img-url=https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Bot.png
```

## 使用方法

1. 在 `OpenAI` 策略组中选择 `vps-落地节点`
2. 流量路径：`设备 → 机场节点 → VPS → OpenAI`

## 注意事项

- 确保 VPS 节点的 tag 名称与策略组中引用的名称一致
- `ip-cidr` 规则中的 IP 必须是 VPS 的实际公网 IP
- 中转节点需要能够正常访问你的 VPS

## 自定义规则

在 `[filter_local]` 中可以添加自定义分流规则，实现指定域名走代理链：

```ini
[filter_local]
host-suffix, xxx.com, vps, via-interface=%TUN%
```

**规则格式说明**：
- `host-suffix`：匹配域名后缀
- `xxx.com`：要匹配的域名
- `vps`：使用的策略（即落地 VPS 节点）
- `via-interface=%TUN%`：通过 TUN 接口实现链式代理
