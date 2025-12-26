/* ============================= */
/* 🎯 LOGIQUE DE DEBLOCAGE */
/* ============================= */

document.addEventListener("DOMContentLoaded", () => {

  const p1 = document.getElementById("pirate1");
  const p2 = document.getElementById("pirate2");

  const notif = document.getElementById("notification");
  const bubble = document.getElementById("bubble");

  /* ---------- ÉTAT INITIAL ---------- */
  if (!localStorage.getItem("visitedMenu")) {

    // première arrivée
    localStorage.setItem("visitedMenu", "yes");
    localStorage.setItem("p2_unlocked", "yes");
    localStorage.removeItem("p1_unlocked");

    setLocked(p1);
    setUnlocked(p2);

  } else {

    // si pirate1 vient d'être débloqué
    if (localStorage.getItem("p1_unlocked") === "yes") {

      setUnlocked(p1);
      setUnlocked(p2);

      notif.style.display = "block";

      setTimeout(() => {
        bubble.style.display = "block";
      }, 800);

    } else {
      setLocked(p1);
      setUnlocked(p2);
    }
  }

  /* ---------- CLIQUE SUR PIRATE 2 ---------- */
  p2.addEventListener("click", () => {

    // débloquer pirate 1
    localStorage.setItem("p1_unlocked", "yes");

    // recharger page
    location.reload();
  });

});

/* ============================= */
/* Helpers */
/* ============================= */

function setLocked(el) {
  el.classList.add("locked");
  el.classList.remove("unlocked");
}

function setUnlocked(el) {
  el.classList.add("unlocked");
  el.classList.remove("locked");
}

  /* ===================== */
  /* 🔄 RESET AVENTURE */
  /* ===================== */
  document.getElementById("resetAdventure").onclick = () => {
    localStorage.clear();
    window.location.reload();
  };
});

