document.addEventListener("DOMContentLoaded", () => {

  const pirates = {
    1: document.getElementById("pirate1"),
    2: document.getElementById("pirate2"),
    3: document.getElementById("pirate3"),
    4: document.getElementById("pirate4"),
    5: document.getElementById("pirate5")
  };

  const notification = document.getElementById("notification");
  const bubble = document.getElementById("bubble");
  const closeNotification = document.getElementById("closeNotification");
  const closeBubble = document.getElementById("closeBubble");

  if (!pirates[1] || !pirates[2]) {
    console.error("Pirates non trouvés !");
    return;
  }

  /* ========= INITIALISATION ========= */
  if (!localStorage.getItem("menuVisited")) {
    localStorage.setItem("menuVisited", "yes");

    // Seul pirate2 débloqué
    pirates[2].classList.add("unlocked");
    pirates[2].classList.remove("locked");

    // Les autres bloqués
    pirates[1].classList.add("locked");
    pirates[3].classList.add("locked");
    pirates[4].classList.add("locked");
    pirates[5].classList.add("locked");

    localStorage.removeItem("p1_unlocked");
    localStorage.removeItem("pirate2Clicked");
  }

  /* ========= CLIC SUR PIRATE 2 ========= */
  if (!localStorage.getItem("pirate2Clicked")) {
    pirates[2].addEventListener("click", () => {

      // Débloquer pirate1
      localStorage.setItem("p1_unlocked", "yes");

      // Bloquer clic suivant
      localStorage.setItem("pirate2Clicked", "true");

      // Recharge la page pour montrer notification et bulle
      location.reload();
    });
  }

  /* ========= APRÈS CLIC SUR PIRATE 2 ========= */
  if (localStorage.getItem("p1_unlocked") === "yes") {

    // Débloquer pirate1
    pirates[1].classList.remove("locked");
    pirates[1].classList.add("unlocked");

    // Afficher notification et la faire descendre
    notification.style.display = "block";
    setTimeout(() => { notification.style.top = "15px"; }, 50);

    // Afficher bulle au-dessus du pirate2
    const rect = pirates[2].getBoundingClientRect();
    bubble.style.left = rect.left + rect.width/2 - 150 + "px"; // centré 300px
    bubble.style.top = rect.top - 90 + "px"; // au-dessus
    bubble.style.display = "block";
  }

  /* ========= FERMETURE NOTIFICATION ET BULLE ========= */
  closeNotification.addEventListener("click", () => {
    notification.style.display = "none";
  });

  closeBubble.addEventListener("click", () => {
    bubble.style.display = "none";
  });

});
