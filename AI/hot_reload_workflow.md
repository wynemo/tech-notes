# 热加载 + AI 自动编辑的开发体验

现在这种热加载服务器，简直救了命。

## 后端：Python + uv + uvicorn

```bash
uv run --env-file settings.env main.py --reload
```

## 前端：Next.js + Bun

```
Next.js 16.1.2 (Turbopack)
```

```bash
bun dev
```

## 配合 AI 的 Auto Edit

搭配 AI 的 auto edit 功能，基本上就是 AI 自己改代码，然后你看页面效果就行了。

以前还要手动挡，重启服务器。现在完全自动化。

## Claude Code 跳过权限确认

```bash
alias claude='claude --allow-dangerously-skip-permissions'
```

> 注意：这个参数会跳过所有权限确认，仅建议在信任的环境下使用。
