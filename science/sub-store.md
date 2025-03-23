# sub-store介绍

朋友们你们好

你们手上是不是有oracle之类的闲置服务器

不知道拿来跑什么

今天就来讲讲比如拿来搭建订阅管理器 sub-store


这里说不要用小火箭导出的url

它支持协议的多

它这给了个notion上的文档介绍

点进去图都是裂的😅


它docker hub上还有点介绍

我们用docker compose 部署


用nginx-cerbot 以及 sub-store的镜像


这里注意这个环境变量


SUB_STORE_FRONTEND_BACKEND_PATH

```bash
ubuntu@oracle:~/sub-store$ cat docker-compose.yml
services:
  sub-store:
    image: xream/sub-store
    container_name: sub-store
    stdin_open: true
    tty: true
    restart: always
    environment:
      - SUB_STORE_FRONTEND_BACKEND_PATH=/your_key
    ports:
      - 127.0.0.1:3001:3001
    volumes:
      - ./data:/opt/app/data
```


相当于是一个密钥 别设置太简单


然后是nginx的反向代理

填入你的域名 监听端口

docker compose 配置
```bash
version: '3'

services:
  nginx:
    image: jonasal/nginx-certbot:latest
    restart: unless-stopped
    #environment:
    #  - CERTBOT_EMAIL
    env_file:
      - ./nginx-certbot.env
    network_mode: "host"
    volumes:
      - nginx_secrets:/etc/letsencrypt
      - ./user_conf.d:/etc/nginx/user_conf.d
      - ./html:/usr/share/nginx/html

volumes:
  nginx_secrets:
```

nginx 配置

```bash
ubuntu@oracle:~/trojan-rpc$ cat user_conf.d/sub.conf
server {
client_max_body_size 100M;
listen 6443 ssl http2;
listen [::]:6443 ssl http2;
server_name your.domain.com;

# Load the certificate files.
    ssl_certificate         /etc/letsencrypt/live/test-name/fullchain.pem;
    ssl_certificate_key     /etc/letsencrypt/live/test-name/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/test-name/chain.pem;
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-ECDSA-CHACHA20-POLY1305;
ssl_prefer_server_ciphers on;


#add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always; # 启用HSTS

        location / {
                if ($host ~* "\d+\.\d+\.\d+\.\d+") { # 禁止以ip方式访问网站
                        return 400;
                        }
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection upgrade;
        }
}
```


docker compose启动后

这样访问

这用到前面说的密钥


添加一个订阅


单条

名字取好就不要改

如果改了分享会失效


选本地订阅


粘贴进节点的链接

我这演示只弄了一条

点保存


点分享按钮

这选过期时间

点创建分享

最后点复制链接


最后看下订阅返回的节点


\
项目地址

https://github.com/sub-store-org/Sub-Store

docker地址

https://hub.docker.com/r/xream/sub-store


[![视频讲解](https://img.youtube.com/vi/JGh4qW%5FbWsA/0.jpg)](https://www.youtube.com/watch?v=JGh4qW%5FbWsA)



includeUnsupportedProxy
