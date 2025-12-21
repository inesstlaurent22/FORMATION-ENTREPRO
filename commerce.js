document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("comVideo");
  const overlay = document.getElementById("cinematicOverlaycom");
  const soundButton = document.getElementById("soundButtoncom");
  const closeVideo = document.getElementById("closeVideocom");
  const videoContainer = document.getElementById("videoContainercom");

  /* --- LANCEMENT CINÉMATIQUE --- */
  videocom.muted = true;
  videocom.play().catch(() => {});

  // Fade-out de l'overlay noir
  setTimeout(() => {
    overlay.classList.add("fade-out");
  }, 500);

  /* --- BOUTON SON --- */
  soundButtoncom.addEventListener("click", () => {
    videocom.muted = !video.muted;
    soundButtoncom.textContent = video.muted ? "🔇" : "🔊";
  });

  /* --- FERMER LA VIDÉO --- */
  closeVideocom.addEventListener("click", () => {
    videocom.pause();
    videoContainercom.classList.add("hidden");
  });
});
