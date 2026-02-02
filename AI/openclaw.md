# OpenClaw 部署

## 视频教程

https://youtu.be/50CZp5NarFA

## 前置要求

### Linux 服务器
- 服务器地址：`root@your.server.info`
- 需要配置 SSH 免密登录（`ssh root@your.server.info` 可以直接登陆）
- 服务器需要安装好 docker，以及能正常访问外网
- 这个服务器可以在莱卡云这里购买，比如香港的 vps

### Telegram Bot
- 使用 BotFather 创建机器人，获取 Token 和机器人 ID
- 用户 ID：向 @userinfobot 发送消息获取（一串数字）

### Claude Code

需要使用 Claude Code 或其他支持 Skills 的 AI 工具。本文档以 Claude Code 为例进行说明。

## 配置信息

### 1. Anthropic API 代理

| 项目 | 值 |
|------|-----|
| Base URL | `http://1.2.3.4:3000` |
| API Key | `sk-your-key` |

### 2. Telegram Bot

| 项目 | 值 |
|------|-----|
| Bot | `@your_bot` |
| Token | `your bot token` |
| DM 策略 | `allowlist`（仅白名单用户可用） |
| 允许用户 | `user id 为一串数字` |
| 群组策略 | `disabled` |

## 部署步骤

### 1. 创建工作目录并克隆配置

打开终端，执行以下命令：

```bash
cd /tmp/
mkdir openclaw_test
cd openclaw_test
git clone https://github.com/wynemo/my-claude-skills .claude
```

### 2. 使用 Claude Code 部署

打开 Claude Code，执行部署命令：

```bash
/openclaw-deploy
```

根据提示输入上面准备的配置信息：
- Anthropic API 代理信息（Base URL 和 API Key）
- Telegram Bot 信息（Bot、Token、允许用户 ID 等）

### 3. 等待部署完成

部署过程需要构建 Docker 镜像，可能需要较长时间，请耐心等待。

## 使用示例

部署完成后，可以向 Telegram Bot 发送消息进行交互：

- **抓取热门新闻**：让 Bot 抓取 Hacker News 最热的新闻
- **图片分析**：发送图片让 AI 分析说明
- **智能对话**：进行各种对话和任务处理