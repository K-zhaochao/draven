// 等待DOM内容完全加载后执行初始化
document.addEventListener("DOMContentLoaded", function () {
  // 获取页面中所有的主题切换按钮
  const toggleButtons = document.querySelectorAll(".theme-toggle-btn");
  // 如果页面中不存在切换按钮，则直接返回，不执行后续逻辑
  if (!toggleButtons.length) {
    return;
  }

  // 获取文档根元素（<html>标签），用于设置data-theme属性
  const root = document.documentElement;
  // 定义本地存储中保存主题偏好的键名
  const storageKey = "preferred-theme";
  // 尝试获取系统的主题偏好（是否偏好暗色模式）
  const mediaQuery = window.matchMedia
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null;

  // 从本地存储中获取用户之前保存的主题设置
  const savedTheme = localStorage.getItem(storageKey);
  // 确定初始主题：优先使用保存的主题，其次是HTML标签上的默认主题，最后默认为"light"
  const initialTheme = savedTheme || root.getAttribute("data-theme") || "light";
  // 应用初始主题
  applyTheme(initialTheme);

  // 初始化玄幻背景动画
  initFantasyBackground();

  // 移动端导航栏滚动条优化：打开菜单时隐藏Body滚动条
  // 检查jQuery是否存在 (Bootstrap依赖jQuery)
  if (typeof $ !== "undefined") {
    const $navbarCollapse = $("#navbarNav");
    if ($navbarCollapse.length) {
      // 当导航栏开始展开时
      $navbarCollapse.on("show.bs.collapse", function () {
        // 仅在移动端生效
        if (window.innerWidth < 992) {
          // 锁定页面滚动
          document.documentElement.classList.add("nav-open");
          document.body.classList.add("nav-open");

          // 添加遮罩层点击关闭功能
          if (!$(".nav-backdrop").length) {
            $('<div class="nav-backdrop"></div>')
              .appendTo("body")
              .click(function () {
                $navbarCollapse.collapse("hide");
              });

            // 阻止遮罩层上的滚动事件传播
            $(".nav-backdrop").on("touchmove", function (e) {
              e.preventDefault();
            });
          }
          setTimeout(() => $(".nav-backdrop").addClass("show"), 10);

          // 点击导航链接时自动关闭菜单
          $(".navbar-nav .nav-link").one("click", function () {
            if ($navbarCollapse.hasClass("show")) {
              $navbarCollapse.collapse("hide");
            }
          });
        }
      });

      // 当导航栏完全折叠隐藏后
      $navbarCollapse.on("hidden.bs.collapse", function () {
        // 解锁页面滚动
        document.documentElement.classList.remove("nav-open");
        document.body.classList.remove("nav-open");

        // 移除遮罩层
        $(".nav-backdrop").removeClass("show");
        setTimeout(() => $(".nav-backdrop").remove(), 300);
      });
    }
  }

  // 为每个切换按钮添加点击事件监听器
  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      // 判断当前主题，如果是暗色则切换为亮色，反之亦然
      const nextTheme =
        root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      // 应用新的主题
      applyTheme(nextTheme);
      // 将新的主题设置保存到本地存储中
      localStorage.setItem(storageKey, nextTheme);
    });
  });

  // 监听系统主题变化事件（如果支持）
  if (mediaQuery && mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", (event) => {
      // 只有在用户没有手动设置过主题（本地存储为空）的情况下，才跟随系统主题变化
      if (!localStorage.getItem(storageKey)) {
        applyTheme(event.matches ? "dark" : "light");
      }
    });
  } else if (mediaQuery && mediaQuery.addListener) {
    // 兼容旧版浏览器的监听方式
    mediaQuery.addListener((event) => {
      if (!localStorage.getItem(storageKey)) {
        applyTheme(event.matches ? "dark" : "light");
      }
    });
  }

  /**
   * 应用指定的主题
   * @param {string} theme - 要应用的主题名称 ('light' 或 'dark')
   */
  function applyTheme(theme) {
    // 设置根元素的 data-theme 属性，触发CSS变量切换
    root.setAttribute("data-theme", theme);
    // 更新所有切换按钮的文本和状态
    toggleButtons.forEach((btn) => {
      // 根据主题设置按钮文本图标
      btn.textContent = theme === "dark" ? "☀ 日间" : "🌙 夜间";
      // 更新 aria-pressed 属性，辅助功能支持
      btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    });
  }

  /**
   * 初始化玄幻背景动画
   */
  function initFantasyBackground() {
    // 检查是否已存在背景容器
    if (document.getElementById("fantasy-bg")) return;

    // 创建背景容器
    const bgContainer = document.createElement("div");
    bgContainer.id = "fantasy-bg";
    document.body.prepend(bgContainer);

    const poems = [
      "闲敲棋子落灯花",
      "行到水穷处",
      "坐看云起时",
      "大鹏一日同风起",
      "扶摇直上九万里",
      "我欲乘风归去",
      "道可道，非常道",
      "天地不仁",
      "万物为刍狗",
      "一蓑烟雨任平生",
      "回首向来萧瑟处",
      "也无风雨也无晴",
      "醉后不知天在水",
      "满船清梦压星河",
      "世间无限丹青手",
      "一片冰心在玉壶",
      "曾经沧海难为水",
      "除却巫山不是云",
      "人生得意须尽欢",
      "莫使金樽空对月",
      "天生我材必有用",
      "千金散尽还复来",
      "三十功名尘与土",
      "八千里路云和月",
      "待到秋来九月八",
      "我花开后百花杀",
      "冲天香阵透长安",
      "满城尽带黄金甲",
      "身无彩凤双飞翼",
      "心有灵犀一点通",
      "凡人修仙，逆天而行",
      "仙道茫茫，何处是归途",
      "一念成佛，一念成魔",
    ];

    // 跑道管理系统：防止诗词重叠
    // 将屏幕划分为若干跑道，记录每个跑道最后一次生成的时间
    const isMobile = window.innerWidth < 768;
    const laneCount = isMobile ? 10 : 20; // 移动端10个跑道，PC端20个
    const lanes = new Array(laneCount).fill(0); // 存储时间戳

    // 持续生成诗词
    // 初始生成几个，避免空白
    for (let i = 0; i < 8; i++) {
      setTimeout(
        () => createPoeticText(bgContainer, poems, true, lanes),
        i * 300
      );
    }

    // 定时生成新的诗词
    // 移动端生成频率降低
    const intervalTime = isMobile ? 1500 : 800; // 加快生成频率

    setInterval(() => {
      // 限制屏幕上同时存在的元素数量，防止性能问题
      if (bgContainer.childElementCount < (isMobile ? 15 : 35)) {
        createPoeticText(bgContainer, poems, false, lanes);
      }
    }, intervalTime);
  }

  /**
   * 创建单个诗词元素
   * @param {HTMLElement} container
   * @param {string[]} poems
   * @param {boolean} isInitial 是否为初始化生成（随机位置）
   * @param {number[]} lanes 跑道状态数组
   */
  function createPoeticText(container, poems, isInitial, lanes) {
    // 寻找可用跑道
    const now = Date.now();
    const isMobile = window.innerWidth < 768;
    // 最小间隔时间：防止同一跑道文字重叠
    // 假设文字下落速度慢，需要较长间隔，例如 6000ms
    const minGap = 6000;

    // 找出所有空闲跑道
    const availableLanes = [];
    lanes.forEach((lastTime, index) => {
      if (now - lastTime > minGap) {
        availableLanes.push(index);
      }
    });

    // 如果没有可用跑道，且不是初始化阶段，则放弃本次生成
    if (availableLanes.length === 0 && !isInitial) {
      return;
    }

    // 如果是初始化，或者有可用跑道
    let laneIndex;
    if (isInitial) {
      // 初始化时随机选一个跑道，不更新时间戳（因为是随机分布在屏幕中间，不影响顶部生成）
      laneIndex = Math.floor(Math.random() * lanes.length);
    } else {
      // 随机选择一个可用跑道
      laneIndex =
        availableLanes[Math.floor(Math.random() * availableLanes.length)];
      // 更新该跑道的时间戳
      lanes[laneIndex] = now;
    }

    const textEl = document.createElement("div");
    textEl.className = "poetic-text";

    // 随机选取一句诗
    const poem = poems[Math.floor(Math.random() * poems.length)];
    textEl.textContent = poem;

    // 计算 left 位置：基于跑道索引
    // 跑道宽度 = 100% / laneCount
    // 加了一点随机偏移，避免太死板
    const laneWidth = 100 / lanes.length;
    const baseLeft = laneIndex * laneWidth;
    const randomOffset = Math.random() * (laneWidth * 0.6); // 在跑道内随机偏移
    const left = baseLeft + randomOffset;

    // 初始生成时在屏幕中间随机分布，后续生成从顶部开始
    // top: -20% 保证从屏幕外开始下落
    const top = isInitial ? Math.random() * 80 : -20;

    // 随机大小 (1rem - 2.5rem)，营造远近感
    // 移动端字体稍小
    const minSize = isMobile ? 0.8 : 1.2;
    const maxSize = isMobile ? 1.2 : 2.5;
    const fontSize = Math.random() * (maxSize - minSize) + minSize;

    // 随机动画时长 (20s - 40s)，极慢速下落，营造高级感
    const duration = Math.random() * 20 + 20;

    textEl.style.left = `${left}%`;
    textEl.style.top = `${top}%`;
    textEl.style.fontSize = `${fontSize}rem`;
    textEl.style.animationDuration = `${duration}s`;

    // 动画结束后移除元素，防止DOM无限堆积
    textEl.addEventListener("animationend", () => {
      textEl.remove();
    });

    container.appendChild(textEl);
  }
});
