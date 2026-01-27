/**
 * Sing-box 1.11 配置处理脚本
 * 支持两种运行模式：
 * 1. 浏览器环境：通过 processConfig 函数处理
 * 2. Sub-Store 环境：使用原有的 produceArtifact 逻辑
 */

// 浏览器环境：暴露 processConfig 函数
function processConfig(proxies, configTemplate) {
  const compatible_outbound = {
    tag: 'COMPATIBLE',
    type: 'direct',
  }

  let compatible = false
  let config = JSON.parse(JSON.stringify(configTemplate))

  config.outbounds.push(...proxies)

  config.outbounds.forEach(i => {
    if (['all', 'all-auto'].includes(i.tag)) {
      i.outbounds.push(...getTags(proxies))
    }
    if (['hk', 'hk-auto'].includes(i.tag)) {
      i.outbounds.push(...getTags(proxies, /港|hk|hongkong|hong kong|🇭🇰/i))
    }
    if (['tw', 'tw-auto'].includes(i.tag)) {
      i.outbounds.push(...getTags(proxies, /台|tw|taiwan|🇹🇼/i))
    }
    if (['jp', 'jp-auto'].includes(i.tag)) {
      i.outbounds.push(...getTags(proxies, /日本|jp|japan|🇯🇵/i))
    }
    if (['sg', 'sg-auto'].includes(i.tag)) {
      i.outbounds.push(...getTags(proxies, /^(?!.*(?:us)).*(新|sg|singapore|🇸🇬)/i))
    }
    if (['us', 'us-auto'].includes(i.tag)) {
      i.outbounds.push(...getTags(proxies, /美|us|unitedstates|united states|🇺🇸/i))
    }
  })

  config.outbounds.forEach(outbound => {
    if (Array.isArray(outbound.outbounds) && outbound.outbounds.length === 0) {
      if (!compatible) {
        config.outbounds.push(compatible_outbound)
        compatible = true
      }
      outbound.outbounds.push(compatible_outbound.tag)
    }
  })

  return config
}

function getTags(proxies, regex) {
  return (regex ? proxies.filter(p => regex.test(p.tag)) : proxies).map(p => p.tag)
}

// Sub-Store 环境：保持原有逻辑
if (typeof $arguments !== 'undefined') {
  (async () => {
    const { type, name } = $arguments
    const compatible_outbound = {
      tag: 'COMPATIBLE',
      type: 'direct',
    }

    let compatible
    let config = JSON.parse($files[0])
    let proxies = await produceArtifact({
      name,
      type: /^1$|col/i.test(type) ? 'collection' : 'subscription',
      platform: 'sing-box',
      produceType: 'internal',
    })

    config.outbounds.push(...proxies)

    config.outbounds.map(i => {
      if (['all', 'all-auto'].includes(i.tag)) {
        i.outbounds.push(...getTags(proxies))
      }
      if (['hk', 'hk-auto'].includes(i.tag)) {
        i.outbounds.push(...getTags(proxies, /港|hk|hongkong|hong kong|🇭🇰/i))
      }
      if (['tw', 'tw-auto'].includes(i.tag)) {
        i.outbounds.push(...getTags(proxies, /台|tw|taiwan|🇹🇼/i))
      }
      if (['jp', 'jp-auto'].includes(i.tag)) {
        i.outbounds.push(...getTags(proxies, /日本|jp|japan|🇯🇵/i))
      }
      if (['sg', 'sg-auto'].includes(i.tag)) {
        i.outbounds.push(...getTags(proxies, /^(?!.*(?:us)).*(新|sg|singapore|🇸🇬)/i))
      }
      if (['us', 'us-auto'].includes(i.tag)) {
        i.outbounds.push(...getTags(proxies, /美|us|unitedstates|united states|🇺🇸/i))
      }
    })

    config.outbounds.forEach(outbound => {
      if (Array.isArray(outbound.outbounds) && outbound.outbounds.length === 0) {
        if (!compatible) {
          config.outbounds.push(compatible_outbound)
          compatible = true
        }
        outbound.outbounds.push(compatible_outbound.tag)
      }
    })

    $content = JSON.stringify(config, null, 2)
  })()
}
