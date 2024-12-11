安装 outline

outline用起来了 配置比较麻烦

1. 跑 oidc server 单独跑docker compose

<https://github.com/vicalloy/oidc-server>

监听在 127.0.0.1:8888 上

```bash
ubuntu@oracle:~/oidc-server/docker-demo$ cat docker-compose.yml
version: "3"
services:
  oidc-server:
    image: vicalloy/oidc-server
    volumes:
      - ./data/db:/app/db:z
      - ./data/static_root:/app/static_root:z
    restart: always
  nginx:
    image: nginx
    ports:
      - 127.0.0.1:8888:8888
    volumes:
      - ./nginx/:/etc/nginx/conf.d/:ro
      - ./data/static_root:/static_root:ro
    restart: always
```

`docker-compose up -d` 先跑起来
`docker compose exec -it oidc-server bash -c "make init"` 获得root密码

http://127.0.0.1:8888/admin 访问这个 用root登录

创建client
Response types 全选中

Redirect URIs: 填写这两行

https://outline.foo.info:2443/auth/oidc.callback
http://localhost:3002/auth/oidc.callback

client id , client secret 保存 后面用

Credentials 这里填写 openid profile email

创建一个普通用户 填写 first name， last name， email，以后outline用这个登录


2. outline
它给的教程
<https://docs.getoutline.com/s/hosting/doc/docker-7pfeLP5a8t#h-docker-compose>

但是它给的https-portal 和 我的nginx-certbot 冲突了，我就不用 https-portal 了

docker.env配置要注意 用这个模板文件 https://github.com/outline/outline/blob/main/.env.sample

```bash
NODE_ENV=production
PGSSLMODE=disable
```


docker-compose 这样配置


```yaml
version: "3.2"
services:

  outline:
    image: docker.getoutline.com/outlinewiki/outline:latest
    env_file: ./docker.env
    expose:
      - 3000
    ports:
      - '127.0.0.1:3002:3000'
    volumes:
      - storage-data:/var/lib/outline/data
    depends_on:
      - postgres
      - redis
      - nginx

  redis:
    image: redis
    env_file: ./docker.env
    expose:
      - 6379
    volumes:
      - ./redis.conf:/redis.conf
    command: ["redis-server", "/redis.conf"]
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 30s
      retries: 3

  postgres:
    image: postgres
    env_file: ./docker.env
    expose:
      - 5432
    volumes:
      - database-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD", "pg_isready"]
      interval: 30s
      timeout: 20s
      retries: 3
    environment:
      POSTGRES_USER: 'user'
      POSTGRES_PASSWORD: 'pass'
      POSTGRES_DB: 'outline'

volumes:
  storage-data:
  database-data
```

最后整个服务监听在 127.0.0.1:3002

docker.env  里 to change的地方都需要改

docker.env 的 OIDC 这样配置

```bash
OIDC_CLIENT_ID=上面说的，填写
OIDC_CLIENT_SECRET=上面说的，填写
OIDC_AUTH_URI=https://outline.foo.info:2443/oauth/authorize/
```

URL 要改

最后换域名 outline.foo.info
