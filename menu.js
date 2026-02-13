document.addEventListener("DOMContentLoaded", () => {

/* ==========================================================
   🔁 RESET
========================================================== */

const resetButton = document.getElementById("resetButton");

if (resetButton) {
  resetButton.addEventListener("click", () => {
    if (!confirm("Réinitialiser toute la progression ?")) return;
    localStorage.clear();
    sessionStorage.clear();
    location.reload();
  });
}

/* ==========================================================
   🌌 MÉTÉO
========================================================== */

const background = document.getElementById("background");
const timeToggle = document.getElementById("timeToggle");
const timeDropdown = document.getElementById("timeDropdown");

const DAY_BG = "images/Fondmenu.PNG";
const NIGHT_BG = "images/Fondmenusoir.PNG";

function setBackground(mode, save = true) {
  if (!background) return;

  background.style.backgroundImage =
    `url("${mode === "night" ? NIGHT_BG : DAY_BG}")`;

  document.body.classList.toggle("night-mode", mode === "night");

  if (save) localStorage.setItem("menu_background", mode);
}

const savedMode = localStorage.getItem("menu_background");
if (savedMode) {
  setBackground(savedMode, false);
} else {
  const hour = new Date().getHours();
  setBackground(hour >= 19 || hour < 7 ? "night" : "day", false);
}

if (timeToggle && timeDropdown) {

  timeToggle.addEventListener("click", e => {
    e.stopPropagation();
    timeDropdown.style.display =
      timeDropdown.style.display === "block" ? "none" : "block";
  });

  timeDropdown.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      setBackground(btn.dataset.mode);
      timeDropdown.style.display = "none";
    });
  });

  document.addEventListener("click", () => {
    timeDropdown.style.display = "none";
  });
}

/* ==========================================================
   🔔 NOTIFICATION
========================================================== */

const notification = document.getElementById("notification");

function showNotification(text) {
  if (!notification) return;
  notification.textContent = text;
  notification.classList.add("show");
  setTimeout(() => notification.classList.remove("show"), 3000);
}

/* ==========================================================
   🏴‍☠️ PIRATES
========================================================== */

const pirate1 = document.getElementById("pirate1");
const pirate2 = document.getElementById("pirate2");
const pirate3 = document.getElementById("pirate3");
const pirate4 = document.getElementById("pirate4");
const pirate5 = document.getElementById("pirate5");

const pirates = [pirate1, pirate2, pirate3, pirate4, pirate5];

pirates.forEach(p => {
  if (!p) return;
  p.classList.add("locked");
  p.classList.remove("unlocked");
  p.style.pointerEvents = "none";
});

/* Pirate2 actif */
if (pirate2) {
  pirate2.classList.remove("locked");
  pirate2.classList.add("unlocked");
  pirate2.style.pointerEvents = "auto";
}

/* ==========================================================
   💬 BULLE PIRATE2
========================================================== */

const bubble = document.getElementById("bubble");
const bubbleText = document.getElementById("bubbleText");
const bubbleButton = document.getElementById("bubbleButton");


if (bubbleButton) {
  bubbleButton.addEventListener("click", () => {
    bubble.style.display = "none";
  });
}

if (pirate2) {
  pirate2.addEventListener("click", () => {

    if (bubble) {
      bubble.style.display = "block";
      bubble.style.left = "50%";
      bubble.style.top = "50%";
      bubble.style.transform = "translate(-50%, -50%)";
    }

    showNotification("🏴‍☠️ Premier pirate débloqué !");
    unlockPirate(pirate1);
  });
}

/* ==========================================================
   🔓 UNLOCK
========================================================== */

function unlockPirate(p) {
  if (!p) return;
  p.classList.remove("locked");
  p.classList.add("unlocked");
  p.style.pointerEvents = "auto";
}

/* ==========================================================
   🧭 NAVIGATION
========================================================== */

if (pirate1) {
  pirate1.addEventListener("click", () => {
    if (!pirate1.classList.contains("unlocked")) return;
    location.href = "commerce.html";
  });
}

if (pirate3) {
  pirate3.addEventListener("click", () => {
    if (!pirate3.classList.contains("unlocked")) return;
    location.href = "communication.html";
  });
}

if (pirate5) {
  pirate5.addEventListener("click", () => {
    if (!pirate5.classList.contains("unlocked")) return;
    location.href = "finance.html";
  });
}

if (pirate4) {
  pirate4.addEventListener("click", () => {
    if (!pirate4.classList.contains("unlocked")) return;
    location.href = "legal.html";
  });
}

/* ==========================================================
   🔄 RETOURS PAGES
========================================================== */

/* Commerce */
if (sessionStorage.getItem("unlock_pirate3") === "true") {
  sessionStorage.removeItem("unlock_pirate3");
  showNotification("📦 Nouvelle quête débloquée !");
  unlockPirate(pirate3);
  showPasswordOverlay();
}

/* Communication */
if (sessionStorage.getItem("unlock_pirate5") === "true") {
  sessionStorage.removeItem("unlock_pirate5");
  showNotification("💰 Pirate Finance débloqué !");
  unlockPirate(pirate5);
}

/* Finance */
if (sessionStorage.getItem("unlock_pirate4") === "true") {
  sessionStorage.removeItem("unlock_pirate4");
  showNotification("⚖️ Pirate Légal débloqué !");
  unlockPirate(pirate4);
}

