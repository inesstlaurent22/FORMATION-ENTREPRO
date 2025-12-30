document.addEventListener("DOMContentLoaded", () => {

  const videoContainer = document.getElementById("videoContainer");
  const questVideo = document.getElementById("questVideo");
  const videoControls = document.getElementById("videoControls");
  const toggleSound = document.getElementById("toggleSound");
  const closeVideo = document.getElementById("closeVideo");

  const buttonsContainer = document.getElementById("buttonsContainer");
  const replayVideo = document.getElementById("replayVideo");
  const finishQuest = document.getElementById("finishQuest");

  /* =======================================================
      🎬 AU CHARGEMENT : on montre la vidéo en fade-in
  ======================================================= */
  questVideo.muted = true; // iPhone autoplay
  questVideo.currentTime = 0;

  setTimeout(() => {
    videoContainer.style.display = "flex";
    videoContainer.classList.add("show");
    questVideo.play().catch(() => {
      // si l’autoplay est bloqué, on affiche juste l’écran vidéo
    });
  }, 100);

  /* =======================================================
      🔊 Bouton son
  ======================================================= */
  toggleSound.addEventListener("click", () => {
    questVideo.muted = !questVideo.muted;
    toggleSound.textContent = questVideo.muted ? "🔇" : "🔊";
  });

  /* =======================================================
      ⛔ Quand la vidéo se termine OU bouton X
  ======================================================= */
  function endVideo() {
    videoContainer.classList.remove("show");

    setTimeout(() => {
      questVideo.pause();
      videoContainer.style.display = "none";
      buttonsContainer.style.display = "flex";
    }, 500);
  }

  closeVideo.addEventListener("click", endVideo);
  questVideo.addEventListener("ended", endVideo);

  /* =======================================================
      🔁 Revoir la vidéo
  ======================================================= */
  replayVideo.addEventListener("click", () => {
    buttonsContainer.style.display = "none";

    videoContainer.style.display = "flex";

    setTimeout(() => {
      videoContainer.classList.add("show");
      questVideo.currentTime = 0;
      questVideo.play();
    }, 50);
  });

  /* =======================================================
      🏁 Terminer la quête
  ======================================================= */
  finishQuest.addEventListener("click", () => {
    window.location.href = "menu.html"; // change si autre page
  });

});
