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
  if (!background) {
    console.log("background introuvable");
    return;
  }

  console.log("mode appliqué :", mode);

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

  /* Legal */
if (sessionStorage.getItem("unlock_pirate4") === "true") {

  // On supprime le flag
  sessionStorage.removeItem("unlock_pirate4");

  // 🔕 On NE montre PAS de notification
  // (au cas où un ancien message serait stocké)
  if (notification) {
    notification.classList.remove("show");
    notification.textContent = "";
  }

  // On débloque simplement le pirate
  unlockPirate(pirate4);
}

  /* ==========================================================
   🔔 MESSAGE DÉBLOCAGE MOT DE PASSE
========================================================== */

const unlockMessage = sessionStorage.getItem("unlockMessage");

if (unlockMessage) {
  sessionStorage.removeItem("unlockMessage");
  showNotification(unlockMessage);
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
        <button id="legalBtn" class="pirate-btn">📜 Mentions légales</button>
        <div class="pirate-btn">
  <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
    <input type="hidden" name="cmd" value="_s-xclick" />
    <input type="hidden" name="hosted_button_id" value="85KKQVSF27MY6" />
    <input type="hidden" name="currency_code" value="EUR" />
    <input type="image"
           src="https://www.paypalobjects.com/fr_XC/i/btn/btn_buynowCC_LG.gif"
           border="0"
           name="submit"
           alt="Acheter la version complète" />
  </form>
</div>
      </div>
    </div>

    <div id="legalModal" class="legal-modal">
      <div class="legal-content">
        <span id="closeLegal" class="close-legal">✖</span>
        <h2>Mentions légales & CGV</h2>

        <div class="legal-scroll">
          <h3>Mentions légales</h3>
          <p>
            Éditeur : ISL FREELANCE <br>
            Statut : Micro-entrepreneur<br>
            SIRET : 92022529900022 <br>
            Email : puffrap@outlook.com
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

  // Caché par défaut
  error.style.display = "none";

  setTimeout(() => input.focus(), 200);

  btn.addEventListener("click", validate);
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") validate();
  });

  function validate() {

    const value = input.value.trim().toLowerCase();

    if (value === "mashain") {

      // 🔓 Déblocage permanent pirate3
      localStorage.setItem("pirate3_unlocked", "true");

      // 🔔 Notification à afficher au retour menu
      sessionStorage.setItem("unlockMessage", "🏴‍☠️ Quête Communication débloqué !");
      sessionStorage.setItem("passwordCleared", "true");

      // 🔁 Redirection vers menu
      window.location.href = "menu.html";

    } else {

      error.style.display = "block";
      input.value = "";
      input.focus();

    }
  }

  // 🔹 Mentions légales
  overlay.querySelector("#legalBtn").onclick = () => {
    overlay.querySelector("#legalModal").style.display = "flex";
  };

  overlay.querySelector("#closeLegal").onclick = () => {
    overlay.querySelector("#legalModal").style.display = "none";
  };

  // 🔹 Paiement
  overlay.querySelector("#payBtn").onclick = () => {
    window.location.href = "https://www.paypal.com/paypalme/TONLIEN";
  };
}


/* ==========================================================
🎬 COFFRE FINAL
========================================================== */

const cinematic = document.getElementById("cinematicChest");
const chestContainer = document.querySelector(".chest-container");
const chestBase = document.getElementById("chestBase");
const treasureDropdown = document.getElementById("treasureDropdown");
const chestOverlay = document.getElementById("chestOverlay");

let chestReady = false;

if (
  sessionStorage.getItem("questCompleted") === "true" &&
  cinematic &&
  chestContainer &&
  chestBase
){

  sessionStorage.removeItem("questCompleted");

  cinematic.classList.remove("hidden");

  if(chestOverlay){
    chestOverlay.classList.add("show");
  }

  setTimeout(()=>{
    cinematic.classList.add("show");
    spawnSmoke();
  },100);

  chestContainer.addEventListener("click",handleChestClick);

}

function handleChestClick(e){

  e.stopPropagation();

  if(!chestReady){

    chestBase.src="images/Tresorouvert.png";

    const gemsContainer=document.createElement("div");
    gemsContainer.className="gems-container";
    chestContainer.appendChild(gemsContainer);

    launchGemsExplosion(gemsContainer);

    setTimeout(()=>{
      cinematic.classList.add("move-to-weather");
    },700);

    setTimeout(()=>{

      cinematic.classList.add("treasure-button");

      if(chestOverlay){
        chestOverlay.classList.remove("show");
      }

      chestReady=true;

    },1500);

  }else{

    treasureDropdown.classList.toggle("show");

  }

}

/* =================================
💨 FUMÉE
================================= */

function spawnSmoke(){

  const smokeWrap=document.createElement("div");
  smokeWrap.className="chest-smoke";

  for(let i=0;i<12;i++){

    const smoke=document.createElement("div");
    smoke.className="smoke";

    smoke.style.left=(Math.random()*280)+"px";
    smoke.style.top=(Math.random()*180)+"px";

    smokeWrap.appendChild(smoke);

  }

  chestContainer.appendChild(smokeWrap);

  setTimeout(()=>{
    smokeWrap.remove();
  },2200);

}

/* =================================
💎 EXPLOSION GEMS
================================= */

function launchGemsExplosion(container){

  for(let i=0;i<24;i++){

    const gem=document.createElement("div");
    gem.className="gem";

    const x=(Math.random()*320-160)+"px";
    const y=(Math.random()*320-160)+"px";

    gem.style.setProperty("--x",x);
    gem.style.setProperty("--y",y);

    container.appendChild(gem);

    setTimeout(()=>gem.remove(),1400);

  }

}

/* fermer dropdown */

document.addEventListener("click",()=>{
  if(treasureDropdown){
    treasureDropdown.classList.remove("show");
  }
});
  
/* ==========================================================
   🔐 POLITIQUE CONFIDENTIALITÉ
========================================================== */

const privacyBtn = document.getElementById("privacyBtn");
const privacyModal = document.getElementById("privacyModal");
const closePrivacy = document.getElementById("closePrivacy");

if (privacyBtn && privacyModal) {

  privacyBtn.addEventListener("click", () => {
    privacyModal.style.display = "flex";
  });

}

if (closePrivacy) {

  closePrivacy.addEventListener("click", () => {
    privacyModal.style.display = "none";
  });

}

}); 
