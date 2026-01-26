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

  // ===============================
  // 🌫️ FONDU + ÉCRAN DE RÉUSSITE
  // ===============================
  const success = document.createElement("div");
  success.style.position = "fixed";
  success.style.inset = 0;
  success.style.display = "flex";
  success.style.alignItems = "center";
  success.style.justifyContent = "center";
  success.style.background = "rgba(0,0,0,0.85)";
  success.style.color = "#f5e6c8";
  success.style.fontSize = "24px";
  success.style.opacity = 0;
  success.style.pointerEvents = "none";
  success.style.transition = "opacity 0.4s ease";
  success.style.zIndex = 9999;
  document.body.appendChild(success);

  function showSuccess(text, cb) {
    success.innerHTML = `<div><h2>✅ Réussite</h2><p>${text}</p></div>`;
    success.style.opacity = 1;
    success.style.pointerEvents = "auto";
    setTimeout(() => {
      success.style.opacity = 0;
      success.style.pointerEvents = "none";
      cb && cb();
    }, 1200);
  }

  // ===============================
  // 🎬 VIDÉO
  // ===============================
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
    }, 300);
  }

  function enablePirate5Hover() {
    pirate5.onmouseenter = () => pirate5.style.filter = "drop-shadow(0 0 30px gold)";
    pirate5.onmouseleave = () => pirate5.style.filter = "";
  }
  function disablePirate5Hover() {
    pirate5.style.filter = "";
    pirate5.onmouseenter = null;
    pirate5.onmouseleave = null;
  }

  // ===============================
  // 💬 DIALOGUES
  // ===============================
  const dialogueIntro = [
    { s: pirate5, t: "🏴‍☠️ Te voilà enfin…" },
    { s: pirate2, t: "Capitaine, il veut apprendre à gérer l’or !" },
    { s: pirate5, t: "Alors qu’il fasse ses preuves." }
  ];

  const dialogueAfterRegisters = [
    { s: pirate5, t: "Bien… tu maîtrises les registres." },
    { s: pirate2, t: "Passons aux clients !" }
  ];

  const dialogueFinal = [
    { s: pirate5, t: "Bravo, tu commences à connaître les particularités comptables." }
  ];

  let dIdx = 0, dArr = [];
  const bubble = document.createElement("div");
  bubble.id = "dialogueBox";
  bubble.classList.add("hidden");
  background.appendChild(bubble);

  pirate5.onclick = () => {
    disablePirate5Hover();
    startDialogues(dialogueIntro, startMiniGame0);
  };

  function startDialogues(arr, cb) {
    dArr = arr;
    dIdx = 0;
    bubble.classList.remove("hidden");
    showDialogue(cb);
  }

  function showDialogue(cb) {
    const d = dArr[dIdx];
    bubble.textContent = d.t;
    const r = d.s.getBoundingClientRect();
    bubble.style.left = r.left + r.width / 2 + "px";
    bubble.style.top = r.top - 90 + "px";
    bubble.style.transform = "translateX(-50%)";
    bubble.onclick = () => {
      dIdx++;
      if (dIdx < dArr.length) showDialogue(cb);
      else {
        bubble.classList.add("hidden");
        cb && cb();
      }
    };
  }

  // ===============================
  // 📘 MINI-JEU 0 – ÉPREUVE DES REGISTRES
  // ===============================
  const miniGame0 = document.getElementById("miniGame0");
  miniGame0.innerHTML = `
    <h3>📘 Épreuve des registres</h3>
    <p id="qText"></p>
    <div id="qChoices"></div>
  `;

  const questions = [
    {
      q: "À quoi sert le journal périodique des ventes ?",
      good: ["Pour noter toutes les ventes de la journée"],
      bad: ["Pour compter l’or", "Pour payer les impôts"]
    },
    {
      q: "Pourquoi faut-il un livre des comptes mensuels ?",
      good: [
        "Pour comparer les ventes des différents mois",
        "Pour avoir un point de vue extérieur sur les ventes du mois"
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
      good: ["À mesurer le résultat net de l’entreprise (son chiffre d’affaires)"],
      bad: ["À compter les pirates"]
    }
  ];

  let qIdx = 0;
  let goodCount = 0;

  function startMiniGame0() {
    miniGame0.classList.remove("hidden");
    qIdx = 0;
    showQuestion();
  }

  function showQuestion() {
    goodCount = 0;
    const q = questions[qIdx];
    document.getElementById("qText").textContent = q.q;
    const choices = document.getElementById("qChoices");
    choices.innerHTML = "";
    choices.style.display = "flex";
    choices.style.flexDirection = "column";
    choices.style.alignItems = "center";

    const all = [
      ...q.good.map(t => ({ t, ok: true })),
      ...q.bad.map(t => ({ t, ok: false }))
    ].sort(() => Math.random() - 0.5);

    all.forEach(choice => {
      const btn = document.createElement("button");
      btn.textContent = choice.t;
      btn.onclick = () => {
        if (choice.ok) {
          goodCount++;
          btn.disabled = true;
          btn.style.opacity = 0.6;
          if (goodCount === q.good.length) {
            qIdx++;
            if (qIdx < questions.length) showQuestion();
            else {
              miniGame0.classList.add("hidden");
              showSuccess("Épreuve des registres réussie", () =>
                startDialogues(dialogueAfterRegisters, startMiniGame1)
              );
            }
          }
        } else {
          screenShake();
        }
      };
      choices.appendChild(btn);
    });
  }

  // ===============================
  // 🧾 MINI-JEU 1
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
        try { calc.value = Function("return " + calc.value)(); }
        catch { calc.value = "Erreur"; }
      }
    });
  }

  // ===============================
  // 🏁 FIN
  // ===============================
  window.showFinalDialogue = function () {
    financeGame.classList.add("hidden");
    showSuccess("Mini-jeu terminé", () =>
      startDialogues(dialogueFinal, () => {})
    );
  };
});

// ===============================
// 🧾 MINI-JEU 1 – CLIENTS
// ===============================
let billViewed = false;

function toggleCalc() {
  document.getElementById("calc").classList.toggle("hidden");
}

function showBill(c) {
  billViewed = true;
  bill.innerHTML = {
    A: "🧾 Barbe-Cuivre : TOTAL 950",
    B: "🧾 Vent-Noir : TOTAL 850",
    C: "🧾 Crâne-Rouge : TOTAL 530"
  }[c];
}

function chooseClient() {
  if (!billViewed) return;
  if (bill.textContent.includes("Barbe-Cuivre")) {
    showSuccess("Bon client sélectionné", () => {
      part1.classList.add("hidden");
      part2.classList.remove("hidden");
    });
  } else {
    msg1.textContent = "❌ Mauvais client, recommence.";
    screenShake();
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
  showSuccess("Résultat annuel validé", () => {
    part2.classList.add("hidden");
    part3.classList.remove("hidden");
    document.getElementById("calc").classList.remove("hidden");
  });
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
  showSuccess("Amortissements maîtrisés", () => window.showFinalDialogue());
}

// ===============================
// 🧯 SHAKE
// ===============================
function screenShake() {
  document.body.classList.add("shake");
  setTimeout(() => document.body.classList.remove("shake"), 400);
}
