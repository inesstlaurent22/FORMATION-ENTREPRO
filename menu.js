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

  const notification = document.getElementById("notification");
  const bubble = document.getElementById("bubble");
  const bubbleButton = document.getElementById("bubbleButton");

  const pirates = [pirate1, pirate2, pirate3, pirate4, pirate5].filter(Boolean);

  /* ==========================================================
     0️⃣ TOUT VERROUILLER AU DÉPART
  ========================================================== */
  pirates.forEach(p => {
    p.classList.add("locked");
    p.classList.remove("unlocked", "glow");
    p.style.pointerEvents = "none";
  });

  /* ==========================================================
     1️⃣ PIRATE 2 DÉBLOQUÉ PAR DÉFAUT
  ========================================================== */
  if (pirate2) {
    pirate2.classList.remove("locked");
    pirate2.classList.add("unlocked");
    pirate2.style.pointerEvents = "auto";
  }

  /* ==========================================================
     2️⃣ TRANSFERTS SESSION → LOCAL (RETOURS DE QUÊTES)
  ========================================================== */
  ["pirate3", "pirate4", "pirate5"].forEach(id => {
    if (sessionStorage.getItem(`unlock_${id}`) === "true") {
      localStorage.setItem(`${id}_unlocked`, "true");
      sessionStorage.removeItem(`unlock_${id}`);
    }
  });

  /* ==========================================================
     3️⃣ RETOUR DE COMMERCE → MOT DE PASSE
  ========================================================== */
  if (
    sessionStorage.getItem("fromCommerce") === "true" &&
    localStorage.getItem("code_mashain_valid") !== "true"
  ) {
    showPasswordOverlay();
    return; // ⛔ stop le menu tant que le code est faux
  }

  /* ==========================================================
     4️⃣ RÉACTIVATION SELON LOCALSTORAGE (SOURCE DE VÉRITÉ)
  ========================================================== */
  pirates.forEach(p => {
    if (localStorage.getItem(`${p.id}_unlocked`) === "true") {
      p.classList.remove("locked");
      p.classList.add("unlocked", "glow");
      p.style.pointerEvents = "auto";
    }
  });

  /* ==========================================================
     5️⃣ PIRATE 2 → DÉBLOQUE PIRATE 1
  ========================================================== */
  if (pirate2 && pirate1) {
    pirate2.addEventListener("click", () => {
      localStorage.setItem("pirate1_unlocked", "true");
      sessionStorage.setItem("showBubbleAfterReload", "yes");
      window.location.reload();
    });
  }

  /* ==========================================================
     6️⃣ BULLE + NOTIFICATION APRÈS RELOAD
  ========================================================== */
  if (
    sessionStorage.getItem("showBubbleAfterReload") === "yes" &&
    pirate2 &&
    bubble
  ) {
    if (notification) {
      notification.textContent = "🆕 Un nouveau pirate est débloqué !";
      notification.classList.add("show");
      setTimeout(() => notification.classList.remove("show"), 2500);
    }

    bubble.style.display = "block";

    requestAnimationFrame(() => {
      const rect = pirate2.getBoundingClientRect();
      bubble.style.position = "absolute";
      bubble.style.left = rect.left + rect.width / 2 + "px";
      bubble.style.top = rect.top - 60 + window.scrollY + "px";
      bubble.style.transform = "translateX(-50%)";
    });

    sessionStorage.removeItem("showBubbleAfterReload");
  }

  bubbleButton?.addEventListener("click", () => {
    bubble.style.display = "none";
  });

  /* ==========================================================
     7️⃣ NAVIGATION ENTRE QUÊTES
  ========================================================== */
  pirate1?.addEventListener("click", () => {
    if (!pirate1.classList.contains("locked")) {
      window.location.href = "commerce.html";
    }
  });

  pirate3?.addEventListener("click", () => {
    if (!pirate3.classList.contains("locked")) {
      window.location.href = "communication.html";
    }
  });

  pirate4?.addEventListener("click", () => {
    if (!pirate4.classList.contains("locked")) {
      window.location.href = "legal.html";
    }
  });

  pirate5?.addEventListener("click", () => {
    if (!pirate5.classList.contains("locked")) {
      window.location.href = "finance.html";
    }
  });

  /* ==========================================================
     🔐 OVERLAY MOT DE PASSE (COMMERCE → PIRATE 3)
  ========================================================== */
  function showPasswordOverlay() {

    const overlay = document.createElement("div");
    overlay.id = "passwordOverlay";
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.background = "rgba(0,0,0,0.9)";
    overlay.style.zIndex = "9999";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";

    overlay.innerHTML = `
      <div style="
        background:#140a00;
        border:2px solid gold;
        padding:30px 40px;
        text-align:center;
        color:#fff2cc;
        box-shadow:0 0 25px rgba(255,215,0,0.5);
      ">
        <h2 style="margin-bottom:15px;color:gold;">🔐 Accès verrouillé</h2>
        <p>Entre le mot de passe pour continuer</p>
        <input id="passwordInput" type="password"
          style="margin-top:10px;padding:10px;font-size:16px;text-align:center;width:200px;" />
        <br>
        <button id="passwordBtn"
          style="margin-top:15px;padding:10px 25px;font-size:16px;cursor:pointer;">
          Valider
        </button>
        <div id="passwordError"
          style="margin-top:10px;color:#ff4d4d;display:none;">
          Mot de passe incorrect
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const input = overlay.querySelector("#passwordInput");
    const btn = overlay.querySelector("#passwordBtn");
    const error = overlay.querySelector("#passwordError");

    btn.addEventListener("click", validate);
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") validate();
    });

    function validate() {
      if (input.value.trim().toLowerCase() === "mashain") {
        localStorage.setItem("code_mashain_valid", "true");
        localStorage.setItem("pirate3_unlocked", "true");
        sessionStorage.removeItem("fromCommerce");
        overlay.remove();
        window.location.reload();
      } else {
        error.style.display = "block";
        input.value = "";
        input.focus();
      }
    }
  }

});
