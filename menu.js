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
  let highlight = document.createElement("div");
  highlight.classList.add("highlight");
  document.body.appendChild(highlight);

  function moveHighlightOn(element) {
  const rect = element.getBoundingClientRect();

  highlight.style.left = (rect.left - rect.width * 0.05) + "px";
  highlight.style.top = (rect.top - rect.height * 0.05) + "px";
  highlight.style.width = rect.width * 1.1 + "px";
  highlight.style.height = rect.height * 1.15 + "px";
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
