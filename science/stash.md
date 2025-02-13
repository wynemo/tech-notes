## 安装

首先安装，它会安装证书，这个keychain里，可以找到它; 会显示Trusted by System 这样mitm就能使用了

## 添加机场订阅，使用机场提供的规则
打开界面 - control panel - config file - install from url
就会用机场的分流规则
然后界面上就有节点信息了 选择好节点 打开增强模式 就可以冲浪了

## 添加订阅，但使用stash提供的规则

我们来添加订阅
打开界面 - control panel - config file - Default - Edit
```
proxy-providers:
  服务提供商-1:
    url: http://your-another-service-provider
```
url这里填写你的机场订阅
里面的规则
只说一下这个process，表示匹配进程名
然后保存

## 通过sub-store 添加配置
打开界面 - control panel - config file - sub-store，它内置了sub-store，使用了mitm，可以访问
添加一个clash规则，yaml文件，这个之前视频有讲过，不重复说了
拿到sub store 的url，然后回过去，点install from url

## 仪表盘

打开界面 - control panel - connections 就会打开新的窗口
就可以查看活动连接，可以按host或者client

## http 重写
类似小火箭的模块，可配合mitm，对http请求、响应改写

## 优点：
- 提供连接的仪表盘，按 host 或者 client查看，很方便
- ios/macos 可以使用一套规则
- mitm 要搞脚本有用；但是界面上又没有抓包的入口，必须用js脚本
- stashlink 连接手机 p2p

## 缺点：

- 不便宜
- 有一些协议没有支持
- 节点（订阅）/规则 混在一起 clash系的通病，mihomo party/stash这些都有，像mihomo party搞了一个覆写，可以一个规则对应多个订阅，但也不是很好用
- 界面上不能（做起来太麻烦吧）添加节点与规则集，于是就只能搞一个sub-store让你自己在里面配置

[![视频讲解](https://img.youtube.com/vi/WGVykYBpyPc/0.jpg)](https://www.youtube.com/watch?v=WGVykYBpyPc)
