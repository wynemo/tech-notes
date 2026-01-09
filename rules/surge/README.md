# Surge 规则目录

这个目录用于存放 Surge 的规则文件。

## 目录说明

- 存放各类分流规则文件（.list 格式）
- 存放规则集配置
- 存放自定义规则

## 使用方法

在 Surge 配置文件中引用规则：

```ini
[Rule]
RULE-SET,https://example.com/rules/surge/ruleset.list,PROXY
# 或使用本地规则
RULE-SET,ruleset.list,PROXY
```

## 规则格式

Surge 规则文件通常使用 `.list` 扩展名，每行一条规则：

```
DOMAIN,example.com
DOMAIN-SUFFIX,example.com
DOMAIN-KEYWORD,example
IP-CIDR,192.168.0.0/16
IP-CIDR6,2001:db8::/32
```

## 相关文档

- [surge.md](../../science/surge.md) - Surge 主要文档
- [surge_2.md](../../science/surge_2.md) - Surge 进阶文档
- [surge_template.conf](../../science/surge_template.conf) - Surge 配置模板
