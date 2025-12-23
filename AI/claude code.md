## 规则

可以用/init 命令创建一个 CLAUDE.md，这个等于说是项目的记忆，比如项目该使用什么语言（中文、英语）、什么架构、注意事项等

注意上下文不要太长，几十行就可以了

## vps

我也没有用家宽，就用的一台洛杉矶的 vps 然后用朋友的英国卡充钱，月付，目前用了几天，没有翻车，账号是注册了好几年的

## 用量

现在可以在这个页面 https://claude.ai/settings/usage 查看用量了

## 分流规则

```
# claude
DOMAIN-SUFFIX,servd-anthropic-website.b-cdn.net
DOMAIN-SUFFIX,anthropic.com
DOMAIN-SUFFIX,claude.com
DOMAIN-SUFFIX,claude.ai
DOMAIN-SUFFIX,claudeusercontent.com
DOMAIN-SUFFIX,intercomcdn.com
DOMAIN-SUFFIX,cdn.usefathom.com
# stripe
DOMAIN-SUFFIX,stripe.com
DOMAIN-KEYWORD,stripe
# cloudflare
DOMAIN-SUFFIX,challenges.cloudflare.com
```

要注意的是需要关闭 QUIC，比如在 mihomo 里需要添加规则，要不然依然可以通过 QUIC 查询 dns 的时候知道你的真实 IP

`- AND,(AND,(DST-PORT,443),(NETWORK,UDP)),(NOT,((GEOSITE,cn))),REJECT`

surge 是默认阻止 QUIC 的

loon 也是可以在节点设置阻断 quic 的

quan x 可以 general 里加一条这个
udp_drop_list=443

## claude 计划模式

shift + tab 就可以切换过去

你可以给你的需求，先让它自动创建一个计划

你可以审视它的计划，并且决定是否执行

觉得不好 可以告诉它调整

它会创建一堆 todos 然后逐渐实现

## 自动接受

同样 shift + tab 就可以切换过去，然后让它自己写代码，不用你确认了

## 跨平台

macos/linux都是支持的
windows 是最近支持的 原生支持 之前只能在 wsl 里使用

## 粘贴图片
有时候需要贴一些设计图给大模型
支持从剪切板粘贴图片的，不过仅限于 macos
macos 上可以用 contrl + command + shift + 4 截图，这里贴到 claude code 的快捷键是 ctrl/command + v
windows 就只能发送图片文件了，用@文件的方式




## 与 IDE 集成
Claude Code 支持与主流集成开发环境（如 Cursor、VSCode）进行深度集成。通过在 IDE 内置终端中运行 Claude Code，并安装相应的扩展程序，可实现无缝的开发体验。

使用 `/ide` 命令可查看当前的集成状态信息。

当 Claude Code 对代码进行修改时，IDE 将实时显示代码变更，开发者可以通过差异对比视图审查并决定是否接受这些更改。

通过快捷键 `Command + Option + K` 可以选择文件或代码片段作为上下文，为 Claude Code 提供更精准的代码环境信息。

## 调用 gemini cli
gemini 自己改总是想太多 不太遵循提示词；它反正暴力发送大量 input tokens 到服务器 用下 google 算力分析下 倒是效果蛮好的
然后根据结果再让 claude code 改

claude code 是可以自定义命令的，只需要在.claude/commands 下创建一个文件夹，然后在这个文件夹下创建一个 md 文件，内容就是你的提示词

比如
```
 # 使用 Gemini CLI 查找问题

  When analyzing large codebases or multiple files that might exceed context limits, use the Gemini CLI with its massive
  context window. Use `gemini -p` to leverage Google Gemini's large context capacity.

  ## use english to ask question to gemini

  ## File and Directory Inclusion Syntax

  Use the `@` syntax to include files and directories in your Gemini prompts. The paths should be relative to WHERE you run the
   gemini command:

  ### Examples:

  **Single file analysis:**
  ```bash
  gemini -p "@src/main.py Explain this file's purpose and structure"

  Multiple files:
  gemini -p "@package.json @src/index.js Analyze the dependencies used in the code"

  Entire directory:
  gemini -p "@src/ Summarize the architecture of this codebase"

  Multiple directories:
  gemini -p "@src/ @tests/ Analyze test coverage for the source code"

  Current directory and subdirectories:
  gemini -p "@./ Give me an overview of this entire project"
```

这样，我们在 claude code 里就可以调用 gemini 命令了，是的，就是麦当劳里吃肯德基

`/gemini 2025-07-01 00:28:12,239 - ERROR - root - commit_widget.py:382 - 显示文件差异失败；提交时查看删除的文件的差异失败`

## hooks

hooks 是在 Claude Code 执行特定操作后触发的自定义脚本功能。它允许用户在工具调用完成后自动执行预定义的命令，例如运行代码质量检查脚本。

一个典型的应用场景是在代码生成完成后播放提示音，以便及时通知用户任务已完成。

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "hooks": {
      "Stop": [
        {
          "matcher": "",
          "hooks": [
            {
              "type": "command",
              "command": "afplay /Users/tommygreen/Downloads/ready-to-work-101soundboards.mp3"
            }
          ]
        }
      ]
  }
}
```

## 压缩上下文

虽然说现在 claude code 可以自动压缩上下文，但你可以使用 `/compact` 手动压缩上下文，这样省一点 token


## vibe tunnel

https://vibetunnel.sh/

通过 vibe tunnel，可以实现更便捷的远程编程体验。在电脑上安装并配置 vibe tunnel 后，手机可以通过网络连接访问电脑终端。这样就能够在浏览器中使用 Gemini 或 Claude Code 等程序，实现移动端的 vibe coding 体验。手机端可通过 EasyTier 等穿透工具建立与电脑的网络连接。

