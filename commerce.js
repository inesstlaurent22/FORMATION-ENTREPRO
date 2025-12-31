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

  // 🔹 état initial
  if (videoContainer) {
    videoContainer.style.display = "flex";
    videoContainer.style.opacity = "1";
    videoContainer.style.visibility = "visible";
  }

  questVideo.muted = true;        // obligatoire pour autoplay sur iOS
  questVideo.setAttribute("playsinline", "");
  questVideo.setAttribute("webkit-playsinline", "");

  if (background) background.classList.remove("show");
  if (buttonsContainer) buttonsContainer.style.display = "none";
  if (pirate2bis) pirate2bis.style.display = "none";
  if (pirate5bis) pirate5bis.style.display = "none";
  if (replayVideo) replayVideo.style.display = "none";
  if (finishQuest) finishQuest.style.display = "none";

  // 🔹 autoplay après que le DOM soit rendu
  window.requestAnimationFrame(() => {
    questVideo.play().catch(() => {
      console.warn("⛔ autoplay bloqué, la vidéo restera visible mais silencieuse");
    });
  });

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

  // 🔹 bouton fermer vidéo
  closeVideo.addEventListener("click", () => {
    questVideo.pause();
    questVideo.dispatchEvent(new Event('ended'));
  });

  // 🔹 bouton son
  toggleSound.addEventListener("click", () => {
    questVideo.muted = !questVideo.muted;
    toggleSound.textContent = questVideo.muted ? "🔇" : "🔊";
  });

  // 🔹 bouton replay
  replayVideo.addEventListener("click", () => {
    videoContainer.style.display = "flex";
    videoContainer.style.opacity = "1";
    if (background) background.classList.remove("show");
    if (buttonsContainer) buttonsContainer.style.display = "none";
    questVideo.currentTime = 0;
    questVideo.play();
  });
});
