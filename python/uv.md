# 2025 了 最好的最快的 python 包管理器 uv

视频讲解：
[![视频讲解](uv.svg)](https://youtu.be/wH2X27dRpqE)

是的 我说的 最好的、最快的 python 包以及 python 版本管理器

如果你了解过 python，估计听说过`pip,pip-tools,pipx,poetry,pyenv,twine,virtualenv，Anaconda`这些名词

现在 2025 年这些都不需要再了解了，只需要一个 uv 就能把它们都代替了

适用人群：程序员，科学计算、数据处理、AI、金融等从业人员

linux，macos 安装：curl -LsSf https://astral.sh/uv/install.sh | sh

macos 安装：brew install uv

windows 安装：powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

+ 速度快 下载本来就快，下过的包不用再下

+ 直接跑工具：pypi，github 上的 python 包，直接 uvx 一把梭哈：`uvx --from marker-pdf marker_single --page_range "25-35" --output_dir . --output_format html /Users/tommygreen/Downloads/通信原理（樊昌信--第六版）.pdf`

+ 跑项目 https://github.com/mannaandpoem/OpenManus  uv venv --python 3.12

+ 直接帮你下载管理 python 版本，多版本支持，想用哪个 python 版本就随意用（看 python 的版本的列表）

+ 主流平台都支持，windows，macos，linux 都支持

+ 工程管理，锁定版本 uv run 直接原神启动，uv init

为什么快呢

+ 缓存，硬链接等技术

+ rust 编写

缓存到哪里了

## uv 发布包到 pypi

先用 uv build 构建

然后 uv publish

输入用户名 `__token__` 与实际的 token 即可发布

## index url 使用清华源

环境变量为 `UV_INDEX_URL`

```bash
export UV_INDEX_URL=https://pypi.tuna.tsinghua.edu.cn/simple
uv sync
```


## uv sync

同步包

## 使用 uv 做为 docker 镜像

使用这个镜像 ghcr.io/astral-sh/uv:python3.12-bookworm-slim

```Dockerfile
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS builder

# Copy the project into the image
ADD . /app

# Sync the project into a new environment, asserting the lockfile is up to date
WORKDIR /app
# 如果需要使用国内镜像源，取消下面两行注释（注意：不能与 --locked 同时使用）
#ENV UV_INDEX_URL=https://pypi.tuna.tsinghua.edu.cn/simple
#RUN uv sync

# --locked 确保依赖版本与 uv.lock 完全一致，适合生产环境
RUN uv sync --locked

FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim

RUN apt-get update && apt-get install -y procps && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=builder /app /app

ENTRYPOINT ["/bin/bash", "-c"]
CMD ["uv run main.py"]
```