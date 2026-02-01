document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   🎬 VIDÉO
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const video = document.getElementById("questVideo");
const skipBtn = document.getElementById("skipVideo");
const soundBtn = document.getElementById("soundBtn");
const scene = document.getElementById("scene");

video.muted = true;
soundBtn.textContent = "🔊";

soundBtn.onclick = (e) => {
  e.stopPropagation();
  video.muted = !video.muted;
  soundBtn.textContent = video.muted ? "🔊" : "🔈";
  video.play().catch(()=>{});
};

skipBtn.onclick = endVideo;
video.onended = endVideo;

function endVideo(){
  video.pause();
  videoContainer.style.display = "none";
  scene.style.display = "block";
  enablePirate();
}

/* =====================================================
   🏴‍☠️ PIRATE LEGAL
===================================================== */
const pirateLegal = document.getElementById("pirateLegal");

function enablePirate(){
  pirateLegal.classList.remove("noGlow");
  pirateLegal.onclick = startDialogues1;
}

function disablePirate(){
  pirateLegal.classList.add("noGlow");
  pirateLegal.onclick = null;
}

/* =====================================================
   💬 DIALOGUES — UTILITAIRE
===================================================== */
const dLegal = document.getElementById("dialogueLegal");
const dPirate = document.getElementById("dialoguePirate");
let dIndex = 0;

function runDialogues(list, callback){
  if(dIndex >= list.length){
    hideDialogs();
    callback();
    return;
  }
  const cur = list[dIndex];
  cur.el.innerHTML = `<p>${cur.text}</p>`;
  cur.el.style.display = "block";
  cur.el.onclick = () => {
    cur.el.style.display = "none";
    dIndex++;
    runDialogues(list, callback);
  };
}

function hideDialogs(){
  dLegal.style.display = "none";
  dPirate.style.display = "none";
}

/* =====================================================
   💬 DIALOGUES 1 — URSSAF
===================================================== */
const dialogues1 = [
  { el:dLegal, text:"Pour vendre nos pierres légalement, nous devons nous inscrire comme auto-entrepreneurs à l’URSSAF." },
  { el:dPirate, text:"Sans inscription, même un commerce honnête devient illégal." },
  { el:dLegal, text:"Voyons maintenant tes obligations." }
];

function startDialogues1(){
  disablePirate();
  dIndex = 0;
  runDialogues(dialogues1, startMiniGame1);
}

/* =====================================================
   🎮 MINI-JEU 1 — AUTO-ENTREPRENEUR
===================================================== */
const miniGame1 = document.getElementById("miniGame");

const questionsAE = [
  {
    q:"Où dois-je m’inscrire pour être auto-entrepreneur ?",
    good:["Sur le site de l’URSSAF"],
    bad:["À la mairie","À la banque"]
  },
  {
    q:"Qu’est-ce que l’ACRE ?",
    good:[
      "L’aide à la création ou à la reprise d’une entreprise",
      "Une réduction partielle des cotisations sociales",
      "À demander à la création ou sous 45 jours"
    ],
    bad:["Une taxe obligatoire"]
  },
  {
    q:"Quand dois-je déclarer mes gains ?",
    good:["Tous les mois","Même si les gains sont à 0"],
    bad:["Uniquement si je gagne"]
  }
];

let qIndex = 0, goodCount = 0;

function startMiniGame1(){
  scene.classList.add("sceneDim");
  miniGame1.style.display = "block";
  miniGame1.innerHTML = `
    <h3>📜 Devoirs de l’auto-entrepreneur</h3>
    <p id="qText"></p>
    <div id="qChoices"></div>
  `;
  qIndex = 0;
  showAEQuestion();
}

function showAEQuestion(){
  goodCount = 0;
  document.getElementById("qText").textContent = questionsAE[qIndex].q;
  const box = document.getElementById("qChoices");
  box.innerHTML = "";

  const answers = [
    ...questionsAE[qIndex].good.map(t=>({t,ok:true})),
    ...questionsAE[qIndex].bad.map(t=>({t,ok:false}))
  ].sort(()=>Math.random()-0.5);

  answers.forEach(a=>{
    const b = document.createElement("button");
    b.textContent = a.t;
    b.onclick = ()=>{
      if(a.ok){
        b.classList.add("selectedAnswer");
        b.disabled = true;
        goodCount++;
        if(goodCount === questionsAE[qIndex].good.length){
          qIndex++;
          qIndex < questionsAE.length ? showAEQuestion() : endMiniGame1();
        }
      } else shake();
    };
    box.appendChild(b);
  });
}

