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
      enablePirate5Hover();
    }, 400);
  }

  // ===============================
  // ✨ HOVER UNIQUEMENT PIRATE 5
  // ===============================
  function enablePirate5Hover() {
    pirate5.addEventListener("mouseenter", () => {
      pirate5.style.filter = "drop-shadow(0 0 30px gold)";
    });

    pirate5.addEventListener("mouseleave", () => {
      pirate5.style.filter = "";
    });
  }

  function disablePirate5Hover() {
    pirate5.style.filter = "";
    pirate5.onmouseenter = null;
    pirate5.onmouseleave = null;
  }

  // ===============================
  // 💬 DIALOGUES AVEC BULLES
  // ===============================
  const dialogues = [
    { speaker: pirate5, text: "🏴‍☠️ Te voilà enfin…" },
    { speaker: pirate2, text: "Capitaine, il veut apprendre à gérer son or !" },
    { speaker: pirate5, text: "Alors il devra faire les bons calculs." },
    { speaker: pirate2, text: "Même moi j’ai du mal avec les comptes…" },
    { speaker: pirate5, text: "Silence. Le Livre du Trésor s’ouvre." }
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
    disablePirate5Hover();
    dialogueIndex = 0;
    showDialogue();
  };

  function showDialogue() {
    const current = dialogues[dialogueIndex];
    bubble.textContent = current.text;
    bubble.classList.remove("hidden");

    const rect = current.speaker.getBoundingClientRect();
    bubble.style.left = rect.left + rect.width / 2 + "px";
    bubble.style.top = rect.top - 90 + "px";
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
  // 🧮 CALCULATRICE (PARTIE 1, 2, 3)
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
// 📖 MINI-JEU – PROGRESSION
// ===============================
let billViewed = false;

function toggleCalc() {
  document.getElementById("calc").classList.toggle("hidden");
}

// ---------- PARTIE 1 ----------
function showBill(client) {
  billViewed = true;
  const bill = document.getElementById("bill");

  const data = {
    A: "🧾 Barbe-Cuivre : 300 + 400 + 250 = <strong>950</strong>",
    B: "🧾 Vent-Noir : 200 + 350 + 300 = <strong>850</strong>",
    C: "🧾 Crâne-Rouge : 150 + 200 + 180 = <strong>530</strong>"
  };

  bill.innerHTML = data[client];
}

function chooseClient() {
  if (!billViewed) {
    msg1.textContent = "❌ Consulte d’abord un registre 🧾.";
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
  msg3.textContent = "✅ Il reste 350 à amortir.";
  amortMonth.classList.remove("hidden");
}

function checkMonthlyAmort(ok) {
  msgMonth.textContent = ok
    ? "🏆 Exact : 117 € par mois."
    : "❌ Mauvais montant.";
}
