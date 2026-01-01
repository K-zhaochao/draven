// 等待DOM内容完全加载后执行
document.addEventListener("DOMContentLoaded", function () {
  // 获取所有的筛选按钮元素
  const filterBtns = document.querySelectorAll(".filter-btn");
  // 获取所有的资源卡片元素
  const resourceCards = document.querySelectorAll(".resource-card");

  // 如果没有找到筛选按钮，则退出函数
  if (!filterBtns.length) return;

  // 遍历每个筛选按钮，添加点击事件监听器
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // 移除所有按钮的激活状态样式
      filterBtns.forEach((b) => b.classList.remove("active"));
      // 为当前点击的按钮添加激活状态样式
      this.classList.add("active");

      // 获取当前按钮绑定的分类标识
      const selectedCategory = this.getAttribute("data-category");

      // 遍历所有资源卡片，根据分类进行显示或隐藏
      resourceCards.forEach((card) => {
        // 获取卡片所属的分类标识
        const cardCategory = card.getAttribute("data-category");
        // 如果选中的是"all"或者卡片分类与选中分类一致，则显示卡片
        if (selectedCategory === "all" || cardCategory === selectedCategory) {
          card.style.display = "block"; // 设置显示样式
        } else {
          card.style.display = "none"; // 设置隐藏样式
        }
      });
    });
  });
});
