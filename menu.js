document.addEventListener("DOMContentLoaded", () => {

  const pirate1 = document.getElementById("pirate1");
  const pirate2 = document.getElementById("pirate2");

  const notification = document.getElementById("notification");
  const bubble = document.getElementById("bubble");
  const bubbleButton = document.getElementById("bubbleButton");

  if (!pirate2) {
    console.error("⚠️ pirate2 introuvable dans le HTML");
    return;
  }

  /* ------------------ FAISCEAU ------------------ */
 /* faisceau lumineux sur la forme du pirate */
function placeHighlightOn(img){

  // on enlève les anciens halos
  document.querySelectorAll(".glow").forEach(el=>{
    el.classList.remove("glow");
  });

  // on applique le halo QUI SUIVRA LA FORME
  img.classList.add("glow");
}

  /* ------------------ NOTIFICATION ------------------ */
  function showNotification() {
    notification.classList.add("show");
    setTimeout(() => notification.classList.remove("show"), 4000);
  }

  /* ------------------ BULLE ------------------ */
  function showBubbleAbove(element) {
    const rect = element.getBoundingClientRect();
    bubble.style.left = rect.left + "px";
    bubble.style.top = (rect.top - 140) + "px";
    bubble.classList.add("show");
  }

  /* ------------------ ACTION CLIQUE SUR PIRATE 2 ------------------ */
  pirate2.addEventListener("click", () => {

    console.log("👉 Pirate 2 cliqué"); // test visible en console

    moveHighlightOn(pirate2);
    showNotification();
    showBubbleAbove(pirate2);

    if (pirate1) {
      pirate1.classList.remove("locked");
      pirate1.classList.add("unlocked");
    }
  });

  /* ------------------ BOUTON OK ------------------ */
  bubbleButton.addEventListener("click", () => {
    bubble.classList.remove("show");
  });

});
