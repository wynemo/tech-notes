# zed 编辑器的AI相关的功能

视频讲解：

[https://youtu.be/yZROVsoyKZE](https://youtu.be/yZROVsoyKZE)

考虑到看这个视频的朋友都是程序员，我会讲的很粗略

准备工作


1. zed 要用github授权登陆 然后它会提供免费的sonnet ai （有额度）
2. 硅基流动的api key 这里会用到deepseek-v2.5, 注册好以后拿到api密钥，填入到zed里 然后配置settings.json 这里 需要把 硅基流动 api信息填写进来
3. ollama (可选) deepseek-r1:7b
4. copilot 要 github 授权 （可选）免费用户也可以用一定的量，这样就可以到处补全，不光是编辑器


对话：

zed对deepseek支持的不够好，出现超时的情况， deepseek-r1几乎没法用

这推荐用deepseek-v2.5模型 / claude 3.5 sonnet 模型

然后其他地方会以当前对话的内容作为上下文


代码生成：

也推荐用 claude 3.5 sonnet 模型 / deepseek-v2.5模型 


终端里使用：

自动生成git commit信息用于提交


zed - 终端 - git diff -  侧边栏 - /terminal , 生成git commit信息 - 回到终端 - 打开inline assiant - git add modified file & commit


Zed Editor AI Assistance Features: Chat, Code Generation, Assistance in Terminal


Considering that the viewers of this video are all programmers, I will keep it brief.

Preparation:

 • Zed requires GitHub authorization to log in, and it will provide free access to Sonnet AI (with a quota).

 • For Silicon Flow API Key, use Deepseek-v2.5. After registering, get the API key and input it into Zed. Then configure the settings.json file with Silicon Flow API information.

 • Ollama (optional) Deepseek-r1:7b.

 • GitHub authorization is required for Copilot (optional). Free users can also use a limited amount, enabling code completions not just in the editor.

Conversation:

 • Zed’s support for Deepseek is not ideal, and timeouts may occur. Deepseek-r1 is almost unusable.

 • It’s recommended to use the Deepseek-v2.5 model or Claude 3.5 Sonnet model.

 • Other areas will use the current conversation content as context.

Code Generation:

 • It’s also recommended to use the Claude 3.5 Sonnet model or Deepseek-v2.5 model.

Terminal Use:

 • Automatically generate Git commit messages for submission.

 • Zed - Terminal - Git diff - Sidebar - /terminal, generate Git commit message - go back to the terminal - open inline assistant - git add modified file & commit.


