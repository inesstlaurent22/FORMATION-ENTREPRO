const tresor = document.getElementById('tresor');
const videoContainer = document.getElementById('videoContainer');
const mainVideo = document.getElementById('mainVideo');
const closeVideo = document.getElementById('closeVideo');
const overlay = document.getElementById('cinematicOverlay');
const fond = document.querySelector('.Fondindex');
const loaderScreen = document.getElementById('loaderScreen');
const soundButton = document.getElementById('soundButton');

let alreadyTriggered = false;

/* ===================== */
/* 🎥 AUTOPLAY SAFE */
/* ===================== */
mainVideo.src = 'video/video1.mp4';
mainVideo.muted = true;          // OBLIGATOIRE
mainVideo.playsInline = true;
mainVideo.preload = 'auto';
mainVideo.load();

/* ===================== */
/* 🎬 CLICK COFFRE */
/* ===================== */
tresor.addEventListener('click', () => {

  // 💥 Explosion à chaque clic
  triggerExplosion();

  if (alreadyTriggered) return;
  alreadyTriggered = true;

  tresor.classList.add('active');

  setTimeout(() => {
    fond.classList.add('cinematic');
    overlay.classList.add('active');
  }, 1000);

  setTimeout(() => {
    loaderScreen.style.display = 'flex';

    mainVideo.oncanplaythrough = () => {
      loaderScreen.style.display = 'none';
      videoContainer.style.display = 'flex';
      soundButton.style.display = 'block';

      // AUTOPLAY MUET AUTORISÉ
      mainVideo.play().catch(() => {});
    };

  }, 3000);
});

/* 🔊 ACTIVER LE SON */
soundButton.addEventListener('click', () => {
  mainVideo.muted = false;
  soundButton.style.display = 'none';
});

/* SORTIE */
mainVideo.addEventListener('ended', goToMenu);
closeVideo.addEventListener('click', goToMenu);

function goToMenu() {
  mainVideo.pause();
  window.location.href = 'menu.html';
}

/* ===================== */
/* 💥 PARTICULES */
/* ===================== */
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
  gems.forEach(g => { g.update(); g.draw(); });
  requestAnimationFrame(animate);
}
animate();

function triggerExplosion() {
  const rect = tresor.getBoundingClientRect();
  explode(rect.left + rect.width / 2, rect.top + rect.height / 2);
}
