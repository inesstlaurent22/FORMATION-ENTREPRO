document.addEventListener("DOMContentLoaded", () => {

  const chatbotToggle = document.getElementById("chatbot-toggle");
  const chatbotBox = document.getElementById("chatbot-box");
  const chatbotMessages = document.getElementById("chatbot-messages");
  const chatbotSend = document.getElementById("chatbot-send");
  const chatbotInput = document.getElementById("chatbot-input");

  if (!chatbotToggle || !chatbotBox || !chatbotMessages || !chatbotSend || !chatbotInput) return;

  /* ================= OPEN ================= */

  chatbotToggle.onclick = () => {
    chatbotBox.classList.toggle("active");
    showThemes();
  };

  /* ================= NAV ================= */

  function createTopButton(type = "close") {
    let btn = document.querySelector(".chatbot-back-top");

    if (!btn) {
      btn = document.createElement("div");
      btn.className = "chatbot-back-top";
      chatbotBox.appendChild(btn);
    }

    if (type === "close") {
      btn.textContent = "✕";
      btn.onclick = () => chatbotBox.classList.remove("active");
    } else {
      btn.textContent = "←";
      btn.onclick = showThemes;
    }
  }

  /* ================= THEMES ================= */

  function showThemes() {
    chatbotMessages.innerHTML = "";
    createTopButton("close");

    addMessage("Bonjour 👋 Tu peux poser toutes tes questions. Le professeur est la pour t'aider :", "intro");

    Object.keys(FAQ).forEach(key => {
      chatbotMessages.appendChild(
        createClickable(FAQ[key].title, () => showQuestions(key))
      );
    });
  }

  /* ================= IA ================= */
async function sendToAI(text) {

  // ===== USER =====
  const userDiv = document.createElement("div");
  userDiv.className = "message-user-grey";
  userDiv.textContent = text;

  const userWrapper = document.createElement("div");
  userWrapper.style.display = "flex";
  userWrapper.style.justifyContent = "flex-end";

  userWrapper.appendChild(userDiv);
  chatbotMessages.appendChild(userWrapper);

  // ===== BOT =====
  const botWrapper = document.createElement("div");
  botWrapper.className = "message-bot-wrapper";

  const avatar = document.createElement("img");
  avatar.src = "images/Professeur1.PNG";
  avatar.className = "chatbot-avatar";

  const loading = document.createElement("div");
  loading.className = "message-answer";
  loading.textContent = "...";

  botWrapper.appendChild(avatar);
  botWrapper.appendChild(loading);
  chatbotMessages.appendChild(botWrapper);

  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

  try {

    const res = await fetch("https://eop1ak3sxerl3b3.m.pipedream.net", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();

    const reply =
      data?.reply ||
      data?.body?.reply ||
      data?.data?.reply;

    loading.textContent = reply || "Réponse vide";

  } catch (err) {
    loading.textContent = "Erreur connexion serveur";
  }
}

  /* ================= INPUT ================= */

  chatbotSend.onclick = () => {
    const text = chatbotInput.value.trim();
    if (!text) return;
    chatbotInput.value = "";
    sendToAI(text);
  };

  chatbotInput.onkeydown = (e) => {
    if (e.key === "Enter") {
      const text = chatbotInput.value.trim();
      if (!text) return;
      chatbotInput.value = "";
      sendToAI(text);
    }
  };

  /* ================= HELPERS ================= */

  function addMessage(text, type) {

  const wrapper = document.createElement("div");
  wrapper.className = "message-bot-wrapper";

  // Avatar professeur
  const avatar = document.createElement("img");
  avatar.src = "images/Professeur1.PNG"; // chemin de ton image
  avatar.className = "chatbot-avatar";

  // Message
  const div = document.createElement("div");
  div.className =
    type === "intro" ? "message-intro" :
    type === "section" ? "message-section" :
    "message-bot";

  div.textContent = text;

  wrapper.appendChild(avatar);
  wrapper.appendChild(div);

  chatbotMessages.appendChild(wrapper);
}

  function createClickable(text, action) {
    const div = document.createElement("div");
    div.className = "message-bot";
    div.textContent = text;
    div.onclick = action;
    return div;
  }

});
