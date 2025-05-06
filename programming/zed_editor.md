## 替换zed的pyright为pylsp

我试了下，在项目下装了pylsp,  同时 `uv pip install python-lsp-ruff python-lsp-black python-lsp-isort`

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
