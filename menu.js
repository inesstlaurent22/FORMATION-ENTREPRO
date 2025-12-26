document.addEventListener("DOMContentLoaded", () => {

  // récupérer éléments
  const p1 = document.getElementById("pirate1");
  const p2 = document.getElementById("pirate2");
  const p3 = document.getElementById("pirate3");
  const p4 = document.getElementById("pirate4");
  const p5 = document.getElementById("pirate5");

  const notification = document.getElementById("notification");
  const bubble = document.getElementById("bubble");

  // --------- INITIALISATION FIRST TIME ---------
  if (!localStorage.getItem("game_started")) {

    localStorage.setItem("game_started", "yes");

    localStorage.setItem("pirate1_unlocked","false");
    localStorage.setItem("pirate2_unlocked","true");
    localStorage.setItem("pirate3_unlocked","false");
    localStorage.setItem("pirate4_unlocked","false");
    localStorage.setItem("pirate5_unlocked","false");

    localStorage.setItem("task_commerce_done","false");
    localStorage.setItem("task_marketing_done","false");
    localStorage.setItem("task_finance_done","false");
    localStorage.setItem("task_legal_done","false");
  }

  // --------- CHECK PROGRESSION ---------

  function updateUnlocking() {

    // pirate 3 si commerce terminé
    if (localStorage.getItem("task_commerce_done") === "true") {
      localStorage.setItem("pirate3_unlocked","true");
    }

    // pirate 4 si marketing terminé
    if (localStorage.getItem("task_marketing_done") === "true") {
      localStorage.setItem("pirate4_unlocked","true");
    }

    // pirate 5 si finance terminé
    if (localStorage.getItem("task_finance_done") === "true") {
      localStorage.setItem("pirate5_unlocked","true");
    }
  }

  updateUnlocking();

  // --------- APPLIQUER STATUT VISUEL ---------

  function applyState(img, key){
    if(localStorage.getItem(key) === "true"){
      img.classList.add("unlocked");
      img.classList.remove("locked");
      img.style.pointerEvents = "auto";
    } else {
      img.classList.add("locked");
      img.classList.remove("unlocked");
      img.style.pointerEvents = "none";
    }
  }

  applyState(p1,"pirate1_unlocked");
  applyState(p2,"pirate2_unlocked");
  applyState(p3,"pirate3_unlocked");
  applyState(p4,"pirate4_unlocked");
  applyState(p5,"pirate5_unlocked");

  // --------- CLICK PIRATE 2 ---------

  p2.addEventListener("click", ()=>{

    // débloque pirate 1
    localStorage.setItem("pirate1_unlocked","true");

    // notification animée
    notification.innerText = "Bravo tu as débloqué un nouveau pirate !";
    notification.style.display="block";

    setTimeout(()=>{
      notification.style.top="15px";
    },50);

    const rect = p2.getBoundingClientRect();

    bubble.style.display="block";
    bubble.style.top = (rect.top - 110)+"px";
    bubble.style.left = (rect.left - 20)+"px";

    bubble.innerHTML =
    "Bravo Moussaillon, tu as débloqué ton premier pirate.<br>" +
    "Clique dessus, effectue l’ensemble de la quête et tu pourras débloquer les suivants. Bonne aventure ! 🏴‍☠️";

    // ouvre commerce.html
    window.open("commerce.html","_blank");

    location.reload();
  });

  // --------- CLICK PIRATE 1 → marketing ---------
  p1.addEventListener("click", ()=>{
    if(localStorage.getItem("pirate1_unlocked")==="true"){
        window.open("marketing.html","_blank");
    }
  });

  // --------- CLICK PIRATE 3 → finance ---------
  p3.addEventListener("click", ()=>{
    if(localStorage.getItem("pirate3_unlocked")==="true"){
        window.open("finance.html","_blank");
    }
  });

  // --------- CLICK PIRATE 4 → legal ---------
  p4.addEventListener("click", ()=>{
    if(localStorage.getItem("pirate4_unlocked")==="true"){
        window.open("legal.html","_blank");
    }
  });

});
