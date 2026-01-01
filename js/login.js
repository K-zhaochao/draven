$(document).ready(function () {
  // 切换到注册表单
  $("#to-register").click(function (e) {
    e.preventDefault();
    $("#login-form-container").fadeOut(300, function () {
      $("#register-form-container").fadeIn(300);
      $(".login-title").text("注册");
    });
  });

  // 切换到登录表单
  $("#to-login").click(function (e) {
    e.preventDefault();
    $("#register-form-container").fadeOut(300, function () {
      $("#login-form-container").fadeIn(300);
      $(".login-title").text("登录");
    });
  });

  // 登录表单提交
  $("#login-form").submit(function (e) {
    e.preventDefault();

    const username = $("#login-username").val();
    const password = $("#login-password").val();

    if (username && password) {
      // 发送 AJAX 请求
      $.ajax({
        type: "post",
        url: "http://127.0.0.1:8080/user/login",
        contentType: "application/json",
        data: JSON.stringify({
          nickName: username,
          password: password,
        }),
        success: function (result) {
          // 假设后端返回 "ok" 或其他成功标识
          if (result == "ok" || result.code === 200 || result === true) {
            // 存储用户信息到 localStorage
            localStorage.setItem("user_nickname", username);
            localStorage.setItem("is_logged_in", "true");

            alert("登录成功！即将进入江湖...");
            window.location.href = "index.html";
          } else {
            alert("登录失败，请检查用户名和密码是否正确");
          }
        },
        error: function (xhr, status, error) {
          console.error("登录错误:", error);
          alert("登录请求失败，请检查网络或联系管理员");
        },
      });
    } else {
      alert("请输入用户名和密码");
    }
  });

  // 注册表单提交
  $("#register-form").submit(function (e) {
    e.preventDefault();
    const username = $("#reg-username").val();
    const password = $("#reg-password").val();
    const confirmPassword = $("#reg-password-confirm").val();

    // 简单验证
    if (password !== confirmPassword) {
      $("#password-error").show().text("两次输入的密码不一致");
      return;
    } else {
      $("#password-error").hide();
    }

    if (username && password) {
      // 发送注册 AJAX 请求
      $.ajax({
        type: "post",
        url: "http://127.0.0.1:8080/user/register",
        contentType: "application/json",
        data: JSON.stringify({
          nickName: username,
          password: password,
        }),
        success: function (result) {
          if (result == "ok") {
            alert("注册成功！请登录。");
            // 切换回登录页
            $("#to-login").click();
          } else if (result == "exists") {
            alert("用户名已存在，请换一个试试。");
          } else {
            alert("注册失败，请稍后再试。");
          }
        },
        error: function (xhr, status, error) {
          console.error("注册错误:", error);
          alert("注册请求失败，请检查网络或联系管理员");
        },
      });
    } else {
      alert("请填写完整信息");
    }
  });

  // 监听密码输入，实时清除错误提示
  $("#reg-password, #reg-password-confirm").on("input", function () {
    $("#password-error").hide();
  });
});
