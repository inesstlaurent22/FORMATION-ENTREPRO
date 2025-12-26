document.addEventListener("DOMContentLoaded", () => {

  const pirates = {
    p1: document.getElementById("pirate1"),
    p2: document.getElementById("pirate2"),
    p3: document.getElementById("pirate3"),
    p4: document.getElementById("pirate4"),
    p5: document.getElementById("pirate5")
  };

  const notification = document.getElementById("notification");
  const bubble = document.getElementById("bubble");
  const bubbleButton = document.getElementById("bubbleButton");

  // Initialisation des pirates au premier chargement
  if (!localStorage.getItem("visitedMenu")) {
    localStorage.setItem("visitedMenu", "yes");
    localStorage.setItem("p2Unlocked", "yes");
    localStorage.removeItem("p1Unlocked");

    lock(pirates.p1);
    unlock(pirates.p2);
    lock(pirates.p3);
    lock(pirates.p4);
    lock(pirates.p5);
  } else {
    if (localStorage.getItem("p1Unlocked") === "yes") {
      unlock(pirates.p1);
      unlock(pirates.p2);
      notification.style.display = "block";
      notification.classList.add("slide-down");
      bubble.style.display = "block";
    } else {
      lock(pirates.p1);
      unlock(pirates.p2);
      lock(pirates.p3);
      lock(pirates.p4);
      lock(pirates.p5);
    }
  }

  // Clic sur pirate2
  pirates.p2.addEventListener("click", () => {
    if (!localStorage.getItem("p2Clicked")) {
      localStorage.setItem("p2Clicked", "yes");
      localStorage.setItem("p1Unlocked", "yes");
      setTimeout(()=> location.reload(), 200);
    }
  });

  // Clic sur pirate1 -> ouvre commerce.html
  if (localStorage.getItem("p1Unlocked") === "yes") {
    pirates.p1.addEventListener("click", () => {
      window.open("commerce.html", "_blank"); // <<<--- ouvre dans un nouvel onglet
    });
  }

  // Clic sur bouton OK dans la bulle
  if (bubbleButton) {
    bubbleButton.addEventListener("click", () => {
      bubble.style.display = "none";
      notification.style.display = "none";
    });
  }

});

// Helpers
function lock(el){
  el.classList.add("locked");
  el.classList.remove("unlocked");
}

function unlock(el){
  el.classList.add("unlocked");
  el.classList.remove("locked");
}
