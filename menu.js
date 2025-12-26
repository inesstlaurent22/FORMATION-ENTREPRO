document.addEventListener("DOMContentLoaded", () => {

  const p1 = document.getElementById("pirate1");
  const p2 = document.getElementById("pirate2");

  const notification = document.getElementById("notification");
  const bubble = document.getElementById("bubble");

  // sécurité anti-erreur
  if (!p1 || !p2) {
    console.error("❌ Pirates manquants dans le HTML");
    return;
  }

  // ========= PREMIÈRE ARRIVÉE APRÈS LA VIDÉO =========
  if (!localStorage.getItem("menu_started")) {

    // on marque que le menu a déjà été visité
    localStorage.setItem("menu_started", "yes");

    // pirate 2 débloqué par défaut
    localStorage.setItem("pirate2_unlocked", "yes");

    // pirate 1 toujours verrouillé
    localStorage.removeItem("pirate1_unlocked");

    lock(p1);
    unlock(p2);
  }

  // ========= ARRIVÉE APRÈS CLIQUER SUR PIRATE 2 =========
  else {

    if (localStorage.getItem("pirate1_unlocked") === "yes") {

      unlock(p1);
      unlock(p2);

      // notification animée
      notification.classList.add("show");

      // bulle au-dessus du pirate 2
      setTimeout(() => {
        bubble.style.display = "block";
      }, 800);

    } else {

      lock(p1);
      unlock(p2);
    }
  }

  // ========= CLIC SUR PIRATE 2 =========
  p2.addEventListener("click", () => {

    // CAS 1 — première fois → débloque pirate 1
    if (!localStorage.getItem("pirate1_unlocked")) {

      localStorage.setItem("pirate1_unlocked", "yes");

      setTimeout(() => {
        location.reload();
      }, 250);

    }

    // CAS 2 — déjà débloqué → ouvre commerce.html
    else {

      window.open("commerce.html", "_blank");
    }

  });

});

/* ---------- LOCK SYSTEM ---------- */

function lock(el){
  el.classList.add("locked");
  el.classList.remove("unlocked");
}

function unlock(el){
  el.classList.add("unlocked");
  el.classList.remove("locked");
}
