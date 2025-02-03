# 浏览器插件 Page Assist 使用 ollama 本地模型 联网查询 知识库查询 总结网页信息

之前有讲过用ollama 跑本地模型，提供翻译服务
今天来一个浏览器插件page assist，使用ollama，进行联网查询，知识库查询，与网页聊天

首先是安装ollama 这个在上期视频中有讲过，这里就不再赘述
首先我们需要下载嵌入式模型，可使用 ollama pull nomic-embed-text 这个命令

然后我们到插件商店，搜索page assist，安装这个插件
打开page assist 这个 chrome插件
ollama settings 里面设置一下，输入我们的ollama的地址，然后点击保存
rag settings这里选刚才下载的nomic-embed-text这个模型，然后点击保存

点击manage models，这里会显示模型的列表，我们这里会使用deepseek-r1:7b, 以及phi4这两个模型


视频讲解：https://youtu.be/w_HuP1ytZGQ

## 使用 openai 兼容的api

打开OpenAI compatible API

然后点击add provider

比如我们用硅基流动的api，填上api地址：https://api.siliconflow.cn/v1， 注意这里要写v1，然后api key填上你的api key，然后点击save

可以选上deepseek-r1，deepseek-v3这些聊天模型

然后我们就可以使用openai的api来查询了

## 联网查询

主要解决模型的知识库有限，无法回答所有问题的问题，可以通过联网查询，获取更多的信息，来回答问题
同时也是避免大模型胡编乱造，提供错误信息
这个现在chatgpt也有这个功能，可以直接联网查询
比如我们这里查询一个韩国女团的信息，ITZY成员的信息，比如年龄等
联网查询可以把搜索结果条数在设置里改下，从2改到10
模型这里可以用本地模型，也可以用openai兼容的api提供的模型，后者效果更好，速度更快，但是需要付费

## 知识库查询

to be continued
