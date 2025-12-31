document.addEventListener("DOMContentLoaded", () => {

  const videoContainer = document.getElementById("videoContainer");
  const questVideo = document.getElementById("questVideo");
  const toggleSound = document.getElementById("toggleSound");
  const closeVideo = document.getElementById("closeVideo");
  const background = document.getElementById("background");

  const buttonsContainer = document.getElementById("buttonsContainer");
  const replayVideo = document.getElementById("replayVideo");
  const finishQuest = document.getElementById("finishQuest");

  const pirate2bis = document.getElementById("pirate2bis");
  const pirate5bis = document.getElementById("pirate5bis");
  const bubbleContainer = document.getElementById("bubbleContainer");

  // 🔹 configuration vidéo
  questVideo.muted = true;
  questVideo.setAttribute("playsinline", "");
  questVideo.setAttribute("webkit-playsinline", "");
  questVideo.loop = false;

  videoContainer.style.display = "flex";
  videoContainer.style.opacity = "1";

  if (background) background.classList.remove("show");
  if (buttonsContainer) buttonsContainer.style.display = "none";
  if (pirate2bis) pirate2bis.style.display = "none";
  if (pirate5bis) pirate5bis.style.display = "none";
  if (replayVideo) replayVideo.style.display = "none";
  if (finishQuest) finishQuest.style.display = "none";

  // 🔹 fonction play avec fallback
  function tryPlayVideo() {
    questVideo.play().then(() => {
      console.log("▶️ Vidéo démarrée automatiquement");
    }).catch(() => {
      console.warn("⛔ Autoplay bloqué, affichage du bouton Lancer");
      if (toggleSound) {
        toggleSound.textContent = "▶️ Lancer la vidéo";
        toggleSound.onclick = () => {
          questVideo.play();
          toggleSound.textContent = "🔊";
        };
      }
    });
  }

  // petit délai pour que le DOM se rende complètement
  setTimeout(tryPlayVideo, 200);

  // 🔹 fin de vidéo → scène jeu
  questVideo.addEventListener("ended", () => {
    videoContainer.style.display = "none";
    if (background) background.classList.add("show");
    if (buttonsContainer) buttonsContainer.style.display = "flex";
    if (pirate2bis) pirate2bis.style.display = "flex";
    if (pirate5bis) pirate5bis.style.display = "flex";
    if (replayVideo) replayVideo.style.display = "flex";
    if (finishQuest) finishQuest.style.display = "flex";
  });

  // 🔹 fermer vidéo
  if (closeVideo) {
    closeVideo.addEventListener("click", () => {
      questVideo.pause();
      questVideo.dispatchEvent(new Event('ended'));
    });
  }

  // 🔹 son
  if (toggleSound) {
    toggleSound.addEventListener("click", () => {
      questVideo.muted = !questVideo.muted;
      toggleSound.textContent = questVideo.muted ? "🔇" : "🔊";
    });
  }

  // 🔹 replay
  if (replayVideo) {
    replayVideo.addEventListener("click", () => {
      videoContainer.style.display = "flex";
      videoContainer.style.opacity = "1";
      if (background) background.classList.remove("show");
      if (buttonsContainer) buttonsContainer.style.display = "none";
      questVideo.currentTime = 0;
      questVideo.play();
    });
  }

});
