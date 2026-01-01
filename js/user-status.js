// 用户状态管理
document.addEventListener("DOMContentLoaded", function () {
  updateUserStatus();
});

function updateUserStatus() {
  const isLoggedIn = localStorage.getItem("is_logged_in") === "true";
  const nickname = localStorage.getItem("user_nickname");
  const navbarNav = document.querySelector(".navbar-nav");

  // 移除已存在的用户状态元素（避免重复添加）
  const existingUserItem = document.getElementById("user-status-item");
  if (existingUserItem) {
    existingUserItem.remove();
  }

  if (isLoggedIn && nickname) {
    // 已登录状态
    const userHtml = `
            <li class="nav-item dropdown" id="user-status-item">
                <a class="nav-link dropdown-toggle py-2 px-3" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span style="color: var(--primary-color);">👤 ${nickname}</span>
                </a>
                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
                    <a class="dropdown-item" href="#" onclick="logout()">退出江湖</a>
                </div>
            </li>
        `;
    navbarNav.insertAdjacentHTML("beforeend", userHtml);
  } else {
    // 未登录状态：不在导航中显示登录/注册或未登录提示（保持导航简洁）
    // 仅确保之前可能存在的用户状态项被移除（上方已有移除逻辑）
  }
}

function logout() {
  if (confirm("确定要退出江湖吗？")) {
    localStorage.removeItem("is_logged_in");
    localStorage.removeItem("user_nickname");
    updateUserStatus();

    // 登录功能已移除，退出后返回首页
    window.location.href = "index.html";
  }
}
