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

  // Autoplay sécurisé iOS
  video.muted = true;
  video.play().catch(() => {});

  toggleSoundBtn.addEventListener("click", () => {
    video.muted = !video.muted;
    toggleSoundBtn.textContent = video.muted ? "🔇" : "🔊";
  });

  closeVideoBtn.addEventListener("click", endVideo);
  video.addEventListener("ended", endVideo);

  function endVideo() {
    video.pause();
    videoContainer.classList.add("hidden");

    setTimeout(() => {
      background.classList.remove("hidden");
      pirate2.classList.remove("hidden");
      pirate5.classList.remove("hidden");
      financeGame.classList.remove("hidden");
    }, 400);
  }

  // ===============================
  // 🧮 CALCULATRICE (VRAI CALCUL)
  // ===============================
  const calc = document.getElementById("calc");
  calc.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      try {
        calc.value = Function("return " + calc.value)();
      } catch {
        calc.value = "Erreur";
      }
    }
  });
});

// ===============================
// 📖 MINI-JEU FINANCE
// ===============================

let selectedClient = null;

// 🧮 Toggle calculatrice
function toggleCalc() {
  document.getElementById("calc").classList.toggle("hidden");
}

// ===============================
// 🧾 PARTIE 1 – CLIENTS
// ===============================
function showBill(client) {
  const bill = document.getElementById("bill");

  if (client === "A") {
    bill.innerHTML = "📜 Barbe-Cuivre : 300 + 400 + 250 ";
  }
  if (client === "B") {
    bill.innerHTML = "📜 Vent-Noir : 200 + 350 + 300 ";
  }

  selectedClient = client;
}

function chooseClient() {
  if (!selectedClient) {
    document.getElementById("msg1").innerHTML =
      "❌ Consulte d’abord un client.";
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
      "❌ Mauvais calcul.";
    return;
  }

  document.getElementById("part2").classList.add("hidden");
  document.getElementById("part3").classList.remove("hidden");
}

// ===============================
// 🛠️ PARTIE 3 – QUESTION 1
// ===============================
function checkAmortBase(correct) {
  if (!correct) {
    document.getElementById("msg3").innerHTML =
      "❌ Ce n’est pas le bon montant.";
    return;
  }

  document.getElementById("msg3").innerHTML =
    "✅ Correct : 350 pièces d’or à amortir.";
  document.getElementById("amortMonth").classList.remove("hidden");
}

// ===============================
// 📆 PARTIE 3 – QUESTION 2
// ===============================
function checkMonthlyAmort(correct) {
  if (correct) {
    document.getElementById("msgMonth").innerHTML =
      "🎉 Exact : 117 € par mois.";
  } else {
    document.getElementById("msgMonth").innerHTML =
      "❌ Mauvais montant.";
  }
}
