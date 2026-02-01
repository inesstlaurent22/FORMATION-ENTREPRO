document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   🎬 VIDÉO → SCÈNE
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const video = document.getElementById("questVideo");
const skipBtn = document.getElementById("skipVideo");
const scene = document.getElementById("scene");

skipBtn.onclick = endVideo;
video.onended = endVideo;

function endVideo(){
  videoContainer.style.display = "none";
  scene.style.display = "block";
  enablePirateHover();
}

/* =====================================================
   🏴‍☠️ PIRATE LEGAL — ANIMATION CONTRÔLÉE
===================================================== */
const pirateLegal = document.getElementById("pirateLegal");

function enablePirateHover(){
  pirateLegal.classList.remove("noGlow");
  pirateLegal.onclick = startDialogue1;
}

function disablePirateHover(){
  pirateLegal.classList.add("noGlow");
  pirateLegal.onclick = null;
}

/* =====================================================
   💬 DIALOGUE 1
===================================================== */
const dLegal = document.getElementById("dialogueLegal");
const dPirate = document.getElementById("dialoguePirate");

const dialogue1 = [
  { el: dLegal, text: "Pour vendre nos pierres légalement, nous devons nous inscrire comme auto-entrepreneurs à l’URSSAF." },
  { el: dPirate, text: "Sans inscription, même un commerce honnête devient illégal." }
];

let d1 = 0;

function startDialogue1(){
  disablePirateHover();
  showDialogue1();
}

function showDialogue1(){
  if(d1 >= dialogue1.length){
    hideDialogs();
    startMiniGame1();
    return;
  }

  const cur = dialogue1[d1];
  cur.el.innerHTML = `<p>${cur.text}</p>`;
  cur.el.style.display = "block";

  cur.el.onclick = () => {
    cur.el.style.display = "none";
    d1++;
    showDialogue1();
  };
}

/* =====================================================
   🎮 MINI-JEU 1 — QCM
===================================================== */
const miniGame = document.getElementById("miniGame");

const questions = [
  {
    q:"Où dois-je m’inscrire pour être auto-entrepreneur ?",
    good:["Sur le site de l’URSSAF"],
    bad:["À la banque","À la mairie"]
  },
  {
    q:"Qu’est-ce que l’ACRE ?",
    good:[
      "L’aide à la création ou à la reprise d’une entreprise",
      "Permet une réduction partielle des cotisations sociales",
      "À demander lors de la création ou sous 45 jours"
    ],
    bad:["Une taxe obligatoire"]
  },
  {
    q:"Quand dois-je déclarer mes gains ?",
    good:["Tous les mois","Même si les gains sont à 0"],
    bad:["Uniquement si je gagne"]
  }
];

let qIndex = 0;
let goodCount = 0;

function startMiniGame1(){
  scene.classList.add("sceneDark");
  miniGame.style.display = "block";

  miniGame.innerHTML = `
    <h3>📜 Les devoirs de l’auto-entrepreneur</h3>
    <p id="qText"></p>
    <div id="qChoices"></div>
  `;

  qIndex = 0;
  showQuestion();
}

function showQuestion(){
  goodCount = 0;
  document.getElementById("qText").textContent = questions[qIndex].q;
  const qChoices = document.getElementById("qChoices");
  qChoices.innerHTML = "";

  const answers = [
    ...questions[qIndex].good.map(t => ({t, ok:true})),
    ...questions[qIndex].bad.map(t => ({t, ok:false}))
  ].sort(()=>Math.random()-0.5);

  answers.forEach(a=>{
    const btn = document.createElement("button");
    btn.textContent = a.t;
    btn.onclick = ()=>{
      if(a.ok){
        btn.classList.add("selectedAnswer");
        btn.disabled = true;
        goodCount++;
        if(goodCount === questions[qIndex].good.length){
          qIndex++;
          qIndex < questions.length ? showQuestion() : endMiniGame1();
        }
      } else {
        shake();
      }
    };
    qChoices.appendChild(btn);
  });
}

function endMiniGame1(){
  miniGame.style.display = "none";
  scene.classList.remove("sceneDark");
  startDialogue2();
}

