// =========================
// VARIABLES
// =========================
const tresor = document.getElementById("tresor");
const loaderScreen = document.getElementById("loaderScreen");
const loaderText = document.getElementById("loaderText");
const mapGame = document.getElementById("mapGame");
const mapPiecesContainer = document.getElementById("mapPieces");
const errorMessage = document.getElementById("errorMessage");
const victoryScreen = document.getElementById("victoryScreen");

const videoContainer = document.getElementById("videoContainer");
const mainVideo = document.getElementById("mainVideo");
const closeVideo = document.getElementById("closeVideo");
const soundToggle = document.getElementById("soundToggle");

const cinematicFade = document.getElementById("cinematicFade");
const gemCanvas = document.getElementById("gemCanvas");
const ctx = gemCanvas.getContext("2d");

let foundPieces = [];
const correctOrder = ["gauche", "milieu", "droite"];

// =========================
// COFFRE → MINI JEU
// =========================
tresor.addEventListener("click", () => {
  tresor.classList.add("hide");

  loaderScreen.style.display = "flex";

  let messages = [
    "Ouverture du coffre…",
    "Chargement de la carte…",
    "Prépare-toi…"
  ];

  let i = 0;
  loaderText.textContent = messages[i];

  let interval = setInterval(() => {
    i++;
    if (i >= messages.length) {
      clearInterval(interval);
      loaderScreen.style.display = "none";
      mapGame.style.display = "flex";
    } else {
      loaderText.textContent = messages[i];
    }
  }, 1200);

  generatePieces();
});

// =========================
// MINI-JEU — GÉNÉRATION DES PIÈCES
// =========================
function generatePieces() {

  mapPiecesContainer.innerHTML = "";
  foundPieces = [];

  const pieces = [
    { id: "gauche", src: "images/Carteminigauche.png" },
    { id: "milieu", src: "images/Carteminimilieu.png" },
    { id: "droite", src: "images/Carteminidroite.png" }
  ];

  pieces.forEach(p => {
    const img = document.createElement("img");
    img.src = p.src;
    img.dataset.id = p.id;
    img.classList.add("map-piece");

    img.addEventListener("click", () => handlePiece(img));

    mapPiecesContainer.appendChild(img);
  });
}

// =========================
// GESTION DES CLICS
// =========================
function handlePiece(img) {

  const expected = correctOrder[foundPieces.length];

  // ❌ MAUVAISE
  if (img.dataset.id !== expected) {
    errorFeedback(img);
    return;
  }

  // ✅ BONNE PIECE
  img.classList.add("active");
  foundPieces.push(img.dataset.id);

  if (foundPieces.length === correctOrder.length) {
    setTimeout(showVictory, 500);
  }
}

// =========================
// FEEDBACK ERREUR
// =========================
function errorFeedback(img) {

  // clignotement message
  errorMessage.style.display = "block";
  errorMessage.style.animation = "blink 0.4s 3";

  // son si tu en as mis un
  const errorSound = document.getElementById("errorSound");
  if (errorSound) errorSound.play();

  // vibration pièce
  img.style.animation = "shake 0.4s";
  setTimeout(() => img.style.animation = "", 400);

  setTimeout(() => errorMessage.style.display = "none", 800);
}

// =========================
// VICTOIRE
// =========================
function showVictory() {

  mapGame.style.display = "none";
  victoryScreen.style.display = "flex";

  startGemExplosion();

  setTimeout(() => {
    victoryScreen.style.display = "none";
    playVideo();
  }, 2500);
}

// =========================
// VIDÉO
// =========================
function playVideo() {
  videoContainer.style.display = "flex";
  mainVideo.currentTime = 0;
  mainVideo.play();
}

closeVideo.addEventListener("click", () => {
  mainVideo.pause();
  cinematicTransition();
});

soundToggle.addEventListener("click", () => {
  mainVideo.muted = !mainVideo.muted;
  soundToggle.classList.toggle("muted");
});

// =========================
// TRANSITION CINÉMATIQUE
// =========================
function cinematicTransition() {
  cinematicFade.classList.add("active");
  setTimeout(() => window.location.href = "menu.html", 1200);
}

// =========================
// 💎 GEMS EXPLOSION
// =========================

let gems = [];

function startGemExplosion() {
  resizeCanvas();

  gems = [];

  for (let i = 0; i < 120; i++) {
    gems.push({
      x: gemCanvas.width / 2,
      y: gemCanvas.height / 2,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.5) * 14,
      size: Math.random() * 6 + 4,
      life: 1
    });
  }

  requestAnimationFrame(updateGems);
}

function resizeCanvas() {
  gemCanvas.width = window.innerWidth;
  gemCanvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);

function updateGems() {
  ctx.clearRect(0, 0, gemCanvas.width, gemCanvas.height);

  gems.forEach(g => {
    g.x += g.vx;
    g.y += g.vy;
    g.vy += 0.2;
    g.life -= 0.01;

    ctx.globalAlpha = g.life;
    ctx.beginPath();
    ctx.arc(g.x, g.y, g.size, 0, Math.PI * 2);
    ctx.fillStyle = "cyan";
    ctx.fill();
  });

  gems = gems.filter(g => g.life > 0);

  if (gems.length > 0) requestAnimationFrame(updateGems);
}
