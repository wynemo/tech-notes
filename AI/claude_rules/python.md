## 代码规范

### import 导入规范

所有 import 语句必须放在文件头部，禁止在函数内部使用局部 import。

## 日志记录规范

### 1. 使用 logger.exception() 的好处

在异常处理中使用 `logger.exception()` 而不是 `logger.error()` 或 `logger.warning()` 的优势:

1. **自动记录完整的堆栈跟踪信息** - 无需手动格式化异常信息,自动包含详细的调用栈
2. **更容易调试问题** - 完整的堆栈信息可以快速定位问题根源
3. **代码更简洁** - 不需要手动格式化异常信息,如 `f"错误: {e}"`

### 2. 使用 `{}` 占位符而非 f-string

在日志记录中应使用 `{}` 占位符格式,而不是 f-string:

**正确示例:**
```python
logger.info("URL: {}", url)
logger.warning("原始数据: {}", data_str)
logger.error("处理失败: {}, 状态码: {}", error_msg, status_code)
```