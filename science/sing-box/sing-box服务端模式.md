[youtube 讲解](https://www.youtube.com/watch?v=brnxkoetJA4)
sing-box服务端模式 
访问家里局域网
需要有公网IP
直接用TCP连接而不用UDP，不用怕运营商QoS

2025.04.10 补充，有时候用ss协议，连不上局域网，看日志也没有任何错误，但是就是连接超时，大概就是sing-box的bug。。。。
用vless会好一点 但vless有些网站打不开 比如家里的tplink路由器主页它就打不开
同样的用snell协议 就不会有问题 😅

## shadowsocks2022 例子

+ shadowsocks 密码要用 `./sing-box generate rand --base64 32` 来生成

```json
  "inbounds": [
    {
      "type": "shadowsocks",
      "tag": "ss-in",
      "listen": "::",
      "listen_port": 14379,
      "sniff": true,
      "sniff_override_destination": true,
      "method": "2022-blake3-aes-256-gcm",
      "password": "DgrOjcmCMEr9biLy2V89BUelOI2b08vApCrR+osYsJs=",
      "multiplex": {
        "enabled": true,
        "padding": true
      }
    }
  ]
```

## vless reality  例子

+ uuid `./sing-box generate uuid` 来生成
+ private_key `./sing-box generate reality-keypair` 来生成密钥对
+ short_id  `./sing-box generate rand 8 --hex` 来生成

```json
  "inbounds": [
    {
      "type": "vless",
      "tag": "vless-in",
      "listen": "::",
      "listen_port": 7443,
      "sniff": true,
      "sniff_override_destination": true,
      "users": [
        {
          "uuid": "f131ddb4-f69e-48a0-91ec-f7fede7050ce",
          "flow": "xtls-rprx-vision"
        }
      ],
      "tls": {
        "enabled": true,
        "server_name": "icloud.cdn-apple.com",
        "reality": {
          "enabled": true,
          "handshake": {
            "server": "icloud.cdn-apple.com",
            "server_port": 443
          },
          "private_key": "WEMo7QC_fowt_i78v3_cuiY4H7TWDmGUhawCv9qKrXc",
          "short_id": [
            "a81fba46b2c38bc7"
          ]
        }
      }
    }
  ]
```

## vmess-grpc 例子

```json
  "inbounds": [
    {
      "type": "vmess",
      "tag": "vmess-grpc-in",
      "listen": "::",
      "listen_port": 4809,
      "sniff": true,
      "sniff_override_destination": true,
      "transport": {
        "type": "grpc",
        "service_name": "cancanneed",
        "idle_timeout": "15s",
        "ping_timeout": "15s",
        "permit_without_stream": false
      },
      "users": [
        {
          "uuid": "b8c7278-6d8be-4c8c-b21c-d90f339e6ad1",
          "alterId": 0
        }
      ],
      "tls": {
        "enabled": false,
        "server_name": "bing.com",
        "certificate_path": "/etc/sing-box/bing.com.crt",
        "key_path": "/etc/sing-box/bing.com.key"
      },
      "multiplex": {
        "enabled": false
      }
    }
  ]
```

## trojan grpc例子

```json
  "inbounds": [
    {
      "tag": "ss-trojan-in",
      "type": "trojan",
      "listen": "::",
      "listen_port": 41268,
      "users": [
        {
          "name": "test",
          "password": "xxxyyy"
        }
      ],
      "tls": {
        "enabled": false,
        "server_name": "xx.your_domain.info",
        "alpn": ["http/1.1"],
        "min_version": "1.2",
        "max_version": "1.3",
        "acme": {
          "domain": ["xx.your_domain.info"],
          "data_directory": "/etc/sing-box",
          "default_server_name": "",
          "email": "your_email@gmail.com",
          "provider": "letsencrypt"
        }
      },
      "transport": {
        "type": "grpc",
        "service_name": "cancanneed",
        "idle_timeout": "15s",
        "ping_timeout": "15s",
        "permit_without_stream": false
      },
      "multiplex": {
        "enabled": false
      }
    },
  ]
```

## hysteria2 例子

    {
      "type": "hysteria2",
      "tag": "hysteria2-in",
      "listen": "::",
      "listen_port": 1957,
      "sniff": true,
      "sniff_override_destination": true,
      "up_mbps": 600,
      "down_mbps": 600,
      "users": [
        {
          "name": "anyone",
          "password": "your password"
        }
      ],
      "ignore_client_bandwidth": false,
      "masquerade": "https://news.ycombinator.com/",
      "tls": {
        "enabled": true,
        "server_name": "xx.your_domain.info",
        "alpn": ["h3"],
        "min_version": "1.2",
        "max_version": "1.3",
        "acme": {
          "domain": ["xx.your_domain.info"],
          "data_directory": "/etc/sing-box",
          "default_server_name": "",
          "email": "your_email@gmail.com",
          "provider": "letsencrypt"
        }
      }
    }
