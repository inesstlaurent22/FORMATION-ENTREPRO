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

  /* ==========================================================
      1️⃣ ÉTAT INITIAL DES PIRATES
  ========================================================== */

  // Tous les pirates sont verrouillés par défaut
  [pirate1, pirate2, pirate3, pirate4, pirate5].forEach(p => {
    p.classList.add("locked");
    p.style.pointerEvents = "none";
  });

  // Pirate2 débloqué par défaut
  pirate2.classList.remove("locked");
  pirate2.classList.add("unlocked");
  pirate2.style.pointerEvents = "auto";

  // Débloquer les pirates selon localStorage
  for (let i = 1; i <= 5; i++) {
    if (localStorage.getItem(`pirate${i}_unlocked`) === "true") {
      const p = document.getElementById(`pirate${i}`);
      p.classList.remove("locked");
      p.classList.add("unlocked", "glow");
      p.style.pointerEvents = "auto";
    }
  }

  /* ==========================================================
      2️⃣ BULLE ET DÉBLOCAGE PIRATE1 VIA PIRATE2
  ========================================================== */

  if (sessionStorage.getItem("showBubble") === "yes") {

    pirate1.classList.remove("locked");
    pirate1.classList.add("unlocked", "glow");
    pirate1.style.pointerEvents = "auto";
    localStorage.setItem("pirate1_unlocked", "true");

    notification.textContent = "Un nouveau pirate est débloqué !";
    notification.classList.add("show");
    setTimeout(() => notification.classList.remove("show"), 2500);

    bubble.style.display = "block";
    const pirateRect = pirate2.getBoundingClientRect();
    const bubbleRect = bubble.getBoundingClientRect();
    bubble.style.left = (pirateRect.left + pirateRect.width / 2) + "px";
    bubble.style.top = (pirateRect.top - bubbleRect.height - 20 + window.scrollY) + "px";
    bubble.style.transform = "translate(-50%, 0)";

    sessionStorage.removeItem("showBubble");
  }

  pirate2.addEventListener("click", () => {
    sessionStorage.setItem("showBubble", "yes");
    window.location.reload();
  });

  bubbleButton.addEventListener("click", () => {
    bubble.style.display = "none";
  });

  /* ==========================================================
      3️⃣ NAVIGATION VERS LES QUÊTES
  ========================================================== */

  pirate1.addEventListener("click", () => {
    if (pirate1.classList.contains("locked")) return;
    window.location.href = "commerce.html";
  });

  pirate3.addEventListener("click", () => {
    if (pirate3.classList.contains("locked")) return;
    window.location.href = "communication.html";
  });

  pirate4.addEventListener("click", () => {
    if (pirate4.classList.contains("locked")) return;
    window.location.href = "finance.html";
  });

  pirate5.addEventListener("click", () => {
    if (pirate5.classList.contains("locked")) return;
    window.location.href = "legal.html";
  });

});
