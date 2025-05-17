
### pnpm 的好处

pnpm使用硬链接机制，将全局缓存中的包链接到项目的node_modules，而不是像npm那样复制文件。这样可以节省磁盘空间，尤其是在多个项目使用相同依赖时。这点很重要，因为很多用户可能遇到多个项目导致node_modules占用大量空间的问题。

### store path

How to get pnpm store directory

On macOS: ~/Library/pnpm/store

### How to clear/clean .pnpm-store cache

Deleting all node_modules folder and running pnpm store prune worked for me. Thanks.

### 管理缓存

pnpm 提供了一些命令来管理其存储，例如：
`pnpm store prune`: 用于删除存储中未被任何项目引用的包。
