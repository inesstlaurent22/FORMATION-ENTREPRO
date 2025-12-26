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

  /* Boutons de fermeture */
  const notifCloseBtn = document.createElement("button");
  notifCloseBtn.textContent = "✕";
  notification.appendChild(notifCloseBtn);

  const bubbleCloseBtn = document.createElement("button");
  bubbleCloseBtn.textContent = "✕";
  bubble.appendChild(bubbleCloseBtn);

  notifCloseBtn.addEventListener("click", () => {
    notification.style.display = "none";
  });

  bubbleCloseBtn.addEventListener("click", () => {
    bubble.style.display = "none";
  });

  // ========= PREMIÈRE ARRIVÉE =========
  if (!localStorage.getItem("menuVisited")) {
    localStorage.setItem("menuVisited", "yes");
    localStorage.setItem("p2Clicked", "no");
    localStorage.setItem("p1Unlocked", "no");

    lock(pirates.p1);
    lock(pirates.p3);
    lock(pirates.p4);
    lock(pirates.p5);
    unlock(pirates.p2);
  }

  // ========= CLIQUE PIRATE2 =========
  if (!localStorage.getItem("p2Clicked") || localStorage.getItem("p2Clicked") === "no") {
    pirates.p2.addEventListener("click", () => {

      // Débloquer pirate1
      unlock(pirates.p1);

      // Notification et bulle
      notification.style.display = "block";
      notification.classList.add("show");

      const rect = pirates.p2.getBoundingClientRect();
      bubble.style.display = "block";
      bubble.style.left = rect.left + rect.width / 2 - bubble.offsetWidth / 2 + "px";
      bubble.style.top = rect.top - bubble.offsetHeight - 10 + "px";

      // Sauvegarde du clic pour ne pas répéter
      localStorage.setItem("p2Clicked", "yes");
      localStorage.setItem("p1Unlocked", "yes");
    });
  }

  // ========= CLIQUE PIRATE1 =========
  if (localStorage.getItem("p1Unlocked") === "yes") {
    pirates.p1.addEventListener("click", () => {
      window.open("commerce.html", "_blank");
    });
  }

  // ========= HELPERS =========
  function lock(el) {
    el.classList.add("locked");
    el.classList.remove("unlocked");
  }

  function unlock(el) {
    el.classList.add("unlocked");
    el.classList.remove("locked");
  }

});
