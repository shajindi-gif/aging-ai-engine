// ═══════════════════════════════════════════════
// 衍策银龄 AI — 侧边栏逻辑
// ═══════════════════════════════════════════════

(function () {
  "use strict";

  // ─── 模拟数据(内联,无需构建步骤) ───────────────────────────────
  var mockPolicies = [
    { id: "pol-001", title: "北京市高龄老年人养老服务补贴", category: "subsidy", province: "北京", summary: "对80周岁及以上老年人发放每月500元养老服务补贴。", tags: ["高龄补贴", "养老服务"] },
    { id: "pol-002", title: "上海市长期护理保险试点办法", category: "insurance", province: "上海", summary: "为失能老年人提供基本生活照料和医疗护理服务保障。", tags: ["长护险", "失能照护"] },
    { id: "pol-003", title: "广东省经济困难失能老年人护理补贴", category: "subsidy", province: "广东", summary: "对经济困难的失能老年人发放护理补贴,每月200-600元。", tags: ["失能补贴", "经济困难"] },
    { id: "pol-004", title: "全国老年人意外伤害保险", category: "insurance", province: "全国", summary: "为60周岁以上老年人提供意外伤害保障。", tags: ["意外险", "全国统一"] },
    { id: "pol-005", title: "浙江省居家养老服务条例配套补贴", category: "service", province: "浙江", summary: "为居家老年人提供助餐、助浴、助洁等上门服务补贴。", tags: ["居家养老", "上门服务"] },
    { id: "pol-006", title: "江苏省适老化改造补贴计划", category: "housing", province: "江苏", summary: "为老年人家庭提供适老化改造补贴,最高3万元。", tags: ["适老化改造", "住房"] },
  ];

  var mockSubsidyResults = [
    { title: "高龄老年人养老服务补贴", matchScore: 92, amount: "每月500元", path: "社区居委会申请 → 街道审核 → 区民政局审批" },
    { title: "全国老年人意外伤害保险", matchScore: 95, amount: "意外赔付最高5万元", path: "社区统一登记" },
    { title: "长期护理保险", matchScore: 78, amount: "每周3-7小时居家照护", path: "社区受理中心申请 → 失能评估" },
  ];

  // ─── 标签切换 ───────────────────────────────
  var tabs = document.querySelectorAll(".sp-tab");
  var panels = document.querySelectorAll(".sp-panel");

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var target = tab.getAttribute("data-tab");
      tabs.forEach(function (t) { t.classList.remove("active"); });
      panels.forEach(function (p) { p.classList.remove("active"); });
      tab.classList.add("active");
      document.getElementById("panel-" + target).classList.add("active");
    });
  });

  // ─── 政策搜索 ───────────────────────────────
  var policySearchInput = document.getElementById("policySearch");
  var policySearchBtn = document.getElementById("policySearchBtn");
  var policyResults = document.getElementById("policyResults");

  function searchPolicies() {
    var keyword = policySearchInput.value.trim().toLowerCase();
    if (!keyword) {
      policyResults.innerHTML = '<div class="sp-empty">输入关键词搜索养老政策</div>';
      return;
    }

    var results = mockPolicies.filter(function (p) {
      return p.title.toLowerCase().includes(keyword) ||
        p.summary.toLowerCase().includes(keyword) ||
        p.tags.some(function (t) { return t.includes(keyword); }) ||
        p.province.includes(keyword);
    });

    if (results.length === 0) {
      policyResults.innerHTML = '<div class="sp-empty">未找到相关政策,请尝试其他关键词</div>';
      return;
    }

    var categoryLabels = { subsidy: "补贴", insurance: "保险", service: "服务", housing: "住房" };

    policyResults.innerHTML = results.map(function (p) {
      return '<div class="sp-result">' +
        '<h3>' + p.title + '</h3>' +
        '<span class="sp-tag">' + (categoryLabels[p.category] || p.category) + '</span>' +
        '<span class="sp-tag">' + p.province + '</span>' +
        '<p>' + p.summary + '</p>' +
        '</div>';
    }).join("");
  }

  policySearchBtn.addEventListener("click", searchPolicies);
  policySearchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") searchPolicies();
  });

  // ─── 补贴匹配 ───────────────────────────────
  var matchBtn = document.getElementById("matchBtn");
  var matchResults = document.getElementById("matchResults");

  matchBtn.addEventListener("click", function () {
    var age = document.getElementById("matchAge").value;
    var city = document.getElementById("matchCity").value.trim();

    if (!age || !city) {
      matchResults.innerHTML = '<div class="sp-empty">请填写年龄和城市</div>';
      return;
    }

    // 模拟匹配(过滤出适用的补贴)
    var results = mockSubsidyResults.filter(function (r) {
      if (r.title.includes("高龄") && parseInt(age) < 80) return false;
      if (r.title.includes("意外") && parseInt(age) < 60) return false;
      return true;
    });

    if (results.length === 0) {
      matchResults.innerHTML = '<div class="sp-empty">未找到匹配的补贴政策</div>';
      return;
    }

    matchResults.innerHTML = '<p style="font-size: 13px; color: #64748b; margin-bottom: 12px;">' +
      '为 ' + age + '岁' + city + '籍老人匹配到 ' + results.length + ' 项补贴:</p>' +
      results.map(function (r) {
        return '<div class="sp-result">' +
          '<h3>' + r.title + '</h3>' +
          '<div class="sp-match-score">匹配度: ' + r.matchScore + '%</div>' +
          '<p>预估金额: ' + r.amount + '</p>' +
          '<p style="font-size: 12px; color: #6366f1;">申请路径: ' + r.path + '</p>' +
          '</div>';
      }).join("") +
      '<p style="font-size: 11px; color: #94a3b8; margin-top: 8px;">* 结果仅供参考,以当地主管部门审核为准</p>';
  });

  // ─── 从 popup 接收搜索词 ───────────────────────────────
  chrome.storage.local.get(["searchKeyword", "autoAction"], function (result) {
    if (result.searchKeyword) {
      policySearchInput.value = result.searchKeyword;
      searchPolicies();
      chrome.storage.local.remove("searchKeyword");
    }
    if (result.autoAction === "subsidy_match") {
      // 切换到补贴匹配标签
      tabs.forEach(function (t) { t.classList.remove("active"); });
      panels.forEach(function (p) { p.classList.remove("active"); });
      document.querySelector('[data-tab="subsidy"]').classList.add("active");
      document.getElementById("panel-subsidy").classList.add("active");
      chrome.storage.local.remove("autoAction");
    }
  });

  // ─── 接收 content script 消息 ───────────────────────────────
  chrome.runtime.onMessage.addListener(function (msg) {
    if (msg.type === "page_content" && msg.content) {
      // 将页面内容填入搜索框
      policySearchInput.value = msg.content.substring(0, 100);
      searchPolicies();
    }
  });
})();
