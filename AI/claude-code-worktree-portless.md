# Claude Code + Git Worktree + Portless 并行开发工作流

丐版 Mac mini 的 AI 时代并行开发方案：用 git worktree 开多个分支，用 pnpm global virtual store 极速装包，用 portless 消灭端口冲突。

## 为什么需要这套工作流

AI 时代要求并行开发——多个功能分支同时跑、多个 Claude Code 实例同时干活。但 Mac mini 磁盘空间有限，每个分支单独克隆一份太费劲。

**核心思路**：git worktree + pnpm global virtual store + portless = 近零额外开销的并行开发环境。

## 1. Git Worktree

```bash
# 打开一个新的 worktree（Claude Code 支持 -w 参数）
claude -w

# 或手动创建
git worktree add ../my-app-fix-ui fix-ui
```

多个 worktree 共享同一个 `.git` 目录，不需要重新克隆仓库。

## 2. pnpm Global Virtual Store（关键优化）

```bash
# 开启全局虚拟存储
pnpm enable-global-virtual-store
```

**原理**：默认 pnpm 每个项目有自己的 `node_modules/.pnpm`（内容寻址存储的本地链接层）。开启 global virtual store 后，中间层升级为系统级共享虚拟存储。

**为什么 worktree 场景收益特别明显**：
- 多个 worktree 依赖版本相同时，依赖图 hash 一致
- `pnpm i` 时发现 `<store-path>/links/<hash>` 已存在，直接 symlink 过去
- 几乎不需要任何 I/O，安装速度飞起

```bash
# 在新 worktree 里直接跑，秒装
pnpm i
pnpm run dev
```

## 3. Portless——消灭端口冲突

多个 worktree 同时 `pnpm run dev`，都想监听 3000 端口，必然冲突。[portless](https://github.com/vercel-labs/portless) 解决这个问题。

### 安装

```bash
npm i -g portless
```

### 配置 package.json

```json
{
  "scripts": {
    "dev": "next dev",
    "dev:portless": "portless run next dev"
  }
}
```

### 启动

```bash
# 可选：开启 HTTPS（一次性配置，自动生成证书）
portless proxy start --https

# 启动开发服务器
pnpm run dev:portless
```

### 访问地址

```
# 无 HTTPS，随机分配 4000-4999 端口
http://myapp.localhost:1355

# 有 HTTPS
https://myapp.localhost
```

### Worktree 自动识别（最爽的功能）

portless 自动检测 git worktree，**在 linked worktree 里，分支名自动作为子域名前缀**，无需任何额外配置：

```bash
# 主 worktree（main 分支）
portless run next dev   # -> http://myapp.localhost:1355

# fix-ui 分支的 worktree
portless run next dev   # -> http://fix-ui.myapp.localhost:1355

# feature-auth 分支的 worktree
portless run next dev   # -> http://feature-auth.myapp.localhost:1355
```

每个 worktree 独立 URL，互不干扰。

### 框架兼容性

| 框架 | PORT 环境变量 | portless 处理方式 |
|------|------------|-----------------|
| Next.js、Express、Nuxt | 自动读取 | 直接注入 `PORT` |
| Vite、Astro、React Router、Angular | 忽略 PORT | 自动注入 `--port` 和 `--host` 标志 |

## 完整工作流示例

```bash
# 主分支正常开发
cd my-app
pnpm run dev:portless   # http://myapp.localhost:1355

# 新开一个 worktree 做 fix
git worktree add ../my-app-fix fix-ui
cd ../my-app-fix
pnpm i                  # 秒装，共享 store
pnpm run dev:portless   # http://fix-ui.myapp.localhost:1355

# Claude Code 并行处理两个分支
claude -w               # 在当前 worktree 启动新实例
```

## 参考资料

- [Portless 包裹任意服务（原理 + proxy.mjs 方案）](../programming/portless-wrap-services.md)
- [portless GitHub](https://github.com/vercel-labs/portless)
- [pnpm global virtual store 文档](https://pnpm.io/cli/enable-global-virtual-store)
- [git worktree 官方文档](https://git-scm.com/docs/git-worktree)
