// ===============================
// 🎬 VIDÉO INTRO – FINANCE
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
  // 💬 DIALOGUES ALTERNÉS
  // ===============================

  const dialogues = [
    { pirate: "pirate5", text: "🏴‍☠️ Te voilà enfin…" },
    { pirate: "pirate2", text: "😮 Capitaine, c’est lui dont je parlais !" },
    { pirate: "pirate5", text: "L’or ne se compte pas au hasard." },
    { pirate: "pirate2", text: "On doit vraiment tenir un livre de comptes ?" },
    { pirate: "pirate5", text: "Oui. Sinon les maires pirates prendront tout." },
    { pirate: "pirate2", text: "Alors apprends-lui, capitaine." },
    { pirate: "pirate5", text: "Très bien. Que le Livre des Comptes s’ouvre." }
  ];

  let dialogueIndex = 0;

  const dialogueBox = document.createElement("div");
  dialogueBox.id = "dialogueBox";
  dialogueBox.classList.add("hidden");
  background.appendChild(dialogueBox);

  const loader = document.createElement("div");
  loader.id = "loader";
  loader.textContent = "⏳ Chargement…";
  loader.classList.add("hidden");
  background.appendChild(loader);

  pirate5.onclick = () => {
    dialogueIndex = 0;
    showDialogue();
  };

  function showDialogue() {
    const current = dialogues[dialogueIndex];
    dialogueBox.textContent = current.text;
    dialogueBox.classList.remove("hidden");

    // Marque visuelle du pirate qui parle (optionnel)
    pirate5.style.filter = current.pirate === "pirate5" ? "brightness(1.2)" : "brightness(0.8)";
    pirate2.style.filter = current.pirate === "pirate2" ? "brightness(1.2)" : "brightness(0.8)";

    dialogueBox.onclick = () => {
      dialogueIndex++;
      if (dialogueIndex < dialogues.length) {
        showDialogue();
      } else {
        endDialogues();
      }
    };
  }

  function endDialogues() {
    dialogueBox.classList.add("hidden");
    pirate5.style.filter = "";
    pirate2.style.filter = "";

    loader.classList.remove("hidden");

    setTimeout(() => {
      loader.classList.add("hidden");
      financeGame.classList.remove("hidden");
    }, 2000);
  }

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
});

// ===============================
// 📖 MINI-JEU FINANCE
// ===============================

let selectedClient = null;
let billViewed = false;

function toggleCalc() {
  document.getElementById("calc").classList.toggle("hidden");
}

// 🧾 Infos client
function showBill(client) {
  const bill = document.getElementById("bill");
  billViewed = true;
  selectedClient = client;

  bill.innerHTML =
    client === "A"
      ? "📜 Barbe-Cuivre : 300 + 400 + 250 = <strong>950</strong>"
      : "📜 Vent-Noir : 200 + 350 + 300 = <strong>850</strong>";
}

// Validation client
function chooseClient() {
  if (!billViewed) {
    document.getElementById("msg1").textContent =
      "❌ Consulte d’abord les registres 🧾.";
    return;
  }
  part1.classList.add("hidden");
  part2.classList.remove("hidden");
}

// Partie 2
function checkResult(ok) {
  if (!ok) {
    msg2.textContent = "❌ Mauvais calcul.";
    return;
  }
  part2.classList.add("hidden");
  part3.classList.remove("hidden");
}

// Partie 3 – Q1
function checkAmortBase(ok) {
  if (!ok) {
    msg3.textContent = "❌ Mauvais montant.";
    return;
  }
  msg3.textContent = "✅ Il reste 350 à amortir.";
  amortMonth.classList.remove("hidden");
}

// Partie 3 – Q2
function checkMonthlyAmort(ok) {
  msgMonth.textContent = ok
    ? "🏆 Exact : 117 € par mois."
    : "❌ Mauvais montant.";
}
