# Google Antigravity IDE 登录使用指南

## 视频讲解：

[![视频讲解](https://img.youtube.com/vi/gYIMPFIKePw/0.jpg)](https://www.youtube.com/watch?v=gYIMPFIKePw)

Google 新推出的 IDE —— Antigravity，需要特定网络环境才能访问。以下是完整的配置步骤。

## 一、代理工具配置

### 1. 选择代理工具

推荐使用以下任一工具：
- Clash Party
- Surge
- Clash Verge

### 2. 开启 TUN 模式

在代理工具中开启以下功能（名称可能因工具而异）：
- 虚拟网卡模式
- TUN 模式
- 增强模式

> 开启后，Antigravity 的流量才能正常走代理。

### 3. 配置分流规则

将 Google 相关流量指向**美国节点**。

## 二、验证网络环境

打开 [gemini.google.com](https://gemini.google.com)，如果页面正常显示且可用，说明网络配置成功。

> 注意：如果节点使用人数过多，可能会被限制访问。

## 三、检查 Google 账户地区

1. 访问 [Google 服务条款页面](https://policies.google.com/terms)，查看账户关联的地区
2. 如果显示为**美国**，可直接使用 Antigravity
3. 如果显示为**香港**或其他不支持的地区，需要申请更改

### 更改账户地区

1. 访问 [地区关联申请表](https://policies.google.com/country-association-form)
2. 填写申请理由（如：出差、旅行等）
3. 提交后等待审核通过

## 四、登录 Antigravity

完成以上配置后，即可正常打开 Antigravity 并完成登录授权。