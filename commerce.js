document.addEventListener("DOMContentLoaded", () => {

  const videoContainer = document.getElementById("videoContainer");
  const questVideo = document.getElementById("questVideo");
  const background = document.getElementById("background");

  const pirate2bis = document.getElementById("pirate2bis");
  const pirate5bis = document.getElementById("pirate5bis");

  const toggleSound = document.getElementById("toggleSound");
  const closeVideo = document.getElementById("closeVideo");

  const replayVideo = document.getElementById("replayVideo");
  const finishQuest = document.getElementById("finishQuest");

  /* ========================================================
      1️⃣ AU CHARGEMENT : ON MONTRE LA VIDÉO
  ======================================================== */
  pirate2bis.style.display = "none";
  pirate5bis.style.display = "none";
  replayVideo.style.display = "none";
  finishQuest.style.display = "none";

  questVideo.muted = true;
  questVideo.currentTime = 0;

  setTimeout(() => {
    videoContainer.classList.add("show");
    questVideo.play().catch(()=>{});
  }, 50);

  /* ========================================================
      🔊 SON
  ======================================================== */
  toggleSound.addEventListener("click", () => {
    questVideo.muted = !questVideo.muted;
    toggleSound.textContent = questVideo.muted ? "🔇" : "🔊";
  });

  /* ========================================================
      2️⃣ FIN OU FERMETURE VIDÉO
  ======================================================== */
  function revealBackgroundAndPirates() {

    videoContainer.classList.remove("show");

    setTimeout(() => {
      videoContainer.style.display = "none";

      // montrer fond
      background.classList.add("show");

      // montrer pirates
      pirate2bis.style.display = "block";
      pirate5bis.style.display = "block";

      // montrer boutons
      replayVideo.style.display = "block";
      finishQuest.style.display = "block";

    }, 600);
  }

  questVideo.addEventListener("ended", revealBackgroundAndPirates);
  closeVideo.addEventListener("click", () => {
    questVideo.pause();
    revealBackgroundAndPirates();
  });

  /* ========================================================
      🔁 REVOIR LA VIDÉO
  ======================================================== */
  replayVideo.addEventListener("click", () => {

    background.classList.remove("show");
    pirate2bis.style.display = "none";
    pirate5bis.style.display = "none";
    replayVideo.style.display = "none";
    finishQuest.style.display = "none";

    videoContainer.style.display = "flex";

    setTimeout(() => {
      videoContainer.classList.add("show");
      questVideo.currentTime = 0;
      questVideo.play();
    }, 80);
  });

  /* ========================================================
      🏁 TERMINER LA QUÊTE
  ======================================================== */
  finishQuest.addEventListener("click", () => {
    window.location.href = "menu.html";
  });

});
