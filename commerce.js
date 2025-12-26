/* ============================
   🎯 COMMERCE – LOGIQUE DE QUÊTE
   ============================ */

document.addEventListener("DOMContentLoaded", () => {

  const video = document.getElementById("comVideo");
  const soundBtn = document.getElementById("soundButtoncom");
  const closeBtn = document.getElementById("closeVideocom");
  const validateBtn = document.getElementById("validateBtn");
  const videoContainer = document.getElementById("videoContainercom");

  /* ========= SECURITÉ ========= */
  if (!video) {
    console.error("⚠️ Video introuvable");
    return;
  }

  /* ========= SON ON/OFF ========= */
  soundBtn?.addEventListener("click", () => {

    video.muted = !video.muted;

    if (video.muted) {
      soundBtn.textContent = "🔇";
    } else {
      soundBtn.textContent = "🔊";
    }
  });

  /* ========= FERMER VIDÉO VISUELLEMENT ========= */
  closeBtn?.addEventListener("click", () => {
    videoContainer.style.display = "none";
  });

  /* ========= VALIDATION QUÊTE ========= */
  function validateCommerceQuest() {

    // sauvegarde progression
    localStorage.setItem("task_commerce_done", "true");

    // retour au menu
    window.location.href = "menu.html";
  }

  /* ========= BOUTON "TERMINER LA QUÊTE" ========= */
  validateBtn?.addEventListener("click", validateCommerceQuest);

  /* ========= AUTO VALIDATION À FIN VIDÉO ========= */
  video.addEventListener("ended", () => {
    validateCommerceQuest();
  });

});
