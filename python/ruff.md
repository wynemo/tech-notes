# python 新项目linter标配 ruff

[![视频讲解](ruff.svg)](https://youtu.be/wH2X27dRpqE)

上次讲了uv，我推荐新项目用uv来做包管理器

那么新项目的linter/code formatter 推荐什么呢，就是今天要讲的ruff

ruff 是一个python的的linter和代码格式化工具

和uv一样，它们都是出自[astral](https://astral.sh)

你有可能听说 flake8，black，isort，pylint等linter/formatter

现在基本上它们都不需要了

现在你只需要一个ruff就可以把它们的工作做完了 all in one

从[官网](https://docs.astral.sh/ruff/) 上 可以看到

比现有的 linters（如 Flake8）和格式化程序（如 Black）快 10-100 倍

和uv一样，ruff也是用rust写的，所以速度要比这些工具快很多

现在好多知名的python项目都在用ruff，比如：
fastapi https://github.com/fastapi/fastapi
transformers https://github.com/huggingface/transformers
pandas https://github.com/pandas-dev/pandas

我们以cursor为例使用ruff，你也可以用其他的vscode fork

首先我们安装ruff，使用uv来安装：`uv tool install ruff` (可能需要调用uv tool update-shell来更新shell)

它会安装到~/.local/bin/ruff

可以用 ruff version 看是否安装成功
```
❯ ruff version
ruff 0.11.11 (0397682f1 2025-05-22)
```

然后我们用cursor打开一个python项目

然后在市场里安装ruff这个插件

然后我们在workspace settings(json)里加入：

```json
    "[python]": {
        "diffEditor.ignoreTrimWhitespace": false,
        "editor.codeActionsOnSave": {
            "source.fixAll": "explicit", // 手动保存时，自动修复所有问题
            "source.organizeImports": "always" // 自动或手动保存时，自动整理导入
        },
        "editor.formatOnSave": true, // 保存时，自动格式化
        "editor.defaultFormatter": "charliermarsh.ruff" // 保存时，自动使用ruff格式化
    },
```

再在pyproject.toml里加入：
```toml
[tool.ruff]
line-length = 120

[tool.ruff.lint]
select = [
    # Pyflakes
    "F", # Pyflakes rules (F821 checks undefined names)

    # Pycodestyle
    "E", # Error-level PEP 8 rules
    "W", # Warning-level PEP 8 rules

    # flake8 plugins
    "G",   # flake8-logging-format rules
    "B",   # flake8-bugbear rules
    "C4",  # flake8-comprehensions rules
    "N",   # pep8-naming rules
    "SIM", # flake8-simplify rules
    "ARG", # flake8-unused-arguments
    "ERA", # eradicate (commented out code)
    "PL",  # pylint rules
    "RUF", # Ruff-specific rules

    # Security
    "S", # flake8-bandit (security)
]
extend-select = ["I"] # isort

# Logger objects that should be checked
logger-objects = ["app.logger", "logger"]
```

这样当我们修改代码，保存时，ruff会自动格式化代码，并整理导入

你也可以在诊断中看到工程里所有的问题，进行修复

有一些问题可以直接用 `command + .` 让它自动修复

但有些问题需要你自己修正

这时我也可以叫AI帮我们修正，直接选中有问题的代码，command + k呼出

也可以考虑用cursor + tab 来修复，AI很聪明的

（虽然这些代码也是AI写的，让AI来修正是不是很合理）

此外你可以用ruff的命令行来检查代码，比如：
```
ruff check .
```

或者
```
ruff check --fix .
```

这样就可以在CI里使用ruff来检查代码了
