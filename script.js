document.addEventListener("DOMContentLoaded", () => {
  const tresor = document.getElementById("tresor");
  const videoContainer = document.getElementById("videoContainer");
  const video = document.getElementById("mainVideo");
  const closeVideo = document.getElementById("closeVideo");
  const soundButton = document.getElementById("soundButton");
  const overlay = document.getElementById("cinematicOverlay");
  const gemCanvas = document.getElementById("gemCanvas");

  /* =========================
     💎 GEM EFFECT
  ========================= */
  const ctx = gemCanvas.getContext("2d");
  gemCanvas.width = window.innerWidth;
  gemCanvas.height = window.innerHeight;

  let gems = [];

  function spawnGems(x, y) {
    for (let i = 0; i < 30; i++) {
      gems.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * -8 - 2,
        life: 60
      });
    }
  }

  function animateGems() {
    ctx.clearRect(0, 0, gemCanvas.width, gemCanvas.height);

    gems.forEach((g, i) => {
      g.x += g.vx;
      g.y += g.vy;
      g.vy += 0.25;
      g.life--;

      ctx.fillStyle = "gold";
      ctx.fillRect(g.x, g.y, 6, 6);

      if (g.life <= 0) gems.splice(i, 1);
    });

    requestAnimationFrame(animateGems);
  }
  animateGems();

  /* =========================
     🧰 CLIC TRÉSOR
  ========================= */
  tresor.addEventListener("click", (e) => {
    spawnGems(e.clientX, e.clientY);

    videoContainer.style.display = "flex";
    requestAnimationFrame(() => {
      videoContainer.classList.add("show");
    });

    overlay.classList.add("active");

    video.currentTime = 0;
    video.muted = true;
    video.play().catch(() => {});

    soundButton.style.display = "flex";
  });

  /* =========================
     ❌ FERMER VIDÉO
  ========================= */
  closeVideo.addEventListener("click", () => {
    video.pause();
    videoContainer.classList.remove("show");
    overlay.classList.remove("active");

    setTimeout(() => {
      videoContainer.style.display = "none";
    }, 800);
  });

  /* =========================
     🔊 SON
  ========================= */
  soundButton.addEventListener("click", () => {
    video.muted = !video.muted;
    soundButton.textContent = video.muted ? "🔊" : "🔇";
  });
});
