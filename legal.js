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
  startDialogue1();
}

/* =====================================================
   💬 DIALOGUE 1 — INTRO LÉGALE
===================================================== */
const pirateLegal = document.getElementById("pirateLegal");
const dLegal = document.getElementById("dialogueLegal");
const dPirate = document.getElementById("dialoguePirate");

const dialogue1 = [
  { el: dLegal, text: "Pour vendre nos pierres légalement, nous devons nous inscrire comme auto-entrepreneurs à l’URSSAF." },
  { el: dPirate, text: "Sans inscription, même un commerce honnête devient illégal." },
  { el: dLegal, text: "Passons à l’épreuve des devoirs légaux." }
];

let d1Index = 0;

function startDialogue1(){
  pirateLegal.onclick = showDialogue1;
}

function showDialogue1(){
  if(d1Index >= dialogue1.length){
    startMiniGame1();
    return;
  }

  const cur = dialogue1[d1Index];
  cur.el.innerHTML = `<p>${cur.text}</p>`;
  cur.el.style.display = "block";

  cur.el.onclick = () => {
    cur.el.style.display = "none";
    cur.el.onclick = null;
    d1Index++;
    showDialogue1();
  };
}

/* =====================================================
   🎮 MINI-JEU 1 — QCM (STYLE FINANCE)
===================================================== */
const miniGame = document.getElementById("miniGame");

const questions = [
  {
    q: "Où dois-je m’inscrire pour être auto-entrepreneur ?",
    good: ["Sur le site de l’URSSAF"],
    bad: ["À la banque", "À la mairie"]
  },
  {
    q: "Qu’est-ce que l’ACRE ?",
    good: [
      "L’aide à la création ou à la reprise d’une entreprise",
      "Permet une réduction partielle des cotisations sociales",
      "À demander lors de la création ou sous 45 jours"
    ],
    bad: ["Une taxe obligatoire"]
  },
  {
    q: "Quand dois-je déclarer mes gains ?",
    good: ["Tous les mois", "Même si les gains sont à 0"],
    bad: ["Uniquement si je gagne"]
  }
];

let qIndex = 0;
let goodCount = 0;

function startMiniGame1(){
  scene.classList.add("sceneDark");

  miniGame.innerHTML = `
    <h3>📜 Les devoirs de l’auto-entrepreneur</h3>
    <p id="qText"></p>
    <div id="qChoices"></div>
  `;

  miniGame.style.display = "block";
  qIndex = 0;
  showQuestion();
}

