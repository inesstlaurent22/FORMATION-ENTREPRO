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

  const pirate1 = document.getElementById("pirate1");
  const pirate2 = document.getElementById("pirate2");

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
  if (pirate2) {
    pirate2.classList.remove("locked");
    pirate2.classList.add("unlocked");
    pirate2.style.pointerEvents = "auto";
  }

  /* ==========================================================
     🔄 TRANSFERT SESSION → LOCAL (DÉBLOCAGES)
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
     🔐 SAS MOT DE PASSE (RETOUR COMMERCE)
  ========================================================== */
  const fromCommerce = sessionStorage.getItem("fromCommerce") === "true";
  const passwordCleared = sessionStorage.getItem("passwordCleared") === "true";

  if (fromCommerce && !passwordCleared) {
    showNotification("🔐 Accès sécurisé requis");
    setTimeout(showPasswordOverlay, 500);
    return; // ⛔ stop menu tant que non validé
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
  if (newUnlock) {
    showNotification("🏆 Bravo, tu as débloqué un nouveau pirate !");
  }

  /* ==========================================================
     💬 BULLE INFO (FERMETURE)
  ========================================================== */
  if (bubbleButton) {
    bubbleButton.onclick = () => {
      bubble.style.display = "none";
    };
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
    if (!target) return;

    p.addEventListener("click", () => {
      location.href = target;
    });
  });

  /* ==========================================================
     🧭 PIRATE 2 → INTRO + DÉBLOCAGE PIRATE 1
  ========================================================== */
  const introSeen = localStorage.getItem("intro_seen") === "true";

  if (pirate2 && !introSeen) {
    pirate2.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();

      // 💬 bulle
      if (bubble) {
        bubble.style.display = "block";
        bubble.style.left = "50%";
        bubble.style.top = "50%";
      }

      // 🔔 notification
      showNotification("🏴‍☠️ Nouveau pirate débloqué !");

      // 🔓 déblocage pirate1
      if (pirate1) {
        pirate1.classList.remove("locked");
        pirate1.classList.add("unlocked","glow");
        pirate1.style.pointerEvents = "auto";
        localStorage.setItem("pirate1_unlocked", "true");
      }

      // 🧠 empêche répétition
      localStorage.setItem("intro_seen", "true");
    });
  }

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
      <input id="passwordInput" type="password" />
      <button id="passwordBtn">Valider</button>
      <div id="passwordError">Mot de passe incorrect</div>
    </div>
  `;

  document.body.appendChild(overlay);

  const input = overlay.querySelector("#passwordInput");
  const btn = overlay.querySelector("#passwordBtn");
  const error = overlay.querySelector("#passwordError");

  // ✅ FOCUS FORCÉ (CRUCIAL)
  setTimeout(() => {
    input.focus();
    input.click();
  }, 50);

  btn.onclick = validate;
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") validate();
  });

  function validate() {
    if (input.value.trim().toLowerCase() === "mashain") {

      sessionStorage.setItem("passwordCleared", "true");
      sessionStorage.removeItem("fromCommerce");

      location.reload();

    } else {
      error.style.display = "block";
      input.value = "";
      setTimeout(() => input.focus(), 50);
    }
  }
}

  /* ==========================================================
     🔔 NOTIFICATION
  ========================================================== */
  function showNotification(text) {
    if (!notification) return;
    notification.textContent = text;
    notification.classList.add("show");
    setTimeout(() => {
      notification.classList.remove("show");
    }, 3000);
  }

});
