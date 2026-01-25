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

  // Autoplay sécurisé iOS
  if (video) {
    video.muted = true;
    video.play().catch(() => {});
  }

  if (toggleSoundBtn && video) {
    toggleSoundBtn.addEventListener("click", () => {
      video.muted = !video.muted;
      toggleSoundBtn.textContent = video.muted ? "🔇" : "🔊";
    });
  }

  if (closeVideoBtn) closeVideoBtn.addEventListener("click", endVideo);
  if (video) video.addEventListener("ended", endVideo);

  function endVideo() {
    if (video) video.pause();
    videoContainer.classList.add("hidden");

    setTimeout(() => {
      background.classList.remove("hidden");
      setTimeout(() => pirate2.classList.remove("hidden"), 400);
      setTimeout(() => pirate5.classList.remove("hidden"), 900);
      setTimeout(() => financeGame.classList.remove("hidden"), 1400);
    }, 300);
  }

  // ===============================
  // 🧮 CALCULATRICE (VRAI CALCUL)
  // ===============================
  const calc = document.getElementById("calc");
  if (calc) {
    calc.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        try {
          const result = Function("return " + calc.value)();
          calc.value = result;
        } catch {
          calc.value = "Erreur";
        }
      }
    });
  }
});

// ===============================
// 📖 MINI-JEU FINANCE
// ===============================

let selectedClient = null;

// 🧮 afficher / masquer calculatrice
function toggleCalc() {
  document.getElementById("calc").classList.toggle("hidden");
}

// ===============================
// 🧾 PARTIE 1 – CLIENTS
// ===============================
function showBill(client) {
  const bill = document.getElementById("bill");

  if (client === "A") {
    bill.innerHTML =
      "📜 Barbe-Cuivre<br>300 + 400 + 250 = <strong>950</strong> pièces d’or";
  }

  if (client === "B") {
    bill.innerHTML =
      "📜 Vent-Noir<br>200 + 350 + 300 = <strong>850</strong> pièces d’or";
  }

  selectedClient = client;
}

function chooseClient() {
  if (!selectedClient) {
    document.getElementById("msg1").innerHTML =
      "❌ Choisis un client avant de valider.";
    return;
  }

  document.getElementById("part1").classList.add("hidden");
  document.getElementById("part2").classList.remove("hidden");
}

// ===============================
// 💰 PARTIE 2 – RÉSULTAT
// ===============================
function checkResult(correct) {
  if (!correct) {
    document.getElementById("msg2").innerHTML =
      "❌ Mauvais calcul. Réessaie.";
    return;
  }

  document.getElementById("part2").classList.add("hidden");
  document.getElementById("part3").classList.remove("hidden");
}

// ===============================
// 🛠️ PARTIE 3 – QUESTION 1
// Prix d’achat − provision
// ===============================
function checkAmortBase(correct) {
  if (!correct) {
    document.getElementById("msg3").innerHTML =
      "❌ Ce n’est pas le bon montant.";
    return;
  }

  document.getElementById("msg3").innerHTML =
    "✅ Correct. Il reste 350 pièces d’or à amortir.";
  document.getElementById("amortMonth").classList.remove("hidden");
}

// ===============================
// 📆 PARTIE 3 – QUESTION 2
// Amortissement mensuel
// ===============================
function checkMonthlyAmort(correct) {
  if (correct) {
    document.getElementById("msgMonth").innerHTML =
      "🎉 Exact. Les amortissements mensuels sont de <strong>117 €</strong>.";
  } else {
    document.getElementById("msgMonth").innerHTML =
      "❌ Ce n’est pas le bon montant.";
  }
}
