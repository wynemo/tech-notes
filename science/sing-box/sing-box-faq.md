## sing-box 启动报srs下载错误

```json
{
  "tag": "apple_ip",
  "type": "remote",
  "format": "binary",
  "url": "https://ghfast.top/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/sing/geo-lite/geoip/apple.srs",
  "download_detour": "direct"
}
```

download_detour设置为一个节点/策略

## 跑sing-box裸核，一定要开启"sniff_override_destination": true才能科学

1. 有可能是开启了ipv6，使用了ipv6的dns，可以关闭ipv6
2. 也可能客户端是走了DoT/DoH的解析
