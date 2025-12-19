const tresor = document.getElementById('tresor');
const videoContainer = document.getElementById('videoContainer');
const mainVideo = document.getElementById('mainVideo');
const closeVideo = document.getElementById('closeVideo');
const overlay = document.getElementById('cinematicOverlay');
const fond = document.querySelector('.Fondindex');

let alreadyTriggered = false;

/* ===================== */
/* 🎥 PRÉCHARGEMENT VIDÉO */
/* ===================== */
mainVideo.src = 'video/video1.MOV';
mainVideo.preload = 'auto';
mainVideo.load();

/* ===================== */
/* 🎬 CLICK COFFRE */
/* ===================== */
tresor.addEventListener('click', () => {

  // 💥 Explosion À CHAQUE CLIC
  triggerExplosion();

  // Animation coffre + cinéma UNE SEULE FOIS
  if (alreadyTriggered) return;
  alreadyTriggered = true;

  tresor.classList.add('active');

  // Cinématique après 1s
  setTimeout(() => {
    fond.classList.add('cinematic');
    overlay.classList.add('active');
  }, 1000);

  // Vidéo après 3s
  setTimeout(() => {
    videoContainer.style.display = 'flex';
    mainVideo.currentTime = 0;
    mainVideo.play().catch(() => {});
  }, 3000);
});

// Fin vidéo ou fermeture
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
    this.rotation = Math.random() * Math.PI;
    this.spin = (Math.random() - 0.5) * 0.25;
    this.life = 1;
    this.color = ['#00e5ff','#ff4081','#7c4dff','#00e676','#ffd600']
      [Math.floor(Math.random() * 5)];
  }

  update() {
    this.vy += gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.spin;
    this.life -= 0.015;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;

    ctx.beginPath();
    ctx.moveTo(0, -this.size);
    ctx.lineTo(this.size, 0);
    ctx.lineTo(0, this.size);
    ctx.lineTo(-this.size, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
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
  explode(
    rect.left + rect.width / 2,
    rect.top + rect.height / 2
  );
}
