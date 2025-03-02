![[surge.png]]
### 增强模式

用surge增强模式 记得把chrome的doh关掉 因为surge会设置dns为1.0.0.1 chrome就会用在这个 chrome.clouflare-dns.com

这样chrome这边自己把有些域名解析为IP

那样的话 分流极有可能走到final 达不到预期的分流效果


### 抓包

应该说mitm 配合模块/脚本用的 ，给某些域名配置好mitm，控制台打开mitm， 控制台界面上只能看相应的域名的request/response header;

然后http 抓包，默认是一个通配符, 解密所有流量（这样会有问题，有些应用比如python就会报错，应该是没用这个信任的证书），但也可以让它不覆盖mitm的配置（关掉 Turn on MITM Automatically），就只解密mitm那边配置的域名。

所以懒的话，用默认配置，直接打开 http capture 就解密了，一个通配符搞定


### surge 规则

DOMAIN-SET
RULE-SET

IP-CIDR6 这和小火箭不一样

https://github.com/Loyalsoldier/surge-rules
https://github.com/blackmatrix7/ios_rule_script/tree/master/rule/Surge

### 策略（Proxy Policy） 策略组（POLICY GROUP）

underlying-proxy：Use a proxy to connect another proxy, aka proxy chain. It can be another proxy policy's or policy group's name.

```
SOCKS5 = select, policy-path=https://sub.store/download/socks5, external-policy-modifier='underlying-proxy="CF Trojan"'
CF Trojan = select, policy-path=https://sub.store/download/cf-trojan, hidden=1

wireguard-home = wireguard, section-name = Home
ProxySOCKS5 = socks5, 10.1.0.2, 7890, underlying-proxy = wireguard-home
```

### surge 与其他软件对比

surge 雀实好用

小火箭默认配置改下，就可以surge用

+ 小火箭、，分组那块。。。。 分组里偶尔出现奇怪的不存在的代理，界面交互有些地方不方便，比如链式代理时没有测过的速了; 选分组没那么便捷，毕竟是一款手机软件
+ stash  分组有时候有bug 没有正确分组          - sub store 忠实玩家，因为我界面上不能加节点啊
+ mihomo party又感觉太重  加节点也不方便       - sub store 忠实玩家,  同上
+ karing卡的一批 稍微切一个节点 界面卡几秒。。。
