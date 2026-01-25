// ===============================
// 🎬 VIDÉO D’INTRO – FINANCE
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const videoContainer = document.getElementById("videoContainer");
  const video = document.getElementById("questVideo");
  const toggleSoundBtn = document.getElementById("toggleSound");
  const closeVideoBtn = document.getElementById("closeVideo");

  const background = document.getElementById("background");
  const pirate2 = document.getElementById("pirate2bis");
  const pirate5 = document.getElementById("pirate5bis");

  // Sécurité autoplay iOS
  video.muted = true;
  video.play().catch(() => {});

  // 🔊 Toggle son
  toggleSoundBtn.addEventListener("click", () => {
    video.muted = !video.muted;
    toggleSoundBtn.textContent = video.muted ? "🔇" : "🔊";
  });

  // ⏭️ Passer la vidéo
  closeVideoBtn.addEventListener("click", endVideo);

  // ⏱️ Fin naturelle de la vidéo
  video.addEventListener("ended", endVideo);

  function endVideo() {
    video.pause();
    videoContainer.classList.add("hidden");

    setTimeout(() => {
      background.classList.remove("hidden");

      // Apparition progressive des pirates
      setTimeout(() => pirate2.classList.remove("hidden"), 500);
      setTimeout(() => pirate5.classList.remove("hidden"), 1100);
    }, 300);
  }
});
