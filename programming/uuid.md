# UUID5 与 UUID7

## UUID5（基于名称，SHA-1 哈希）

UUID5 通过对 **namespace + name** 进行 SHA-1 哈希生成，是**确定性**的：相同输入始终产生相同的 UUID。

### 特点

- 相同的 namespace + name 组合永远生成相同的 UUID
- 不含时间或随机成分
- 无法从 UUID 反推出 namespace 或 name（除非暴力搜索）
- SHA-1 生成 160 位摘要，截断为 128 位后替换版本和变体位

### 适用场景

- 需要从已知输入生成可复现的唯一标识符
- 为 URL、文件路径等资源生成稳定 ID
- 不同系统间需要对相同输入产生一致的 ID

### Python 示例

```python
import uuid

# 预定义的 namespace
ns = uuid.NAMESPACE_URL

# 相同输入总是产生相同结果
id1 = uuid.uuid5(ns, "https://example.com/user/123")
id2 = uuid.uuid5(ns, "https://example.com/user/123")
assert id1 == id2  # True

print(id1)  # 例如: 2ed6657d-e927-568b-95e1-2665a8aea6a2
```

常用的预定义 namespace：

| Namespace | 用途 |
|---|---|
| `uuid.NAMESPACE_DNS` | 域名 |
| `uuid.NAMESPACE_URL` | URL |
| `uuid.NAMESPACE_OID` | ISO OID |
| `uuid.NAMESPACE_X500` | X.500 DN |

也可以用自定义 namespace：

```python
my_namespace = uuid.uuid5(uuid.NAMESPACE_DNS, "myapp.example.com")
user_id = uuid.uuid5(my_namespace, "user-alice")
```

---

## UUID7（基于时间戳，可排序）

UUID7 由 [RFC 9562](https://datatracker.ietf.org/doc/html/rfc9562) 定义，将 **Unix 毫秒时间戳** 编码在高位，其余位填充随机数据。天然按时间排序，非常适合做数据库主键。

### 位结构

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                         unix_ts_ms (48 bits)                  |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|          unix_ts_ms           | ver (0111) |    rand_a (12)    |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|var(10)|                     rand_b (62 bits)                  |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                          rand_b                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

- `unix_ts_ms`（48 位）：毫秒级 Unix 时间戳
- `ver`（4 位）：版本号 `0111`（7）
- `rand_a`（12 位）：随机数据（可用作亚毫秒精度或单调递增计数器）
- `var`（2 位）：变体标识 `10`
- `rand_b`（62 位）：随机数据

### 特点

- 按生成时间自然排序（lexicographic order）
- B-tree 索引友好，插入性能优于 UUIDv4
- 不包含 MAC 地址，无隐私问题
- 同一毫秒内通过随机位保证唯一性

### 适用场景

- 数据库主键（特别是大表）
- 分布式系统中需要时间排序的唯一 ID
- 需要高性能索引的场景
- 替代 UUIDv4 以减少索引碎片

### Python 示例

Python 3.13+ 标准库原生支持 `uuid.uuid7()`：

```python
import uuid

# Python 3.13+
id1 = uuid.uuid7()
id2 = uuid.uuid7()

print(id1)  # 例如: 01936f0e-b4a7-7da0-a8d5-9b3f6e8c1a2f
print(id2)  # 例如: 01936f0e-b4a8-7c12-b3e1-4a5d7f9e0b1c

# id2 > id1（按时间排序）
assert id2 > id1
```

Python 3.12 及以下版本可使用第三方库：

```python
# pip install uuid6
from uuid6 import uuid7

id1 = uuid7()
```

### PostgreSQL 18

PostgreSQL 18 原生支持 UUIDv7：

```sql
SELECT uuidv7();
-- 结果: 01936f0e-b4a7-7da0-a8d5-9b3f6e8c1a2f
```

---

## 对比

| 特性 | UUID5 | UUID7 |
|---|---|---|
| 生成方式 | SHA-1(namespace + name) | 时间戳 + 随机数 |
| 确定性 | 相同输入 = 相同输出 | 每次都不同 |
| 包含时间信息 | 否 | 是（毫秒精度） |
| 可按时间排序 | 否 | 是 |
| 数据库索引性能 | 一般（类随机分布） | 优秀（顺序插入） |
| 典型用途 | 从已知输入生成稳定 ID | 高性能数据库主键 |
| RFC | RFC 4122 / RFC 9562 | RFC 9562 |

## 参考

- [RFC 9562 - Universally Unique IDentifiers (UUIDs)](https://datatracker.ietf.org/doc/html/rfc9562)
- [UUID Versions Explained](https://www.uuidtools.com/uuid-versions-explained)
- [TIL: 8 versions of UUID and when to use them](https://ntietz.com/blog/til-uses-for-the-different-uuid-versions/)
