# 在服务器上 使用singb-box tun模式 做 docker 镜像拉取  解决 docker.io 无法访问

在v2ex上看到有人问，docker.io无法访问，
+ https://v2ex.com/t/1119371 docker 现在正确拉镜像的姿势是什么
+ https://v2ex.com/t/1117219 中国大陆现在要怎样才能正常使用 docker

里面有些推荐使用国内镜像，但这种国内镜像不好说，说不定哪天就不能用了

最好还是自己在服务器上装一个sing-box之类的代理

这样拉取镜像比较方便

这推荐下载sing-box 1.11.11 版本的

然后服务器以ubuntu 22.04为例，它带有nft

[sing-box下载](https://github.com/SagerNet/sing-box/releases/download/v1.11.11/sing-box-1.11.11-linux-amd64.tar.gz) 这是x86_64的 自己可以选其他架构的

然后配置文件里，开启tun模式


```json
  "inbounds": [
    {
      "type": "tun",
      "address": [
        "172.19.0.0/30",
        "fdfe:dcba:9876::0/126"
      ],
      "stack": "mixed",
      "auto_route": true,
      "auto_redirect": true,
      "platform": {
        "http_proxy": {
          "enabled": true,
          "server": "127.0.0.1",
          "server_port": 7890
        }
      }
    },
    {
      "type": "mixed",
      "listen": "127.0.0.1",
      "listen_port": 7890
    }
  ],
```

注意，这里auto_route 表示默认路由到tun，正好是我们的场景，docker pull的时候，会走tun

**重要**：auto_redirect 也需要打开，

不打开的话，与docker的网桥会冲突 docker提供的服务，访问不了，这样你pull docker镜像的时候，你的服务器的docker就不能对外提供服务了 只能pull镜像完以后关闭sing-box

具体表现可以看这个[issue：When using TUN mode, the ports of Docker containers are inaccessible from the external network](https://github.com/SagerNet/sing-tun/issues/42)

auto_redirect 为true时，使用`sudo nft list ruleset`查看规则，会发现多了一条规则

sing-box的文档是这么说的："在 Linux 上始终推荐使用 auto_redirect，它提供更好的路由、更高的性能（优于 tproxy），并避免了 TUN 和 Docker 桥接网络之间的冲突。"

最后注意下，auto_redirect解决docker网桥冲突，是在 1.11.8 版本才有的, 而且需要nft，所以我让用ubuntu22.04的服务器

详细配置可以参考: [sing-box tun模式配置](https://sing-box.sagernet.org/zh/configuration/inbound/tun/#auto_route)