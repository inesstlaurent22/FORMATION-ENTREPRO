document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   🎬 VIDÉO
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const video = document.getElementById("questVideo");
const skipBtn = document.getElementById("closeVideo");
const soundBtn = document.getElementById("toggleSound");
const scene = document.getElementById("scene");
const pirateLegal = document.getElementById("pirateLegal");

/* Sécurité : vérifier que tout existe */
if(video && soundBtn && skipBtn){

  video.muted = true;

  soundBtn.addEventListener("click", (e)=>{
    e.stopPropagation();
    video.muted = !video.muted;
    soundBtn.textContent = video.muted ? "🔊" : "🔈";
  });

  skipBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    e.stopPropagation();
    endVideo();
  });

  video.addEventListener("ended", endVideo);
}

function endVideo(){

  if(video){
    video.pause();
    video.currentTime = 0;
  }

  if(videoContainer){
    videoContainer.classList.add("hidden");
  }

  if(scene){
    scene.style.display = "block";
  }

  if(pirateLegal){
    pirateLegal.style.pointerEvents = "auto";
    pirateLegal.onclick = startDialogues1;
  }
}

/* =====================================================
   ⏭ BOUTON SKIP DIALOGUES
===================================================== */
let currentDialogueCallback = null;
let skipBtnDialogues = null;

function createSkipDialoguesBtn(callback){
  removeSkipDialoguesBtn();

  currentDialogueCallback = callback;

  skipBtnDialogues = document.createElement("button");
  skipBtnDialogues.id = "skipDialoguesBtn";
  skipBtnDialogues.textContent = "Passer les dialogues";
  skipBtnDialogues.onclick = () => {
    dLegal.style.display = "none";
    dPirate.style.display = "none";
    removeSkipDialoguesBtn();
    callback && callback();
  };

  document.body.appendChild(skipBtnDialogues);
}

function removeSkipDialoguesBtn(){
  if(skipBtnDialogues){
    skipBtnDialogues.remove();
    skipBtnDialogues = null;
  }
}
   
/* =====================================================
   🏴‍☠️ PIRATES & DIALOGUES
===================================================== */
const dLegal = document.getElementById("dialogueLegal");
const dPirate = document.getElementById("dialoguePirate");
let dIndex = 0;

function runDialogues(list, callback){

  createSkipDialoguesBtn(callback);

  function next(){
    if(dIndex >= list.length){
      dLegal.style.display = "none";
      dPirate.style.display = "none";
      removeSkipDialoguesBtn();
      callback && callback();
      return;
    }

    const cur = list[dIndex];
    cur.el.innerHTML = `<p>${cur.text}</p>`;
    cur.el.style.display = "block";
    cur.el.onclick = () => {
      cur.el.style.display = "none";
      dIndex++;
      next();
    };
  }

  next();
}

/* =====================================================
   💬 DIALOGUES 1 — URSSAF
===================================================== */
const dialogues1 = [
  { el:dLegal, text:"Pour vendre légalement, vous devez être inscrits comme auto-entrepreneurs à l’URSSAF." },
  { el:dPirate, text:"Sans ça, même un trésor honnête devient illégal." },
  { el:dLegal, text:"Voyons maintenant vos obligations." }
];

function startDialogues1(){
  dIndex = 0;
  pirateLegal.classList.add("noGlow");
  runDialogues(dialogues1, startMiniGame1);
}

/* =====================================================
   🎮 MINI-JEU 1 — AUTO-ENTREPRENEUR
===================================================== */
const miniGame1 = document.getElementById("miniGame");

const aeQuestions = [
  {
    q:"Où dois-je m’inscrire pour être auto-entrepreneur ?",
    good:["Sur le site de l’URSSAF"],
    bad:["À la mairie","À la banque"]
  },
  {
    q:"Qu’est-ce que l’ACRE ?",
    good:[
      "L’aide à la création ou reprise d’entreprise",
      "Une réduction de cotisations sociales",
      "À demander à la création ou sous 45 jours"
    ],
    bad:["Une taxe obligatoire"]
  },
  {
    q:"Quand dois-je déclarer mes gains ?",
    good:["Tous les mois","Même à 0 €"],
    bad:["Uniquement si je gagne"]
  }
];

let aeIndex = 0, aeGood = 0;

