# 手机端生成 Sing-box 配置教程

## 背景

经常有朋友问有了节点，订阅链接，怎么使用 sing-box

之前分享过一个在浏览器生成 Sing-box 配置的工具，但对手机用户不够友好。本次对工具进行了改造，可以直接在手机浏览器上生成配置。

## 工具特点

- **纯前端工具**：不会上传节点信息到服务器，可以放心使用
- **部署平台**：已部署到 Cloudflare Pages，也支持自行部署
- **访问地址**：https://singbox-to-uri.pages.dev/singbox_full_config

## 支持的配置格式

工具支持以下三种输入格式：

1. Clash YAML 配置
2. Base64 编码的 v2ray 订阅
3. 多行 URI

## 使用步骤

### 1. 打开工具页面

在手机 Chrome 浏览器中打开：
```
https://singbox-to-uri.pages.dev/singbox_full_config
```

### 2. 获取订阅内容

- 找到机场的订阅 URL
- 访问订阅链接，获取 Base64 编码的内容

### 3. 生成配置

1. 将订阅内容粘贴到输入框
2. 选择 Sing-box 版本（1.11 或 1.12，默认为 1.11）
3. 点击"生成完整配置"按钮

### 4. 应用配置

将生成的配置复制到 Sing-box 应用中即可使用

## 版本说明

- 目前 iOS App Store 的 Sing-box 版本为 1.11
- 工具默认生成 1.11 版本配置
- 也支持生成 1.12 版本配置