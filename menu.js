document.addEventListener("DOMContentLoaded", () => {

  const pirates = [
    { id: "pirate1", unlockAfter: "pirate2" },
    { id: "pirate3", unlockAfter: "pirate2" },
    { id: "pirate4", unlockAfter: "pirate3" },
    { id: "pirate5", unlockAfter: "pirate4" }
  ];

  const pirate2 = document.getElementById("pirate2");
  const bubble = document.getElementById("infoBubble");
  const closeBubble = document.getElementById("closeBubble");

  /* ===================== */
  /* 🔁 RESTAURATION ÉTAT */
  /* ===================== */

  document.querySelectorAll(".pirate").forEach(pirate => {
    const id = pirate.id;
    if (localStorage.getItem(id) === "unlocked") {
      pirate.classList.remove("locked");
      pirate.classList.add("unlocked");
    }
  });

  /* ===================== */
  /* 💬 BULLE PIRATE 2 */
  /* ===================== */

  pirate2.addEventListener("click", () => {
    bubble.style.display = "block";
  });

  closeBubble.addEventListener("click", () => {
    bubble.style.display = "none";
  });

  /* ===================== */
  /* 🚀 LOGIQUE PRINCIPALE */
  /* ===================== */

  document.querySelectorAll(".pirate").forEach(pirate => {
    pirate.addEventListener("click", () => {

      if (pirate.classList.contains("locked")) return;

      const page = pirate.dataset.page;
      const pirateId = pirate.id;

      // Ouvrir la page dans un nouvel onglet
      window.open(page, "_blank");

      // Débloquer le pirate suivant
      unlockNextPirate(pirateId);

      // Recharger le menu
      setTimeout(() => {
        location.reload();
      }, 300);
    });
  });

});

/* ===================== */
/* 🔓 DÉBLOCAGE */
 /* ===================== */

function unlockNextPirate(currentId) {
  const order = ["pirate2", "pirate3", "pirate4", "pirate5"];

  const index = order.indexOf(currentId);
  if (index === -1 || index === order.length - 1) return;

  const nextId = order[index + 1];
  localStorage.setItem(nextId, "unlocked");
  showNotification("🏴‍☠️ Nouveau pirate débloqué !");
}

/* ===================== */
/* 🔔 NOTIFICATION */
 /* ===================== */

function showNotification(text) {
  const notif = document.getElementById("notification");
  notif.textContent = text;
  notif.classList.add("show");

  setTimeout(() => {
    notif.classList.remove("show");
  }, 2500);
}
