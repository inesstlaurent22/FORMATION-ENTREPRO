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
const leftPage = document.getElementById("leftPage");
const continueBtn = document.getElementById("continueQuestBtn");

const merchantGame = document.getElementById("merchantGame");

/* =====================================================
   🎬 VIDÉO – SON
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

    // pirate5bis 20% plus haut
    pirate5.style.top = (pirate5.offsetTop * 0.8) + "px";

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
  document.querySelectorAll(".skipDialogueBtn").forEach(b => b.remove());
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
  ], () => showLoader("Le mini-jeu va commencer…", 800, startQuiz1));
}

/* =====================================================
   🎮 MINI-JEU 1 (ENCADRÉ + RÉPONSE QUI S’ALLUME)
===================================================== */
const quiz1 = [
  {
    question:"Où les pirates ont-ils trouvé leurs pierres ?",
    answers:["Dans un coffre dans une grotte secrète","Ils les ont achetées au marché","La tante les leur a données"],
    correct:0
  },
  {
    question:"Qui fait partie de l'équipage pirate ?",
    answers:["Toi et les deux moussaillons","Juste le capitaine","Toute la famille pirate"],
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
      document.querySelectorAll("#gameAnswers button")
        .forEach(b=>b.classList.remove("selected"));

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
   💎 GEM FIREWORKS (CANVAS)
===================================================== */
let canvas, ctx, gems = [];

function launchGems(){
  canvas = document.createElement("canvas");
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  canvas.style.position = "fixed";
  canvas.style.inset = 0;
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = 2600;
  document.body.appendChild(canvas);

  ctx = canvas.getContext("2d");
  gems = [];

  for(let i=0;i<140;i++){
    const a = Math.random()*Math.PI*2;
    const s = Math.random()*9+4;
    gems.push({
      x:canvas.width/2,
      y:canvas.height/2,
      vx:Math.cos(a)*s,
      vy:Math.sin(a)*s,
      r:Math.random()*4+3,
      c:`hsl(${Math.random()*360},100%,60%)`,
      life:100
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
    ctx.fillStyle = g.c;
    ctx.beginPath();
    ctx.arc(g.x,g.y,g.r,0,Math.PI*2);
    ctx.fill();
  });
  gems = gems.filter(g=>g.life>0);
  gems.length ? requestAnimationFrame(updateGems) : canvas.remove();
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
  const t = setInterval(()=>{
    po += 100;
    document.getElementById("poCounter").textContent = po+" PO";
    if(po >= 5000){
      clearInterval(t);
      setTimeout(()=>{
        fadeScreen.classList.add("hidden");
        openBook();
      },900);
    }
  },25);
}

/* =====================================================
   📖 LIVRE — AVANT / ARRIÈRE
===================================================== */
const bookPages = [
  "Businessplancov.png",
  "Businessplan1.png",
  "Businessplan2.png",
  "Businessplan3.png"
];

let pageIndex = 0;

function openBook(){
  pageIndex = 0;
  bookContainer.classList.remove("hidden");
  updateBook();
}

function updateBook(){
  leftPage.src = "images/" + bookPages[pageIndex];
  continueBtn.classList.toggle("hidden", pageIndex !== bookPages.length-1);
}

leftPage.onclick = (e)=>{
  const x = e.offsetX;
  if(x < leftPage.clientWidth/2 && pageIndex>0){
    pageIndex--;
  } else if(pageIndex < bookPages.length-1){
    pageIndex++;
  }
  updateBook();
};

continueBtn.onclick = ()=>{
  bookContainer.classList.add("hidden");
  spawnPirate3();
};

/* =====================================================
   🏴‍☠️ PIRATE 3 + DIALOGUES FIN
===================================================== */
function spawnPirate3(){
  pirate3.classList.remove("hidden");
  pirate3.style.top = (pirate3.offsetTop - 150) + "px";

  showDialogues([
    { text:"Tu connais bien ton produit, tu peux nous compter dans tes futurs clients", anchor: pirate3 },
    { text:"Tu devrais noter leur nom et adresse dans un cahier", anchor: pirate5 },
    { text:"Pourquoi ?", anchor: pirate2 },
    { text:"Comme ça, si tu as des nouvelles pierres, tu pourras les rappeler pour qu’ils viennent directement t’en acheter", anchor: pirate5 },
    { text:"Merci, c’est une très bonne idée", anchor: pirate2 }
  ], showDatabaseMessage);
}

/* =====================================================
   📦 MESSAGE BASE DE DONNÉES
===================================================== */
function showDatabaseMessage(){
  const box = document.createElement("div");
  box.className = "dialogue-bubble";
  box.style.left = "50%";
  box.style.top = "50%";
  box.style.transform = "translate(-50%,-50%)";
  box.innerHTML = `
    <strong>Base de données</strong><br><br>
    Une base de données permet de noter l’ensemble des informations de tes clients
    (nom, adresse, téléphone, mail, préférences).  
    Elle est essentielle pour créer un lien durable, suivre tes ventes,
    ton chiffre d’affaires et ton stock.
  `;
  bubbleContainer.appendChild(box);

  setTimeout(()=>{
    bubbleContainer.innerHTML="";
    winFinal();
  },4000);
}

/* =====================================================
   🎆 FIN
===================================================== */
function winFinal(){
  fadeScreen.classList.remove("hidden");
  loaderBox.innerHTML = `
    <h1 style="color:gold;text-shadow:0 0 30px gold">
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
