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
  if (video) {
    video.muted = true;
    video.play().catch(() => {});
  }

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
    }, 400);
  }

  // ===============================
  // 🏴‍☠️ STYLE PIRATE POUR TOUS LES BOUTONS
  // ===============================
  document.querySelectorAll("button").forEach(btn => {
    btn.classList.add("pirateBtn");
  });

  // ===============================
  // 🧮 CALCULATRICE
  // ===============================
  const calc = document.getElementById("calc");
  if (calc) {
    calc.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        try {
          calc.value = Function("return " + calc.value)();
        } catch {
          calc.value = "Erreur";
        }
      }
    });
  }

  // ===============================
  // 💬 DIALOGUES PIRATE 5
  // ===============================
  const dialogues = [
    "🏴‍☠️ Ah… te voilà enfin.",
    "Ce trésor n’est pas fait pour les ignorants.",
    "Si tu veux commercer comme un vrai pirate…",
    "…tu dois savoir compter ton or.",
    "Prépare-toi. Le livre des comptes va s’ouvrir."
  ];

  let dialogueIndex = 0;

  const dialogueBox = document.createElement("div");
  dialogueBox.id = "dialogueBox";
  dialogueBox.style.position = "absolute";
  dialogueBox.style.bottom = "20px";
  dialogueBox.style.left = "50%";
  dialogueBox.style.transform = "translateX(-50%)";
  dialogueBox.style.background = "#1a1208";
  dialogueBox.style.border = "3px solid gold";
  dialogueBox.style.borderRadius = "12px";
  dialogueBox.style.padding = "16px";
  dialogueBox.style.color = "#f5e6c8";
  dialogueBox.style.maxWidth = "80%";
  dialogueBox.style.cursor = "pointer";
  dialogueBox.style.zIndex = "10";

  const loader = document.createElement("div");
  loader.id = "loader";
  loader.innerHTML = "⏳ Chargement…";
  loader.style.position = "absolute";
  loader.style.top = "50%";
  loader.style.left = "50%";
  loader.style.transform = "translate(-50%, -50%)";
  loader.style.fontSize = "24px";
  loader.style.color = "gold";
  loader.style.display = "none";
  loader.style.zIndex = "10";

  background.appendChild(dialogueBox);
  background.appendChild(loader);

  pirate5.addEventListener("click", () => {
    dialogueIndex = 0;
    dialogueBox.textContent = dialogues[dialogueIndex];
    dialogueBox.style.display = "block";

    dialogueBox.onclick = () => {
      dialogueIndex++;
      if (dialogueIndex < dialogues.length) {
        dialogueBox.textContent = dialogues[dialogueIndex];
      } else {
        dialogueBox.style.display = "none";
        startLoader();
      }
    };
  });

  function startLoader() {
    loader.style.display = "block";

    setTimeout(() => {
      loader.style.display = "none";
      financeGame.classList.remove("hidden");
    }, 2000);
  }
});

// ===============================
// 📖 MINI-JEU FINANCE
// ===============================

let selectedClient = null;
let billViewed = false;

function toggleCalc() {
  document.getElementById("calc").classList.toggle("hidden");
}

// 🧾 INFOS CLIENT
function showBill(client) {
  const bill = document.getElementById("bill");
  billViewed = true;
  selectedClient = client;

  if (client === "A") {
    bill.innerHTML = "📜 Barbe-Cuivre : 300 + 400 + 250 = <strong>950</strong>";
  }
  if (client === "B") {
    bill.innerHTML = "📜 Vent-Noir : 200 + 350 + 300 = <strong>850</strong>";
  }
}

// ✅ CHOIX CLIENT
function chooseClient() {
  if (!billViewed) {
    document.getElementById("msg1").innerHTML =
      "❌ Consulte d’abord les registres 🧾.";
    return;
  }

  document.getElementById("part1").classList.add("hidden");
  document.getElementById("part2").classList.remove("hidden");
}

// 💰 PARTIE 2
function checkResult(correct) {
  if (!correct) {
    document.getElementById("msg2").innerHTML = "❌ Mauvais calcul.";
    return;
  }

  document.getElementById("part2").classList.add("hidden");
  document.getElementById("part3").classList.remove("hidden");
}

// 🛠️ PARTIE 3 – Q1
function checkAmortBase(correct) {
  if (!correct) {
    document.getElementById("msg3").innerHTML = "❌ Mauvais montant.";
    return;
  }

  document.getElementById("msg3").innerHTML =
    "✅ Il reste 350 pièces d’or à amortir.";
  document.getElementById("amortMonth").classList.remove("hidden");
}

// 📆 PARTIE 3 – Q2
function checkMonthlyAmort(correct) {
  document.getElementById("msgMonth").innerHTML = correct
    ? "🏆 Exact : 117 € par mois."
    : "❌ Mauvais montant.";
}
