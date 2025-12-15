+ claude code 安装

## 命令行工具安装方法

### macOS / Linux

**方式一：官方脚本**

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**方式二：Homebrew (仅 macOS)**

```bash
brew install --cask claude-code
```

### Windows

```powershell
irm https://claude.ai/install.ps1 | iex
```

### NPM (跨平台)

```bash
npm install -g @anthropic-ai/claude-code
```
+ claude code 使用三方供应商 → [详细文档](claude%20code%20third%20party.md)
+ claude.md 支持 rules

## CLAUDE.md 记忆系统

CLAUDE.md 是 Claude Code 的**记忆和指令文件**，用于存储项目级、个人级或企业级的指令和上下文信息，让 Claude 记住你的工作流程、编码风格和项目特定的约定。

### 支持的位置（优先级层次）

| 类型 | 位置 | 作用域 | 用途 |
|------|------|-------|------|
| 企业政策 | macOS: `/Library/Application Support/ClaudeCode/CLAUDE.md`<br>Linux: `/etc/claude-code/CLAUDE.md`<br>Windows: `C:\Program Files\ClaudeCode\CLAUDE.md` | 组织全局 | 公司编码标准、安全政策 |
| 项目记忆 | `./CLAUDE.md` 或 `./.claude/CLAUDE.md` | 项目级 | 项目架构、编码标准、工作流程 |
| 项目规则 | `./.claude/rules/*.md` | 项目级 | 模块化的主题特定指令 |
| 用户记忆 | `~/.claude/CLAUDE.md` | 用户全局 | 个人代码风格偏好 |
| 本地项目记忆 | `./CLAUDE.local.md` | 项目级（本地） | 个人的项目特定偏好（自动加入 .gitignore） |

### 基础格式示例

```markdown
# 项目名称

## 语言
请使用中文

## 项目概述
项目的简要说明

## 代码风格指南
- 使用 2 空格缩进
- 驼峰命名法用于变量

## 常用命令
- 构建：`npm run build`
- 测试：`npm run test`
```

### 导入其他文件

使用 `@path/to/import` 语法导入其他文件：

```markdown
项目概述请参考 @README.md

Git 工作流程：@docs/git-instructions.md

个人偏好：@~/.claude/my-preferences.md
```

### 模块化规则系统

对于大型项目，可以使用 `.claude/rules/` 目录组织模块化指令：

```
your-project/
├── .claude/
│   ├── CLAUDE.md           # 主项目指令
│   └── rules/
│       ├── code-style.md   # 代码风格指南
│       ├── testing.md      # 测试规范
│       ├── security.md     # 安全要求
│       └── frontend/
│           └── react.md    # React 特定规则
```

### 路径特定规则

规则可以使用 YAML frontmatter 的 `paths` 字段限制应用范围：

```markdown
---
paths: src/api/**/*.ts
---

# API 开发规则

- 所有 API 端点必须包含输入验证
- 使用标准错误响应格式
```

支持的 glob 模式：

| 模式 | 匹配范围 |
|------|---------|
| `**/*.ts` | 任何目录下的所有 TypeScript 文件 |
| `src/**/*` | `src/` 目录下的所有文件 |
| `*.md` | 项目根目录的 Markdown 文件 |
| `{src,lib}/**/*.ts` | 多个模式匹配 |

### 快速创建

使用内置命令快速创建 CLAUDE.md：

```bash
/init    # 自动生成包含项目信息的 CLAUDE.md
/memory  # 查看已加载的内存文件
```
+ 自定义 slash commands
+ hooks
+ skills
+ plugins 
+ 粘贴图片
+ vscode 插件

选中项目文件、文件若干行，ctrl/command + alt/options +  k，把上下文放到插件中去

+ mcp