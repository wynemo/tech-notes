## 替换zed的pyright为pylsp

默认带的 pyright 不喜欢用

我试了下，在项目下装了pylsp,  同时 `uv pip install python-lsp-ruff python-lsp-black python-lsp-isort`

或者 `uv add --dev python-lsp-ruff python-lsp-black python-lsp-isort`

```json
{
  "languages": {
    "Python": {
      "language_servers": ["pylsp", "!pyright", "..."],
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
    }
  }
}
```
