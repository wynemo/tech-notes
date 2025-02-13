使用大模型API
部署电报机器人对话
支持联网查询 & 获取网页内容 作为上下文

弄了一个电报机器人 调用大模型api与你对话

 可以以duckduckgo搜索返回的内容作为上下文，或者获取网页内容作为上下文，暂时不支持流式对话（有空再来支持）

先看下效果：


支持ollama 或者 openai兼容的api

比如流动硅基的api、nvidia的api

它们注册以后都送一定的免费次数

这里以黄皮衣为例子：

地址 https://build.nvidia.com/deepseek-ai/deepseek-r1
注册好以后送1000次

模型名字为deepseek-ai/deepseek-r1

`settings.env`中填写环境变量:

```env
BOT_TOKEN=你的Telegram Bot Token
BOT_NAME=你的Telegram Bot 名字
API_URL=API地址，默认是黄皮衣的
API_SECRET=API密钥
MODEL_NAME=模型名称
```

然后docker compose up

看到 “机器人已启动…” 就算成功

就可以对话了

可以私聊，也可以拖入群聊

## 视频讲解
[![视频讲解](https://img.youtube.com/vi/E5CH3p9w8UU/0.jpg)](https://www.youtube.com/watch?v=E5CH3p9w8UU)
