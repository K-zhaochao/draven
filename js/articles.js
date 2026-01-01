// 等待DOM内容完全加载后执行初始化逻辑
document.addEventListener("DOMContentLoaded", function () {
  // 获取页面中所有的分类筛选按钮
  const filterBtns = document.querySelectorAll(".filter-btn");
  // 获取页面中所有的文章列表项
  const allArticleItems = document.querySelectorAll(".article-item");
  // 获取搜索表单元素
  const searchForm = document.getElementById("article-search-form");
  // 获取搜索输入框元素
  const searchInput = document.getElementById("article-search-input");
  // 定义每页显示的文章数量
  const articlesPerPage = 5;
  // 当前显示的页码，默认为第1页
  let currentPage = 1;
  // 当前筛选条件下的总页数
  let currentTotalPages = 0;
  // 当前的搜索关键词，为空表示未处于搜索模式
  let currentSearchKeyword = "";

  /**
   * 初始化函数：从URL参数中解析筛选条件或搜索关键词
   * 用于支持页面刷新后保持筛选状态或分享带参数的链接
   */
  function initFromURL() {
    // 获取URL中的查询参数对象
    const urlParams = new URLSearchParams(window.location.search);
    // 获取 'category' 参数
    const categoryParam = urlParams.get("category");
    // 获取 'search' 参数
    const searchParam = urlParams.get("search");

    if (searchParam) {
      // 如果存在搜索参数，优先进入搜索模式
      currentSearchKeyword = searchParam.trim();
      // 将搜索关键词回填到输入框中
      if (searchInput) searchInput.value = currentSearchKeyword;
      // 清除所有分类按钮的激活状态，因为此时处于搜索模式
      filterBtns.forEach((btn) => btn.classList.remove("active"));
    } else if (categoryParam) {
      // 如果存在分类参数，则激活对应的分类按钮
      let found = false;
      filterBtns.forEach((btn) => {
        // 比较按钮文本与参数值
        if (btn.textContent.trim() === categoryParam) {
          btn.classList.add("active"); // 激活匹配的按钮
          found = true;
        } else {
          btn.classList.remove("active"); // 取消其他按钮的激活状态
        }
      });
      // 如果URL参数中的分类不存在于按钮列表中，默认选中第一个（通常是“全部”）
      if (!found && filterBtns.length > 0) {
        filterBtns[0].classList.add("active");
      }
    } else {
      // 如果没有任何参数，默认选中第一个分类按钮（全部杂谈）
      if (filterBtns.length > 0) {
        filterBtns[0].classList.add("active");
      }
    }
  }

  /**
   * 核心渲染函数：根据当前的筛选条件（分类或搜索）和分页信息，控制文章的显示与隐藏
   * 包含筛选逻辑、分页计算和DOM更新
   */
  function renderArticles() {
    // 用于存储当前符合条件的文章元素数组
    let visibleArticles = [];

    // 判断当前是搜索模式还是分类模式
    if (currentSearchKeyword) {
      // --- 搜索模式逻辑 ---
      const keyword = currentSearchKeyword.toLowerCase(); // 转换为小写以实现不区分大小写搜索
      allArticleItems.forEach((item) => {
        // 获取文章标题文本
        const title = item
          .querySelector(".article-item-title")
          .textContent.toLowerCase();
        // 获取文章摘要文本
        const excerpt = item
          .querySelector(".article-item-excerpt")
          .textContent.toLowerCase();
        // 执行简单的包含匹配搜索
        if (title.includes(keyword) || excerpt.includes(keyword)) {
          visibleArticles.push(item); // 匹配成功，加入显示列表
        }
      });
    } else {
      // --- 分类模式逻辑 ---
      // 获取当前激活的分类按钮
      const activeFilter = document.querySelector(".filter-btn.active");
      // 获取选中的分类名称，如果没有激活按钮则默认为"全部杂谈"
      const selectedCategory = activeFilter
        ? activeFilter.textContent.trim()
        : "全部杂谈";

      allArticleItems.forEach((item) => {
        // 获取文章元素上绑定的分类属性
        const articleCategory = item.getAttribute("data-category");
        // 如果选中"全部杂谈"或文章分类与选中分类一致
        if (
          selectedCategory === "全部杂谈" ||
          articleCategory === selectedCategory
        ) {
          visibleArticles.push(item); // 加入显示列表
        }
      });
    }

    // 计算总页数：向上取整(符合条件的文章数 / 每页显示数)
    const totalPages = Math.ceil(visibleArticles.length / articlesPerPage);

    // 边界检查：确保当前页码不超过总页数
    if (currentPage > totalPages) {
      // 如果总页数大于0，则重置为最后一页，否则重置为第1页
      currentPage = totalPages > 0 ? totalPages : 1;
    }

    // 计算当前页应该显示的文章在 visibleArticles 数组中的起止索引
    const startIndex = (currentPage - 1) * articlesPerPage;
    const endIndex = currentPage * articlesPerPage;

    // 获取当前页实际需要显示的文章集合（切片操作）
    const articlesToShow = new Set(visibleArticles.slice(startIndex, endIndex));

    // 优化 DOM 操作：一次遍历所有文章项，设置其显示/隐藏状态
    allArticleItems.forEach((item) => {
      if (articlesToShow.has(item)) {
        item.style.display = "flex"; // 显示文章（使用flex布局）
      } else {
        item.style.display = "none"; // 隐藏文章
      }
    });

    // 更新分页器UI状态
    updatePagination(totalPages);

    // 更新全局变量 currentTotalPages，供翻页按钮事件使用
    currentTotalPages = totalPages;
  }

  /**
   * 更新分页器UI函数
   * @param {number} totalPages - 当前筛选结果的总页数
   */
  function updatePagination(totalPages) {
    // 获取分页器容器
    const paginationContainer = document.querySelector(".pagination");
    // 如果页面没有分页器，直接返回
    if (!paginationContainer) return;

    // 获取上一页按钮
    const prevBtn = paginationContainer.querySelector(".page-item:first-child");
    // 获取下一页按钮
    const nextBtn = paginationContainer.querySelector(".page-item:last-child");
    // 获取所有数字页码按钮（排除首尾的上一页/下一页）
    const pageNumberItems = paginationContainer.querySelectorAll(
      ".page-item:not(:first-child):not(:last-child)"
    );

    // 更新上一页按钮状态：如果是第1页，则禁用
    if (prevBtn) prevBtn.classList.toggle("disabled", currentPage === 1);
    // 更新下一页按钮状态：如果是最后一页或没有数据，则禁用
    if (nextBtn)
      nextBtn.classList.toggle(
        "disabled",
        currentPage >= totalPages || totalPages === 0
      );

    // 更新数字页码按钮的显示和激活状态
    pageNumberItems.forEach((item, index) => {
      const pageNum = index + 1; // 索引从0开始，页码从1开始
      if (pageNum <= totalPages) {
        // 如果页码在总页数范围内，显示该按钮
        item.style.display = "list-item";
        // 如果是当前页，添加 active 类
        item.classList.toggle("active", pageNum === currentPage);
        // 更新按钮内的数字文本（虽然通常是静态的，但这里确保一致）
        const link = item.querySelector(".page-link");
        if (link) {
          link.textContent = pageNum;
        }
      } else {
        // 超出总页数的按钮隐藏
        item.style.display = "none";
      }
    });
  }

  // 3. 绑定事件监听器

  // 监听搜索表单提交事件
  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault(); // 阻止表单默认提交行为（防止页面刷新）
      const val = searchInput.value.trim(); // 获取输入值并去除首尾空格
      currentSearchKeyword = val; // 更新全局搜索关键词

      // 搜索时清除分类按钮的选中状态，避免逻辑冲突
      filterBtns.forEach((btn) => btn.classList.remove("active"));

      currentPage = 1; // 重置为第1页
      renderArticles(); // 重新渲染文章列表

      // 更新 URL 参数，方便用户分享当前搜索结果
      const url = new URL(window.location);
      if (val) {
        url.searchParams.set("search", val); // 设置 search 参数
      } else {
        url.searchParams.delete("search"); // 如果为空则删除参数
      }
      url.searchParams.delete("category"); // 搜索模式下移除 category 参数
      window.history.pushState({}, "", url); // 修改浏览器地址栏而不刷新页面
    });
  }

  // 为每个分类筛选按钮添加点击事件
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // 移除所有按钮的激活状态
      filterBtns.forEach((b) => b.classList.remove("active"));
      // 激活当前点击的按钮
      this.classList.add("active");

      // 切换分类时清除搜索状态
      currentSearchKeyword = "";
      if (searchInput) searchInput.value = "";

      currentPage = 1; // 重置为第1页
      renderArticles(); // 重新渲染文章列表

      // 更新 URL 参数
      const url = new URL(window.location);
      url.searchParams.set("category", this.textContent.trim()); // 设置 category 参数
      url.searchParams.delete("search"); // 移除 search 参数
      window.history.pushState({}, "", url);
    });
  });

  // 为数字页码按钮添加点击事件
  document
    .querySelectorAll(
      ".pagination .page-item:not(:first-child):not(:last-child)"
    )
    .forEach((pageItem, index) => {
      pageItem.addEventListener("click", function (e) {
        e.preventDefault(); // 阻止链接跳转
        currentPage = index + 1; // 更新当前页码
        renderArticles(); // 重新渲染
      });
    });

  // 为上一页按钮添加点击事件
  const prevBtn = document.querySelector(".pagination .page-item:first-child");
  if (prevBtn) {
    prevBtn.addEventListener("click", function (e) {
      e.preventDefault();
      if (currentPage > 1) {
        currentPage--; // 页码减1
        renderArticles();
      }
    });
  }

  // 为下一页按钮添加点击事件
  const nextBtn = document.querySelector(".pagination .page-item:last-child");
  if (nextBtn) {
    nextBtn.addEventListener("click", function (e) {
      e.preventDefault();
      // 使用 renderArticles 中计算并保存的 currentTotalPages 进行判断
      if (currentPage < currentTotalPages) {
        currentPage++; // 页码加1
        renderArticles();
      }
    });
  }

  // 页面加载完成后，执行初始化和首次渲染
  initFromURL();
  renderArticles();
});
