youtube视频讲解: https://youtu.be/6AdNPM7Gqxo

immortalwrt qcow2 下载链接： https://downloads.immortalwrt.org/releases/23.05.3/targets/armsr/armv8/immortalwrt-23.05.3-armsr-armv8-generic-ext4-combined-efi.qcow2.gz

sing-box模板文件:

https://raw.githubusercontent.com/xishang0128/sub-store-template/main/sing-box.json

sin-box 脚本链接：

https://raw.githubusercontent.com/xishang0128/sub-store-template/main/sing-box.js#type=2&name=bywave

其中type 2 表示单条订阅 name表示订阅名称

安装sing-box:
```bash
opkg update
opkg install kmod-inet-diag kmod-netlink-diag kmod-tun iptables-nft
opkg install sing-box
```

编辑/etc/config/firewall 增加防火墙规则
```
config nat
        option name 'MASQUERADE'
        option src 'lan'
        option target 'MASQUERADE'
        option proto 'all'

config zone
        option name 'proxy'
        option forward 'REJECT'
        option output 'ACCEPT'
        option input 'ACCEPT'
        option mtu_fix '1'
        option device 'tun0'
        list network 'proxy'

config forwarding
        option name 'lan-proxy'
        option dest 'proxy'
        option src 'lan'
```

编辑网络配置 /etc/config/network
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

最后使用 `/etc/init.d/sing-box start` 启动sing-box

日志在状态 - 系统日志里
