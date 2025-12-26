document.addEventListener("DOMContentLoaded", () => {
  const pirate1 = document.getElementById("pirate1");
  const pirate2 = document.getElementById("pirate2");
  const pirate3 = document.getElementById("pirate3");
  const pirate4 = document.getElementById("pirate4");
  const pirate5 = document.getElementById("pirate5");

  const notification = document.getElementById("notification");
  const bubble = document.getElementById("bubble");
  const bubbleButton = document.getElementById("bubbleButton");

  // ---------- Helpers ----------
  function lock(el){
    el.classList.add("locked");
    el.classList.remove("unlocked");
  }

  function unlock(el){
    el.classList.add("unlocked");
    el.classList.remove("locked");
  }

  // ---------- Première arrivée ----------
  if (!localStorage.getItem("visitedMenu")) {
    localStorage.setItem("visitedMenu", "yes");
    localStorage.setItem("p2_clicked", "no");
    lock(pirate1);
    lock(pirate3);
    lock(pirate4);
    lock(pirate5);
    unlock(pirate2);
  }

  // ---------- Après clic sur pirate2 ----------
  if (localStorage.getItem("p2_clicked") === "yes") {
    unlock(pirate1);
    unlock(pirate2);

    // Affichage notification
    notification.style.display = "block";
    setTimeout(() => notification.classList.add("slide-down"), 50);

    // Affichage bulle
    bubble.style.display = "block";
  }

  // ---------- Clic pirate2 ----------
  pirate2.addEventListener("click", () => {
    if (localStorage.getItem("p2_clicked") === "no") {
      localStorage.setItem("p2_clicked", "yes");
      setTimeout(() => location.reload(), 200);
    }
  });

  // ---------- Clic pirate1 ----------
  pirate1.addEventListener("click", () => {
    window.open("commerce.html", "_blank");
  });

  // ---------- Fermeture bulle ----------
  if (bubbleButton) {
    bubbleButton.addEventListener("click", () => {
      bubble.style.display = "none";
      notification.classList.remove("slide-down");
      setTimeout(() => notification.style.display = "none", 600);
    });
  }

});
