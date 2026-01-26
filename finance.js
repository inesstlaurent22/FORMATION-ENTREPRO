// ===============================
// 🎬 VIDÉO + DIALOGUES
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
  // 💬 DIALOGUES
  // ===============================
  const dialogues = [
    { speaker: pirate5, text: "🏴‍☠️ Te voilà enfin…" },
    { speaker: pirate2, text: "Capitaine, il veut apprendre à compter l’or !" },
    { speaker: pirate5, text: "Alors il devra prouver sa valeur." }
  ];

  let dialogueIndex = 0;

  const bubble = document.createElement("div");
  bubble.id = "dialogueBox";
  bubble.classList.add("hidden");
  background.appendChild(bubble);

  pirate5.onclick = () => {
    disablePirate5Hover();
    showDialogue();
  };

  function showDialogue() {
    const d = dialogues[dialogueIndex];
    bubble.textContent = d.text;
    bubble.classList.remove("hidden");

    const rect = d.speaker.getBoundingClientRect();
    bubble.style.left = rect.left + rect.width / 2 + "px";
    bubble.style.top = rect.top - 90 + "px";
    bubble.style.transform = "translateX(-50%)";

    bubble.onclick = () => {
      dialogueIndex++;
      if (dialogueIndex < dialogues.length) {
        showDialogue();
      } else {
        bubble.classList.add("hidden");
        startMiniGame0();
      }
    };
  }

  // ===============================
  // 🎮 MINI-JEU 0 — QCM COMPTA
  // ===============================
  const miniGame0 = document.createElement("div");
  miniGame0.id = "miniGame0";
  miniGame0.innerHTML = `
    <h3>📘 Épreuve des registres</h3>
    <p id="qText"></p>
    <div id="qChoices"></div>
  `;
  miniGame0.classList.add("miniGame");
  background.appendChild(miniGame0);

  const questions = [
    {
      q: "À quoi sert le journal périodique des ventes ?",
      a: ["Pour noter toutes les ventes de la journée"],
      w: ["Pour compter l’or", "Pour payer les impôts"]
    },
    {
      q: "Pourquoi faut-il un livre des comptes mensuels ?",
      a: [
        "Pour avoir un point de vue extérieur sur les ventes du mois",
        "Pour comparer les ventes des différents mois"
      ],
      w: ["Pour décorer la boutique"]
    },
    {
      q: "Quels sont les deux livres des comptes annuels ?",
      a: ["Le bilan comptable", "Le Compte de Résultat"],
      w: ["Le journal de bord"]
    },
    {
      q: "À quoi sert le Compte de Résultat ?",
      a: ["À mesurer le résultat net de l’entreprise (son chiffre d’affaires)"],
      w: ["À compter les pirates"]
    }
  ];

  let qIndex = 0;

  function startMiniGame0() {
    miniGame0.classList.remove("hidden");
    showQuestion();
  }

  function showQuestion() {
    const q = questions[qIndex];
    document.getElementById("qText").textContent = q.q;
    const choices = document.getElementById("qChoices");
    choices.innerHTML = "";

    [...q.a.map(t => ({ t, ok: true })), ...q.w.map(t => ({ t, ok: false }))]
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
              financeGame.classList.remove("hidden");
            }
          } else {
            screenShake();
          }
        };
        choices.appendChild(btn);
      });
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
// 📖 MINI-JEU 1
// ===============================
let billViewed = false;

function toggleCalc() {
  document.getElementById("calc").classList.toggle("hidden");
}

function showBill(client) {
  billViewed = true;
  document.getElementById("bill").innerHTML = client === "A"
    ? "🧾 Barbe-Cuivre : TOTAL 950"
    : "🧾 Mauvais client";
}

function chooseClient() {
  if (!billViewed) return;

  if (document.getElementById("bill").textContent.includes("Barbe")) {
    part1.classList.add("hidden");
    part2.classList.remove("hidden");
  } else {
    screenShake();
    msg1.textContent = "❌ Mauvais client, recommence.";
  }
}

// ===============================
// 🧯 UTILITAIRE : SHAKE
// ===============================
function screenShake() {
  document.body.classList.add("shake");
  setTimeout(() => document.body.classList.remove("shake"), 400);
}
