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
     🎮 MINI-JEU 1 — QCM REGISTRES (COMPLET)
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
    qText.textContent = questions[qIndex].q;
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
     🎮 MINI-JEU 2 — CLIENTS / RÉSULTAT / AMORTISSEMENTS
  ===================================================== */
  function startMiniGame2() {
    financeGame.classList.remove("hidden");
    part1.classList.remove("hidden");
  }

  window.showBill = c => {
    bill.textContent = {
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
    amortMonth.classList.remove("hidden");
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
   🎮 MINI-JEU 3 — FINAL (MARGE → EBE → RÉSULTAT → CAF)
===================================================== */

let step1, step2, step3, step4, step5;

function startMiniGame3() {
  const miniGame3 = document.getElementById("miniGame3");

  miniGame3.innerHTML = `
    <h3>🏴‍☠️ L’épreuve du capitaine marchand</h3>

    <p>
      Après des semaines de navigation, tu découvres un trésor légendaire.
      Grâce à lui, tu remplis ta boutique pirate et réalises une année
      exceptionnelle.
    </p>

    <p>
      📦 Marchandises : <strong>0 PO</strong> (le trésor)  
      💰 Chiffre d’affaires : <strong>10 000 PO</strong>
    </p>

    <!-- ================= STEP 1 ================= -->
    <div id="step1">
      <p><strong>1️⃣ Calcul de la marge</strong></p>
      <p class="hint">💡 Marge = Chiffre d’affaires − Achats</p>
      <p>
        Tu n’as rien acheté : tout provient du trésor.
      </p>

      <button data-ok="true">10 000 PO</button>
      <button data-ok="false">5 250 PO</button>
    </div>

    <!-- ================= STEP 2 ================= -->
    <div id="step2" class="hidden">
      <p><strong>2️⃣ Calcul de l’EBE</strong></p>
      <p class="hint">
        💡 EBE = Marge − Charges − Impôts − Salaires
      </p>

      <p>
        ⚓ Charges annuelles :
        <br>• Loyer du magasin : 2 000 PO
        <br>• Packaging (boîtes en bois) : 2 000 PO
        <br>• Flyers (communication) : 250 PO
        <br>• Salaires : 0 PO
        <br>• Impôts et taxes : 500 PO
      </p>

      <button data-ok="true">5 250 PO</button>
      <button data-ok="false">9 500 PO</button>
    </div>

    <!-- ================= STEP 3 ================= -->
    <div id="step3" class="hidden">
      <p><strong>3️⃣ Résultat d’exploitation</strong></p>
      <p class="hint">
        💡 Résultat = EBE − Dotations aux amortissements
      </p>

      <p>
        🛠️ Ton matériel s’use avec le temps.<br>
        Dotation annuelle aux amortissements : <strong>178 PO</strong>
      </p>

      <button data-ok="true">5 072 PO</button>
      <button data-ok="false">5 250 PO</button>
    </div>

    <!-- ================= STEP 4 ================= -->
    <div id="step4" class="hidden">
      <p><strong>4️⃣ Capacité d’autofinancement annuelle</strong></p>
      <p class="hint">
        💡 CAF = Résultat + Amortissements
      </p>

      <p>
        Les amortissements ne sont pas une sortie de trésorerie.
        Ils reviennent donc dans la capacité d’autofinancement.
      </p>

      <button data-ok="true">5 250 PO</button>
      <button data-ok="false">5 072 PO</button>
    </div>

    <!-- ================= STEP 5 ================= -->
    <div id="step5" class="hidden">
      <p><strong>5️⃣ CAF le mois du remboursement de l’emprunt</strong></p>
      <p class="hint">
        💡 CAF mensuelle = (CAF annuelle / 12) − Remboursement mensuel
      </p>

      <p>
        🤝 Ta tante t’a avancé de l’or.<br>
        Tu commences à rembourser <strong>1 000 PO par mois</strong>.
      </p>

      <p>
        CAF annuelle : 5 250 PO → soit <strong>437,50 PO par mois</strong>
      </p>

      <button data-ok="true">−562,50 PO</button>
      <button data-ok="false">437,50 PO</button>
    </div>
  `;

  miniGame3.classList.remove("hidden");

  // Références
  step1 = miniGame3.querySelector("#step1");
  step2 = miniGame3.querySelector("#step2");
  step3 = miniGame3.querySelector("#step3");
  step4 = miniGame3.querySelector("#step4");
  step5 = miniGame3.querySelector("#step5");

  // Enchaînement strict
  bindStep(step1, () => {
    step1.classList.add("hidden");
    step2.classList.remove("hidden");
  });

  bindStep(step2, () => {
    step2.classList.add("hidden");
    step3.classList.remove("hidden");
  });

  bindStep(step3, () => {
    step3.classList.add("hidden");
    step4.classList.remove("hidden");
  });

  bindStep(step4, () => {
    step4.classList.add("hidden");
    step5.classList.remove("hidden");
  });

  bindStep(step5, showFinalVictory);
}

/* =====================================================
   🔗 VALIDATION DES ÉTAPES
===================================================== */
function bindStep(step, cb) {
  step.querySelectorAll("button").forEach(btn => {
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
  function showFinalVictory() {
    const overlay = document.createElement("div");
    overlay.className = "finalVictory";
    overlay.textContent = "🏆 Bravo tu as gagné la quête 🏆";
    document.body.appendChild(overlay);
  }

  /* =====================================================
     🧯 SHAKE
  ===================================================== */
  function screenShake() {
    document.body.classList.add("shake");
    setTimeout(() => document.body.classList.remove("shake"), 400);
  }

});
