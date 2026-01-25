// ===============================
// 🎬 VIDÉO INTRO
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

  video.muted = true;
  video.play().catch(() => {});

  toggleSoundBtn.onclick = () => {
    video.muted = !video.muted;
    toggleSoundBtn.textContent = video.muted ? "🔇" : "🔊";
  };

  closeVideoBtn.onclick = endVideo;
  video.onended = endVideo;

  function endVideo() {
    video.pause();
    videoContainer.classList.add("hidden");
    setTimeout(() => {
      background.classList.remove("hidden");
      pirate2.classList.remove("hidden");
      pirate5.classList.remove("hidden");
    }, 400);
  }

  // ===============================
  // 💬 DIALOGUES PIRATE
  // ===============================
  const dialogues = [
    "🏴‍☠️ Te voilà enfin…",
    "L’or ne se compte pas au hasard.",
    "Un vrai pirate sait gérer ses trésors.",
    "Prépare-toi.",
    "Le Livre des Comptes s’ouvre…"
  ];

  let index = 0;

  const dialogueBox = document.createElement("div");
  dialogueBox.id = "dialogueBox";

  const loader = document.createElement("div");
  loader.id = "loader";
  loader.textContent = "⏳ Chargement…";
  loader.style.display = "none";

  background.appendChild(dialogueBox);
  background.appendChild(loader);

  pirate5.onclick = () => {
    index = 0;
    dialogueBox.textContent = dialogues[index];
    dialogueBox.style.display = "block";

    dialogueBox.onclick = () => {
      index++;
      if (index < dialogues.length) {
        dialogueBox.textContent = dialogues[index];
      } else {
        dialogueBox.style.display = "none";
        startLoader();
      }
    };
  };

  function startLoader() {
    loader.style.display = "block";
    setTimeout(() => {
      loader.style.display = "none";
      financeGame.classList.remove("hidden");
    }, 2000);
  }

  // ===============================
  // 🧮 CALCULATRICE
  // ===============================
  const calc = document.getElementById("calc");
  calc.addEventListener("keydown", e => {
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
// 📖 MINI-JEU
// ===============================
let selectedClient = null;
let billViewed = false;

function toggleCalc() {
  document.getElementById("calc").classList.toggle("hidden");
}

function showBill(client) {
  const bill = document.getElementById("bill");
  billViewed = true;
  selectedClient = client;

  bill.innerHTML = client === "A"
    ? "📜 Barbe-Cuivre : 300 + 400 + 250 = <strong>950</strong>"
    : "📜 Vent-Noir : 200 + 350 + 300 = <strong>850</strong>";
}

function chooseClient() {
  if (!billViewed) {
    document.getElementById("msg1").textContent =
      "❌ Consulte d’abord les registres 🧾.";
    return;
  }
  part1.classList.add("hidden");
  part2.classList.remove("hidden");
}

function checkResult(ok) {
  if (!ok) {
    msg2.textContent = "❌ Mauvais calcul.";
    return;
  }
  part2.classList.add("hidden");
  part3.classList.remove("hidden");
}

function checkAmortBase(ok) {
  if (!ok) {
    msg3.textContent = "❌ Mauvais montant.";
    return;
  }
  msg3.textContent = "✅ Il reste 350 à amortir.";
  amortMonth.classList.remove("hidden");
}

function checkMonthlyAmort(ok) {
  msgMonth.textContent = ok
    ? "🏆 Exact : 117 € par mois."
    : "❌ Mauvais montant.";
}
