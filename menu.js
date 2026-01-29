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
     2️⃣ DÉBLOCAGE AU RETOUR DES QUÊTES (SESSION → LOCAL)
  ========================================================== */
  ["pirate3", "pirate4", "pirate5"].forEach(id => {
    if (sessionStorage.getItem(`unlock_${id}`) === "true") {
      localStorage.setItem(`${id}_unlocked`, "true");
      sessionStorage.removeItem(`unlock_${id}`);
    }
  });

  /* ==========================================================
     3️⃣ RÉACTIVATION SELON LOCALSTORAGE (SOURCE DE VÉRITÉ)
  ========================================================== */
  pirates.forEach(p => {
    if (localStorage.getItem(`${p.id}_unlocked`) === "true") {
      p.classList.remove("locked");
      p.classList.add("unlocked", "glow");
      p.style.pointerEvents = "auto";
    }
  });

  /* ==========================================================
     4️⃣ PIRATE 2 → PIRATE 1
  ========================================================== */
  if (pirate2 && pirate1) {
    pirate2.addEventListener("click", () => {
      localStorage.setItem("pirate1_unlocked", "true");
      sessionStorage.setItem("showBubbleAfterReload", "yes");
      window.location.reload();
    });
  }

  /* ==========================================================
     5️⃣ BULLE APRÈS RELOAD
  ========================================================== */
  if (sessionStorage.getItem("showBubbleAfterReload") === "yes" && pirate2 && bubble) {

    if (notification) {
      notification.textContent = "Un nouveau pirate est débloqué !";
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

  if (bubbleButton && bubble) {
    bubbleButton.addEventListener("click", () => {
      bubble.style.display = "none";
    });
  }

  /* ==========================================================
     6️⃣ NAVIGATION ENTRE QUÊTES
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

});