/* =====================================================
   💬 DIALOGUE 2
===================================================== */
const dialogue2 = [
  { el:dLegal, text:"L’auto-entrepreneuriat est un bon départ…" },
  { el:dPirate, text:"…mais quand le trésor grandit, créer une société devient nécessaire." }
];

let d2 = 0;

function startDialogue2(){
  showDialogue2();
}

function showDialogue2(){
  if(d2 >= dialogue2.length){
    hideDialogs();
    startMiniGame2();
    return;
  }

  const cur = dialogue2[d2];
  cur.el.innerHTML = `<p>${cur.text}</p>`;
  cur.el.style.display = "block";

  cur.el.onclick = ()=>{
    cur.el.style.display = "none";
    d2++;
    showDialogue2();
  };
}

/* =====================================================
   🎮 MINI-JEU 2 — STATUTS
===================================================== */
const miniGame2 = document.getElementById("miniGame2");
const game2Content = document.getElementById("game2Content");

let q1Clicks = new Set();
let q2Clicks = new Set();

function startMiniGame2(){
  scene.classList.add("sceneDark");
  miniGame2.style.display = "block";
  showMG2_Q1();
}

/* Question 1 */
function showMG2_Q1(){
  q1Clicks.clear();
  game2Content.innerHTML = `
    <p>Crées-tu ta société seul ou en groupe ?</p>
    <div class="mg2-layout">
      <div class="mg2-left">
        <button onclick="mg2_q1('solo')">Oui</button>
        <button onclick="mg2_q1('group')">Non</button>
      </div>
      <div class="mg2-right" id="mg2Right"></div>
    </div>
  `;
}

window.mg2_q1 = (type)=>{
  q1Clicks.add(type);
  document.getElementById("mg2Right").innerHTML =
    type === "solo"
      ? `<div class="infoBox">EI • EURL • SASU</div>`
      : `<div class="infoBox">SARL • SAS</div>`;

  if(q1Clicks.size === 2){
    setTimeout(showMG2_Q2, 1000);
  }
};

/* Question 2 */
function showMG2_Q2(){
  q2Clicks.clear();
  game2Content.innerHTML = `
    <p>Pourquoi veux-tu changer de statut juridique ?</p>
    <div class="mg2-layout">
      <div class="mg2-left">
        <button onclick="mg2_q2('EI','EI – Entrepreneur Individuel')">Simplifier mes démarches</button>
        <button onclick="mg2_q2('EURL','EURL – Responsabilité limitée')">Plus de rentabilité</button>
        <button onclick="mg2_q2('SASU','SASU – Image luxueuse')">Image luxueuse</button>
        <button onclick="mg2_q2('SARL','SARL – Projet à risques')">Projet à risques</button>
        <button onclick="mg2_q2('SAS','SAS – Travail en équipe')">Travail en équipe</button>
      </div>
      <div class="mg2-right" id="mg2Right"></div>
    </div>
  `;
}

window.mg2_q2 = (key,text)=>{
  if(q2Clicks.has(key)) return;
  q2Clicks.add(key);
  document.getElementById("mg2Right").innerHTML = `<div class="infoBox">${text}</div>`;

  if(q2Clicks.size === 5){
    setTimeout(endMiniGame2, 1200);
  }
};

function endMiniGame2(){
  miniGame2.style.display = "none";
  scene.classList.remove("sceneDark");
  startDialogue3();
}

/* =====================================================
   💬 DIALOGUE 3 — CONCLUSION
===================================================== */
const dialogue3 = [
  { el:dLegal, text:"Tu connais désormais les règles juridiques du royaume." },
  { el:dPirate, text:"Notre trésor est protégé." }
];

let d3 = 0;

function startDialogue3(){
  showDialogue3();
}

function showDialogue3(){
  if(d3 >= dialogue3.length) return;

  const cur = dialogue3[d3];
  cur.el.innerHTML = `<p>${cur.text}</p>`;
  cur.el.style.display = "block";

  cur.el.onclick = ()=>{
    cur.el.style.display = "none";
    d3++;
    showDialogue3();
  };
}

/* =====================================================
   🧹 UTILITAIRES
===================================================== */
function hideDialogs(){
  dLegal.style.display = "none";
  dPirate.style.display = "none";
}

function shake(){
  document.body.classList.add("shake");
  setTimeout(()=>document.body.classList.remove("shake"),350);
}

});
