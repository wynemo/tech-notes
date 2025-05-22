// ==UserScript==
// @name         xiaohongshu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  小红书去无聊帖子
// @author       You
// @match        https://www.xiaohongshu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// ==/UserScript==
/*
这个插件根据关键字列表，去掉小红书上无聊的帖子

*/

(function () {
  "use strict";
  // 关键字列表，粗放匹配，就是有了四川，不要再加四川省了；就是有了成都，不要再加成都市了
  const keywords = [
    // 营销的
    "成都",
    "地铁",
    "程序员",
    "四川",
    "打工人",
    "月薪",
    "工资",
    //起号的
    "爸",
    "逆天",
    "什么水平",
    //广告 营销 内容农场
    "手机",
    "中医",
    "买房",
    "裁员",
    "失业",
    "存款",
    "公积金",
    "工作",
    "华为",
    "收入",
    "天府",
    "房贷",
    "小区",
    "区域",
    "增值",
    "二线",
    "投资",
    "股市",
    "炒股",
    "男朋友",
    "OD",
    "中国",
    "金融",
    "财富",
    "比特币",
    "贷款",
    "理财",
    "银行",
    "WPS",
    "重庆",
    "房东",
    "租房",
    //成都几个区
    "高新",
    "武侯",
    "锦江区",
    "青羊",
    "金牛",
    "成华",
    "龙泉驿",
    "青白江",
    "新都",
    "温江",
    "双流",
    "郫都",
    "新津",
    "蒲江",
    "大邑",
    "自贡",
    "崇州",
    "鸿蒙",
    //成都的街道
    "东安湖",
    "华阳",
    "新川",
    "万年场",
    "三圣",
    "三河",
    "东升",
    "东坡",
    "东安",
    "东湖",
    "中和",
    "九江",
    "九里堤",
    "书院街",
    "二仙桥",
    "五块石",
    "人民北路",
    "保和",
    "光华",
    "公兴",
    "公平",
    "凤凰山",
    "十陵",
    "华兴",
    "华阳",
    "双桂路",
    "双桥子",
    "双楠",
    "双水碾",
    "合江亭",
    "同安",
    "圣灯",
    "大丰",
    "大弯",
    "大面",
    "天回镇",
    "天府",
    "太升路",
    "奎光塔",
    "射洪坝",
    "少城",
    "崇庆",
    "府南",
    "府青路",
    "康河",
    "建设路",
    "怡心",
    "成龙路",
    "抚琴",
    "文君",
    "文家",
    "新华西路",
    "新市",
    "新鸿路",
    "春熙路",
    "晋阳",
    "望江路",
    "机投桥",
    "杨柳",
    "柳城",
    "柳江",
    "桂湖",
    "桂溪",
    "桃蹊路",
    "汪家拐",
    "沙河源",
    "沙河",
    "浆洗街",
    "涌泉",
    "火车南站",
    "牛市口",
    "狮子山",
    "猛追湾",
    "玉林",
    "白莲池",
    "盐市口",
    "督院街",
    "石羊",
    "簇桥",
    "簇锦",
    "红牌楼",
    "红阳",
    "肖家河",
    "芳草街",
    "苏坡",
    "茶店子",
    "草堂",
    "草市街",
    "荷花池",
    "莲新",
    "营门口",
    "蔡桥",
    "西华",
    "西园",
    "西安路",
    "西御河",
    "西航港",
    "赵镇",
    "跳伞塔",
    "跳蹬河",
    "金沙",
    "金泉",
    "金花桥",
    "银杏",
    "锦华路",
    "锦官驿",
    "青龙",
    "驷马桥",
    "黄忠",
    "黄田坝",
    "黄甲",
    "龙泉",
    "龙潭",
    "龙舟路",
    //成都地铁站
    "犀浦",
    "天府广场",
    "春熙路",
    "成都东站",
    "成都南站",
    "成都西站",
    "成都北站",
    "成都东客站",
    "市二医院",
    "兴隆湖",
    "科学城",
  ];

  // 注入隐藏样式
  GM_addStyle(".xhs-hide { display: none !important; }");

  // 隐藏包含关键字的帖子
  function hideBoringNotes() {
    document.querySelectorAll("section.note-item").forEach((section) => {
      const titleSpan = section.querySelector(".title span");
      if (titleSpan) {
        const titleText = titleSpan.textContent;
        if (keywords.some((keyword) => titleText.includes(keyword))) {
          section.classList.add("xhs-hide");
        }
      }
    });
  }

  // 初始执行一次
  hideBoringNotes();

  // 监听 DOM 变化，处理异步加载的内容
  const observer = new MutationObserver(hideBoringNotes);
  observer.observe(document.body, { childList: true, subtree: true });
})();
