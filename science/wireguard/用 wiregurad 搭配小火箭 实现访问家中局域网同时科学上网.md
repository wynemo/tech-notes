[视频讲解](https://youtu.be/Liu5hKso7ew)
编辑 /etc/sysctl.conf 把  ip_forward 设置为1，打开流量转发
```
cat /etc/sysctl.conf|grep ip_forward
sudo sysctl -p
```

服务器上跑sing-box
`sudo ./sing-box -c sing-box.json run`

安装wireguard
`sudo apt update && sudo apt install wireguard`

生成密钥
```
sudo -s
cd /etc/wireguard/
wg genkey | tee privatekey | wg pubkey > publickey
```


服务器配置
```
[Interface]
Address = 10.18.0.1/24  # VPN内部的IP地址
PrivateKey = <你的服务器私钥>
ListenPort = 51820

[Peer]
PublicKey = <客户端公钥>
AllowedIPs = 10.18.0.2/32  # 客户端的VPN IP地址
```

开机自启wireguard
`sudo systemctl enable wg-quick@wg0`

开启wiregurad
`sudo wg-quick up wg0`

关闭wiregurad
`sudo wg-quick down wg0`

查看状态
`sudo wg show`

客户端wireguard配置

```
[Interface]
PrivateKey = <客户端私钥>
Address = 10.0.0.2/24
DNS = 8.8.8.8

[Peer]
PublicKey = <服务器公钥>
Endpoint = <服务器外部IP地址>:51820
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25
```