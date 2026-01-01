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
    // 未登录状态
    // 检查当前页面是否在 articles 目录下（通过路径判断）
    const isArticlePage = window.location.pathname.includes("/articles/");
    const loginPath = isArticlePage ? "../login.html" : "login.html";

    const loginHtml = `
            <li class="nav-item" id="user-status-item">
                <a class="nav-link py-2 px-3" href="${loginPath}">登录/注册</a>
            </li>
        `;
    navbarNav.insertAdjacentHTML("beforeend", loginHtml);
  }
}

function logout() {
  if (confirm("确定要退出江湖吗？")) {
    localStorage.removeItem("is_logged_in");
    localStorage.removeItem("user_nickname");
    updateUserStatus();

    // 检查当前页面是否在 articles 目录下
    const isArticlePage = window.location.pathname.includes("/articles/");
    const loginPath = isArticlePage ? "../login.html" : "login.html";

    window.location.href = loginPath;
  }
}
