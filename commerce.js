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
