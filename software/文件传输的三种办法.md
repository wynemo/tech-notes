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

这个在国内似乎不这么行 经常连接不上

sendme 有的情况用不了 点对点传输

可以考虑用这个croc，它是一个命令行的工具，可以在命令行中使用，方便使用

它首先尝试在本地网络上发现对等设备进行直接点对点传输，如果失败则回退到使用中继服务器。

本地网络发现：当发送方启动传输时，croc 会在本地网络上广播自己的存在，接收方会尝试发现这些广播 croc.go:586-590

直接连接：如果在本地网络上发现对方，则尝试建立直接连接，无需通过中继服务器 croc.go:883-887

本地中继：如果在同一网络中，会设置本地中继服务器来处理传输 croc.go:562-566
