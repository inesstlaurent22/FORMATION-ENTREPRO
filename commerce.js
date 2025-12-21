document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("coVideo");
  const overlay = document.getElementById("cinematicOverlay");
  const soundButton = document.getElementById("soundButton");
  const closeVideo = document.getElementById("closeVideo");
  const videoContainer = document.getElementById("videoContainer");

  /* --- LANCEMENT CINÉMATIQUE --- */
  video.muted = true;
  video.play().catch(() => {});

  // Fade-out de l'overlay noir
  setTimeout(() => {
    overlay.classList.add("fade-out");
  }, 500);

  /* --- BOUTON SON --- */
  soundButton.addEventListener("click", () => {
    video.muted = !video.muted;
    soundButton.textContent = video.muted ? "🔇" : "🔊";
  });

  /* --- FERMER LA VIDÉO --- */
  closeVideo.addEventListener("click", () => {
    video.pause();
    videoContainer.classList.add("hidden");
  });
});
