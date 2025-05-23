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

比如
```markdown
---
description:
globs:
alwaysApply: true
---
# 开发规范

## 语言规范
- 使用中文进行开发，但变量使用英文
- 注释用中文
- 函数、类、接口等开头需要加上"cursor 生成"或者同等意思的英文

## 依赖规范
- 前端代码禁止使用 antd 组件库
- 可以使用其他 UI 组件库替代

```

Reply from yetone (@yetone):
"其实 cursor 的原理并不简单，真正实施起来那就更难了，而且它所有的工程难度恰恰就只是为了解决一个问题 ——「不要让用户手动复制粘贴代码」，所以它在用户体验上下了苦功夫，不仅在工程上要在传统代码编辑器上发明新的代码编辑的范式和工作流，还自己训练和部署了快速 edit 模型 FastApply，自己训练和部署了 cursor tab prediction 模型 Fusion，为了更好地解决 context 携带问题，在本地和服务端做了两层 RAG，这一切都不是一时半会儿能够超越的，这还没说它一路走来做的那些 shadow workspace 等等类似的实验了"

### agent 模式

属于是轮椅模式

1. 写好思路给代码上下文 先让cursor agent弄一个功能点 (这种一定要审核 有可能乱删代码) 
2. 或者弄一个原形 

agent 模式不要安排太多任务 最好拆分一下 一个是生成代码太多你还得审核 看不过来

### tab 或者 command k 生成代码

然后善用cursor tab/以及command k

cursor tab - 非常好用，快速生成一堆代码，不用自己敲键盘了 属于是荒野大镖客里的辅助射击，自动锁定爆头的感觉

command k - 生成代码 - 可以用o4 mini/cursor fast这种小模型（后者更快） 一行变更之类的 

小模型不要钱 所以这样用下来比较节省

比如这些场景：
+ 语法不熟 帮你写个ts的filter map
+ css帮你写样式、颜色

### agent 用什么模型

懒人可以让它自动选模型

通常情况下简单场景最优的：claude 3.5
通常情况下有一定难度的场景最优的：claude 3.7 + 思考模式
上下文少，只需要短输出的：gpt o4-mini
上下文长度中等，可能需要较长输出，且有一定难度的：claude 3.7 + 思考模式
上下文长度长，可能需要较长输出，但不怎么难的：gemini 2.5 pro + 思考模式
上下文长度长，需要较长输出，还有难度的：要么拆分处理，要么 gpt o3 ，其他的犯病概率较高

总之哪个模型用的爽，你可以对比下效果，你就用哪个
