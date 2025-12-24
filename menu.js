/* ===================== */
/* 🧠 PROGRESSION */
/* ===================== */
const unlockMap = {
  pirate1: 'pirate3',
  pirate3: 'pirate5',
  pirate5: 'pirate4'
};

document.addEventListener('DOMContentLoaded', () => {

  // Appliquer l'état sauvegardé
  Object.values(unlockMap).forEach(id => {
    if (localStorage.getItem(id) === 'unlocked') {
      document.getElementById(id).classList.remove('locked');
      document.getElementById(id).classList.add('unlocked');
    }
  });

  /* ===================== */
  /* 💬 PIRATE 2 = INFO */
  /* ===================== */
  const pirate2 = document.getElementById('pirate2');
  const bubble = document.getElementById('infoBubble');
  const closeBubble = document.getElementById('closeBubble');

  pirate2.addEventListener('click', () => {
    bubble.style.display = 'block';
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
