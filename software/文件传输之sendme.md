不用NAS，不用网盘，使用命令行传输文件/文件夹

是的，直接传输文件夹

也不用弄成一个rar文件了是吧

macos 用户只需要 brew install sendme

windows用户可以从这里下载

https://github.com/n0-computer/sendme/releases/download/v0.25.0/sendme-v0.25.0-windows-x86_64.zip

```
iwr https://iroh.computer/sendme.ps1 -useb | iex
```

用法：

1. 发送
$ sendme send ~/great_photos

2. 复制生成的命令

3. 接收方
$ sendme receive blobQmFoo...

例子：
