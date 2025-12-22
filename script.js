document.addEventListener("DOMContentLoaded", () => {

  const tresor = document.getElementById("tresor");
  const videoContainer = document.getElementById("videoContainer");
  const video = document.getElementById("mainVideo");
  const closeVideo = document.getElementById("closeVideo");
  const soundButton = document.getElementById("soundButton");
  const overlay = document.getElementById("cinematicOverlay");
  const gemCanvas = document.getElementById("gemCanvas");

  /* =========================
     💎 GEM EFFECT MULTICOLOR
  ========================= */
  const ctx = gemCanvas.getContext("2d");

  function resizeCanvas() {
    gemCanvas.width = window.innerWidth;
    gemCanvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const gemColors = [
    "#FFD700",
    "#00FFFF",
    "#FF00FF",
    "#00FF00",
    "#1E90FF",
    "#FF4500",
    "#8A2BE2"
  ];

  let gems = [];

  function spawnGems(x, y) {
    for (let i = 0; i < 40; i++) {
      gems.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: Math.random() * -10 - 4,
        life: 80,
        size: Math.random() * 6 + 4,
        color: gemColors[Math.floor(Math.random() * gemColors.length)]
      });
    }
  }

  function animateGems() {
    ctx.clearRect(0, 0, gemCanvas.width, gemCanvas.height);

    gems = gems.filter(g => g.life > 0);

    gems.forEach(g => {
      g.x += g.vx;
      g.y += g.vy;
      g.vy += 0.35;
      g.life--;

      ctx.fillStyle = g.color;
      ctx.fillRect(g.x, g.y, g.size, g.size);
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
     🎬 FIN VIDÉO → MENU
  ========================= */
  video.addEventListener("ended", () => {
    window.location.href = "menu.html";
  });

  /* =========================
     ❌ FERMER VIDÉO → MENU
  ========================= */
  closeVideo.addEventListener("click", () => {
    video.pause();
    overlay.classList.remove("active");
    videoContainer.classList.remove("show");

    setTimeout(() => {
      window.location.href = "menu.html";
    }, 500);
  });

  /* =========================
     🔊 SON
  ========================= */
  soundButton.addEventListener("click", () => {
    video.muted = !video.muted;
    soundButton.textContent = video.muted ? "🔊" : "🔇";
  });

});
