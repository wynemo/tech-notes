# 2025了 最好的最快的python包管理器 uv

视频讲解：
[![视频讲解](uv.svg)](https://youtu.be/wH2X27dRpqE)

是的 我说的 最好的、最快的 python包以及python版本管理器

如果你了解过python，估计听说过`pip,pip-tools,pipx,poetry,pyenv,twine,virtualenv，Anaconda`这些名词

现在2025年这些都不需要再了解了，只需要一个uv就能把它们都代替了

适用人群：程序员，科学计算、数据处理、AI、金融等从业人员

linux，macos 安装： curl -LsSf https://astral.sh/uv/install.sh | sh

macos 安装：brew install uv

windows 安装：powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

+ 速度快 下载本来就快，下过的包不用再下

+ 直接跑工具：pypi，github上的python包，直接uvx 一把梭哈：`uvx --from marker-pdf marker_single --page_range "25-35" --output_dir . --output_format html /Users/tommygreen/Downloads/通信原理（樊昌信--第六版）.pdf`

+ 跑项目 https://github.com/mannaandpoem/OpenManus  uv venv --python 3.12

+ 直接帮你下载管理python版本，多版本支持，想用哪个python版本就随意用（看python的版本的列表）

+ 主流平台都支持，windows，macos，linux都支持

+ 工程管理，锁定版本 uv run 直接原神启动,uv init

为什么快呢

+ 缓存，硬链接等技术

+ rust编写

缓存到哪里了
