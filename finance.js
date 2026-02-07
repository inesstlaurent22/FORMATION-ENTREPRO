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
     🎬 VIDÉO — LOGIQUE CORRIGÉE
  ===================================================== */

  // État initial
  video.muted = true;
  toggleSoundBtn.textContent = "🔇";

  // Sécurité : empêcher la vidéo de capter les clics
  video.style.pointerEvents = "none";

  // Lancement safe (Safari / iOS)
  const tryPlayVideo = () => {
    if (video.paused) {
      video.play().catch(() => {});
    }
  };

  tryPlayVideo();

  // 🔊 Activer / couper le son
  toggleSoundBtn.addEventListener("click", () => {
    video.muted = !video.muted;
    toggleSoundBtn.textContent = video.muted ? "🔇" : "🔊";
  });

  // ⏭️ Passer la vidéo
  closeVideoBtn.addEventListener("click", endVideo);

  // 🎬 Fin automatique de la vidéo
  video.addEventListener("ended", endVideo);

  function endVideo() {
    // Stop vidéo
    video.pause();

    // Masquer la vidéo
    videoContainer.classList.add("hidden");

    // Afficher la scène
    background.classList.remove("hidden");
    pirate5.classList.remove("hidden");
    pirate2.classList.remove("hidden");

    // Débloquer interactions
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
   🎮 MINI-JEU 2 — ANALYSE FINANCIÈRE
===================================================== */

/* ===== CALCULATRICE ===== */
function injectCalculator(container) {
  if (container.querySelector(".calcWrapper")) return;

  const wrapper = document.createElement("div");
  wrapper.className = "calcWrapper";

  const btn = document.createElement("button");
  btn.className = "calcToggle";
  btn.textContent = "🧮 Calculatrice";

  const input = document.createElement("input");
  input.className = "calcInput hidden";
  input.placeholder = "Ex : 12000 - 8500";

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

  wrapper.append(btn, input);
  container.prepend(wrapper);
}

/* ===== LANCEMENT ===== */
function startMiniGame2() {
  financeGame.classList.remove("hidden");
  part1.classList.remove("hidden");
  injectCalculator(part1);
}

/* ================= CLIENTS — LECTURE OBLIGATOIRE ================= */

let billsSeen = {
  A: false,
  B: false,
  C: false
};

window.showBill = client => {
  bill.textContent = {
    A: "🧾 Barbe-Cuivre : 950 PO",
    B: "🧾 Vent-Noir : 850 PO",
    C: "🧾 Crâne-Rouge : 530 PO"
  }[client];

  billsSeen[client] = true;
  checkAllBillsRead();
};

function checkAllBillsRead() {
  const allRead = Object.values(billsSeen).every(v => v === true);
  if (!allRead) return;

  document
    .querySelectorAll(".clients button:last-child")
    .forEach(btn => btn.disabled = false);
}

window.chooseClient = btn => {
  const choices = [...document.querySelectorAll(".clients button:last-child")];

  // sécurité
  if (!Object.values(billsSeen).every(v => v)) {
    return screenShake();
  }

  if (btn === choices[0]) {
    part1.classList.add("hidden");
    part2.classList.remove("hidden");
    injectCalculator(part2);
  } else {
    screenShake();
  }
};

/* ===== RÉSULTAT ===== */
window.checkResult = ok => {
  if (!ok) return screenShake();
  part2.classList.add("hidden");
  part3.classList.remove("hidden");
  injectCalculator(part3);
};

/* ===== AMORTISSEMENTS ===== */
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
   🎮 MINI-JEU 3 — COMPTABILITÉ AVANCÉE
===================================================== */

let step1, step2, step3, step4, step5;

function startMiniGame3() {
  const miniGame3 = document.getElementById("miniGame3");

  miniGame3.innerHTML = `
    <h3>🏴‍☠️ L’épreuve du maître comptable</h3>

    <p>
      Après une année de ventes prospères, tu dois prouver
      que tu maîtrises réellement les chiffres de ta boutique pirate.
    </p>

    <!-- 💡 INDICE -->
    <button class="hintBtn">💡 Indice</button>
    <div class="hintImage hidden">
      <div class="imageFrame">
        <img src="images/EBE.PNG" alt="Indice EBE" class="zoomable">
      </div>
    </div>

    <!-- 🧮 CALCULATRICE -->
    <button class="calcToggle">🧮 Calculatrice</button>
    <input id="calcFinal" class="calcInput hidden" placeholder="Ex : 10000 - 4250 - 1000">

    <!-- STEP 1 -->
    <div id="step1">
      <p><strong>1️⃣ Calcul de la marge</strong></p>
      <p class="hint">💡 CA − Achats de marchandises</p>
      <p>CA : 10 000 PO / Achats : 0 PO</p>
      <button data-ok="true">10 000 PO</button>
      <button data-ok="false">5 000 PO</button>
    </div>

    <!-- STEP 2 -->
    <div id="step2" class="hidden">
      <p><strong>2️⃣ Calcul de l’EBE</strong></p>
      <p class="hint">💡 Marge − Charges − Impôts − Salaires</p>
      <p>Charges : 4 250 PO / Impôts : 500 PO / Salaires : 0 PO</p>
      <button data-ok="true">5 250 PO</button>
      <button data-ok="false">9 500 PO</button>
    </div>

    <!-- STEP 3 -->
    <div id="step3" class="hidden">
      <p><strong>3️⃣ Dotation aux amortissements</strong></p>
      <p class="hint">💡 (500 − 150) ÷ 3</p>
      <button data-ok="true">≈ 117 PO</button>
      <button data-ok="false">350 PO</button>
    </div>

    <!-- STEP 4 -->
    <div id="step4" class="hidden">
      <p><strong>4️⃣ Résultat de l’exploitation</strong></p>
      <p class="hint">💡 EBE − Amortissements</p>
      <button data-ok="true">≈ 5 133 PO</button>
      <button data-ok="false">5 250 PO</button>
    </div>

    <!-- STEP 5 -->
    <div id="step5" class="hidden">
      <p><strong>5️⃣ Capacité d’autofinancement</strong></p>
      <p class="hint">💡 Résultat − Charges financières − IR</p>
      <p>Prêt : 5 000 PO sur 5 ans → 1 000 PO/an<br>IR : 0 PO</p>
      <button data-ok="true">≈ 4 133 PO</button>
      <button data-ok="false">5 133 PO</button>
    </div>
  `;

  miniGame3.classList.remove("hidden");

  step1 = miniGame3.querySelector("#step1");
  step2 = miniGame3.querySelector("#step2");
  step3 = miniGame3.querySelector("#step3");
  step4 = miniGame3.querySelector("#step4");
  step5 = miniGame3.querySelector("#step5");

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

  /* 💡 INDICE + ZOOM */
  const hintBtn = miniGame3.querySelector(".hintBtn");
  const hintBox = miniGame3.querySelector(".hintImage");
  const hintImg = miniGame3.querySelector(".zoomable");

  /* Ouvrir l’indice */
  hintBtn.onclick = () => {
    hintBox.classList.remove("hidden");
  };

  /* Zoom image */
  hintImg.onclick = (e) => {
    e.stopPropagation();

    const overlay = document.createElement("div");
    overlay.className = "imageZoomOverlay";

    const frame = document.createElement("div");
    frame.className = "imageFrame";

    const zoomedImg = document.createElement("img");
    zoomedImg.src = hintImg.src;

    frame.appendChild(zoomedImg);
    overlay.appendChild(frame);
    document.body.appendChild(overlay);

    overlay.onclick = () => overlay.remove();
  };

  /* Clic ailleurs → fermer l’indice */
  hintBox.onclick = () => {
    hintBox.classList.add("hidden");
  };

  /* Enchaînement des steps */
  bindStep(step1, () => goToNext(step1, step2));
  bindStep(step2, () => goToNext(step2, step3));
  bindStep(step3, () => goToNext(step3, step4));
  bindStep(step4, () => goToNext(step4, step5));
  bindStep(step5, endMiniGame3);
}

/* =====================================================
   🔗 OUTILS MINI-JEU
===================================================== */

function goToNext(current, next) {
  current.classList.add("hidden");
  next.classList.remove("hidden");
}

function bindStep(step, cb) {
  step.querySelectorAll("button[data-ok]").forEach(btn => {
    btn.onclick = () => {
      if (btn.dataset.ok === "true") cb();
      else if (typeof screenShake === "function") screenShake();
    };
  });
}

/* =====================================================
   🔚 FIN MINI-JEU 3 → VICTOIRE
===================================================== */

function endMiniGame3() {
  const miniGame3 = document.getElementById("miniGame3");
  miniGame3.classList.add("hidden");

  setTimeout(() => {
    showFinalVictory();
  }, 500);
}

function showFinalVictory() {

  // Fermer mini-jeu
  const miniGame3 = document.getElementById("miniGame3");
  if (miniGame3) miniGame3.classList.add("hidden");

  // Overlay victoire
  const overlay = document.createElement("div");
  overlay.className = "finalVictory";

  overlay.innerHTML = `
    <div class="victoryBox">
      <h2>🏆 Bravo Capitaine 🏴‍☠️</h2>
      <p>Tu as gagné la quête financière</p>
      <p class="sub">Le trésor est désormais tien.</p>
    </div>
    <canvas id="gemsCanvas"></canvas>
  `;

  document.body.appendChild(overlay);

  // Explosion de gems
  if (typeof launchGems === "function") launchGems();

/* =====================================================
   ✅ FLAGS MENU (FINANCE)
===================================================== */
sessionStorage.setItem("unlock_pirate4", "true");
sessionStorage.setItem("fromFinance", "true"); // optionnel / futur

  // Retour menu (avec délai visuel)
  setTimeout(() => {
    window.location.href = "menu.html";
  }, 2500);
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

  for (let i = 0; i < 140; i++) {
    gems.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.5) * 12,
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
     🧯 SHAKE
  ===================================================== */
  function screenShake() {
    document.body.classList.add("shake");
    setTimeout(() => document.body.classList.remove("shake"), 400);
  }

});
