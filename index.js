/* ================================================= */
/* 🔧 ÉLÉMENTS DOM */
/* ================================================= */

const tresor = document.getElementById('tresor');
const videoContainer = document.getElementById('videoContainer');
const mainVideo = document.getElementById('mainVideo');
const closeVideo = document.getElementById('closeVideo');
const overlay = document.getElementById('cinematicOverlay');
const fond = document.querySelector('.Fondindex');
const loaderScreen = document.getElementById('loaderScreen');
const soundButton = document.getElementById('soundButton');

/* MINI JEU */
const mapGame = document.getElementById('mapGame');
const mapPieces = document.querySelectorAll('.map-piece');
const mapMessage = document.getElementById('mapMessage');

let alreadyTriggered = false;
let currentStep = 1;

/* ================================================= */
/* 🎬 CLICK COFFRE */
/* ================================================= */

tresor.addEventListener('click', () => {

  if (alreadyTriggered) return;
  alreadyTriggered = true;

  triggerExplosion();
  tresor.classList.add('active');

  /* Effet cinématique */
  setTimeout(() => {
    fond.classList.add('cinematic');
    overlay.classList.add('active');
  }, 800);

  /* Affichage du mini-jeu */
  setTimeout(() => {
    mapGame.style.display = 'flex';
  }, 2000);
});

/* ================================================= */
/* 🗺️ MINI JEU – CARTE AU TRÉSOR */
/* ================================================= */

mapPieces.forEach(piece => {
  piece.addEventListener('click', () => {
    const order = parseInt(piece.dataset.order);

    if (order === currentStep) {
      piece.classList.add('used');
      currentStep++;

      if (currentStep > 3) {
        mapMessage.textContent = "🎉 Carte reconstituée !";

        setTimeout(() => {
          mapGame.style.display = 'none';
          startVideoSequence();
        }, 1200);
      }
    } else {
      mapMessage.textContent = "❌ Mauvais ordre, recommence !";
      resetMapGame();
    }
  });
});

function resetMapGame() {
  currentStep = 1;
  mapPieces.forEach(p => p.classList.remove('used'));
}

/* ================================================= */
/* 🎥 LANCEMENT VIDÉO */
/* ================================================= */

function startVideoSequence() {
  loaderScreen.style.display = 'flex';

  videoContainer.style.display = 'flex';
  soundButton.style.display = 'flex';

  mainVideo.muted = true;

  const playPromise = mainVideo.play();
  if (playPromise !== undefined) {
    playPromise.finally(() => {
      loaderScreen.style.display = 'none';
    });
  } else {
    loaderScreen.style.display = 'none';
  }
}

/* 🔊 ACTIVER LE SON */
soundButton.addEventListener('click', () => {
  mainVideo.muted = false;
  soundButton.style.display = 'none';
});

/* SORTIE VIDÉO */
mainVideo.addEventListener('ended', goToMenu);
closeVideo.addEventListener('click', goToMenu);

function goToMenu() {
  mainVideo.pause();
  window.location.href = 'menu.html';
}

/* ================================================= */
/* 💥 PARTICULES (GEMS) */
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
    this.color = ['#00e5ff','#ff4081','#7c4dff','#00e676','#ffd600']
      [Math.floor(Math.random() * 5)];
  }

  update() {
    this.vy += gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.life -= 0.015;
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
  gems.forEach(g => {
    g.update();
    g.draw();
  });
  requestAnimationFrame(animate);
}
animate();

function triggerExplosion() {
  const rect = tresor.getBoundingClientRect();
  explode(rect.left + rect.width / 2, rect.top + rect.height / 2);
}
