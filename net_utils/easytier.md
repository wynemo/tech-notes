## 公共服务器组网

## 点对点组网

## 代理局域网

每个节点都可以代理局域网，这样其他节点可以访问

## wireguard portal

在 easytier 网络的任意节点，可以创建一个 wireguard portal，当然这个节点需要一个公网 IP

这样手机，比如 ios，就可以通过这个节点直接访问 easytier 的 vpn 网络，也包括前面的说的代理的局域网

oracle:
sudo ./easytier-core -d --network-name your_networkname --network-secret your_password -p udp://your_peer_ip:11010

home:
sudo ./easytier-core -d --network-name your_networkname --network-secret your_password -p tcp://public.easytier.cn:11010 -n 192.168.0.0/24 --vpn-portal wg://0.0.0.0:11013/10.14.14.0/24



company:
sudo ./easytier-core -d --network-name your_networkname --network-secret your_password -p tcp://public.easytier.cn:11010


下图也可以简化下，可以去掉 loon 与家里的 wiregurad，让 sing-box 转发下 10.126.126.x 的流量

```mermaid
graph TB
    subgraph "家里A"
        A_SingBox["Sing-box<br/>内嵌Tailscale客户端<br/>SS服务器(TCP)<br/>AutoRedirect<br/>100.64.x.x"]
        A_EasyTier["EasyTier节点<br/>内嵌WireGuard Portal<br/>10.126.126.x"]
    end
    
    subgraph "公司B"
        B_Tailscale["Tailscale节点<br/>100.64.x.x"]
        B_EasyTier["EasyTier节点<br/>10.126.126.x"]
    end
    
    subgraph "手机C - Loon"
        C_WG["WireGuard协议"]
        C_SS["SS协议"]
    end
    
    %% Tailscale连接 (基于WireGuard UDP)
    A_SingBox <===>|Tailscale协议<br/>100.64.0.0/10<br/>基于WireGuard UDP| B_Tailscale
    
    %% EasyTier连接 (基于WireGuard UDP)
    A_EasyTier <===>|EasyTier协议<br/>10.126.126.0/24<br/>基于WireGuard UDP| B_EasyTier
    
    %% 手机C的两种连接方式
    C_WG ==>|WireGuard连接| A_EasyTier
    C_SS ==>|SS协议 TCP| A_SingBox
    
    %% 流量转发路径和最终访问目标
    A_EasyTier -.->|WireGuard Portal<br/>直接访问10.126.126.0/24网段| B_EasyTier
    A_SingBox -.->|内嵌Tailscale<br/>转发到100.64.0.0/10网段| B_Tailscale
    
    %% 样式
    classDef homeNode fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef companyNode fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef mobileNode fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef protocol fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    
    class A_SingBox,A_EasyTier homeNode
    class B_Tailscale,B_EasyTier companyNode
    class C_WG,C_SS mobileNode
```