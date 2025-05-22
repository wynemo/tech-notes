# youtuber经验 - 工具链

剪映 - 猴哥声音输出


录音 用耳机输出 只做输入就好 扬声器输出 噪音会很大


可以用 用whisper识别语音生成字幕


现在一般是写一个markdown的稿子 ， 念稿 + 录屏  ， 修视频 + 遮挡敏感信息，文字匹配生成字幕，要是用猴哥之类的，还要用字幕念稿，念了稿还要录音，重新弄个音轨，因为我是白嫖剪印

```bash
❯ uv run whisper /Users/tommygreen/Desktop/Recording at 2024-12-22 14.09.07 --model turbo \

      --language Chinese --task transcribe --output_format srt --initial_prompt "以下是普通话的句子。"
```

（<https://github.com/wynemo/whisper_web> 调用 whsiper 转换录音为字幕的 用一台 mac mini 弄了一个 web 服务）


生成字幕 错误率15% 


可以用大模型，比如gemini，deepseek v3之类的纠错


提示词如下：“根据提供的markdown文件，我将修复语音识别文本中的错误，并将修正后的内容输出到output.txt：”


用剪映 - 文本 - 智能字幕 - 文稿匹配 生成字幕 （这样也不用管时间轴了，有时候whisper也很坑，乱生成些，时间轴都是错乱的）


youtube 可以为不同区域设置相应的标题、描述，字幕也是

中文字幕放到油管上，英文字幕可以在后期编辑，可以从中文字幕自动翻译，自己再检查编辑下 也可以增加英语标题、描述；当然播放量多的可以去弄，少的就算了


字幕最好还是有，因为便于用gpt整理笔记，并上传到github去


quickrecorder 录屏 1.5.5 版本

keycastr 录键盘

quick camera 露脸 （暂时好像还不用 😅）


\
