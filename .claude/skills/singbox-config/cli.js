#!/usr/bin/env node
/**
 * Sing-box 配置生成器 CLI
 *
 * 用法:
 *   node cli.js [--version 1.11|1.12] [--input <file>] [--output <file>]
 *   echo "base64内容" | node cli.js
 *   bun cli.js --version 1.12 < subscription.txt
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// 解析命令行参数
function parseArgs() {
    const args = process.argv.slice(2);
    const options = {
        version: '1.11',
        input: null,
        output: null,
    };

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--version':
            case '-v':
                options.version = args[++i] || '1.11';
                break;
            case '--input':
            case '-i':
                options.input = args[++i];
                break;
            case '--output':
            case '-o':
                options.output = args[++i];
                break;
            case '--help':
            case '-h':
                console.log(`
Sing-box 配置生成器

用法:
  node cli.js [选项]

选项:
  -v, --version <ver>   Sing-box 版本 (1.11 或 1.12，默认: 1.11)
  -i, --input <file>    输入文件路径
  -o, --output <file>   输出文件路径
  -h, --help            显示帮助信息

示例:
  echo "base64订阅" | node cli.js
  node cli.js -i subscription.txt -o config.json
  cat uris.txt | node cli.js -v 1.12
                `);
                process.exit(0);
        }
    }

    return options;
}

// 读取输入
async function readInput(inputPath) {
    if (inputPath) {
        return fs.readFileSync(inputPath, 'utf-8');
    }

    // 从 stdin 读取
    return new Promise((resolve) => {
        let data = '';
        process.stdin.setEncoding('utf-8');

        if (process.stdin.isTTY) {
            console.error('请输入订阅内容 (Ctrl+D 结束):');
        }

        process.stdin.on('data', (chunk) => {
            data += chunk;
        });

        process.stdin.on('end', () => {
            resolve(data);
        });
    });
}

// 主函数
async function main() {
    const options = parseArgs();
    const scriptDir = __dirname;

    // 加载 test.js 并在沙箱中执行
    const testJsPath = path.join(scriptDir, 'test.js');
    const testJsContent = fs.readFileSync(testJsPath, 'utf-8');

    // 创建沙箱上下文
    const sandbox = {
        console,
        atob: (str) => Buffer.from(str, 'base64').toString('binary'),
        btoa: (str) => Buffer.from(str, 'binary').toString('base64'),
        decodeURIComponent,
        encodeURIComponent,
        escape,
        unescape,
        URL,
        JSON,
        Array,
        Object,
        String,
        Number,
        parseInt,
        parseFloat,
        isNaN,
        RegExp,
        Error,
        Buffer,
    };

    vm.createContext(sandbox);
    // 在脚本末尾添加导出语句，将 const 变量绑定到 this
    const wrappedScript = testJsContent + ';\nthis.protocolForClash = protocolForClash; this.protocolForSingBox = protocolForSingBox;';
    vm.runInContext(wrappedScript, sandbox);

    const { protocolForClash, protocolForSingBox } = sandbox;

    // 读取输入
    const input = (await readInput(options.input)).trim();

    if (!input) {
        console.error('错误: 没有输入内容');
        process.exit(1);
    }

    // Base64 解码函数
    const base64Decode = (str) => {
        try {
            const padded = str + '='.repeat((4 - str.length % 4) % 4);
            return Buffer.from(padded, 'base64').toString('utf-8');
        } catch (e) {
            return str;
        }
    };

    // 检查是否为有效的 Base64 订阅
    const isValidBase64 = (str) => {
        try {
            const decoded = base64Decode(str.trim());
            return /^(ss|ssr|vmess|vless|trojan|hysteria|hysteria2|tuic|wireguard):\/\//i.test(decoded);
        } catch (e) {
            return false;
        }
    };

    // 解析输入
    let lines = [];
    if (isValidBase64(input)) {
        const decoded = base64Decode(input);
        lines = decoded.split('\n').filter(v => v.trim());
    } else {
        lines = input.split('\n').filter(v => v.trim());
    }

    // 解析代理
    const proxies = [];
    for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        const schema = line.split('://')[0].toLowerCase();
        const protocol = protocolForClash[schema];

        if (!protocol) {
            console.error(`未支持的协议: ${schema}`);
            continue;
        }

        try {
            const proxy = protocol.parse(line);
            proxies.push(proxy);
        } catch (error) {
            console.error(`解析错误: ${error.message || error}`);
        }
    }

    if (proxies.length === 0) {
        console.error('错误: 未能解析出任何有效节点');
        process.exit(1);
    }

    // 转换为 Sing-box 格式
    const singboxProxies = [];
    const protocolMap = protocolForSingBox();

    for (const proxy of proxies) {
        try {
            const converter = protocolMap[proxy.type];
            if (converter) {
                const converted = converter(proxy);
                singboxProxies.push(converted);
            } else {
                console.error(`未支持的转换类型: ${proxy.type}`);
            }
        } catch (error) {
            console.error(`转换错误 [${proxy.name}]: ${error.message || error}`);
        }
    }

    if (singboxProxies.length === 0) {
        console.error('错误: 节点转换失败');
        process.exit(1);
    }

    // 加载版本配置
    const versionDir = path.join(scriptDir, options.version);
    const templatePath = path.join(versionDir, 'sing-box.json');
    const versionScriptPath = path.join(versionDir, 'sing-box.js');

    if (!fs.existsSync(templatePath)) {
        console.error(`错误: 模板文件不存在: ${templatePath}`);
        process.exit(1);
    }

    const template = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));

    // 加载处理脚本
    const versionScriptContent = fs.readFileSync(versionScriptPath, 'utf-8');
    const processFunc = new Function(versionScriptContent + '; return { processConfig, getTags };')();

    // 处理配置
    const config = processFunc.processConfig(singboxProxies, template);

    // 输出
    const output = JSON.stringify(config, null, 2);

    if (options.output) {
        fs.writeFileSync(options.output, output, 'utf-8');
        console.error(`配置已保存到: ${options.output}`);
        console.error(`共 ${singboxProxies.length} 个节点`);
    } else {
        console.log(output);
    }
}

main().catch(error => {
    console.error('错误:', error.message || error);
    process.exit(1);
});
