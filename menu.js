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
  savedMode ? setBackground(savedMode, false) : applyAutoBackground();

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
     🎯 DÉTECTION RETOUR DEPUIS LEGAL
  ====================================== */

  if (sessionStorage.getItem("questCompleted") === "true") {

    const loader = document.getElementById("questLoader");
    const chest = document.getElementById("questChest");

    loader.classList.remove("hidden");

    // Après 3 secondes → déplacement vers bouton météo
    setTimeout(() => {

      const weatherBtn = document.getElementById("weatherButton");
      const rect = weatherBtn.getBoundingClientRect();

      chest.classList.add("move-to-weather");

      chest.style.top = rect.top + "px";
      chest.style.left = (rect.right + 10) + "px";
      chest.style.width = weatherBtn.offsetWidth + "px";

      document.getElementById("questText").style.opacity = "0";

      // On masque le fond noir après déplacement
      setTimeout(()=>{
        loader.style.background = "transparent";
      }, 1000);

    }, 3000);

    // Redirection vers trésor
    chest.addEventListener("click", () => {
      window.location.href = "tresor.html";
    });

  }

});
