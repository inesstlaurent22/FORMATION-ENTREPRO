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

  const bill = document.getElementById("bill");
  const amortMonth = document.getElementById("amortMonth");

  let pirateClickable = false;
  let dialogueActive = false;

  /* =====================================================
   🌑 LOADER
===================================================== */

const loader = document.getElementById("fadeScreen");

function showLoader(){
  if(loader){
    loader.classList.remove("hidden");
  }
}

function hideLoader(){
  if(loader){
    loader.classList.add("hidden");
  }
}
  
/* =====================================================
   🔀 SHUFFLE UTILITAIRE GLOBAL
===================================================== */
function shuffleArray(array){
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
  
/* =====================================================
   🎬 VIDÉO — LOGIQUE CORRIGÉE
===================================================== */

// État initial sécurisé
if(video){
  video.muted = true;
  video.style.pointerEvents = "none";

  // Lecture auto (sécurisée Safari / iOS)
  const tryPlayVideo = () => {
    if(video.paused){
      video.play().catch(()=>{});
    }
  };

  tryPlayVideo();

  // Fin automatique
  video.addEventListener("ended", endVideo);
}

if(toggleSoundBtn){
  toggleSoundBtn.textContent = "🔇";

  toggleSoundBtn.addEventListener("click", () => {
    if(!video) return;

    video.muted = !video.muted;
    toggleSoundBtn.textContent = video.muted ? "🔇" : "🔊";
  });
}

if(closeVideoBtn){
  closeVideoBtn.addEventListener("click", endVideo);
}

/* =====================================================
   ⏭️ FIN VIDÉO
===================================================== */

function endVideo(){

  if(video) video.pause();

  if(videoContainer) videoContainer.classList.add("hidden");

  background?.classList.remove("hidden");
  pirate5?.classList.remove("hidden");
  pirate2?.classList.remove("hidden");

  pirateClickable = true;

  showLoader();

  setTimeout(()=>{
    hideLoader();
  },1200);
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

  showLoader();

  setTimeout(()=>{
    hideLoader();
    startDialogues(dialoguesIntro, startMiniGame1);
  },900);
};

  /* =====================================================
     💬 MOTEUR DE DIALOGUES
  ===================================================== */
  const bubble = document.createElement("div");
  bubble.id = "dialogueBox";
  bubble.classList.add("hidden");
  if(background){
  background.appendChild(bubble);
}

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

const answers = shuffleArray([
  ...questions[qIndex].good.map(t => ({ t, ok: true })),
  ...questions[qIndex].bad.map(t => ({ t, ok: false }))
]);

    answers.forEach(a => {
      const btn = document.createElement("button");
      btn.textContent = a.t;
      btn.onclick = () => {
        if (a.ok) {
btn.classList.add("correct-locked");
          btn.disabled = true;
          goodCount++;
          if (goodCount === questions[qIndex].good.length) {
            qIndex++;
            qIndex < questions.length
              ? showQuestion()
              : endMiniGame1();
          }
        } else {
          btn.classList.add("wrongAnswer");
setTimeout(()=>btn.classList.remove("wrongAnswer"),350);
        }
      };
      qChoices.appendChild(btn);
    });
  }

function endMiniGame1() {
  miniGame1.classList.add("hidden");

  showLoader();

  setTimeout(()=>{
    hideLoader();
    startDialogues(dialoguesBeforeMini2, startMiniGame2);
  },900);
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
   🧮 CALCULATRICE
===================================================== */
function injectCalculator(container) {

  if (!container || container.querySelector(".calcWrapper")) return;

  const wrapper = document.createElement("div");
  wrapper.className = "calcWrapper";

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "calcToggle";
  btn.textContent = "🧮 Calculatrice";

  const input = document.createElement("input");
  input.className = "calcInput hidden";
  input.placeholder = "Ex : 12000 - 8500";
  input.autocomplete = "off";

  btn.addEventListener("click", () => {
    input.classList.toggle("hidden");
    if (!input.classList.contains("hidden")) input.focus();
  });

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      try {
        const result = Function('"use strict";return (' + input.value + ')')();
        input.value = result;
      } catch {
        input.value = "Erreur";
      }
    }
  });

  wrapper.append(btn, input);
  container.prepend(wrapper);
}

