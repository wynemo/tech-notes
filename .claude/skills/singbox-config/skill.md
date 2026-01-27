# 生成 Sing-box 配置

将 v2ray/clash 订阅或 URI 转换为 Sing-box 完整配置。

## 支持的协议

- Shadowsocks (ss)
- ShadowsocksR (ssr)
- VMess
- VLESS (包括 Reality)
- Trojan
- Hysteria / Hysteria2
- TUIC
- WireGuard

## 执行方法

脚本位于当前 skill 目录下，使用时需先 cd 到该目录:

```bash
cd .claude/skills/singbox-config

# 基本用法
echo "订阅内容" | node cli.js

# 指定版本
echo "订阅内容" | node cli.js -v 1.12

# 从文件读取
node cli.js -i subscription.txt -o config.json

# 使用 bun (更快)
echo "订阅内容" | bun cli.js -v 1.11
```

## 命令行参数

| 参数 | 说明 |
|------|------|
| `-v, --version` | Sing-box 版本 (1.11 或 1.12，默认 1.11) |
| `-i, --input` | 输入文件路径 |
| `-o, --output` | 输出文件路径 |
| `-h, --help` | 显示帮助信息 |

## 输入格式

支持以下三种输入:
1. Base64 编码的 v2ray 订阅
2. 多行 URI (每行一个节点)
3. 混合格式

## 输出特性

- 节点自动按地区分组 (港/台/日/新/美)
- 包含完整的 DNS、路由规则配置
- 支持 Clash API 面板

## 文件结构

```
singbox-config/
├── skill.md        # Skill 说明
├── cli.js          # CLI 入口
├── test.js         # 协议解析核心
├── 1.11/
│   ├── sing-box.js    # 配置处理
│   └── sing-box.json  # 模板
└── 1.12/
    ├── sing-box.js
    └── sing-box.json
```

## 参考资源

- 在线工具: https://singbox-to-uri.pages.dev/singbox_full_config
- 视频教程: https://www.youtube.com/watch?v=OEhebRFrzA4
- GitHub: https://github.com/wynemo/v2ray-to-sing-box
