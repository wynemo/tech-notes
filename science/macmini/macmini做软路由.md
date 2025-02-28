#### 局域网科学上网:

[youtube视频讲解](https://www.youtube.com/watch?v=Sfku8XTFeoE)

在 mac mini 上打开流量转发 `sudo sysctl -w net.inet.ip.forwarding=1`

跑一个小火箭或者 sing-box （推荐后者，性能更好，也不要钱）

接下来打开sing-box开启代理

（也可以用小火箭来做代理 就是要2.9刀 往期有介绍 另外就是要劫持114的dns 配置 - 本地文件 - 规则 - ℹ️ - 通用 - 劫持dns - 添加114.114.114.114:53  最后打勾 确认）

<details>
<summary>怕观众觉得啰嗦就直接给的结论</summary>
原因是客户端这边设置的dns比如设置的是114.114.114.114，但这边作为路由的机器上的小火箭没有劫持114.114.114.114这个dns，那么就会作为udp转发到远程服务器上，那这个打开国内网站就会慢；而如果劫持了，国内网站，小火箭就会把dns交给设置的国内的dns，这个dns记录可以自己去“数据 - dns”里查看是不是这么回事
</details>
其他机器上，把你的mac mini的IP地址填写为网关

这样其他机器就以mac mini作为路由

并且dns设置为114.114.114.114

#### wifi共享:

局域网科学上网以后，可以用系统自带的wifi共享功能

开启热点，做为无线路由器
![](Pasted%20image%2020241223162243.png)


但这里“share your connection from” 选了小火箭或者sing-box的接口后

热点无法启动，所以还是共享有线网络，因此我们用pf把wifi流量手动转发到sing-box/shadowrocket的接口

敲命令： `sudo bash proxy.sh` ，文件内容如下：
```
tommygreen@tommys-Mac-mini-4 nebula-darwin % cat nat.pf
nat on utun5 from bridge100:network to any -> (utun5)

#sing-box
#nat on utun5 from bridge100:network to any -> (utun5)

#苹果内置的规则 保留
nat-anchor "com.apple/*" all
nat-anchor "com.apple.internet-sharing" all
rdr-anchor "com.apple/*" all
rdr-anchor "com.apple.internet-sharing" all

tommygreen@tommys-Mac-mini-4 nebula-darwin % cat proxy.sh
# Enable packet forwarding

sysctl -w net.inet.ip.forwarding=1

# Unless you have any rules you want to keep, let's flush existing NAT rules
pfctl -F nat

# Enable packet filtering
pfctl -e

# Load rules from our file
pfctl -f nat.pf

# Confirm rules are loaded
pfctl -s nat

# Check to see connections
pfctl -s states
```
其中utun5 为sing-box的tun接口，bridge100为共享的无线网络接口

#### 在外面用手机访问家里的网络 同时科学上网:

[youtube视频讲解](https://www.youtube.com/watch?v=9FHTtZc3rJw)

在手机上用 wiregurad 连接到家里的 macmini

实现科学上网 以及访问家里的局域网的服务

这个方案要求有公网 IP 有自己的域名

然后用 DDNS 把自己的公网 IP 指向自己的域名

推荐用 cloudflare 来做 ddns

mac 商店里下载一个 wireguard 配置好打开服务，作为服务节点

路由器里把 macmini 的监听端口映射到公网

iphone 上下载一个 shadowrocket 来连接家里  ，添加一个wiregurad节点

android 可用手机版的 wiregurad

用 shadowrocket 记得去掉家里局域网的网段
一个是旁路由
一个是跳过代理那里
添加一个代理局域网的规则  ，选wiregurad节点

这样当你使用这个wireguard节点，你可以同时访问家中服务，科学上网的流量也是通过wireguard转到家里

如果只想访问家里服务，科学上网不想回家里绕一圈，可以选用其他节点来科学上网，只用上面说的的局域网规则来访问家里
