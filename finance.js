document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     🎬 RÉFÉRENCES
  ===================================================== */
  const background = document.getElementById("background");
  const pirate5 = document.getElementById("pirate5bis");
  const pirate2 = document.getElementById("pirate2bis");

  const miniGame1 = document.getElementById("miniGame0");
  const financeGame = document.getElementById("financeGame");
  const miniGame3 = document.getElementById("miniGame3");

  const part1 = document.getElementById("part1");
  const part2 = document.getElementById("part2");
  const part3 = document.getElementById("part3");

  const bill = document.getElementById("bill");
  const amortMonth = document.getElementById("amortMonth");

  let pirateClickable = false;
  let dialogueActive = false;

/* =====================================================
   🎬 VIDÉO INTRO — VERSION STABLE
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const video = document.getElementById("questVideo");
const toggleSound = document.getElementById("toggleSound");
const closeVideo = document.getElementById("closeVideo");

let videoClosed = false;

// Sécurité
video.muted = true;
video.playsInline = true;
video.style.pointerEvents = "none";

video.play().catch(()=>{});

// 🔊 Son
toggleSound.onclick = e => {
  e.stopPropagation();
  video.muted = !video.muted;
  toggleSound.textContent = video.muted ? "🔇" : "🔊";
};

// ⏭️ Skip
closeVideo.onclick = e => {
  e.stopPropagation();
  closeIntro();
};

video.onended = closeIntro;

function closeIntro(){
  if(videoClosed) return;
  videoClosed = true;

  video.pause();
  videoContainer.classList.add("hidden");

  background.classList.remove("hidden");
  pirate5.classList.remove("hidden");
  pirate2.classList.remove("hidden");

  pirateClickable = true; // 🔥 IMPORTANT
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
  skipBtn.classList.remove("hidden");
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
    skipBtn.classList.add("hidden");
    dialogueActive = false;
    afterDialogues && afterDialogues();
  }
};
  }

  /* =====================================================
   ⏭️ SKIP DIALOGUES
===================================================== */
const skipBtn = document.createElement("button");
skipBtn.id = "skipDialoguesBtn";
skipBtn.textContent = "Passer les dialogues";
skipBtn.classList.add("hidden");
document.body.appendChild(skipBtn);

skipBtn.onclick = () => {
  bubble.classList.add("hidden");
  skipBtn.classList.add("hidden");
  dialogueActive = false;
  afterDialogues && afterDialogues();
};

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
  <div class="questionBox">
    <p id="qText"></p>
  </div>
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
btn.classList.add("correctAnswer");
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

wrapper.appendChild(btn);
wrapper.appendChild(input);

container.insertBefore(wrapper, container.firstChild);
}

/* ===== LANCEMENT ===== */
function startMiniGame2() {
  financeGame.classList.remove("hidden");

  part1.classList.remove("hidden");
  part2.classList.add("hidden");
  part3.classList.add("hidden");

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
  const allRead = Object.values(billsSeen).every(v => v);
  if (!allRead) return;

  document
    .querySelectorAll(".clients button:last-child")
    .forEach(btn => btn.disabled = false);
}

window.chooseClient = btn => {

  if (!Object.values(billsSeen).every(v => v)) {
    return screenShake();
  }

  const choices = [...document.querySelectorAll(".clients button:last-child")];

  if (btn === choices[0]) {
    part1.classList.add("hidden");
    part2.classList.remove("hidden");
    injectCalculator(part2);
  } else {
    screenShake();
  }
};

/* =====================================================
   📊 RÉSULTAT ANNUEL
===================================================== */
window.checkResult = ok => {
  if (!ok) {
    screenShake();
    return;
  }

  part2.classList.add("hidden");
  part3.classList.remove("hidden");

  injectCalculator(part3);
};

/* =====================================================
   🧾 AMORTISSEMENTS
===================================================== */
window.checkAmortBase = ok => {
  if (!ok) {
    screenShake();
    return;
  }

  amortMonth.classList.remove("hidden");
};

