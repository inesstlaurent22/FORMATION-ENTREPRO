// ===============================
// 🎬 VIDÉO D’INTRO – FINANCE
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("questVideo");
  const videoContainer = document.getElementById("videoContainer");
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
    if (videoContainer) videoContainer.classList.add("hidden");

    setTimeout(() => {
      if (background) background.classList.remove("hidden");
      if (pirate2) pirate2.classList.remove("hidden");
      if (pirate5) pirate5.classList.remove("hidden");
      if (financeGame) financeGame.classList.remove("hidden");
    }, 400);
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
let billViewed = false;

// 🧮 Toggle calculatrice
function toggleCalc() {
  const calc = document.getElementById("calc");
  if (calc) calc.classList.toggle("hidden");
}

// ===============================
// 🧾 PARTIE 1 – CLIENTS
// ===============================

// 🧾 Affiche uniquement les informations
function showBill(client) {
  const bill = document.getElementById("bill");
  if (!bill) return;

  billViewed = true;
  selectedClient = client;

  if (client === "A") {
    bill.innerHTML =
      "📜 Barbe-Cuivre<br>300 + 400 + 250 = <strong>950</strong> pièces d’or";
  }

  if (client === "B") {
    bill.innerHTML =
      "📜 Vent-Noir<br>200 + 350 + 300 = <strong>850</strong> pièces d’or";
  }
}

// ✅ Validation du choix client
function chooseClient() {
  const msg1 = document.getElementById("msg1");
  const part1 = document.getElementById("part1");
  const part2 = document.getElementById("part2");

  if (!billViewed || !selectedClient) {
    msg1.innerHTML = "❌ Consulte d’abord la fiche 🧾 d’un client.";
    return;
  }

  part1.classList.add("hidden");
  part2.classList.remove("hidden");
}

// ===============================
// 💰 PARTIE 2 – RÉSULTAT
// ===============================
function checkResult(correct) {
  const msg2 = document.getElementById("msg2");
  const part2 = document.getElementById("part2");
  const part3 = document.getElementById("part3");

  if (!correct) {
    msg2.innerHTML = "❌ Mauvais calcul. Réessaie.";
    return;
  }

  part2.classList.add("hidden");
  part3.classList.remove("hidden");
}

// ===============================
// 🛠️ PARTIE 3 – QUESTION 1
// Prix d’achat − provision
// ===============================
function checkAmortBase(correct) {
  const msg3 = document.getElementById("msg3");
  const amortMonth = document.getElementById("amortMonth");

  if (!correct) {
    msg3.innerHTML = "❌ Ce n’est pas le bon montant.";
    return;
  }

  msg3.innerHTML =
    "✅ Correct. 500 − 150 = <strong>350</strong> pièces d’or à amortir.";
  amortMonth.classList.remove("hidden");
}

// ===============================
// 📆 PARTIE 3 – QUESTION 2
// Amortissement mensuel
// ===============================
function checkMonthlyAmort(correct) {
  const msgMonth = document.getElementById("msgMonth");

  if (correct) {
    msgMonth.innerHTML =
      "🎉 Exact. Les amortissements mensuels sont de <strong>117 €</strong>.";
    // 🔗 Fin de quête possible ici
  } else {
    msgMonth.innerHTML = "❌ Ce n’est pas le bon montant.";
  }
}
