$(document).ready(function () {
  const chatMessages = $("#chatMessages");
  const userInput = $("#userInput");
  const sendBtn = $("#sendBtn");

  // 自动滚动到底部
  function scrollToBottom() {
    chatMessages.scrollTop(chatMessages[0].scrollHeight);
  }

  // 添加消息到界面
  function addMessage(content, isUser) {
    const messageClass = isUser ? "user-message" : "bot-message";
    // 简单的换行处理
    const formattedContent = content.replace(/\n/g, "<br>");

    const messageHtml = `
            <div class="message ${messageClass}">
                <div class="message-content">
                    ${formattedContent}
                </div>
            </div>
        `;
    chatMessages.append(messageHtml);
    scrollToBottom();
  }

  // 尝试动态加载 Puter.js
  function loadPuter() {
    return new Promise((resolve, reject) => {
      if (typeof puter !== "undefined") return resolve();

      const script = document.createElement("script");
      script.src = "https://js.puter.com/v2/";
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error("无法加载 Puter.js，请检查网络连接"));
      document.head.appendChild(script);
    });
  }

  // 处理发送逻辑
  async function handleSend() {
    const text = userInput.val().trim();
    if (!text) return;

    // 1. 显示用户消息
    addMessage(text, true);
    userInput.val("");

    // 禁用按钮，防止重复发送
    sendBtn.prop("disabled", true);

    // 2. 显示加载状态
    const loadingId = "loading-" + Date.now();
    const loadingHtml = `
            <div class="message bot-message" id="${loadingId}">
                <div class="message-content">
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    贫道正在掐指一算...
                </div>
            </div>
        `;
    chatMessages.append(loadingHtml);
    scrollToBottom();

    try {
      // 确保 Puter.js 已加载
      if (typeof puter === "undefined") {
        await loadPuter();
      }

      // 检查是否已登录，如果未登录，先提示用户
      if (!puter.auth.isSignedIn()) {
        $("#" + loadingId).remove(); // 先移除加载动画，换成提示
        addMessage(
          "施主初次造访，需先进行【天道认证】（登录 Puter 账号）方可沟通天地。请在弹出的窗口中完成登录，随后贫道即可为你解惑。",
          false
        );

        // 重新显示加载动画，因为 signIn 是异步的
        chatMessages.append(loadingHtml);
        scrollToBottom();

        await puter.auth.signIn();
      }

      // 3. 调用 Puter.js AI
      const response = await puter.ai.chat(text);

      // 移除加载提示
      $("#" + loadingId).remove();

      // 解析回复内容
      let aiText = "";
      if (typeof response === "string") {
        aiText = response;
      } else if (response && response.message && response.message.content) {
        aiText = response.message.content;
      } else {
        aiText = JSON.stringify(response);
      }

      // 简单的换行处理
      aiText = aiText.replace(/\n/g, "<br>");

      addMessage(aiText, false);
    } catch (error) {
      console.error("AI Error:", error);
      $("#" + loadingId).remove();
      addMessage(
        "贫道今日法力不足，无法连接天道（" + error.message + "）。",
        false
      );
    } finally {
      // 恢复按钮状态
      sendBtn.prop("disabled", false);
      userInput.focus();
    }
  }

  // 绑定事件
  sendBtn.click(handleSend);

  userInput.keypress(function (e) {
    if (e.which == 13 && !e.shiftKey) {
      // Enter发送，Shift+Enter换行
      e.preventDefault();
      handleSend();
    }
  });
});
