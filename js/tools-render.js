document.addEventListener("DOMContentLoaded", function () {
  const filterContainer = document.querySelector(".resources-filter");
  const gridContainer = document.querySelector(".resources-grid");
  // const modal = $("#resourceModal"); // 已移除 Bootstrap Modal 依赖

  // 1. 渲染分类按钮
  function renderCategories() {
    filterContainer.innerHTML = toolsData.categories
      .map(
        (cat, index) => `
            <button class="filter-btn ${
              index === 0 ? "active" : ""
            }" data-category="${cat.id}">
                ${cat.name}
            </button>
        `
      )
      .join("");

    // 重新绑定点击事件
    bindFilterEvents();
  }

  // 2. 渲染资源卡片
  function renderResources(category = "all") {
    const filteredResources =
      category === "all"
        ? toolsData.resources
        : toolsData.resources.filter((r) => r.category === category);

    gridContainer.innerHTML = filteredResources
      .map(
        (resource) => `
            <div class="resource-card" data-id="${
              resource.id
            }" data-category="${resource.category}">
                <div class="card-icon-wrapper">
                    <i class="${
                      resource.iconClass
                    }" style="font-size: 4rem;"></i>
                </div>
                <div class="card-content">
                    <h3 class="card-title">${resource.title}</h3>
                    <div class="card-tags">
                        ${resource.tags
                          .slice(0, 2)
                          .map((tag) => `<span class="card-tag">${tag}</span>`)
                          .join("")}
                    </div>
                </div>
                <div class="card-hover-overlay">
                    <button class="overlay-btn">点击查看详情</button>
                </div>
            </div>
        `
      )
      .join("");

    // 绑定卡片点击事件
    bindCardEvents();
  }

  // 3. 绑定筛选按钮事件
  function bindFilterEvents() {
    const btns = document.querySelectorAll(".filter-btn");
    btns.forEach((btn) => {
      btn.addEventListener("click", function () {
        btns.forEach((b) => b.classList.remove("active"));
        this.classList.add("active");
        const category = this.getAttribute("data-category");

        // 添加淡出动画
        gridContainer.style.opacity = "0";
        setTimeout(() => {
          renderResources(category);
          gridContainer.style.opacity = "1";
        }, 300);
      });
    });
  }

  // 4. 绑定卡片点击事件（弹出自定义Modal）
  function bindCardEvents() {
    const cards = document.querySelectorAll(".resource-card");
    cards.forEach((card) => {
      card.addEventListener("click", function () {
        const id = this.getAttribute("data-id");
        const data = toolsData.resources.find((r) => r.id === id);
        if (data) {
          showCustomModal(data);
        }
      });
    });
  }

  // --- 自定义模态框逻辑 (解决页面抖动问题) ---

  let customModal = null;

  function getOrCreateModal() {
    if (customModal) return customModal;

    // 创建模态框 DOM
    const modalHtml = `
            <div class="custom-modal-overlay" id="customResourceModal">
                <div class="custom-modal-container">
                    <div class="modal-header border-0">
                        <h5 class="modal-title" style="font-family: 'FZJZXS', serif; font-size: 1.5rem; color: var(--color-cyan-gray);"></h5>
                        <button type="button" class="close-custom-modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body text-center">
                        <div class="resource-icon-large mb-4">
                            <!-- Icon injected here -->
                        </div>
                        <div class="modal-body-content text-left px-4">
                            <!-- Content injected here -->
                        </div>
                    </div>
                    <div class="modal-footer border-0 justify-content-center pb-4">
                        <a href="#" id="custom-modal-link-btn" class="btn btn-primary btn-lg px-5" target="_blank">
                            <i class="fas fa-external-link-alt mr-2"></i>前往获取
                        </a>
                    </div>
                </div>
            </div>
        `;

    document.body.insertAdjacentHTML("beforeend", modalHtml);
    customModal = document.getElementById("customResourceModal");

    // 绑定关闭事件
    const closeBtn = customModal.querySelector(".close-custom-modal");
    closeBtn.addEventListener("click", closeCustomModal);

    // 点击遮罩层关闭
    customModal.addEventListener("click", function (e) {
      if (e.target === customModal) {
        closeCustomModal();
      }
    });

    // ESC键关闭
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && customModal.classList.contains("active")) {
        closeCustomModal();
      }
    });

    return customModal;
  }

  function showCustomModal(data) {
    const modal = getOrCreateModal();

    // 填充数据
    modal.querySelector(".modal-title").textContent = data.title;
    modal.querySelector(
      ".resource-icon-large"
    ).innerHTML = `<i class="${data.iconClass}" style="color: var(--color-cyan-gray);"></i>`;

    const contentHtml = `
            <p class="modal-desc" style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 20px;">${
              data.desc
            }</p>
            
            <div class="modal-tags" style="margin-bottom: 25px;">
                ${data.tags
                  .map((tag) => `<span class="modal-tag">${tag}</span>`)
                  .join("")}
                <span class="modal-tag" style="background-color: var(--color-cyan-gray); color: white; border-color: var(--color-cyan-gray);">${
                  data.level || "实用"
                }</span>
            </div>

            <div class="recommend-section">
                <div class="recommend-title"><i class="fas fa-thumbs-up"></i> 推荐理由</div>
                <p class="recommend-text">${
                  data.recommendReason || "暂无推荐理由"
                }</p>
            </div>
        `;

    modal.querySelector(".modal-body-content").innerHTML = contentHtml;
    modal.querySelector("#custom-modal-link-btn").href = data.link;

    // 显示模态框 (先 display: block, 再 opacity: 1 以触发动画)
    modal.classList.add("active");
    // 强制重绘
    void modal.offsetWidth;
    modal.classList.add("visible");

    // 注意：这里故意不锁定 body 的 scroll，以防止页面抖动
  }

  function closeCustomModal() {
    if (!customModal) return;

    customModal.classList.remove("visible");

    // 等待动画结束后隐藏
    setTimeout(() => {
      customModal.classList.remove("active");
    }, 300);
  }

  // 初始化
  renderCategories();
  renderResources();
});
