document.addEventListener("DOMContentLoaded", () => {

  const pirate1 = document.getElementById("pirate1");
  const pirate2 = document.getElementById("pirate2");
  const bubble = document.getElementById("infoBubble");
  const notif = document.getElementById("notification");
  const sound = document.getElementById("unlockSound");
  const resetBtn = document.getElementById("resetAdventure");

  /* ========================= */
  /* ÉTAT INITIAL */
  /* ========================= */

  const pirate1Unlocked = localStorage.getItem("pirate1Unlocked");

  if (pirate1Unlocked === "true") {
    pirate1.classList.remove("locked");
    pirate1.classList.add("unlocked");
    bubble.style.display = "block";
  } else {
    pirate1.classList.add("locked");
    pirate1.classList.remove("unlocked");
    bubble.style.display = "none";
  }

  /* ========================= */
  /* PIRATE 2 → DÉBLOQUE PIRATE 1 */
  /* ========================= */

  pirate2.addEventListener("click", () => {
    if (!localStorage.getItem("pirate1Unlocked")) {
      localStorage.setItem("pirate1Unlocked", "true");

      // Son + notification
      sound.currentTime = 0;
      sound.play();
      showNotification();

      setTimeout(() => {
        location.reload();
      }, 600);
    }
  });

  /* ========================= */
  /* PIRATE 1 → COMMERCE */
  /* ========================= */

  pirate1.addEventListener("click", () => {
    if (pirate1.classList.contains("locked")) return;

    bubble.style.display = "none";
    window.open("commerce.html", "_blank");
  });

  /* ========================= */
  /* RESET AVENTURE */
  /* ========================= */

  resetBtn.addEventListener("click", () => {
    localStorage.clear();
    location.reload();
  });

  /* ========================= */
  /* NOTIFICATION */
  /* ========================= */

  function showNotification() {
    notif.classList.add("show");
    setTimeout(() => {
      notif.classList.remove("show");
    }, 2500);
  }

});
