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

  // état initial
  videoContainer.style.display = "flex";
  questVideo.muted = true; // obligatoire autoplay iOS

  if (background) background.classList.remove("show");
  if (buttonsContainer) buttonsContainer.style.display = "none";
  if (pirate2bis) pirate2bis.style.display = "none";
  if (pirate5bis) pirate5bis.style.display = "none";
  if (replayVideo) replayVideo.style.display = "none";
  if (finishQuest) finishQuest.style.display = "none";

  // autoplay direct
  questVideo.play().catch(() => {
    console.warn("⛔ autoplay bloqué");
  });

  questVideo.addEventListener("ended", () => {
    videoContainer.style.display = "none";
    if (background) background.classList.add("show");
    if (buttonsContainer) buttonsContainer.style.display = "flex";
    if (pirate2bis) pirate2bis.style.display = "flex";
    if (pirate5bis) pirate5bis.style.display = "flex";
    if (replayVideo) replayVideo.style.display = "flex";
    if (finishQuest) finishQuest.style.display = "flex";
  });

  closeVideo.addEventListener("click", () => {
    questVideo.pause();
    questVideo.dispatchEvent(new Event('ended'));
  });

  toggleSound.addEventListener("click", () => {
    questVideo.muted = !questVideo.muted;
    toggleSound.textContent = questVideo.muted ? "🔇" : "🔊";
  });

  replayVideo.addEventListener("click", () => {
    videoContainer.style.display = "flex";
    if (background) background.classList.remove("show");
    if (buttonsContainer) buttonsContainer.style.display = "none";
    questVideo.currentTime = 0;
    questVideo.play();
  });
});
