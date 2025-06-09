"""
解决macOS远程桌面到Windows，微信里ctrl + c复制图片，macos识别为文件的问题
"""

import os
import time
from io import BytesIO

import win32clipboard
import win32con
from PIL import Image, ImageGrab


def get_image_from_clipboard(data):
    if isinstance(data, list):
        # 判断是否是文件路径且是图像
        for path in data:
            if isinstance(path, str) and os.path.isfile(path):
                try:
                    image = Image.open(path)
                    print(f"从路径加载图像: {path}")
                    return image
                except Exception as e:
                    print(f"无法打开图像文件 {path}：{e}")
    else:
        print("剪贴板中无图像")

    return None


def normalize_clipboard_image():
    try:
        # 尝试从剪贴板中获取图像
        data = ImageGrab.grabclipboard()
        if isinstance(data, Image.Image):
            return None
        image = get_image_from_clipboard(data)
        print("normalize_clipboard_image", image, type(image))
        if isinstance(image, Image.Image):
            print("检测到图像，正在转换为标准格式...")

            # 复制为 PNG 格式，清除原有剪贴板，重新设置为标准图像格式
            output = BytesIO()
            image.save(output, "PNG")
            data = output.getvalue()
            output.close()

            # 重新设置剪贴板内容
            win32clipboard.OpenClipboard()
            win32clipboard.EmptyClipboard()
            win32clipboard.SetClipboardData(win32con.CF_DIB, image_to_dib(image))
            win32clipboard.CloseClipboard()

            print("图像已重新设置为标准格式，macOS 可识别。")
            return True
    except Exception as e:
        print(f"发生错误：{e}")
    return False


def image_to_dib(image):
    """将 PIL 图像转换为 CF_DIB 可识别格式"""
    # 必须保存为 BMP，然后跳过 BMP 文件头（14 字节）以取得 DIB 部分
    bmp_io = BytesIO()
    image.convert("RGB").save(bmp_io, "BMP")
    bmp_data = bmp_io.getvalue()
    dib_data = bmp_data[14:]  # 跳过 BMP Header
    return dib_data


def main_loop():
    print("启动剪贴板监听器...（按 Ctrl+C 停止）")
    last_data = None
    while True:
        try:
            win32clipboard.OpenClipboard()
            if win32clipboard.IsClipboardFormatAvailable(win32con.CF_DIB):
                current = win32clipboard.GetClipboardData(win32con.CF_DIB)
                if current != last_data:
                    last_data = current
                    win32clipboard.CloseClipboard()
                    normalize_clipboard_image()
                else:
                    win32clipboard.CloseClipboard()
            else:
                win32clipboard.CloseClipboard()
        except Exception as e:
            print(f"监听时出错：{e}")
        time.sleep(1)


if __name__ == "__main__":
    main_loop()
