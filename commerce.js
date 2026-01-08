document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   🌍 ÉTAT GLOBAL
===================================================== */
let dialogueIndex = 0;
let currentDialogues = [];
let currentOnEnd = null;
let quizIndex = 0;
let soundOn = false;

/* =====================================================
   📦 ÉLÉMENTS
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const questVideo = document.getElementById("questVideo");
const closeVideo = document.getElementById("closeVideo");

const background = document.getElementById("background");
const pirate2 = document.getElementById("pirate2bis");
const pirate5 = document.getElementById("pirate5bis");
const pirate3 = document.getElementById("pirate3bis");

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
   🏴‍☠️ PIRATE 5
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
   💬 DIALOGUES
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
  bubble.style.left = r.left + r.width/2 + "px";
  bubble.style.top = r.top - 12 + "px";
  bubble.style.transform = "translate(-50%,-100%)";
}

function nextDialogue(){
  dialogueIndex++;
  dialogueIndex < currentDialogues.length ? renderDialogue() : endDialogues();
}

function endDialogues(){
  bubbleContainer.innerHTML = "";
  if(currentOnEnd) currentOnEnd();
}

/* =====================================================
   💬 DIALOGUES 1
===================================================== */
function startDialogues1(){
  showDialogues([
    { text:"Moussaillon ! Bienvenue sur le marché des trésors !", anchor: pirate5 },
    { text:"J’suis prêt, capitaine !", anchor: pirate2 },
    { text:"Créons ton business plan.", anchor: pirate5 }
  ], startQuiz1);
}

/* =====================================================
   🎮 MINI-JEU
===================================================== */
const quiz1 = [
  {
    question:"Quelle est la première étape d’un business plan ?",
    answers:["Trouver des clients","Définir ton offre","Acheter un bateau"],
    correct:1
  }
];

function startQuiz1(){
  miniGame.classList.remove("hidden");
  miniGame.querySelector(".quizBox").insertAdjacentHTML("afterbegin",`
    <div class="quizTitle">La création de ton business plan</div>
    <div class="quizSeparator"></div>
  `);
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
      document.querySelectorAll("#gameAnswers button").forEach(b=>b.classList.remove("selected"));
      btn.classList.add("selected");
      if(i === q.correct) winQuiz1();
    };
    gameA.appendChild(btn);
  });
}

