document.addEventListener("DOMContentLoaded", () => {

  const order = ["pirate2", "pirate1", "pirate3", "pirate4", "pirate5"];

  const bubble = document.getElementById("infoBubble");
  const closeBubble = document.getElementById("closeBubble");
  const resetBtn = document.getElementById("resetAdventure");
  const unlockSound = document.getElementById("unlockSound");

  /* ===================== */
  /* 🔁 RESTAURATION ÉTAT */
  /* ===================== */

  order.forEach(id => {
    const pirate = document.getElementById(id);
    if (id === "pirate2" || localStorage.getItem(id) === "unlocked") {
      pirate.classList.add("unlocked");
      pirate.classList.remove("locked");
    } else {
      pirate.classList.add("locked");
      pirate.classList.remove("unlocked");
    }
  });

  /* ===================== */
  /* 🏴‍☠️ CLIC PIRATES */
  /* ===================== */

  document.querySelectorAll(".pirate").forEach(pirate => {
    pirate.addEventListener("click", () => {

      if (pirate.classList.contains("locked")) return;

      const id = pirate.id;
      const index = order.indexOf(id);
      const page = pirate.dataset.page;

      // PIRATE 2 → débloque pirate 1 + bulle
      if (id === "pirate2") {
        localStorage.setItem("pirate1", "unlocked");
        playUnlockSound();
        bubble.style.display = "block";

        setTimeout(() => location.reload(), 300);
        return;
      }

      // OUVERTURE PAGE
      if (page) {
        window.open(page, "_blank");
      }

      // DÉBLOCAGE SUIVANT
      if (index < order.length - 1) {
        localStorage.setItem(order[index + 1], "unlocked");
        playUnlockSound();
        showNotification("🏴‍☠️ Nouveau pirate débloqué !");
      }

      setTimeout(() => location.reload(), 300);
    });
  });

  closeBubble.addEventListener("click", () => {
    bubble.style.display = "none";
  });

  /* ===================== */
  /* 🔄 RESET AVENTURE */
  /* ===================== */

  resetBtn.addEventListener("click", () => {
    if (!confirm("Réinitialiser toute l’aventure ?")) return;

    localStorage.clear();
    location.reload();
  });

  /* ===================== */
  /* 🔊 SON */
  /* ===================== */

  function playUnlockSound() {
    unlockSound.currentTime = 0;
    unlockSound.play().catch(() => {});
  }

});

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
