document.addEventListener("DOMContentLoaded", () => {

   console.log("JS chargé");
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

  timeToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    timeDropdown.classList.toggle("show");
  });

  document.addEventListener("click", () => {
    timeDropdown.classList.remove("show");
  });

  timeDropdown.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  timeDropdown.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      setBackground(btn.dataset.mode);
      timeDropdown.classList.remove("show");
    });
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

  if (localStorage.getItem(p.id + "_unlocked") === "true") {
    p.classList.remove("locked");
    p.classList.add("unlocked");
  } else {
    p.classList.add("locked");
    p.classList.remove("unlocked");
  }
});

/* Pirate2 actif */
if (pirate2) {
  pirate2.classList.remove("locked");
  pirate2.classList.add("unlocked");
}

   // 🔁 Restauration pirate1 au chargement
if (localStorage.getItem("pirate1_unlocked") === "true") {
  unlockPirate(pirate1);
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

  localStorage.setItem(p.id + "_unlocked", "true");
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

  const value = input.value.trim().toLowerCase();

  if (value === "mashain") {

    // 🔓 Sauvegarde déblocage permanent
    localStorage.setItem("pirate1_unlocked", "true");
    sessionStorage.setItem("passwordCleared", "true");

    // 🔓 Débloque visuellement pirate1
    const pirate1 = document.getElementById("pirate1");
    if (pirate1) {
      pirate1.classList.remove("locked");
      pirate1.classList.add("unlocked");
      pirate1.style.pointerEvents = "auto";
    }

    // 🔕 Cache message erreur
    error.style.display = "none";

    // ❌ Ferme overlay
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
const treasureBtn = document.getElementById("treasureBtn");
const treasureDropdown = document.getElementById("treasureDropdown");
const cinematic = document.getElementById("cinematicChest");
const chestContainer = document.getElementById("chestContainer");
const chestBase = document.getElementById("chestBase");

if (sessionStorage.getItem("questCompleted") === "true") {

  sessionStorage.removeItem("questCompleted");

  if (cinematic && chestContainer && chestBase) {

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

    setTimeout(() => {
      loader.classList.remove("show");
      setTimeout(() => loader.remove(), 600);
    }, 2500);

    setTimeout(() => {
      cinematic.classList.remove("hidden");
      cinematic.classList.add("show");
    }, 2500);

    chestContainer.addEventListener("click", function openChest() {

      chestContainer.removeEventListener("click", openChest);

      chestBase.src = "images/Tresorouvert.png";
      chestBase.style.transform = "scale(1.05)";

      setTimeout(() => {

        // ❌ Supprime totalement l’animation du coffre
        cinematic.remove();

        const treasureSelector = document.getElementById("treasureSelector");
        if (treasureSelector) {
          treasureSelector.classList.remove("hidden");
        }

      }, 800);

    });
  }
}

/* ==========================================================
   🎁 DROPDOWN + TÉLÉCHARGEMENT
========================================================== */

if (treasureBtn && treasureDropdown) {

  treasureBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    treasureDropdown.classList.toggle("show");
  });

  treasureDropdown.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  document.addEventListener("click", () => {
    treasureDropdown.classList.remove("show");
  });
}

/* ==========================================================
   📌 LABELS + DOWNLOADS
========================================================== */
const labels = [
  "Commerce",
  "Communication",
  "Finance",
  "Legal"
];

const downloadLinks = [
  "dossiers/Commerce.zip",
  null,
  null,
  null
];

const canvaButtons = document.querySelectorAll("#treasureDropdown button");

canvaButtons.forEach((btn, index) => {

  if (!btn) return;

  /* ---------- TOOLTIP ---------- */
  const tooltip = document.createElement("div");
  tooltip.className = "tooltip";
  tooltip.textContent = labels[index] || "";
  btn.appendChild(tooltip);

  /* ---------- DOWNLOAD DIRECT ---------- */
  const filePath = downloadLinks[index];

  if (filePath) {

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const link = document.createElement("a");
      link.href = filePath;
      link.download = "Commerce.zip"; // nom forcé
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      treasureDropdown.classList.remove("show");
    });

  }

});
   });
