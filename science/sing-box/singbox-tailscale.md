大家好 今天我们来讲sing-box使用tailscale

最近sing-box的alpha版本加入了tailscale的支持

我测试了一下 还不错 尽管有些问题

其实之前sing-box也加入了对wireguard的支持

但wireguard如果没有公网IP，设备在nat后面，想点对点传输还是麻烦

有tailscale这样的工具直接帮你做好nat打洞更好

这样我们出门在外，就只用一个sing-box程序，就可以点对点访问家里局域网，然后也能科学上网

不用切换其他程序

这样也就能实现surge ponte那样的功能了

我们首先到tailscale这边拿到key

接着sing-box这边配置文件加入endpoints：tailscale, 填入auth key

由于我没有合适的安卓设备，在安卓模拟器上，我试了下，只能第一次连上tailscale，后续连不上

这个可能是模拟器的bug，有合适设备的朋友可以自己去测试

我在macos上下载了一个sing-box的命令行程序

运行以后，是能与其他tailscale节点通信的

这里我通过ssh连上了我另外一个节点

tailscale是有一个功能的，某个节点可以设置让其他节点通过它访问前者所在的局域网网段

但我试了通过这个节点访问局域网是不行的

应该是现在程序的bug

可以看这个日志 是无法通过tailscale连上局域网IP的

总结下就是我测试下来，现阶段是alpha，tailscale的支持还不成熟，通过sing-box，

各个节点是能互相访问的

而通过节点访问没有接入tailscale的网络，还不行

但未来可期 sing-box功能变得越来越成熟了

好 谢谢大家观看
