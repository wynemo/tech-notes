## 配置文件
拿到软件后 有个默认配置文件

proxy - 本地节点
remote proxy - 订阅节点集合，也就是机场订阅
proxy chain - 代理链
proxy group - 策略组
remote filter - 过滤节点集合

## 界面支持

所有操作都支持界面，不用写配置文件，比如支持在界面上添加节点，策略组，代理链

## 测速
测速后没有排序，也不会显示绿色/黄色/红色，

bestsub的作用就体现出来了，测试可用性，排序，加测速测测出来的速度

bestsub介绍可以看往期视频介绍

## 代理链
[Proxy Chain]
speed_chain = 中转,落地, udp=true

顾名思义，落地节点通过中转节点代理

不能选择订阅节点集合(remote proxy)、过滤节点集合(remote filter)，只能选择本地节点(proxy)或者策略组(proxy group)

## macos

无法做软路由

## 支持的协议

更新比较勤快

2024年年底支持了ss2022：2022-blake3-aes-256-gcm

2025 4月支持了 vless + relality


## 插件

loon的插件很丰富，很多去广告的插件

这算是它的特色吧

可以看

[可莉的Loon资源库 | 插件 | 脚本 | 规则](https://github.com/luestr/ProxyResource)

我用 [YouTube去广告](https://www.nsloon.com/openloon/import?plugin=https://kelee.one/Tool/Loon/Plugin/YouTube_remove_ads.plugin) 插件

再比如：sub-store boxjs 这两个功能插件，这里就不详细介绍

记得把mitm打开，安装证书， script、、rewrite这些开关都打开

## 同步
profile - settings - icloud drive

这里如果有冲突，可以选择本地覆盖icloud，或者让icloud覆盖本地

然后如果是新设备，从icloud获得的配置，里面的证书，需要手动安装证书，让系统信任

