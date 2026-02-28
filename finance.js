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
  const part4 = document.getElementById("part4");

  const bill = document.getElementById("bill");

  let pirateClickable = false;
  let dialogueActive = false;

  const fadeScreen = document.getElementById("fadeScreen");

function showLoader(){
  fadeScreen.classList.remove("hidden");
}

function hideLoader(){
  fadeScreen.classList.add("hidden");
}

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

  showLoader();

  setTimeout(() => {

    background.classList.remove("hidden");
    pirate5.classList.remove("hidden");
    pirate2.classList.remove("hidden");

    pirateClickable = true;

    hideLoader();

  }, 1200); // durée loader
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

/* =====================================================
   ⏭️ SKIP DIALOGUES — VERSION STABLE
===================================================== */

const skipBtn = document.createElement("button");
skipBtn.id = "skipDialoguesBtn";
skipBtn.textContent = "Passer les dialogues";
skipBtn.classList.add("hidden");
document.body.appendChild(skipBtn);

skipBtn.addEventListener("click", () => {

  if (!dialogueActive) return;

  bubble.classList.add("hidden");
  skipBtn.classList.add("hidden");

  dialogueActive = false;

  if (typeof afterDialogues === "function") {
    const cb = afterDialogues;
    afterDialogues = null; // empêche double appel
    cb();
  }
});

/* =====================================================
   ▶️ START DIALOGUES
===================================================== */

function startDialogues(arr, cb) {

  dialogues = arr;
  dIndex = 0;
  afterDialogues = cb;
  dialogueActive = true;

  bubble.classList.remove("hidden");
  skipBtn.classList.remove("hidden");

  showDialogue();
}

/* =====================================================
   💬 AFFICHAGE DIALOGUE
===================================================== */

function showDialogue() {

  if (!dialogues[dIndex]) return;

  const d = dialogues[dIndex];
  bubble.textContent = d.t;

  const r = d.s.getBoundingClientRect();

  bubble.style.left =
    (r.left + r.width / 2 + window.scrollX) + "px";

  bubble.style.top =
    (r.top - 90 + window.scrollY) + "px";

  bubble.style.transform = "translateX(-50%)";

  bubble.onclick = () => {

    dIndex++;

    if (dIndex < dialogues.length) {
      showDialogue();
    } else {

      bubble.classList.add("hidden");
      skipBtn.classList.add("hidden");
      dialogueActive = false;

      if (typeof afterDialogues === "function") {
        const cb = afterDialogues;
        afterDialogues = null;
        cb();
      }
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
   🎮 MINI-JEU 1 — QCM (VERSION SÉCURISÉE)
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

  if (!miniGame1) return;

  showLoader();

  setTimeout(() => {

    miniGame1.innerHTML = `
      <div class="mg1-title">📘 Épreuve des registres</div>
      <div class="gameQuestion">
        <span id="qText"></span>
      </div>
      <div id="qChoices" class="mg1-answers"></div>
    `;

    miniGame1.classList.remove("hidden");

    qIndex = 0;
    goodCount = 0;

    showQuestion();

    hideLoader();

  }, 1000);
}

function showQuestion() {

  if (!questions[qIndex]) {
    endMiniGame1();
    return;
  }

  goodCount = 0;

  const qText = document.getElementById("qText");
  const qChoices = document.getElementById("qChoices");

  if (!qText || !qChoices) return;

  qText.textContent = questions[qIndex].q;
  qChoices.innerHTML = "";

  const answers = [
    ...questions[qIndex].good.map(t => ({ t, ok: true })),
    ...questions[qIndex].bad.map(t => ({ t, ok: false }))
  ].sort(() => Math.random() - 0.5);

  answers.forEach(a => {

    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = a.t;

    btn.addEventListener("click", () => {

      if (a.ok) {

        btn.classList.add("selectedAnswer");
        btn.disabled = true;
        goodCount++;

        if (goodCount === questions[qIndex].good.length) {

          qIndex++;

          setTimeout(() => {
            showQuestion();
          }, 400);
        }

      } else {
        screenShake();
      }
    });

    qChoices.appendChild(btn);
  });
}

function endMiniGame1() {

  if (!miniGame1) return;

  miniGame1.classList.add("hidden");

  if (typeof startDialogues === "function") {
    startDialogues(dialoguesBeforeMini2, startMiniGame2);
  }
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
   🎮 MINI-JEU 2 — ANALYSE FINANCIÈRE (VERSION STABLE)
===================================================== */

/* ===== CALCULATRICE SÉCURISÉE ===== */
function injectCalculator(container) {

  if (!container || container.querySelector(".calcWrapper")) return;

  const wrapper = document.createElement("div");
  wrapper.className = "calcWrapper";

  const btn = document.createElement("button");
  btn.className = "calcToggle";
  btn.type = "button";
  btn.textContent = "🧮 Calculatrice";

  const input = document.createElement("input");
  input.className = "calcInput hidden";
  input.placeholder = "Ex : 12000 - 8500";

  btn.addEventListener("click", () => {
    input.classList.toggle("hidden");
  });

  /* ⚠️ Évaluation sécurisée (opérations simples uniquement) */
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      try {
        if (!/^[0-9+\-*/().\s]+$/.test(input.value)) {
          throw new Error();
        }
        input.value = Function('"use strict";return (' + input.value + ')')();
      } catch {
        input.value = "Erreur";
      }
    }
  });

  wrapper.appendChild(btn);
  wrapper.appendChild(input);

  container.insertBefore(wrapper, container.firstChild);
}

