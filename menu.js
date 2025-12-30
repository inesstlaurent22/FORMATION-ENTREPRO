document.addEventListener("DOMContentLoaded", () => {

  const pirate1 = document.getElementById("pirate1");
  const pirate2 = document.getElementById("pirate2");
  const pirate3 = document.getElementById("pirate3");
  const pirate4 = document.getElementById("pirate4");
  const pirate5 = document.getElementById("pirate5");

  const notification = document.getElementById("notification");
  const bubble = document.getElementById("bubble");
  const bubbleButton = document.getElementById("bubbleButton");

  /* ==========================================================
      1️⃣ ÉTAT PAR DÉFAUT DES PIRATES
  ========================================================== */

  pirate1.classList.add("locked");
  pirate2.classList.add("unlocked");

  // pirates 3–5 verrouillés par défaut
  [pirate3, pirate4, pirate5].forEach(p => {
    p.classList.add("locked");
    p.style.pointerEvents = "none";
  });

  /* ==========================================================
      2️⃣ DÉBLOCAGE PIRATE 1 APRÈS CLIC SUR PIRATE 2
  ========================================================== */

  if (sessionStorage.getItem("showBubble") === "yes") {

    pirate1.classList.remove("locked");
    pirate1.classList.add("unlocked", "glow");

    notification.textContent = "Un nouveau pirate est débloqué";
    notification.classList.add("show");

    setTimeout(() => {
      notification.classList.remove("show");
    }, 2500);

    // bulle placée au-dessus du pirate 2
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
      3️⃣ DÉBLOCAGE PIRATE 3 APRÈS QUÊTE COMMERCE
          (défini dans commerce.js via localStorage)
  ========================================================== */

  if (localStorage.getItem("pirate3_unlocked") === "true") {

    pirate3.classList.remove("locked");
    pirate3.classList.add("unlocked", "glow");
    pirate3.style.pointerEvents = "auto";

    // petite notification sympa
    notification.textContent = "Pirate 3 est maintenant débloqué !";
    notification.classList.add("show");

    setTimeout(() => {
      notification.classList.remove("show");
    }, 2500);
  }

  /* ==========================================================
      4️⃣ NAVIGATION VERS LES QUÊTES
  ========================================================== */

  // clic pirate 1 → commerce.html
  pirate1.addEventListener("click", () => {
    if (pirate1.classList.contains("locked")) return;
    window.location.href = "commerce.html";
  });

  // futur : pirate3 clique → autre quête
  pirate3.addEventListener("click", () => {
    if (pirate3.classList.contains("locked")) return;
    // 👉 mets ici ta prochaine page si déjà prévue
    // window.location.href = "strategie.html";
  });

});
