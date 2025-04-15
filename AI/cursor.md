Cursor不仅擅长编程，还内置智能聊天功能，聊天时可直接使用联网查询。

command + L 呼出聊天窗口，然后输入 @Web 就可以联网查询

也可以 @一个网络连接，比如 @https://www.baidu.com， 然后问大模型

~~也可以使用 @Codebase 来检索本地文件，然后再问大模型~~

cursor/vscode 在生成 commit message 后自动将焦点切换到 Source Control，
然后根据需要进行修改，再决定是否提交
keybindings.json:

```json
[
    {
        "command":"runCommands",
        "key": "cmd+g cmd+g",
        "args":{
            "commands" :[
            "workbench.action.files.save",
            "git.stageAll",
            "cursor.generateGitCommitMessage", // vscode github.copilot.git.generateCommitMessage
            "workbench.scm.focus"
            ]
        }
    }
]
```

可以在 `.cursor/rules/xx.mdc` 里写一些规则

Reply from yetone (@yetone):
"其实 cursor 的原理并不简单，真正实施起来那就更难了，而且它所有的工程难度恰恰就只是为了解决一个问题 ——「不要让用户手动复制粘贴代码」，所以它在用户体验上下了苦功夫，不仅在工程上要在传统代码编辑器上发明新的代码编辑的范式和工作流，还自己训练和部署了快速 edit 模型 FastApply，自己训练和部署了 cursor tab prediction 模型 Fusion，为了更好地解决 context 携带问题，在本地和服务端做了两层 RAG，这一切都不是一时半会儿能够超越的，这还没说它一路走来做的那些 shadow workspace 等等类似的实验了"
