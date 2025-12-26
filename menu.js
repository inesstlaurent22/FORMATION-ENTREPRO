const pirate1 = document.getElementById("pirate1");
const pirate2 = document.getElementById("pirate2");

const notification = document.getElementById("notification");
const bubble = document.getElementById("bubble");
const bubbleButton = document.getElementById("bubbleButton");

/* =============================
   FAISCEAU ANIME AUTOUR DU PIRATE
==============================*/

let highlight = document.createElement("div");
highlight.classList.add("highlight");
document.body.appendChild(highlight);

function moveHighlightOn(element) {
  const rect = element.getBoundingClientRect();

  highlight.style.left = rect.left + window.scrollX + "px";
  highlight.style.top = rect.top + window.scrollY + "px";
  highlight.style.width = rect.width + "px";
  highlight.style.height = rect.height + "px";
}

/* =============================
   NOTIFICATION + BULLE
==============================*/

function showNotification() {
  notification.classList.add("show");
  setTimeout(() => notification.classList.remove("show"), 4000);
}

function showBubbleAbove(element) {
  const rect = element.getBoundingClientRect();
  bubble.style.left = rect.left + "px";
  bubble.style.top = (rect.top - 140) + "px";

  bubble.classList.add("show");
}

/* =============================
   DEBLOCAGE PIRATE 1 QUAND ON CLIQUE PIRATE 2
==============================*/

pirate2.addEventListener("click", () => {

  // highlight
  moveHighlightOn(pirate2);

  // notification
  showNotification();

  // bulle positionnée au-dessus
  showBubbleAbove(pirate2);

  // débloquer pirate 1
  pirate1.classList.remove("locked");
  pirate1.classList.add("unlocked");

});

/* =============================
   BOUTON OK J'AI COMPRIS
==============================*/
bubbleButton.addEventListener("click", () => {
  bubble.classList.remove("show");
});
