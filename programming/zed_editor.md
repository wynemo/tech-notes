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
          "ruff": {
            "enabled": true,
            "formatEnabled": true,
            "lineLength": 120
          },
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
