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

  // ================================
  // 1️⃣ Reset initial
  // ================================
  const pirates = [pirate1, pirate2, pirate3, pirate4, pirate5];
  pirates.forEach(p => {
    p.classList.add("locked");
    p.style.pointerEvents = "none";
  });

  // ================================
  // 2️⃣ Pirate 2 débloqué par défaut
  // ================================
  pirate2.classList.remove("locked");
  pirate2.classList.add("unlocked");
  pirate2.style.pointerEvents = "auto";

  // ================================
  // 3️⃣ Chargement des pirates débloqués
  // ================================
  for (let i = 1; i <= 5; i++) {
    if (localStorage.getItem(`pirate${i}_unlocked`) === "true") {
      const p = document.getElementById(`pirate${i}`);
      p.classList.remove("locked");
      p.classList.add("unlocked", "glow");
      p.style.pointerEvents = "auto";
    }
  }

  // ================================
  // 4️⃣ Pirate 2 cliqué → débloque pirate1 + bulle
  // ================================
  pirate2.addEventListener("click", () => {

    // sauvegarde état
    localStorage.setItem("pirate1_unlocked", "true");

    // affichage notification plus tard
    sessionStorage.setItem("showBubble", "yes");

    // recharge menu
    window.location.reload();
  });

  // ================================
  // 5️⃣ Affichage bulle après reload
  // ================================
  if (sessionStorage.getItem("showBubble") === "yes") {

    // débloquer pirate1
    pirate1.classList.remove("locked");
    pirate1.classList.add("unlocked", "glow");
    pirate1.style.pointerEvents = "auto";

    // notification
    notification.textContent = "Un nouveau pirate est débloqué !";
    notification.classList.add("show");
    setTimeout(() => notification.classList.remove("show"), 2500);

    // bulle
    bubble.style.display = "block";
    sessionStorage.removeItem("showBubble");
  }

  bubbleButton.addEventListener("click", () => {
    bubble.style.display = "none";
  });

  // ================================
  // 6️⃣ Navigation vers les quêtes
  // ================================
  pirate1.addEventListener("click", () => {
    if (!pirate1.classList.contains("locked"))
      window.location.href = "commerce.html";
  });

  pirate3.addEventListener("click", () => {
    if (!pirate3.classList.contains("locked"))
      window.location.href = "communication.html";
  });

  pirate4.addEventListener("click", () => {
    if (!pirate4.classList.contains("locked"))
      window.location.href = "finance.html";
  });

  pirate5.addEventListener("click", () => {
    if (!pirate5.classList.contains("locked"))
      window.location.href = "legal.html";
  });

});
