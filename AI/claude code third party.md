# Claude Code 第三方中转服务配置指南

## 一、环境变量配置

在终端中设置以下环境变量后启动 Claude Code。

### macOS / Linux

```bash
export ANTHROPIC_BASE_URL="http://118.145.82.210:8787"
export ANTHROPIC_AUTH_TOKEN="sk-your-token"
export ANTHROPIC_SMALL_FAST_MODEL=z-ai/glm-4.5-air
export ANTHROPIC_MODEL=anthropic/claude-sonnet-4.5
```

### Windows

**CMD:**
```cmd
set ANTHROPIC_BASE_URL=http://118.145.82.210:8787
set ANTHROPIC_AUTH_TOKEN=sk-your-token
set ANTHROPIC_SMALL_FAST_MODEL=z-ai/glm-4.5-air
set ANTHROPIC_MODEL=anthropic/claude-sonnet-4.5
```

**PowerShell:**
```powershell
$env:ANTHROPIC_BASE_URL="http://118.145.82.210:8787"
$env:ANTHROPIC_AUTH_TOKEN="sk-your-token"
$env:ANTHROPIC_SMALL_FAST_MODEL="z-ai/glm-4.5-air"
$env:ANTHROPIC_MODEL="anthropic/claude-sonnet-4.5"
```

### 持久化配置（可选）

如果不想每次都设置环境变量，可以编辑配置文件 `~/.claude/settings.json`（如不存在请手动创建）：

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "sk-your-token",
    "ANTHROPIC_BASE_URL": "http://118.145.82.210:8787",
    "ANTHROPIC_SMALL_FAST_MODEL": "z-ai/glm-4.5-air",
    "ANTHROPIC_MODEL": "anthropic/claude-sonnet-4.5"
  },
  "primaryApiKey": "crs",
  "model": "anthropic/claude-sonnet-4.5"
}
```

**配置文件路径：**

| 系统 | 路径 |
|------|------|
| macOS / Linux | `~/.claude/settings.json` |
| Windows | `C:\Users\你的用户名\.claude\settings.json` |

## 二、启动

配置完成后，在终端中运行：

```bash
claude
```

---

## 三、在 VSCode 中使用 Claude Code

### 1. 安装插件

在 VSCode 扩展商店搜索 **Claude Code** 并安装，或直接访问：

https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code

### 2. 配置

VSCode 插件会自动读取 `~/.claude/settings.json` 配置文件（参见上文"持久化配置"章节）。

**注意**：VSCode Claude Code 插件暂时没有办法指定模型，也就是上面设置的 ANTHROPIC_MODEL 等参数没有用