function showQuestion(){
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
      if(a.ok){
        btn.classList.add("selectedAnswer");
        btn.disabled = true;
        goodCount++;

        if(goodCount === questions[qIndex].good.length){
          qIndex++;
          qIndex < questions.length ? showQuestion() : endMiniGame1();
        }
      }else{
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
   💬 DIALOGUE 2 — TRANSITION SOCIÉTÉ
===================================================== */
const dialogue2 = [
  { el: dLegal, text: "L’auto-entrepreneuriat est un bon départ…" },
  { el: dPirate, text: "…mais quand le trésor grandit, créer une société devient nécessaire." },
  { el: dLegal, text: "Je vais t’aider à choisir le bon statut juridique." }
];

let d2Index = 0;

function startDialogue2(){
  showDialogue2();
}

function showDialogue2(){
  if(d2Index >= dialogue2.length){
    startMiniGame2();
    return;
  }

  const cur = dialogue2[d2Index];
  cur.el.innerHTML = `<p>${cur.text}</p>`;
  cur.el.style.display = "block";

  cur.el.onclick = () => {
    cur.el.style.display = "none";
    cur.el.onclick = null;
    d2Index++;
    showDialogue2();
  };
}

/* =====================================================
   🎮 MINI-JEU 2 — CLIC OBLIGATOIRE + ENCART
===================================================== */
const miniGame2 = document.getElementById("miniGame2");
const game2Content = document.getElementById("game2Content");

let clickedQ1 = new Set();
let clickedQ2 = new Set();

function startMiniGame2(){
  scene.classList.add("sceneDark");
  miniGame2.style.display = "block";
  showMG2_Q1();
}

/* --- Question 1 : clic sur TOUS les boutons --- */
function showMG2_Q1(){
  clickedQ1.clear();
  game2Content.innerHTML = `
    <p>Crées-tu ta société seul ou en groupe ?</p>
    <div id="game2Choices">
      <button onclick="mg2_q1('solo')">Oui</button>
      <button onclick="mg2_q1('group')">Non</button>
    </div>
  `;
}

window.mg2_q1 = (type) => {
  clickedQ1.add(type);

  if(type === "solo"){
    game2Content.innerHTML += `<div class="infoBox">EI • EURL • SASU</div>`;
  }else{
    game2Content.innerHTML += `<div class="infoBox">SARL • SAS</div>`;
  }

  if(clickedQ1.size === 2){
    setTimeout(showMG2_Q2, 1200);
  }
};

/* --- Question 2 : clic obligatoire + encart --- */
function showMG2_Q2(){
  clickedQ2.clear();
  game2Content.innerHTML = `
    <p>Pourquoi veux-tu changer de statut juridique ?</p>
    <div id="game2Choices">
      <button onclick="mg2_q2('EI','EI – Entrepreneur Individuel')">Simplifier mes démarches</button>
      <button onclick="mg2_q2('EURL','EURL – Responsabilité limitée')">Plus de rentabilité</button>
      <button onclick="mg2_q2('SASU','SASU – Image luxueuse')">Image luxueuse</button>
      <button onclick="mg2_q2('SARL','SARL – Projet à risques')">Projet à risques</button>
      <button onclick="mg2_q2('SAS','SAS – Travail en équipe')">Travail en équipe</button>
    </div>
  `;
}

window.mg2_q2 = (key, text) => {
  if(clickedQ2.has(key)) return;

  clickedQ2.add(key);
  game2Content.innerHTML += `<div class="infoBox">${text}</div>`;

  if(clickedQ2.size === 5){
    setTimeout(showMG2_Q3, 1500);
  }
};

/* --- Question 3 : validation finale --- */
function showMG2_Q3(){
  game2Content.innerHTML = `
    <p>Quand dois-tu quitter l’auto-entrepreneuriat ?</p>
    <div id="game2Choices">
      <button onclick="endMiniGame2(true)">CA &gt; 60-70k</button>
      <button onclick="endMiniGame2(true)">Embaucher / se protéger</button>
      <button onclick="endMiniGame2(true)">Charges faibles</button>
      <button onclick="shake()">Quand je le décide</button>
    </div>
  `;
}

function endMiniGame2(success){
  if(!success){
    shake();
    return;
  }

  miniGame2.style.display = "none";
  scene.classList.remove("sceneDark");
  startDialogue3();
}

/* =====================================================
   💬 DIALOGUE 3 — CONCLUSION
===================================================== */
const dialogue3 = [
  { el: dLegal, text: "Tu connais désormais les règles juridiques du royaume." },
  { el: dPirate, text: "Notre trésor est protégé, et notre avenir aussi." },
  { el: dLegal, text: "L’aventure peut continuer." }
];

let d3Index = 0;

function startDialogue3(){
  showDialogue3();
}

function showDialogue3(){
  if(d3Index >= dialogue3.length) return;

  const cur = dialogue3[d3Index];
  cur.el.innerHTML = `<p>${cur.text}</p>`;
  cur.el.style.display = "block";

  cur.el.onclick = () => {
    cur.el.style.display = "none";
    cur.el.onclick = null;
    d3Index++;
    showDialogue3();
  };
}

/* =====================================================
   📳 SHAKE — ERREUR
===================================================== */
function shake(){
  document.body.classList.add("shake");
  setTimeout(() => document.body.classList.remove("shake"), 350);
}

});
