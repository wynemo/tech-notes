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
