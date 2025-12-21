document.addEventListener("DOMContentLoaded", () => {

  const video = document.getElementById("comVideo");
  const overlay = document.getElementById("cinematicOverlaycom");
  const soundButton = document.getElementById("soundButtoncom");
  const closeVideo = document.getElementById("closeVideocom");
  const videoContainer = document.getElementById("videoContainercom");

  /* ========================= */
  /* 🎬 ÉTAT VIDÉO */
  /* ========================= */

  const skipVideo = sessionStorage.getItem("skipCommerceVideo");

  if (skipVideo === "true") {
    videoContainer.classList.add("hidden");
    overlay.classList.add("fade-out");
    return;
  }

  /* ========================= */
  /* 🎥 LANCEMENT CINÉMATIQUE */
  /* ========================= */

  video.muted = true;
  video.play().catch(() => {});

  setTimeout(() => {
    overlay.classList.add("fade-out");
  }, 500);

  /* ========================= */
  /* 🔊 BOUTON SON */
  /* ========================= */

  soundButton.addEventListener("click", () => {
    video.muted = !video.muted;
    soundButton.textContent = video.muted ? "🔇" : "🔊";
  });

  /* ========================= */
  /* ❌ FERMER LA VIDÉO */
  /* ========================= */

  closeVideo.addEventListener("click", () => {
    sessionStorage.setItem("skipCommerceVideo", "true");
    video.pause();
    location.reload();
  });

});
