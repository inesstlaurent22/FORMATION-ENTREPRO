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

  const miniGame1 = document.getElementById("miniGame0");
  const financeGame = document.getElementById("financeGame");
  const part1 = document.getElementById("part1");
  const part2 = document.getElementById("part2");
  const part3 = document.getElementById("part3");

  let dialogueActive = false;
  let pirateClickable = false;

  /* =====================================================
     🎬 LOGIQUE VIDÉO
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

    pirateClickable = true;
  }

  /* =====================================================
     ✨ PIRATE5 — ILLUMINATION AU SURVOL
  ===================================================== */
  pirate5.addEventListener("mouseenter", () => {
    if (pirateClickable && !dialogueActive) {
      pirate5.style.filter = "drop-shadow(0 0 35px gold)";
    }
  });

  pirate5.addEventListener("mouseleave", () => {
    pirate5.style.filter = "";
  });

  pirate5.addEventListener("click", () => {
    if (!pirateClickable || dialogueActive) return;

    pirateClickable = false;
    pirate5.style.filter = "";
    startDialogues(dialoguesIntro, startMiniGame1);
  });

  /* =====================================================
     💬 SYSTÈME DE DIALOGUES
  ===================================================== */
  const bubble = document.createElement("div");
  bubble.id = "dialogueBox";
  bubble.classList.add("hidden");
  background.appendChild(bubble);

  let dialogues = [];
  let index = 0;
  let afterDialogues = null;

  function startDialogues(arr, cb) {
    dialogueActive = true;
    dialogues = arr;
    index = 0;
    afterDialogues = cb;
    bubble.classList.remove("hidden");
    showDialogue();
  }

  function showDialogue() {
    const d = dialogues[index];
    bubble.textContent = d.t;

    const r = d.s.getBoundingClientRect();
    bubble.style.left = r.left + r.width / 2 + "px";
    bubble.style.top = r.top - 90 + "px";
    bubble.style.transform = "translateX(-50%)";

    bubble.onclick = () => {
      index++;
      if (index < dialogues.length) {
        showDialogue();
      } else {
        bubble.classList.add("hidden");
        dialogueActive = false;
        afterDialogues && afterDialogues();
      }
    };
  }

  /* =====================================================
     💬 DIALOGUES — INTRO COMPTABLE
  ===================================================== */
  const dialoguesIntro = [
    { s: pirate5, t: "Avant de gérer l’or, il faut comprendre les registres." },
    { s: pirate2, t: "Journal des ventes, grand livre, balance…" },
    { s: pirate5, t: "Sans eux, impossible de piloter un navire marchand." }
  ];

  /* =====================================================
     🎮 MINI-JEU 1 — QCM REGISTRES (ENRICHI)
  ===================================================== */
  const questions = [
    {
      q: "À quoi sert le journal des ventes ?",
      good: [
        "À noter toutes les ventes de la journée",
        "À suivre l’activité quotidienne"
      ],
      bad: [
        "À payer les impôts",
        "À gérer l’équipage"
      ]
    },
    {
      q: "Pourquoi tenir un grand livre ?",
      good: [
        "Pour regrouper les opérations par compte"
      ],
      bad: [
        "Pour décorer la boutique",
        "Pour stocker l’or"
      ]
    },
    {
      q: "À quoi sert la balance comptable ?",
      good: [
        "À vérifier l’équilibre des comptes",
        "À contrôler les totaux débit et crédit"
      ],
      bad: [
        "À peser les marchandises"
      ]
    },
    {
      q: "Quels documents composent les comptes annuels ?",
      good: [
        "Le bilan comptable",
        "Le compte de résultat"
      ],
      bad: [
        "Le journal des ventes"
      ]
    },
    {
      q: "À quoi sert le compte de résultat ?",
      good: [
        "À mesurer la performance de l’entreprise",
        "À déterminer le résultat (bénéfice ou perte)"
      ],
      bad: [
        "À compter les stocks"
      ]
    }
  ];

  let q = 0;
  let good = 0;

  function startMiniGame1() {
    miniGame1.innerHTML = `
      <h3>📘 Épreuve des registres</h3>
      <p id="qText"></p>
      <div id="qChoices"></div>
    `;
    miniGame1.classList.remove("hidden");
    q = 0;
    showQuestion();
  }

  function showQuestion() {
    good = 0;
    qText.textContent = questions[q].q;
    qChoices.innerHTML = "";

    const answers = [
      ...questions[q].good.map(t => ({ t, ok: true })),
      ...questions[q].bad.map(t => ({ t, ok: false }))
    ].sort(() => Math.random() - 0.5);

    answers.forEach(a => {
      const btn = document.createElement("button");
      btn.textContent = a.t;
      btn.onclick = () => {
        if (a.ok) {
          btn.classList.add("selectedAnswer");
          btn.disabled = true;
          good++;
          if (good === questions[q].good.length) {
            q++;
            q < questions.length ? showQuestion() : endMiniGame1();
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
    showSuccess("📘 Registres maîtrisés !");
    setTimeout(() => {
      startDialogues(dialoguesBeforeMini2, startMiniGame2);
    }, 2000);
  }

  /* =====================================================
     💬 DIALOGUES AVANT MINI-JEU 2
  ===================================================== */
  const dialoguesBeforeMini2 = [
    { s: pirate5, t: "Avec ces registres, on peut analyser l’activité." },
    { s: pirate2, t: "Clients, charges, produits…" },
    { s: pirate5, t: "Et même anticiper l’usure du matériel." }
  ];

  /* =====================================================
     🎮 MINI-JEU 2 — GESTION + 🧮
  ===================================================== */
  function startMiniGame2() {
    financeGame.classList.remove("hidden");
    part1.classList.remove("hidden");
    injectCalculator(part1);
  }

  function injectCalculator(container) {
    if (container.querySelector(".calcWrapper")) return;

    const wrap = document.createElement("div");
    wrap.className = "calcWrapper";

    const btn = document.createElement("button");
    btn.className = "calcToggle";
    btn.textContent = "🧮 Calculatrice";

    const input = document.createElement("input");
    input.className = "calcInput hidden";
    input.placeholder = "500 - 150 puis Entrée";

    btn.onclick = () => input.classList.toggle("hidden");

    input.onkeydown = e => {
      if (e.key === "Enter") {
        try {
          input.value = Function("return " + input.value)();
        } catch {
          input.value = "Erreur";
        }
      }
    };

    wrap.append(btn, input);
    container.prepend(wrap);
  }

  window.showBill = c => {
    bill.textContent = {
      A: "🧾 Barbe-Cuivre : 950",
      B: "🧾 Vent-Noir : 850",
      C: "🧾 Crâne-Rouge : 530"
    }[c];
  };

  window.chooseClient = btn => {
    const all = [...document.querySelectorAll(".clients button:last-child")];
    if (btn === all.at(-1)) {
      part1.classList.add("hidden");
      part2.classList.remove("hidden");
      injectCalculator(part2);
    } else {
      screenShake();
    }
  };

  window.checkResult = ok => {
    if (!ok) return screenShake();
    part2.classList.add("hidden");
    part3.classList.remove("hidden");
    injectCalculator(part3);
  };

  window.checkAmortBase = ok => {
    if (!ok) return screenShake();
    amortMonth.classList.remove("hidden");
  };

  window.checkMonthlyAmort = ok => {
    if (!ok) return screenShake();
    financeGame.classList.add("hidden");
    startDialogues(dialoguesEnd);
  };

  /* =====================================================
   💬 DIALOGUES FINAUX — EBE
===================================================== */
const dialoguesEnd = [
  { s: pirate5, t: "L’EBE mesure la richesse créée par l’activité." },
  { s: pirate2, t: "Avant impôts, intérêts et amortissements." },
  { s: pirate5, t: "Voyons maintenant si tu sais vraiment calculer." }
];

/* =====================================================
   🎮 MINI-JEU 3 — FINAL (MARGE → CAF)
===================================================== */

let step1, step2, step3, step4;

function startMiniGame3() {
  const miniGame3 = document.getElementById("miniGame3");

  miniGame3.innerHTML = `
    <h3>🏴‍☠️ Épreuve financière finale</h3>

    <button class="calcToggle">🧮 Calculatrice</button>
    <input id="calcFinal" class="calcInput hidden" placeholder="Ex : 10000-4250-500">

    <div id="step1">
      <p>1️⃣ Calcul de la marge</p>
      <p class="hint">💡 CA − Achats</p>
      <button onclick="checkMargeFinal(true)">10 000 PO</button>
      <button onclick="checkMargeFinal(false)">5 250 PO</button>
    </div>

    <div id="step2" class="hidden">
      <p>2️⃣ Calcul de l’EBE</p>
      <p class="hint">💡 Marge − Charges − Impôts − Salaires</p>
      <button onclick="checkEBEFinal(true)">5 250 PO</button>
      <button onclick="checkEBEFinal(false)">9 500 PO</button>
    </div>

    <div id="step3" class="hidden">
      <p>3️⃣ Résultat d’exploitation</p>
      <p class="hint">💡 EBE − Amortissements (178 PO)</p>
      <button onclick="checkResultFinal(true)">5 072 PO</button>
      <button onclick="checkResultFinal(false)">5 250 PO</button>
    </div>

    <div id="step4" class="hidden">
      <p>4️⃣ Capacité d’autofinancement</p>
      <p class="hint">💡 Résultat + amortissements − remboursements</p>
      <button onclick="checkCAFFinal(true)">250 PO</button>
      <button onclick="checkCAFFinal(false)">5 072 PO</button>
    </div>
  `;

  miniGame3.classList.remove("hidden");

  // Références sécurisées
  step1 = document.getElementById("step1");
  step2 = document.getElementById("step2");
  step3 = document.getElementById("step3");
  step4 = document.getElementById("step4");

  /* 🧮 Calculatrice */
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
}

/* =====================================================
   ✅ VALIDATIONS — CHAÎNAGE STRICT
===================================================== */

function checkMargeFinal(ok) {
  if (!ok) return screenShake();
  step1.classList.add("hidden");
  step2.classList.remove("hidden");
}

function checkEBEFinal(ok) {
  if (!ok) return screenShake();
  step2.classList.add("hidden");
  step3.classList.remove("hidden");
}

function checkResultFinal(ok) {
  if (!ok) return screenShake();
  step3.classList.add("hidden");
  step4.classList.remove("hidden");
}

function checkCAFFinal(ok) {
  if (!ok) return screenShake();
  showFinalVictory();
}

/* =====================================================
   🏆 ÉCRAN FINAL — VICTOIRE
===================================================== */

function showFinalVictory() {
  const overlay = document.createElement("div");
  overlay.className = "finalVictory";

  overlay.innerHTML = `
    <div class="victoryText">🏆 Bravo tu as gagné la quête 🏆</div>
    <canvas id="gemsCanvas"></canvas>
  `;

  document.body.appendChild(overlay);
  launchGems();
}

/* =====================================================
   💎 EXPLOSION DE GEMS
===================================================== */

function launchGems() {
  const canvas = document.getElementById("gemsCanvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ["#ffd700", "#00ffff", "#ff4dff", "#00ff6a", "#ff4444"];
  const gems = [];

  for (let i = 0; i < 120; i++) {
    gems.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      r: Math.random() * 6 + 3,
      c: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gems.forEach(g => {
      g.x += g.vx;
      g.y += g.vy;
      g.vy += 0.05;
      ctx.fillStyle = g.c;
      ctx.beginPath();
      ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }

  animate();
}
  /* =====================================================
     🎉 SUCCÈS / SHAKE
  ===================================================== */
  function showSuccess(t) {
    const s = document.createElement("div");
    s.className = "successOverlay";
    s.textContent = t;
    background.appendChild(s);
    setTimeout(() => s.remove(), 2200);
  }

  function screenShake() {
    document.body.classList.add("shake");
    setTimeout(() => document.body.classList.remove("shake"), 400);
  }

});
