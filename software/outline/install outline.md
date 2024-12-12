# 安装outline

### 前言

我使用的笔记软件主要是3个 苹果自带的笔记，obsidian，outline

苹果自带的notes主要多端同步，在外记录一些灵感、待办事项到手机上

obsidian写工作日报以及一些技术笔记（整理了苹果自带的notes中的笔记），我没使用付费服务，也不想使用icloud来同步，不靠谱！丢东西警告，而且用icloud就不好同步到windows；我用的syncthing来同步笔记目录到各个系统（ios 据说也有syncthing了 后面试试 但估计obsidian与它不好互通 不同应用只能打开自己的icloud 目录）

outline 主要用来写一些文章，可以导入导出，分享给他人，相当于一个发布服务

### 组件说明

outline 用起来了 配置比较麻烦

outline 它给的教程 __<https://docs.getoutline.com/s/hosting/doc/docker-7pfeLP5a8t#h-docker-compose>__

但是它给的 https-portal 和 我的 nginx-certbot 冲突了(都需要用80端口去申请证书)，我就不用 https-portal 了

我的 nginx-certbot 还要代理其他服务，所以和oidc-server分别跑两个docker compose


1. oidc-server 跑在127.0.0.1:8888
2. outline跑在 127.0.0.1:3002
3. nginx-certbot https 监听在2443 用域名 （可选）
4. nginx-certbot 反向代理 oidc-server与outline （可选）

### 安装步骤


1. 启动outline 以及 oidc-server

   docker.env 配置要注意 用这个模板文件 __<https://github.com/outline/outline/blob/main/.env.sample>__

   ```bash
   NODE_ENV=production
   PGSSLMODE=disable
   ```

   docker.env 里 `to change` 的地方都需要改 （两处密钥）

   进入outline-server目录 运行 `docker compose up -d`

   outline 监听在 127.0.0.1:3002，oidc-server 监听在127.0.0.1:8888

2. 配置本地oidc

outline没有本地用户(github 上有一个issue 用户呼声很大 但就没有)，如果你想用google slack之类的来做认证也可以 这里就可以忽略，配置google之类的oidc

然后 `docker compose exec -it oidc-server bash -c "make init"` 获得 root 密码

__<http://127.0.0.1:8888/admin>__ 访问这个 用 root 登录

创建 client， Response types 全选中

Redirect URIs: 填写这一行

```javascript
http://localhost:3002/auth/oidc.callback
```

保存 拿到 client id , client secret 下面用

创建一个普通用户 填写 first name， last name， email，以后 outline 用这个登录

修改 docker.env 的 OIDC 的配置

```bash
OIDC_CLIENT_ID=上面说的clientid
OIDC_CLIENT_SECRET=上面说的clientsecret
```

进入outline-server 目录，用`docker compose restart` 重启下服务

到这里，已经可以通过 http://127.0.01:3002 把outline用起来


3. 配置nginx-cerbot 提供公网服务（可选）

2中说的Redirect URIs 添加一行  outline.foo.info:2443 换成你的域名 端口 (下同，不再赘述), 保存

```javascript
https://outline.foo.info:2443/auth/oidc.callback
http://localhost:3002/auth/oidc.callback
```

把 `URL=http://localhost:3002`

改为 `URL=https://outline.foo.info:2443`

把 `OIDC_AUTH_URI=http://localhost:8888/oauth/authorize/`

改为 `OIDC_AUTH_URI=https://outline.foo.info:2443/oauth/authorize/`

然后进nginx-cerbot目录 ，修改user_conf.d 中的outline.conf 域名 `outline.foo.info` 端口 2443 为你的

把nginx-certbot.env中邮箱换为你的

最后 `docker-compose up -d`

然后就可以在公网上使用了
