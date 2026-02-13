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

function setBackground(mode, save = true){
  if (!background) return;

  background.style.backgroundImage =
    `url("${mode === "night" ? NIGHT_BG : DAY_BG}")`;

  document.body.classList.toggle("night-mode", mode === "night");

  if (save) localStorage.setItem("menu_background", mode);
}

function applyAutoBackground(){
  const hour = new Date().getHours();
  const isNight = hour >= 19 || hour < 7;
  setBackground(isNight ? "night" : "day", false);
}

const savedMode = localStorage.getItem("menu_background");
savedMode ? setBackground(savedMode, false) : applyAutoBackground();

/* ===============================
   DROPDOWN MÉTÉO
================================ */

if (timeToggle && timeDropdown) {

  timeToggle.addEventListener("click", (e) => {
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
   🏴‍☠️ PIRATES
========================================================== */

const pirates = ["pirate1","pirate2","pirate3","pirate4","pirate5"]
  .map(id => document.getElementById(id))
  .filter(Boolean);

const pirate1 = document.getElementById("pirate1");
const pirate2 = document.getElementById("pirate2");

const notification = document.getElementById("notification");
const bubble = document.getElementById("bubble");
const bubbleButton = document.getElementById("bubbleButton");

/* 🔒 Lock par défaut */
pirates.forEach(p => {
  p.classList.add("locked");
  p.classList.remove("unlocked","glow");
  p.style.pointerEvents = "none";
});

/* 🔓 Pirate 2 accessible */
if (pirate2) {
  pirate2.classList.remove("locked");
  pirate2.classList.add("unlocked");
  pirate2.style.pointerEvents = "auto";
}

/* 🔄 Transfert session → local */
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

/* 🔓 Réactivation */
pirates.forEach(p => {
  if (localStorage.getItem(`${p.id}_unlocked`) === "true") {
    p.classList.remove("locked");
    p.classList.add("unlocked","glow");
    p.style.pointerEvents = "auto";
  }
});

if (newUnlock) showNotification("🏆 Bravo, tu as débloqué un nouveau pirate !");

/* 💬 Bulle pirate2 */
if (bubbleButton) {
  bubbleButton.onclick = () => bubble.style.display = "none";
}

if (pirate2) {
  pirate2.addEventListener("click", e => {

    e.preventDefault();
    e.stopPropagation();

    if (bubble) {
      bubble.style.display = "block";
      bubble.style.left = "50%";
      bubble.style.top = "50%";
      bubble.style.transform = "translate(-50%, -50%)";
    }

    showNotification("🏴‍☠️ Nouveau pirate débloqué !");

    if (pirate1 && !localStorage.getItem("pirate1_unlocked")) {
      pirate1.classList.remove("locked");
      pirate1.classList.add("unlocked","glow");
      pirate1.style.pointerEvents = "auto";
      localStorage.setItem("pirate1_unlocked", "true");
    }
  });
}

/* 🧭 Navigation */
const navMap = {
  pirate1: "commerce.html",
  pirate3: "communication.html",
  pirate4: "legal.html",
  pirate5: "finance.html"
};

pirates.forEach(p => {
  if (p.id === "pirate2") return;

  const target = navMap[p.id];
  if (!target) return;

  p.addEventListener("click", () => {
    if (!p.classList.contains("unlocked")) return;
    location.href = target;
  });
});


/* ==========================================================
   🔐 SAS MOT DE PASSE APRÈS COMMERCE
========================================================== */

const fromCommerce = sessionStorage.getItem("fromCommerce") === "true";
const passwordCleared = sessionStorage.getItem("passwordCleared") === "true";

if (fromCommerce && !passwordCleared) {
  sessionStorage.removeItem("fromCommerce");
  showNotification("🔐 Accès verrouillé");
  setTimeout(showPasswordOverlay, 500);
}

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
      <button id="legalBtn" class="pirate-btn left">📜 Mentions légales</button>
      <button id="payBtn" class="pirate-btn right">💰 Version complète</button>
    </div>
  </div>

  <div id="legalModal" class="legal-modal">
    <div class="legal-content">
      <span id="closeLegal" class="close-legal">✖</span>
      <h2>Mentions légales & CGV</h2>
      <div class="legal-scroll">
        <p>Éditeur : [Ton nom]</p>
        <p>SIRET : [Numéro]</p>
        <p>Email : [Email]</p>
        <p>Contenus éducatifs. Résultats non garantis.</p>
        <p>Paiement sécurisé via PayPal.</p>
        <p>Aucun remboursement sauf achat en double.</p>
      </div>
    </div>
  </div>
  `;

  document.body.appendChild(overlay);

  const input = overlay.querySelector("#passwordInput");
  const btn = overlay.querySelector("#passwordBtn");
  const error = overlay.querySelector("#passwordError");

  btn.onclick = validate;
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
    }
  }

  overlay.querySelector("#legalBtn").onclick = () =>
    overlay.querySelector("#legalModal").style.display = "flex";

  overlay.querySelector("#closeLegal").onclick = () =>
    overlay.querySelector("#legalModal").style.display = "none";

  overlay.querySelector("#payBtn").onclick = () =>
    window.location.href = "https://www.paypal.com/paypalme/TONLIEN";
}


/* ==========================================================
   🎬 CINÉMATIQUE COFFRE (FIN QUÊTE)
========================================================== */

const treasureBtn = document.getElementById("treasureBtn");
const treasureDropdown = document.getElementById("treasureDropdown");

if (sessionStorage.getItem("questCompleted") === "true") {

  sessionStorage.removeItem("questCompleted");

  const cinematic = document.getElementById("cinematicChest");
  const chestContainer = document.getElementById("chestContainer");

  if (!cinematic || !chestContainer) return;

  cinematic.classList.remove("hidden");

  setTimeout(() => cinematic.classList.add("show"), 50);

  chestContainer.addEventListener("click", function openChest() {

    chestContainer.classList.add("opening");
    chestContainer.removeEventListener("click", openChest);

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

    }, 1200);

  });
}


/* ==========================================================
   🎁 DROPDOWN TRÉSOR
========================================================== */

if (treasureBtn && treasureDropdown) {

  treasureBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    const rect = treasureBtn.getBoundingClientRect();

    treasureDropdown.style.position = "fixed";
    treasureDropdown.style.left = rect.left + "px";
    treasureDropdown.style.top = (rect.bottom + 8) + "px";

    treasureDropdown.style.display =
      treasureDropdown.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", () => {
    treasureDropdown.style.display = "none";
  });
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
