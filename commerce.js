document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   🌍 ÉTAT GLOBAL
===================================================== */
let dialogueIndex = 0;
let currentDialogues = [];
let currentOnEnd = null;
let quizIndex = 0;
let turning = false;
let soundOn = false;

/* =====================================================
   📦 ÉLÉMENTS
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const questVideo = document.getElementById("questVideo");
const toggleSound = document.getElementById("toggleSound");
const closeVideo = document.getElementById("closeVideo");

const background = document.getElementById("background");
const pirate2 = document.getElementById("pirate2bis");
const pirate5 = document.getElementById("pirate5bis");
const pirate3 = document.getElementById("pirate3bis");

const bubbleContainer = document.getElementById("bubbleContainer");

const miniGame = document.getElementById("miniGameContainer");
const gameQ = document.getElementById("gameQuestion");
const gameA = document.getElementById("gameAnswers");
const gameF = document.getElementById("gameFeedback");

const fadeScreen = document.getElementById("fadeScreen");
const loaderBox = fadeScreen.querySelector(".loaderBox");

const bookContainer = document.getElementById("bookContainer");
const leftPage = document.getElementById("leftPage");
const continueBtn = document.getElementById("continueQuestBtn");

/* =====================================================
   🎬 VIDÉO
===================================================== */
questVideo.muted = true;
toggleSound.textContent = "🔇";

toggleSound.onclick = () => {
  soundOn = !soundOn;
  questVideo.muted = !soundOn;
  toggleSound.textContent = soundOn ? "🔊" : "🔇";
};

questVideo.onended = endVideo;
closeVideo.onclick = endVideo;

function endVideo(){
  questVideo.pause();
  videoContainer.style.display = "none";

  showLoader("Chargement...", 800, () => {
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
  pirate5.style.cursor = "pointer";
  pirate5.onmouseenter = () => pirate5.classList.add("glow");
  pirate5.onmouseleave = () => pirate5.classList.remove("glow");
  pirate5.addEventListener("click", startDialogues1, { once:true });
}

/* =====================================================
   💬 SYSTÈME DE DIALOGUES
===================================================== */
function showDialogues(dialogues, onEnd){
  currentDialogues = dialogues;
  currentOnEnd = onEnd;
  dialogueIndex = 0;
  bubbleContainer.innerHTML = "";

  pirate3.style.pointerEvents = "none"; // ❌ bloqué pendant dialogue
  pirate3.style.top = (pirate3.offsetTop - 5) + "px";

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
    { text:"Observe bien les autres vendeurs.", anchor: pirate5 }
  ], startQuiz1);
}

/* =====================================================
   🎮 MINI-JEU 1
===================================================== */
const quiz1 = [
  {
    question:"Où les pirates ont-ils trouvé leurs pierres ?",
    answers:[
      "Dans un coffre dans une grotte secrète",
      "Ils les ont achetées au marché",
      "La tante les leur a données"
    ],
    correct:0
  },
  {
    question:"Qui fait partie de l'équipage pirate ?",
    answers:[
      "Toi et les deux moussaillons",
      "Juste le capitaine",
      "Toute la famille pirate"
    ],
    correct:0
  }
];

function startQuiz1(){
  quizIndex = 0;
  miniGame.classList.remove("hidden");
  showQuestion();
}

function showQuestion(){
  gameF.textContent = "";
  const q = quiz1[quizIndex];
  gameQ.textContent = q.question;
  gameA.innerHTML = "";

  q.answers.forEach((txt,i)=>{
    const btn = document.createElement("button");
    btn.textContent = txt;
    btn.onclick = ()=>{
      document.querySelectorAll("#gameAnswers button").forEach(b=>b.classList.remove("selected"));
      btn.classList.add("selected");

      if(i === q.correct){
        gameF.textContent = "Bonne réponse 👍";
        setTimeout(()=>{
          quizIndex++;
          quizIndex < quiz1.length ? showQuestion() : winQuiz1();
        },700);
      } else {
        gameF.textContent = "Mauvaise réponse";
      }
    };
    gameA.appendChild(btn);
  });
}