/* =====================================================
   🚀 LANCEMENT MINI-JEU 2
===================================================== */

let billsSeen = { A:false, B:false, C:false };

function startMiniGame2() {

  if (!financeGame) return;

  financeGame.classList.remove("hidden");

  part1?.classList.remove("hidden");
  part2?.classList.add("hidden");
  part3?.classList.add("hidden");

  // Reset lecture factures
  billsSeen = { A:false, B:false, C:false };

  // Reset affichage facture
  if (bill) bill.textContent = "";

  // Désactiver tous les boutons "Je choisis"
  financeGame
    .querySelectorAll(".chooseBtn")
    .forEach(btn => {
      btn.disabled = true;
      btn.classList.remove("correctAnswer");
    });

  injectCalculator(part1);
}

/* =====================================================
   📜 FACTURES
===================================================== */

window.showBill = function(client){

  if (!billsSeen) return;

  const prices = {
    A: "🧾 Barbe-Cuivre : 950 PO",
    B: "🧾 Vent-Noir : 850 PO",
    C: "🧾 Crâne-Rouge : 530 PO"
  };

  if (bill) bill.textContent = prices[client] || "";

  billsSeen[client] = true;
  checkAllBillsRead();
};

function checkAllBillsRead(){

  const allRead = Object.values(billsSeen).every(v => v);
  if (!allRead) return;

  financeGame
    .querySelectorAll(".chooseBtn")
    .forEach(btn => btn.disabled = false);
}

/* =====================================================
   👑 CHOIX CLIENT
===================================================== */

window.chooseClient = function(btn){

  if (!Object.values(billsSeen).every(v => v)) {
    return btn.classList.add("wrongAnswer");
setTimeout(()=>btn.classList.remove("wrongAnswer"),350);
  }

  const isCorrect = btn.dataset.correct === "true";

  if (isCorrect) {

    btn.classList.add("correctAnswer");

    part1.classList.add("hidden");
    part2.classList.remove("hidden");

    injectCalculator(part2);

  } else {
   btn.classList.add("wrongAnswer");
setTimeout(()=>btn.classList.remove("wrongAnswer"),350);
  }
};

/* =====================================================
   📊 RÉSULTAT ANNUEL
===================================================== */

window.checkResult = function(btn, ok){

  if (!ok){
    btn.classList.add("wrongAnswer");
    setTimeout(()=>btn.classList.remove("wrongAnswer"),350);
    return;
  }

  part2.classList.add("hidden");
  part3.classList.remove("hidden");

  injectCalculator(part3);
};
/* =====================================================
   🧾 BASE AMORTISSEMENT
===================================================== */

window.checkAmortBase = function(btn, ok){

  if(!ok){
    btn.classList.add("wrongAnswer");
    setTimeout(()=>btn.classList.remove("wrongAnswer"),350);
    return;
  }

  btn.classList.add("correctAnswer");

  document.getElementById("amortMonth").classList.remove("hidden");
};
  
/* =====================================================
   🧾 AMORTISSEMENTS
===================================================== */

