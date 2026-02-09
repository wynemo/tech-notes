# Conductor — 并行运行多个 coding agent 的 Mac 应用

## 什么是 Conductor？

[Conductor](https://www.conductor.build/) 是一款 Mac 应用，可以同时运行多个 coding agent（支持 Claude Code 和 OpenAI Codex），基于 ACP（Agent Communication Protocol）协议通信。每个 agent 在一个隔离的代码库副本（git worktree）中工作，互不干扰。你可以一览所有 agent 的工作状态，然后 review 和合并它们的改动。

由 Melty Labs（Charlie Holtz & Jackson de Campos）开发，YC 孵化。

## 安装

直接去 [conductor.build](https://www.conductor.build/) 下载 dmg 安装即可。目前只支持 macOS，Windows 有 waitlist。

前提条件：
- 需要已安装 Claude Code（`npm install -g @anthropic-ai/claude-code`）或 OpenAI Codex
- 需要 GitHub 仓库（Conductor 基于 git worktree 工作）
- 各 agent 的认证会直接继承，Claude Code 支持 API key 或 Claude Pro/Max 订阅
- Conductor 通过 ACP 协议与 agent 通信，支持所有兼容 ACP 的 coding agent

Conductor 本身免费，不收费，费用走各自的 API 或订阅计划。

## 核心概念

### Workspace（工作区）

每个 workspace 是你仓库的一个隔离副本（git worktree），里面跑一个独立的 Claude Code。你可以同时开多个 workspace 并行处理不同任务。

### 典型工作流

1. 打开 Conductor，选择你的 GitHub 仓库
2. 一键创建新 workspace，给 Claude 分配任务
3. 同时再开几个 workspace，处理其他任务
4. 在 Diff Viewer 中 review 各个 agent 的改动，可以在代码行上添加评论
5. 评论会发送给 AI，AI 根据评论自动修改代码
6. 也可以让另一个 AI 审核代码，比如用 Claude Code 写代码，再用 Codex 来 review
7. 满意后让 agent 创建 PR 或合并代码

## 主要功能

### 并行 Agent
同时运行多个 Claude Code，每个在独立 worktree 中工作。三个线程并行跑，效率远超 3 倍——因为你可以比较不同方案，选最好的。

### Diff Viewer
内置的 diff 查看器，可以看到每个 Claude 对代码库做了什么改动，方便 review。

## 实用技巧

### IDE 集成
支持在 Cursor 或 VSCode 中打开 workspace 进行编辑。

## 注意事项

- 核心瓶颈仍然是人工 review 的速度，不要开太多 workspace 导致 review 不过来
- 目前只支持 GitHub 仓库支持的最好，其他类型的也能支持，但体验没有那么好

## 相关链接

- 官网：https://www.conductor.build/
- 文档：https://docs.conductor.build
- 反馈：humans@conductor.build
