# ImmortalWrt介绍: 国内喜欢用的 OpenWrt 变种

主要添加了一些中国国内常用的软件包
安装qcow2 以后
修改网络 dhcp获取IP
可以先去网页后台修改语言为中文
然后更新软件包，它使用的是国内的源
直接ssh不要密码登陆到后台

注：utm虚拟机网络选桥接，dhcp就可以和宿主机一个局域网
但是要注意网络接口要选对，苹果可能有多个接口，要不然虚拟机获取不到IP

注意：mac 如果宿主机用的wifi，要打开ip forwarding，这样虚拟机immortalwrt才能作为旁路由转发流量

youtube 介绍视频：https://www.youtube.com/watch?v=rvDz65cbyqo
