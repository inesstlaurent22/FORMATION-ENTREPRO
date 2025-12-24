/* ========================= */
/* 🔧 ÉLÉMENTS */
/* ========================= */

const tresor = document.getElementById('tresor');
const mapGame = document.getElementById('mapGame');
const pieces = document.querySelectorAll('.map-piece');
const slots = document.querySelectorAll('.slot');
const message = document.getElementById('mapMessage');
const loader = document.getElementById('loaderScreen');
const videoContainer = document.getElementById('videoContainer');
const video = document.getElementById('mainVideo');

const clickSound = document.getElementById('clickSound');
const errorSound = document.getElementById('errorSound');

let placedCount = 0;

/* ========================= */
/* 💥 OUVERTURE COFFRE */
/* ========================= */

tresor.addEventListener('click', () => {
  mapGame.style.display = 'flex';
  shufflePieces();
});

/* ========================= */
/* 🔀 MÉLANGE */
/* ========================= */

function shufflePieces() {
  const container = document.getElementById('piecesContainer');
  [...pieces].sort(() => Math.random() - 0.5)
    .forEach(p => container.appendChild(p));
}

/* ========================= */
/* 🎯 DRAG & DROP */
/* ========================= */

pieces.forEach(piece => {
  piece.addEventListener('dragstart', e => {
    clickSound.play();
    e.dataTransfer.setData('order', piece.dataset.order);
  });
});

slots.forEach(slot => {
  slot.addEventListener('dragover', e => e.preventDefault());

  slot.addEventListener('drop', e => {
    e.preventDefault();
    const order = e.dataTransfer.getData('order');
    clickSound.play();

    if (slot.dataset.slot === order && !slot.hasChildNodes()) {
      const piece = document.querySelector(`.map-piece[data-order="${order}"]`);
      slot.appendChild(piece);
      piece.classList.add('placed');
      placedCount++;

      if (placedCount === 3) {
        successGame();
      }
    } else {
      errorSound.play();
      message.textContent = "❌ Mauvais emplacement !";
    }
  });
});

/* ========================= */
/* 🏆 SUCCÈS */
/* ========================= */

function successGame() {
  message.textContent = "🎉 Carte complétée !";

  setTimeout(() => {
    mapGame.style.display = 'none';
    loader.style.display = 'flex';

    setTimeout(() => {
      loader.style.display = 'none';
      videoContainer.style.display = 'flex';
      video.play();
    }, 1500);

  }, 800);
}

/* ========================= */
/* ❌ SORTIE VIDÉO */
/* ========================= */

video.addEventListener('ended', () => {
  window.location.href = 'menu.html';
});
