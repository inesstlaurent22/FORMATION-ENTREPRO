document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   🌍 ÉTAT GLOBAL
===================================================== */
let dialogueIndex = 0;
let quizIndex = 0;
let currentDialogues = [];
let currentOnEnd = null;
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
const book = document.querySelector(".book");
const leftPage = document.getElementById("leftPage");
const continueBtn = document.getElementById("continueQuestBtn");

const merchantGame = document.getElementById("merchantGame");

/* =====================================================
   🎬 VIDÉO SON
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
  showLoader("Chargement...", 900, () => {
    background.classList.remove("hidden");
    pirate2.classList.remove("hidden");
    pirate5.classList.remove("hidden");
    enableFirstDialogueTrigger();
  });
}

/* =====================================================
   🏴‍☠️ PIRATE 5 — HOVER + CLICK
===================================================== */
pirate5.style.cursor = "pointer";
pirate5.onmouseenter = () => pirate5.classList.add("glow");
pirate5.onmouseleave = () => pirate5.classList.remove("glow");

function enableFirstDialogueTrigger(){
  pirate5.addEventListener("click", startDialogues1, { once:true });
}

/* =====================================================
   💬 DIALOGUES ANCRÉS
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

  const skip = document.createElement("button");
  skip.className = "skipDialogueBtn";
  skip.textContent = "Passer les dialogues";
  skip.onclick = endDialogues;
  document.body.appendChild(skip);

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
  document.querySelectorAll(".skipDialogueBtn").forEach(b=>b.remove());
  if(currentOnEnd) currentOnEnd();
}

/* =====================================================
   💬 DIALOGUES 1
===================================================== */
function startDialogues1(){
  showDialogues([
    { text:"Moussaillon ! Bienvenue sur le marché des trésors !", anchor: pirate5 },
    { text:"J’suis prêt, capitaine !", anchor: pirate2 },
    { text:"Observe les autres vendeurs et dépasse-les.", anchor: pirate5 }
  ], () => showLoader("Le mini-jeu va commencer…",800,startQuiz1));
}

/* =====================================================
   🎮 MINI-JEU 1
===================================================== */
const quiz1 = [
  { question:"Où les pirates ont-ils trouvé leurs pierres ?", answers:["Dans un coffre","Au marché","Chez leur tante"], correct:0 },
  { question:"Qui fait partie de l'équipage pirate ?", answers:["Toi et les moussaillons","Juste le capitaine","Toute la famille"], correct:0 }
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
      if(i===q.correct){
        gameF.textContent = "Bonne réponse 👍";
        setTimeout(()=> {
          quizIndex++;
          quizIndex < quiz1.length ? showQuestion() : winQuiz1();
        },700);
      } else gameF.textContent = "Mauvaise réponse";
    };
    gameA.appendChild(btn);
  });
}

/* =====================================================
   💎 CANVAS GEM FIREWORKS
===================================================== */
let canvas, ctx, gems = [];

function launchGems(){
  canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position = "fixed";
  canvas.style.inset = 0;
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = 2600;
  document.body.appendChild(canvas);

  ctx = canvas.getContext("2d");
  gems = [];

  for(let i=0;i<120;i++){
    const angle = Math.random()*Math.PI*2;
    const speed = Math.random()*8 + 4;
    gems.push({
      x: canvas.width/2,
      y: canvas.height/2,
      vx: Math.cos(angle)*speed,
      vy: Math.sin(angle)*speed,
      r: Math.random()*4+3,
      color: `hsl(${Math.random()*360},100%,60%)`,
      life: 100
    });
  }

  requestAnimationFrame(updateGems);
}

function updateGems(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  gems.forEach(g=>{
    g.vy += 0.15;
    g.x += g.vx;
    g.y += g.vy;
    g.life--;
    ctx.fillStyle = g.color;
    ctx.beginPath();
    ctx.arc(g.x,g.y,g.r,0,Math.PI*2);
    ctx.fill();
  });

  gems = gems.filter(g=>g.life>0);
  if(gems.length>0) requestAnimationFrame(updateGems);
  else canvas.remove();
}

/* =====================================================
   🏆 RÉUSSITE MINI-JEU 1
===================================================== */
function winQuiz1(){
  miniGame.classList.add("hidden");
  fadeScreen.classList.remove("hidden");

  loaderBox.innerHTML = `
    <div class="rewardTitle">Bravo ! Tu as gagné</div>
    <div class="rewardCounter" id="poCounter">0 PO</div>
  `;

  launchGems();

  let po = 0;
  const timer = setInterval(()=>{
    po += 100;
    document.getElementById("poCounter").textContent = po+" PO";
    if(po>=5000){
      clearInterval(timer);
      setTimeout(()=> {
        fadeScreen.classList.add("hidden");
        openBook();
      },900);
    }
  },25);
}

/* =====================================================
   📖 LIVRE — PAGE CURL RÉALISTE
===================================================== */
const bookPages = [
  "Businessplancov.png",
  "Businessplan1.png",
  "Businessplan2.png",
  "Businessplan3.png"
];

let pageIndex = 0;
let turning = false;

function openBook(){
  pageIndex = 0;
  bookContainer.classList.remove("hidden");
  updateBook();
}

function updateBook(){
  leftPage.src = "images/" + bookPages[pageIndex];
  continueBtn.classList.toggle("hidden", pageIndex !== bookPages.length-1);
}

book.onclick = ()=>{
  if(turning || pageIndex >= bookPages.length-1) return;
  turning = true;

  leftPage.style.transformOrigin = "left center";
  leftPage.style.transform = "rotateY(-140deg)";
  leftPage.style.boxShadow = "30px 0 40px rgba(0,0,0,.6)";

  setTimeout(()=>{
    pageIndex++;
    leftPage.style.transform = "rotateY(0deg)";
    leftPage.style.boxShadow = "none";
    updateBook();
    turning = false;
  },600);
};

continueBtn.onclick = ()=>{
  bookContainer.classList.add("hidden");
  spawnPirate3();
};

/* =====================================================
   🏴‍☠️ PIRATE 3 + DIALOGUES
===================================================== */
function spawnPirate3(){
  pirate3.classList.remove("hidden");
  pirate3.style.top = (pirate3.offsetTop - 150)+"px";

  showDialogues([
    { text:"C’est toi le nouveau vendeur de pierres ?", anchor: pirate5 },
    { text:"Oui, vous cherchez quel type de pierres ?", anchor: pirate2 },
    { text:"On ne fait confiance qu’à un seul vendeur ici…", anchor: pirate5 }
  ], ()=> showLoader("Le Jugement du Marché commence…",900,startMerchantGame));
}

/* =====================================================
   🎮 MINI-JEU 2
===================================================== */
function startMerchantGame(){
  merchantGame.classList.remove("hidden");
  document.getElementById("clue").textContent =
    "Analyse le marché avant de décider.";
}

window.analyzeClient = ()=>{
  document.getElementById("clue").textContent =
    "💡 Vous n’êtes que 2 à vendre cette pierre";
};

window.lowerPrice = ()=> failMerchant();
window.refuseSale = ()=> failMerchant();

window.keepPrice = ()=>{
  merchantGame.classList.add("hidden");
  winFinal();
};

function failMerchant(){
  document.getElementById("clue").textContent = "❌ Mauvaise décision";
}

/* =====================================================
   🎆 FIN
===================================================== */
function winFinal(){
  fadeScreen.classList.remove("hidden");
  loaderBox.innerHTML = `
    <h1 style="color:gold;text-shadow:0 0 30px gold">
      🎉 Bravo tu as gagné la quête
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
