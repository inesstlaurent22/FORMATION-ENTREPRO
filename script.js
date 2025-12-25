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
  for (let i = 0; i < 40; i++) {
    gems.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      size: Math.random() * 6 + 4,
      color: `hsl(${Math.random() * 360},100%,60%)`,
      life: 60
    });
  }
}

function animateGems() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  gems.forEach((g, i) => {
    ctx.fillStyle = g.color;
    ctx.beginPath();
    ctx.moveTo(g.x, g.y);
    ctx.lineTo(g.x + g.size, g.y + g.size);
    ctx.lineTo(g.x - g.size, g.y + g.size);
    ctx.closePath();
    ctx.fill();

    g.x += g.vx;
    g.y += g.vy;
    g.vy += 0.2;
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
    loader.classList.add("active");
    loader.style.display = "flex";
    loaderText.textContent = "Gagne ce mini jeux pour commencer ta quête 🥳";
  }, 1200);

  setTimeout(() => {
    loader.classList.remove("active");
    loader.style.display = "none";
    startGame();
  }, 2500);
};

/* ===================== */
/* 🗺 MINI JEU */
/* ===================== */

let order = [];
const correct = ["piece1","piece2","piece3"];

function startGame() {
  tresor.classList.add("hide");
  order = [];
  mapPieces.innerHTML = "";
  mapGame.style.display = "flex";

  const pieces = [
    { id:"piece1", img:"images/Carteminigauche.png" },
    { id:"piece2", img:"images/Carteminimilieu.png" },
    { id:"piece3", img:"images/Carteminidroite.png" }
  ];

  shuffle(pieces);

  pieces.forEach(p => {
    const img = document.createElement("img");
    img.src = p.img;
    img.className = "map-piece";
    img.dataset.id = p.id;

    img.onclick = () => {
      if (img.querySelector(".order-number")) return;
      order.push(p.id);

      const num = document.createElement("div");
      num.className = "order-number";
      num.textContent = order.length;
      img.appendChild(num);

      if (order.length === 3) checkResult();
    };

    mapPieces.appendChild(img);
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
    loader.classList.add("active");
    loader.style.display = "flex";
    loaderText.textContent = "Mauvais ordre… réessaie !";

    setTimeout(() => {
      loader.classList.remove("active");
      loader.style.display = "none";
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
