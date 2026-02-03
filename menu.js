document.addEventListener("DOMContentLoaded", () => {

  /* ==========================================================
     🌅 BACKGROUND MENU
  ========================================================== */
  document.body.style.backgroundColor = "#000";
  document.body.style.backgroundImage = "url('images/Fondmenu.PNG')";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundPosition = "center center";
  document.body.style.backgroundSize = "cover";

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
     🏴‍☠️ RÉFÉRENCES PIRATES
  ========================================================== */
  const pirates = ["pirate1","pirate2","pirate3","pirate4","pirate5"]
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const notification = document.getElementById("notification");
  const bubble = document.getElementById("bubble");
  const bubbleButton = document.getElementById("bubbleButton");

  /* ==========================================================
     🔒 TOUT VERROUILLER PAR DÉFAUT
  ========================================================== */
  pirates.forEach(p => {
    p.classList.add("locked");
    p.classList.remove("unlocked","glow");
    p.style.pointerEvents = "none";
  });

  /* ==========================================================
     🔓 PIRATE 2 TOUJOURS ACCESSIBLE
  ========================================================== */
  const pirate2 = document.getElementById("pirate2");
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
      if (localStorage.getItem(`${id}_unlocked`) !== "true") newUnlock = true;
      localStorage.setItem(`${id}_unlocked`, "true");
      sessionStorage.removeItem(`unlock_${id}`);
    }
  });

  /* ==========================================================
     🔐 RETOUR COMMERCE → MOT DE PASSE (UNE SEULE FOIS)
  ========================================================== */
  const fromCommerce = sessionStorage.getItem("fromCommerce") === "true";
  const codeValid = localStorage.getItem("code_mashain_valid") === "true";

  if (fromCommerce && !codeValid) {
    showNotification("🔐 Mot de passe requis pour continuer");
    setTimeout(showPasswordOverlay, 600);
    return; // stop le menu tant que pas validé
  }

  /* ==========================================================
     🔓 RÉACTIVATION DES PIRATES DÉBLOQUÉS
  ========================================================== */
  pirates.forEach(p => {
    if (localStorage.getItem(`${p.id}_unlocked`) === "true") {
      p.classList.remove("locked");
      p.classList.add("unlocked","glow");
      p.style.pointerEvents = "auto";
    }
  });

  /* ==========================================================
     🎉 NOTIFICATION NOUVEAU PIRATE
  ========================================================== */
  if (newUnlock) showNotification("🏆 Bravo, tu as débloqué un nouveau pirate !");

  /* ==========================================================
     💬 BULLE INFO
  ========================================================== */
  if (bubbleButton) {
    bubbleButton.onclick = () => bubble.style.display = "none";
  }

  /* ==========================================================
     🧭 NAVIGATION ENTRE QUÊTES
  ========================================================== */
  const navMap = {
    pirate1: "commerce.html",
    pirate3: "communication.html",
    pirate4: "legal.html",
    pirate5: "finance.html"
  };

  pirates.forEach(p => {
    const target = navMap[p.id];
    if (target) {
      p.addEventListener("click", () => {
        if(p.id === "pirate1") sessionStorage.setItem("fromMenu", "true"); // exemple si besoin
        location.href = target;
      });
    }
  });

  /* ==========================================================
     🔐 OVERLAY MOT DE PASSE
  ========================================================== */
  function showPasswordOverlay() {

    const overlay = document.createElement("div");
    overlay.id = "passwordOverlay";

    overlay.innerHTML = `
      <div class="passwordBox">
        <h2>🔐 Accès verrouillé</h2>
        <p>Entre le mot de passe pour continuer</p>
        <input id="passwordInput" type="password" autofocus />
        <button id="passwordBtn">Valider</button>
        <div id="passwordError" style="display:none;color:red;margin-top:8px">
          Mot de passe incorrect
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const input = overlay.querySelector("#passwordInput");
    const btn = overlay.querySelector("#passwordBtn");
    const error = overlay.querySelector("#passwordError");

    btn.onclick = validate;
    input.onkeydown = e => e.key === "Enter" && validate();

    function validate() {
      if (input.value.trim().toLowerCase() === "mashain") {
        localStorage.setItem("code_mashain_valid", "true"); // validation définitive
        localStorage.setItem("pirate3_unlocked", "true");   // déblocage pirate 3
        sessionStorage.removeItem("fromCommerce");          // nettoyage
        location.reload();
      } else {
        error.style.display = "block";
        input.value = "";
        input.focus();
      }
    }
  }

  /* ==========================================================
     🔔 Fonction notification
  ========================================================== */
  function showNotification(text) {
    if (!notification) return;
    notification.textContent = text;
    notification.classList.add("show");
    setTimeout(() => notification.classList.remove("show"), 3000);
  }

});
