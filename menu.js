document.addEventListener("DOMContentLoaded", () => {

  const p1 = document.getElementById("pirate1");
  const p2 = document.getElementById("pirate2");

  const notification = document.getElementById("notification");
  const bubble = document.getElementById("bubble");

  /* sécurité anti-bug */
  if (!p1 || !p2) {
    console.error("Pirates non trouvés");
    return;
  }

  /* ========= PREMIÈRE ARRIVÉE ========= */
  if (!localStorage.getItem("visitedMenu")) {

    localStorage.setItem("visitedMenu","yes");
    localStorage.setItem("p2_unlocked","yes");
    localStorage.removeItem("p1_unlocked");

    lock(p1);
    unlock(p2);
  }

  /* ========= DEUXIÈME ARRIVÉE ========= */
  else {

    if (localStorage.getItem("p1_unlocked") === "yes") {

      unlock(p1);
      unlock(p2);

      notification.style.display = "block";

      setTimeout(()=>{
        bubble.style.display = "block";
      },600);

    } else {

      lock(p1);
      unlock(p2);
    }
  }

  /* ========= CLIC SUR PIRATE 2 ========= */
  p2.addEventListener("click", () => {

    unlock(p2);

    localStorage.setItem("p1_unlocked","yes");

    /* recharge propre */
    setTimeout(()=>{
      location.reload();
    },200);
  });

});

/* ---------- HELPERS ---------- */

function lock(el){
  el.classList.add("locked");
  el.classList.remove("unlocked");
}

function unlock(el){
  el.classList.add("unlocked");
  el.classList.remove("locked");
}