/* ===== LANCEMENT ===== */
function startMiniGame2() {

  showLoader();

  setTimeout(() => {

    financeGame.classList.remove("hidden");

    part1.classList.remove("hidden");
    part2.classList.add("hidden");
    part3.classList.add("hidden");

    billsSeen = { A:false, B:false, C:false };
    bill.textContent = "";

    document
      .querySelectorAll(".clients button:last-child")
      .forEach(btn => btn.disabled = true);

    injectCalculator(part1);

    hideLoader();

  }, 1000);
}

/* ================= CLIENTS — LECTURE OBLIGATOIRE ================= */

let billsSeen = { A:false, B:false, C:false };

window.showBill = client => {

  const data = {
    A: "🧾 Barbe-Cuivre : 950 PO",
    B: "🧾 Vent-Noir : 850 PO",
    C: "🧾 Crâne-Rouge : 530 PO"
  };

  if (!data[client]) return;

  bill.textContent = data[client];
  billsSeen[client] = true;

  checkAllBillsRead();
};

function checkAllBillsRead() {

  const allRead = Object.values(billsSeen).every(Boolean);
  if (!allRead) return;

  document
    .querySelectorAll(".clients .clientBlock button:last-child")
    .forEach(btn => btn.disabled = false);
}

window.chooseClient = btn => {

  const allRead = Object.values(billsSeen).every(Boolean);

  if (!allRead) {
    screenShake();
    return;
  }

  const choices = [
    ...document.querySelectorAll(".clients .clientBlock button:last-child")
  ];

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
window.checkAmortBase = (ok) => {

  if (!ok) {
    screenShake();
    return;
  }
part3.classList.add("hidden");
part4.classList.remove("hidden");

/* 🔥 Injection calculatrice pour part4 */
injectCalculator(part4);
};

/* =====================================================
   ✅ FIN MINI-JEU 2
===================================================== */
window.checkMonthlyAmort = (ok) => {

  if (!ok) {
    screenShake();
    return;
  }

  if (!part4 || part4.classList.contains("hidden")) return;

  /* Désactive les boutons */
  part4.querySelectorAll("button").forEach(btn => btn.disabled = true);

  /* Ferme Mini-Jeu 2 */
  part4.classList.add("hidden");
  financeGame.classList.add("hidden");

  /* Reset Mini-Jeu 3 */
  if (miniGame3) {
    miniGame3.classList.add("hidden");
    miniGame3.innerHTML = "";
  }

  /* Sécurité dialogue */
  dialogueActive = false;

  setTimeout(() => {
    startDialogues(dialoguesEBE, () => {
      startMiniGame3();
    });
  }, 400);
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
   🎮 MINI-JEU 3 — COMPTABILITÉ AVANCÉE (VERSION STABLE)
===================================================== */

function startMiniGame3() {

  if (!miniGame3) return;

  showLoader();

  setTimeout(() => {

    /* Reset propre */
    miniGame3.classList.remove("hidden");

    miniGame3.innerHTML = `
      <div class="mg1-title">
        🏴‍☠️ L’épreuve du maître comptable
      </div>

      <div class="comm-info-text">
        Après une année prospère, prouve que tu maîtrises
        réellement les chiffres de ta boutique pirate.
      </div>

      <button class="calcToggle">🧮 Calculatrice</button>
      <input id="calcFinal" class="calcInput hidden" 
             placeholder="Ex : 10000 - 4250 - 1000">

      <button class="hintBtn">💡 Indice</button>
      <div class="hintImage hidden">
        <div class="imageFrame">
          <img src="images/EBE.PNG" 
               alt="Indice EBE" 
               class="zoomable">
        </div>
      </div>

      <div id="step1">
        <div class="gameQuestion">
          <strong>1️⃣ Calcul de la marge</strong><br>
          <span class="hint">💡 CA − Achats</span><br>
          CA : 10 000 PO / Achats : 0 PO
        </div>
        <button data-ok="true">10 000 PO</button>
        <button data-ok="false">5 000 PO</button>
      </div>

      <div id="step2" class="hidden">
        <div class="gameQuestion">
          <strong>2️⃣ Calcul de l’EBE</strong><br>
          Charges : 4 250 PO / Impôts : 500 PO
        </div>
        <button data-ok="true">5 250 PO</button>
        <button data-ok="false">9 500 PO</button>
      </div>

      <div id="step3" class="hidden">
        <div class="gameQuestion">
          <strong>3️⃣ Amortissements</strong>
        </div>
        <button data-ok="true">≈ 117 PO</button>
        <button data-ok="false">350 PO</button>
      </div>

      <div id="step4" class="hidden">
        <div class="gameQuestion">
          <strong>4️⃣ Résultat d’exploitation</strong>
        </div>
        <button data-ok="true">≈ 5 133 PO</button>
        <button data-ok="false">5 250 PO</button>
      </div>

      <div id="step5" class="hidden">
        <div class="gameQuestion">
          <strong>5️⃣ Capacité d’autofinancement</strong>
        </div>
        <button data-ok="true">≈ 4 133 PO</button>
        <button data-ok="false">5 133 PO</button>
      </div>
    `;

    /* ===============================
       RÉCUPÉRATION DES ÉLÉMENTS
    =============================== */

    const calcBtn = miniGame3.querySelector(".calcToggle");
    const calc = miniGame3.querySelector("#calcFinal");

    const hintBtn = miniGame3.querySelector(".hintBtn");
    const hintBox = miniGame3.querySelector(".hintImage");
    const hintImg = miniGame3.querySelector(".zoomable");

    const step1 = miniGame3.querySelector("#step1");
    const step2 = miniGame3.querySelector("#step2");
    const step3 = miniGame3.querySelector("#step3");
    const step4El = miniGame3.querySelector("#step4");
    const step5 = miniGame3.querySelector("#step5");

    /* ===============================
       🧮 CALCULATRICE
    =============================== */

    if (calcBtn && calc) {

      calcBtn.addEventListener("click", () => {
        calc.classList.toggle("hidden");
      });

      calc.addEventListener("keydown", e => {
        if (e.key === "Enter") {
          try {
            if (!/^[0-9+\-*/().\s]+$/.test(calc.value)) {
              throw new Error();
            }
            calc.value = Function('"use strict";return (' + calc.value + ')')();
          } catch {
            calc.value = "Erreur";
          }
        }
      });
    }

    /* ===============================
       💡 INDICE
    =============================== */

    if (hintBtn && hintBox && hintImg) {

      hintBtn.addEventListener("click", () => {
        hintBox.classList.remove("hidden");
      });

      hintBox.addEventListener("click", (e) => {
        if (e.target === hintBox) {
          hintBox.classList.add("hidden");
        }
      });

      hintImg.addEventListener("click", (e) => {
        e.stopPropagation();
        const overlay = document.createElement("div");
        overlay.className = "imageZoomOverlay";
        const img = document.createElement("img");
        img.src = hintImg.src;
        overlay.appendChild(img);
        document.body.appendChild(overlay);
        overlay.addEventListener("click", () => overlay.remove());
      });
    }

    /* ===============================
       🎯 BIND DES ÉTAPES
    =============================== */

    if (step1) bindStep(step1, () => goToNext(step1, step2));
    if (step2) bindStep(step2, () => goToNext(step2, step3));
    if (step3) bindStep(step3, () => goToNext(step3, step4El));
    if (step4El) bindStep(step4El, () => goToNext(step4El, step5));
    if (step5) bindStep(step5, finishMiniGame3);

    hideLoader();

  }, 1000);
}

  function finishMiniGame3(){
  miniGame3.classList.add("hidden");
  showCommerceWin();
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
