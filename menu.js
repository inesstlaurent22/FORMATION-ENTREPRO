document.addEventListener("DOMContentLoaded", () => {

  const pirate1 = document.getElementById("pirate1");
  const pirate2 = document.getElementById("pirate2");
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
  }

  // Clic sur pirate2
  pirate2.addEventListener("click", () => {

    if(localStorage.getItem("pirate2_clicked")==="no"){
      localStorage.setItem("pirate2_clicked","yes");

      // Débloquer pirate1
      pirate1.classList.remove("locked");

  // affiche bulle au-dessus du pirate 2
  bubble.style.display = "block";
  bubble.style.left = (pirate2.offsetLeft - 40) + "px";
  bubble.style.top = (pirate2.offsetTop - 140) + "px";
});

/* 👉 bouton OK dans la bulle */
bubbleButton.addEventListener("click", () => {

  // fermer bulle
  bubble.style.display = "none";

  // 🔓 débloquer pirate 1
  pirate1.classList.remove("locked");
  pirate1.classList.add("unlocked", "glow");

  // 🔔 notification
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 2500);
});

/* 🛒 CLICK SUR PIRATE 1 ➜ OUVRIR commerce.html */
pirate1.addEventListener("click", () => {

  // si pirate1 encore verrouillé → rien
  if (pirate1.classList.contains("locked")) return;

  // ouvrir dans un nouvel onglet
  window.open("commerce.html", "_blank");
});
