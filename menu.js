document.addEventListener('DOMContentLoaded', () => {

  /* ===================== */
  /* 🔒 ÉTAT INITIAL */
  /* ===================== */

  // Pirate 2 toujours débloqué
  const pirate2 = document.getElementById('pirate2');
  pirate2.classList.add('unlocked');
  pirate2.classList.remove('locked');

  // Pirate 1 bloqué au départ
  const pirate1 = document.getElementById('pirate1');

  if (localStorage.getItem('pirate1') === 'unlocked') {
    unlockPirate(pirate1, false);
  } else {
    pirate1.classList.add('locked');
    pirate1.classList.remove('unlocked');
  }

  /* ===================== */
  /* 💬 BULLE INFO */
  /* ===================== */

  const bubble = document.getElementById('infoBubble');
  const closeBubble = document.getElementById('closeBubble');

  pirate2.addEventListener('click', () => {

    // Afficher la bulle
    bubble.style.display = 'block';

    // Débloquer pirate 1 si pas encore fait
    if (!localStorage.getItem('pirate1')) {
      localStorage.setItem('pirate1', 'unlocked');
      unlockPirate(pirate1, true);
      showNotification('🏴‍☠️ Nouveau pirate débloqué !');
    }
  });

  closeBubble.addEventListener('click', () => {
    bubble.style.display = 'none';
  });

  /* ===================== */
  /* 🚀 PIRATES AVEC MISSIONS */
  /* ===================== */

  document.querySelectorAll('.pirate[data-page]').forEach(pirate => {
    pirate.addEventListener('click', () => {
      if (pirate.classList.contains('locked')) return;
      window.location.href = pirate.dataset.page;
    });
  });

});

/* ===================== */
/* ✨ FONCTIONS */
  /* ===================== */

function unlockPirate(pirate, animate = true) {
  pirate.classList.remove('locked');
  pirate.classList.add('unlocked');

  if (animate) {
    pirate.classList.add('unlock-anim');
    setTimeout(() => {
      pirate.classList.remove('unlock-anim');
    }, 1200);
  }
}

function showNotification(text) {
  let notif = document.getElementById('notification');

  if (!notif) {
    notif = document.createElement('div');
    notif.id = 'notification';
    document.body.appendChild(notif);
  }

  notif.textContent = text;
  notif.classList.add('show');

  setTimeout(() => {
    notif.classList.remove('show');
  }, 2500);
}
