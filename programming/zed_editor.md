## 替换zed的pyright为pylsp

默认带的 pyright 不喜欢用

我试了下，在项目下装了pylsp,  同时 `uv pip install python-lsp-black python-lsp-isort`

或者 `uv add --dev python-lsp-black python-lsp-isort`

安装zed的ruff插件 然后系统装ruff： `uv tool install ruff`

facebook 的 pyrefly 也不错，也可以做一些检查， 安装zed的pyrefly插件 然后系统装pyrefly： `uv tool install pyrefly`

（记得 `uv tool update-shell` 更新一下shell）

ty试了下，目前还不好用，只能在命令行中用

zed配置如下

```json
{
  "languages": {
    "Python": {
      "language_servers": ["pylsp", "pyrefly", "!pyright", "..."],
      "preferred_line_length": 120
    }
  },
  "lsp": {
    "pylsp": {
      "binary": {
        "path": ".venv/bin/pylsp"
      },
      "settings": {
        "plugins": {
          "isort": {
            "enabled": true,
            "lineLength": 120,
            "args": ["--profile", "black"]
          },
          "black": {
            "enabled": true,
            "line_length": 120
          }
        }
      }
    },
    "pyrefly": {
      // "binary": {
      //   "path": "/Users/tommygreen/.local/share/uv/tools/pyrefly/bin/pyrefly",
      //   "arguments": ["lsp"]
      // },
      "settings": {
        "python": {
          "pythonPath": ".venv/bin/python"
        },
        "pyrefly": {
          "project_includes": ["src/**/*.py", "tests/**/*.py"],
          "project_excludes": ["**/.[!/.]*", "**/*venv/**"],
          "ignore_errors_in_generated_code": true
        }
      }
    }
  }
}

```

pyproject.toml配置如下：
```toml
[dependency-groups]
dev = [
    "black>=25.1.0",
    "isort>=6.0.1",
    "python-lsp-black>=2.0.0",
    "python-lsp-isort>=0.2.1",
]

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

# Logger objects that should be checked
logger-objects = ["app.logger", "logger"]

[tool.isort]
profile = "black"

[tool.black]
line-length = 120
```
