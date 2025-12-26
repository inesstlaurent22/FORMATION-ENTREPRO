/* ===================== */
/* 🧠 LOGIQUE DE DÉBLOCAGE */
/* ===================== */

const unlockMap = {
  pirate1: "pirate2",
  pirate2: "pirate3",
  pirate3: "pirate5",
  pirate5: "pirate4"
};

document.addEventListener("DOMContentLoaded", () => {

  const pirates = document.querySelectorAll(".pirate");
  const bubble = document.getElementById("bubble");
  const closeBubble = document.getElementById("closeBubble");
  const notification = document.getElementById("notification");

  /* ===================== */
  /* 🎬 CINÉMATIQUE ARRIVÉE */
  /* ===================== */
  setTimeout(() => {
    document.getElementById("cinematic").classList.add("hide");
    bubble.style.display = "block";
  }, 900);

  closeBubble.onclick = () => bubble.style.display = "none";

  /* ===================== */
  /* 🔓 LOAD SAUVEGARDE */
  /* ===================== */
  pirates.forEach(p => {
    const id = p.id;
    if (localStorage.getItem(id) === "unlocked") {
      p.classList.remove("locked");
      p.classList.add("unlocked");
    }
  });

  /* ===================== */
  /* 🖱 CLICK SUR PIRATE */
  /* ===================== */
  pirates.forEach(pirate => {

    pirate.addEventListener("click", () => {

      if (pirate.classList.contains("locked")) return;

      const id = pirate.id;
      const next = unlockMap[id];

      if (next) {
        localStorage.setItem(next, "unlocked");
        notification.classList.add("show");

        setTimeout(() => notification.classList.remove("show"), 1500);
      }

      localStorage.setItem("lastPirate", id);

      if (pirate.dataset.page) {
        window.location.href = pirate.dataset.page;
      }
    });
  });

  /* ===================== */
  /* 🔄 RESET AVENTURE */
  /* ===================== */
  document.getElementById("resetAdventure").onclick = () => {
    localStorage.clear();
    window.location.reload();
  };
});


/* ===================== */
/* 🌟 FONCTION À APPELER APRÈS UNE MISSION */
/* ===================== */
function unlockNextPirate() {
  const last = localStorage.getItem("lastPirate");
  const next = unlockMap[last];

  if (next) {
    localStorage.setItem(next, "unlocked");
  }

  window.location.href = "menu.html";
}
