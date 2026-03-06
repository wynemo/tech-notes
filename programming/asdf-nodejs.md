# asdf - Node.js Version Management

使用 asdf 管理项目级别的 Node.js 版本，替代 nvm / fnm 等工具。

## 安装 asdf

```bash
brew install asdf
```

### Fish Shell 集成

在 `~/.config/fish/config.fish` 中添加：

```fish
# asdf version manager
source (brew --prefix asdf)/libexec/asdf.fish
```

## 安装 Node.js

```bash
# 添加 nodejs 插件
asdf plugin add nodejs

# 安装指定版本
asdf install nodejs 22.22.0

# 设置项目级别版本（在项目目录下执行）
# v0.18+ 使用 `asdf set`，旧版使用 `asdf local`
asdf set nodejs 22.22.0
```

执行后会在项目根目录生成 `.tool-versions` 文件：

```
nodejs 22.22.0
```

进入该目录时 asdf 会自动切换到对应版本。

## 配合 pnpm 使用

确保 asdf shim 路径在 `$PATH` 最前面（fish 默认如此），pnpm 会自动使用 asdf 管理的 node 版本。

验证：

```bash
node --version   # 应显示 asdf 管理的版本
pnpm node --version  # 同上
```

## 构建 canvas 原生模块

canvas 是一个需要 C 编译的 Node.js 原生模块，切换 Node.js 版本后需要重新编译。

### 1. 安装系统依赖

```bash
brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman
```

### 2. 编译 canvas

```bash
# pnpm rebuild canvas 可能静默失败，推荐手动触发：
cd node_modules/canvas && npm run install
```

可以将此步骤封装为 `build_canvas.sh`：

```bash
#!/usr/bin/env bash
set -euo pipefail
cd node_modules/canvas && npm run install
```

## 常用命令

```bash
asdf plugin list          # 查看已安装插件
asdf list nodejs          # 查看已安装的 Node.js 版本
asdf current              # 查看当前使用的版本
asdf install nodejs latest  # 安装最新稳定版
```

## 参考资料

- [asdf 官方文档](https://asdf-vm.com)
- [asdf-nodejs 插件](https://github.com/asdf-vm/asdf-nodejs)
