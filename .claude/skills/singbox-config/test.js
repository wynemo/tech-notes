/**
 * 本插件参考项目：SubStore中节点转换相关功能，具体看下面引用的源码
 */

const protocolForClash = {
  ss: URI_SS(),
  ssr: URI_SSR(),
  vmess: URI_VMess(),
  vless: URI_VLESS(),
  hysteria2: URI_Hysteria2(),
  hy2: URI_Hysteria2(),
  hysteria: URI_Hysteria(),
  tuic: URI_TUIC(),
  wireguard: URI_WireGuard(),
  trojan: URI_Trojan(),
};

const protocolForSingBox = () => ({
  ss: ssParser,
  ssr: ssrParser,
  vmess: vmessParser,
  vless: vlessParser,
  hysteria2: hysteria2Parser,
  hy2: hysteria2Parser,
  hysteria: hysteriaParser,
  tuic: tuic5Parser,
  wireguard: wireguardParser,
  trojan: trojanParser,
});

/**
 * 插件钩子：点击运行按钮时
 */
const onRun = async () => {
  let arr = await Plugins.prompt("请输入分享链接：", "", {
    placeholder:
      "(ss|ssr|vmess|vless|hysteria2|hysteria|tuic|wireguard|trojan)://",
    type: "code",
  });

  if (Plugins.isValidBase64(arr)) {
    arr = Plugins.base64Decode(arr)
      .split("\n")
      .filter((v) => v);
  } else {
    arr = arr.split("\n").filter((v) => v);
  }

  const proxies = [];

  for (let line of arr) {
    const [schema] = line.split("://");

    const protocol = protocolForClash[schema.toLowerCase()];
    if (!protocol) {
      console.log(`未实现当前协议[ ${schema} ]`);
      continue;
    }

    try {
      const proxy = protocol.parse(line);
      proxies.push(proxy);
    } catch (error) {
      console.log("解析错误Clash节点", error);
    }
  }

  const clash_proxies = ClashMeta_Producer().produce(proxies, "internal", {});

  console.log("clash", clash_proxies);

  const singbox_proxies = [];

  const protocolForSingBoxMap = protocolForSingBox();
  for (let proxy of proxies) {
    try {
      const _proxy = protocolForSingBoxMap[proxy.type](proxy);
      singbox_proxies.push(_proxy);
    } catch (error) {
      console.log("解析错误SingBox节点", error);
    }
  }

  console.log("singbox", singbox_proxies);

  const result = Plugins.APP_TITLE.includes("SingBox")
    ? JSON.stringify(singbox_proxies, null, 2)
    : Plugins.YAML.stringify(clash_proxies);

  await Plugins.confirm("转换结果如下", result);

  await Plugins.ClipboardSetText(result);
  Plugins.message.success("已复制");
};

/**
 * 插件钩子：更新订阅时
 */
const onSubscribe = async (proxies) => {
  const isBase64 = proxies.length === 1 && proxies[0].base64;

  // 如果是v2ray分享链接，则转为clash格式
  if (isBase64) {
    const arr = Plugins.base64Decode(proxies[0].base64).split("\n");
    const _proxies = [];
    for (let line of arr) {
      const [schema] = line.split("://");
      const protocol = protocolForClash[schema.toLowerCase()];
      if (!protocol) {
        console.log(`未实现当前协议[ ${schema} ]`);
        continue;
      }
      try {
        const proxy = protocol.parse(line.trim());
        _proxies.push(proxy);
      } catch (error) {
        console.log("解析Clash节点发生错误", error);
      }
    }
    proxies = ClashMeta_Producer().produce(_proxies, "internal", {});
  }

  const isClashProxies = proxies.some((proxy) => proxy.name && !proxy.tag);

  // 如果是clash格式，并且是GFS，则转为sing-box格式
  if (isClashProxies && Plugins.APP_TITLE.includes("SingBox")) {
    const _proxies = [];
    const protocolForSingBoxMap = protocolForSingBox();
    for (let proxy of proxies) {
      try {
        const _proxy = protocolForSingBoxMap[proxy.type](proxy);
        _proxies.push(_proxy);
      } catch (error) {
        console.log("解析SingBox节点发生错误", error);
      }
    }
    proxies = _proxies;
  }

  return proxies;
};

// =======================================================================================================================
//                                      以下是兼容SubStore API的一些处理
// =======================================================================================================================

const Base64 = {
  decode: (str) => {
    try {
      return decodeURIComponent(escape(atob(str)));
    } catch (e) {
      return atob(str);
    }
  },
  encode: (str) => {
    return btoa(unescape(encodeURIComponent(str)));
  },
};

const getTrojanURIParser = () => {
  const parse = (line) => {
    const [_, body] = line.split("://");
    const url = new URL("http://" + body);
    const query = url.searchParams;
    const trojan = {
      name: decodeURIComponent(url.hash.slice(1)),
      type: "trojan",
      server: url.hostname,
      port: Number(url.port),
      password: url.username,
      udp: true,
      "skip-cert-verify": Boolean(query.get("allowInsecure")),
    };
    if (query.get("alpn")) {
      trojan["alpn"] = query.get("alpn").split(",");
    }
    if (query.get("sni")) {
      trojan.sni = query.get("sni");
    }
    const network = query.get("type")?.toLowerCase();
    if (network) {
      trojan.network = network;
    }
    switch (network) {
      case "ws": {
        const wsOpts = {
          path: query.get("path"),
          headers: {
            "User-Agent": "",
            Host: query.get("host"),
          },
        };
        trojan["ws-opts"] = wsOpts;
        break;
      }
      case "grpc": {
        trojan["grpc-opts"] = {
          "grpc-service-name": query.get("serviceName"),
        };
        break;
      }
    }
    trojan["client-fingerprint"] = query.get("fp") || "chrome";
    return trojan;
  };

  return { parse };
};

// =======================================================================================================================
//                                      以下是Sub-Store仓库中关于解析节点uri的相关源码
//                                      1、添加了一些注释，记录从哪个文件而来、以及是否做了一些修改
//                                      2、修改了Sub-Store的一些源码...
// =======================================================================================================================

/**
 * 说明：工具类方法
 * 来源：https://github.com/sub-store-org/Sub-Store/blob/master/backend/src/utils/index.js
 */

// source: https://stackoverflow.com/a/36760050
const IPV4_REGEX = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){4}$/;

// source: https://ihateregex.io/expr/ipv6/
const IPV6_REGEX =
  /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;

function isIPv4(ip) {
  return IPV4_REGEX.test(ip);
}

function isIPv6(ip) {
  return IPV6_REGEX.test(ip);
}

function isNotBlank(str) {
  return typeof str === "string" && str.trim().length > 0;
}

function getIfNotBlank(str, defaultValue) {
  return isNotBlank(str) ? str : defaultValue;
}

function isPresent(obj) {
  return typeof obj !== "undefined" && obj !== null;
}

function getIfPresent(obj, defaultValue) {
  return isPresent(obj) ? obj : defaultValue;
}

/**
 * 说明：解析节点uri的相关方法
 * 来源：https://github.com/sub-store-org/Sub-Store/blob/master/backend/src/core/proxy-utils/parsers/index.js
 * 修改：URI_VMESS
 * - if (proxy.tls && proxy.sni) {
 * + if (proxy.tls && params.sni) {
 */

