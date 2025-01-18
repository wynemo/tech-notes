# 使用ollama跑本地模型

视频讲解：https://www.youtube.com/watch?v=jCj-FSLPi_E

对于有隐私要求等朋友来说 跑本地大模型是不错的

#### 安装

去官网下载 <https://ollama.com/>

安装完后 启动app会跑在托盘 在一台m2 16G的机器上  `ollama run zephyr`，然后看效果还凑合可以用

如果想给局域网使用 而且用macapp在托盘启动 先命令行(不能ssh过去)里敲 `launchctl setenv OLLAMA_HOST "0.0.0.0"`  再重启app


需要注意的是可能会遇到跨域问题 <https://docs.chatkit.app/ollama.html#enabling-ollama-on-chatkit> <https://github.com/ollama/ollama/issues/2335>

目前用这个chrome插件 <https://chrome.google.com/webstore/detail/jfgfiigpkhlkbnfnbobbkinehhfdhndo> 就是有跨域问题，

先命令行里敲：

`launchctl setenv OLLAMA_ORIGINS "*"` 再重启app解决

或者 `OLLAMA_ORIGINS="*" OLLAMA_HOST=0.0.0.0 ollama serve` 直接在命令行里跑

***Ollama*** binds 0.0.0.0 ***port*** 11434

#### 相关的一些应用

* <https://github.com/ex3ndr/llama-coder> vscode插件
* <https://github.com/openai-translator/openai-translator> 翻译软件
* <https://github.com/ollama/ollama?tab=readme-ov-file#community-integrations> 官方仓库也推荐了很多插件 应用

#### 使用的一些模型

```bash
usm@usmdeMac-mini ~ % ollama list
NAME                     	ID          	SIZE  	MODIFIED
codellama:13b-code-q4_K_M	77d7c80a2b17	7.9 GB	49 minutes ago
gemma:7b                 	430ed3535049	5.2 GB	18 minutes ago
openchat:7b              	537a4e03b649	4.1 GB	32 minutes ago
zephyr:latest            	bbe38b81adec	4.1 GB	25 hours ago
```
