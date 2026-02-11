document.addEventListener("DOMContentLoaded", () => {

  /* ==========================================================
     🔁 RESET GLOBAL
  ========================================================== */
  document.addEventListener("click", e => {
    const btn = e.target.closest("#resetButton");
    if (!btn) return;

    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Réinitialiser toute la progression ?")) return;

    localStorage.clear();
    sessionStorage.clear();
    location.reload();
  });

  /* ==========================================================
     🌌 BACKGROUND JOUR / NUIT
  ========================================================== */

  const background = document.getElementById("background");
  const timeToggle = document.getElementById("timeToggle");
  const timeDropdown = document.getElementById("timeDropdown");

  const DAY_BG = "images/Fondmenu.PNG";
  const NIGHT_BG = "images/Fondmenusoir.PNG";

  function applyAutoBackground(){
    const hour = new Date().getHours();
    const isNight = hour >= 19 || hour < 7;
    setBackground(isNight ? "night" : "day", false);
  }

  function setBackground(mode, save = true){
    if (!background) return;

    background.style.backgroundImage =
      `url("${mode === "night" ? NIGHT_BG : DAY_BG}")`;

    if(save){
      localStorage.setItem("menu_background", mode);
    }
  }

  const savedMode = localStorage.getItem("menu_background");
  if(savedMode){
    setBackground(savedMode, false);
  }else{
    applyAutoBackground();
  }

  if (timeToggle && timeDropdown) {

    timeToggle.onclick = e => {
      e.stopPropagation();
      timeDropdown.style.display =
        timeDropdown.style.display === "block" ? "none" : "block";
    };

    timeDropdown.querySelectorAll("button").forEach(btn => {
      btn.onclick = () => {
        setBackground(btn.dataset.mode);
        timeDropdown.style.display = "none";
      };
    });

    document.addEventListener("click", () => {
      timeDropdown.style.display = "none";
    });
  }

  /* ==========================================================
     🏴‍☠️ RÉFÉRENCES
  ========================================================== */

  const pirates = ["pirate1","pirate2","pirate3","pirate4","pirate5"]
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const pirate1 = document.getElementById("pirate1");
  const pirate2 = document.getElementById("pirate2");

  const notification = document.getElementById("notification");
  const bubble = document.getElementById("bubble");
  const bubbleButton = document.getElementById("bubbleButton");

  /* ==========================================================
     🔒 VERROUILLAGE PAR DÉFAUT
  ========================================================== */

  pirates.forEach(p => {
    p.classList.add("locked");
    p.classList.remove("unlocked","glow");
    p.style.pointerEvents = "none";
  });

  /* ==========================================================
     🔓 PIRATE 2 TOUJOURS ACCESSIBLE
  ========================================================== */

  if (pirate2) {
    pirate2.classList.remove("locked");
    pirate2.classList.add("unlocked");
    pirate2.style.pointerEvents = "auto";
  }

  /* ==========================================================
     🔄 TRANSFERT SESSION → LOCAL
  ========================================================== */

  let newUnlock = false;

  ["pirate1","pirate3","pirate4","pirate5"].forEach(id => {
    if (sessionStorage.getItem(`unlock_${id}`) === "true") {

      if (localStorage.getItem(`${id}_unlocked`) !== "true") {
        newUnlock = true;
      }

      localStorage.setItem(`${id}_unlocked`, "true");
      sessionStorage.removeItem(`unlock_${id}`);
    }
  });

  /* ==========================================================
     🔓 RÉACTIVATION PIRATES DÉBLOQUÉS
  ========================================================== */

  pirates.forEach(p => {
    if (localStorage.getItem(`${p.id}_unlocked`) === "true") {
      p.classList.remove("locked");
      p.classList.add("unlocked","glow");
      p.style.pointerEvents = "auto";
    }
  });

  if (newUnlock) {
    showNotification("🏆 Bravo, tu as débloqué un nouveau pirate !");
  }

  /* ==========================================================
     💬 BULLE
  ========================================================== */

  if (bubbleButton) {
    bubbleButton.onclick = () => bubble.style.display = "none";
  }

  /* ==========================================================
     🧭 NAVIGATION
  ========================================================== */

  const navMap = {
    pirate1: "commerce.html",
    pirate3: "communication.html",
    pirate4: "legal.html",
    pirate5: "finance.html"
  };

  pirates.forEach(p => {
    const target = navMap[p.id];
    if (!target) return;
    p.addEventListener("click", () => location.href = target);
  });

  /* ==========================================================
     🔐 SAS MOT DE PASSE (RETOUR COMMERCE)
  ========================================================== */

  const fromCommerce = sessionStorage.getItem("fromCommerce") === "true";
  const passwordCleared = sessionStorage.getItem("passwordCleared") === "true";

  if (fromCommerce && !passwordCleared) {

    sessionStorage.removeItem("fromCommerce"); // évite boucle infinie

    showNotification("🔐 Accès verrouillé");

    setTimeout(() => {
      showPasswordOverlay();
    }, 500);
  }

  /* ==========================================================
     🔐 OVERLAY MOT DE PASSE
  ========================================================== */

  function showPasswordOverlay() {

    if (document.getElementById("passwordOverlay")) return;

    const overlay = document.createElement("div");
    overlay.id = "passwordOverlay";

    overlay.innerHTML = `
      <div class="passwordBox">
        <h2>🔐 Accès verrouillé</h2>
        <p>Entre le mot de passe pour continuer</p>

        <input id="passwordInput" type="password" />
        <button id="passwordBtn">Valider</button>

        <div id="passwordError" style="display:none;">
          Mot de passe incorrect
        </div>

        <div class="pirate-actions">
          <button id="legalBtn" class="pirate-btn left">
            📜 Mentions légales
          </button>

          <button id="payBtn" class="pirate-btn right">
            💰 Version complète
          </button>
        </div>
      </div>

      <div id="legalModal" class="legal-modal" style="display:none;">
        <div class="legal-content">
          <span id="closeLegal" class="close-legal">✖</span>
          <h2>Mentions légales & CGV</h2>
          <div class="legal-scroll">
            <p>Contenu légal ici...</p>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const input = overlay.querySelector("#passwordInput");
    const btn = overlay.querySelector("#passwordBtn");
    const error = overlay.querySelector("#passwordError");
    const legalBtn = overlay.querySelector("#legalBtn");
    const payBtn = overlay.querySelector("#payBtn");
    const legalModal = overlay.querySelector("#legalModal");
    const closeLegal = overlay.querySelector("#closeLegal");

    document.body.style.pointerEvents = "none";
    overlay.style.pointerEvents = "auto";

    setTimeout(() => input.focus(), 150);

    btn.onclick = validate;
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") validate();
    });

    function validate() {

      if (input.value.trim().toLowerCase() === "mashain") {

        sessionStorage.setItem("passwordCleared", "true");
        document.body.style.pointerEvents = "auto";
        overlay.remove();
        return;
      }

      error.style.display = "block";
      input.value = "";
      setTimeout(() => input.focus(), 100);
    }

    legalBtn.onclick = () => legalModal.style.display = "flex";
    closeLegal.onclick = () => legalModal.style.display = "none";

    payBtn.onclick = () => {
      window.location.href = "https://www.paypal.com/paypalme/TONLIEN";
    };
  }

  /* ==========================================================
     🔔 NOTIFICATION
  ========================================================== */

  function showNotification(text) {
    if (!notification) return;
    notification.textContent = text;
    notification.classList.add("show");
    setTimeout(() => notification.classList.remove("show"), 3000);
  }

});
