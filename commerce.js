document.addEventListener("DOMContentLoaded", () => {

  const video = document.getElementById("comVideo");
  const overlay = document.getElementById("cinematicOverlaycom");
  const soundBtn = document.getElementById("soundButtoncom");
  const closeBtn = document.getElementById("closeVideocom");

  /* =========================
     🎬 LANCEMENT CINÉMATIQUE
  ========================= */
  setTimeout(() => {
    overlay.classList.add("fade-out");
  }, 1200);

  /* =========================
     🖱️ PAS D’OBSCURITÉ AU SURVOL
  ========================= */
  video.addEventListener("mouseenter", () => {
    overlay.style.opacity = "0";
  });

  video.addEventListener("mouseleave", () => {
    overlay.style.opacity = "1";
  });

  /* =========================
     🔊 SON ON / OFF
  ========================= */
  soundBtn.addEventListener("click", () => {
    video.muted = !video.muted;
    soundBtn.textContent = video.muted ? "🔇" : "🔊";
  });

  /* =========================
     ❌ FERMER → RECHARGER PAGE
  ========================= */
  closeBtn.addEventListener("click", () => {
    location.reload();
  });

});
