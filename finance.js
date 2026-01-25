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

      setTimeout(() => pirate2 && pirate2.classList.remove("hidden"), 500);
      setTimeout(() => pirate5 && pirate5.classList.remove("hidden"), 1100);
      setTimeout(() => financeGame && financeGame.classList.remove("hidden"), 1800);
    }, 300);
  }

  // 🧮 Calculatrice – vrai calcul
  const calcInput = document.getElementById("calc");
  if (calcInput) {
    calcInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        try {
          const result = Function("return " + calcInput.value)();
          calcInput.value = result;
        } catch {
          calcInput.value = "Erreur";
        }
      }
    });
  }
});


// ===============================
// 📖 MINI-JEU FINANCE – LOGIQUE
// ===============================

// 🧮 Affichage calculatrice
function toggleCalc() {
  const calc = document.getElementById("calc");
  if (calc) calc.classList.toggle("hidden");
}

// ===============================
// 🧾 PARTIE 1 – CLIENTS
// ===============================
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

function validateClient() {
  document.getElementById("msg1").innerHTML =
    "✅ Bon raisonnement. Tu as identifié le meilleur client.";
  document.getElementById("part2").classList.remove("hidden");
}

// ===============================
// 💰 PARTIE 2 – RÉSULTAT
// ===============================
function checkResult(correct) {
  const msg2 = document.getElementById("msg2");
  const part3 = document.getElementById("part3");

  if (correct) {
    msg2.innerHTML =
      "🏆 Exact. Le résultat se calcule bien avec Produits − Charges.";
    part3.classList.remove("hidden");
  } else {
    msg2.innerHTML = "❌ Ce n’est pas le bon calcul.";
  }
}

// ===============================
// 🛠️ PARTIE 3 – AMORTISSEMENT
// ===============================
function checkAmort(correct) {
  const msg3 = document.getElementById("msg3");
  const amortMonth = document.getElementById("amortMonth");

  if (correct) {
    msg3.innerHTML =
      "✅ Correct. 350 pièces d’or sont amorties sur 3 ans.";
    amortMonth.classList.remove("hidden");
  } else {
    msg3.innerHTML = "❌ Mauvais montant. Réessaie.";
  }
}

// ===============================
// 📆 PARTIE 3 BIS – AMORTISSEMENT MENSUEL
// ===============================
function checkMonthlyAmort(correct) {
  const msgMonth = document.getElementById("msgMonth");

  if (correct) {
    msgMonth.innerHTML =
      "🎉 Exact. Les amortissements mensuels sont de <strong>117 €</strong>.";
    // Hook KIT IN final possible ici
  } else {
    msgMonth.innerHTML = "❌ Ce n’est pas le bon montant.";
  }
}
