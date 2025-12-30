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

  /* ================================================= */
/* 🏴‍☠️ Pirates commerce */
.pirate {
  position: absolute;
  cursor: pointer;
  z-index: 50; /* au-dessus du fond mais sous la vidéo et boutons */
  object-fit: contain;
}

.pirate.locked {
  filter: grayscale(100%) brightness(0.6);
  opacity: 0.6;
  pointer-events: none;
  transition: none;
}

/* Positions des nouveaux pirates */
#pirate2bis { left: 517px; top: 406px; width: 186px; height: 178px; }
#pirate5bis { left: 786px; top: 397px; width: 143px; height: 143px; }

});
