oracle:
sudo ./easytier-core -d --network-name lozhang123 --network-secret fuckcdc -p udp://home.dabin.info:11010

home:
sudo ./easytier-core -d --network-name lozhang123 --network-secret fuckcdc -p tcp://public.easytier.cn:11010 -n 192.168.0.0/24 --vpn-portal wg://0.0.0.0:11013/10.14.14.0/24



company:
sudo ./easytier-core -d --network-name lozhang123 --network-secret fuckcdc -p tcp://public.easytier.cn:11010

```mermaid
graph TD
  subgraph 家庭A
    A1[sing-box<br>SS入口<br>➡ Tailscale ➡ 公司B]
    A2[easytier<br>10.126.126.1/24]
    A3[WireGuard portal<br>连接到 EasyTier]
  end

  subgraph 公司B
    B1[Tailscale<br>100.64.0.0/10]
    B2[easytier<br>10.126.126.2/24]
  end

  subgraph 手机C
    C1[loon<br>SS客户端]
    C2[loon<br>WireGuard客户端]
  end

  %% SS 流向
  C1 -->|SS协议连接| A1
  A1 -->|通过Tailscale转发| B1

  %% WG -> EasyTier 流向
  C2 -->|WireGuard连接A暴露的WG portal| A3
  A3 --> A2
  A2 --> B2

  %% Tailscale / EasyTier 建立的连接
  A1 -->|Tailscale (UDP/WireGuard)| B1
  A2 -->|EasyTier (UDP/WireGuard)| B2

  %% 网段说明
  classDef note fill=#f9f,stroke=#333,stroke-width=1px;
  NetNote1([Tailscale网段<br>100.64.0.0/10]):::note
  NetNote2([EasyTier网段<br>10.126.126.0/24]):::note
  B1 -.-> NetNote1
  B2 -.-> NetNote2
```