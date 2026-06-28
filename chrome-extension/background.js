// ═══════════════════════════════════════════════
// 衍策银龄 AI — Background Service Worker
// ═══════════════════════════════════════════════

// 监听安装事件
chrome.runtime.onInstalled.addListener(function () {
  console.log("[银龄AI] 扩展已安装");
});

// 监听来自 content script 的消息,转发给侧边栏
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.type === "page_content") {
    // 存储页面内容,供侧边栏读取
    chrome.storage.local.set({
      pageContent: msg.content,
      pageUrl: msg.url,
      pageTitle: msg.title,
    });
  }
  return true; // 保持消息通道开放
});
