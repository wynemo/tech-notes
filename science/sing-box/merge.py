import json
import sys

# 用法
# nodes.json 可以用Sub-Store生成 sing-box 格式的
# python3 merge.py sing-box-basic.json nodes.json
# 文件已成功更新并保存为 sing-box-basic-updated.json

# 节点
with open(sys.argv[2], "r", encoding="utf-8") as nodes_file:
    nodes_data = json.load(nodes_file)

# 基本配置
with open(sys.argv[1], "r", encoding="utf-8") as sing_box_file:
    sing_box_data = json.load(sing_box_file)

# 获取 nodes.json 中的 outbounds
nodes_outbounds = nodes_data.get("outbounds", [])

# 合并 outbounds
sing_box_outbounds = sing_box_data.get("outbounds", [])
sing_box_outbounds.extend(nodes_outbounds)

# 获取 "自动选择" 的 outbound 配置
auto_select = next((out for out in sing_box_outbounds if out.get("tag") == "自动选择"), None)

# 获取 "proxy" 的 outbound 配置
proxy_select = next((out for out in sing_box_outbounds if out.get("tag") == "proxy"), None)

if auto_select and isinstance(auto_select.get("outbounds"), list):
    # 添加所有 nodes.json 中的 tag 到 "自动选择" 的 outbounds
    auto_select["outbounds"].extend([out["tag"] for out in nodes_outbounds if "tag" in out])
else:
    print("未找到 '自动选择' 的 outbound 配置，或其结构不符合预期")

if proxy_select and isinstance(proxy_select.get("outbounds"), list):
    proxy_select["outbounds"].extend([out["tag"] for out in nodes_outbounds if "tag" in out])

# 保存修改后的文件
with open("sing-box-basic-updated.json", "w", encoding="utf-8") as updated_file:
    json.dump(sing_box_data, updated_file, ensure_ascii=False, indent=2)

print("文件已成功更新并保存为 sing-box-basic-updated.json")
