编辑订阅 - 添加操作 - 填入脚本

sub-store自己就带有可用性检查

就是这个节点一多就报错500

注意cache=true十分重要 不然每次都检查非常耗时

客户端软件里压根就通过URL导入不了

可用性检查


https://testingcf.jsdelivr.net/gh/xream/scripts@main/surge/modules/sub-store-scripts/check/http_meta_availability.js#cache=true&show_latency=true


落地节点检查

https://testingcf.jsdelivr.net/gh/xream/scripts@main/surge/modules/sub-store-scripts/check/http_meta_geo.js#cache=true

gpt可用性检查

https://testingcf.jsdelivr.net/gh/xream/scripts@main/surge/modules/sub-store-scripts/check/http_meta_gpt.js#cache=true

找节点 - sub store A - BestSub 测速 - sub Store B 基本都可以用 然后还有速度信息
