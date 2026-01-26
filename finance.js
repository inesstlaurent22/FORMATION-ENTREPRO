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
      enablePirateHover();
    }, 400);
  }

  // ===============================
  // ✨ ILLUMINATION PIRATES (HOVER)
  // ===============================
  function enablePirateHover() {
    [pirate2, pirate5].forEach(pirate => {
      pirate.addEventListener("mouseenter", () => {
        pirate.style.filter = "drop-shadow(0 0 25px gold)";
      });
      pirate.addEventListener("mouseleave", () => {
        pirate.style.filter = "";
      });
    });
  }

  function disablePirateHover() {
    [pirate2, pirate5].forEach(pirate => {
      pirate.style.filter = "";
      pirate.onmouseenter = null;
      pirate.onmouseleave = null;
    });
  }

  // ===============================
  // 💬 DIALOGUES AVEC BULLES ANCRÉES
  // ===============================
  const dialogues = [
    { speaker: pirate5, text: "🏴‍☠️ Te voilà enfin…" },
    { speaker: pirate2, text: "Capitaine ! C’est lui dont je te parlais !" },
    { speaker: pirate5, text: "L’or ne se compte pas au hasard." },
    { speaker: pirate2, text: "Alors il doit apprendre à compter." },
    { speaker: pirate5, text: "Très bien. Que le Livre des Comptes s’ouvre." }
  ];

  let dialogueIndex = 0;

  const bubble = document.createElement("div");
  bubble.id = "dialogueBox";
  bubble.classList.add("hidden");
  background.appendChild(bubble);

  const loader = document.createElement("div");
  loader.id = "loader";
  loader.textContent = "⏳ Chargement…";
  loader.classList.add("hidden");
  background.appendChild(loader);

  pirate5.onclick = () => {
    disablePirateHover();
    dialogueIndex = 0;
    showDialogue();
  };

  function showDialogue() {
    const current = dialogues[dialogueIndex];
    bubble.textContent = current.text;
    bubble.classList.remove("hidden");

    // Positionner la bulle sur le pirate qui parle
    const rect = current.speaker.getBoundingClientRect();
    bubble.style.left = rect.left + rect.width / 2 + "px";
    bubble.style.top = rect.top - 80 + "px";
    bubble.style.transform = "translateX(-50%)";

    bubble.onclick = () => {
      dialogueIndex++;
      if (dialogueIndex < dialogues.length) {
        showDialogue();
      } else {
        endDialogues();
      }
    };
  }

  function endDialogues() {
    bubble.classList.add("hidden");
    loader.classList.remove("hidden");

    setTimeout(() => {
      loader.classList.add("hidden");
      financeGame.classList.remove("hidden");
    }, 2000);
  }

  // ===============================
  // 🧮 CALCULATRICE (GLOBALE)
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
// 📖 MINI-JEU – LOGIQUE PAR PARTIE
// ===============================
let selectedClient = null;
let billViewed = false;

function toggleCalc() {
  document.getElementById("calc").classList.toggle("hidden");
}

// ---------- PARTIE 1 ----------
function showBill(client) {
  const bill = document.getElementById("bill");
  billViewed = true;
  selectedClient = client;

  bill.innerHTML =
    client === "A"
      ? "📜 Barbe-Cuivre : 300 + 400 + 250 = <strong>950</strong>"
      : "📜 Vent-Noir : 200 + 350 + 300 = <strong>850</strong>";
}

function chooseClient() {
  if (!billViewed) {
    msg1.textContent = "❌ Consulte d’abord le registre 🧾.";
    return;
  }
  part1.classList.add("hidden");
  part2.classList.remove("hidden");
}

// ---------- PARTIE 2 ----------
function checkResult(ok) {
  if (!ok) {
    msg2.textContent = "❌ Mauvais calcul.";
    return;
  }
  part2.classList.add("hidden");
  part3.classList.remove("hidden");
}

// ---------- PARTIE 3 ----------
function checkAmortBase(ok) {
  if (!ok) {
    msg3.textContent = "❌ Mauvais montant.";
    return;
  }
  msg3.textContent = "✅ Il reste 350 pièces à amortir.";
  amortMonth.classList.remove("hidden");
}

function checkMonthlyAmort(ok) {
  msgMonth.textContent = ok
    ? "🏆 Exact : 117 € par mois."
    : "❌ Mauvais montant.";
}
