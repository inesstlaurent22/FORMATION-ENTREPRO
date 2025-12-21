/* ===================== */
/* 🧠 PROGRESSION */
/* ===================== */
const unlockMap = {
  pirate1: 'pirate3',
  pirate3: 'pirate5',
  pirate5: 'pirate4'
};

document.addEventListener('DOMContentLoaded', () => {

  /* ===================== */
  /* 🔁 APPLIQUER L'ÉTAT SAUVEGARDÉ */
  /* ===================== */
  Object.values(unlockMap).forEach(id => {
    if (localStorage.getItem(id) === 'unlocked') {
      const el = document.getElementById(id);
      if (el) {
        el.classList.remove('locked');
        el.classList.add('unlocked');
      }
    }
  });

  /* ===================== */
  /* 💬 PIRATE 2 = INFO + DÉBLOCAGE PIRATE 1 */
  /* ===================== */
  const pirate2 = document.getElementById('pirate2');
  const pirate1 = document.getElementById('pirate1');
  const bubble = document.getElementById('infoBubble');
  const closeBubble = document.getElementById('closeBubble');

  pirate2.addEventListener('click', () => {
    // Afficher la bulle
    bubble.style.display = 'block';

    // 🔓 Débloquer le pirate 1 (une seule fois)
    if (localStorage.getItem('pirate1') !== 'unlocked') {
      pirate1.classList.remove('locked');
      pirate1.classList.add('unlocked');
      localStorage.setItem('pirate1', 'unlocked');
    }
  });

  closeBubble.addEventListener('click', () => {
    bubble.style.display = 'none';
  });

  /* ===================== */
  /* 🚀 PIRATES MISSIONS */
  /* ===================== */
  document.querySelectorAll('.pirate[data-page]').forEach(pirate => {
    pirate.addEventListener('click', () => {
      const pirateId = pirate.id;
      localStorage.setItem('lastPirate', pirateId);
      window.location.href = pirate.dataset.page;
    });
  });

});

/* ===================== */
/* 🔓 À APPELER À LA FIN DES PAGES MISSIONS */
/* ===================== */
function unlockNextPirate() {
  const lastPirate = localStorage.getItem('lastPirate');
  const next = unlockMap[lastPirate];

  if (next) {
    localStorage.setItem(next, 'unlocked');
  }

  window.location.href = 'menu.html';
}
