# 通过docker运行sing-box 方便在群晖等系统里使用

youtube视频讲解：

[https://youtu.be/d12T5HArv6g](https://youtu.be/d12T5HArv6g)

大家好

今天来给大家讲下如何通过docker运行sing-box

先顺便讲下 docker的http代理 这样国内的机器也能拉docker镜像

以debian系统为例 找到 `/usr/lib/systemd/system/docker.service`

```bash
[Service]
Environment="HTTP_PROXY=http://192.168.0.100:10333"
Environment="HTTPS_PROXY=http://192.168.0.100:10333"
```

sing-box配置生成往期视频有 **直接通过 sub-store 订阅和模板生成 sing-box 配置.md**

[https://www.youtube.com/watch?v=9pZ6w6lmaLs](https://www.youtube.com/watch?v=9pZ6w6lmaLs)

<https://github.com/wynemo/tech-notes/blob/master/science/sing-box/%E7%9B%B4%E6%8E%A5%E9%80%9A%E8%BF%87%20sub%20store%E8%AE%A2%E9%98%85%E5%92%8C%E6%A8%A1%E6%9D%BF%E7%94%9F%E6%88%90sing-box%E9%85%8D%E7%BD%AE.md>


配置可以放当前目录，会映射到 /etc/sing-box/config.json

由于是用的tun模式 所以要添加 `--cap-add NET_ADMIN` `--device=/dev/net/tun`

这样才有足够的权限

```bash
sudo docker run -d \
  --network host \
  --cap-add NET_ADMIN \
  --device=/dev/net/tun \
  -v $PWD/sing-box.json:/etc/sing-box/config.json \
  --name=sing-box \
  --restart=always \
  ghcr.io/sagernet/sing-box \
  -D /var/lib/sing-box \
  -C /etc/sing-box/ run
```

`--network host`  另外用的是宿主机网络，所以如果vless入站这里就是7443，就会监听在宿主机7443端口

```bash
    {
      "type": "vless",
      "tag": "vless-sb-in",
      "listen": "::",
      "listen_port": 7443,
      "sniff": true,
      "sniff_override_destination": true,
      "users": [
        {
          "uuid": "f131ddb4-f69e-48a0-91ec-f7fede7050ce",
          "flow": "xtls-rprx-vision"
        }
      ],
      "tls": {
        "enabled": true,
        "server_name": "icloud.cdn-apple.com",
        "reality": {
          "enabled": true,
          "handshake": {
            "server": "icloud.cdn-apple.com",
            "server_port": 443
          },
          "private_key": "WEMo7QC_fowt_i78v3_cuiY4H7TWDmGUhawCv9qKrXc",
          "short_id": [
            "a81fba46b2c38bc7"
          ]
        }
      }
    }
```
