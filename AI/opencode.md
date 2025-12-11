# OpenCode

如果你想在本地快速体验 AI 辅助写代码，可以试试 [OpenCode](https://github.com/sst/opencode)。

安装完成后即可使用 Zen 提供的 `x-ai/grok-code-fast-1` 免费模型，不需要登录，直接就能运行，使用体验比较顺畅。

## 前置要求

使用 OpenCode 前，需要一个现代化终端（任选其一）：

| 终端 | 支持平台 |
|------|----------|
| [WezTerm](https://wezfurlong.org/wezterm/) | 跨平台 |
| [Alacritty](https://alacritty.org/) | 跨平台 |
| [Ghostty](https://ghostty.org/) | Linux / macOS |
| [Kitty](https://sw.kovidgoyal.net/kitty/) | Linux / macOS |

## Windows 安装方式

### 使用 Chocolatey

```bash
choco install opencode
```

### 使用 Scoop

```bash
scoop bucket add extras
scoop install extras/opencode
```

### 使用 NPM

```bash
npm install -g opencode-ai
```

---

整体安装和使用都比较简单，适合想快速尝试本地 AI 辅助开发的用户。



## 权限系统

OpenCode 实现了细粒度的权限模型，控制哪些操作需要用户批准后才能执行。

### 权限级别

三种状态控制工具行为：

| 状态 | 说明 |
|------|------|
| `ask` | 运行前需要用户批准 |
| `allow` | 无需批准直接运行 |
| `deny` | 完全禁用该工具 |

### 可配置的工具

五个工具支持权限控制：

| 工具 | 功能 |
|------|------|
| `edit` | 文件修改操作 |
| `bash` | 命令执行（支持针对特定命令） |
| `webfetch` | LLM 获取网页内容 |
| `doom_loop` | 检测重复的相同工具调用（连续 3 次相同尝试后触发） |
| `external_directory` | 访问项目目录外的文件操作 |

### 默认配置

大多数操作默认为 `allow`，而 `doom_loop` 和 `external_directory` 默认为 `ask` 以确保安全。

### Bash 高级控制

bash 权限支持细粒度配置：
- 单独针对特定命令
- 使用通配符（`*`、`?`）匹配命令系列
- 用特定规则覆盖通配符

例如：禁止所有 Terraform 命令，同时允许特定的 git 操作。

### Agent 级别覆盖

可以为每个 Agent 单独配置权限，根据 Agent 的角色和用途设置不同的限制级别。

更多详情请参考 [官方文档](https://opencode.ai/docs/permissions/)

