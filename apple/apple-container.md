# Apple container

`container` 是 Apple 开源的 macOS Linux 容器工具。它用轻量级虚拟机运行 Linux 容器，使用 Swift 编写，面向 Apple Silicon 优化，并兼容 OCI container images，所以可以拉取和运行常见 registry 里的镜像。

官方 README 写明当前支持 macOS 26，因为它依赖新版 macOS 的虚拟化和网络能力；旧版 macOS 不在官方支持范围内。不过本机实测在 Apple Silicon + macOS 15.6.1 上也可以安装并运行基础容器。

## 安装

从 GitHub Releases 下载签名的 `.pkg` 安装包，双击安装即可。安装过程会要求管理员密码，把文件放到 `/usr/local` 下。

安装后检查命令：

```bash
which container
container --version
```

本机实测：

```text
/usr/local/bin/container
container CLI version 1.0.0 (build: release, commit: ee848e3)
```

## 初始化

第一次使用前需要启动系统服务：

```bash
container system start
```

如果提示没有默认 kernel，可以按提示安装推荐的 Kata kernel。非交互场景可以用：

```bash
container system start --enable-kernel-install
```

检查服务状态：

```bash
container system status
```

## 基本用法

命令风格和 Docker 比较接近：

```bash
container run [options] <image> [arguments...]
container ls
container logs <name>
container exec <name> <command>
container stop <name>
container start <name>
container rm <name>
```

常用选项：

```bash
container run -d --name <name> -p <host-port>:<container-port> <image>
```

## 例子：启动 Redis

```bash
container run -d --name redis -p 6379:6379 redis:7-alpine
```

验证：

```bash
container ls
container exec redis redis-cli ping
```

如果返回 `PONG`，说明 Redis 可用。宿主机上也可以看到 `6379` 端口被 `container` 监听：

```bash
lsof -nP -iTCP:6379 -sTCP:LISTEN
```

进入 Redis CLI：

```bash
container exec redis redis-cli
```

停止和再次启动：

```bash
container stop redis
container start redis
```

## 注意事项

- 官方支持范围是 macOS 26；在 macOS 15.6.1 上能跑属于实测可用，不代表所有功能都稳定。
- 需要 Apple Silicon，官方 README 明确要求 Apple silicon Mac。
- 第一次运行镜像时会拉取 Linux kernel/init image，耗时会比普通 Docker run 更明显。
- Redis 日志里可能出现 `Memory overcommit must be enabled` 警告；本地开发一般不影响基础使用，但涉及 RDB/AOF、复制或低内存场景时需要关注。
- 容器管理服务由 `container system start` 启动；如果 `container ls` 报 XPC 连接错误，通常先检查 `container system status`。

## 升级和卸载

升级前先停止服务：

```bash
container system stop
```

升级到最新版本：

```bash
/usr/local/bin/update-container.sh
```

卸载但保留用户数据：

```bash
/usr/local/bin/uninstall-container.sh -k
```

卸载并删除用户数据：

```bash
/usr/local/bin/uninstall-container.sh -d
```

## 参考资料

- [apple/container GitHub 仓库](https://github.com/apple/container)
- [apple/container Releases](https://github.com/apple/container/releases)
- [官方文档](https://apple.github.io/container/documentation/)
