// 立即执行函数，用于在页面加载早期初始化主题，避免闪烁
(function () {
  // 定义本地存储中保存主题偏好的键名
  const storageKey = "preferred-theme";
  // 从本地存储中尝试获取已保存的主题
  const savedTheme = localStorage.getItem(storageKey);
  // 获取文档根元素
  const root = document.documentElement;

  // 如果有保存的主题，则直接应用
  if (savedTheme) {
    root.setAttribute("data-theme", savedTheme);
  } else {
    // 如果没有保存的主题，则检测系统的颜色偏好（是否为暗色模式）
    const userPreferredDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    // 根据系统偏好设置主题，暗色则设为'dark'，否则设为'light'
    root.setAttribute("data-theme", userPreferredDark ? "dark" : "light");
  }
})();
