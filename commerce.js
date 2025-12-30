document.addEventListener("DOMContentLoaded", () => {

  const video = document.getElementById("comVideo");
  const soundBtn = document.getElementById("soundButtoncom");
  const closeBtn = document.getElementById("closeVideocom");
  const validateBtn = document.getElementById("validateBtn");
  const videoContainer = document.getElementById("videoContainercom");
  const cinematicFade = document.getElementById("cinematicFadecom");
  const grayOverlay = document.getElementById("grayOverlay");

  // si la vidéo a déjà été vue, montrer bouton directement
  if (localStorage.getItem("commerce_video_seen") === "true") {
    grayOverlay.style.opacity = 0;
    validateBtn.style.display = "block";
    return;
  }

  if (!video) {
    console.error("⚠️ Video introuvable");
    return;
  }

  /* ========= FADE-IN VIDÉO + grisage fond ========= */
  function showVideo() {
    grayOverlay.style.opacity = 1; // griser le fond
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

  /* ========= FADE-OUT + RECHARGE PAGE ========= */
  function endVideo() {
    localStorage.setItem("commerce_video_seen", "true");

    cinematicFade.classList.add("active");
    setTimeout(() => {
      window.location.reload(); // recharge la page pour montrer le fond coloré et bouton
    }, 1200);
  }

  /* ========= SON ON/OFF ========= */
  soundBtn?.addEventListener("click", () => {
    video.muted = !video.muted;
    soundBtn.textContent = video.muted ? "🔇" : "🔊";
  });

  /* ========= FERMER VIDÉO ========= */
  closeBtn?.addEventListener("click", endVideo);

  /* ========= FIN VIDÉO ========= */
  video.addEventListener("ended", endVideo);

  /* ========= VALIDATION QUÊTE ========= */
  validateBtn?.addEventListener("click", () => {
    localStorage.setItem("task_commerce_done", "true");
    window.location.href = "menu.html";
  });

  /* ========= LANCER VIDÉO ========= */
  showVideo();
});
