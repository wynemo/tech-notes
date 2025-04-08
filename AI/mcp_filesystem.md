# cherry studio + deepseek v3 + filesystem mcp 也能写代码


## mcp 介绍

[可以看官网介绍](https://modelcontextprotocol.io/introduction)

MCP 是一种开放协议，它标准化了应用向 AI 应用提供上下文的方式。
您可以将 MCP 视为 AI 应用的 USB-C 端口。
正如 USB-C 提供了一种将设备连接到各种外围设备和配件的标准化方式一样，MCP 提供了一种将 AI 模型连接到不同数据源和工具的标准化方式。

## filesystem mcp

它具有读写文件，读取/创建目录等功能，这样让大模型就可以帮我们写代码了

可以用这个具有文件访问权限的mcp，指定一个（或多个）目录
https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem

https://modelcontextprotocol.io/quickstart/server

然后你机器上要装有nodejs/npm，装有claude desktop

跟着我们编辑claude的配置文件

vi ~/Library/Application\ Support/Claude/claude_desktop_config.json

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/tommygreen/Documents/work"
      ]
    }
  }
}
```

注意这个mcp只能访问 /Users/tommygreen/Documents/work 这个目录

然后重启下claude desktop

便可以在它的配置 - 开发者 里看到filesystem了

然后我们来到聊天窗口便可以看到有一个锤子：🔨的图标 点进去看有available mcp tools的框

接着我们就可以向AI提问了

比如提问 `贤弟，帮我看下 realtime-advio 的 README.md 文件，说些什么，总结下`

它就会调用mcp工具，会问你要权限，你点接受

你在进程监控器里可以看到claude desktop启动了一个nodejs进程
`node /Users/tommygreen/.npm/_npx/a3241bba59c344f5/node_modules/.bin/mcp-server-filesystem /Users/tommygreen/Documents/work`

注意是macos系统的话，有系统的询问访问权限 这个可以在privacy & security - folders里可以看到授权

然后 Claude Desktop + MCP 就可以做和 Cursor 一样编辑代码了

当然免费版的claude额度不多 😁