// Parse SS URI format (only supports new SIP002, legacy format is depreciated).
// reference: https://github.com/shadowsocks/shadowsocks-org/wiki/SIP002-URI-Scheme
function URI_SS() {
  // TODO: 暂不支持 httpupgrade
  const name = "URI SS Parser";
  const test = (line) => {
    return /^ss:\/\//.test(line);
  };
  const parse = (line) => {
    // parse url
    let content = line.split("ss://")[1];

    const proxy = {
      name: decodeURIComponent(line.split("#")[1]),
      type: "ss",
    };
    content = content.split("#")[0]; // strip proxy name
    // handle IPV4 and IPV6
    let serverAndPortArray = content.match(/@([^/]*)(\/|$)/);

    let rawUserInfoStr = decodeURIComponent(content.split("@")[0]); // 其实应该分隔之后, 用户名和密码再 decodeURIComponent. 但是问题不大
    let userInfoStr;
    if (rawUserInfoStr?.startsWith("2022-blake3-")) {
      userInfoStr = rawUserInfoStr;
    } else {
      userInfoStr = Base64.decode(rawUserInfoStr);
    }

    let query = "";
    if (!serverAndPortArray) {
      if (content.includes("?")) {
        const parsed = content.match(/^(.*)(\?.*)$/);
        content = parsed[1];
        query = parsed[2];
      }
      content = Base64.decode(content);
      if (query) {
        if (/(&|\?)v2ray-plugin=/.test(query)) {
          const parsed = query.match(/(&|\?)v2ray-plugin=(.*?)(&|$)/);
          let v2rayPlugin = parsed[2];
          if (v2rayPlugin) {
            proxy.plugin = "v2ray-plugin";
            proxy["plugin-opts"] = JSON.parse(Base64.decode(v2rayPlugin));
          }
        }
        content = `${content}${query}`;
      }
      userInfoStr = content.split("@")[0];
      serverAndPortArray = content.match(/@([^/]*)(\/|$)/);
    }

    const serverAndPort = serverAndPortArray[1];
    const portIdx = serverAndPort.lastIndexOf(":");
    proxy.server = serverAndPort.substring(0, portIdx);
    proxy.port = `${serverAndPort.substring(portIdx + 1)}`.match(/\d+/)?.[0];
    let userInfo = userInfoStr.match(/(^.*?):(.*$)/);
    proxy.cipher = userInfo?.[1];
    proxy.password = userInfo?.[2];
    // if (!proxy.cipher || !proxy.password) {
    //     userInfo = rawUserInfoStr.match(/(^.*?):(.*$)/);
    //     proxy.cipher = userInfo?.[1];
    //     proxy.password = userInfo?.[2];
    // }

    // handle obfs
    const idx = content.indexOf("?plugin=");
    if (idx !== -1) {
      const pluginInfo = (
        "plugin=" +
        decodeURIComponent(content.split("?plugin=")[1].split("&")[0])
      ).split(";");
      const params = {};
      for (const item of pluginInfo) {
        const [key, val] = item.split("=");
        if (key) params[key] = val || true; // some options like "tls" will not have value
      }
      switch (params.plugin) {
        case "obfs-local":
        case "simple-obfs":
          proxy.plugin = "obfs";
          proxy["plugin-opts"] = {
            mode: params.obfs,
            host: getIfNotBlank(params["obfs-host"]),
          };
          break;
        case "v2ray-plugin":
          proxy.plugin = "v2ray-plugin";
          proxy["plugin-opts"] = {
            mode: "websocket",
            host: getIfNotBlank(params["obfs-host"]),
            path: getIfNotBlank(params.path),
            tls: getIfPresent(params.tls),
          };
          break;
        default:
          throw new Error(`Unsupported plugin option: ${params.plugin}`);
      }
    }
    if (/(&|\?)uot=(1|true)/i.test(query)) {
      proxy["udp-over-tcp"] = true;
    }
    if (/(&|\?)tfo=(1|true)/i.test(query)) {
      proxy.tfo = true;
    }
    return proxy;
  };
  return { name, test, parse };
}

// Parse URI SSR format, such as ssr://xxx
function URI_SSR() {
  const name = "URI SSR Parser";
  const test = (line) => {
    return /^ssr:\/\//.test(line);
  };
  const parse = (line) => {
    line = Base64.decode(line.split("ssr://")[1]);

    // handle IPV6 & IPV4 format
    let splitIdx = line.indexOf(":origin");
    if (splitIdx === -1) {
      splitIdx = line.indexOf(":auth_");
    }
    const serverAndPort = line.substring(0, splitIdx);
    const server = serverAndPort.substring(0, serverAndPort.lastIndexOf(":"));
    const port = serverAndPort.substring(serverAndPort.lastIndexOf(":") + 1);

    let params = line
      .substring(splitIdx + 1)
      .split("/?")[0]
      .split(":");
    let proxy = {
      type: "ssr",
      server,
      port,
      protocol: params[0],
      cipher: params[1],
      obfs: params[2],
      password: Base64.decode(params[3]),
    };
    // get other params
    const other_params = {};
    line = line.split("/?")[1].split("&");
    if (line.length > 1) {
      for (const item of line) {
        let [key, val] = item.split("=");
        val = val.trim();
        if (val.length > 0 && val !== "(null)") {
          other_params[key] = val;
        }
      }
    }
    proxy = {
      ...proxy,
      name: other_params.remarks
        ? Base64.decode(other_params.remarks)
        : proxy.server,
      "protocol-param": getIfNotBlank(
        Base64.decode(other_params.protoparam || "").replace(/\s/g, ""),
      ),
      "obfs-param": getIfNotBlank(
        Base64.decode(other_params.obfsparam || "").replace(/\s/g, ""),
      ),
    };
    return proxy;
  };

  return { name, test, parse };
}

// V2rayN URI VMess format
// reference: https://github.com/2dust/v2rayN/wiki/%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E6%A0%BC%E5%BC%8F%E8%AF%B4%E6%98%8E(ver-2)

// Quantumult VMess format
function URI_VMess() {
  const name = "URI VMess Parser";
  const test = (line) => {
    return /^vmess:\/\//.test(line);
  };
  const parse = (line) => {
    line = line.split("vmess://")[1];
    let content = Base64.decode(line);
    if (/=\s*vmess/.test(content)) {
      // Quantumult VMess URI format
      const partitions = content.split(",").map((p) => p.trim());
      // get keyword params
      const params = {};
      for (const part of partitions) {
        if (part.indexOf("=") !== -1) {
          const [key, val] = part.split("=");
          params[key.trim()] = val.trim();
        }
      }

      const proxy = {
        name: partitions[0].split("=")[0].trim(),
        type: "vmess",
        server: partitions[1],
        port: partitions[2],
        cipher: getIfNotBlank(partitions[3], "auto"),
        uuid: partitions[4].match(/^"(.*)"$/)[1],
        tls: params.obfs === "wss",
        udp: getIfPresent(params["udp-relay"]),
        tfo: getIfPresent(params["fast-open"]),
        "skip-cert-verify": isPresent(params["tls-verification"])
          ? !params["tls-verification"]
          : undefined,
      };

      // handle ws headers
      if (isPresent(params.obfs)) {
        if (params.obfs === "ws" || params.obfs === "wss") {
          proxy.network = "ws";
          proxy["ws-opts"].path = (
            getIfNotBlank(params["obfs-path"]) || '"/"'
          ).match(/^"(.*)"$/)[1];
          let obfs_host = params["obfs-header"];
          if (obfs_host && obfs_host.indexOf("Host") !== -1) {
            obfs_host = obfs_host.match(/Host:\s*([a-zA-Z0-9-.]*)/)[1];
          }
          if (isNotBlank(obfs_host)) {
            proxy["ws-opts"].headers = {
              Host: obfs_host,
            };
          }
        } else {
          throw new Error(`Unsupported obfs: ${params.obfs}`);
        }
      }
      return proxy;
    } else {
      let params = {};

      try {
        // V2rayN URI format
        params = JSON.parse(content);
      } catch (e) {
        // Shadowrocket URI format
        // eslint-disable-next-line no-unused-vars
        let [__, base64Line, qs] = /(^[^?]+?)\/?\?(.*)$/.exec(line);
        content = Base64.decode(base64Line);

        for (const addon of qs.split("&")) {
          const [key, valueRaw] = addon.split("=");
          let value = valueRaw;
          value = decodeURIComponent(valueRaw);
          if (value.indexOf(",") === -1) {
            params[key] = value;
          } else {
            params[key] = value.split(",");
          }
        }
        // eslint-disable-next-line no-unused-vars
        let [___, cipher, uuid, server, port] =
          /(^[^:]+?):([^:]+?)@(.*):(\d+)$/.exec(content);

        params.scy = cipher;
        params.id = uuid;
        params.port = port;
        params.add = server;
      }
      const server = params.add;
      const port = parseInt(getIfPresent(params.port), 10);
      const proxy = {
        name:
          params.ps ??
          params.remarks ??
          params.remark ??
          `VMess ${server}:${port}`,
        type: "vmess",
        server,
        port,
        cipher: getIfPresent(params.scy, "auto"),
        uuid: params.id,
        alterId: parseInt(getIfPresent(params.aid ?? params.alterId, 0), 10),
        tls: ["tls", true, 1, "1"].includes(params.tls),
        "skip-cert-verify": isPresent(params.verify_cert)
          ? !params.verify_cert
          : undefined,
      };
      if (!proxy["skip-cert-verify"] && isPresent(params.allowInsecure)) {
        proxy["skip-cert-verify"] = /(TRUE)|1/i.test(params.allowInsecure);
      }
      // https://github.com/2dust/v2rayN/wiki/%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E6%A0%BC%E5%BC%8F%E8%AF%B4%E6%98%8E(ver-2)
      if (proxy.tls && params.sni && params.sni !== "") {
        proxy.sni = params.sni;
      }
      let httpupgrade = false;
      // handle obfs
      if (params.net === "ws" || params.obfs === "websocket") {
        proxy.network = "ws";
      } else if (
        ["http"].includes(params.net) ||
        ["http"].includes(params.obfs) ||
        ["http"].includes(params.type)
      ) {
        proxy.network = "http";
      } else if (["grpc"].includes(params.net)) {
        proxy.network = "grpc";
      } else if (
        params.net === "httpupgrade" ||
        proxy.network === "httpupgrade"
      ) {
        proxy.network = "ws";
        httpupgrade = true;
      } else if (params.net === "h2" || proxy.network === "h2") {
        proxy.network = "h2";
      }
      // 暂不支持 tcp + host + path
      // else if (params.net === 'tcp' || proxy.network === 'tcp') {
      //     proxy.network = 'tcp';
      // }
      if (proxy.network) {
        let transportHost = params.host ?? params.obfsParam;
        try {
          const parsedObfs = JSON.parse(transportHost);
          const parsedHost = parsedObfs?.Host;
          if (parsedHost) {
            transportHost = parsedHost;
          }
          // eslint-disable-next-line no-empty
        } catch (e) {}
        let transportPath = params.path;

        if (proxy.network === "http") {
          if (transportHost) {
            // 1)http(tcp)->host中间逗号(,)隔开
            transportHost = transportHost.split(",").map((i) => i.trim());
            transportHost = Array.isArray(transportHost)
              ? transportHost[0]
              : transportHost;
          }
          if (transportPath) {
            transportPath = Array.isArray(transportPath)
              ? transportPath[0]
              : transportPath;
          } else {
            transportPath = "/";
          }
        }
        // 传输层应该有配置, 暂时不考虑兼容不给配置的节点
        if (transportPath || transportHost) {
          if (["grpc"].includes(proxy.network)) {
            proxy[`${proxy.network}-opts`] = {
              "grpc-service-name": getIfNotBlank(transportPath),
              "_grpc-type": getIfNotBlank(params.type),
              "_grpc-authority": getIfNotBlank(params.authority),
            };
          } else {
            const opts = {
              path: getIfNotBlank(transportPath),
              headers: { Host: getIfNotBlank(transportHost) },
            };
            if (httpupgrade) {
              opts["v2ray-http-upgrade"] = true;
              opts["v2ray-http-upgrade-fast-open"] = true;
            }
            proxy[`${proxy.network}-opts`] = opts;
          }
        } else {
          delete proxy.network;
        }
      }
      return proxy;
    }
  };
  return { name, test, parse };
}

