# Ghostty Terminal

Ghostty 是一个现代终端模拟器，使用自定义的 terminfo（`xterm-ghostty`）。

## 常见问题：SSH 到远程服务器报错

SSH 连接远程服务器时可能出现以下警告：

```
missing or unsuitable terminal: xterm-ghostty
```

原因是远程服务器上没有安装 `xterm-ghostty` 的 terminfo 条目。

## 解决方案

将本地的 terminfo 发送到远程服务器，一次操作永久解决：

```bash
infocmp -x | ssh user@remote -- tic -x -
```

## 参考资料

- [Ghostty 官方文档](https://ghostty.org)
