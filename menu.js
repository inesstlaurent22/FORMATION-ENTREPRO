document.addEventListener("DOMContentLoaded", () => {

  const pirate1 = document.getElementById("pirate1");
  const pirate2 = document.getElementById("pirate2");
  const pirate3 = document.getElementById("pirate3");
  const pirate4 = document.getElementById("pirate4");
  const pirate5 = document.getElementById("pirate5");
  const notification = document.getElementById("notification");
  const bubble = document.getElementById("bubble");
  const bubbleButton = document.getElementById("bubbleButton");

  // Initialisation
  if (!localStorage.getItem("menu_visited")) {
    localStorage.setItem("menu_visited","yes");
    localStorage.setItem("pirate2_clicked","no");
    pirate1.classList.add("locked");
    pirate2.classList.add("unlocked");
    pirate3.classList.add("locked");
    pirate4.classList.add("locked");
    pirate5.classList.add("locked");
  } else {
    // Restaurer état pirate1 si déjà débloqué
    if(localStorage.getItem("pirate2_clicked") === "yes"){
      pirate1.classList.remove("locked");
      pirate1.classList.add("unlocked", "glow");
    }
  }

  // Clic sur pirate2
  pirate2.addEventListener("click", () => {

    if(localStorage.getItem("pirate2_clicked")==="no"){
      localStorage.setItem("pirate2_clicked","yes");

      // Débloquer pirate1
      pirate1.classList.remove("locked");
      pirate1.classList.add("unlocked", "glow");

      // Affiche notification
      notification.classList.add("show");
      setTimeout(() => {
        notification.classList.remove("show");
      }, 2500);

      // Affiche bulle au-dessus du pirate2
      bubble.style.display = "block";
      bubble.style.left = (pirate2.offsetLeft - 40) + "px";
      bubble.style.top = (pirate2.offsetTop - 140) + "px";
    }
  });

  // Bouton OK dans la bulle
  bubbleButton.addEventListener("click", () => {
    bubble.style.display = "none";
  });

  // Click sur pirate1 ➜ ouvrir commerce.html
  pirate1.addEventListener("click", () => {
    if (pirate1.classList.contains("locked")) return;
    window.open("commerce.html", "_blank");
  });
});
