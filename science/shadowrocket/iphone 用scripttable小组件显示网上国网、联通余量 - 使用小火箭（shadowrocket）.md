
[油管视频讲解](https://youtu.be/sOxUdvFYohc)

1. 升级小火箭 安装证书 启用mitm (中间人) （这样boxjs 能正常访问）
    

小火箭 轻击配置 -> 轻击本地文件中正在使用的规则文件后的ℹ️ -> HTTPS 解密 -> 将右上角开关启动 -> 安装证书 -> 允许

打开系统设置 -> 已下载描述文件 -> 安装 -> 输入密码 -> 安装 -> 通用 -> 关于本机 -> 证书信任设置 -> 对刚刚安装的根证书完全信任

2. 小火箭里 装 boxjs 联通余量(v4) 国网 模块

- boxjs模块：[https://raw.githubusercontent.com/chavyleung/scripts/master/box/rewrite/boxjs.rewrite.surge.sgmodule](https://raw.githubusercontent.com/chavyleung/scripts/master/box/rewrite/boxjs.rewrite.surge.sgmodule)
    
- 联通模块： [https://github.com/ChinaTelecomOperators/ChinaUnicom/releases/download/Prerelease-Alpha/10010.shadowrocket.sgmodule](https://github.com/ChinaTelecomOperators/ChinaUnicom/releases/download/Prerelease-Alpha/10010.shadowrocket.sgmodule)
    
- 国网模块： [https://github.com/dompling/Script/blob/master/wsgw/wsgw.sgmodule](https://github.com/dompling/Script/blob/master/wsgw/wsgw.sgmodule)
    

3. 然后打开boxjs [https://boxjs.com](https://boxjs.com) 看是否正常，正常把这两个订阅放进去
    

- 联通订阅： [https://github.com/ChinaTelecomOperators/ChinaUnicom/releases/download/Prerelease-Alpha/boxjs.json](https://github.com/ChinaTelecomOperators/ChinaUnicom/releases/download/Prerelease-Alpha/boxjs.json)
    
- 国网订阅：[https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/boxjs.json](https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/boxjs.json)
    

4. 装联通app，登录联通app，小火箭会通知已会抓取到你的token, 回到boxjs里，跑联通获取数据，点刷新 5. 还是在boxjs里，在国网里面把手机号，密码输入进去，点运行，拿到数据 6. 商店安装Scriptable， 下面这些js脚本 隔空投送到iphone，会打开iphone带的文件（或者你下载到文件里） - 点击分享到scriptable app，在这跑chinaunicom 2024，国网，预览效果；iphone添加小组件，选取scriptable的小组件，分别选联通以及国上国网，添加到桌面

- dmyy.js [https://raw.githubusercontent.com/dompling/Scriptable/refs/heads/master/Scripts/DmYY.js](https://raw.githubusercontent.com/dompling/Scriptable/refs/heads/master/Scripts/DmYY.js)
    
- 联通js [https://raw.githubusercontent.com/anker1209/Scriptable/refs/heads/main/scripts/ChinaUnicom_2024.js](https://raw.githubusercontent.com/anker1209/Scriptable/refs/heads/main/scripts/ChinaUnicom_2024.js)
    
- 网上国网 [https://raw.githubusercontent.com/anker1209/Scriptable/refs/heads/main/scripts/sgcc.js](https://raw.githubusercontent.com/anker1209/Scriptable/refs/heads/main/scripts/sgcc.js)
    

20241215: 反馈说这样boxjs 会卡死，这是小火箭的bug(javascript 引擎旧)，在获取到流量信息后，可以关掉联通模块，这样就不会卡死了，但就是这样cookie不会刷新，15天后应该会失效，到时候再打开联通app重新走一下流程，然后再关闭联通模块

20250316: https://github.com/anker1209/Scriptable 因为我小火箭用之前那个模块不稳定 所以用这个 就是麻烦点 两周打开联通app查询下流量
引入模块 https://github.com/anker1209/Scriptable/tree/main/module/10010.sgmodule?raw=true
Boxjs添加YaYa美女订阅链接（感谢YaYa辛苦付出~）： https://raw.githubusercontent.com/dompling/Script/master/dompling.boxjs.json

打开中国联通app --> 首页的流量查询获取Cookie；

运行脚本，点击基础设置-->BoxJS域名，设置为你自己的BoxJS域名，再次运行脚本，选择代理缓存，获取缓存cookie；
