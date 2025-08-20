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
反直觉吧
windows 就只能发送图片文件了，用@文件的方式


## 调用 gemini
## hooks

比如代码完成一个变化，就可以触发一个 hook，然后在这个 hook 里你可以执行一些动作，比如播放一个音乐


## 与 IDE 集成
比如 cursor，可安装扩展，当 claude code 变更代码时，可以在 IDE 里看代码的变化，然后看是否接受

用 command + option + k 可以选中文件，或者文件的一部分，作为上下文

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

hooks 就是可以在 claude code 完成一些动作以后，做一些事情
比如跑一个代码检查脚本啊

我是在它写完代码以后播放一个音乐，这样提醒我完成了

## 压缩上下文

虽然说现在 claude code 可以自动压缩上下文，但你可以使用 `/compact` 手动压缩上下文，这样省一点 token


## vibe tunnel

https://vibetunnel.sh/

通过 vibe tunnel，可以实现更便捷的远程编程体验。在电脑上安装并配置 vibe tunnel 后，手机可以通过网络连接访问电脑终端。这样就能够在浏览器中使用 Gemini 或 Claude Code 等程序，实现移动端的 vibe coding 体验。手机端可通过 EasyTier 等穿透工具建立与电脑的网络连接。