function endMiniGame1(){
  miniGame1.style.display = "none";
  scene.classList.remove("sceneDim");
  startDialogues2();
}

/* =====================================================
   💬 DIALOGUES 2 — STATUT
===================================================== */
const dialogues2 = [
  { el:dLegal, text:"L’auto-entrepreneuriat est un bon départ…" },
  { el:dPirate, text:"…mais quand le trésor grandit, il faut évoluer." },
  { el:dLegal, text:"Choisissons le bon statut juridique." }
];

function startDialogues2(){
  dIndex = 0;
  runDialogues(dialogues2, startMiniGame2);
}

/* =====================================================
   🎮 MINI-JEU 2 — STATUT JURIDIQUE
===================================================== */
const miniGame2 = document.getElementById("miniGame2");
const game2Content = document.getElementById("game2Content");

let q1Clicked = new Set();
let q2Clicked = new Set();
let q3Clicked = new Set();

/* ---------- START ---------- */
function startMiniGame2(){
  scene.classList.add("sceneDim");
  miniGame2.style.display = "block";
  q1Clicked.clear();
  showStep1();
}

/* ---------- Q1 (CORRIGÉE) ---------- */
function showStep1(){
  game2Content.innerHTML = `
    <h3>📜 Choisir son statut juridique</h3>
    <p>Crées-tu ta société seul ou en groupe ?</p>

    <div class="mg2-layout">
      <div class="mg2-left">
        <button onclick="q1Answer(this,'solo')">Oui</button>
        <button onclick="q1Answer(this,'groupe')">Non</button>
      </div>
      <div class="mg2-right" id="mg2Info"></div>
    </div>

    <p id="q1Hint" style="margin-top:14px;color:gold;">
      Clique sur les deux options pour continuer
    </p>
  `;
}

window.q1Answer = (btn, type)=>{
  if(q1Clicked.has(type)) return;

  q1Clicked.add(type);
  btn.disabled = true;
  btn.classList.add("selectedAnswer");

  const info = document.getElementById("mg2Info");

  if(type === "solo"){
    info.insertAdjacentHTML(
      "beforeend",
      `<div class="infoBox">Seul : <strong>EI</strong>, <strong>EURL</strong>, <strong>SASU</strong></div>`
    );
  }

  if(type === "groupe"){
    info.insertAdjacentHTML(
      "beforeend",
      `<div class="infoBox">À plusieurs : <strong>SARL</strong>, <strong>SAS</strong></div>`
    );
  }

  if(q1Clicked.size === 2){
    document.getElementById("q1Hint").textContent =
      "Parfait. Passons à la question suivante.";
    setTimeout(showStep2, 800);
  }
};

/* ---------- Q2 ---------- */
function showStep2(){
  q2Clicked.clear();
  game2Content.innerHTML = `
    <p>Pourquoi veux-tu changer de statut juridique ?</p>

    <div class="mg2-layout">
      <div class="mg2-left">
        <button onclick="q2Answer(this,'EI')">Simplifier mes démarches</button>
        <button onclick="q2Answer(this,'EURL')">Plus de rentabilité</button>
        <button onclick="q2Answer(this,'SASU')">Image luxueuse</button>
        <button onclick="q2Answer(this,'SARL')">Projet à risques / investisseurs</button>
        <button onclick="q2Answer(this,'SAS')">Projet en équipe stable</button>
      </div>
      <div class="mg2-right" id="mg2Info"></div>
    </div>

    <p id="q2Hint" style="margin-top:14px;color:gold;">
      Clique sur tous les boutons pour continuer
    </p>
  `;
}

window.q2Answer = (btn, statut)=>{
  if(q2Clicked.has(statut)) return;
  q2Clicked.add(statut);
  btn.disabled = true;
  btn.classList.add("selectedAnswer");

  document.getElementById("mg2Info").insertAdjacentHTML(
    "beforeend",
    `<div class="infoBox">${statut} recommandé</div>`
  );

  if(q2Clicked.size === 5){
    setTimeout(showStep3, 700);
  }
};

