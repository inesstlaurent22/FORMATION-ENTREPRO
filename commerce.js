document.addEventListener("DOMContentLoaded", () => {

  const videoContainer = document.getElementById("videoContainer");
  const questVideo = document.getElementById("questVideo");
  const videoControls = document.getElementById("videoControls");
  const toggleSound = document.getElementById("toggleSound");
  const closeVideo = document.getElementById("closeVideo");

  const buttonsContainer = document.getElementById("buttonsContainer");
  const replayVideo = document.getElementById("replayVideo");
  const finishQuest = document.getElementById("finishQuest");

  // --- Fade in du container vidéo ---
  setTimeout(() => {
    videoContainer.classList.add("show");
    questVideo.play();
  }, 100);

  // --- Bouton son ---
  toggleSound.addEventListener("click", () => {
    questVideo.muted = !questVideo.muted;
    toggleSound.textContent = questVideo.muted ? "🔇" : "🔊";
  });

  // --- Fin ou fermeture de la vidéo ---
  function endVideo() {
    videoContainer.classList.remove("show");
    setTimeout(() => {
      videoContainer.style.display = "none";
      buttonsContainer.style.display = "flex";
    }, 500);
  }

  closeVideo.addEventListener("click", () => {
    questVideo.pause();
    endVideo();
  });

  questVideo.addEventListener("ended", () => {
    endVideo();
  });

  // --- Rejouer la vidéo ---
  replayVideo.addEventListener("click", () => {
    buttonsContainer.style.display = "none";
    videoContainer.style.display = "flex";
    setTimeout(() => {
      videoContainer.classList.add("show");
      questVideo.currentTime = 0;
      questVideo.play();
    }, 50);
  });

  // --- Terminer la quête ---
  finishQuest.addEventListener("click", () => {
    alert("Quête terminée !");
  });

});
