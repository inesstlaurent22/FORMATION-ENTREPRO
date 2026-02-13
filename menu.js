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

/* ==========================================================
   🎯 FONCTION PRINCIPALE
========================================================== */

function setBackground(mode, save = true){
  if (!background) return;

  background.style.backgroundImage =
    `url("${mode === "night" ? NIGHT_BG : DAY_BG}")`;

  document.body.classList.toggle("night-mode", mode === "night");

  if (save) {
    localStorage.setItem("menu_background", mode);
  }
}

/* ==========================================================
   🌗 AUTO MODE SI AUCUNE SAUVEGARDE
========================================================== */

function applyAutoBackground(){
  const hour = new Date().getHours();
  const isNight = hour >= 19 || hour < 7;
  setBackground(isNight ? "night" : "day", false);
}

const savedMode = localStorage.getItem("menu_background");
if (savedMode) {
  setBackground(savedMode, false);
} else {
  applyAutoBackground();
}

/* ==========================================================
   🌤 DROPDOWN MÉTÉO
========================================================== */
if (timeToggle && timeDropdown) {

  timeToggle.addEventListener("click", (e) => {
    e.stopPropagation();

    const treasureBtn = document.getElementById("treasureBtn");

    // Référence pour positionnement
    const referenceBtn = treasureBtn && 
      !treasureBtn.classList.contains("hidden")
      ? treasureBtn
      : timeToggle;

    const rect = referenceBtn.getBoundingClientRect();

    // On affiche temporairement pour mesurer la hauteur
    timeDropdown.style.display = "block";
    timeDropdown.style.visibility = "hidden";

    const dropdownHeight = timeDropdown.offsetHeight;

    // Position au-dessus du bouton
    timeDropdown.style.left = rect.left + "px";
    timeDropdown.style.top = (rect.top - dropdownHeight - 8) + "px";

    // Toggle propre
    if (timeDropdown.classList.contains("open")) {
      timeDropdown.style.display = "none";
      timeDropdown.classList.remove("open");
    } else {
      timeDropdown.style.display = "block";
      timeDropdown.style.visibility = "visible";
      timeDropdown.classList.add("open");
    }
  });

  timeDropdown.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      setBackground(btn.dataset.mode);
      timeDropdown.style.display = "none";
      timeDropdown.classList.remove("open");
    });
  });

  document.addEventListener("click", () => {
    timeDropdown.style.display = "none";
    timeDropdown.classList.remove("open");
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
     💬 FERMETURE BULLE
  ========================================================== */

  if (bubbleButton) {
    bubbleButton.onclick = () => bubble.style.display = "none";
  }

  /* ==========================================================
     🏴‍☠️ PIRATE 2 → INTRO (PAS DE NAVIGATION)
  ========================================================== */

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

  /* ==========================================================
     🧭 NAVIGATION (EXCLUT PIRATE2)
  ========================================================== */

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
     🔐 SAS MOT DE PASSE (RETOUR COMMERCE)
  ========================================================== */

  const fromCommerce = sessionStorage.getItem("fromCommerce") === "true";
  const passwordCleared = sessionStorage.getItem("passwordCleared") === "true";

  if (fromCommerce && !passwordCleared) {

    sessionStorage.removeItem("fromCommerce");

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

    <div id="passwordError">Mot de passe incorrect</div>

    <!-- 🏴‍☠️ BOUTONS PIRATE -->
    <div class="pirate-actions">
      <button id="legalBtn" class="pirate-btn left">
        📜 Mentions légales
      </button>

      <button id="payBtn" class="pirate-btn right">
        💰 Version complète
      </button>
    </div>
  </div>

  <!-- 📜 MODAL -->
  <div id="legalModal" class="legal-modal">
    <div class="legal-content">
      <span id="closeLegal" class="close-legal">✖</span>
      <h2>Mentions légales & CGV</h2>

      <div class="legal-scroll">

        <h3>Mentions légales</h3>
        <p>
          Éditeur : [Ton nom]<br>
          Statut : [Micro-entrepreneur / EI / Société]<br>
          SIRET : [Numéro SIRET]<br>
          Email : [Email]
        </p>

        <p><strong>Propriété intellectuelle :</strong> Tous les contenus sont protégés.</p>
        <p><strong>Responsabilité :</strong> Les contenus sont éducatifs. Les résultats dépendent de l’implication personnelle.</p>

        <h3>CGV</h3>
        <p>Les présentes CGV encadrent la vente de services d’éducation en ligne.</p>
        <p>Paiement sécurisé via PayPal.</p>
        <p>L’accès est personnel et fourni après paiement.</p>
        <p>Les contenus numériques accessibles immédiatement ne sont pas soumis au droit de rétractation.</p>

        <h3>Politique de remboursement</h3>
        <p>Aucun remboursement possible.</p>
        <p>Exception : achat en double (demande sous 7 jours).</p>

      </div>
    </div>
  </div>
`;

    document.body.appendChild(overlay);

    const input = overlay.querySelector("#passwordInput");
    const btn = overlay.querySelector("#passwordBtn");
    const error = overlay.querySelector("#passwordError");

    setTimeout(() => input.focus(), 150);

    btn.onclick = validate;
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") validate();
    });

    function validate() {

      if (input.value.trim().toLowerCase() === "mashain") {

        sessionStorage.setItem("passwordCleared", "true");
        overlay.remove();
        return;
      }

      error.style.display = "block";
      input.value = "";
      setTimeout(() => input.focus(), 100);
    }
    /* 📜 OUVERTURE MODAL */
overlay.querySelector("#legalBtn").onclick = () => {
  overlay.querySelector("#legalModal").style.display = "flex";
};

/* ❌ FERMETURE MODAL */
overlay.querySelector("#closeLegal").onclick = () => {
  overlay.querySelector("#legalModal").style.display = "none";
};

/* 💰 REDIRECTION PAYPAL */
overlay.querySelector("#payBtn").onclick = () => {
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

  
/* ======================================
   🎬 CINÉMATIQUE COFFRE
====================================== */

if (sessionStorage.getItem("questCompleted") === "true") {

  sessionStorage.removeItem("questCompleted");

  const cinematic = document.getElementById("cinematicChest");
  const chestContainer = document.getElementById("chestContainer");
  const treasureBtn = document.getElementById("treasureBtn");
  const timeToggle = document.getElementById("timeToggle");

  if (!cinematic || !chestContainer) return;

  /* 1️⃣ Apparition */
  cinematic.classList.remove("hidden");

  setTimeout(() => {
    cinematic.classList.add("show");
  }, 50);

  /* 2️⃣ Ouverture au clic */
  chestContainer.addEventListener("click", () => {

    chestContainer.classList.add("opening");

    /* 3️⃣ Transformation après ouverture */
    setTimeout(() => {

      cinematic.classList.remove("show");

      setTimeout(() => {
        cinematic.classList.add("hidden");

        if (timeToggle && treasureBtn) {

          const rect = timeToggle.getBoundingClientRect();

          treasureBtn.style.top = (rect.bottom + 10) + "px";
          treasureBtn.style.left = rect.left + "px";

          treasureBtn.classList.remove("hidden");

          treasureBtn.onclick = () => {
            window.location.href = "tresor.html";
          };
        }

      }, 600);

    }, 1200);

  });
}

/* ======================================
   🎯 DÉTECTION RETOUR DEPUIS LEGAL
====================================== */

if (sessionStorage.getItem("questCompleted") === "true") {

  sessionStorage.removeItem("questCompleted");

  const cinematicChest = document.getElementById("cinematicChest");
  const chestContainer = document.getElementById("chestContainer");
  const treasureBtn = document.getElementById("treasureBtn");
  const timeToggle = document.getElementById("timeToggle");

  if (!cinematicChest || !chestContainer) return;

  /* 1️⃣ Apparition du coffre */
  cinematicChest.classList.remove("hidden");

  setTimeout(() => {
    cinematicChest.classList.add("show");
  }, 50);

  /* 2️⃣ Ouverture au clic */
  chestContainer.addEventListener("click", function openChest() {

    chestContainer.classList.add("opening");

    /* Empêche double clic */
    chestContainer.removeEventListener("click", openChest);

    /* 3️⃣ Transformation en bouton 🎁 */
    setTimeout(() => {

      cinematicChest.classList.remove("show");

      setTimeout(() => {
        cinematicChest.classList.add("hidden");

        if (timeToggle && treasureBtn) {

          const rect = timeToggle.getBoundingClientRect();

          treasureBtn.style.top = (rect.bottom + 10) + "px";
          treasureBtn.style.left = rect.left + "px";

          treasureBtn.classList.remove("hidden");
        }

      }, 600);

    }, 1200);

  });
}

/* ======================================
   🎁 GESTION BOUTON TRÉSOR
====================================== */

const treasureBtn = document.getElementById("treasureBtn");
const treasureImages = document.getElementById("treasureImages");

if (treasureBtn && treasureImages) {

  treasureBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    const rect = treasureBtn.getBoundingClientRect();

    treasureImages.style.left = rect.left + "px";
    treasureImages.style.top = (rect.bottom + 8) + "px";

    treasureImages.classList.toggle("hidden");
  });

  document.addEventListener("click", () => {
    treasureImages.classList.add("hidden");
  });
}

});
