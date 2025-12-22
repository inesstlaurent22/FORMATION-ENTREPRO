document.addEventListener("DOMContentLoaded", () => {

  const tresor = document.getElementById("tresor");
  const video = document.getElementById("mainVideo");
  const videoContainer = document.getElementById("videoContainer");
  const loader = document.getElementById("videoLoader");
  const overlay = document.getElementById("cinematicOverlay");
  const soundButton = document.getElementById("soundButton");
  const closeVideo = document.getElementById("closeVideo");
  const diamondLayer = document.getElementById("diamondLayer");

  const colors = ["#FFD700","#00FFFF","#FF00FF","#00FF7F","#1E90FF","#FF4500"];
  
  function spawnDiamonds(x, y) {
    for (let i = 0; i < 35; i++) {
      const size = Math.random() * 12 + 10;
      const diamond = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      diamond.setAttribute("points", `${size} 0, ${size*2} ${size}, ${size} ${size*2}, 0 ${size}`);
      diamond.setAttribute("fill", colors[Math.floor(Math.random()*colors.length)]);
      diamond.style.transform = `translate(${x}px, ${y}px) rotate(0deg)`;
      diamond.style.transition = "transform 1.6s ease-out, opacity 1.6s";
      diamondLayer.appendChild(diamond);
      requestAnimationFrame(() => {
        const dx = (Math.random()-0.5)*400;
        const dy = Math.random()*300 + 200;
        diamond.style.transform = `translate(${x+dx}px, ${y+dy}px) rotate(${Math.random()*720}deg)`;
        diamond.style.opacity = "0";
      });
      setTimeout(() => diamond.remove(), 1600);
    }
  }

  async function handleTresorClick(e) {
    // explosion gems
    const x = e.clientX || window.innerWidth/2;
    const y = e.clientY || window.innerHeight/2;
    spawnDiamonds(x, y);

    // animation coffre
    tresor.classList.add("open");
    overlay.classList.add("active");
    if (navigator.vibrate) navigator.vibrate(80);

    // attente 2s
    await wait(2000);

    // loader
    loader.classList.add("show");
    await wait(1500);
    loader.classList.remove("show");

    // vidéo
    videoContainer.style.display = "flex";
    requestAnimationFrame(() => videoContainer.classList.add("show"));
    video.currentTime = 0;
    video.muted = true;
    video.play().catch(() => {});
  }

  tresor.addEventListener("click", handleTresorClick);

  function finish() {
    video.pause();
    videoContainer.classList.remove("show");
    overlay.classList.remove("active");
    setTimeout(() => window.location.href = "menu.html", 800);
  }

  video.addEventListener("ended", finish);
  closeVideo.addEventListener("click", finish);

  soundButton.addEventListener("click", () => {
    video.muted = !video.muted;
    soundButton.textContent = video.muted ? "🔊" : "🔇";
  });

});

function wait(ms){return new Promise(res=>setTimeout(res,ms))}
