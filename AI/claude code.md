## 规则

创建一个 CLAUDE.md

## vps

我也没有用家宽，就用的一台洛杉矶的 vps 然后用野卡充钱，月付，目前用了几天，没有翻车，账号是注册了好几年的

## 分流规则

```
# claude
DOMAIN-SUFFIX,servd-anthropic-website.b-cdn.net
DOMAIN-SUFFIX,anthropic.com
DOMAIN-SUFFIX,claude.ai
DOMAIN-SUFFIX,claudeusercontent.com
DOMAIN-SUFFIX,intercomcdn.com
DOMAIN-SUFFIX,cdn.usefathom.com
# stripe
DOMAIN-SUFFIX,stripe.com
DOMAIN-KEYWORD,stripe
```

## claude 计划模式

shift + tab 就可以切换过去

你可以给你的需求，先让它自动创建一个计划

你可以审视它的计划，并且决定是否执行

觉得不好 可以告诉它调整

它会创建一堆 todos 然后逐渐实现

## 自动接受

shift + tab 就可以切换过去，然后让它自己写代码，不用你确认了

## 调用 gemini
gemini 自己改总是想太多 不太遵循提示词；它反正暴力发送大量 input tokens 到服务器 用下 google 算力分析下 倒是效果蛮好的
然后根据结果再让 claude code 改