/* ---------- Q3 ---------- */
function showStep3(){
  q3Clicked.clear();
  game2Content.innerHTML = `
    <p>Quand dois-tu passer d’auto-entrepreneur à entreprise ?</p>
    <div id="qChoices">
      <button onclick="q3Answer(this,1)">Quand mon CA dépasse 60–70k</button>
      <button onclick="q3Answer(this,2)">Quand je veux embaucher et me protéger</button>
      <button onclick="q3Answer(this,3)">Quand j’ai peu de charges par rapport au CA</button>
      <button onclick="q3Answer(this,0)">Quand je le décide sans raison</button>
    </div>
    <p style="margin-top:14px;color:gold;">
      Clique sur toutes les bonnes réponses
    </p>
  `;
}

window.q3Answer = (btn, val)=>{
  if(val === 0){
    shake();
    return;
  }
  if(q3Clicked.has(val)) return;

  q3Clicked.add(val);
  btn.disabled = true;
  btn.classList.add("selectedAnswer");

  if(q3Clicked.size === 3){
    miniGame2.style.display = "none";
    scene.classList.remove("sceneDim");
    startDialoguesTVA();
  }
};

/* =====================================================
   💬 DIALOGUES 3 — TVA
===================================================== */
const dialoguesTVA = [
  { el:dLegal, text:"Même en tant qu’auto-entrepreneur, tu peux être amené à payer la TVA." },
  { el:dLegal, text:"Cela dépend de ton chiffre d’affaires, de ton activité ou de ton choix." },
  { el:dPirate, text:"Voyons si tu maîtrises les règles de la TVA." }
];

function startDialoguesTVA(){
  dIndex = 0;
  runDialogues(dialoguesTVA, startMiniGame3);
}

/* =====================================================
   🎮 MINI-JEU 3 — TVA
===================================================== */
const miniGame3 = document.getElementById("miniGame3");

const tvaQuestions = [
  {
    q:"Je fais 90 000 € de CA annuel en prestation de services. Dois-je pratiquer la TVA ?",
    good:["Oui"],
    bad:["Non"],
    hint:"TVA obligatoire si prestations > 37 500 €"
  },
  {
    q:"Récupérer la TVA consiste à :",
    good:["Collecter la TVA pour ensuite la reverser à l’État"],
    bad:["Collecter la TVA pour soi","Augmenter ses prix"]
  },
  {
    q:"Être collecteur de TVA permet-il de récupérer la TVA sur certaines dépenses ?",
    good:["Oui"],
    bad:["Non"]
  }
];

let tvaIndex = 0, tvaGood = 0;

function startMiniGame3(){
  scene.classList.add("sceneDim");
  miniGame3.style.display = "block";
  miniGame3.innerHTML = `
    <h3>💰 Épreuve de la TVA</h3>
    <p id="tvaQ"></p>
    <div id="tvaChoices"></div>
    <p id="tvaHint" style="color:gold;margin-top:12px"></p>
  `;
  tvaIndex = 0;
  showTVAQuestion();
}

function showTVAQuestion(){
  tvaGood = 0;
  const q = tvaQuestions[tvaIndex];
  document.getElementById("tvaQ").textContent = q.q;
  document.getElementById("tvaHint").textContent = q.hint || "";
  const box = document.getElementById("tvaChoices");
  box.innerHTML = "";

  const answers = [
    ...q.good.map(t=>({t,ok:true})),
    ...q.bad.map(t=>({t,ok:false}))
  ].sort(()=>Math.random()-0.5);

  answers.forEach(a=>{
    const b = document.createElement("button");
    b.textContent = a.t;
    b.onclick = ()=>{
      if(a.ok){
        b.classList.add("selectedAnswer");
        b.disabled = true;
        tvaGood++;
        if(tvaGood === q.good.length){
          tvaIndex++;
          tvaIndex < tvaQuestions.length ? showTVAQuestion() : endMiniGame3();
        }
      } else shake();
    };
    box.appendChild(b);
  });
}

function endMiniGame3(){
  miniGame3.style.display = "none";
  scene.classList.remove("sceneDim");
}

/* =====================================================
   📳 SHAKE
===================================================== */
function shake(){
  document.body.classList.add("shake");
  setTimeout(()=>document.body.classList.remove("shake"),350);
}

});
