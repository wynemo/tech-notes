# New API 部署教程

> 视频来源：莱卡云赞助教程

## 项目介绍

New API 是一个支持多种 AI 模型格式的聚合平台：
- 支持 OpenAI、Claude、Gemini 等格式
- 可以方便地整合各家 AI 模型渠道
- 提供统一的 API 接口管理

## 环境准备

- 服务器系统：Debian 13
- 需要工具：Docker、Docker Compose、Git

## 部署步骤

### 1. 安装 Docker

SSH 登录到服务器后，按照 Docker 官方文档安装：

```bash
# 更新软件包列表
apt update

# 安装必要的软件包
apt install -y ca-certificates curl gnupg

# 创建 keyrings 目录
install -m 0755 -d /etc/apt/keyrings

# 下载 Docker GPG 密钥
curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# 修改密钥文件权限
chmod a+r /etc/apt/keyrings/docker.gpg

# 添加 Docker 源
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

# 再次更新软件包列表
apt update

# 安装 Docker
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

验证 Docker 安装：

```bash
# 检查 Docker 服务状态
systemctl status docker

# 验证 Docker 版本
docker --version
```

### 2. 部署 New API

```bash
# 克隆项目（确认在合适的目录）
git clone https://github.com/Calcium-Ion/new-api.git

# 进入项目目录
cd new-api

# 查看环境变量示例（可选）
cat .env.example

# 使用默认配置启动服务
docker compose up -d
```

等待镜像拉取和服务启动完成。

### 3. 访问和初始化

#### 访问 Web 界面

- 地址：`http://服务器IP:3000`
- 如需 HTTPS，可自行配置 Nginx 或 Caddy 反向代理，并添加 SSL 证书

#### 初始化设置

1. **语言设置**
   - 选择中文界面

2. **数据库配置**
   - 按提示配置数据库（使用默认配置即可）

3. **管理员账户**
   - 用户名：admin（或自定义）
   - 密码：设置一个安全密码

4. **运营模式**
   - 根据需要选择运营模式

5. **完成初始化**
   - 点击"初始化系统"
   - 使用管理员账户登录控制台

## 功能配置

### 令牌管理

用于创建 API 访问令牌：

1. 进入"令牌管理"
2. 点击"添加令牌"
3. 配置项：
   - 名称：自定义令牌名称（如"测试"）
   - 过期时间：可设置为"永不过期"
   - 额度：可选择"无限额度"
   - 其他选项根据需要配置

### 渠道管理

添加 AI 服务供应商渠道：

#### 示例：添加 OpenRouter 渠道

1. 点击"添加渠道"
2. 配置参数：
   - **类型**：选择 OpenRouter
   - **密钥**：填入 OpenRouter 的 API Key
   - **地址**：`https://openrouter.ai/api`
   - **模型列表**：填入支持的模型（如 `gpt-*`）
   - **测试模型**：选择一个用于测试的模型

3. **模型重定向**（重要）
   - OpenRouter 的模型名称带有前缀（如 `openai/gpt-4`）
   - 而用户请求可能使用简化名称（如 `gpt-4`）
   - 需要配置重定向映射：
     ```
     gpt-4 → openai/gpt-4
     gpt-3.5-turbo → openai/gpt-3.5-turbo
     ```

4. 提交配置

#### 优先级和权重说明

- **优先级**：数字越小，优先级越高（1 为最高优先级）
  - 系统会优先使用优先级高的渠道

- **权重**：用于负载均衡
  - 当多个渠道优先级相同时，按权重分配请求
  - 实现不同渠道之间的负载均衡

### 模型设置

在"系统设置" → "模型相关"中：
- 配置模型倍率
- 某些模型如果没有设置倍率，将不允许使用
- 根据实际需要调整付费相关设置

## 集成 Claude Code

new api 上要配置 claude-haiku-4-5-20251001 这个模型（其他家的小模型其实也可以的 当懒得设置环境变量了嘛）

然后可以有 claude-opus-4-5-20251101 或者 claude-sonnet-4-5-20250929 等模型 (通过 /model 来指定)
其他家比如 openai、deepseek 等 的模型也是可以的，比如 deepseek-v3.2，gpt-5.1-codex，glm-4.6 等

### 配置环境变量，命令行使用 claude code

Claude Code 可以通过配置环境变量连接到 New API：

```bash
# 设置 New API 的地址
export ANTHROPIC_BASE_URL="http://服务器IP:3000"

# 设置 New API 的令牌
export ANTHROPIC_AUTH_TOKEN="sk-xxxxxx"
```

**说明：**
- `ANTHROPIC_BASE_URL`：New API 的 API 地址
- `ANTHROPIC_AUTH_TOKEN`：在 New API 的"令牌管理"中创建的令牌

配置完成后，Claude Code 会自动使用 New API 作为后端服务。


### VSCode Claude Code 插件配置

如需在 VSCode 中使用 Claude Code 插件，可参考此 issue：https://github.com/musistudio/claude-code-router/issues/852

**配置方法：** 编辑 `~/.claude/settings.json` 文件

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "sk-xxxx",
    "ANTHROPIC_BASE_URL": "http://127.0.0.1:3456"
  },
  "model": "volcengine,deepseek-v3-1-terminus"
}
```

**注意：** 这里使用的是 `ANTHROPIC_AUTH_TOKEN`，而不是 `ANTHROPIC_API_KEY`。

## 集成 Cherry Studio

Cherry Studio 是一个 AI 聊天客户端，可以连接 New API：

### 配置步骤

1. **重启 New API 服务**
   ```bash
   cd new-api
   docker compose restart
   ```

2. **导出配置**
   - 重新登录 New API 控制台
   - 进入"令牌管理"
   - 点击令牌的下拉菜单
   - 选择"Cherry Studio"导出配置

3. **在 Cherry Studio 中配置**
   - 打开 Cherry Studio
   - 添加服务器地址：`http://服务器IP:3000`
   - 填入 API 密钥
   - 点击"管理"查看可用模型
   - 选择需要使用的模型（如 GPT-4）

4. **测试连接**
   - 发送测试消息（如 "hello"）
   - 验证响应是否正常

### 查看使用日志

在 New API 的"使用日志"中可以看到：
- 渠道信息
- 实际使用的模型
- 用户请求的模型
- 请求详情和消耗统计

## 进阶配置

### HTTPS 配置（可选）

使用 Nginx 或 Caddy 配置反向代理：

**Nginx 示例：**
```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Caddy 示例：**
```
your-domain.com {
    reverse_proxy localhost:3000
}
```

### 多渠道负载均衡

1. 添加多个相同类型的渠道
2. 设置相同的优先级
3. 配置不同的权重值
4. 系统将自动按权重分配请求

### 自定义模型

在渠道配置中可以添加自定义模型名称，实现：
- 模型别名
- 自定义路由规则
- 灵活的模型管理

## 常见问题

### 服务无法访问
- 检查防火墙是否开放 3000 端口
- 确认 Docker 服务是否正常运行
- 查看 Docker 日志：`docker compose logs`

### 渠道测试失败
- 验证 API 密钥是否正确
- 检查网络连接是否正常
- 确认模型重定向配置是否正确

### 模型不可用
- 检查系统设置中是否配置了模型倍率
- 确认渠道中已添加该模型
- 验证令牌权限是否包含该模型

## 相关资源

- New API GitHub: https://github.com/Calcium-Ion/new-api
- Docker 官方文档：https://docs.docker.com
- OpenRouter: https://openrouter.ai
- Cherry Studio: 相关 AI 聊天客户端

---

*教程整理自视频转录稿，部分内容可能需要根据实际版本调整。*
