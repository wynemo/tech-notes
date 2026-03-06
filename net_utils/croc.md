# croc

跨平台的点对点文件传输工具，支持端到端加密。

## 安装

```bash
brew install croc
```

## 基本用法

```bash
# 发送文件
croc send <file>

# 接收文件
croc <code>
```

## 常用选项

### 禁用 P2P 直连，强制走 relay 中转

```bash
croc send --no-local <file>
```

默认情况下 croc 会尝试局域网 P2P 直连，加 `--no-local` 后只走 relay 服务器中转。

### 自定义 relay 服务器

```bash
croc --relay "myrelay.example.com:9009" send <file>
```

### 自建 relay

```bash
croc relay --ports 9009-9013
```

## 参考资料

- [GitHub - schollz/croc](https://github.com/schollz/croc)
