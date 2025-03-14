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

config zone
        option name 'proxy'         # 新建名为 proxy 的防火墙区域
        option forward 'REJECT'     # 默认拒绝转发到其他区域的流量
        option output 'ACCEPT'      # 允许本区域发起的出站流量
        option input 'ACCEPT'      # 允许进入本区域的入站流量
        option mtu_fix '1'         # 启用 MTU 修复
        option device 'tun0'       # 关联 tun0 虚拟网卡
        list network 'proxy'       # 关联 proxy 网络接口

config forwarding
        option name 'lan-proxy'     # 转发规则名称
        option dest 'proxy'         # 目标区域
        option src 'lan'           # 源区域
```

如果是 tproxy 模式，/etc/config/firewall  规则简单很多

```
# 这里的nat规则主要是让其他设备通过immortalwrt上网
config nat
        option name 'MASQUERADE'
        option src 'lan'
        option target 'MASQUERADE'  # 启用源地址转换（NAT）
        option proto 'all'          # 适用于所有协议
```

编辑网络配置 /etc/config/network (如果是 tproxy 模式，就不需要了)
```
config interface 'proxy'
        option proto 'none'
        option device 'tun0'
```

重启下网络 防火墙
```
/etc/init.d/network restart
/etc/init.d/firewall restart
```


写好sing-box 配置 /etc/sing-box/config.json

把sing-box启动文件 /etc/init.d/sing-box 替换为如下内容：
```bash
#!/bin/sh /etc/rc.common
#
# Copyright (C) 2022 by nekohasekai <contact-sagernet@sekai.icu>
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.
#

START=99
USE_PROCD=1

#####  ONLY CHANGE THIS BLOCK  ######
PROG=/usr/bin/sing-box
RES_DIR=/etc/sing-box/ # resource dir / working dir / the dir where you store ip/domain lists
CONF=./config.json   # where is the config file, it can be a relative path to $RES_DIR
#####  ONLY CHANGE THIS BLOCK  ######

start_service() {
  sleep 10
  procd_open_instance
  procd_set_param command $PROG run -D $RES_DIR -c $CONF

  procd_set_param user root
  procd_set_param limits core="unlimited"
  procd_set_param limits nofile="1000000 1000000"
  procd_set_param stdout 1
  procd_set_param stderr 1
  procd_set_param respawn "${respawn_threshold:-3600}" "${respawn_timeout:-5}" "${respawn_retry:-5}"
  procd_close_instance
  iptables -I FORWARD -o tun+ -j ACCEPT
  echo "sing-box is started!"
}

stop_service() {
  service_stop $PROG
  iptables -D FORWARD -o tun+ -j ACCEPT
  echo "sing-box is stopped!"
}

reload_service() {
  stop
  sleep 5s
  echo "sing-box is restarted!"
  start
}
```

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

如果是tproxy模式，还需要创建一个文件 [nftables-ip46.conf](nftables-ip46.conf)

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
