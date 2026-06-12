# CLIProxyAPI

把 Gemini CLI、Claude Code、OpenAI Codex、Grok Build 等 CLI 工具的**免费订阅额度**包装成标准 API 接口，供 Cursor、Continue、OpenCode 等任意支持 OpenAI API 的工具调用，无需单独付 API 费用。

Go 编写，开源，⭐ 37k stars。

- 仓库：https://github.com/router-for-me/CLIProxyAPI
- 文档：https://help.router-for.me/

## 架构

```
客户端请求 (OpenAI/Gemini/Claude 格式)
        ↓
  CLIProxyAPI 本地代理服务器
        ↓
   translator 层（格式双向转换）
        ↓
  实际调用 CLI 工具（通过 OAuth 登录）
        ↓
  转换响应格式返回给客户端
```

## 支持的 API 路由

| 路由 | 格式 |
|---|---|
| `/v1/chat/completions` | OpenAI Chat Completions |
| `/v1/responses` | OpenAI Responses API |
| `/v1/messages` | Claude Messages API |
| `/v1beta/models/.../generateContent` | Gemini API |

## 主要特性

- 多账号轮询负载均衡（Claude、Gemini、Codex、Grok 均支持）
- 流式 / 非流式响应
- Function calling / Tools 支持
- 多模态输入（文本 + 图片）
- 通过 OAuth 登录，无需 API Key

## 格式转换细节

### Codex → OpenAI Responses

Codex 底层是 Chat Completions 格式，转换极简：

- **流式**：直接透传 SSE `data:` 事件
- **非流式**：从 `response.completed` 事件中提取 `response` 字段返回

### OpenAI Responses ↔ Claude Messages

请求转换（`ConvertOpenAIResponsesRequestToClaude`）：

| OpenAI Responses 字段 | Claude Messages 字段 |
|---|---|
| `instructions` | `system` message |
| `input[].type==message` | `messages[]` |
| `function_call` | assistant `tool_use` |
| `function_call_output` | user `tool_result` |
| `tools[].parameters` | `tools[].input_schema` |
| `max_output_tokens` | `max_tokens` |
| `reasoning.effort` | `thinking.type` + `budget_tokens` / `output_config.effort` |

响应转换（`ConvertClaudeResponseToOpenAIResponses`）：
- 维护一个状态机（`claudeToResponsesState`）跟踪 text block、function call、reasoning 状态
- Claude SSE 事件 → OpenAI Responses 格式事件（`response.output_text.delta`、`response.output_item.done` 等）
- Claude thinking 内容 → OpenAI reasoning items

## 相关生态项目

| 项目 | 说明 |
|---|---|
| [vibeproxy](https://github.com/automazeio/vibeproxy) | macOS 菜单栏应用，封装 CLIProxyAPI |
| [Quotio](https://github.com/nguyenphutrong/quotio) | macOS 菜单栏，多提供商配额监控 + 自动故障转移 |
| [CCS](https://github.com/kaitranntt/ccs) | CLI 工具，快速切换多个 Claude 账号 |
| [CPA-Manager-Plus](https://github.com/seakee/CPA-Manager-Plus) | 完整管理中心，请求级监控 + 费用估算 |
