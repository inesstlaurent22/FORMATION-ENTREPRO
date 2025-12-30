/* ============================
   🎯 COMMERCE – LOGIQUE DE QUÊTE
   ============================ */

document.addEventListener("DOMContentLoaded", () => {

  const video = document.getElementById("comVideo");
  const soundBtn = document.getElementById("soundButtoncom");
  const closeBtn = document.getElementById("closeVideocom");
  const validateBtn = document.getElementById("validateBtn");
  const videoContainer = document.getElementById("videoContainercom");
  const cinematicFade = document.getElementById("cinematicFadecom");

  if (!video) {
    console.error("⚠️ Video introuvable");
    return;
  }

  /* ========= FADE-IN VIDÉO ========= */
  function showVideo() {
    videoContainer.style.display = "flex";
    videoContainer.style.opacity = 0;
    video.currentTime = 0;
    video.play().catch(() => {});

    let opacity = 0;
    const fadeInInterval = setInterval(() => {
      opacity += 0.05;
      videoContainer.style.opacity = opacity;
      if (opacity >= 1) clearInterval(fadeInInterval);
    }, 30);
  }

  /* ========= FADE-OUT + RETOUR MENU ========= */
  function goToMenu() {
    cinematicFade.classList.add("active");
    setTimeout(() => {
      window.location.href = "menu.html";
    }, 1200);
  }

  /* ========= SON ON/OFF ========= */
  soundBtn?.addEventListener("click", () => {
    video.muted = !video.muted;
    soundBtn.textContent = video.muted ? "🔇" : "🔊";
  });

  /* ========= FERMER VIDÉO ========= */
  closeBtn?.addEventListener("click", goToMenu);

  /* ========= VALIDATION QUÊTE ========= */
  function validateCommerceQuest() {
    localStorage.setItem("task_commerce_done", "true");
    goToMenu();
  }

  validateBtn?.addEventListener("click", validateCommerceQuest);

  /* ========= AUTO VALIDATION À FIN VIDÉO ========= */
  video.addEventListener("ended", validateCommerceQuest);

  /* ========= LANCER VIDÉO AVEC FADE-IN ========= */
  showVideo();
});
