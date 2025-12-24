/* ================================================= */
/* 🔧 ÉLÉMENTS DOM */
/* ================================================= */

const tresor = document.getElementById('tresor');
const overlay = document.getElementById('cinematicOverlay');
const fond = document.querySelector('.Fondindex');

const mapGame = document.getElementById('mapGame');
const mapPiecesContainer = document.querySelector('.map-pieces');
const mapPieces = Array.from(document.querySelectorAll('.map-piece'));
const mapMessage = document.getElementById('mapMessage');

const loaderScreen = document.getElementById('loaderScreen');
const loaderText = loaderScreen.querySelector('p');

const videoContainer = document.getElementById('videoContainer');
const mainVideo = document.getElementById('mainVideo');
const closeVideo = document.getElementById('closeVideo');
const soundButton = document.getElementById('soundButton');

/* SONS */
const clickSound = new Audio('sounds/Clic.mp3');
const errorSound = new Audio('sounds/Erreur.mp3');

let alreadyTriggered = false;
let currentNumber = 1;
let selectedOrder = [];

/* ================================================= */
/* 💥 GEMS */
/* ================================================= */

const canvas = document.getElementById('gemCanvas');
const ctx = canvas.getContext('2d');
let gems = [];
const gravity = 0.45;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Gem {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 12;
    this.vy = Math.random() * -14 - 6;
    this.size = Math.random() * 6 + 4;
    this.life = 1;
    this.color = ['#ffd600', '#ff4081', '#00e5ff']
      [Math.floor(Math.random() * 3)];
  }
  update() {
    this.vy += gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.life -= 0.02;
  }
  draw() {
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

function explode(x, y) {
  for (let i = 0; i < 60; i++) {
    gems.push(new Gem(x, y));
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  gems = gems.filter(g => g.life > 0);
  gems.forEach(g => { g.update(); g.draw(); });
  requestAnimationFrame(animate);
}
animate();

function triggerExplosion() {
  const rect = tresor.getBoundingClientRect();
  explode(rect.left + rect.width / 2, rect.top + rect.height / 2);
}

/* ================================================= */
/* 🎬 CLICK COFFRE */
/* ================================================= */

tresor.addEventListener('click', () => {
  if (alreadyTriggered) return;
  alreadyTriggered = true;

  triggerExplosion();

  setTimeout(() => {
    overlay.classList.add('active');
  }, 600);

  setTimeout(() => {
    showLoader(
      '🏴‍☠️',
      'Gagne ce mini-jeu pour commencer l’aventure'
    );
  }, 1400);

  setTimeout(startMiniGame, 2800);
});

/* ================================================= */
/* ⏳ LOADER */
/* ================================================= */

function showLoader(icon, text) {
  loaderScreen.style.display = 'flex';
  loaderScreen.querySelector('.loader-gem').textContent = icon;
  loaderText.textContent = text;
}

function hideLoader() {
  loaderScreen.style.display = 'none';
}

/* ================================================= */
/* 🗺️ MINI-JEU */
/* ================================================= */

function startMiniGame() {
  hideLoader();
  mapGame.style.display = 'flex';
  resetGame();
}

function resetGame() {
  currentNumber = 1;
  selectedOrder = [];
  mapMessage.textContent = 'Clique les morceaux dans le bon ordre';

  mapPieces.forEach(p => {
    p.classList.remove('selected');
    p.querySelector('.order-number')?.remove();
  });

  shufflePieces();
}

function shufflePieces() {
  mapPiecesContainer.innerHTML = '';
  mapPieces
    .sort(() => Math.random() - 0.5)
    .forEach(p => mapPiecesContainer.appendChild(p));
}

mapPieces.forEach(piece => {
  piece.addEventListener('click', () => {
    if (piece.classList.contains('selected')) return;

    clickSound.currentTime = 0;
    clickSound.play();

    piece.classList.add('selected');
    selectedOrder.push(piece.dataset.order);

    const badge = document.createElement('div');
    badge.className = 'order-number';
    badge.textContent = currentNumber;
    piece.appendChild(badge);

    currentNumber++;

    if (currentNumber > 3) {
      checkResult();
    }
  });
});

function checkResult() {
  const success = selectedOrder.join('') === '123';

  if (success) {
    mapMessage.textContent = '🎉 Bravo !';
    setTimeout(startVideoSequence, 1200);
  } else {
    errorSound.currentTime = 0;
    errorSound.play();

    mapGame.style.display = 'none';
    showLoader('❌', 'Tu as échoué, réessaye !');

    setTimeout(startMiniGame, 2000);
  }
}

/* ================================================= */
/* 🎥 VIDÉO */
/* ================================================= */

function startVideoSequence() {
  mapGame.style.display = 'none';
  showLoader('🏴‍☠️', 'Chargement du trésor…');

  setTimeout(() => {
    hideLoader();
    videoContainer.style.display = 'flex';
    soundButton.style.display = 'flex';
    mainVideo.muted = true;
    mainVideo.play();
  }, 1500);
}

soundButton.addEventListener('click', () => {
  mainVideo.muted = false;
  soundButton.style.display = 'none';
});

mainVideo.addEventListener('ended', () => {
  window.location.href = 'menu.html';
});
closeVideo.addEventListener('click', () => {
  window.location.href = 'menu.html';
});
