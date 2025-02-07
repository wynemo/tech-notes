## v2ray 格式 转换为 sing-box 格式
先说v2ray配置 转换为 sing-box这里, 其实可以用sing-box
sub-store是一个很好用的工具 但 sub-store你需要在服务器搭建，或者下载一个mihomo party之类的本地程序用sub-store，或者用手机软件用模块rewrite，要学习，有点麻烦

## 生成 sing-box 配置

其他方法就不一一列举了:
https://github.com/Toperlock/sing-box-subscribe 安全问题 要么自己部署 它提供的vercel ,下载机场的内容到公共服务器上，生成配置，其他人都能看到 不太安全
https://github.com/xmdhs/clash2singbox 要下载程序，不太方便
https://github.com/xmdhs/clash2sfa 要部署到服务器，不太方便，它提供的公共服务器，也是要下载机场订阅到服务器上，一定的安全隐患，估计和sing-box-subscribe差不多

总结都太技术化了，对一般的用户来说，不太友好

## 我这里推荐的方法
今天来讲如何直接在网页里生成 sing-box 配置，主要是用到gui-for-cores 这个项目的网站
所有转换、生成都是在本地或浏览器进行的，不会上传到服务器 你可以放心使用 也可以检查代码
同时也很简单，比起有些项目，不要了解太多概念，也不需要知道配置文件的具体细节，这是这个方法的意义

1. 打开 gui-for-singbox网页 https://gui-for-cores.github.io/ 先打开设置 改语言问中文 点击右上角的插件按钮，添加插件转换订阅
2. 如果你没有机场，只有单个节点，到第3步; 远程订阅 - 填入机场订阅地址 如果成功出现节点信息，就可以继续到第4步，如果失败(跨域问题，订阅连接为http问题)，可以到第3步
3. 打开 https://v2ray-to-sing-box.pages.dev/ 粘贴订阅内容（不是订阅链接）或者节点信息，点击转换，复制转换结果，放到gui-for-singbox网页 - 手动订阅里
4. 有了订阅信息，gui-for-singbox网页生成配置，复制到你的sing-box里

转换v2ray格式的节点为sing-box的项目： https://github.com/wynemo/v2ray-to-sing-box/ 感谢 gui-for-singbox 插件 原作者 以及sub-store作者

全过程都在浏览器里，直接生成 sing-box 配置了

[![视频讲解](https://img.youtube.com/vi/9CnqlpCn4pw/0.jpg)](https://www.youtube.com/watch?v=9CnqlpCn4pw)
