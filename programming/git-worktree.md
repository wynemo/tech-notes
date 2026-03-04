# Git Worktree 并行开发

Git Worktree 允许在同一仓库中同时检出多个分支到不同目录，实现并行开发。

## 与 Claude Code 配合使用

在 worktree 目录中启动 Claude Code 时加 `-w` 参数，Claude Code 会以 worktree 模式运行：

```bash
claude -w
```

这样可以同时开多个 Claude Code 实例，每个实例处理不同的功能分支，实现并行 AI 辅助开发。

## 配合 VSCode GitLens 使用

安装 [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) 插件后，可以在 VSCode 中直观地查看每个 worktree 的代码变更，方便 review 不同分支的改动。

## 同步主仓库配置

在 worktree 中开发时，需要从主仓库同步 `.env` 等配置文件并安装依赖。可以用 Claude Code 的 `sync-worktree-config` skill 一键完成：

- 自动将主仓库的 `.env`、`.env.local` 复制到当前 worktree
- 检测项目类型并安装依赖：
  - Python 项目（poetry）→ `poetry install`
  - Node.js 项目 → `pnpm install`

在 worktree 目录中执行：

```
/sync-worktree-config
```

技能文件：[sync-worktree-config/SKILL.md](https://github.com/wynemo/my-claude-skills/blob/main/skills/sync-worktree-config/SKILL.md)

## 参考资料

- [Git Worktree 官方文档](https://git-scm.com/docs/git-worktree)
