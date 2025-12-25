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
/* 💎 GEMS + 🪙 OR */
/* ===================== */

const canvas = document.getElementById("gemCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

function explodeTreasure(x, y) {
  for (let i = 0; i < 30; i++) particles.push(createGem(x, y));
  for (let i = 0; i < 20; i++) particles.push(createCoin(x, y));
}

function createGem(x, y) {
  return {
    type: "gem",
    x,
    y,
    vx: (Math.random() - 0.5) * 14,
    vy: (Math.random() - 0.5) * 14,
    size: Math.random() * 8 + 6,
    rotation: Math.random() * Math.PI,
    spin: (Math.random() - 0.5) * 0.3,
    color: `hsl(${Math.random() * 360},100%,65%)`,
    life: 90
  };
}

function createCoin(x, y) {
  return {
    type: "coin",
    x,
    y,
    vx: (Math.random() - 0.5) * 12,
    vy: (Math.random() - 0.5) * 12,
    size: Math.random() * 10 + 8,
    rotation: Math.random() * Math.PI,
    spin: (Math.random() - 0.5) * 0.25,
    life: 80
  };
}

function drawParticle(p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);

  if (p.type === "gem") {
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 30;
    ctx.fillStyle = p.color;

    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.lineTo(p.size * 0.8, 0);
    ctx.lineTo(0, p.size);
    ctx.lineTo(-p.size * 0.8, 0);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.shadowColor = "gold";
    ctx.shadowBlur = 20;
    ctx.fillStyle = "gold";
    ctx.beginPath();
    ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p, i) => {
    drawParticle(p);
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.35;
    p.rotation += p.spin;
    p.life--;
    if (p.life <= 0) particles.splice(i, 1);
  });

  requestAnimationFrame(animateParticles);
}
animateParticles();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

/* ===================== */
/* 🧰 COFFRE */
/* ===================== */

tresor.onclick = () => {
  clickSound.play();

  const rect = tresor.getBoundingClientRect();
  explodeTreasure(rect.left + rect.width / 2, rect.top + rect.height / 2);

  setTimeout(() => {
    loader.style.display = "flex";
    loaderText.textContent = "Gagne ce mini-jeu pour commencer ta quête 🏴‍☠️";
  }, 700);

  setTimeout(() => {
    loader.style.display = "none";
    startGame();
  }, 1900);
};

/* ===================== */
/* 🗺 MINI-JEU */
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

    const img = document.createElement("img");
    img.src = p.img;
    img.className = "map-piece inactive";

    wrapper.onclick = () => {
      if (wrapper.classList.contains("active")) return;

      clickSound.play();
      wrapper.classList.add("active");
      img.classList.remove("inactive");

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
    }, 2200);
  } else {
    errorSound.play();
    loader.style.display = "flex";
    loaderText.textContent = "Mauvais ordre… réessaie !";

    setTimeout(() => {
      loader.style.display = "none";
      startGame();
    }, 1600);
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
  soundToggle.textContent = video.muted ? "🔇" : "🔉";
  soundToggle.classList.toggle("muted", video.muted);
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
