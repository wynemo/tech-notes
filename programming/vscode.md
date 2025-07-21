# vscode 插件

## 配置
1. 字体
可以用：'Zed Mono', 'Maple Mono NF CN'
2. vscode如何设置编辑器失焦就保存
修改 VS Code 的设置文件 (settings.json) 在 JSON 文件的顶层添加 "files.autoSave": "onFocusChange"
3. 在一个新标签打开文件
    "workbench.editor.enablePreview": false

## 插件

### Gitlens

1. 布局

侧边栏有个 Gitlens 标签页, Gitlens Inspect 标签页
右下方有个 Gitlens 标签页（Terminal旁边）

2. git 历史

仓库历史 原来在 右下方的Gitlens 标签页这里

用起来很不习惯

vscode说真的，git这一块不怎么样

在仓库历史上移动，大概率会弹出一个很大的窗口，遮挡了其他commit的文字，你就不好选择

所以就选一下后 赶紧得把鼠标挪开

比较提交历史里的文件与本地文件的区别：选中一个commit，文件和本地比较，点最右边的"open changes with working file"(地球图标旁边)

3. 单个文件历史

在侧边栏有个 Gitlens 标签页，点开，有个File History，点开，就可以看到单个文件的历史

选中一个commit，右键点 compare working tree to here 可以本地文件和历史版本做比较

![Screenshot 2025-03-13 at 00.06.42.png](<Screenshot 2025-03-13 at 00.06.42.png>)



### vscodevim
 vim 插件 输入法切换
macism 好像没有效果：
```
"vim.autoSwitchInputMethod.enable": true,
"vim.autoSwitchInputMethod.defaultIM": "com.apple.keylayout.US",
"vim.autoSwitchInputMethod.obtainIMCmd": "/opt/homebrew/bin/macism",
"vim.autoSwitchInputMethod.switchIMCmd": "/opt/homebrew/bin/macism {im}"
```

难道还是要用im-select, 或者cursor里不支持？
可能一开始没设置macism全路径
设置了以后
删除苹果里那个授权后 重新打开cusor 它会喊授权
但是就是按esc 不行啊 不能退回到英文输入法 佛了 难道就是这么设计的？

看issue是可以的啊 https://github.com/laishulu/macism/issues/3

要不试试im-select？
改成了im-select 试试 不行 看来是cursor的问题 日狗

换成vscode 试试
也不行 醉了 而且吊诡的是 vscode 都没有授权，也是和cusor一样的现象，input模式能切换到中文
按esc不能回到英文
重启下macos
还是不行
空了找别的机器试试

原来抄配置弄错了 是 com.apple.keylayout.ABC 不是 com.apple.keylayout.US
抄代码前，注意自己跑一下macism获得英文输入法的名字
```
❯ macism
com.apple.keylayout.ABC
```

新的配置：
```
"vim.autoSwitchInputMethod.enable": true,
"vim.autoSwitchInputMethod.defaultIM": "com.apple.keylayout.ABC",
"vim.autoSwitchInputMethod.obtainIMCmd": "/opt/homebrew/bin/macism",
"vim.autoSwitchInputMethod.switchIMCmd": "/opt/homebrew/bin/macism {im}"
```
确实好了
😁
以后可以在cursor里愉快的写中文了

### copilot

自动生成 commit 信息 [设置一下prompt](https://code.visualstudio.com/docs/copilot/copilot-customization#_define-commit-message-generation-custom-instructions)

我这就让它使用中文

```json
    "github.copilot.chat.commitMessageGeneration.instructions": [
        {
            "text": "使用中文"
        }
    ]
```

### cline 插件

有copilot可以用 有 claude 3.5 可以用
然后也可以 cline 插件 + gemini2.5 pro

可以在[这里](https://aistudio.google.com/app/apikey)拿到 gemini 的 key

**注意** ：访问google 要美国的节点, 而且额度太少了，每天25次

#### cline 插件配置

在设置里搜索 cline，找到 "cline.preferredLanguage" 选项，设置为中文

```
    "cline.preferredLanguage": "Simplified Chinese - 简体中文"
```

### python lint/formatter
使用ruff

本来想像[zed那样](zed_editor.md)，配置一个lsp，但是发现vscode并不能随意指定lsp

折腾了一下 装了 vscode的ruff插件，black插件， ty插件

然后装相应的python工具
black：我就装在了.venv里面
ty用uv装的 `uv tool install ty` 这是一个检查python类型的工具
ruff也是用uv装的 `uv tool install ruff`, 它是一个linter，给你检查各种代码风格


然后配置了vscode的settings.json

```json
//python & ruff
"[python]": {
    "diffEditor.ignoreTrimWhitespace": false,
    "editor.codeActionsOnSave": {
        "source.fixAll": "explicit", // explicit表示command + s 时，手动保存，才触发
        "source.fixAll.ruff": "explicit",
        "source.organizeImports": "explicit"
    },
    "editor.defaultFormatter": "ms-python.black-formatter"
},
"python.languageServer": "Default",
"python.venvPath": ".venv",
```

### Dendron Paste Image

paste image from clipboard directly
直接从剪切板粘贴图片，这下markdown里贴图就方便了，macos上直接command + option + v就可以
