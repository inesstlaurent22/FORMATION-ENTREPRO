document.addEventListener('DOMContentLoaded', () => {

  const pirate1 = document.getElementById('pirate1');
  const pirate2 = document.getElementById('pirate2');
  const bubble = document.getElementById('infoBubble');
  const closeBubble = document.getElementById('closeBubble');
  const notification = document.getElementById('notification');

  /* 🔁 RESTAURATION ÉTAT */
  if (localStorage.getItem('pirate1') === 'unlocked') {
    pirate1.classList.remove('locked');
    pirate1.classList.add('unlocked');
  }

  /* 👉 CLIC PIRATE 1 */
  pirate1.addEventListener('click', () => {

    if (localStorage.getItem('pirate1') !== 'unlocked') {

      // 🔓 Déblocage
      pirate1.classList.remove('locked');
      pirate1.classList.add('unlocked', 'unlock-anim');
      localStorage.setItem('pirate1', 'unlocked');

      // 💬 Bulle
      bubble.style.display = 'block';

      // 🔔 Notification
      notification.classList.add('show');
      setTimeout(() => notification.classList.remove('show'), 2500);

      // Nettoyage animation
      setTimeout(() => pirate1.classList.remove('unlock-anim'), 1200);
    }
  });

  closeBubble.addEventListener('click', () => {
    bubble.style.display = 'none';
  });

});
