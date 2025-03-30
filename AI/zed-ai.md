# zed 编辑器的AI相关的功能

视频讲解：

[![视频讲解](https://img.youtube.com/vi/yZROVsoyKZE/0.jpg)](https://www.youtube.com/watch?v=yZROVsoyKZE)

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


zed - 终端 - git diff -  侧边栏 - /terminal , 生成git commit信息 - 回到终端 - 打开inline assiant - git add modified file & commit - 这现在已经没有用了，官方直接就可以在git面板生成git信息了


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

## 编辑默认提示词

但这个默认的提示词 不会影响 commit 信息生成

To edit prompts, select "Prompt Library" from the menu icon (three horizontal lines) in the upper right hand corner or using the cmd-k l keyboard shortcut.
要编辑提示，请从右上角的菜单图标（三条水平线）中选择“提示库”或使用 cmd-k l 键盘快捷键。

A default prompt might look something like:
默认提示可能看起来像这样：

[-] Default
  [+] Today's date
  [+] You are an expert
  [+] Don't add comments
Each of the above prompts can be individually expanded, and since Zed's assistant is all text, they can also be edited directly. Edits here will not propagate to the saved prompts.
上述每个提示都可以单独展开，而且由于 Zed 的助手都是文本，因此也可以直接编辑它们。此处的编辑不会传播到已保存的提示。

You can add prompts to the default prompt by clicking the icon in the top right (the "sparkle" icon) of the prompt editor. This will add the prompt to the default prompt.
您可以通过点击提示编辑器右上角的图标（“闪烁”图标）将提示添加到默认提示中。这会将提示添加到默认提示中。

Default prompts will show at the top of the prompt list, and will be included with every new chat.
默认提示将显示在提示列表的顶部，并且包含在每次新的聊天中。