function URI_VLESS() {
  const name = "URI VLESS Parser";
  const test = (line) => {
    return /^vless:\/\//.test(line);
  };
  const parse = (line) => {
    line = line.split("vless://")[1];
    let isShadowrocket;
    let parsed = /^(.*?)@(.*?):(\d+)\/?(\?(.*?))?(?:#(.*?))?$/.exec(line);
    if (!parsed) {
      // eslint-disable-next-line no-unused-vars
      let [_, base64, other] = /^(.*?)(\?.*?$)/.exec(line);
      line = `${Base64.decode(base64)}${other}`;
      parsed = /^(.*?)@(.*?):(\d+)\/?(\?(.*?))?(?:#(.*?))?$/.exec(line);
      isShadowrocket = true;
    }
    // eslint-disable-next-line no-unused-vars
    let [__, uuid, server, port, ___, addons = "", name] = parsed;
    if (isShadowrocket) {
      uuid = uuid.replace(/^.*?:/g, "");
    }

    port = parseInt(`${port}`, 10);
    uuid = decodeURIComponent(uuid);
    if (name != null) {
      name = decodeURIComponent(name);
    }

    const proxy = {
      type: "vless",
      name,
      server,
      port,
      uuid,
    };
    const params = {};
    for (const addon of addons.split("&")) {
      const [key, valueRaw] = addon.split("=");
      let value = valueRaw;
      value = decodeURIComponent(valueRaw);
      params[key] = value;
    }

    proxy.name =
      name ?? params.remarks ?? params.remark ?? `VLESS ${server}:${port}`;

    proxy.tls = params.security && params.security !== "none";
    if (isShadowrocket && /TRUE|1/i.test(params.tls)) {
      proxy.tls = true;
      params.security = params.security ?? "reality";
    }
    proxy.sni = params.sni || params.peer;
    proxy.flow = params.flow;
    if (!proxy.flow && isShadowrocket && params.xtls) {
      // "none" is undefined
      const flow = [undefined, "xtls-rprx-direct", "xtls-rprx-vision"][
        params.xtls
      ];
      if (flow) {
        proxy.flow = flow;
      }
    }
    proxy["client-fingerprint"] = params.fp;
    proxy.alpn = params.alpn ? params.alpn.split(",") : undefined;
    proxy["skip-cert-verify"] = /(TRUE)|1/i.test(params.allowInsecure);

    if (["reality"].includes(params.security)) {
      const opts = {};
      if (params.pbk) {
        opts["public-key"] = params.pbk;
      }
      if (params.sid) {
        opts["short-id"] = params.sid;
      }
      if (Object.keys(opts).length > 0) {
        // proxy[`${params.security}-opts`] = opts;
        proxy[`${params.security}-opts`] = opts;
      }
    }
    let httpupgrade = false;
    proxy.network = params.type;
    if (proxy.network === "tcp" && params.headerType === "http") {
      proxy.network = "http";
    } else if (proxy.network === "httpupgrade") {
      proxy.network = "ws";
      httpupgrade = true;
    }
    if (!proxy.network && isShadowrocket && params.obfs) {
      proxy.network = params.obfs;
    }
    if (["websocket"].includes(proxy.network)) {
      proxy.network = "ws";
    }
    if (proxy.network && !["tcp", "none"].includes(proxy.network)) {
      const opts = {};
      const host = params.host ?? params.obfsParam;
      if (host) {
        if (params.obfsParam) {
          try {
            const parsed = JSON.parse(host);
            opts.headers = parsed;
          } catch (e) {
            opts.headers = { Host: host };
          }
        } else {
          opts.headers = { Host: host };
        }
      }
      if (params.serviceName) {
        opts[`${proxy.network}-service-name`] = params.serviceName;
        if (["grpc"].includes(proxy.network) && params.authority) {
          opts["_grpc-authority"] = params.authority;
        }
      } else if (isShadowrocket && params.path) {
        if (!["ws", "http", "h2"].includes(proxy.network)) {
          opts[`${proxy.network}-service-name`] = params.path;
          delete params.path;
        }
      }
      if (params.path) {
        opts.path = params.path;
      }
      // https://github.com/XTLS/Xray-core/issues/91
      if (["grpc"].includes(proxy.network)) {
        opts["_grpc-type"] = params.mode || "gun";
      }
      if (httpupgrade) {
        opts["v2ray-http-upgrade"] = true;
        opts["v2ray-http-upgrade-fast-open"] = true;
      }
      if (Object.keys(opts).length > 0) {
        proxy[`${proxy.network}-opts`] = opts;
      }
      if (proxy.network === "kcp") {
        // mKCP 种子。省略时不使用种子，但不可以为空字符串。建议 mKCP 用户使用 seed。
        if (params.seed) {
          proxy.seed = params.seed;
        }
        // mKCP 的伪装头部类型。当前可选值有 none / srtp / utp / wechat-video / dtls / wireguard。省略时默认值为 none，即不使用伪装头部，但不可以为空字符串。
        proxy.headerType = params.headerType || "none";
      }
    }

    return proxy;
  };
  return { name, test, parse };
}
function URI_Hysteria2() {
  const name = "URI Hysteria2 Parser";
  const test = (line) => {
    return /^(hysteria2|hy2):\/\//.test(line);
  };
  const parse = (line) => {
    line = line.split(/(hysteria2|hy2):\/\//)[2];
    // 端口跳跃有两种写法:
    // 1. 服务器的地址和可选端口。如果省略端口，则默认为 443。
    // 端口部分支持 端口跳跃 的「多端口地址格式」。
    // https://hysteria.network/zh/docs/advanced/Port-Hopping
    // 2. 参数 mport
    let ports;
    /* eslint-disable no-unused-vars */
    let [
      __,
      password,
      server,
      ___,
      port,
      ____,
      _____,
      ______,
      _______,
      ________,
      addons = "",
      name,
    ] =
      /^(.*?)@(.*?)(:((\d+(-\d+)?)([,;]\d+(-\d+)?)*))?\/?(\?(.*?))?(?:#(.*?))?$/.exec(
        line,
      );
    /* eslint-enable no-unused-vars */
    if (/^\d+$/.test(port)) {
      port = parseInt(`${port}`, 10);
      if (isNaN(port)) {
        port = 443;
      }
    } else if (port) {
      ports = port;
      port = getRandomPort(ports);
    } else {
      port = 443;
    }

    password = decodeURIComponent(password);
    if (name != null) {
      name = decodeURIComponent(name);
    }
    name = name ?? `Hysteria2 ${server}:${port}`;

    const proxy = {
      type: "hysteria2",
      name,
      server,
      port,
      ports,
      password,
    };

    const params = {};
    for (const addon of addons.split("&")) {
      const [key, valueRaw] = addon.split("=");
      let value = valueRaw;
      value = decodeURIComponent(valueRaw);
      params[key] = value;
    }

    proxy.sni = params.sni;
    if (!proxy.sni && params.peer) {
      proxy.sni = params.peer;
    }
    if (params.obfs && params.obfs !== "none") {
      proxy.obfs = params.obfs;
    }

    proxy.ports = params.mport;
    proxy["obfs-password"] = params["obfs-password"];
    proxy["skip-cert-verify"] = /(TRUE)|1/i.test(params.insecure);
    proxy.tfo = /(TRUE)|1/i.test(params.fastopen);
    proxy["tls-fingerprint"] = params.pinSHA256;

    return proxy;
  };
  return { name, test, parse };
}
function URI_Hysteria() {
  const name = "URI Hysteria Parser";
  const test = (line) => {
    return /^(hysteria|hy):\/\//.test(line);
  };
  const parse = (line) => {
    line = line.split(/(hysteria|hy):\/\//)[2];
    // eslint-disable-next-line no-unused-vars
    let [__, server, ___, port, ____, addons = "", name] =
      /^(.*?)(:(\d+))?\/?(\?(.*?))?(?:#(.*?))?$/.exec(line);
    port = parseInt(`${port}`, 10);
    if (isNaN(port)) {
      port = 443;
    }
    if (name != null) {
      name = decodeURIComponent(name);
    }
    name = name ?? `Hysteria ${server}:${port}`;

    const proxy = {
      type: "hysteria",
      name,
      server,
      port,
    };
    const params = {};
    for (const addon of addons.split("&")) {
      let [key, value] = addon.split("=");
      key = key.replace(/_/, "-");
      value = decodeURIComponent(value);
      if (["alpn"].includes(key)) {
        proxy[key] = value ? value.split(",") : undefined;
      } else if (["insecure"].includes(key)) {
        proxy["skip-cert-verify"] = /(TRUE)|1/i.test(value);
      } else if (["auth"].includes(key)) {
        proxy["auth-str"] = value;
      } else if (["mport"].includes(key)) {
        proxy["ports"] = value;
      } else if (["obfsParam"].includes(key)) {
        proxy["obfs"] = value;
      } else if (["upmbps"].includes(key)) {
        proxy["up"] = value;
      } else if (["downmbps"].includes(key)) {
        proxy["down"] = value;
      } else if (["obfs"].includes(key)) {
        // obfs: Obfuscation mode (optional, empty or "xplus")
        proxy["_obfs"] = value || "";
      } else if (["fast-open", "peer"].includes(key)) {
        params[key] = value;
      } else {
        proxy[key] = value;
      }
    }

    if (!proxy.sni && params.peer) {
      proxy.sni = params.peer;
    }
    if (!proxy["fast-open"] && params.fastopen) {
      proxy["fast-open"] = true;
    }
    if (!proxy.protocol) {
      // protocol: protocol to use ("udp", "wechat-video", "faketcp") (optional, default: "udp")
      proxy.protocol = "udp";
    }

    return proxy;
  };
  return { name, test, parse };
}
function URI_TUIC() {
  const name = "URI TUIC Parser";
  const test = (line) => {
    return /^tuic:\/\//.test(line);
  };
  const parse = (line) => {
    line = line.split(/tuic:\/\//)[1];
    // eslint-disable-next-line no-unused-vars
    let [__, uuid, password, server, ___, port, ____, addons = "", name] =
      /^(.*?):(.*?)@(.*?)(:(\d+))?\/?(\?(.*?))?(?:#(.*?))?$/.exec(line);
    port = parseInt(`${port}`, 10);
    if (isNaN(port)) {
      port = 443;
    }
    password = decodeURIComponent(password);
    if (name != null) {
      name = decodeURIComponent(name);
    }
    name = name ?? `TUIC ${server}:${port}`;

    const proxy = {
      type: "tuic",
      name,
      server,
      port,
      password,
      uuid,
    };

    for (const addon of addons.split("&")) {
      let [key, value] = addon.split("=");
      key = key.replace(/_/, "-");
      value = decodeURIComponent(value);
      if (["alpn"].includes(key)) {
        proxy[key] = value ? value.split(",") : undefined;
      } else if (["allow-insecure"].includes(key)) {
        proxy["skip-cert-verify"] = /(TRUE)|1/i.test(value);
      } else if (["disable-sni", "reduce-rtt"].includes(key)) {
        proxy[key] = /(TRUE)|1/i.test(value);
      } else {
        proxy[key] = value;
      }
    }

    return proxy;
  };
  return { name, test, parse };
}
function URI_WireGuard() {
  const name = "URI WireGuard Parser";
  const test = (line) => {
    return /^(wireguard|wg):\/\//.test(line);
  };
  const parse = (line) => {
    line = line.split(/(wireguard|wg):\/\//)[2];
    /* eslint-disable no-unused-vars */
    let [__, ___, privateKey, server, ____, port, _____, addons = "", name] =
      /^((.*?)@)?(.*?)(:(\d+))?\/?(\?(.*?))?(?:#(.*?))?$/.exec(line);
    /* eslint-enable no-unused-vars */

    port = parseInt(`${port}`, 10);
    if (isNaN(port)) {
      port = 51820;
    }
    privateKey = decodeURIComponent(privateKey);
    if (name != null) {
      name = decodeURIComponent(name);
    }
    name = name ?? `WireGuard ${server}:${port}`;
    const proxy = {
      type: "wireguard",
      name,
      server,
      port,
      "private-key": privateKey,
      udp: true,
    };
    for (const addon of addons.split("&")) {
      let [key, value] = addon.split("=");
      key = key.replace(/_/, "-");
      value = decodeURIComponent(value);
      if (["reserved"].includes(key)) {
        const parsed = value
          .split(",")
          .map((i) => parseInt(i.trim(), 10))
          .filter((i) => Number.isInteger(i));
        if (parsed.length === 3) {
          proxy[key] = parsed;
        }
      } else if (["address", "ip"].includes(key)) {
        value.split(",").map((i) => {
          const ip = i
            .trim()
            .replace(/\/\d+$/, "")
            .replace(/^\[/, "")
            .replace(/\]$/, "");
          if (isIPv4(ip)) {
            proxy.ip = ip;
          } else if (isIPv6(ip)) {
            proxy.ipv6 = ip;
          }
        });
      } else if (["mtu"].includes(key)) {
        const parsed = parseInt(value.trim(), 10);
        if (Number.isInteger(parsed)) {
          proxy[key] = parsed;
        }
      } else if (/publickey/i.test(key)) {
        proxy["public-key"] = value;
      } else if (/privatekey/i.test(key)) {
        proxy["private-key"] = value;
      } else if (["udp"].includes(key)) {
        proxy[key] = /(TRUE)|1/i.test(value);
      } else if (!["flag"].includes(key)) {
        proxy[key] = value;
      }
    }

    return proxy;
  };
  return { name, test, parse };
}

// Trojan URI format
function URI_Trojan() {
  const name = "URI Trojan Parser";
  const test = (line) => {
    return /^trojan:\/\//.test(line);
  };

  const parse = (line) => {
    const matched = /^(trojan:\/\/.*?@.*?)(:(\d+))?\/?(\?.*?)?$/.exec(line);
    const port = matched?.[2];
    if (!port) {
      line = line.replace(matched[1], `${matched[1]}:443`);
    }
    let [newLine, name] = line.split(/#(.+)/, 2);
    const parser = getTrojanURIParser();
    const proxy = parser.parse(newLine);
    if (isNotBlank(name)) {
      try {
        proxy.name = decodeURIComponent(name);
      } catch (e) {
        console.log(e);
      }
    }
    return proxy;
  };
  return { name, test, parse };
}

/**
 * 说明：用于sing-box节点转换支持
 * 来源：https://github.com/sub-store-org/Sub-Store/blob/master/backend/src/core/proxy-utils/producers/sing-box.js
 */

const detourParser = (proxy, parsedProxy) => {
  parsedProxy.detour = proxy["dialer-proxy"] || proxy.detour;
};
const tfoParser = (proxy, parsedProxy) => {
  parsedProxy.tcp_fast_open = false;
  if (proxy.tfo) parsedProxy.tcp_fast_open = true;
  if (proxy.tcp_fast_open) parsedProxy.tcp_fast_open = true;
  if (proxy["tcp-fast-open"]) parsedProxy.tcp_fast_open = true;
  if (!parsedProxy.tcp_fast_open) delete parsedProxy.tcp_fast_open;
};

const smuxParser = (smux, proxy) => {
  if (!smux || !smux.enabled) return;
  proxy.multiplex = { enabled: true };
  proxy.multiplex.protocol = smux.protocol;
  if (smux["max-connections"])
    proxy.multiplex.max_connections = parseInt(
      `${smux["max-connections"]}`,
      10,
    );
  if (smux["max-streams"])
    proxy.multiplex.max_streams = parseInt(`${smux["max-streams"]}`, 10);
  if (smux["min-streams"])
    proxy.multiplex.min_streams = parseInt(`${smux["min-streams"]}`, 10);
  if (smux.padding) proxy.multiplex.padding = true;
};

const wsParser = (proxy, parsedProxy) => {
  const transport = { type: "ws", headers: {} };
  if (proxy["ws-opts"]) {
    const { path: wsPath = "", headers: wsHeaders = {} } = proxy["ws-opts"];
    if (wsPath !== "") transport.path = `${wsPath}`;
    if (Object.keys(wsHeaders).length > 0) {
      const headers = {};
      for (const key of Object.keys(wsHeaders)) {
        let value = wsHeaders[key];
        if (value === "") continue;
        if (!Array.isArray(value)) value = [`${value}`];
        if (value.length > 0) headers[key] = value;
      }
      const { Host: wsHost } = headers;
      if (wsHost.length === 1)
        for (const item of `Host:${wsHost[0]}`.split("\n")) {
          const [key, value] = item.split(":");
          if (value.trim() === "") continue;
          headers[key.trim()] = value.trim().split(",");
        }
      transport.headers = headers;
    }
  }
  if (proxy["ws-headers"]) {
    const headers = {};
    for (const key of Object.keys(proxy["ws-headers"])) {
      let value = proxy["ws-headers"][key];
      if (value === "") continue;
      if (!Array.isArray(value)) value = [`${value}`];
      if (value.length > 0) headers[key] = value;
    }
    const { Host: wsHost } = headers;
    if (wsHost.length === 1)
      for (const item of `Host:${wsHost[0]}`.split("\n")) {
        const [key, value] = item.split(":");
        if (value.trim() === "") continue;
        headers[key.trim()] = value.trim().split(",");
      }
    for (const key of Object.keys(headers))
      transport.headers[key] = headers[key];
  }
  if (proxy["ws-path"] && proxy["ws-path"] !== "")
    transport.path = `${proxy["ws-path"]}`;
  if (transport.path) {
    const reg = /^(.*?)(?:\?ed=(\d+))?$/;
    // eslint-disable-next-line no-unused-vars
    const [_, path = "", ed = ""] = reg.exec(transport.path);
    transport.path = path;
    if (ed !== "") {
      transport.early_data_header_name = "Sec-WebSocket-Protocol";
      transport.max_early_data = parseInt(ed, 10);
    }
  }

  if (parsedProxy.tls.insecure)
    parsedProxy.tls.server_name = transport.headers.Host[0];
  if (proxy["ws-opts"] && proxy["ws-opts"]["v2ray-http-upgrade"]) {
    transport.type = "httpupgrade";
    if (transport.headers.Host) {
      transport.host = transport.headers.Host[0];
      delete transport.headers.Host;
    }
    if (transport.max_early_data) delete transport.max_early_data;
    if (transport.early_data_header_name)
      delete transport.early_data_header_name;
  }
  for (const key of Object.keys(transport.headers)) {
    const value = transport.headers[key];
    if (value.length === 1) transport.headers[key] = value[0];
  }
  parsedProxy.transport = transport;
};

const h1Parser = (proxy, parsedProxy) => {
  const transport = { type: "http", headers: {} };
  if (proxy["http-opts"]) {
    const {
      method = "",
      path: h1Path = "",
      headers: h1Headers = {},
    } = proxy["http-opts"];
    if (method !== "") transport.method = method;
    if (Array.isArray(h1Path)) {
      transport.path = `${h1Path[0]}`;
    } else if (h1Path !== "") transport.path = `${h1Path}`;
    for (const key of Object.keys(h1Headers)) {
      let value = h1Headers[key];
      if (value === "") continue;
      if (key.toLowerCase() === "host") {
        let host = value;
        if (!Array.isArray(host))
          host = `${host}`.split(",").map((i) => i.trim());
        if (host.length > 0) transport.host = host;
        continue;
      }
      if (!Array.isArray(value))
        value = `${value}`.split(",").map((i) => i.trim());
      if (value.length > 0) transport.headers[key] = value;
    }
  }
  if (proxy["http-host"] && proxy["http-host"] !== "") {
    let host = proxy["http-host"];
    if (!Array.isArray(host)) host = `${host}`.split(",").map((i) => i.trim());
    if (host.length > 0) transport.host = host;
  }
  if (!transport.host) return;
  if (proxy["http-path"] && proxy["http-path"] !== "") {
    const path = proxy["http-path"];
    if (Array.isArray(path)) {
      transport.path = `${path[0]}`;
    } else if (path !== "") transport.path = `${path}`;
  }
  if (parsedProxy.tls.insecure) parsedProxy.tls.server_name = transport.host[0];
  if (transport.host.length === 1) transport.host = transport.host[0];
  for (const key of Object.keys(transport.headers)) {
    const value = transport.headers[key];
    if (value.length === 1) transport.headers[key] = value[0];
  }
  parsedProxy.transport = transport;
};

const h2Parser = (proxy, parsedProxy) => {
  const transport = { type: "http" };
  if (proxy["h2-opts"]) {
    let { host = "", path = "" } = proxy["h2-opts"];
    if (path !== "") transport.path = `${path}`;
    if (host !== "") {
      if (!Array.isArray(host))
        host = `${host}`.split(",").map((i) => i.trim());
      if (host.length > 0) transport.host = host;
    }
  }
  if (proxy["h2-host"] && proxy["h2-host"] !== "") {
    let host = proxy["h2-host"];
    if (!Array.isArray(host)) host = `${host}`.split(",").map((i) => i.trim());
    if (host.length > 0) transport.host = host;
  }
  if (proxy["h2-path"] && proxy["h2-path"] !== "")
    transport.path = `${proxy["h2-path"]}`;
  parsedProxy.tls.enabled = true;
  if (parsedProxy.tls.insecure) parsedProxy.tls.server_name = transport.host[0];
  if (transport.host.length === 1) transport.host = transport.host[0];
  parsedProxy.transport = transport;
};

const grpcParser = (proxy, parsedProxy) => {
  const transport = { type: "grpc" };
  if (proxy["grpc-opts"]) {
    const serviceName = proxy["grpc-opts"]["grpc-service-name"];
    if (serviceName != null && serviceName !== "")
      transport.service_name = `${serviceName}`;
  }
  parsedProxy.transport = transport;
};

const tlsParser = (proxy, parsedProxy) => {
  if (proxy.tls) parsedProxy.tls.enabled = true;
  if (proxy.servername && proxy.servername !== "")
    parsedProxy.tls.server_name = proxy.servername;
  if (proxy.peer && proxy.peer !== "") parsedProxy.tls.server_name = proxy.peer;
  if (proxy.sni && proxy.sni !== "") parsedProxy.tls.server_name = proxy.sni;
  if (proxy["skip-cert-verify"]) parsedProxy.tls.insecure = true;
  if (proxy.insecure) parsedProxy.tls.insecure = true;
  if (proxy["disable-sni"]) parsedProxy.tls.disable_sni = true;
  if (typeof proxy.alpn === "string") {
    parsedProxy.tls.alpn = [proxy.alpn];
  } else if (Array.isArray(proxy.alpn)) parsedProxy.tls.alpn = proxy.alpn;
  if (proxy.ca) parsedProxy.tls.certificate_path = `${proxy.ca}`;
  if (proxy.ca_str) parsedProxy.tls.certificate = [proxy.ca_str];
  if (proxy["ca-str"]) parsedProxy.tls.certificate = [proxy["ca-str"]];
  if (proxy["reality-opts"]) {
    parsedProxy.tls.reality = { enabled: true };
    if (proxy["reality-opts"]["public-key"])
      parsedProxy.tls.reality.public_key = proxy["reality-opts"]["public-key"];
    if (proxy["reality-opts"]["short-id"])
      parsedProxy.tls.reality.short_id = proxy["reality-opts"]["short-id"];
    parsedProxy.tls.utls = { enabled: true };
  }
  if (
    !["hysteria", "hysteria2", "tuic"].includes(proxy.type) &&
    proxy["client-fingerprint"] &&
    proxy["client-fingerprint"] !== ""
  )
    parsedProxy.tls.utls = {
      enabled: true,
      fingerprint: proxy["client-fingerprint"],
    };
  if (!parsedProxy.tls.enabled) delete parsedProxy.tls;
};

const sshParser = (proxy = {}) => {
  const parsedProxy = {
    tag: proxy.name,
    type: "ssh",
    server: proxy.server,
    server_port: parseInt(`${proxy.port}`, 10),
  };
  if (parsedProxy.server_port < 0 || parsedProxy.server_port > 65535)
    throw "invalid port";
  if (proxy.username) parsedProxy.user = proxy.username;
  if (proxy.password) parsedProxy.password = proxy.password;
  // https://wiki.metacubex.one/config/proxies/ssh
  // https://sing-box.sagernet.org/zh/configuration/outbound/ssh
  if (proxy["privateKey"]) parsedProxy.private_key_path = proxy["privateKey"];
  if (proxy["private-key"]) parsedProxy.private_key_path = proxy["private-key"];
  if (proxy["private-key-passphrase"])
    parsedProxy.private_key_passphrase = proxy["private-key-passphrase"];
  if (proxy["server-fingerprint"]) {
    parsedProxy.host_key = [proxy["server-fingerprint"]];
    // https://manual.nssurge.com/policy/ssh.html
    // Surge only supports curve25519-sha256 as the kex algorithm and aes128-gcm as the encryption algorithm. It means that the SSH server must use OpenSSH v7.3 or above. (It should not be a problem since OpenSSH 7.3 was released on 2016-08-01.)
    // TODO: ?
    parsedProxy.host_key_algorithms = [
      proxy["server-fingerprint"].split(" ")[0],
    ];
  }
  if (proxy["host-key"]) parsedProxy.host_key = proxy["host-key"];
  if (proxy["host-key-algorithms"])
    parsedProxy.host_key_algorithms = proxy["host-key-algorithms"];
  if (proxy["fast-open"]) parsedProxy.udp_fragment = true;
  tfoParser(proxy, parsedProxy);
  detourParser(proxy, parsedProxy);
  return parsedProxy;
};

const httpParser = (proxy = {}) => {
  const parsedProxy = {
    tag: proxy.name,
    type: "http",
    server: proxy.server,
    server_port: parseInt(`${proxy.port}`, 10),
    tls: { enabled: false, server_name: proxy.server, insecure: false },
  };
  if (parsedProxy.server_port < 0 || parsedProxy.server_port > 65535)
    throw "invalid port";
  if (proxy.username) parsedProxy.username = proxy.username;
  if (proxy.password) parsedProxy.password = proxy.password;
  if (proxy.headers) {
    parsedProxy.headers = {};
    for (const k of Object.keys(proxy.headers)) {
      parsedProxy.headers[k] = `${proxy.headers[k]}`;
    }
    if (Object.keys(parsedProxy.headers).length === 0)
      delete parsedProxy.headers;
  }
  if (proxy["fast-open"]) parsedProxy.udp_fragment = true;
  tfoParser(proxy, parsedProxy);
  detourParser(proxy, parsedProxy);
  tlsParser(proxy, parsedProxy);
  return parsedProxy;
};

const socks5Parser = (proxy = {}) => {
  const parsedProxy = {
    tag: proxy.name,
    type: "socks",
    server: proxy.server,
    server_port: parseInt(`${proxy.port}`, 10),
    password: proxy.password,
    version: "5",
  };
  if (parsedProxy.server_port < 0 || parsedProxy.server_port > 65535)
    throw "invalid port";
  if (proxy.username) parsedProxy.username = proxy.username;
  if (proxy.password) parsedProxy.password = proxy.password;
  if (proxy.uot) parsedProxy.udp_over_tcp = true;
  if (proxy["udp-over-tcp"]) parsedProxy.udp_over_tcp = true;
  if (proxy["fast-open"]) parsedProxy.udp_fragment = true;
  tfoParser(proxy, parsedProxy);
  detourParser(proxy, parsedProxy);
  return parsedProxy;
};

const shadowTLSParser = (proxy = {}) => {
  const ssPart = {
    tag: proxy.name,
    type: "shadowsocks",
    method: proxy.cipher,
    password: proxy.password,
    detour: `${proxy.name}_shadowtls`,
  };
  const stPart = {
    tag: `${proxy.name}_shadowtls`,
    type: "shadowtls",
    server: proxy.server,
    server_port: parseInt(`${proxy.port}`, 10),
    version: proxy["plugin-opts"].version,
    password: proxy["plugin-opts"].password,
    tls: {
      enabled: true,
      server_name: proxy["plugin-opts"].host,
      utls: {
        enabled: true,
        fingerprint: proxy["client-fingerprint"],
      },
    },
  };
  if (stPart.server_port < 0 || stPart.server_port > 65535) throw "端口值非法";
  if (proxy["fast-open"] === true) stPart.udp_fragment = true;
  tfoParser(proxy, stPart);
  detourParser(proxy, stPart);
  smuxParser(proxy.smux, ssPart);
  return { type: "ss-with-st", ssPart, stPart };
};
const ssParser = (proxy = {}) => {
  const parsedProxy = {
    tag: proxy.name,
    type: "shadowsocks",
    server: proxy.server,
    server_port: parseInt(`${proxy.port}`, 10),
    method: proxy.cipher,
    password: proxy.password,
  };
  if (parsedProxy.server_port < 0 || parsedProxy.server_port > 65535)
    throw "invalid port";
  if (proxy.uot) parsedProxy.udp_over_tcp = true;
  if (proxy["udp-over-tcp"]) parsedProxy.udp_over_tcp = true;
  if (proxy["fast-open"]) parsedProxy.udp_fragment = true;
  tfoParser(proxy, parsedProxy);
  detourParser(proxy, parsedProxy);
  smuxParser(proxy.smux, parsedProxy);
  if (proxy.plugin) {
    const optArr = [];
    if (proxy.plugin === "obfs") {
      parsedProxy.plugin = "obfs-local";
      parsedProxy.plugin_opts = "";
      if (proxy["obfs-host"]) proxy["plugin-opts"].host = proxy["obfs-host"];
      Object.keys(proxy["plugin-opts"]).forEach((k) => {
        switch (k) {
          case "mode":
            optArr.push(`obfs=${proxy["plugin-opts"].mode}`);
            break;
          case "host":
            optArr.push(`obfs-host=${proxy["plugin-opts"].host}`);
            break;
          default:
            optArr.push(`${k}=${proxy["plugin-opts"][k]}`);
            break;
        }
      });
    }
    if (proxy.plugin === "v2ray-plugin") {
      parsedProxy.plugin = "v2ray-plugin";
      if (proxy["ws-host"]) proxy["plugin-opts"].host = proxy["ws-host"];
      if (proxy["ws-path"]) proxy["plugin-opts"].path = proxy["ws-path"];
      Object.keys(proxy["plugin-opts"]).forEach((k) => {
        switch (k) {
          case "tls":
            if (proxy["plugin-opts"].tls) optArr.push("tls");
            break;
          case "host":
            optArr.push(`host=${proxy["plugin-opts"].host}`);
            break;
          case "path":
            optArr.push(`path=${proxy["plugin-opts"].path}`);
            break;
          case "headers":
            optArr.push(
              `headers=${JSON.stringify(proxy["plugin-opts"].headers)}`,
            );
            break;
          case "mux":
            if (proxy["plugin-opts"].mux)
              parsedProxy.multiplex = { enabled: true };
            break;
          default:
            optArr.push(`${k}=${proxy["plugin-opts"][k]}`);
        }
      });
    }
    parsedProxy.plugin_opts = optArr.join(";");
  }

  console.log("ss parsedProxy", parsedProxy);
  return parsedProxy;
};
// eslint-disable-next-line no-unused-vars
const ssrParser = (proxy = {}) => {
  const parsedProxy = {
    tag: proxy.name,
    type: "shadowsocksr",
    server: proxy.server,
    server_port: parseInt(`${proxy.port}`, 10),
    method: proxy.cipher,
    password: proxy.password,
    obfs: proxy.obfs,
    protocol: proxy.protocol,
  };
  if (parsedProxy.server_port < 0 || parsedProxy.server_port > 65535)
    throw "invalid port";
  if (proxy["obfs-param"]) parsedProxy.obfs_param = proxy["obfs-param"];
  if (proxy["protocol-param"] && proxy["protocol-param"] !== "")
    parsedProxy.protocol_param = proxy["protocol-param"];
  if (proxy["fast-open"]) parsedProxy.udp_fragment = true;
  tfoParser(proxy, parsedProxy);
  detourParser(proxy, parsedProxy);
  smuxParser(proxy.smux, parsedProxy);
  return parsedProxy;
};

const vmessParser = (proxy = {}) => {
  const parsedProxy = {
    tag: proxy.name,
    type: "vmess",
    server: proxy.server,
    server_port: parseInt(`${proxy.port}`, 10),
    uuid: proxy.uuid,
    security: proxy.cipher,
    alter_id: parseInt(`${proxy.alterId}`, 10),
    tls: { enabled: false, server_name: proxy.server, insecure: false },
  };
  if (
    [
      "auto",
      "none",
      "zero",
      "aes-128-gcm",
      "chacha20-poly1305",
      "aes-128-ctr",
    ].indexOf(parsedProxy.security) === -1
  )
    parsedProxy.security = "auto";
  if (parsedProxy.server_port < 0 || parsedProxy.server_port > 65535)
    throw "invalid port";
  if (proxy.xudp) parsedProxy.packet_encoding = "xudp";
  if (proxy["fast-open"]) parsedProxy.udp_fragment = true;
  if (proxy.network === "ws") wsParser(proxy, parsedProxy);
  if (proxy.network === "h2") h2Parser(proxy, parsedProxy);
  if (proxy.network === "http") h1Parser(proxy, parsedProxy);
  if (proxy.network === "grpc") grpcParser(proxy, parsedProxy);

  tfoParser(proxy, parsedProxy);
  detourParser(proxy, parsedProxy);
  tlsParser(proxy, parsedProxy);
  smuxParser(proxy.smux, parsedProxy);
  return parsedProxy;
};

const vlessParser = (proxy = {}) => {
  const parsedProxy = {
    tag: proxy.name,
    type: "vless",
    server: proxy.server,
    server_port: parseInt(`${proxy.port}`, 10),
    uuid: proxy.uuid,
    tls: { enabled: false, server_name: proxy.server, insecure: false },
  };
  if (parsedProxy.server_port < 0 || parsedProxy.server_port > 65535)
    throw "invalid port";
  if (proxy["fast-open"]) parsedProxy.udp_fragment = true;
  if (proxy.flow === "xtls-rprx-vision") parsedProxy.flow = proxy.flow;
  if (proxy.network === "ws") wsParser(proxy, parsedProxy);
  if (proxy.network === "grpc") grpcParser(proxy, parsedProxy);

  tfoParser(proxy, parsedProxy);
  detourParser(proxy, parsedProxy);
  smuxParser(proxy.smux, parsedProxy);
  tlsParser(proxy, parsedProxy);
  return parsedProxy;
};
const trojanParser = (proxy = {}) => {
  const parsedProxy = {
    tag: proxy.name,
    type: "trojan",
    server: proxy.server,
    server_port: parseInt(`${proxy.port}`, 10),
    password: proxy.password,
    tls: { enabled: true, server_name: proxy.server, insecure: false },
  };
  if (parsedProxy.server_port < 0 || parsedProxy.server_port > 65535)
    throw "invalid port";
  if (proxy["fast-open"]) parsedProxy.udp_fragment = true;
  if (proxy.network === "grpc") grpcParser(proxy, parsedProxy);
  if (proxy.network === "ws") wsParser(proxy, parsedProxy);

  tfoParser(proxy, parsedProxy);
  detourParser(proxy, parsedProxy);
  tlsParser(proxy, parsedProxy);
  smuxParser(proxy.smux, parsedProxy);
  return parsedProxy;
};
const hysteriaParser = (proxy = {}) => {
  const parsedProxy = {
    tag: proxy.name,
    type: "hysteria",
    server: proxy.server,
    server_port: parseInt(`${proxy.port}`, 10),
    disable_mtu_discovery: false,
    tls: { enabled: true, server_name: proxy.server, insecure: false },
  };
  if (parsedProxy.server_port < 0 || parsedProxy.server_port > 65535)
    throw "invalid port";
  if (proxy.auth_str) parsedProxy.auth_str = `${proxy.auth_str}`;
  if (proxy["auth-str"]) parsedProxy.auth_str = `${proxy["auth-str"]}`;
  if (proxy["fast-open"]) parsedProxy.udp_fragment = true;
  // eslint-disable-next-line no-control-regex
  const reg = new RegExp("^[0-9]+[ \t]*[KMGT]*[Bb]ps$");
  if (reg.test(`${proxy.up}`)) {
    parsedProxy.up = `${proxy.up}`;
  } else {
    parsedProxy.up_mbps = parseInt(`${proxy.up}`, 10);
  }
  if (reg.test(`${proxy.down}`)) {
    parsedProxy.down = `${proxy.down}`;
  } else {
    parsedProxy.down_mbps = parseInt(`${proxy.down}`, 10);
  }
  if (proxy.obfs) parsedProxy.obfs = proxy.obfs;
  if (proxy.recv_window_conn)
    parsedProxy.recv_window_conn = proxy.recv_window_conn;
  if (proxy["recv-window-conn"])
    parsedProxy.recv_window_conn = proxy["recv-window-conn"];
  if (proxy.recv_window) parsedProxy.recv_window = proxy.recv_window;
  if (proxy["recv-window"]) parsedProxy.recv_window = proxy["recv-window"];
  if (proxy.disable_mtu_discovery) {
    if (typeof proxy.disable_mtu_discovery === "boolean") {
      parsedProxy.disable_mtu_discovery = proxy.disable_mtu_discovery;
    } else {
      if (proxy.disable_mtu_discovery === 1)
        parsedProxy.disable_mtu_discovery = true;
    }
  }
  tlsParser(proxy, parsedProxy);
  detourParser(proxy, parsedProxy);
  tfoParser(proxy, parsedProxy);
  smuxParser(proxy.smux, parsedProxy);
  return parsedProxy;
};
const hysteria2Parser = (proxy = {}) => {
  const parsedProxy = {
    tag: proxy.name,
    type: "hysteria2",
    server: proxy.server,
    server_port: parseInt(`${proxy.port}`, 10),
    password: proxy.password,
    obfs: {},
    tls: { enabled: true, server_name: proxy.server, insecure: false },
  };
  if (parsedProxy.server_port < 0 || parsedProxy.server_port > 65535)
    throw "invalid port";
  if (proxy.up) parsedProxy.up_mbps = parseInt(`${proxy.up}`, 10);
  if (proxy.down) parsedProxy.down_mbps = parseInt(`${proxy.down}`, 10);
  if (proxy.obfs === "salamander") parsedProxy.obfs.type = "salamander";
  if (proxy["obfs-password"])
    parsedProxy.obfs.password = proxy["obfs-password"];
  if (!parsedProxy.obfs.type) delete parsedProxy.obfs;
  tlsParser(proxy, parsedProxy);
  tfoParser(proxy, parsedProxy);
  detourParser(proxy, parsedProxy);
  smuxParser(proxy.smux, parsedProxy);
  return parsedProxy;
};
const tuic5Parser = (proxy = {}) => {
  const parsedProxy = {
    tag: proxy.name,
    type: "tuic",
    server: proxy.server,
    server_port: parseInt(`${proxy.port}`, 10),
    uuid: proxy.uuid,
    password: proxy.password,
    tls: { enabled: true, server_name: proxy.server, insecure: false },
  };
  if (parsedProxy.server_port < 0 || parsedProxy.server_port > 65535)
    throw "invalid port";
  if (proxy["fast-open"]) parsedProxy.udp_fragment = true;
  if (
    proxy["congestion-controller"] &&
    proxy["congestion-controller"] !== "cubic"
  )
    parsedProxy.congestion_control = proxy["congestion-controller"];
  if (proxy["udp-relay-mode"] && proxy["udp-relay-mode"] !== "native")
    parsedProxy.udp_relay_mode = proxy["udp-relay-mode"];
  if (proxy["reduce-rtt"]) parsedProxy.zero_rtt_handshake = true;
  if (proxy["udp-over-stream"]) parsedProxy.udp_over_stream = true;
  if (proxy["heartbeat-interval"])
    parsedProxy.heartbeat = `${proxy["heartbeat-interval"]}ms`;
  tfoParser(proxy, parsedProxy);
  detourParser(proxy, parsedProxy);
  tlsParser(proxy, parsedProxy);
  smuxParser(proxy.smux, parsedProxy);
  return parsedProxy;
};

const wireguardParser = (proxy = {}) => {
  const local_address = ["ip", "ipv6"]
    .map((i) => proxy[i])
    .map((i) => {
      if (isIPv4(i)) return `${i}/32`;
      if (isIPv6(i)) return `${i}/128`;
    })
    .filter((i) => i);
  const parsedProxy = {
    tag: proxy.name,
    type: "wireguard",
    server: proxy.server,
    server_port: parseInt(`${proxy.port}`, 10),
    local_address,
    private_key: proxy["private-key"],
    peer_public_key: proxy["public-key"],
    pre_shared_key: proxy["pre-shared-key"],
    reserved: [],
  };
  if (parsedProxy.server_port < 0 || parsedProxy.server_port > 65535)
    throw "invalid port";
  if (proxy["fast-open"]) parsedProxy.udp_fragment = true;
  if (typeof proxy.reserved === "string") {
    parsedProxy.reserved = proxy.reserved;
  } else if (Array.isArray(proxy.reserved)) {
    for (const r of proxy.reserved) parsedProxy.reserved.push(r);
  } else {
    delete parsedProxy.reserved;
  }
  if (proxy.peers && proxy.peers.length > 0) {
    parsedProxy.peers = [];
    for (const p of proxy.peers) {
      const peer = {
        server: p.server,
        server_port: parseInt(`${p.port}`, 10),
        public_key: p["public-key"],
        allowed_ips: p["allowed-ips"] || p.allowed_ips,
        reserved: [],
      };
      if (typeof p.reserved === "string") {
        peer.reserved.push(p.reserved);
      } else if (Array.isArray(p.reserved)) {
        for (const r of p.reserved) peer.reserved.push(r);
      } else {
        delete peer.reserved;
      }
      if (p["pre-shared-key"]) peer.pre_shared_key = p["pre-shared-key"];
      parsedProxy.peers.push(peer);
    }
  }
  tfoParser(proxy, parsedProxy);
  detourParser(proxy, parsedProxy);
  smuxParser(proxy.smux, parsedProxy);
  return parsedProxy;
};

/**
 * 说明：用于处理clash.meta代理
 * 来源：https://github.com/sub-store-org/Sub-Store/blob/cc556b641d32f5af571101cd825d76f8506a0855/backend/src/core/proxy-utils/producers/clashmeta.js
 * 修改：+  const isPresent = (obj, expr) => {
 *      +    return expr.split('.').reduce((value, key) => {
 *      +      return value?.[key]
 *      +      }, obj)
 *      +  }
 */
function ClashMeta_Producer() {
  const isPresent = (obj, expr) => {
    return expr.split(".").reduce((value, key) => {
      return value?.[key];
    }, obj);
  };
  const type = "ALL";
  const produce = (proxies, type, opts = {}) => {
    const list = proxies
      .filter((proxy) => {
        if (opts["include-unsupported-proxy"]) return true;
        if (proxy.type === "snell" && String(proxy.version) === "4") {
          return false;
        }
        return true;
      })
      .map((proxy) => {
        if (proxy.type === "vmess") {
          // handle vmess aead
          if (isPresent(proxy, "aead")) {
            if (proxy.aead) {
              proxy.alterId = 0;
            }
            delete proxy.aead;
          }
          if (isPresent(proxy, "sni")) {
            proxy.servername = proxy.sni;
            delete proxy.sni;
          }
          // https://github.com/MetaCubeX/Clash.Meta/blob/Alpha/docs/config.yaml#L400
          // https://stash.wiki/proxy-protocols/proxy-types#vmess
          if (
            isPresent(proxy, "cipher") &&
            !["auto", "aes-128-gcm", "chacha20-poly1305", "none"].includes(
              proxy.cipher,
            )
          ) {
            proxy.cipher = "auto";
          }
        } else if (proxy.type === "tuic") {
          if (isPresent(proxy, "alpn")) {
            proxy.alpn = Array.isArray(proxy.alpn) ? proxy.alpn : [proxy.alpn];
          } else {
            proxy.alpn = ["h3"];
          }
          if (isPresent(proxy, "tfo") && !isPresent(proxy, "fast-open")) {
            proxy["fast-open"] = proxy.tfo;
          }
          // https://github.com/MetaCubeX/Clash.Meta/blob/Alpha/adapter/outbound/tuic.go#L197
          if (
            (!proxy.token || proxy.token.length === 0) &&
            !isPresent(proxy, "version")
          ) {
            proxy.version = 5;
          }
        } else if (proxy.type === "hysteria") {
          // auth_str 将会在未来某个时候删除 但是有的机场不规范
          if (isPresent(proxy, "auth_str") && !isPresent(proxy, "auth-str")) {
            proxy["auth-str"] = proxy["auth_str"];
          }
          if (isPresent(proxy, "alpn")) {
            proxy.alpn = Array.isArray(proxy.alpn) ? proxy.alpn : [proxy.alpn];
          }
          if (isPresent(proxy, "tfo") && !isPresent(proxy, "fast-open")) {
            proxy["fast-open"] = proxy.tfo;
          }
        } else if (proxy.type === "wireguard") {
          proxy.keepalive = proxy.keepalive ?? proxy["persistent-keepalive"];
          proxy["persistent-keepalive"] = proxy.keepalive;
          proxy["preshared-key"] =
            proxy["preshared-key"] ?? proxy["pre-shared-key"];
          proxy["pre-shared-key"] = proxy["preshared-key"];
        } else if (proxy.type === "vless") {
          if (isPresent(proxy, "sni")) {
            proxy.servername = proxy.sni;
            delete proxy.sni;
          }
        } else if (proxy.type === "ss") {
          if (
            isPresent(proxy, "shadow-tls-password") &&
            !isPresent(proxy, "plugin")
          ) {
            proxy.plugin = "shadow-tls";
            proxy["plugin-opts"] = {
              host: proxy["shadow-tls-sni"],
              password: proxy["shadow-tls-password"],
              version: proxy["shadow-tls-version"],
            };
          }
        }

        if (
          ["vmess", "vless"].includes(proxy.type) &&
          proxy.network === "http"
        ) {
          let httpPath = proxy["http-opts"]?.path;
          if (isPresent(proxy, "http-opts.path") && !Array.isArray(httpPath)) {
            proxy["http-opts"].path = [httpPath];
          }
          let httpHost = proxy["http-opts"]?.headers?.Host;
          if (
            isPresent(proxy, "http-opts.headers.Host") &&
            !Array.isArray(httpHost)
          ) {
            proxy["http-opts"].headers.Host = [httpHost];
          }
        }
        if (["vmess", "vless"].includes(proxy.type) && proxy.network === "h2") {
          let path = proxy["h2-opts"]?.path;
          if (isPresent(proxy, "h2-opts.path") && Array.isArray(path)) {
            proxy["h2-opts"].path = path[0];
          }
          let host = proxy["h2-opts"]?.headers?.host;
          if (
            isPresent(proxy, "h2-opts.headers.Host") &&
            !Array.isArray(host)
          ) {
            proxy["h2-opts"].headers.host = [host];
          }
        }

        if (proxy["plugin-opts"]?.tls) {
          if (isPresent(proxy, "skip-cert-verify")) {
            proxy["plugin-opts"]["skip-cert-verify"] =
              proxy["skip-cert-verify"];
          }
        }
        if (
          ["trojan", "tuic", "hysteria", "hysteria2", "juicity"].includes(
            proxy.type,
          )
        ) {
          delete proxy.tls;
        }

        if (proxy["tls-fingerprint"]) {
          proxy.fingerprint = proxy["tls-fingerprint"];
        }
        delete proxy["tls-fingerprint"];

        if (proxy["underlying-proxy"]) {
          proxy["dialer-proxy"] = proxy["underlying-proxy"];
        }
        delete proxy["underlying-proxy"];

        if (isPresent(proxy, "tls") && typeof proxy.tls !== "boolean") {
          delete proxy.tls;
        }
        delete proxy.subName;
        delete proxy.collectionName;
        delete proxy.id;
        delete proxy.resolved;
        delete proxy["no-resolve"];
        if (type !== "internal") {
          for (const key in proxy) {
            if (proxy[key] == null || /^_/i.test(key)) {
              delete proxy[key];
            }
          }
        }
        if (
          ["grpc"].includes(proxy.network) &&
          proxy[`${proxy.network}-opts`]
        ) {
          delete proxy[`${proxy.network}-opts`]["_grpc-type"];
        }
        return proxy;
      });

    return type === "internal"
      ? list
      : "proxies:\n" +
          list.map((proxy) => "  - " + JSON.stringify(proxy) + "\n").join("");
  };
  return { type, produce };
}
