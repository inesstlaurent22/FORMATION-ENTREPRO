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
  const pirate1 = document.getElementById("pirate1");
  const pirate2 = document.getElementById("pirate2");
  const pirate3 = document.getElementById("pirate3");
  const pirate4 = document.getElementById("pirate4");
  const pirate5 = document.getElementById("pirate5");

  const pirates = [pirate1, pirate2, pirate3, pirate4, pirate5].filter(Boolean);

  const notification = document.getElementById("notification");
  const bubble = document.getElementById("bubble");
  const bubbleButton = document.getElementById("bubbleButton");

  /* ==========================================================
     🔒 TOUT VERROUILLER PAR DÉFAUT
  ========================================================== */
  pirates.forEach(p => {
    p.classList.add("locked");
    p.classList.remove("unlocked", "glow");
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
     🔄 RETOUR DES QUÊTES → TRANSFERT SESSION → LOCAL
  ========================================================== */
  let newUnlock = false;

  ["pirate1", "pirate3", "pirate4", "pirate5"].forEach(id => {
    if (sessionStorage.getItem(`unlock_${id}`) === "true") {
      if (localStorage.getItem(`${id}_unlocked`) !== "true") {
        newUnlock = true;
      }
      localStorage.setItem(`${id}_unlocked`, "true");
      sessionStorage.removeItem(`unlock_${id}`);
    }
  });

  /* ==========================================================
     🔐 RETOUR COMMERCE → MOT DE PASSE (UNE SEULE FOIS)
  ========================================================== */
  if (
    sessionStorage.getItem("fromCommerce") === "true" &&
    localStorage.getItem("code_mashain_valid") !== "true"
  ) {
    showNotification("🔐 Mot de passe requis pour continuer");
    setTimeout(showPasswordOverlay, 600);
    return; // ⛔ stop le menu tant que pas validé
  }

  /* ==========================================================
     🔓 RÉACTIVATION DES PIRATES DÉBLOQUÉS
  ========================================================== */
  pirates.forEach(p => {
    if (localStorage.getItem(`${p.id}_unlocked`) === "true") {
      p.classList.remove("locked");
      p.classList.add("unlocked", "glow");
      p.style.pointerEvents = "auto";
    }
  });

  /* ==========================================================
     🎉 NOTIFICATION NOUVEAU PIRATE
  ========================================================== */
  if (newUnlock) {
    showNotification("🏆 Bravo, tu as débloqué un nouveau pirate !");
  }

  function showNotification(text) {
    if (!notification) return;
    notification.textContent = text;
    notification.classList.add("show");
    setTimeout(() => notification.classList.remove("show"), 3000);
  }

  /* ==========================================================
     💬 BULLE INFO
  ========================================================== */
  if (bubbleButton) {
    bubbleButton.onclick = () => bubble.style.display = "none";
  }

  /* ==========================================================
     🧭 NAVIGATION ENTRE QUÊTES
  ========================================================== */
  pirate1?.addEventListener("click", () => location.href = "commerce.html");
  pirate3?.addEventListener("click", () => location.href = "communication.html");
  pirate4?.addEventListener("click", () => location.href = "legal.html");
  pirate5?.addEventListener("click", () => location.href = "finance.html");

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

        // 🔐 validation définitive
        localStorage.setItem("code_mashain_valid", "true");

        // 🔓 déblocage pirate 3
        localStorage.setItem("pirate3_unlocked", "true");

        // 🧹 nettoyage
        sessionStorage.removeItem("fromCommerce");

        location.reload();

      } else {
        error.style.display = "block";
        input.value = "";
        input.focus();
      }
    }
  }

});
