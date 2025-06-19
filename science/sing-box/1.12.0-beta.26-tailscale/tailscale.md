今天讲下 singbox 通过 tailscale 访问局域网

顺带 说下 sing-box 1.12 配置的变动


上次其实已经讲了 sing-box tailscale 使用

通过一个端点访问其所在的局域网是不行的，有 bug

有观众前段时间在问 这个好了没有

今天去看 已经修复了

https://github.com/SagerNet/sing-box/issues/2998

我测试了下 没有问题

使用的版本为

1.12.0-beta.26

然后测 singbox 1.12 beta 26

发现上次的配置启动不了 让迁移

```
ERROR[0000] legacy special outbounds is deprecated in sing-box 1.11.0 and will be removed in sing-box 1.13.0, checkout documentation for migration: https://sing-box.sagernet.org/migration/#migrate-legacy-special-outbounds-to-rule-actions
```

打开一看原来是 block 和 dns 都拿到 action 里去了，原来在 outbounds 里

这个照着文档做就行


我是这样测试的

在一台 linux 服务器上 启动 singbox 

配置好 tailscale 端点

另外一个远程的机器配置好 tailscale 官方客户端

然后后者通过 tailscale 访问前者所在的局域网

可以 ping 一下

然后 ssh 连接到局域网机器

就不详细讲 sing-box 配置了 可以看往期视频

然后 sing-box 配置和笔记我会贴到视频下方

以后 sing-box 未来可期啊 各种连接 wireguard 以及 tailscale 