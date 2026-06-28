// ═══════════════════════════════════════════════
// 衍策银龄 AI — Content Script
// 在政府/养老相关网站显示浮动助手按钮
// ═══════════════════════════════════════════════

(function () {
  "use strict";

  // ─── 检测是否为养老相关网站 ───────────────────────────────
  var agingKeywords = [
    "民政", "养老", "老年", "老龄", "社区", "卫生", "医保",
    "残联", "退休", "社保", "福利", "健康", "医院",
    "gov.cn", "mca.gov", "nhc.gov", "nhsa.gov"
  ];

  var url = window.location.href.toLowerCase();
  var isAgingRelated = agingKeywords.some(function (kw) {
    return url.includes(kw) || document.title.includes(kw);
  });

  // ─── 创建浮动按钮 ───────────────────────────────
  function createFloatingButton() {
    var btn = document.createElement("div");
    btn.id = "aging-ai-floating-btn";
    btn.innerHTML = '<div style="' +
      'position: fixed;' +
      'bottom: 24px;' +
      'right: 24px;' +
      'width: 52px;' +
      'height: 52px;' +
      'background: linear-gradient(135deg, #6366f1, #8b5cf6);' +
      'border-radius: 50%;' +
      'display: flex;' +
      'align-items: center;' +
      'justify-content: center;' +
      'cursor: pointer;' +
      'box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4);' +
      'z-index: 2147483647;' +
      'transition: transform 0.2s, box-shadow 0.2s;' +
      'font-size: 12px;' +
      'color: white;' +
      'font-weight: 700;' +
      'font-family: -apple-system, BlinkMacSystemFont, PingFang SC, Microsoft YaHei, sans-serif;' +
      'text-align: center;' +
      'line-height: 1.1;' +
      '">银龄<br>AI</div>';

    var inner = btn.firstChild;

    // 悬停效果
    inner.addEventListener("mouseenter", function () {
      inner.style.transform = "scale(1.1)";
      inner.style.boxShadow = "0 6px 24px rgba(99, 102, 241, 0.5)";
    });
    inner.addEventListener("mouseleave", function () {
      inner.style.transform = "scale(1)";
      inner.style.boxShadow = "0 4px 16px rgba(99, 102, 241, 0.4)";
    });

    // 点击事件
    inner.addEventListener("click", function () {
      extractAndSend();
    });

    document.body.appendChild(btn);
  }

  // ─── 提取页面内容并发送到侧边栏 ───────────────────────────────
  function extractAndSend() {
    // 提取页面主要文本内容
    var content = "";

    // 尝试获取主要内容
    var mainContent = document.querySelector("article") ||
      document.querySelector("main") ||
      document.querySelector(".content") ||
      document.querySelector("#content") ||
      document.body;

    if (mainContent) {
      // 提取前500个字符的文本
      content = mainContent.innerText
        .replace(/\s+/g, " ")
        .trim()
        .substring(0, 500);
    }

    // 如果内容太少,使用标题
    if (content.length < 20) {
      content = document.title;
    }

    // 发送到侧边栏
    try {
      chrome.runtime.sendMessage({
        type: "page_content",
        content: content,
        url: window.location.href,
        title: document.title,
      });
    } catch (e) {
      // 如果 runtime 不可用,打开侧边栏页面
      window.open(chrome.runtime.getURL("sidepanel.html"), "_blank");
    }
  }

  // ─── 初始化 ───────────────────────────────
  // 只在养老相关网站或政府网站显示浮动按钮
  if (isAgingRelated) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", createFloatingButton);
    } else {
      createFloatingButton();
    }
  }
})();
