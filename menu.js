document.addEventListener("DOMContentLoaded", () => {

  const pirate1 = document.getElementById("pirate1");
  const pirate2 = document.getElementById("pirate2");
  const pirate3 = document.getElementById("pirate3");
  const pirate4 = document.getElementById("pirate4");
  const pirate5 = document.getElementById("pirate5");

  const notification = document.getElementById("notification");
  const bubble = document.getElementById("bubble");
  const bubbleButton = document.getElementById("bubbleButton");

  const resetButton = document.getElementById("resetButton");

  // ==========================================================
  // 0️⃣ TOUT VERROUILLER AU DÉPART (sécurité maximale)
  // ==========================================================
  [pirate1, pirate2, pirate3, pirate4, pirate5].forEach(p => {
    p.classList.add("locked");
    p.classList.remove("unlocked", "glow");
    p.style.pointerEvents = "none";
  });

  // ==========================================================
  // 1️⃣ Pirate 2 débloqué par défaut
  // ==========================================================
  pirate2.classList.remove("locked");
  pirate2.classList.add("unlocked");
  pirate2.style.pointerEvents = "auto";

  // ==========================================================
  // 2️⃣ Réactivation selon progression SAUVEGARDÉE
  // ==========================================================
  if (localStorage.getItem("pirate1_unlocked") === "true") {
    pirate1.classList.remove("locked");
    pirate1.classList.add("unlocked", "glow");
    pirate1.style.pointerEvents = "auto";
  }

  // 🚨 pirate3 uniquement si VRAIMENT marqué dans localStorage
  if (localStorage.getItem("pirate3_unlocked") === "true") {
    pirate3.classList.remove("locked");
    pirate3.classList.add("unlocked", "glow");
    pirate3.style.pointerEvents = "auto";
  } else {
    // sécurité supplémentaire contre le bug pirate3 débloqué
    pirate3.classList.add("locked");
    pirate3.classList.remove("unlocked", "glow");
    pirate3.style.pointerEvents = "none";
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

  // ==========================================================
  // 3️⃣ Clic pirate2 → débloque pirate1
  // ==========================================================
  pirate2.addEventListener("click", () => {

    localStorage.setItem("pirate1_unlocked", "true");
    sessionStorage.setItem("showBubbleAfterReload", "yes");

    window.location.reload();
  });

  // ==========================================================
  // 4️⃣ Afficher bulle après reload
  // ==========================================================
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

  bubbleButton.addEventListener("click", () => bubble.style.display = "none");

  // ==========================================================
  // 5️⃣ Navigation entre pages
  // ==========================================================
  pirate1.addEventListener("click", () => {
    if (!pirate1.classList.contains("locked")) window.location.href = "commerce.html";
  });

  pirate3.addEventListener("click", () => {
    if (!pirate3.classList.contains("locked")) window.location.href = "communication.html";
  });

  pirate4.addEventListener("click", () => {
    if (!pirate4.classList.contains("locked")) window.location.href = "finance.html";
  });

  pirate5.addEventListener("click", () => {
    if (!pirate5.classList.contains("locked")) window.location.href = "legal.html";
  });

  // ==========================================================
  // 6️⃣ BOUTON RESET — présent dès le 1er chargement
  // ==========================================================
  if (resetButton) {
    resetButton.addEventListener("click", () => {

      // supprime totalement la progression
      localStorage.clear();
      sessionStorage.clear();

      // recharge proprement
      location.reload();
    });
  }

});
