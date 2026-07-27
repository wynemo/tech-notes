# Shadowrocket 使用 Tailscale

Shadowrocket 最近支持了 Tailscale，这样管理内网设备与科学上网可以并行，无需切换 App。

## 获取 Auth Key

1. 登录 [Tailscale 官网](https://login.tailscale.com/)
2. 进入 **Settings → Keys**
3. 点击生成 Key，复制备用

## 配置步骤

1. 打开 Shadowrocket → **配置** → **Tailscale**
2. 填入 Auth Key，点击**启用**
3. 进入**配置 → 常规**，删除 `100.64.0.0` 这条规则（避免与 Tailscale IP 段冲突）
4. 保存后启动 Shadowrocket 总开关

配置完成后即可同时访问 Tailscale 网络内的设备，并正常科学上网。

> 同类功能：Surge 近期也推出了此功能，Sing-box 更早就已支持。
