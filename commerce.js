document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   🌍 ÉTAT GLOBAL
===================================================== */
let dialogueIndex = 0;
let currentDialogues = [];
let currentOnEnd = null;
let quizIndex = 0;

/* =====================================================
   📦 ÉLÉMENTS
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const questVideo = document.getElementById("questVideo");
const closeVideo = document.getElementById("closeVideo");

const background = document.getElementById("background");

const pirate2 = document.getElementById("pirate2bis");
const pirate3 = document.getElementById("pirate3bis");
const pirate5 = document.getElementById("pirate5bis");

const bubbleContainer = document.getElementById("bubbleContainer");

const miniGame = document.getElementById("miniGameContainer");
const gameQ = document.getElementById("gameQuestion");
const gameA = document.getElementById("gameAnswers");

const fadeScreen = document.getElementById("fadeScreen");
const loaderBox = fadeScreen.querySelector(".loaderBox");

/* =====================================================
   🎬 VIDÉO
===================================================== */
closeVideo.textContent = "Passer la vidéo";
closeVideo.onclick = endVideo;

function endVideo(){
  questVideo.pause();
  videoContainer.style.display = "none";

  showLoader("⚓ Chargement des trésors… ⚓", 900, () => {
    background.classList.remove("hidden");
    pirate2.classList.remove("hidden");
    pirate5.classList.remove("hidden");
    enablePirate5();
  });
}

/* =====================================================
   🏴‍☠️ PIRATE 5 — DÉCLENCHEUR
===================================================== */
function enablePirate5(){
  pirate5.classList.add("glow");
  pirate5.style.cursor = "pointer";

  pirate5.addEventListener("click", () => {
    pirate5.classList.remove("glow");
    pirate5.classList.add("frozen");
    startDialogues1();
  }, { once:true });
}

/* =====================================================
   💬 SYSTÈME DE DIALOGUES
===================================================== */
function showDialogues(dialogues, onEnd){
  currentDialogues = dialogues;
  currentOnEnd = onEnd;
  dialogueIndex = 0;
  bubbleContainer.innerHTML = "";

  const bubble = document.createElement("div");
  bubble.className = "dialogue-bubble";
  bubble.onclick = nextDialogue;
  bubbleContainer.appendChild(bubble);

  renderDialogue();
}

function renderDialogue(){
  const d = currentDialogues[dialogueIndex];
  const r = d.anchor.getBoundingClientRect();
  const bubble = document.querySelector(".dialogue-bubble");

  bubble.innerHTML = d.text;
  bubble.style.left = r.left + r.width / 2 + "px";
  bubble.style.top = r.top - 12 + "px";
  bubble.style.transform = "translate(-50%,-100%)";
}

function nextDialogue(){
  dialogueIndex++;
  dialogueIndex < currentDialogues.length
    ? renderDialogue()
    : endDialogues();
}

function endDialogues(){
  bubbleContainer.innerHTML = "";
  if(currentOnEnd) currentOnEnd();
}

/* =====================================================
   💬 DIALOGUES 1 — INTRO
===================================================== */
function startDialogues1(){
  showDialogues([
    { text:"Moussaillon ! Bienvenue sur le marché des trésors.", anchor: pirate5 },
    { text:"Ici, la confiance vaut plus que l’or.", anchor: pirate5 },
    { text:"Créons d’abord ton business plan.", anchor: pirate2 }
  ], startQuiz1);
}

/* =====================================================
   🎮 MINI-JEU 1 — BUSINESS PLAN
===================================================== */
const quiz1 = [
  {
    question:"Quelle est la première étape d’un business plan ?",
    answers:[
      "Trouver des clients",
      "Définir clairement ton offre",
      "Acheter un bateau"
    ],
    correct:1
  }
];

function startQuiz1(){
  quizIndex = 0;
  miniGame.classList.remove("hidden");
  showQuestion();
}

function showQuestion(){
  const q = quiz1[quizIndex];
  gameQ.textContent = q.question;
  gameA.innerHTML = "";

  q.answers.forEach((txt,i)=>{
    const btn = document.createElement("button");
    btn.textContent = txt;
    btn.onclick = ()=>{
      gameA.querySelectorAll("button").forEach(b=>b.classList.remove("selected"));
      btn.classList.add("selected");
      if(i === q.correct) winQuiz1();
    };
    gameA.appendChild(btn);
  });
}

/* =====================================================
   🏆 FIN MINI-JEU 1
===================================================== */
function winQuiz1(){
  miniGame.classList.add("hidden");
  fadeScreen.classList.remove("hidden");

  loaderBox.innerHTML = `
    <h1 style="color:gold;text-shadow:0 0 30px gold">Bravo 🎉</h1>
    <p>Tu as gagné <span id="poCount">0</span> pièces d’or<br>et ton Business Plan</p>
  `;

  launchGems();

  let po = 0;
  const timer = setInterval(()=>{
    po += 100;
    document.getElementById("poCount").textContent = po;
    if(po >= 5000){
      clearInterval(timer);
      setTimeout(startDialogues2, 900);
    }
  },25);
}