## status line

命令行里，会有PS1展示信息，比如用户名，当前目录等，claude code也可以做到

告诉claude code你用的什么shell（zsh，bash，fish等），运行 /statusline 命令 设置一个命令，它会修改 ~/.claude/settings.json

比如下面的配置就是zsh，状态栏会显示工作目录，该状态栏会显示在 Claude Code 界面底部：

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "model": "sonnet",
  "statusLine": {
    "type": "command",
    "command": "printf '%s@%s %s %%' \"$(whoami)\" \"$(hostname -s)\" \"$(basename \"$(pwd)\")\""
  },
  "feedbackSurveyState": {
    "lastShownTime": 1754102969443
  }
}
```

这个有用，尤其是你多个工程同步进行的时候

## 显示上下文

使用 /context 指令可以将当前上下文使用情况以彩色网格的形式进行可视化展示

## slash commands

slash commands 是 Claude Code 中的自定义命令功能,可以通过在 `.claude/commands/` 目录下创建 markdown 文件来定义。每个文件对应一个命令,文件名就是命令名。

### 创建自定义命令

在项目的 `.claude/commands/` 目录下创建 `.md` 文件,文件内容就是给 Claude Code 的提示词。命令会在输入 `/命令名` 时执行。

### 内置的自定义命令示例

#### /catchup - 查看分支变更

快速了解当前分支的所有改动,适合在切换任务或接手项目时使用。

```markdown
---
description: 读取当前 git 分支中所有变更的文件
---

请读取当前 git 分支相对于主分支的所有变更文件，帮我了解最近的改动。

步骤：
1. 运行 `git diff --name-only main...HEAD` 获取所有变更的文件列表
2. 并行读取所有变更的文件内容
3. 给我一个简洁的总结，说明这个分支主要做了什么改动
```

#### /git-commit - 智能提交

分析代码改动并生成符合项目规范的 commit message,然后自动提交。

```markdown
分析当前的 git 改动并创建提交：

1. **查看改动**:
   - 运行 `git status` 查看所有未跟踪和已修改的文件
   - 运行 `git diff` 查看具体的代码改动
   - 分析修改的文件，和已经在暂存区的文件

2. **分析改动内容**:
   - 识别改动的性质 (新功能、修复、重构、文档等)
   - 理解改动的目的和影响范围
   - 确保改动符合项目规范

3. **生成 commit 信息**:
   - 遵循项目的 commit 风格 (参考最近的 commit 记录)
   - 使用中文编写清晰的 commit message
   - 格式：`<type>: <简短描述>`
     - feat: 新功能
     - fix: 修复 bug
     - refactor: 重构
     - docs: 文档更新
     - chore: 构建/工具更新
     - style: 代码格式调整
     - perf: 性能优化

4. **执行提交**:
   - 将相关文件添加到暂存区
   - 使用生成的 commit message 创建提交
   - 包含 Claude Code 签名

5. **确认结果**:
   - 运行 `git status` 确认提交成功
   - 显示 commit 信息供用户确认
```

### 其他实用命令示例

你可以根据自己的需求创建更多命令,比如:

- `/review` - 代码审查
- `/test` - 运行测试
- `/deploy` - 部署流程
- `/refactor` - 重构建议
- `/gemini` - 调用 Gemini CLI 分析大型代码库

## 自己搭建中转

使用这个项目 https://github.com/Wei-Shaw/claude-relay-service

这是一个开源的Claude Code中转服务，支持：
- 多账户管理（自动轮换）
- 自定义API Key
- 使用统计
- 监控面板
- 支持多种客户端（Claude Code、VSCode、Gemini CLI、Codex CLI等）

### 配置步骤

1. **安装完成后访问管理界面**
   - 访问：`http://你的服务器IP:3000/`
   - 管理员账号在 `data/init.json` 中

2. **添加Claude账户**
   - 点击「Claude账户」→「添加账户」
   - 点击「生成授权链接」完成OAuth授权
   - 复制Authorization Code完成添加

3. **创建API Key**
   - 点击「API Keys」→「创建新Key」
   - 设置使用限制（可选）
   - 保存生成的Key

4. **配置客户端**

   详细配置方法请参考 [Claude Code 第三方中转服务配置指南](claude%20code%20third%20party.md)，将 `ANTHROPIC_BASE_URL` 设置为 `http://你的服务器IP:3000/`。

### 费用估算

- 服务器：30-60 元/月（轻量云服务器）
- Claude 订阅：根据分摊人数确定

### 注意事项

⚠️ **风险提醒**：使用中转可能违反 Anthropic 服务条款，账号封禁风险自负。

**适合场景**：
- 三五个朋友拼车分摊费用
- 隐私敏感不想用第三方镜像
- 有技术基础愿意自己搭建维护

或者购买别人搭建的


## 中转站

### new api

详细部署教程请参考：[New API 部署教程](./New_API部署教程.md)

**技术方案**：可以使用 OpenRouter + New API 自行搭建中转服务，在 new api 上添加 Haiku、Sonnet、Opus 等模型。

**注意事项**：
- API 调用成本较高
- 工具调用稳定性可能不如官方服务

也可以自己找一些中转站点使用
比如 https://wzw.de5.net/ https://anyrouter.top/ 这些站都是公益站 也都是用 new api 搭建的

### y-router

可以使用 openrouter + y-router 搭建中转服务，工具调用稳定性要高些

## 国产模型编程使用 claude code

deepseek、智谱等厂家都提供了 anthropic 的接口
或者也可以使用 new api 转发 
平替：Claude Code + GLM-4.6/Kimi-K2-Thinking/Minimax-M2/deepseek
