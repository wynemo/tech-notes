## 规则

创建一个 CLAUDE.md

## vps

我也没有用家宽，就用的一台洛杉矶的 vps 然后用野卡充钱，月付，目前用了几天，没有翻车，账号是注册了好几年的

## 分流规则

```
# claude
DOMAIN-SUFFIX,servd-anthropic-website.b-cdn.net
DOMAIN-SUFFIX,anthropic.com
DOMAIN-SUFFIX,claude.ai
DOMAIN-SUFFIX,claudeusercontent.com
DOMAIN-SUFFIX,intercomcdn.com
DOMAIN-SUFFIX,cdn.usefathom.com
# stripe
DOMAIN-SUFFIX,stripe.com
DOMAIN-KEYWORD,stripe
```

## claude 计划模式

shift + tab 就可以切换过去

你可以给你的需求，先让它自动创建一个计划

你可以审视它的计划，并且决定是否执行

觉得不好 可以告诉它调整

它会创建一堆 todos 然后逐渐实现

## 自动接受

同样 shift + tab 就可以切换过去，然后让它自己写代码，不用你确认了

## 调用 gemini
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