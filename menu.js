document.addEventListener("DOMContentLoaded", () => {

  const pirate1 = document.getElementById("pirate1");
  const pirate2 = document.getElementById("pirate2");
  const pirate3 = document.getElementById("pirate3");
  const pirate4 = document.getElementById("pirate4");
  const pirate5 = document.getElementById("pirate5");

  const notification = document.getElementById("notification");
  const bubble = document.getElementById("bubble");
  const bubbleButton = document.getElementById("bubbleButton");

  // --- Initialisation : pirates bloqués/débloqués ---
  pirate1.classList.add("locked");
  pirate2.classList.add("unlocked");
  [pirate3, pirate4, pirate5].forEach(p => {
    p.classList.add("locked");
    p.style.pointerEvents = "none";
  });

  // --- Vérifier si le clic sur pirate2 vient de se produire ---
  if (sessionStorage.getItem("showBubble") === "yes") {

    // Débloquer pirate1
    pirate1.classList.remove("locked");
    pirate1.classList.add("unlocked", "glow");

    // --- Notification ---
    notification.classList.add("show"); // descend

    setTimeout(() => {
      notification.classList.remove("show"); // remonte après 2,5s
    }, 2500);

    // --- Affichage bulle centrée sur pirate2 ---
    bubble.style.display = "block";

    setTimeout(() => {
      const pirateRect = pirate2.getBoundingClientRect();
      const bubbleRect = bubble.getBoundingClientRect();

      bubble.style.left = (pirateRect.left + pirateRect.width / 2 + window.scrollX) + "px";
      bubble.style.top = (pirateRect.top - bubbleRect.height - 20 + window.scrollY) + "px";
      bubble.style.transform = "translate(-50%, 0)";

      // relancer animation machine à écrire
      const bubbleText = document.getElementById("bubbleText");
      if(bubbleText){
        bubbleText.style.width = "0";
        bubbleText.offsetWidth; // force recalcul
        bubbleText.style.animation = "typing 4s steps(50, end), blink-caret .75s step-end infinite";
      }

    }, 0);

    // nettoyage session
    sessionStorage.removeItem("showBubble");
  }

  // --- Clic sur pirate2 ---
  pirate2.addEventListener("click", () => {
    sessionStorage.setItem("showBubble", "yes");
    window.location.reload();
  });

  // --- Bouton OK bulle ---
  bubbleButton.addEventListener("click", () => {
    bubble.style.display = "none";
  });

  // --- Clic pirate1 ---
  pirate1.addEventListener("click", () => {
    if(pirate1.classList.contains("locked")) return;
    window.open("commerce.html", "_blank");
  });

});