/* =====================================================
   💬 DIALOGUES 2 — AVANT JUGEMENT DU MARCHÉ
===================================================== */
function startDialogues2(){
  fadeScreen.classList.add("hidden");
  showDialogues([
    { text:"Ces pierres sont magnifiques…", anchor: pirate3 },
    { text:"Mais le marché est exigeant.", anchor: pirate5 },
    { text:"Il va falloir gagner leur confiance.", anchor: pirate5 }
  ], startMarketJudgment);
}

/* =====================================================
   🎮 MINI-JEU 2 — LE JUGEMENT DU MARCHÉ
===================================================== */
function startMarketJudgment(){
  miniGame.classList.remove("hidden");
  miniGame.innerHTML = `
    <div class="quizBox">
      <div class="quizTitle">Le Jugement du Marché</div>
      <div class="quizSeparator"></div>
      <p>Les clients hésitent. Que fais-tu ?</p>
      <button onclick="marketChoice('value')">Expliquer la valeur des pierres</button>
      <button onclick="marketChoice('price')">Baisser fortement le prix</button>
      <button onclick="marketChoice('ignore')">Ignorer les clients</button>
    </div>
  `;
}

window.marketChoice = (choice)=>{
  if(choice === "value"){
    showLoader("✅ Le marché te fait confiance", 1200, startDialogues3);
  } else {
    showLoader("❌ Mauvaise décision… Le marché doute", 1200, startMarketJudgment);
  }
};

/* =====================================================
   💬 DIALOGUES 3 — DISCUSSION ENTRE LES 3 PIRATES (RÉTABLIE)
===================================================== */
function startDialogues3(){
  showDialogues([
    { text:"Tu connais bien ton produit.", anchor: pirate3 },
    { text:"Oui, ils peuvent te faire confiance.", anchor: pirate5 },
    { text:"Tu devrais noter leurs informations.", anchor: pirate5 },
    { text:"Pourquoi ?", anchor: pirate2 },
    { text:"Comme ça, quand tu auras de nouvelles pierres, tu pourras les recontacter directement.", anchor: pirate5 },
    { text:"Bonne idée, je vais faire ça.", anchor: pirate2 }
  ], showDatabaseBox);
}

/* =====================================================
   📦 BASE DE DONNÉES
===================================================== */
function showDatabaseBox(){
  miniGame.classList.add("hidden");

  const box = document.createElement("div");
  box.className = "dialogue-bubble pirate-panel";
  box.style.left = "50%";
  box.style.top = "50%";
  box.style.transform = "translate(-50%,-50%)";

  box.innerHTML = `
    <h2 style="text-align:center">Les bases de données</h2>
    <p>
      Une base de données permet de conserver les informations
      de tes clients pour créer une relation durable.
    </p>
    <p style="text-align:center;font-weight:bold">(Clique pour terminer)</p>
  `;

  box.onclick = winFinal;
  bubbleContainer.appendChild(box);
}

/* =====================================================
   🎆 FIN DE QUÊTE
===================================================== */
function winFinal(){
  bubbleContainer.innerHTML = "";
  fadeScreen.classList.remove("hidden");
  loaderBox.innerHTML = "<h1 style='color:gold'>Quête terminée ⚓</h1>";
  launchGems();
  setTimeout(()=>window.location.href="menu.html",3000);
}

/* =====================================================
   💎 GEMS
===================================================== */
function launchGems(){
  const canvas = document.createElement("canvas");
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  canvas.style.position = "fixed";
  canvas.style.inset = 0;
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = 3000;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let gems = [];

  for(let i=0;i<160;i++){
    const a = Math.random()*Math.PI*2;
    gems.push({
      x:innerWidth/2,
      y:innerHeight/2,
      vx:Math.cos(a)*6,
      vy:Math.sin(a)*6,
      r:4,
      c:`hsl(${Math.random()*360},100%,60%)`,
      life:90
    });
  }

  function update(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    gems.forEach(g=>{
      g.vy += 0.15;
      g.x += g.vx;
      g.y += g.vy;
      g.life--;
      ctx.fillStyle = g.c;
      ctx.beginPath();
      ctx.arc(g.x,g.y,g.r,0,Math.PI*2);
      ctx.fill();
    });
    gems = gems.filter(g=>g.life>0);
    gems.length ? requestAnimationFrame(update) : canvas.remove();
  }
  update();
}

/* =====================================================
   ⏳ LOADER
===================================================== */
function showLoader(text,time,cb){
  loaderBox.innerHTML = text;
  fadeScreen.classList.remove("hidden");
  setTimeout(()=>{
    fadeScreen.classList.add("hidden");
    if(cb) cb();
  },time);
}

});
