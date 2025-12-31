document.addEventListener("DOMContentLoaded", () => {

  // 🌊 Pirates
  const pirate1 = document.getElementById("pirate1");
  const pirate2 = document.getElementById("pirate2");
  const pirate3 = document.getElementById("pirate3");
  const pirate4 = document.getElementById("pirate4");
  const pirate5 = document.getElementById("pirate5");

  // 🗨 Notifications et bulle
  const notification = document.getElementById("notification");
  const bubble = document.getElementById("bubble");
  const bubbleButton = document.getElementById("bubbleButton");

  /* ================================================
      1️⃣ RESET → tout verrouillé au départ
  ================================================= */
  const pirates = [pirate1, pirate2, pirate3, pirate4, pirate5];

  pirates.forEach(p => {
    p.classList.add("locked");
    p.classList.remove("unlocked", "glow");
    p.style.pointerEvents = "none";
  });

  /* ================================================
      2️⃣ Pirate 2 débloqué par défaut à la première visite
  ================================================= */
  pirate2.classList.remove("locked");
  pirate2.classList.add("unlocked");
  pirate2.style.pointerEvents = "auto";

  /* ================================================
      3️⃣ Réactiver les pirates déjà débloqués
  ================================================= */
  for (let i = 1; i <= 5; i++) {
    if (localStorage.getItem(`pirate${i}_unlocked`) === "true") {
      const p = document.getElementById(`pirate${i}`);
      p.classList.remove("locked");
      p.classList.add("unlocked", "glow");
      p.style.pointerEvents = "auto";
    }
  }

  /* ================================================
      4️⃣ Clique sur pirate 2 → débloque pirate 1
  ================================================= */
  pirate2.addEventListener("click", () => {

    // débloquer pirate 1
    localStorage.setItem("pirate1_unlocked", "true");

    // indiquer qu'on doit afficher bulle après reload
    sessionStorage.setItem("showBubbleAfterReload", "yes");

    // recharger menu
    window.location.reload();
  });

  /* ================================================
      5️⃣ Affichage bulle + notif APRÈS reload
  ================================================= */
  if (sessionStorage.getItem("showBubbleAfterReload") === "yes") {

    // Sécurité : débloque pirate1 visuellement
    pirate1.classList.remove("locked");
    pirate1.classList.add("unlocked", "glow");
    pirate1.style.pointerEvents = "auto";

    // notification
    notification.textContent = "Un nouveau pirate est débloqué !";
    notification.classList.add("show");
    setTimeout(() => notification.classList.remove("show"), 2500);

    // montre la bulle
    bubble.style.display = "block";

    // positionne la bulle AU-DESSUS de pirate2
    requestAnimationFrame(() => {
      const rect = pirate2.getBoundingClientRect();
      const bubbleRect = bubble.getBoundingClientRect();

      bubble.style.position = "absolute";
      bubble.style.left = (rect.left + rect.width / 2) + "px";
      bubble.style.top = (rect.top - bubbleRect.height - 15 + window.scrollY) + "px";
      bubble.style.transform = "translateX(-50%)";
    });

    // enlever le trigger
    sessionStorage.removeItem("showBubbleAfterReload");
  }

  bubbleButton.addEventListener("click", () => {
    bubble.style.display = "none";
  });

  /* ================================================
      6️⃣ Navigation vers les quêtes
  ================================================= */

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
      window.location.href = "finance.html";
    }
  });

  pirate5.addEventListener("click", () => {
    if (!pirate5.classList.contains("locked")) {
      window.location.href = "legal.html";
    }
  });

  // ================================
// 🔄 Bouton réinitialiser progression
// ================================
const resetBtn = document.getElementById("resetProgress");

resetBtn.addEventListener("click", () => {

  // on efface toute la progression
  localStorage.clear();
  sessionStorage.clear();

  // petite notification
  alert("Progression réinitialisée. Retour au début !");

  // recharger menu
  window.location.reload();
});

});
