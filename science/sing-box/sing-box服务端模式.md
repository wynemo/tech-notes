sing-box服务端模式 
访问家里局域网
不用怕运营商QoS

注意密码要用 `./sing-box generate rand --base64 32` 来生成
```json
  "inbounds": [
    {
      "type": "shadowsocks",
      "tag": "ss-sb-in",
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