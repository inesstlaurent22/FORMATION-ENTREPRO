document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     🎬 VIDEO
  ===================================================== */
  const video = document.getElementById("questVideo");
  const videoContainer = document.getElementById("videoContainer");
  const toggleSoundBtn = document.getElementById("toggleSound");
  const closeVideoBtn = document.getElementById("closeVideo");

  const background = document.getElementById("background");
  const pirate5 = document.getElementById("pirate5bis");
  const pirate2 = document.getElementById("pirate2bis");

  const miniGame1 = document.getElementById("miniGame0");
  const financeGame = document.getElementById("financeGame");

  const partClients = document.getElementById("part1");
  const partResult = document.getElementById("part2");
  const partAmort = document.getElementById("part3");

  const calc = document.getElementById("calc");

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
    background.classList.remove("hidden");
    pirate5.classList.remove("hidden");
    pirate2.classList.remove("hidden");
  }

  /* =====================================================
     ✨ ILLUMINATION PIRATE 5 (HOVER)
  ===================================================== */
  pirate5.addEventListener("mouseenter", () => {
    pirate5.style.filter = "drop-shadow(0 0 30px gold)";
  });
  pirate5.addEventListener("mouseleave", () => {
    pirate5.style.filter = "";
  });

  /* =====================================================
     💬 DIALOGUES SYSTEM
  ===================================================== */
  const bubble = document.createElement("div");
  bubble.id = "dialogueBox";
  bubble.classList.add("hidden");
  background.appendChild(bubble);

  let dialogues = [];
  let dIndex = 0;

  function playDialogues(arr, callback) {
    dialogues = arr;
    dIndex = 0;
    bubble.classList.remove("hidden");
    showDialogue(callback);
  }

  function showDialogue(callback) {
    const d = dialogues[dIndex];
    bubble.textContent = d.t;

    const r = d.s.getBoundingClientRect();
    bubble.style.left = r.left + r.width / 2 + "px";
    bubble.style.top = r.top - 90 + "px";
    bubble.style.transform = "translateX(-50%)";

    bubble.onclick = () => {
      dIndex++;
      dIndex < dialogues.length ? showDialogue(callback) : (bubble.classList.add("hidden"), callback && callback());
    };
  }

  pirate5.onclick = () => {
    playDialogues(dialoguesDocs, startLoaderMiniGame1);
  };

  /* =====================================================
     💬 DIALOGUES – DOCUMENTS COMPTABLES
  ===================================================== */
  const dialoguesDocs = [
    { s: pirate5, t: "Pour bien gérer une boutique, il faut des documents comptables." },
    { s: pirate2, t: "Le journal des ventes note chaque vente quotidienne." },
    { s: pirate5, t: "Le grand livre regroupe les opérations par compte." },
    { s: pirate2, t: "La balance vérifie l’équilibre des comptes." },
    { s: pirate5, t: "Le compte de résultat mesure la rentabilité." }
  ];

  /* =====================================================
     ⏳ LOADER + INTRO MINI-JEU 1
  ===================================================== */
  function startLoaderMiniGame1() {
    const loader = document.createElement("div");
    loader.id = "loader";
    loader.innerHTML = `<h2>Chargement…</h2><p>Épreuve des registres</p>`;
    background.appendChild(loader);

    setTimeout(() => {
      loader.remove();
      startMiniGame1();
    }, 1500);
  }

  /* =====================================================
     🎮 MINI-JEU 1 — QCM (3 CHOIX)
  ===================================================== */
  miniGame1.innerHTML = `
    <h3>📘 Épreuve des registres</h3>
    <p id="qText"></p>
    <div id="qChoices"></div>
  `;

  const questions = [
    {
      q: "À quoi sert le journal des ventes ?",
      good: ["À noter toutes les ventes de la journée"],
      bad: ["À gérer les stocks", "À payer les impôts"]
    },
    {
      q: "Pourquoi tenir un grand livre ?",
      good: ["Pour regrouper les opérations par compte"],
      bad: ["Pour décorer la boutique", "Pour compter les clients"]
    },
    {
      q: "À quoi sert la balance ?",
      good: ["À vérifier l’équilibre des comptes"],
      bad: ["À compter les pirates", "À gérer la caisse"]
    },
    {
      q: "À quoi sert le compte de résultat ?",
      good: ["À mesurer la rentabilité"],
      bad: ["À ranger les factures", "À noter les stocks"]
    }
  ];

  let qIndex = 0;
  let goodCount = 0;

  function startMiniGame1() {
    miniGame1.classList.remove("hidden");
    qIndex = 0;
    showQuestion();
  }

  function showQuestion() {
    goodCount = 0;
    qText.textContent = questions[qIndex].q;
    qChoices.innerHTML = "";

    const answers = [
      ...questions[qIndex].good.map(t => ({ t, ok: true })),
      ...questions[qIndex].bad.map(t => ({ t, ok: false }))
    ].slice(0, 3).sort(() => Math.random() - 0.5);

    answers.forEach(ans => {
      const btn = document.createElement("button");
      btn.textContent = ans.t;

      btn.onclick = () => {
        if (ans.ok) {
          btn.classList.add("pressed");
          btn.disabled = true;
          goodCount++;
          if (goodCount === questions[qIndex].good.length) {
            qIndex++;
            qIndex < questions.length ? showQuestion() : endMiniGame1();
          }
        } else {
          screenShake();
        }
      };

      qChoices.appendChild(btn);
    });
  }

  function endMiniGame1() {
    miniGame1.classList.add("hidden");
    playDialogues(dialoguesAnalysis, startMiniGame2);
  }

  /* =====================================================
     💬 DIALOGUES – ANALYSE
  ===================================================== */
  const dialoguesAnalysis = [
    { s: pirate5, t: "Tenir ses comptes permet d’analyser ses clients." },
    { s: pirate2, t: "On peut suivre le chiffre d’affaires." },
    { s: pirate5, t: "Mais aussi les charges et les produits." },
    { s: pirate2, t: "Sans oublier amortissements et provisions." }
  ];

  /* =====================================================
     🎮 MINI-JEU 2 — GESTION
  ===================================================== */
  function startMiniGame2() {
    financeGame.classList.remove("hidden");
    partClients.classList.remove("hidden");
  }

  window.showBill = c => {
    bill.textContent = {
      A: "🧾 Barbe-Cuivre : 950",
      B: "🧾 Vent-Noir : 850",
      C: "🧾 Crâne-Rouge : 530"
    }[c];
  };

  window.chooseClient = btn => {
    const buttons = [...document.querySelectorAll(".clients button:last-child")];
    if (btn === buttons[buttons.length - 1]) {
      partClients.classList.add("hidden");
      partResult.classList.remove("hidden");
    } else screenShake();
  };

  window.checkResult = ok => {
    if (!ok) return screenShake();
    partResult.classList.add("hidden");
    partAmort.classList.remove("hidden");
  };

  window.checkAmortBase = ok => {
    if (!ok) return screenShake();
    amortMonth.classList.remove("hidden");
  };

  window.checkMonthlyAmort = ok => {
    if (!ok) return screenShake();
    playDialogues(dialoguesEBE);
  };

  /* =====================================================
     💬 DIALOGUES – EBE
  ===================================================== */
  const dialoguesEBE = [
    { s: pirate5, t: "L’EBE mesure la richesse créée par l’activité." },
    { s: pirate2, t: "Avant amortissements et charges financières." },
    { s: pirate5, t: "C’est un indicateur clé de performance." }
  ];

  /* =====================================================
     🧮 CALCULATRICE
  ===================================================== */
  calc.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      try { calc.value = Function("return " + calc.value)(); }
      catch { calc.value = "Erreur"; }
    }
  });

});

/* =====================================================
   SHAKE
===================================================== */
function screenShake() {
  document.body.classList.add("shake");
  setTimeout(() => document.body.classList.remove("shake"), 400);
}
