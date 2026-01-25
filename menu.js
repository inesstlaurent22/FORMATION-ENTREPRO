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
     🔱 RESET — CAPTURE GLOBALE (ANTI-BUG)
  ========================================================== */
  document.addEventListener("click", (e) => {

    const resetBtn = e.target.closest("#resetButton");
    if (!resetBtn) return;

    e.preventDefault();
    e.stopPropagation();

    const confirmReset = confirm("Réinitialiser toute la progression ?");
    if (!confirmReset) return;

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

  /* ==========================================================
     0️⃣ TOUT VERROUILLER AU DÉPART
  ========================================================== */
  [pirate1, pirate2, pirate3, pirate4, pirate5].forEach(p => {
    if (!p) return;
    p.classList.add("locked");
    p.classList.remove("unlocked", "glow");
    p.style.pointerEvents = "none";
  });

  /* ==========================================================
     1️⃣ PIRATE 2 DÉBLOQUÉ PAR DÉFAUT (INTOUCHABLE)
  ========================================================== */
  pirate2.classList.remove("locked");
  pirate2.classList.add("unlocked");
  pirate2.style.pointerEvents = "auto";

  /* ==========================================================
     2️⃣ DÉBLOCAGE AU RETOUR DES QUÊTES
  ========================================================== */
  if (sessionStorage.getItem("unlock_pirate3") === "true") {
    localStorage.setItem("pirate3_unlocked", "true");
    sessionStorage.removeItem("unlock_pirate3");
  }

  if (sessionStorage.getItem("unlock_pirate4") === "true") {
    localStorage.setItem("pirate4_unlocked", "true");
    sessionStorage.removeItem("unlock_pirate4");
  }

  if (sessionStorage.getItem("unlock_pirate5") === "true") {
    localStorage.setItem("pirate5_unlocked", "true");
    sessionStorage.removeItem("unlock_pirate5");
  }

  /* ==========================================================
     3️⃣ RÉACTIVATION SELON LOCALSTORAGE
  ========================================================== */
  if (localStorage.getItem("pirate1_unlocked") === "true") {
    pirate1.classList.remove("locked");
    pirate1.classList.add("unlocked", "glow");
    pirate1.style.pointerEvents = "auto";
  }

  if (localStorage.getItem("pirate3_unlocked") === "true") {
    pirate3.classList.remove("locked");
    pirate3.classList.add("unlocked", "glow");
    pirate3.style.pointerEvents = "auto";
  }

  if (localStorage.getItem("pirate4_unlocked") === "true") {
    pirate4.classList.remove("locked");
    pirate4.classList.add("unlocked", "glow");
    pirate4.style.pointerEvents = "auto";
  }

  if (localStorage.getItem("pirate5_unlocked") === "true") {
    pirate5.classList.remove("locked");
    pirate5.classList.add("unlocked", "glow");
    pirate5.style.pointerEvents = "auto";
  }

  /* ==========================================================
     4️⃣ LOGIQUE PIRATE 2 → PIRATE 1 (INCHANGÉE)
  ========================================================== */
  pirate2.addEventListener("click", () => {
    localStorage.setItem("pirate1_unlocked", "true");
    sessionStorage.setItem("showBubbleAfterReload", "yes");
    window.location.reload();
  });

  /* ==========================================================
     5️⃣ BULLE APRÈS RELOAD (INCHANGÉE)
  ========================================================== */
  if (sessionStorage.getItem("showBubbleAfterReload") === "yes") {

    notification.textContent = "Un nouveau pirate est débloqué !";
    notification.classList.add("show");
    setTimeout(() => notification.classList.remove("show"), 2500);

    bubble.style.display = "block";

    requestAnimationFrame(() => {
      const rect = pirate2.getBoundingClientRect();
      const bubbleRect = bubble.getBoundingClientRect();

      bubble.style.position = "absolute";
      bubble.style.left = (rect.left + rect.width / 2) + "px";
      bubble.style.top = (rect.top - bubbleRect.height - 15 + window.scrollY) + "px";
      bubble.style.transform = "translateX(-50%)";
    });

    sessionStorage.removeItem("showBubbleAfterReload");
  }

  if (bubbleButton) {
    bubbleButton.addEventListener("click", () => {
      bubble.style.display = "none";
    });
  }

  /* ==========================================================
     6️⃣ NAVIGATION ENTRE PAGES
  ========================================================== */
  pirate1.addEventListener("click", () => {
    if (!pirate1.classList.contains("locked")) {
      window.location.href = "commerce.html";
    }
  });

  pirate3.addEventListener("click", () => {
    if (!pirate3.classList.contains("locked")) {
      window.location.href = "communication.html";
    }
  });

  pirate4.addEventListener("click", () => {
    if (!pirate4.classList.contains("locked")) {
      window.location.href = "legal.html";
    }
  });

  pirate5.addEventListener("click", () => {
    if (!pirate5.classList.contains("locked")) {
      window.location.href = "finance.html";
    }
  });

});
