// ═══════════════════════════════════════════════
// 衍策银龄 AI — Popup 逻辑
// ═══════════════════════════════════════════════

(function () {
  "use strict";

  // ─── DOM 元素 ───────────────────────────────
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const openSidepanel = document.getElementById("openSidepanel");
  const openDashboard = document.getElementById("openDashboard");
  const quickMatch = document.getElementById("quickMatch");
  const dashboardLink = document.getElementById("dashboardLink");

  // ─── 搜索政策 ───────────────────────────────
  function doSearch() {
    const keyword = searchInput.value.trim();
    if (!keyword) return;

    // 将搜索关键词发送到侧边栏
    chrome.storage.local.set({ searchKeyword: keyword }, () => {
      // 打开侧边栏
      openSidepanelPanel();
    });
  }

  searchBtn.addEventListener("click", doSearch);
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") doSearch();
  });

  // ─── 打开侧边栏 ───────────────────────────────
  function openSidepanelPanel() {
    if (chrome.sidePanel) {
      chrome.sidePanel.open({ windowId: chrome.windows.WINDOW_ID_CURRENT });
    } else {
      // 降级: 在新标签页打开侧边栏页面
      chrome.tabs.create({ url: chrome.runtime.getURL("sidepanel.html") });
    }
  }

  openSidepanel.addEventListener("click", (e) => {
    e.preventDefault();
    openSidepanelPanel();
  });

  // ─── 打开管理后台 ───────────────────────────────
  openDashboard.addEventListener("click", (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: "http://localhost:3000" });
  });

  dashboardLink.addEventListener("click", (e) => {
    // 默认行为即可(在新标签页打开)
  });

  // ─── 快速补贴匹配 ───────────────────────────────
  quickMatch.addEventListener("click", (e) => {
    e.preventDefault();
    // 保存标记,侧边栏打开后自动切换到补贴匹配
    chrome.storage.local.set({ autoAction: "subsidy_match" }, () => {
      openSidepanelPanel();
    });
  });

  // ─── 加载上次搜索词 ───────────────────────────────
  chrome.storage.local.get(["searchKeyword"], (result) => {
    if (result.searchKeyword) {
      searchInput.value = result.searchKeyword;
    }
  });
})();
