document.addEventListener("DOMContentLoaded", () => {

  const p1 = document.getElementById("pirate1");
  const p2 = document.getElementById("pirate2");

  const notification = document.getElementById("notification");
  const bubble = document.getElementById("bubble");

  if(!p1 || !p2){
    console.error("Pirates introuvables");
    return;
  }

  /* ===== PREMIÈRE ARRIVÉE ===== */
  if(!localStorage.getItem("visitedMenu")){

    localStorage.setItem("visitedMenu","yes");

    // p2 débloqué par défaut
    localStorage.setItem("p2_unlocked","yes");
    localStorage.removeItem("p1_unlocked");

    lock(p1);
    unlock(p2);
  }

  /* ===== RETOUR SUR LA PAGE ===== */
  else{

    if(localStorage.getItem("p1_unlocked") === "yes"){
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

  /* ===== CLIC SUR PIRATE 2 ===== */
  p2.addEventListener("click", ()=>{

    // on débloque pirate 1
    localStorage.setItem("p1_unlocked","yes");

    // recharge propre
    setTimeout(()=>{
      location.reload();
    },400);
  });

});

/* ===== HELPERS ===== */
function lock(el){
  el.classList.add("locked");
  el.classList.remove("unlocked");
}

function unlock(el){
  el.classList.add("unlocked");
  el.classList.remove("locked");
}
