const tresor = document.getElementById("tresor");
const loader = document.getElementById("loaderScreen");
const loaderText = document.getElementById("loaderText");
const mapGame = document.getElementById("mapGame");
const mapPieces = document.getElementById("mapPieces");
const victory = document.getElementById("victoryScreen");
const videoContainer = document.getElementById("videoContainer");
const video = document.getElementById("mainVideo");
const soundToggle = document.getElementById("soundToggle");
const closeVideo = document.getElementById("closeVideo");
const cinematicFade = document.getElementById("cinematicFade");

const clickSound = document.getElementById("clickSound");
const errorSound = document.getElementById("errorSound");

/* ===================== */
/* 💎 GEMS */
/* ===================== */

const canvas = document.getElementById("gemCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gems = [];

function explodeGems(x, y) {
  for (let i = 0; i < 35; i++) {
    gems.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.5) * 12,
      size: Math.random() * 8 + 6,
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.2,
      color: `hsl(${Math.random() * 360},90%,65%)`,
      life: 80
    });
  }
}

function drawGem(g) {
  ctx.save();
  ctx.translate(g.x, g.y);
  ctx.rotate(g.rotation);

  ctx.beginPath();
  ctx.moveTo(0, -g.size);
  ctx.lineTo(g.size * 0.8, 0);
  ctx.lineTo(0, g.size);
  ctx.lineTo(-g.size * 0.8, 0);
  ctx.closePath();

  ctx.fillStyle = g.color;
  ctx.shadowColor = g.color;
  ctx.shadowBlur = 20;
  ctx.fill();

  ctx.restore();
}

function animateGems() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  gems.forEach((g, i) => {
    drawGem(g);
    g.x += g.vx;
    g.y += g.vy;
    g.vy += 0.25;
    g.rotation += g.spin;
    g.life--;
    if (g.life <= 0) gems.splice(i, 1);
  });

  requestAnimationFrame(animateGems);
}
animateGems();

/* ===================== */
/* 🧰 COFFRE */
/* ===================== */

tresor.onclick = (e) => {
  clickSound.play();
  explodeGems(e.clientX, e.clientY);

  setTimeout(() => {
    loader.style.display = "flex";
    loader.classList.add("active");
    loaderText.textContent = "Gagne ce mini-jeu pour commencer ta quête 🏴‍☠️";
  }, 1200);

  setTimeout(() => {
    loader.style.display = "none";
    loader.classList.remove("active");
    startGame();
  }, 2600);
};

/* ===================== */
/* 🗺 MINI JEU */
/* ===================== */

let order = [];
const correct = ["piece1", "piece2", "piece3"];

function startGame() {
  tresor.classList.add("hide");
  order = [];
  mapPieces.innerHTML = "";
  mapGame.style.display = "flex";

  const pieces = [
    { id: "piece1", img: "images/Carteminigauche.png" },
    { id: "piece2", img: "images/Carteminimilieu.png" },
    { id: "piece3", img: "images/Carteminidroite.png" }
  ];

  shuffle(pieces);

  pieces.forEach(p => {
    const wrapper = document.createElement("div");
    wrapper.className = "map-piece-wrapper";
    wrapper.dataset.id = p.id;

    const img = document.createElement("img");
    img.src = p.img;
    img.className = "map-piece";

    wrapper.onclick = () => {
      if (wrapper.querySelector(".order-number")) return;

      clickSound.play();
      order.push(p.id);

      const num = document.createElement("div");
      num.className = "order-number";
      num.textContent = order.length;
      wrapper.appendChild(num);

      if (order.length === 3) checkResult();
    };

    wrapper.appendChild(img);
    mapPieces.appendChild(wrapper);
  });
}

function checkResult() {
  mapGame.style.display = "none";

  if (JSON.stringify(order) === JSON.stringify(correct)) {
    victory.style.display = "flex";
    setTimeout(() => {
      victory.style.display = "none";
      launchVideo();
    }, 2500);
  } else {
    errorSound.play();
    loader.style.display = "flex";
    loader.classList.add("active");
    loaderText.textContent = "Mauvais ordre… réessaie !";

    setTimeout(() => {
      loader.style.display = "none";
      loader.classList.remove("active");
      startGame();
    }, 1800);
  }
}

/* ===================== */
/* 🎬 VIDÉO */
/* ===================== */

function launchVideo() {
  videoContainer.style.display = "flex";
  video.currentTime = 0;
  video.play();
}

soundToggle.onclick = () => {
  video.muted = !video.muted;
  soundToggle.textContent = video.muted ? "🔈" : "🔊";
};

video.onended = goToMenu;
closeVideo.onclick = goToMenu;

function goToMenu() {
  cinematicFade.classList.add("active");
  setTimeout(() => {
    window.location.href = "menu.html";
  }, 1200);
}

/* ===================== */
/* UTILS */
/* ===================== */

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
