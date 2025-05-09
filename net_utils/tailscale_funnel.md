装个这个 tailscale

tailscale是个内网穿透工具

之前讲sing-box时有提到过tailscale [science/sing-box/singbox-tailscale.md](../science/sing-box/singbox-tailscale.md)

tailscale 是一个将你的机器组网的工具

不过它的功能不止这个

这里要介绍的是tailscale funnel，它建立隧道 代理本地网站

价格，免费的，免费用户可以用

这个和cloudflared类似，但cloudflared需要自己的域名，tailscale不需要

ngrok和这个功能一样，不过电脑上如果有tailscale了就没必要再用这个了

而且ngrok免费用户域名是随机的，tailscale是固定的

我们来到它的[官网](https://tailscale.com/download)

以macos为例子 安装这个pkg

装完以后，登陆一下

在终端中，运行以下命令，打开Tailscale funnel，这里9000表示代理本地9000端口的网站服务:

`/Applications/Tailscale.app/Contents/MacOS/Tailscale funnel 9000`


这里初次使用会让你去[网页管理后台](https://login.tailscale.com/f/funnel)上打开 funnel：

Funnel is not enabled on your tailnet.

这里打开以后，会生成一个ts.net的子域名，随机生成的

比如tail<ID>.ts.net

打开以后，再次运行上面的命令，它会提示你好了:

```
Available on the internet:

https://<Node>.tail<ID>.ts.net/
```

这里<Node>为这个机器的名称

然后你访问这个 https://<Node>.tail<ID>.ts.net/ 就可以访问你的内网服务了

tcp 也可以

https://tailscale.com/kb/1311/tailscale-funnel#use-a-tcp-forwarder

不过可能需要代理访问，不然质量不佳，我用香港节点访问的，速度还不错

同类工具对比：

|               | Tailscale Funnel | ngrok    | Cloudflare Tunnel|
|---------------|------------------|----------|-------------------|
|域名类型       | 固定ts.net子域   | 随机域名 | 需自有域名|
|认证方式       | Tailscale账号    | API密钥  | Cloudflare账号|
|免费额度       | 免费             | 免费     | 免费|
