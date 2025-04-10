## claude 封号应对

“其实 Claude 封号远比 OpenAI 严重，除了风控策略，更重要的是，大家缺少一个不断更新的域名规则来做分流，即：到底哪些请求代表 Claude 。 截图是使用最多的开源规则，24 年 7 月就不更新了，PR 也不通过。而实际 Claude 请求的域名已经不止这些，我自己都累积了几条，但是现在好像没人敢做这个了“

“我被封号，申诉没用，注册了信号，直接弄了个便宜日本服务器，安装了 Linux ，就运行一个谷歌浏览器。只为用 Claude 。”

“另外我发现，Claude 在对话的时候也会请求 stripe 的域名，有没有 stripe 用的非常深入的可以分享下是为啥，是不是 stripe 也提供了什么风险检测工具？”

我的想法🤔：

+ 要不就找个好一点的节点，美帝的，final 兜底走这个，然后尽可能找 claude 的域名做好分流
就看分流的缘分了，万一有漏网之鱼，或者 IP 不纯净被制裁

+ openrouter
有人问为啥要用 claude

因为写代码还是它最合适

不过我也不咋直接用 Claude

而是在 zed ，cursor 里用 (前者依然要代理 zed.dev)

claude sonnet 3.5

3.7 有人说还退步不好用了

surge rule set:

```
# claude
DOMAIN-SUFFIX,servd-anthropic-website.b-cdn.net
DOMAIN-SUFFIX,anthropic.com
DOMAIN-SUFFIX,claude.ai
DOMAIN-SUFFIX,claudeusercontent.com
DOMAIN-SUFFIX,intercomcdn.com
DOMAIN-SUFFIX,cdn.usefathom.com
```

OpenRouter新政:

每天免费模型调用次数从200降到50。
但账户有10美金以上，调用次数反升1000次。

白嫖Deepseek V3、Gemini 2.5 pro等免费模型

发现支付宝和微信也能买

Use checkout page -> Get Payment Link -> Buy Credits -> Pay without Link -> 填Wechat或支付宝付款地址->支付
