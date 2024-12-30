# 科学一些基本知识

## 自建节点与机场

在科学上网和网络加速的领域中，“自建节点”和“机场”是两种常见的选择，它们各有优缺点，适合不同需求的用户
自建节点是指用户自己租用服务器（通常是 VPS），配置网络代理服务（如 Shadowsocks、V2Ray 等）
优点：
+	高度可控： 自建节点的服务器、流量、协议完全由自己管理，安全性高。
+	稳定性强： 不依赖第三方服务，排除供应商问题的影响。
+	可定制性强： 可根据需要选择服务器地区、带宽、配置协议等，灵活调整。
+	成本透明： 没有额外的服务溢价，费用取决于服务器租赁价格。

缺点：
+	技术门槛高： 需要具备一定的技术知识，包括服务器配置、防火墙设置、性能优化等。
+	可能被墙： 自建节点更容易受到防火墙的干扰，需要频繁更换 IP 或采用更隐蔽的协议。

适合人群：
+ 具备一定技术能力，愿意花时间维护的人。
+ 对流量安全性和隐私有较高要求的人。

## 在哪里购买服务器

选购vps 我有用用过 vultr, oracle云，阿里云香港，linode，价格基本都在20块人民币左右，现在可能涨价了

oracle云是可以免费申请的 （不一定成功）可以自己搜下 也可以参考 https://www.nodeseek.com/post-126033-1

https://p3terx.com/archives/cheap-and-costeffective-vps-recommended.html 可以参考这篇文章看下现在价格

如果服务器你只用来科学上网 不做其他的 那你也也得思考下对比机场的性价比

## 购买域名

像 https://www.namesilo.com/ cloudflare都是可以购买注册域名的 一般首年便宜几十人民币，后面价格贵些100多人民币

可以参考 https://zhuanlan.zhihu.com/p/33921436

## 服务器登陆、在服务器上执行命令

这些如果讲的深入 可以有很多可以讲的 对于新手来说准备一个putty，或者用windows10自带的ssh
登陆服务器，进行命令行操作
不要害怕命令行 需要执行什么 一步一步来
有什么问题可以多问 多搜 问chatgpt

## 在服务器上自建节点

推荐使用sing-box来搭建

到 https://github.com/SagerNet/sing-box/releases/ 下载

我们用ssh登陆到服务器上，比如下载 sing-box amd64架构的包

`wget -c https://github.com/SagerNet/sing-box/releases/download/v1.10.5/sing-box-1.10.5-linux-amd64.tar.gz`

解压 `tar xf sing-box-1.10.5-linux-amd64.tar.gz`

进入 sing-box 目录 `cd sing-box-1.10.5-linux-amd64`

把本地编辑好的文件sing-box配置文件 传到这个服务器目录 （可以用scp winscp之类的工具传）
`scp ~/Documents/test-sing-box.json user@your_domain.info:~/sing-box-1.10.5-linux-amd64/`

最后启动sing-box
`sudo ./sing-box run -c test-sing-box.json`


## 咨询

有什么问题 欢迎咨询电报： https://t.me/lozhang123
