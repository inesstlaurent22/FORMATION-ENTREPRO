document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     🎬 VIDÉO
  ===================================================== */
  const video = document.getElementById("questVideo");
  const videoContainer = document.getElementById("videoContainer");
  const toggleSoundBtn = document.getElementById("toggleSound");
  const closeVideoBtn = document.getElementById("closeVideo");

  const background = document.getElementById("background");
  const pirate5 = document.getElementById("pirate5bis");
  const pirate2 = document.getElementById("pirate2bis");

  const miniGame1 = document.getElementById("miniGame0"); // QCM
  const financeGame = document.getElementById("financeGame");

  const partClients = document.getElementById("part1");
  const partResult = document.getElementById("part2");
  const partAmort = document.getElementById("part3");

  const calc = document.getElementById("calc");

  /* =====================================================
     🎬 VIDÉO LOGIQUE
  ===================================================== */
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
     ✨ ILLUMINATION PIRATE 5 (HOVER ONLY)
  ===================================================== */
  pirate5.addEventListener("mouseenter", () => {
    pirate5.style.filter = "drop-shadow(0 0 30px gold)";
  });
  pirate5.addEventListener("mouseleave", () => {
    pirate5.style.filter = "";
  });

  /* =====================================================
     💬 DIALOGUES SYSTEM (POSITION DYNAMIQUE)
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

    const speaker = d.s;
    const r = speaker.getBoundingClientRect();

    bubble.style.left = r.left + r.width / 2 + "px";
    bubble.style.top = r.top - 90 + "px";
    bubble.style.transform = "translateX(-50%)";

    bubble.onclick = () => {
      dIndex++;
      if (dIndex < dialogues.length) {
        showDialogue(callback);
      } else {
        bubble.classList.add("hidden");
        callback && callback();
      }
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
    { s: pirate5, t: "Le journal des ventes enregistre toutes les ventes quotidiennes." },
    { s: pirate5, t: "Le grand livre classe les opérations par compte." },
    { s: pirate5, t: "La balance vérifie l’équilibre des comptes." },
    { s: pirate5, t: "Et le compte de résultat montre si l’activité est rentable." }
  ];

  /* =====================================================
     ⏳ LOADER + PRÉSENTATION MINI-JEU 1
  ===================================================== */
  function startLoaderMiniGame1() {
    const loader = document.createElement("div");
    loader.id = "loader";
    loader.innerHTML = `
      <h2>Chargement…</h2>
      <p>Épreuve des registres comptables</p>
    `;
    background.appendChild(loader);

    setTimeout(() => {
      loader.remove();
      startMiniGame1();
    }, 1800);
  }

  /* =====================================================
     🎮 MINI-JEU 1 — QCM REGISTRES (4 QUESTIONS)
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
      bad: ["Pour décorer la boutique"]
    },
    {
      q: "À quoi sert la balance ?",
      good: ["À vérifier l’équilibre des comptes"],
      bad: ["À compter les pirates"]
    },
    {
      q: "À quoi sert le compte de résultat ?",
      good: ["À mesurer la rentabilité de l’activité"],
      bad: ["À ranger les factures"]
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
    ].sort(() => Math.random() - 0.5);

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
            qIndex < questions.length
              ? showQuestion()
              : endMiniGame1();
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
     💬 DIALOGUES – ANALYSE / AMORTISSEMENTS
  ===================================================== */
  const dialoguesAnalysis = [
    { s: pirate5, t: "Tenir ses comptes permet d’analyser ses clients." },
    { s: pirate5, t: "On peut suivre le chiffre d’affaires et les charges." },
    { s: pirate5, t: "Les provisions anticipent des pertes futures." },
    { s: pirate5, t: "Les amortissements étalent un achat sur plusieurs années." }
  ];

  /* =====================================================
     🎮 MINI-JEU 2 — GESTION (3 PARTIES)
  ===================================================== */
  let viewed = { A:false, B:false, C:false };

  function startMiniGame2() {
    financeGame.classList.remove("hidden");
    partClients.classList.remove("hidden");
  }

  window.showBill = c => {
    viewed[c] = true;
    bill.textContent = {
      A: "🧾 Barbe-Cuivre : Total 950",
      B: "🧾 Vent-Noir : Total 850",
      C: "🧾 Crâne-Rouge : Total 530"
    }[c];
  };

  window.chooseClient = btn => {
    const buttons = [...document.querySelectorAll(".clients button:last-child")];
    if (btn === buttons[buttons.length - 1]) {
      partClients.classList.add("hidden");
      partResult.classList.remove("hidden");
    } else {
      screenShake();
    }
  };

  /* ================= RÉSULTAT ================= */
  window.checkResult = ok => {
    if (!ok) return screenShake();
    partResult.classList.add("hidden");
    partAmort.classList.remove("hidden");
  };

  /* ================= AMORTISSEMENTS ================= */
  const calcBtn = document.createElement("button");
  calcBtn.textContent = "🧮";
  calcBtn.className = "calcBtn";
  partAmort.appendChild(calcBtn);

  calcBtn.onclick = () => {
    calc.classList.remove("hidden");
  };

  window.checkAmortBase = ok => {
    if (!ok) return screenShake();
    msg3.textContent = "Base amortissable : 350 pièces d’or sur 3 ans.";
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
    { s: pirate5, t: "Il se calcule avant amortissements et charges financières." },
    { s: pirate5, t: "C’est un indicateur clé de performance." }
  ];

  /* =====================================================
     🧮 CALCULATRICE LOGIQUE
  ===================================================== */
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

/* =====================================================
   🧯 SHAKE
===================================================== */
function screenShake() {
  document.body.classList.add("shake");
  setTimeout(() => document.body.classList.remove("shake"), 400);
}
