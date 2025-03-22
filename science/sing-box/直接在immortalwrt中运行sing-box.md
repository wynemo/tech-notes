youtube视频讲解: https://youtu.be/6AdNPM7Gqxo

视频演示所用的 immortalwrt qcow2 下载链接（arm64的）： https://downloads.immortalwrt.org/releases/23.05.3/targets/armsr/armv8/immortalwrt-23.05.3-armsr-armv8-generic-ext4-combined-efi.qcow2.gz

https://downloads.immortalwrt.org 你可以根据你的设备选择对应的版本

可以在sub-store中生成sing-box配置文件，采用的是 tun 模式

sing-box模板文件:

https://raw.githubusercontent.com/xishang0128/sub-store-template/main/sing-box.json

sing-box 脚本链接：

https://raw.githubusercontent.com/xishang0128/sub-store-template/main/sing-box.js#type=2&name=bywave

其中type 2 表示单条订阅 name表示订阅名称 替换为你的sub-store上的订阅信息

注意模板文件与脚本是配套的

如果是tun模式，tun的入站加入 `"auto_redirect": true`

如果是tproxy模式，sing-box入站配置要改为:
```json
"inbounds": [
  {
    "type": "tproxy",
    "tag": "tproxy-in",
    "listen": "::",
    "listen_port": 9898,
    "tcp_fast_open": true,
    "udp_fragment": true,
    "sniff_override_destination": true,
    "sniff": true
  }
 ]
```

ssh 进入immortalwrt后台 安装sing-box:
```bash
opkg update
opkg install kmod-inet-diag kmod-netlink-diag kmod-tun iptables-nft
opkg install sing-box
```

如果是tproxy模式，需要安装
```bash
opkg install kmod-nft-tproxy kmod-nft-socket
```

编辑/etc/config/firewall 增加防火墙规则
```
# 这里的nat规则主要是让其他设备通过immortalwrt上网
config nat
        option name 'MASQUERADE'
        option src 'lan'
        option target 'MASQUERADE'  # 启用源地址转换（NAT）
        option proto 'all'          # 适用于所有协议
```


重启下网络 防火墙
```
/etc/init.d/network restart
/etc/init.d/firewall restart
```


写好sing-box 配置 /etc/sing-box/config.json

如果是tun模式 修改一下 sing-box 启动配置文件 /etc/config/sing-box：
```
config sing-box 'main'
        option enabled '1'
        option user 'root'
        option conffile '/etc/sing-box/config.json'
        option workdir '/usr/share/sing-box'
#       list ifaces 'wan'
#       list ifaces 'wan6'
        option log_stderr '1'
        option log_stdout '1'
```
修改了enabled为1，user为root

如果是tproxy模式, /etc/init.d/sing-box 替换为如下内容:
```bash
#!/bin/sh /etc/rc.common

START=99
USE_PROCD=1

#####  ONLY CHANGE THIS BLOCK  ######
PROG=/usr/bin/sing-box
RES_DIR=/etc/sing-box/
CONF=./config.json
#####  ONLY CHANGE THIS BLOCK  ######

start_service() {
    procd_open_instance
    procd_set_param command $PROG run -D $RES_DIR -c $CONF
    procd_set_param user root
    procd_set_param limits core="unlimited"
    procd_set_param limits nofile="1000000 1000000"
    procd_set_param stdout 1
    procd_set_param stderr 1
    procd_set_param respawn "${respawn_threshold:-3600}" "${respawn_timeout:-5}" "${respawn_retry:-5}"
    procd_close_instance
    ## 以下七行是nftables相关，使用iptables自行替换##
    ip rule add fwmark 1 table 100
    ip route add local 0.0.0.0/0 dev lo table 100
    ip -6 rule add fwmark 1 table 106
    ip -6 route add local ::/0 dev lo table 106
    nft -f /etc/sing-box/nftables-ip46.conf
    nft add chain inet sing-box docker { type nat hook prerouting priority -100 \; }
    nft add rule inet sing-box docker ip saddr != {172.17.0.0/16} return
    echo "sing-box is started!"
}

stop_service() {
    service_stop $PROG
    ## 以下五行是nftables相关，使用iptables自行替换##
    ip rule del fwmark 1 table 100
    ip route del local 0.0.0.0/0 dev lo table 100
    ip -6 rule del fwmark 1 table 106
    ip -6 route del local ::/0 dev lo table 106
    nft delete table inet sing-box
    echo "sing-box is stopped!"
}

reload_service() {
    stop
    sleep 2s
    echo "sing-box is restarted!"
    start
}
```

如果是tproxy模式，还需要创建一个文件 [nftables-ip46.conf](nftables-ip46.conf) 注意下，里面的局域网网段需要改成自己的

放到 `/etc/sing-box/nftables-ip46.conf`

最后使用 `/etc/init.d/sing-box start` 启动sing-box

一些命令：
```
设置开机启动：
/etc/init.d/sing-box enable
关闭开机启动：
/etc/init.d/sing-box disable
启动：
/etc/init.d/sing-box start
重启：
/etc/init.d/sing-box reload
停止：
/etc/init.d/sing-box stop
```

日志在状态 - 系统日志里
