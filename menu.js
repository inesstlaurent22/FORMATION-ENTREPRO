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
      pirate1.classList.add("unlocked");

      // Notification descend
      notification.style.display = "block";
      setTimeout(() => {
        notification.style.top = "10%";
      },50);

      // Affichage bulle
      bubble.style.display = "block";
    }

  });

  // Fermeture de la bulle
  bubbleButton.addEventListener("click", () => {
    bubble.style.display = "none";
    notification.style.top = "-60px"; // remonter la notification
    setTimeout(()=>{ notification.style.display="none"; },600);
  });

  // Clic pirate1 => ouvre commerce.html
  pirate1.addEventListener("click", () => {
    window.open("commerce.html", "_blank");
  });

});
