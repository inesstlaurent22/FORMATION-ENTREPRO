document.addEventListener("DOMContentLoaded", () => {

  // Pirates
  const pirate1 = document.getElementById("pirate1");
  const pirate2 = document.getElementById("pirate2");
  const pirate3 = document.getElementById("pirate3");
  const pirate4 = document.getElementById("pirate4");
  const pirate5 = document.getElementById("pirate5");

  // Notification et bulle
  const notification = document.getElementById("notification");
  const bubble = document.getElementById("bubble");
  const bubbleButton = document.getElementById("bubbleButton");

  // --- Initialisation ---
  pirate1.classList.add("locked");
  pirate2.classList.add("unlocked");
  [pirate3, pirate4, pirate5].forEach(p => {
    p.classList.add("locked");
    p.style.pointerEvents = "none"; // non cliquables
  });

  // --- Vérifier si on vient de cliquer sur pirate2 ---
  if(sessionStorage.getItem("showBubble") === "yes") {
      pirate1.classList.remove("locked");
      pirate1.classList.add("unlocked", "glow");

      // Affichage notification
      notification.classList.add("show");
      setTimeout(() => {
          notification.classList.remove("show");
      }, 2500);

      // Affichage bulle
      bubble.style.display = "block";
      bubble.style.left = (pirate2.offsetLeft - 40) + "px";
      bubble.style.top = (pirate2.offsetTop - 140) + "px";

      sessionStorage.removeItem("showBubble"); // reset
  }

  // --- Clic sur pirate2 ---
  pirate2.addEventListener("click", () => {
    // On stocke un flag pour montrer la bulle et notification après reload
    sessionStorage.setItem("showBubble", "yes");
    window.location.reload();
  });

  // --- Bouton OK dans la bulle ---
  bubbleButton.addEventListener("click", () => {
    bubble.style.display = "none";
  });

  // --- Click sur pirate1 ---
  pirate1.addEventListener("click", () => {
    if (pirate1.classList.contains("locked")) return;
    window.open("commerce.html", "_blank");
  });

});
