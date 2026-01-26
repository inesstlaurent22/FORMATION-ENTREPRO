// ===============================
// 🎬 VIDÉO + LOGIQUE GLOBALE
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("questVideo");
  const videoContainer = document.getElementById("videoContainer");
  const toggleSoundBtn = document.getElementById("toggleSound");
  const closeVideoBtn = document.getElementById("closeVideo");

  const background = document.getElementById("background");
  const pirate5 = document.getElementById("pirate5bis");
  const pirate2 = document.getElementById("pirate2bis");
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
      pirate5.classList.remove("hidden");
      pirate2.classList.remove("hidden");
      enablePirate5Hover();
    }, 400);
  }

  // ===============================
  // ✨ HOVER PIRATE 5
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
  // 💬 DIALOGUES – SÉQUENCES
  // ===============================
  const dialogueIntro = [
    { speaker: pirate5, text: "🏴‍☠️ Te voilà enfin…" },
    { speaker: pirate2, text: "Capitaine, il veut apprendre à gérer l’or !" },
    { speaker: pirate5, text: "Alors qu’il fasse ses preuves." }
  ];

  const dialogueAfterRegisters = [
    { speaker: pirate5, text: "Hmm… tu connais les registres." },
    { speaker: pirate2, text: "Voyons s’il sait choisir ses clients." }
  ];

  const dialogueFinal = [
    {
      speaker: pirate5,
      text: "Bravo, tu commences à connaître les particularités comptables."
    }
  ];

  let dialogueIndex = 0;
  let currentDialogue = [];

  const bubble = document.createElement("div");
  bubble.id = "dialogueBox";
  bubble.classList.add("hidden");
  background.appendChild(bubble);

  pirate5.onclick = () => {
    disablePirate5Hover();
    startDialogues(dialogueIntro, startMiniGame0);
  };

  function startDialogues(dialogueArray, callback) {
    currentDialogue = dialogueArray;
    dialogueIndex = 0;
    bubble.classList.remove("hidden");
    showDialogue(callback);
  }

  function showDialogue(callback) {
    const d = currentDialogue[dialogueIndex];
    bubble.textContent = d.text;

    const rect = d.speaker.getBoundingClientRect();
    bubble.style.left = rect.left + rect.width / 2 + "px";
    bubble.style.top = rect.top - 90 + "px";
    bubble.style.transform = "translateX(-50%)";

    bubble.onclick = () => {
      dialogueIndex++;
      if (dialogueIndex < currentDialogue.length) {
        showDialogue(callback);
      } else {
        bubble.classList.add("hidden");
        callback();
      }
    };
  }

  // ===============================
  // 📘 MINI-JEU 0 — ÉPREUVE DES REGISTRES
  // ===============================
  const miniGame0 = document.createElement("div");
  miniGame0.id = "miniGame0";
  miniGame0.classList.add("hidden");
  miniGame0.innerHTML = `
    <h3>📘 Épreuve des registres</h3>
    <p id="qText"></p>
    <div id="qChoices"></div>
  `;
  background.appendChild(miniGame0);

  const questions = [
    {
      q: "À quoi sert le journal périodique des ventes ?",
      good: ["Pour noter toutes les ventes de la journée"],
      bad: ["Pour compter l’or", "Pour payer les impôts"]
    },
    {
      q: "Pourquoi faut-il un livre des comptes mensuels ?",
      good: [
        "Pour avoir un point de vue extérieur sur les ventes du mois",
        "Pour comparer les ventes des différents mois"
      ],
      bad: ["Pour décorer la boutique"]
    },
    {
      q: "Quels sont les deux livres des comptes annuels ?",
      good: ["Le bilan comptable", "Le Compte de Résultat"],
      bad: ["Le journal de bord"]
    },
    {
      q: "À quoi sert le Compte de Résultat ?",
      good: [
        "À mesurer le résultat net de l’entreprise (son chiffre d’affaires)"
      ],
      bad: ["À compter les pirates"]
    }
  ];

  let qIndex = 0;

  function startMiniGame0() {
    miniGame0.classList.remove("hidden");
    qIndex = 0;
    showQuestion();
  }

  function showQuestion() {
    const q = questions[qIndex];
    document.getElementById("qText").textContent = q.q;
    const choices = document.getElementById("qChoices");
    choices.innerHTML = "";

    [...q.good.map(t => ({ t, ok: true })), ...q.bad.map(t => ({ t, ok: false }))]
      .sort(() => Math.random() - 0.5)
      .forEach(choice => {
        const btn = document.createElement("button");
        btn.textContent = choice.t;
        btn.onclick = () => {
          if (choice.ok) {
            qIndex++;
            if (qIndex < questions.length) {
              showQuestion();
            } else {
              miniGame0.classList.add("hidden");
              startDialogues(dialogueAfterRegisters, startMiniGame1);
            }
          } else {
            screenShake();
          }
        };
        choices.appendChild(btn);
      });
  }

  // ===============================
  // 🧾 MINI-JEU 1 → 2 → 3
  // ===============================
  function startMiniGame1() {
    financeGame.classList.remove("hidden");
    part1.classList.remove("hidden");
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

  // ===============================
  // 🏁 FIN DU JEU
  // ===============================
  window.showFinalDialogue = function () {
    financeGame.classList.add("hidden");
    startDialogues(dialogueFinal, () => {});
  };
});

// ===============================
// 🧾 MINI-JEU 1 – CLIENTS
// ===============================
let billViewed = false;

function toggleCalc() {
  document.getElementById("calc").classList.toggle("hidden");
}

function showBill(client) {
  billViewed = true;
  const bill = document.getElementById("bill");

  const data = {
    A: "🧾 Barbe-Cuivre : TOTAL 950",
    B: "🧾 Vent-Noir : TOTAL 850",
    C: "🧾 Crâne-Rouge : TOTAL 530"
  };

  bill.innerHTML = data[client];
}

function chooseClient() {
  if (!billViewed) return;

  if (document.getElementById("bill").textContent.includes("Barbe-Cuivre")) {
    part1.classList.add("hidden");
    part2.classList.remove("hidden");
  } else {
    screenShake();
    msg1.textContent = "❌ Mauvais client, recommence.";
  }
}

// ===============================
// 💰 MINI-JEU 2
// ===============================
function checkResult(ok) {
  if (!ok) {
    msg2.textContent = "❌ Mauvais calcul.";
    screenShake();
    return;
  }
  part2.classList.add("hidden");
  part3.classList.remove("hidden");
  document.getElementById("calc").classList.remove("hidden");
}

// ===============================
// 🛠️ MINI-JEU 3
// ===============================
function checkAmortBase(ok) {
  if (!ok) {
    msg3.textContent = "❌ Mauvais montant.";
    screenShake();
    return;
  }
  msg3.textContent = "✅ Il reste 350 pièces à amortir.";
  amortMonth.classList.remove("hidden");
}

function checkMonthlyAmort(ok) {
  if (!ok) {
    msgMonth.textContent = "❌ Mauvais montant.";
    screenShake();
    return;
  }
  msgMonth.textContent = "🏆 Exact : 117 € par mois.";
  setTimeout(() => window.showFinalDialogue(), 1200);
}

// ===============================
// 🧯 SHAKE
// ===============================
function screenShake() {
  document.body.classList.add("shake");
  setTimeout(() => document.body.classList.remove("shake"), 400);
}