/* =====================================================
   ✅ FIN MINI-JEU 2
===================================================== */
window.checkMonthlyAmort = ok => {
  if (!ok) {
    screenShake();
    return;
  }

  part3.classList.add("hidden");
  financeGame.classList.add("hidden");

  setTimeout(() => {
    startDialogues(dialoguesEBE, startMiniGame3);
  }, 300);
};
  
  /* =====================================================
     💬 DIALOGUES — EBE
  ===================================================== */
  const dialoguesEBE = [
    { s: pirate5, t: "L’EBE mesure la richesse créée par l’exploitation." },
    { s: pirate2, t: "Avant amortissements, impôts et finance." },
    { s: pirate5, t: "Voici l’épreuve finale." }
  ];

function bindStep(stepElement, onSuccess) {

  const buttons = stepElement.querySelectorAll("button");

  buttons.forEach(btn => {

    btn.addEventListener("click", function() {

      const isCorrect = this.getAttribute("data-ok") === "true";

      if (isCorrect) {

        this.classList.add("correctAnswer");

        buttons.forEach(b => b.disabled = true);

        setTimeout(() => {
          onSuccess();
        }, 400);

      } else {
        screenShake();
      }

    });

  });
}

function goToNext(current, next) {
  current.classList.add("hidden");
  next.classList.remove("hidden");
}
/* =====================================================
   🎮 MINI-JEU 3 — COMPTABILITÉ AVANCÉE
===================================================== */

let step1, step2, step3, step4, step5;

