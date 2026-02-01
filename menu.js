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
     🔱 RESET — CAPTURE GLOBALE
  ========================================================== */
  document.addEventListener("click", (e) => {
    const resetBtn = e.target.closest("#resetButton");
    if (!resetBtn) return;

    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Réinitialiser toute la progression ?")) return;

    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  });

  /* ==========================================================
     🏴‍☠️ RÉFÉRENCES PIRATES
  ========================================================== */
  const pirate1 = document.getElementById("pirate1");
  const pirate2 = document.getElementById("pirate2");
  const pirate3 = document.getElementById("pirate3");
  const pirate4 = document.getElementById("pirate4");
  const pirate5 = document.getElementById("pirate5");

  const pirates = [pirate1, pirate2, pirate3, pirate4, pirate5].filter(Boolean);

  /* ==========================================================
     0️⃣ TOUT VERROUILLER
  ========================================================== */
  pirates.forEach(p => {
    p.classList.add("locked");
    p.classList.remove("unlocked", "glow");
    p.style.pointerEvents = "none";
  });

  /* ==========================================================
     1️⃣ PIRATE 2 DÉBLOQUÉ PAR DÉFAUT
  ========================================================== */
  pirate2?.classList.remove("locked");
  pirate2?.classList.add("unlocked");
  pirate2 && (pirate2.style.pointerEvents = "auto");

  /* ==========================================================
     2️⃣ RETOUR DE COMMERCE → DEMANDE DE CODE
  ========================================================== */
  if (
    sessionStorage.getItem("fromCommerce") === "true" &&
    localStorage.getItem("code_mashain_valid") !== "true"
  ) {
    blockMenuWithPassword();
    return; // ⛔ stop tout le reste tant que le code est faux
  }

  /* ==========================================================
     3️⃣ RÉACTIVATION VIA LOCALSTORAGE
  ========================================================== */
  pirates.forEach(p => {
    if (localStorage.getItem(`${p.id}_unlocked`) === "true") {
      p.classList.remove("locked");
      p.classList.add("unlocked", "glow");
      p.style.pointerEvents = "auto";
    }
  });

  /* ==========================================================
     4️⃣ NAVIGATION
  ========================================================== */
  pirate1?.addEventListener("click", () => window.location.href = "commerce.html");
  pirate3?.addEventListener("click", () => window.location.href = "communication.html");
  pirate4?.addEventListener("click", () => window.location.href = "legal.html");
  pirate5?.addEventListener("click", () => window.location.href = "finance.html");

  /* ==========================================================
     🔐 FONCTION MOT DE PASSE
  ========================================================== */
  function blockMenuWithPassword() {

    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.background = "rgba(0,0,0,0.9)";
    overlay.style.zIndex = "9999";
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.color = "#fff";

    overlay.innerHTML = `
      <h2 style="margin-bottom:20px;">🔐 Accès verrouillé</h2>
      <p style="margin-bottom:15px;">Entre le mot de passe pour continuer</p>
      <input id="passwordInput" type="password"
        style="padding:10px;font-size:16px;text-align:center;" />
      <button id="passwordBtn"
        style="margin-top:15px;padding:10px 20px;font-size:16px;cursor:pointer;">
        Valider
      </button>
      <p id="errorMsg" style="color:red;margin-top:10px;display:none;">
        Mot de passe incorrect
      </p>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector("#passwordBtn").addEventListener("click", () => {
      const value = overlay.querySelector("#passwordInput").value.trim().toLowerCase();

      if (value === "mashain") {
        localStorage.setItem("code_mashain_valid", "true");
        localStorage.setItem("pirate3_unlocked", "true");
        sessionStorage.removeItem("fromCommerce");
        overlay.remove();
        window.location.reload();
      } else {
        overlay.querySelector("#errorMsg").style.display = "block";
      }
    });
  }

});