window.checkMonthlyAmort = function(btn, ok){

  if(!ok){
    btn.classList.add("wrongAnswer");
    setTimeout(()=>btn.classList.remove("wrongAnswer"),350);
    return;
  }

  btn.classList.add("correctAnswer");

  part3.classList.add("hidden");
  financeGame.classList.add("hidden");

  showLoader();

  setTimeout(()=>{
    hideLoader();

    if(typeof startDialogues === "function"){
      startDialogues(dialoguesEBE, startMiniGame3);
    }

  },900);
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
   🔐 BIND STEP SÉCURISÉ
   (n'affecte QUE les boutons data-ok)
===================================================== */

function bindStepSafe(stepElement, onSuccess){

  if (!stepElement) return;

  const buttons = stepElement.querySelectorAll("button[data-ok]");
  if (!buttons.length) return;

  buttons.forEach(btn => {

    btn.addEventListener("click", function(){

      const isCorrect = this.dataset.ok === "true";

      if (isCorrect){

        this.classList.add("correctAnswer");

        buttons.forEach(b => b.disabled = true);

        setTimeout(() => {
          if (typeof onSuccess === "function") {
            onSuccess();
          }
        }, 400);

      } else {
        btn.classList.add("wrongAnswer");
setTimeout(()=>btn.classList.remove("wrongAnswer"),350);
      }

    });

  });
}
  
/* =====================================================
   🎮 MINI-JEU 3 — COMPTABILITÉ AVANCÉE (VERSION STABLE)
===================================================== */

let step1, step2, step3, step4, step5;

/* =====================================================
   🔀 MÉLANGE DES BOUTONS
===================================================== */
function shuffleStepButtons(stepElement){
  if (!stepElement) return;

  const buttons = Array.from(
    stepElement.querySelectorAll("button[data-ok]")
  );

  shuffleArray(buttons);

  buttons.forEach(btn => stepElement.appendChild(btn));
}

/* =====================================================
   🔄 TRANSITION ENTRE ÉTAPES
===================================================== */
function goToNext(current, next){
  if (!current || !next) return;

  current.classList.add("hidden");
  next.classList.remove("hidden");
}

/* =====================================================
   🚀 START MINI GAME 3
===================================================== */

function startMiniGame3(){

  if (!miniGame3) return;

  miniGame3.innerHTML = `
    <h3>🏴‍☠️ L’épreuve du maître comptable</h3>

    <p>
      Après une année de ventes prospères, tu dois prouver
      que tu maîtrises réellement les chiffres de ta boutique pirate.
    </p>

<div class="toolsRow">

  <div class="calcWrapper">
    <button class="calcToggle" type="button">🧮 Calculatrice</button>
    <input 
      id="calcFinal"
      class="calcInput hidden"
      placeholder="Ex : 10000 - 4250 - 1000"
      autocomplete="off"
    >
  </div>

  <button class="hintBtn" type="button">💡 Indice</button>

</div>

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
      <button data-ok="true">5 750 PO</button>
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

  /* ================= RÉFÉRENCES ================= */

  step1 = miniGame3.querySelector("#step1");
  step2 = miniGame3.querySelector("#step2");
  step3 = miniGame3.querySelector("#step3");
  step4 = miniGame3.querySelector("#step4");
  step5 = miniGame3.querySelector("#step5");

  /* 🔀 Mélange automatique */
  shuffleStepButtons(step1);
  shuffleStepButtons(step2);
  shuffleStepButtons(step3);
  shuffleStepButtons(step4);
  shuffleStepButtons(step5);

  /* =====================================================
     🧮 CALCULATRICE
  ===================================================== */

  const calcBtn = miniGame3.querySelector(".calcToggle");
  const calcInput = miniGame3.querySelector("#calcFinal");

  if (calcBtn && calcInput) {

    calcBtn.addEventListener("click", () => {
      calcInput.classList.toggle("hidden");
      if (!calcInput.classList.contains("hidden")) {
        calcInput.focus();
      }
    });

    calcInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        try {
          const result = Function('"use strict";return (' + calcInput.value + ')')();
          calcInput.value = result;
        } catch {
          calcInput.value = "Erreur";
        }
      }
    });
  }

  /* =====================================================
     💡 INDICE
  ===================================================== */

  const hintBtn  = miniGame3.querySelector(".hintBtn");
  const hintBox  = miniGame3.querySelector(".hintImage");
  const hintImg  = miniGame3.querySelector(".zoomable");

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

  /* =====================================================
     🔗 ENCHAÎNEMENT
  ===================================================== */

  bindStepSafe(step1, () => goToNext(step1, step2));
  bindStepSafe(step2, () => goToNext(step2, step3));
  bindStepSafe(step3, () => goToNext(step3, step4));
  bindStepSafe(step4, () => goToNext(step4, step5));
  bindStepSafe(step5, finishMiniGame3);
}

/* =====================================================
   🔚 FIN MINI-JEU 3
===================================================== */

function finishMiniGame3(){

  if (!miniGame3) return;

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

});