function startMiniGame3() {

  miniGame3.innerHTML = `
    <h3>🏴‍☠️ L’épreuve du maître comptable</h3>

    <p>
      Après une année de ventes prospères, tu dois prouver
      que tu maîtrises réellement les chiffres de ta boutique pirate.
    </p>

    <!-- 🧮 CALCULATRICE -->
    <button class="calcToggle">🧮 Calculatrice</button>
    <input id="calcFinal" class="calcInput hidden" placeholder="Ex : 10000 - 4250 - 1000">

    <!-- 💡 INDICE -->
    <button class="hintBtn">💡 Indice</button>
    <div class="hintImage hidden">
      <div class="imageFrame">
        <img src="images/EBE.PNG" alt="Indice EBE" class="zoomable">
      </div>
    </div>
    
    <div id="step1">
      <p><strong>1️⃣ Calcul de la marge</strong></p>
      <p class="hint">💡 CA − Achats</p>
      <p>CA : 10 000 PO / Achats : 0 PO</p>
      <button data-ok="true">10 000 PO</button>
      <button data-ok="false">5 000 PO</button>
    </div>

    <div id="step2" class="hidden">
      <p><strong>2️⃣ Calcul de l’EBE</strong></p>
      <p>Charges : 4 250 PO / Impôts : 500 PO</p>
      <button data-ok="true">5 250 PO</button>
      <button data-ok="false">9 500 PO</button>
    </div>

    <div id="step3" class="hidden">
      <p><strong>3️⃣ Amortissements</strong></p>
      <button data-ok="true">≈ 117 PO</button>
      <button data-ok="false">350 PO</button>
    </div>

    <div id="step4" class="hidden">
      <p><strong>4️⃣ Résultat exploitation</strong></p>
      <button data-ok="true">≈ 5 133 PO</button>
      <button data-ok="false">5 250 PO</button>
    </div>

    <div id="step5" class="hidden">
      <p><strong>5️⃣ Capacité d’autofinancement</strong></p>
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

/* =====================================================
   💡 INDICE — LOADER + ZOOM + FERMETURE STABLE
===================================================== */

const hintBtn  = miniGame3.querySelector(".hintBtn");
const hintBox  = miniGame3.querySelector(".hintImage");
const hintImg  = miniGame3.querySelector(".zoomable");

if (hintBtn && hintBox && hintImg) {

  /* ================================
     🔄 OUVERTURE AVEC LOADER
  ================================= */
  hintBtn.addEventListener("click", () => {

    const loaderOverlay = document.createElement("div");
    loaderOverlay.className = "loaderOverlay";

    loaderOverlay.innerHTML = `
      <div class="loaderBubble">
        <div class="spinner">⏳</div>
      </div>
    `;

    document.body.appendChild(loaderOverlay);

    const tempImg = new Image();
    tempImg.src = hintImg.src;

    tempImg.onload = () => {
      loaderOverlay.remove();
      hintBox.classList.remove("hidden");
    };

    tempImg.onerror = () => {
      loaderOverlay.remove();
      console.error("Erreur chargement image indice");
    };
  });

  /* ================================
     🖼 FERMETURE SI CLIC FOND NOIR
  ================================= */
  hintBox.addEventListener("click", (e) => {
    if (e.target === hintBox) {
      hintBox.classList.add("hidden");
    }
  });

  /* ================================
     🔍 ZOOM PLEIN ÉCRAN
  ================================= */
  hintImg.addEventListener("click", (e) => {

    e.stopPropagation(); // empêche fermeture de hintBox

    const overlay = document.createElement("div");
    overlay.className = "imageZoomOverlay";

    const img = document.createElement("img");
    img.src = hintImg.src;

    overlay.appendChild(img);
    document.body.appendChild(overlay);

    overlay.addEventListener("click", () => {
      overlay.remove();
    });
  });
}

  bindStep(step1, () => goToNext(step1, step2));
  bindStep(step2, () => goToNext(step2, step3));
  bindStep(step3, () => goToNext(step3, step4));
  bindStep(step4, () => goToNext(step4, step5));
  bindStep(step5, finishMiniGame3);
}

/* =====================================================
   🔚 FIN MINI-JEU 3
===================================================== */

function finishMiniGame3() {
  miniGame3.classList.add("hidden");

  setTimeout(() => {
    showCommerceWin();
  }, 500);
}

/* =====================================================
   🏆 VICTOIRE FINANCE
===================================================== */
function showCommerceWin(){

  const overlay = document.createElement("div");
  overlay.id="communication-win";
  overlay.innerHTML=`
    <div class="win-box">
      <h2>🏴‍☠️ Bravo !</h2>
      <p>Tu as gagné la quête Finance !</p>
      <div class="gems-container"></div>
    </div>`;

  document.body.appendChild(overlay);

  const gemsContainer = overlay.querySelector(".gems-container");

  requestAnimationFrame(()=>{
    launchGemsExplosion(gemsContainer);
  });

  sessionStorage.setItem("unlock_pirate4","true");
  sessionStorage.setItem("fromFinance","true");

  setTimeout(()=>{
    window.location.href="menu.html";
  },2500);
}

/* =====================================================
   💎 GEMS
===================================================== */
function launchGemsExplosion(container){
  const colors=["#ffd700","#00f2ff","#ff4fd8","#7cff00","#ff8c00"];
  for(let i=0;i<50;i++){
    const g=document.createElement("div");
    g.className="gem";
    const size=Math.random()*10+8;
    g.style.width=size+"px";
    g.style.height=size+"px";
    g.style.background=colors[Math.floor(Math.random()*colors.length)];
    g.style.left="50%";
    g.style.top="50%";

    const angle=Math.random()*Math.PI*2;
    const dist=Math.random()*260+80;
    g.style.setProperty("--x",Math.cos(angle)*dist+"px");
    g.style.setProperty("--y",Math.sin(angle)*dist+"px");

    container.appendChild(g);
  }
}
  
  /* =====================================================
     🧯 SHAKE
  ===================================================== */
  function screenShake() {
    document.body.classList.add("shake");
    setTimeout(() => document.body.classList.remove("shake"), 400);
  }

}); 
