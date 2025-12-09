# Bun 完整教程

## 什么是 Bun？

Bun 是一个现代的 JavaScript 运行时，类似于 Node.js 和 Deno。它的特点是：
- **极快的速度**：启动时间和执行速度都比 Node.js 快得多
- **内置工具**：集成了包管理器、打包工具、测试运行器等
- **兼容性强**：可以直接运行大多数 Node.js 项目
- **TypeScript 原生支持**：无需配置即可运行 TypeScript 文件

## 安装 Bun

### macOS/Linux

使用 Homebrew 安装（推荐）:
```bash
brew install oven-sh/bun/bun
```

或使用官方安装脚本:
```bash
curl -fsSL https://bun.sh/install | bash
```

### Windows

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

### 升级 Bun

```bash
bun upgrade
```

## 基础使用

### 运行 JavaScript/TypeScript 文件

```bash
# 运行 JavaScript 文件
bun run index.js

# 运行 TypeScript 文件（无需编译）
bun run app.ts

# 直接执行
bun index.js
```

### 包管理

```bash
# 安装依赖（读取 package.json）
bun install

# 添加依赖
bun add <package>

# 添加开发依赖
bun add -d <package>

# 移除依赖
bun remove <package>

# 更新依赖
bun update
```

### 创建新项目

```bash
# 初始化新项目
bun init

# 使用模板创建项目
bun create <template> <project-name>
```

## 使用 Bun 创建 Next.js 项目

### 1. 创建项目

```bash
bun create next-app@latest my-bun-app
```

在创建过程中会询问一些配置选项：
- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: 根据需要选择
- `src/` directory: 根据需要选择
- App Router: Yes (推荐)
- Import alias: @/* (默认)

### 2. 进入项目目录

```bash
cd my-bun-app/
```

### 3. 修改 package.json

为了确保使用 Bun 运行 Next.js，需要修改 `package.json` 中的 scripts 字段，在 Next.js CLI 命令前加上 `bun --bun` 前缀：

```json
{
  "scripts": {
    "dev": "bun --bun next dev",
    "build": "bun --bun next build",
    "start": "bun --bun next start",
  }
}
```

### 4. 运行项目

```bash
# 开发模式
bun run dev

# 构建生产版本
bun run build

# 运行生产版本
bun run start
```

## 集成 shadcn/ui 组件库

### 1. 初始化 shadcn/ui

```bash
bunx --bun shadcn@latest init -d
```

参数说明：
- `bunx`: Bun 的 npx 替代品，用于运行 npm 包
- `--bun`: 强制使用 Bun 运行时
- `-d`: 使用默认配置

### 2. 添加常用组件

```bash
# 一次性添加多个组件
bunx --bun shadcn@latest add button card table badge input dialog -y
```

参数说明：
- `-y`: 自动确认，跳过交互式提示