/* =====================================================
   💎 GEMS CANVAS
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
      x:canvas.width/2,
      y:canvas.height/2,
      vx:Math.cos(a)*(Math.random()*8+4),
      vy:Math.sin(a)*(Math.random()*8+4),
      r:Math.random()*4+3,
      c:`hsl(${Math.random()*360},100%,60%)`,
      life:100
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
   🏆 FIN MINI-JEU 1
===================================================== */
function winQuiz1(){
  miniGame.classList.add("hidden");
  fadeScreen.classList.remove("hidden");

  loaderBox.innerHTML = `
    <div style="font-size:64px;font-weight:bold;
      background:linear-gradient(90deg,red,orange,yellow,green,cyan,blue,violet);
      -webkit-background-clip:text;
      color:transparent;
      text-shadow:0 0 30px gold">
      Bravo 🎉
    </div>
    <div style="font-size:22px;margin-top:12px">
      tu as gagné <span id="poCount">0</span> pièces d’or<br>
      et ton business plan 🎁
    </div>
  `;

  launchGems();

  let po = 0;
  const timer = setInterval(()=>{
    po += 100;
    document.getElementById("poCount").textContent = po;
    if(po >= 5000){
      clearInterval(timer);
      setTimeout(openBook, 900);
    }
  },25);
}

/* =====================================================
   📖 LIVRE
===================================================== */
const bookPages = [
  "Businessplancov.png",
  "Businessplan1.png",
  "Businessplan2.png",
  "Businessplan3.png"
];

let pageIndex = 0;

function openBook(){
  fadeScreen.classList.add("hidden");
  bookContainer.classList.remove("hidden");

  const title = document.createElement("div");
  title.textContent = "Ton Business Plan est prêt";
  title.style.cssText = `
    position:fixed;top:20px;width:100%;
    text-align:center;font-size:32px;
    color:gold;text-shadow:0 0 25px gold;
    z-index:2300`;
  document.body.appendChild(title);

  pageIndex = 0;
  updateBook();
}

function updateBook(){
  leftPage.src = "images/" + bookPages[pageIndex];
  continueBtn.classList.toggle("hidden", pageIndex !== bookPages.length-1);
}

leftPage.onclick = e => {
  if(turning) return;
  turning = true;

  const forward = e.offsetX > leftPage.clientWidth/2;
  leftPage.style.transform = `rotateY(${forward ? "-140deg" : "140deg"})`;

  setTimeout(()=>{
    if(forward && pageIndex < bookPages.length-1) pageIndex++;
    if(!forward && pageIndex > 0) pageIndex--;
    leftPage.style.transform = "rotateY(0deg)";
    updateBook();
    turning = false;
  },600);
};

continueBtn.onclick = () => {
  bookContainer.classList.add("hidden");
  activatePirate3();
};

/* =====================================================
   🏴‍☠️ PIRATE 3
===================================================== */
function activatePirate3(){
  pirate3.style.top = (pirate3.offsetTop + 15) + "px";
  pirate3.style.pointerEvents = "auto";
  pirate3.onmouseenter = () => pirate3.classList.add("glow");
  pirate3.onmouseleave = () => pirate3.classList.remove("glow");

  pirate2.style.pointerEvents = "none";

  pirate3.addEventListener("click", showDatabaseBox, { once:true });
}

/* =====================================================
   📦 BASE DE DONNÉES + FIN
===================================================== */
function showDatabaseBox(){
  const box = document.createElement("div");
  box.className = "dialogue-bubble pirate-panel";
  box.style.left = "50%";
  box.style.top = "50%";
  box.style.transform = "translate(-50%,-50%)";
  box.style.maxWidth = "720px";

  box.innerHTML = `
    <h2 style="text-align:center">Les Bases de données</h2>
    <hr>
    <p>
      Une base de données permet de noter les informations de tes clients
      et de créer un lien durable avec eux.
    </p>
  `;

  box.onclick = () => {
    fadeScreen.classList.remove("hidden");
    loaderBox.innerHTML = "<h1 style='color:gold'>Bravo tu as terminé cette première quête</h1>";
    launchGems();

    setTimeout(()=>{
      sessionStorage.setItem("unlock_pirate3","true");
      window.location.href = "menu.html";
    },2500);
  };

  bubbleContainer.appendChild(box);
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
