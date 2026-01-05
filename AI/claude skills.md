# Claude Skills

## 什么是 Claude Skills？

Claude Skills 是一种扩展 Claude Code 功能的模块化能力系统。它通过包含指令、脚本和资源的文件夹，让 Claude 能够自主处理特定任务。

**核心特点：**
- **自动发现**：与需要手动触发的 slash commands 不同，Skills 可以被 Claude 自动识别和使用
- **模块化**：每个 Skill 专注于一个能力领域
- **可共享**：团队成员可以共享和复用 Skills

## Skills 的存储位置

Skills 可以在三个层级创建：

| 层级 | 路径 | 用途 |
|------|------|------|
| 个人级 | `~/.claude/skills/` | 个人使用的 Skills |
| 项目级 | `.claude/skills/` | 团队共享，随项目分发 |
| 插件级 | 插件目录中 | 通过插件分发 |

## 如何创建 Skill

### 1. 创建目录结构

```
.claude/skills/my-skill/
├── SKILL.md          # 必需：Skill 定义文件
├── reference.md      # 可选：参考文档
├── examples.md       # 可选：使用示例
└── scripts/          # 可选：脚本文件
```

### 2. 编写 SKILL.md

```yaml
---
name: my-skill
description: 详细描述这个 Skill 的功能和使用场景
---

# Skill 指令内容

在这里写具体的指令和说明...
```

**重要**：`description` 字段非常关键，它决定了 Claude 何时会使用这个 Skill。

### 3. 好的 description 示例

❌ **不好的写法**：
```yaml
description: 帮助处理数据
```

✅ **好的写法**：
```yaml
description: 分析 Excel 电子表格，生成数据透视表，创建图表——当处理 .xlsx 文件时使用
```

## Skills vs Slash Commands

| 特性 | Skills | Slash Commands |
|------|--------|----------------|
| 触发方式 | Claude 自动识别 | 用户手动输入 `/命令` |
| 文件结构 | 可包含多个文件 | 单个 .md 文件 |
| 复杂度 | 适合复杂工作流 | 适合简单重复任务 |
| 发现性 | 基于描述自动匹配 | 需要用户记住命令 |

**选择建议**：
- 重复执行相同提示 → Slash Commands
- 需要多文件或脚本支持 → Skills
- 需要 Claude 自动判断使用时机 → Skills
- 团队标准化复杂流程 → Skills

## VSCode 插件中使用 Skills

Claude Code 的 VSCode 插件已支持通过 slash commands 调用 skills。在聊天框中输入 `/skill-name` 即可快速调用对应的 skill。

### 使用方式

1. 在 VSCode 中打开 Claude Code 面板
2. 在输入框中输入 `/` 会显示可用的 skills 列表
3. 选择或输入完整的 skill 名称（如 `/git-commit`）
4. 按回车执行

### 查看可用 Skills

在命令行工具中，使用 `/skills` 命令可以查看所有可用的 skills 列表：

```bash
/skills
```


## 实用场景

1. **安全审查自动化**：定义安全检查清单和流程
2. **PR 分析工作流**：标准化代码审查流程
3. **文档处理**：处理特定格式的文档（PDF、Excel 等）
4. **代码重构**：按照团队规范进行代码改进
5. **数据转换**：标准化的数据处理管道

## 高级功能

### 工具限制

使用 `allowed-tools` 限制 Skill 可以使用的工具：

```yaml
---
name: read-only-skill
description: 只读分析，不修改任何文件
allowed-tools:
  - Read
  - Glob
  - Grep
---
```

这对于创建安全的只读 Skills 非常有用。

## 调试技巧

如果 Claude 没有使用你的 Skill，检查：

1. **描述是否具体**：包含明确的触发词和使用场景
2. **YAML 语法**：确保正确的缩进，不要使用 tab
3. **文件路径**：确认 SKILL.md 在正确的位置
4. **名称格式**：使用小写字母，最多 64 个字符

## 参考链接

- [Claude Code Skills 官方文档](https://docs.anthropic.com/en/docs/claude-code/skills)

## 视频

https://www.youtube.com/watch?v=fOxC44g8vig
