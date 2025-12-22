document.addEventListener("DOMContentLoaded", () => {

  const tresor = document.getElementById("tresor");
  const video = document.getElementById("mainVideo");
  const videoContainer = document.getElementById("videoContainer");
  const loader = document.getElementById("videoLoader");
  const overlay = document.getElementById("cinematicOverlay");
  const soundButton = document.getElementById("soundButton");
  const closeVideo = document.getElementById("closeVideo");
  const diamondLayer = document.getElementById("diamondLayer");

  /* ===== INTRO SKIP ===== */
  if (localStorage.getItem("introSeen")) {
    window.location.href = "menu.html";
  }

  /* ===== DIAMANTS ===== */
  const colors = [
    "#FFD700", // or
    "#00FFFF", // diamant
    "#FF00FF", // améthyste
    "#00FF7F", // émeraude
    "#1E90FF", // saphir
    "#FF4500", // rubis
    "#DA70D6"  // rose gem
  ];

  function createDiamond(x, y) {
    const size = Math.random() * 12 + 10;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const diamond = document.createElementNS("http://www.w3.org/2000/svg", "polygon");

    diamond.setAttribute("points", `
      ${size} 0,
      ${size * 2} ${size},
      ${size} ${size * 2},
      0 ${size}
    `);

    diamond.setAttribute("fill", color);
    diamond.setAttribute("opacity", "0.9");

    diamond.style.transform = `translate(${x}px, ${y}px) rotate(${Math.random() * 360}deg)`;
    diamond.style.transition = "transform 1.6s ease-out, opacity 1.6s";

    diamondLayer.appendChild(diamond);

    requestAnimationFrame(() => {
      const dx = (Math.random() - 0.5) * 400;
      const dy = Math.random() * 400 + 200;
      diamond.style.transform =
        `translate(${x + dx}px, ${y + dy}px) rotate(${Math.random() * 720}deg)`;
      diamond.style.opacity = "0";
    });

    setTimeout(() => diamond.remove(), 1600);
  }

  function spawnDiamonds(x, y) {
    for (let i = 0; i < 35; i++) {
      createDiamond(x, y);
    }
  }

  /* ===== CLIC COFFRE ===== */
  tresor.addEventListener("click", e => {

    tresor.classList.add("open");
    overlay.classList.add("active");

    const x = e.clientX || window.innerWidth / 2;
    const y = e.clientY || window.innerHeight / 2;

    spawnDiamonds(x, y);

    if (navigator.vibrate) navigator.vibrate(80);

    setTimeout(() => {
      loader.classList.add("show");

      setTimeout(() => {
        loader.classList.remove("show");
        videoContainer.style.display = "flex";
        requestAnimationFrame(() => videoContainer.classList.add("show"));
        video.play().catch(() => {});
      }, 1500);

    }, 2000);
  });

  /* ===== FIN ===== */
  function finishIntro() {
    localStorage.setItem("introSeen", "true");
    videoContainer.classList.remove("show");
    overlay.classList.remove("active");

    setTimeout(() => {
      window.location.href = "menu.html";
    }, 800);
  }

  video.addEventListener("ended", finishIntro);
  closeVideo.addEventListener("click", finishIntro);

  soundButton.onclick = () => {
    video.muted = !video.muted;
    soundButton.textContent = video.muted ? "🔊" : "🔇";
  };

});
