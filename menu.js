document.addEventListener("DOMContentLoaded", () => {

  const pirate1 = document.getElementById("pirate1");
  const pirate2 = document.getElementById("pirate2");
  const pirate3 = document.getElementById("pirate3");
  const pirate4 = document.getElementById("pirate4");
  const pirate5 = document.getElementById("pirate5");

  const notification = document.getElementById("notification");
  const bubble = document.getElementById("bubble");
  const bubbleButton = document.getElementById("bubbleButton");

  // ---- état initial ----
  pirate1.classList.add("locked");
  pirate2.classList.add("unlocked");
  [pirate3, pirate4, pirate5].forEach(p => {
    p.classList.add("locked");
    p.style.pointerEvents = "none";
  });

  // -------- FONCTION : place la bulle au-dessus du pirate 2 --------
  function placeBubbleAbovePirate2() {

    bubble.style.display = "block";
    bubble.style.visibility = "hidden"; // éviter clignotement

    requestAnimationFrame(() => {

      const pirateRect = pirate2.getBoundingClientRect();
      const bubbleRect = bubble.getBoundingClientRect();

      // centré horizontalement
      bubble.style.left = window.scrollX + pirateRect.left + pirateRect.width / 2 + "px";

      // au-dessus avec marge
      bubble.style.top =
        window.scrollY + pirateRect.top - bubbleRect.height - 18 + "px";

      // recentrage avec transform
      bubble.style.transform = "translate(-50%, 0)";

      bubble.style.visibility = "visible";
    });
  }

  // ----------- afficher bulle + notification après quête -----------

  if (sessionStorage.getItem("showBubble") === "yes") {

    pirate1.classList.remove("locked");
    pirate1.classList.add("unlocked", "glow");

      // --- Notification ---
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 2500);

    placeBubbleAbovePirate2();

    sessionStorage.removeItem("showBubble");
  }

  // -------- clic pirate 2 -> montrer bulle --------
  pirate2.addEventListener("click", () => {
    sessionStorage.setItem("showBubble", "yes");
    placeBubbleAbovePirate2();
  });

  // -------- bouton OK --------
  bubbleButton.addEventListener("click", () => {
    bubble.style.display = "none";
  });

  // -------- clic pirate 1 vers page --------
  pirate1.addEventListener("click", () => {
    if (pirate1.classList.contains("locked")) return;
    window.location.href = "commerce.html";
  });

  // repositionner si écran change
  window.addEventListener("resize", () => {
    if (bubble.style.display === "block") {
      placeBubbleAbovePirate2();
    }
  });

});
