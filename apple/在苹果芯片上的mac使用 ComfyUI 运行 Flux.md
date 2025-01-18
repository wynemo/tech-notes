大家好
今天讲下用mac来生成图片
首先我们讲一下配置
推荐内存24GB，16GB的也能运行
flux dev使用，提示词多写一些，好点
diffusionbee 可直接用flux dev （github上下载 dmg） 问题是用不了lora
macos，先装comfyui

安装brew

git clone https://github.com/comfyanonymous/ComfyUI
cd ComfyUI
brew install uv
uv venv --python 3.12
uv pip install --pre torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/nightly/cpu
uv pip install -r requirements.txt
uv run main.py

接着装flux gguf模型，跑

参考：https://comfyui-wiki.com/en/tutorial/advanced/flux1-comfyui-guide-workflow-and-examples#gguf-version-flux1-workflow

视频讲解：https://youtu.be/bui6B7V5roc