/* ==========================================================
   🔐 SAS MOT DE PASSE (RETOUR COMMERCE)
========================================================== */

const fromCommerce = sessionStorage.getItem("fromCommerce") === "true";
const passwordCleared = sessionStorage.getItem("passwordCleared") === "true";

if (fromCommerce && !passwordCleared) {
  sessionStorage.removeItem("fromCommerce");
  showNotification("🔐 Accès verrouillé");
  setTimeout(showPasswordOverlay, 600);
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
      <div id="passwordError">Mot de passe incorrect</div>

      <div class="pirate-actions">
        <button id="legalBtn" class="pirate-btn">
          📜 Mentions légales
        </button>
        <button id="payBtn" class="pirate-btn">
          💰 Version complète
        </button>
      </div>
    </div>

    <div id="legalModal" class="legal-modal">
      <div class="legal-content">
        <span id="closeLegal" class="close-legal">✖</span>
        <h2>Mentions légales & CGV</h2>

        <div class="legal-scroll">
          <h3>Mentions légales</h3>
          <p>
            Éditeur : Ton Nom<br>
            Statut : Micro-entrepreneur<br>
            SIRET : XXXXXXXX<br>
            Email : contact@email.com
          </p>

          <p><strong>Propriété intellectuelle :</strong>
          Tous les contenus sont protégés.</p>

          <p><strong>Responsabilité :</strong>
          Les contenus sont éducatifs.</p>

          <h3>Conditions Générales de Vente</h3>
          <p>Accès personnel et non transférable.</p>
          <p>Paiement sécurisé via PayPal.</p>

          <h3>Politique de remboursement</h3>
          <p>Aucun remboursement possible.</p>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const input = overlay.querySelector("#passwordInput");
  const btn = overlay.querySelector("#passwordBtn");
  const error = overlay.querySelector("#passwordError");

  setTimeout(() => input.focus(), 200);

  btn.addEventListener("click", validate);
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") validate();
  });

  function validate() {
    if (input.value.trim().toLowerCase() === "mashain") {
      sessionStorage.setItem("passwordCleared", "true");
      overlay.remove();
    } else {
      error.style.display = "block";
      input.value = "";
      input.focus();
    }
  }

  overlay.querySelector("#legalBtn").onclick = () => {
    overlay.querySelector("#legalModal").style.display = "flex";
  };

  overlay.querySelector("#closeLegal").onclick = () => {
    overlay.querySelector("#legalModal").style.display = "none";
  };

  overlay.querySelector("#payBtn").onclick = () => {
    window.location.href = "https://www.paypal.com/paypalme/TONLIEN";
  };
}
   
/* ==========================================================
   🎬 COFFRE FINAL — UNIQUEMENT RETOUR LEGAL
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const treasureBtn = document.getElementById("treasureBtn");
  const treasureDropdown = document.getElementById("treasureDropdown");
  const cinematic = document.getElementById("cinematicChest");
  const chestContainer = document.getElementById("chestContainer");
  const chestBase = document.getElementById("chestBase");
  const timeToggle = document.getElementById("timeToggle");

  /* ==========================================================
     🎉 DÉCLENCHEMENT UNIQUEMENT SI RETOUR LEGAL
  ========================================================== */

  if (sessionStorage.getItem("questCompleted") === "true") {

    sessionStorage.removeItem("questCompleted");

    if (!cinematic || !chestContainer || !chestBase) return;

    /* ===============================
       1️⃣ LOADER DE VICTOIRE
    =============================== */

    const loader = document.createElement("div");
    loader.id = "questLoader";

    loader.innerHTML = `
      <div id="questLoaderText">
        🏆 Bravo tu as gagné toute la quête !<br><br>
        🎁 Récupère vite tes cadeaux !
      </div>
    `;

    document.body.appendChild(loader);
    setTimeout(() => loader.classList.add("show"), 50);

    /* ===============================
       2️⃣ APPARITION COFFRE
    =============================== */

    setTimeout(() => {

      loader.classList.remove("show");

      setTimeout(() => {
        loader.remove();

        cinematic.classList.remove("hidden");
        setTimeout(() => cinematic.classList.add("show"), 50);

      }, 600);

    }, 2500);

    /* ===============================
       3️⃣ OUVERTURE COFFRE
    =============================== */

    chestContainer.addEventListener("click", function openChest() {

      chestContainer.removeEventListener("click", openChest);

      /* 🔓 Animation ouverture (changement image) */
      chestBase.src = "images/Tresorouvert.png";
      chestBase.style.transform = "scale(1.05)";

      setTimeout(() => {

        cinematic.classList.remove("show");

        setTimeout(() => {

          cinematic.classList.add("hidden");

          if (timeToggle && treasureBtn) {

            const rect = timeToggle.getBoundingClientRect();

            treasureBtn.style.position = "fixed";
            treasureBtn.style.top = (rect.bottom + 10) + "px";
            treasureBtn.style.left = rect.left + "px";

            treasureBtn.classList.remove("hidden");
          }

        }, 600);

      }, 1000);

    });
  }

  /* ==========================================================
     🎁 DROPDOWN CANVA
  ========================================================== */

  if (treasureBtn && treasureDropdown) {

    treasureBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      treasureDropdown.style.display =
        treasureDropdown.style.display === "block"
          ? "none"
          : "block";
    });

    document.addEventListener("click", () => {
      treasureDropdown.style.display = "none";
    });
  }

});

});
