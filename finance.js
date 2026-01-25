// ===============================
// 🎬 VIDÉO D’INTRO – FINANCE
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const videoContainer = document.getElementById("videoContainer");
  const video = document.getElementById("questVideo");
  const toggleSoundBtn = document.getElementById("toggleSound");
  const closeVideoBtn = document.getElementById("closeVideo");

  const background = document.getElementById("background");
  const pirate2 = document.getElementById("pirate2bis");
  const pirate5 = document.getElementById("pirate5bis");
  const financeGame = document.getElementById("financeGame");

  // Sécurité autoplay iOS
  if (video) {
    video.muted = true;
    video.play().catch(() => {});
  }

  // 🔊 Toggle son
  if (toggleSoundBtn && video) {
    toggleSoundBtn.addEventListener("click", () => {
      video.muted = !video.muted;
      toggleSoundBtn.textContent = video.muted ? "🔇" : "🔊";
    });
  }

  // ⏭️ Passer la vidéo
  if (closeVideoBtn) closeVideoBtn.addEventListener("click", endVideo);

  // ⏱️ Fin naturelle de la vidéo
  if (video) video.addEventListener("ended", endVideo);

  function endVideo() {
    if (video) video.pause();
    if (videoContainer) videoContainer.classList.add("hidden");

    setTimeout(() => {
      if (background) background.classList.remove("hidden");

      // Apparition progressive des pirates
      setTimeout(() => pirate2 && pirate2.classList.remove("hidden"), 500);
      setTimeout(() => pirate5 && pirate5.classList.remove("hidden"), 1100);

      // Apparition du mini-jeu
      setTimeout(() => financeGame && financeGame.classList.remove("hidden"), 1800);
    }, 300);
  }
});


// ===============================
// 📖 MINI-JEU FINANCE – LOGIQUE
// ===============================

// 🧮 Calculatrice
function toggleCalc() {
  const calc = document.getElementById("calc");
  if (calc) calc.classList.toggle("hidden");
}

// 🧾 Affichage des achats clients
function showBill(client) {
  const bill = document.getElementById("bill");
  if (!bill) return;

  if (client === "A") {
    bill.innerHTML =
      "📜 Barbe-Cuivre : 300 + 400 + 250 = <strong>950</strong> pièces d’or";
  } else if (client === "B") {
    bill.innerHTML =
      "📜 Vent-Noir : 200 + 350 + 300 = <strong>850</strong> pièces d’or";
  }
}

// ✅ Validation du bon client
function validateClient() {
  const msg1 = document.getElementById("msg1");
  const part2 = document.getElementById("part2");

  if (msg1) {
    msg1.innerHTML = "✅ Excellent choix. C’est le client le plus rentable.";
  }
  if (part2) part2.classList.remove("hidden");
}

// 💰 Résultat annuel
function checkResult(correct) {
  const msg2 = document.getElementById("msg2");
  const part3 = document.getElementById("part3");

  if (correct) {
    if (msg2) msg2.innerHTML = "🏆 Exact. Le résultat est bien Produits − Charges.";
    if (part3) part3.classList.remove("hidden");
  } else {
    if (msg2) msg2.innerHTML = "❌ Mauvais calcul. Réessaie.";
  }
}

// 🛠️ Amortissement & provisions
function checkAmort(correct) {
  const msg3 = document.getElementById("msg3");

  if (correct) {
    if (msg3) msg3.innerHTML = "🎉 Mission accomplie. Le livre de comptes est équilibré.";
    // Hook KIT IN possible ici (sauvegarde, redirection, badge)
  } else {
    if (msg3) msg3.innerHTML = "❌ Ce n’est pas le bon montant.";
  }
}