/* =====================================================
   🏆 FIN MINI-JEU
===================================================== */
function winQuiz1(){
  miniGame.classList.add("hidden");
  fadeScreen.classList.remove("hidden");

  loaderBox.innerHTML = `
    <h1>Bravo 🎉</h1>
    <p>Tu as gagné <span id="poCount">0</span> pièces d’or<br>et ton Business Plan</p>
  `;

  launchGems();

  let po = 0;
  const timer = setInterval(()=>{
    po += 100;
    document.getElementById("poCount").textContent = po;
    if(po >= 5000) clearInterval(timer);
  },30);
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
  canvas.style.zIndex = 2600;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let gems = [];

  for(let i=0;i<150;i++){
    const a = Math.random()*Math.PI*2;
    gems.push({
      x:innerWidth/2,
      y:innerHeight/2,
      vx:Math.cos(a)*6,
      vy:Math.sin(a)*6,
      r:4,
      c:`hsl(${Math.random()*360},100%,60%)`,
      life:80
    });
  }

  function anim(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    gems.forEach(g=>{
      g.x += g.vx;
      g.y += g.vy;
      g.life--;
      ctx.fillStyle = g.c;
      ctx.beginPath();
      ctx.arc(g.x,g.y,g.r,0,Math.PI*2);
      ctx.fill();
    });
    gems = gems.filter(g=>g.life>0);
    gems.length ? requestAnimationFrame(anim) : canvas.remove();
  }
  anim();
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

/* =====================================================
   🏴‍☠️ PIRATE 3
===================================================== */
function activatePirate3(){
  pirate3.classList.add("lower-15");
  pirate3.style.pointerEvents = "auto";
  pirate3.onmouseenter = () => pirate3.classList.add("glow");
  pirate3.onmouseleave = () => pirate3.classList.remove("glow");

  pirate2.style.pointerEvents = "none";
  pirate3.addEventListener("click", showDatabaseBox, { once:true });
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

/* =====================================================
   💬 DIALOGUES 2
===================================================== */
function startDialogues2(){
  showDialogues([
    { text:"C’est toi le nouveau vendeur de pierres?", anchor: pirate5 },
    { text:"Oui, vous cherchez quel type de pierres ?", anchor: pirate2 },
    { text:"Je veux bien les voir, mais on fait confiance qu’à un seul vendeur…", anchor: pirate5 }
  ], () => showLoader("Le Jugement du Marché commence…", 900, startMerchantGame));
}

/* =====================================================
   🎮 MINI-JEU 2
===================================================== */
function startMerchantGame(){
  merchantGame.classList.remove("hidden");

  clueEl.innerHTML = `
    <span style="color:gold;text-shadow:0 0 18px gold;font-weight:bold">
      Analyse le marché avant de décider
    </span>
  `;
}

window.analyzeClient = ()=>{
  clueEl.textContent = "💡 Vous n’êtes que 2 à vendre cette pierre";
};

window.lowerPrice = ()=> failMerchant();
window.keepPrice = ()=>{
  clueEl.innerHTML = "<strong style='color:#7CFF7C'>Bonne décision ✔️</strong>";
  setTimeout(()=>{
    merchantGame.classList.add("hidden");
    afterMerchantDiscussion();
  },1200);
};

function failMerchant(){
  clueEl.textContent = "❌ Mauvaise décision";
}

/* =====================================================
   💬 DISCUSSION FINALE
===================================================== */
function afterMerchantDiscussion(){
  showDialogues([
    { text:"Tu connais bien ton produit, tu peux nous compter dans tes futurs clients", anchor: pirate3 },
    { text:"Tu devrais noter leur nom et adresse dans un cahier", anchor: pirate5 },
    { text:"Pourquoi ?", anchor: pirate2 },
    { text:"Comme ça, si tu as des nouvelles pierres, tu pourras les rappeler pour qu’ils viennent directement t’en acheter", anchor: pirate5 },
    { text:"Merci, c’est une très bonne idée", anchor: pirate2 }
  ], showDatabaseBox);
}

/* =====================================================
   📦 BASE DE DONNÉES (CLIQUABLE)
===================================================== */
function showDatabaseBox(){
  const box = document.createElement("div");
  box.className = "dialogue-bubble";
  box.style.left = "50%";
  box.style.top = "50%";
  box.style.transform = "translate(-50%,-50%)";
  box.style.maxWidth = "640px";
  box.style.cursor = "pointer";

  box.innerHTML = `
    <h2 style="text-align:center;color:#8a5a20">Les Bases de données</h2>
    <hr style="margin:10px 0;border:1px solid #8a5a20">
    <p>
      Une base de données permet de noter l’ensemble des informations de tes clients
      (nom, adresse, téléphone, mail et préférences).
      <br><br>
      Elle est essentielle pour créer un lien durable, suivre tes ventes,
      ton chiffre d’affaires, ton stock et ne rien oublier.
    </p>
    <p style="margin-top:14px;font-weight:bold;text-align:center">
      (Clique pour continuer)
    </p>
  `;

  box.onclick = ()=>{
    bubbleContainer.innerHTML="";
    winFinal();
  };

  bubbleContainer.appendChild(box);
}

/* =====================================================
   🎆 FIN
===================================================== */
function winFinal(){
  fadeScreen.classList.remove("hidden");
  loaderBox.innerHTML = `
    <h1 style="color:gold;text-shadow:0 0 35px gold">
      🎉 Bravo tu as gagné ta quête
    </h1>
  `;
  launchGems();
  setTimeout(()=>window.location.href="menu.html",3000);
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

