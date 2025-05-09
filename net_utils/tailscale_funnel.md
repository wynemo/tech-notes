装个这个 tailscale

tailscale是个内网穿透工具

之前讲sing-box时有提到过tailscale [science/sing-box/singbox-tailscale.md](../science/sing-box/singbox-tailscale.md)

tailscale 是一个将你的机器组网的工具

不过它的功能不止这个

这里要介绍的是建立隧道 代理本地网站

我们来到它的[官网](https://tailscale.com/download)

以macos为例子 安装这个pkg

装完以后，登陆一下

在终端中，运行以下命令，打开Tailscale funnel，这里9000表示代理本地9000端口的网站服务:

`/Applications/Tailscale.app/Contents/MacOS/Tailscale funnel 9000`


这里初次使用会让你去[网页管理后台](https://login.tailscale.com/f/funnel)上打开 funnel：

Funnel is not enabled on your tailnet.

打开以后，再次运行上面的命令，它会提示你好了:

```
Available on the internet:

https://xxxx.ts.net/
```

然后你访问这个 https://xxxx.ts.net/ 就可以访问你的内网服务了

不过可能需要代理访问，不然质量不佳，我用香港节点访问的，速度还不错
