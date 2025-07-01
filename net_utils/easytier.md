oracle:
sudo ./easytier-core -d --network-name lozhang123 --network-secret fuckcdc -p udp://home.dabin.info:11010

home:
sudo ./easytier-core -d --network-name lozhang123 --network-secret fuckcdc -p tcp://public.easytier.cn:11010 -n 192.168.0.0/24 --vpn-portal wg://0.0.0.0:11013/10.14.14.0/24



company:
sudo ./easytier-core -d --network-name lozhang123 --network-secret fuckcdc -p tcp://public.easytier.cn:11010

```mermaid
graph TD
  subgraph 家庭A
    A1[sing-box]
    A2[easytier (10.126.126.1)]
    A3[WireGuard portal]
  end

  subgraph 公司B
    B1[Tailscale (100.64.0.0/10)]
    B2[easytier (10.126.126.2)]
  end

  subgraph 手机C
    C1[loon: SS client]
    C2[loon: WireGuard client]
  end

  %% 连接关系
  C1 --> SS1[连接 sing-box (SS)]
  SS1 --> A1
  A1 --> TS1[通过 Tailscale]
  TS1 --> B1

  C2 --> WG1[连接 A 的 WireGuard portal]
  WG1 --> A3
  A3 --> A2
  A2 --> ET1[通过 EasyTier]
  ET1 --> B2

  %% A 的 sing-box 和 tailscale
  A1 --> B1

  %% EasyTier 的对等连接
  A2 --> B2
```