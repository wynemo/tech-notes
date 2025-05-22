# YouTube制作工具链与工作流程

## 核心工作流程
1. 写markdown稿子
2. 念稿 + 录屏
3. 修视频 + 遮挡敏感信息
4. 生成字幕
5. 发布优化

## 录制工具

### 录音设置
- **工具**: 剪映（猴哥声音输出）
- **配置**: 如果用耳机录音，苹果上声音的设置：只用耳机做输入，不能用耳机做输出，输出用扬声器。否则噪音很大。

### 录屏工具
- **QuickRecorder**: 录屏（1.5.5版本）
- **KeyCastr**: 录键盘操作
- **Quick Camera**: 露脸录制（暂未使用）

## 字幕制作

### 语音识别
- **工具**: Whisper
- **命令示例**:
  ```bash
  uv run whisper /Users/tommygreen/Desktop/Recording\ at\ 2024-12-22\ 14.09.07 \
    --model turbo \
    --language Chinese \
    --task transcribe \
    --output_format srt \
    --initial_prompt "以下是普通话的句子。"
  ```
- **Web服务**: 使用mac mini搭建whisper_web服务 (https://github.com/wynemo/whisper_web)
- **错误率**: 约15%

### 字幕纠错
- **工具**: 大模型（Gemini、DeepSeek v3等）
- **提示词**: "根据提供的markdown文件，我将修复语音识别文本中的错误，并将修正后的内容输出到output.txt："

### 字幕同步
- **方法**: 剪映 → 文本 → 智能字幕 → 文稿匹配
- **优势**: 自动生成时间轴，避免whisper时间轴错乱问题

## 发布优化

### 多语言支持
- **YouTube功能**: 支持不同区域设置相应标题、描述、字幕
- **工作流程**:
  - 中文字幕上传到YouTube
  - 英文字幕通过中文自动翻译生成
  - 人工检查编辑英文字幕
  - 添加英语标题、描述
- **策略**: 播放量多的视频优先处理多语言

### 后期整理
- **目的**: 便于用GPT整理笔记并上传到GitHub
- **建议**: 保留字幕文件用于后续处理

## 特殊说明
- 白嫖剪映用户需要额外处理音轨：字幕念稿 → 录音 → 重新制作音轨