function startMiniGame1(){
  scene.classList.add("sceneDim");
  miniGame1.style.display = "block";
  miniGame1.innerHTML = `
  <h3>📜 Devoirs de l’auto-entrepreneur</h3>
  <div id="qText" class="gameQuestion"></div>
  <div id="qChoices"></div>
`;
  aeIndex = 0;
  showAEQuestion();
}

function showAEQuestion(){

  /* Sécurité si index dépasse */
  if(aeIndex >= aeQuestions.length){
    endMiniGame1();
    return;
  }

  aeGood = 0;

  const questionData = aeQuestions[aeIndex];

  const qText = document.getElementById("qText");
  const box = document.getElementById("qChoices");

  qText.textContent = questionData.q;
  box.innerHTML = "";

  /* Fusion + shuffle propre */
  const answers = [
    ...questionData.good.map(t => ({ text:t, ok:true })),
    ...questionData.bad.map(t => ({ text:t, ok:false }))
  ].sort(() => Math.random() - 0.5);

  answers.forEach(answer => {

    const b = document.createElement("button");
    b.textContent = answer.text;

    b.onclick = () => {

      /* Bloque double clic */
      if(b.disabled) return;

      /* Effet bouton appuyé */
      b.classList.add("pressed");
      setTimeout(()=>b.classList.remove("pressed"),120);

      if(answer.ok){

        b.classList.add("correct-locked");
        b.disabled = true;

        aeGood++;

        /* Si toutes les bonnes réponses trouvées */
        if(aeGood === questionData.good.length){

          /* Désactive tous les boutons restants */
          box.querySelectorAll("button").forEach(btn=>{
            btn.disabled = true;
          });

          setTimeout(()=>{
            aeIndex++;
            showAEQuestion();
          }, 500);
        }

      } else {
        shake(b);
      }
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

let q1 = new Set(), q2 = new Set(), q3 = new Set();

function startMiniGame2(){
  scene.classList.add("sceneDim");
  miniGame2.style.display = "block";
  q1.clear();
  showStatutQ1();
}

function showStatutQ1(){
  game2Content.innerHTML = `
    <h3>📜 Choisir son statut</h3>
    <p>Crées-tu ta société seul ou en groupe ?</p>
    <div class="mg2-layout">
      <div class="mg2-left">
        <button id="solo">Oui</button>
        <button id="groupe">Non</button>
      </div>
      <div class="mg2-right" id="mg2Info"></div>
    </div>
    <p style="color:gold;margin-top:12px;">Clique sur les deux options</p>
  `;

  document.getElementById("solo").onclick = () => statutQ1("solo");
  document.getElementById("groupe").onclick = () => statutQ1("groupe");
}

function statutQ1(type){

  if(q1.has(type)) return;
  q1.add(type);

  const info = document.getElementById("mg2Info");

  if(type==="solo"){
    info.innerHTML += `
      <div class="infoBox">
        <strong>Créer seul :</strong><br>
        EI · EURL · SASU
      </div>
    `;
  }

  if(type==="groupe"){
    info.innerHTML += `
      <div class="infoBox">
        <strong>Créer à plusieurs :</strong><br>
        SARL · SAS
      </div>
    `;
  }

  document.getElementById(type).disabled = true;
  document.getElementById(type).classList.add("selectedAnswer");

  if(q1.size === 2){
    setTimeout(showStatutQ2, 900);
  }
}

function showStatutQ2(){
  q2.clear();
  game2Content.innerHTML = `
    <p>Pourquoi changer de statut ?</p>
    <div class="mg2-layout">
      <div class="mg2-left">
        <button onclick="statutQ2(this,'EI')">Simplifier</button>
        <button onclick="statutQ2(this,'EURL')">Rentabilité</button>
        <button onclick="statutQ2(this,'SASU')">Image</button>
        <button onclick="statutQ2(this,'SARL')">Risques</button>
        <button onclick="statutQ2(this,'SAS')">Équipe</button>
      </div>
      <div class="mg2-right" id="mg2Info"></div>
    </div>
  `;
}

window.statutQ2 = (btn,statut)=>{

  if(q2.has(statut)) return;

  q2.add(statut);

  btn.disabled = true;
  btn.classList.add("selectedAnswer");

  const info = document.getElementById("mg2Info");

  const textes = {

    EI: "Simplifier la gestion avec une structure individuelle.",

    EURL: "Optimiser la rentabilité avec une structure de société.",

    SASU: "Améliorer l'image professionnelle et crédibiliser l'entreprise.",

    SARL: "Mieux protéger le patrimoine face aux risques.",

    SAS: "Faciliter le travail en équipe et l'entrée d'associés."
  };

  info.innerHTML += `
    <div class="infoBox">
      <strong>${statut}</strong><br>
      ${textes[statut]}
    </div>
  `;

  if(q2.size === 5){
    setTimeout(showStatutQ3, 800);
  }

};

function showStatutQ3(){
  q3.clear();
  game2Content.innerHTML = `
    <div class="gameQuestion">Quand quitter l"auto-entreprenariat pour un statut de société : </div>
    <div id="qChoices">
      <button onclick="statutQ3(this,1)">CA élevé</button>
      <button onclick="statutQ3(this,2)">Embauche</button>
      <button onclick="statutQ3(this,3)">Peu de charges</button>
      <button onclick="statutQ3(this,0)">Jamais</button>
    </div>
  `;
}

window.statutQ3 = (btn,val)=>{
  if(val===0){ shake(b); return; }
  if(q3.has(val)) return;
  q3.add(val);
  btn.disabled = true;
  btn.classList.add("selectedAnswer");
  if(q3.size === 3){
    miniGame2.style.display = "none";
    scene.classList.remove("sceneDim");
    startDialoguesTVA();
  }
};

/* =====================================================
   💬 DIALOGUES 3 — TVA
===================================================== */
const dialoguesTVA = [
  { el:dLegal, text:"Même en auto-entreprise, tu peux être assujetti à la TVA." },
  { el:dLegal, text:"Voyons si tu sais vraiment la gérer." }
];

function startDialoguesTVA(){
  dIndex = 0;
  runDialogues(dialoguesTVA, startMiniGame3);
}

/* =====================================================
   🎮 MINI-JEU 3 — TVA QCM
===================================================== */
const miniGame3 = document.getElementById("miniGame3");

const tvaQ = [
  { q:"90 000 € en prestations ?", good:["Oui"], bad:["Non"] },
  { q:"Récupérer la TVA consiste à :", good:["Collecter puis reverser"], bad:["La garder","Augmenter ses prix"] },
  { q:"Puis-je récupérer la TVA sur mes dépenses ?", good:["Oui"], bad:["Non"] }
];

let tvaI = 0, tvaGood = 0;

function startMiniGame3(){
  scene.classList.add("sceneDim");
  miniGame3.style.display = "block";
  miniGame3.innerHTML = `
  <h3>💰 TVA</h3>
  <div id="tvaQ" class="gameQuestion"></div>
  <div id="tvaChoices"></div>
`;
  tvaI = 0;
  showTVAQ();
}

function showTVAQ(){
  tvaGood = 0;
  document.getElementById("tvaQ").textContent = tvaQ[tvaI].q;
  const box = document.getElementById("tvaChoices");
  box.innerHTML = "";

  [...tvaQ[tvaI].good.map(t=>({t,ok:true})),...tvaQ[tvaI].bad.map(t=>({t,ok:false}))]
  .sort(()=>Math.random()-0.5)
  .forEach(a=>{
    const b = document.createElement("button");
    b.textContent = a.t;
    b.onclick = ()=>{
      if(a.ok){
        b.classList.add("correct-locked");
        b.disabled = true;
        tvaGood++;
        if(tvaGood === tvaQ[tvaI].good.length){
          tvaI++;
          tvaI < tvaQ.length ? showTVAQ() : endMiniGame3();
        }
      } else shake(b);
    };
    box.appendChild(b);
  });
}

function endMiniGame3(){
  miniGame3.style.display = "none";
  scene.classList.remove("sceneDim");
  startDialoguesFinal();
}

/* =====================================================
   💬 DIALOGUES FINALS
===================================================== */
const dialoguesFinal = [
  { el:dLegal, text:"Très bon travail." },
  { el:dLegal, text:"Vous êtes désormais en parfaite légalité." }
];

function startDialoguesFinal(){
  dIndex = 0;
  runDialogues(dialoguesFinal, startMiniGame4);
}

/* =====================================================
   🎮 MINI-JEU 4 — COFFRE TVA
===================================================== */
const miniGame4 = document.getElementById("miniGame4");
let step4 = 0;

function startMiniGame4(){
  scene.classList.add("sceneDim");
  miniGame4.style.display = "block";
  step4 = 0;
  showCoffreTVA();
}

function showCoffreTVA(){

  const steps = [

    /* Étape 1 */
    `
    <h3>💰 Coffre de la TVA</h3>
    <p>TVA collectée : 200 €</p>
    <div class="gameQuestion">Que fais-tu de cette somme ? </div>
    <div id="qChoices">
      <button onclick="coffreAnswer(false,this)">Je la garde</button>
      <button onclick="coffreAnswer(true,this)">Je la mets de côté pour l’État</button>
    </div>
    `,

    /* Étape 2 */
    `
    <h3>🧾 Dépense pro</h3>
    <p>Logiciel : 120 € TTC (TVA 20 €)</p>
    <div class="gameQuestion">La TVA est : </div>
    <div id="qChoices">
      <button onclick="coffreAnswer(true)">Récupérable</button>
      <button onclick="coffreAnswer(false)">Perdue</button>
    </div>
    `,

    /* Étape 3 */
    `
    <h3>🏛️ TVA à reverser</h3>
    <div class="gameQuestion">200 - 20 €</div>
    <div id="qChoices">
      <button onclick="coffreAnswer(false)">200 €</button>
      <button onclick="coffreAnswer(true)">180 €</button>
      <button onclick="coffreAnswer(false)">20 €</button>
    </div>
    `,

    /* Étape 4 — Résumé */
    `
    <h3>📜 Résumé</h3>
    <p>Tu récupères 20 €</p>
    <p>Tu reverses 180 €</p>
    <div id="qChoices">
      <button onclick="endMiniGame4()">Valider</button>
    </div>
    `
  ];

  miniGame4.innerHTML = steps[step4];
}

window.endMiniGame4 = function(){
  miniGame4.style.display = "none";
  scene.classList.remove("sceneDim");
  showLegalWin();
};


/* =====================================================
   ▶️ AVANCEMENT ÉTAPES
===================================================== */
window.coffreAnswer = function(good,btn){

  if(!good){
    shake(btn);
    return;
  }

  if(!good){
    shake(b);
    return;
  }

  step4++;

  if(step4 < 3){
    showCoffreTVA();
  } else {
    step4 = 3;
    showCoffreTVA();
  }
};


/* =====================================================
   🏆 VICTOIRE LEGAL
===================================================== */
window.showLegalWin = function(){

  const overlay = document.createElement("div");
  overlay.id = "communication-win";

  overlay.innerHTML = `
    <div class="win-box">
      <h2>🏴‍☠️ Bravo !</h2>
      <p>Tu as gagné la quête Legal !</p>
      <div class="gems-container"></div>
    </div>
  `;

  document.body.appendChild(overlay);

  const gemsContainer = overlay.querySelector(".gems-container");

  requestAnimationFrame(()=>{
    launchGemsExplosion(gemsContainer);
  });

  /* 🔓 Déblocage pirate4 */
  sessionStorage.setItem("unlock_pirate4","true");

  /* ⏳ Redirection */
  setTimeout(()=>{
    sessionStorage.setItem("questCompleted", "true");
    window.location.href = "menu.html";
  }, 2500);
}


/* =====================================================
   💎 EXPLOSION DE GEMS
===================================================== */
function launchGemsExplosion(container){

  const colors = ["#ffd700","#00f2ff","#ff4fd8","#7cff00","#ff8c00"];

  for(let i = 0; i < 50; i++){

    const g = document.createElement("div");
    g.className = "gem";

    const size = Math.random()*10 + 8;
    g.style.width = size + "px";
    g.style.height = size + "px";
    g.style.background = colors[Math.floor(Math.random()*colors.length)];

    g.style.left = "50%";
    g.style.top = "50%";

    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random()*260 + 80;

    g.style.setProperty("--x", Math.cos(angle)*dist + "px");
    g.style.setProperty("--y", Math.sin(angle)*dist + "px");

    container.appendChild(g);
  }
}

/* =====================================================
   📳 SHAKE
===================================================== */
function shake(btn){

  if(!btn) return;

  btn.classList.remove("button-shake");
  void btn.offsetWidth;

  btn.classList.add("button-shake");

  setTimeout(()=>{
    btn.classList.remove("button-shake");
  },350);

}

});
