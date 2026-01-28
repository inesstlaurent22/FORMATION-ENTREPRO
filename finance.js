document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     🎬 RÉFÉRENCES
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
  const miniGame3 = document.getElementById("miniGame3");

  const part1 = document.getElementById("part1");
  const part2 = document.getElementById("part2");
  const part3 = document.getElementById("part3");

  let pirateClickable = false;
  let dialogueActive = false;

  /* =====================================================
     🎬 VIDÉO
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
    videoContainer.classList.add("hidden");
    background.classList.remove("hidden");
    pirate5.classList.remove("hidden");
    pirate2.classList.remove("hidden");
    pirateClickable = true;
  }

  /* =====================================================
     ✨ PIRATE 5 — SURVOL & CLIC
  ===================================================== */
  pirate5.onmouseenter = () => {
    if (pirateClickable && !dialogueActive) {
      pirate5.style.filter = "drop-shadow(0 0 35px gold)";
    }
  };
  pirate5.onmouseleave = () => pirate5.style.filter = "";

  pirate5.onclick = () => {
    if (!pirateClickable || dialogueActive) return;
    pirateClickable = false;
    pirate5.style.filter = "";
    startDialogues(dialoguesIntro, startMiniGame1);
  };

  /* =====================================================
     💬 MOTEUR DE DIALOGUES
  ===================================================== */
  const bubble = document.createElement("div");
  bubble.id = "dialogueBox";
  bubble.classList.add("hidden");
  background.appendChild(bubble);

  let dialogues = [];
  let dIndex = 0;
  let afterDialogues = null;

  function startDialogues(arr, cb) {
    dialogues = arr;
    dIndex = 0;
    afterDialogues = cb;
    dialogueActive = true;
    bubble.classList.remove("hidden");
    showDialogue();
  }

  function showDialogue() {
    const d = dialogues[dIndex];
    bubble.textContent = d.t;

    const r = d.s.getBoundingClientRect();
    bubble.style.left = r.left + r.width / 2 + "px";
    bubble.style.top = r.top - 90 + "px";
    bubble.style.transform = "translateX(-50%)";

    bubble.onclick = () => {
      dIndex++;
      if (dIndex < dialogues.length) {
        showDialogue();
      } else {
        bubble.classList.add("hidden");
        dialogueActive = false;
        afterDialogues && afterDialogues();
      }
    };
  }

  /* =====================================================
     💬 DIALOGUES — INTRO
  ===================================================== */
  const dialoguesIntro = [
    { s: pirate5, t: "Avant de gérer l’or, il faut comprendre les registres." },
    { s: pirate2, t: "Journal des ventes, grand livre, balance, compte de résultat." },
    { s: pirate5, t: "Prouve que tu maîtrises ces bases." }
  ];

  /* =====================================================
     🎮 MINI-JEU 1 — QCM
  ===================================================== */
  const questions = [
    {
      q: "À quoi sert le journal des ventes ?",
      good: ["À noter toutes les ventes de la journée"],
      bad: ["À payer les impôts", "À gérer l’équipage"]
    },
    {
      q: "Pourquoi tenir un grand livre ?",
      good: ["Pour regrouper les opérations par compte"],
      bad: ["Pour décorer la boutique", "Pour stocker l’or"]
    },
    {
      q: "À quoi sert la balance comptable ?",
      good: ["À vérifier l’équilibre des comptes"],
      bad: ["À peser les marchandises"]
    },
    {
      q: "Quels documents composent les comptes annuels ?",
      good: ["Le bilan comptable", "Le compte de résultat"],
      bad: ["Le journal des ventes"]
    }
  ];

  let qIndex = 0;
  let goodCount = 0;

  function startMiniGame1() {
    miniGame1.innerHTML = `
      <h3>📘 Épreuve des registres</h3>
      <p id="qText"></p>
      <div id="qChoices"></div>
    `;
    miniGame1.classList.remove("hidden");
    qIndex = 0;
    showQuestion();
  }

  function showQuestion() {
    goodCount = 0;
    document.getElementById("qText").textContent = questions[qIndex].q;
    const qChoices = document.getElementById("qChoices");
    qChoices.innerHTML = "";

    const answers = [
      ...questions[qIndex].good.map(t => ({ t, ok: true })),
      ...questions[qIndex].bad.map(t => ({ t, ok: false }))
    ].sort(() => Math.random() - 0.5);

    answers.forEach(a => {
      const btn = document.createElement("button");
      btn.textContent = a.t;
      btn.onclick = () => {
        if (a.ok) {
          btn.classList.add("selectedAnswer");
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
    startDialogues(dialoguesBeforeMini2, startMiniGame2);
  }

  /* =====================================================
     💬 DIALOGUES — ANALYSE
  ===================================================== */
  const dialoguesBeforeMini2 = [
    { s: pirate5, t: "Avec ces registres, on peut analyser l’activité." },
    { s: pirate2, t: "Clients, charges, produits, amortissements…" },
    { s: pirate5, t: "Passons à la gestion réelle." }
  ];

  /* =====================================================
     🎮 MINI-JEU 2
  ===================================================== */
  function startMiniGame2() {
    financeGame.classList.remove("hidden");
    part1.classList.remove("hidden");
  }

  window.showBill = c => {
    document.getElementById("bill").textContent = {
      A: "🧾 Barbe-Cuivre : 950 PO",
      B: "🧾 Vent-Noir : 850 PO",
      C: "🧾 Crâne-Rouge : 530 PO"
    }[c];
  };

  window.chooseClient = btn => {
    const buttons = [...document.querySelectorAll(".clients button:last-child")];
    if (btn === buttons[0]) {
      part1.classList.add("hidden");
      part2.classList.remove("hidden");
    } else {
      screenShake();
    }
  };

  window.checkResult = ok => {
    if (!ok) return screenShake();
    part2.classList.add("hidden");
    part3.classList.remove("hidden");
  };

  window.checkAmortBase = ok => {
    if (!ok) return screenShake();
    document.getElementById("amortMonth").classList.remove("hidden");
  };

  window.checkMonthlyAmort = ok => {
    if (!ok) return screenShake();
    financeGame.classList.add("hidden");
    startDialogues(dialoguesEBE, startMiniGame3);
  };

  /* =====================================================
     💬 DIALOGUES — EBE
  ===================================================== */
  const dialoguesEBE = [
    { s: pirate5, t: "L’EBE mesure la richesse créée par l’exploitation." },
    { s: pirate2, t: "Avant amortissements, impôts et finance." },
    { s: pirate5, t: "Voici l’épreuve finale." }
  ];

/* =====================================================
   🎮 MINI-JEU 3 — FINAL (COMPTABILITÉ AVANCÉE)
===================================================== */

let step1, step2, step3, step4, step5;

function startMiniGame3() {
  const miniGame3 = document.getElementById("miniGame3");

  miniGame3.innerHTML = `
    <h3>🏴‍☠️ L’épreuve du maître comptable</h3>

    <p>
      Ta boutique pirate a prospéré toute l’année.
      Il est temps d’analyser précisément si ton activité
      crée réellement de la richesse.
    </p>

    <!-- 🧮 CALCULATRICE -->
    <button class="calcToggle">🧮 Calculatrice</button>
    <input
      id="calcFinal"
      class="calcInput hidden"
      placeholder="Ex : 10000-2000-500"
    >

    <!-- 💡 INDICE -->
    <button class="hintBtn">💡 Indice</button>
    <div class="hintImage hidden">
      <img src="images/EBE.png" alt="Indice EBE">
    </div>

    <!-- ================= ÉTAPE 1 ================= -->
    <div id="step1">
      <p><strong>1️⃣ Calcul de la marge</strong></p>
      <p class="hint">💡 Marge = CA − Achats de marchandises</p>

      <p>
        Chiffre d’affaires : <strong>10 000 PO</strong><br>
        Achats de marchandises : <strong>0 PO</strong>
      </p>

      <button data-ok="true">10 000 PO</button>
      <button data-ok="false">5 000 PO</button>
    </div>

    <!-- ================= ÉTAPE 2 ================= -->
    <div id="step2" class="hidden">
      <p><strong>2️⃣ Calcul de l’EBE</strong></p>
      <p class="hint">💡 EBE = Marge − Charges − Impôts − Salaires</p>

      <p>
        Charges :
        <br>• Loyer : 2 000 PO
        <br>• Packaging : 2 000 PO
        <br>• Flyers : 250 PO
        <br>• Salaires : 0 PO
        <br>• Impôts : 500 PO
      </p>

      <button data-ok="true">5 250 PO</button>
      <button data-ok="false">9 500 PO</button>
    </div>

    <!-- ================= ÉTAPE 3 ================= -->
    <div id="step3" class="hidden">
      <p><strong>3️⃣ Dotation aux amortissements</strong></p>
      <p class="hint">💡 (Prix − Provision) ÷ Durée</p>

      <p>
        Machine : 500 PO<br>
        Provision : 150 PO<br>
        Durée : 3 ans
      </p>

      <button data-ok="true">≈ 117 PO / an</button>
      <button data-ok="false">350 PO</button>
    </div>

    <!-- ================= ÉTAPE 4 ================= -->
    <div id="step4" class="hidden">
      <p><strong>4️⃣ Résultat de l’exploitation</strong></p>
      <p class="hint">💡 Résultat = EBE − Dotations aux amortissements</p>

      <button data-ok="true">≈ 5 133 PO</button>
      <button data-ok="false">5 250 PO</button>
    </div>

    <!-- ================= ÉTAPE 5 ================= -->
    <div id="step5" class="hidden">
      <p><strong>5️⃣ Capacité d’autofinancement</strong></p>
      <p class="hint">
        💡 CAF = Résultat − Charges financières − Impôts sur le revenu
      </p>

      <p>
        Prêt : 5 000 PO sur 5 ans<br>
        Charges financières : 5 000 ÷ 5 = <strong>1 000 PO</strong><br>
        Impôts sur le revenu : <strong>0 PO</strong>
      </p>

      <button data-ok="true">≈ 4 133 PO</button>
      <button data-ok="false">5 133 PO</button>
    </div>
  `;

  miniGame3.classList.remove("hidden");

  /* ===== RÉFÉRENCES ===== */
  step1 = miniGame3.querySelector("#step1");
  step2 = miniGame3.querySelector("#step2");
  step3 = miniGame3.querySelector("#step3");
  step4 = miniGame3.querySelector("#step4");
  step5 = miniGame3.querySelector("#step5");

  /* ===== CALCULATRICE ===== */
  const calcBtn = miniGame3.querySelector(".calcToggle");
  const calc = miniGame3.querySelector("#calcFinal");

  calcBtn.onclick = () => calc.classList.toggle("hidden");

  calc.onkeydown = e => {
    if (e.key === "Enter") {
      try {
        calc.value = Function("return " + calc.value)();
      } catch {
        calc.value = "Erreur";
      }
    }
  };

  /* ===== INDICE ===== */
  const hintBtn = miniGame3.querySelector(".hintBtn");
  const hintImg = miniGame3.querySelector(".hintImage");

  hintBtn.onclick = () => {
    hintImg.classList.toggle("hidden");
  };

  /* ===== ENCHAÎNEMENT ===== */
  bindStep(step1, () => nextStep(step1, step2));
  bindStep(step2, () => nextStep(step2, step3));
  bindStep(step3, () => nextStep(step3, step4));
  bindStep(step4, () => nextStep(step4, step5));
  bindStep(step5, showFinalVictory);
}

/* =====================================================
   🔗 OUTILS
===================================================== */

function nextStep(current, next) {
  current.classList.add("hidden");
  next.classList.remove("hidden");
}

function bindStep(step, cb) {
  step.querySelectorAll("button[data-ok]").forEach(btn => {
    btn.onclick = () => {
      if (btn.dataset.ok === "true") {
        cb();
      } else {
        screenShake();
      }
    };
  });
}

  /* =====================================================
     🏆 VICTOIRE
  ===================================================== */
  window.showFinalVictory = () => {
    const overlay = document.createElement("div");
    overlay.className = "finalVictory";
    overlay.textContent = "🏆 Bravo tu as gagné la quête 🏆";
    document.body.appendChild(overlay);
  };

  /* =====================================================
     🧯 SHAKE
  ===================================================== */
  function screenShake() {
    document.body.classList.add("shake");
    setTimeout(() => document.body.classList.remove("shake"), 400);
  }

});
