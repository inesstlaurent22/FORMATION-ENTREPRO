document.addEventListener("DOMContentLoaded", () => {

/* ============================
   🎬 VIDÉO
============================ */
const videoContainer = document.getElementById("videoContainer");
const video = document.getElementById("questVideo");
const closeVideo = document.getElementById("closeVideo");
const toggleSound = document.getElementById("toggleSound");

video.muted = true;

toggleSound.addEventListener("click", (e)=>{
  e.stopPropagation();
  video.muted = !video.muted;
  toggleSound.textContent = video.muted ? "🔇" : "🔊";
});

closeVideo.addEventListener("click", (e)=>{
  e.stopPropagation();
  endVideo();
});

video.addEventListener("ended", endVideo);

function endVideo(){
  video.pause();
  videoContainer.style.opacity = 0;
  setTimeout(()=>{
    videoContainer.style.display = "none";
    showBackground();
  },1000);
}

/* ============================
   🌅 FOND + PIRATES
============================ */
const background = document.getElementById("background");
const pirate2bis = document.getElementById("pirate2bis");
const pirate5bis = document.getElementById("pirate5bis");

pirate2bis.style.left="516px";
pirate2bis.style.top="406px";
pirate5bis.style.left="785px";
pirate5bis.style.top="397px";

function showBackground(){
  background.style.display="block";
  setTimeout(()=> background.style.opacity=1,50);
  startDialogues();
}

/* ============================
   💬 DIALOGUES
============================ */
let dialogueStep = 0;

const dialogues = [
  { who:"maitre", text:"Bienvenue au marché des trésors !", anchor: pirate5bis },
  { who:"apprenti", text:"Je suis prêt maître pirate !", anchor: pirate2bis },
  { who:"maitre", text:"Observe bien les autres pirates et leurs stratégies.", anchor: pirate5bis },
  { who:"apprenti", text:"Je ferai mieux qu’eux !", anchor: pirate2bis },
  { who:"maitre", text:"Alors prouve-le !", anchor: pirate5bis, last:true }
];

function startDialogues(){
  dialogueStep = 0;
  showDialogue();
}

function showDialogue(){
  const old = document.querySelector(".dialogue-bubble");
  if(old) old.remove();
  if(dialogueStep >= dialogues.length) return;

  const d = dialogues[dialogueStep];
  const bubble = document.createElement("div");
  bubble.className = "dialogue-bubble";

  bubble.innerHTML = `<strong>${d.who==="maitre"?"Maître Pirate":"Moussaillon"}</strong><hr>${d.text}`;

  const r = d.anchor.getBoundingClientRect();
  bubble.style.left = r.left+"px";
  bubble.style.top = (r.top-120)+"px";

  if(d.last){
    const btn = document.createElement("button");
    btn.textContent = "Ok, j’ai compris";
    btn.onclick = ()=>{
      bubble.remove();
      showLoader();
    };
    bubble.appendChild(btn);
  } else {
    bubble.onclick = ()=>{
      dialogueStep++;
      showDialogue();
    };
  }

  document.body.appendChild(bubble);
}

/* ============================
   🌑 LOADER
============================ */
const loaderContainer = document.getElementById("loaderContainer");
const loaderText = document.getElementById("loaderText");

function showLoader(){
  loaderContainer.style.display="flex";
  loaderText.style.opacity=0;
  setTimeout(()=> loaderText.style.opacity=1,50);

  setTimeout(()=>{
    loaderText.style.opacity=0;
    setTimeout(()=>{
      loaderContainer.style.display="none";
      startMiniGame();
    },800);
  },2000);
}

/* ============================
   🎮 MINI-JEU
============================ */
const miniGameContainer = document.getElementById("miniGameContainer");
const gameQuestion = document.getElementById("gameQuestion");
const gameAnswers = document.getElementById("gameAnswers");
const gameFeedback = document.getElementById("gameFeedback");

const questions = [
  {q:"Pourquoi vendre les pierres ?", a:["Acheter un bateau","Les manger","Décorer"], c:0},
  {q:"Où observer les concurrents ?", a:["Au marché","À la taverne","En mer"], c:0},
  {q:"Comment se différencier ?", a:["Boîtes solides","Crier","Copier"], c:0}
];

let step = 0;

function startMiniGame(){
  miniGameContainer.style.display="flex";
  step = 0;
  showStep();
}

function showStep(){
  if(step >= questions.length){
    showVictory();
    return;
  }
  const q = questions[step];
  gameQuestion.textContent = q.q;
  gameAnswers.innerHTML="";
  gameFeedback.textContent="";

  q.a.forEach((ans,i)=>{
    const b = document.createElement("button");
    b.textContent = ans;
    b.onclick = ()=>checkAnswer(i,q.c);
    gameAnswers.appendChild(b);
  });
}

function checkAnswer(i,c){
  if(i===c){
    gameFeedback.textContent="✅ Bien vu !";
    step++;
    setTimeout(showStep,600);
  } else {
    gameFeedback.textContent="❌ Réfléchis encore";
  }
}

/* ============================
   🏆 RÉUSSITE + COMPTEUR
============================ */
const victoryScreen = document.getElementById("victoryScreen");
const victoryBox = document.querySelector(".victoryBox");
const counter = document.getElementById("poCounter");
const canvas = document.getElementById("lightCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function showVictory(){
  miniGameContainer.style.display="none";
  victoryScreen.style.display="flex";
  victoryScreen.style.opacity=0;

  victoryBox.innerHTML = `
    <h2>🏆 Bravo moussaillon !</h2>
    <p>Tu as gagné</p>
    <div id="poCounter">0 PO</div>
    <p>et ton <strong>Business Plan</strong></p>
  `;

  setTimeout(()=> victoryScreen.style.opacity=1,50);
  animateCounter();
  launchLightBeams();

  setTimeout(()=>{
    victoryScreen.style.opacity=0;
    setTimeout(()=>{
      victoryScreen.style.display="none";
      background.style.opacity=1;
      startNextDialogues();
    },1000);
  },4000);
}

function animateCounter(){
  let value = 0;
  const target = 5000;
  const interval = setInterval(()=>{
    value += 100;
    counter.textContent = value+" PO";
    if(value >= target){
      counter.textContent = "5000 PO";
      clearInterval(interval);
    }
  },30);
}

function launchLightBeams(){
  let t = 0;
  function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let i=0;i<40;i++){
      ctx.beginPath();
      ctx.moveTo(canvas.width/2, canvas.height/2);
      ctx.lineTo(
        canvas.width/2 + Math.cos(i+t)*300,
        canvas.height/2 + Math.sin(i+t)*300
      );
      ctx.strokeStyle="rgba(255,215,0,0.6)";
      ctx.lineWidth=2;
      ctx.stroke();
    }
    t+=0.1;
    if(t<6) requestAnimationFrame(animate);
  }
  animate();
}

/* ============================
   📖 SUITE DIALOGUES (LIVRE)
============================ */
function startNextDialogues(){
  // ici tu peux relancer tes bulles pour le livre / business plan
}

});

/* =====================================================
   📖 LIVRE DIGITAL
===================================================== */
const bookContainer = document.getElementById("bookContainer");
const leftPage = document.getElementById("leftPage");
const rightPage = document.getElementById("rightPage");
const continueQuestBtn = document.getElementById("continueQuestBtn");

const pages = [
  "images/Businessplancov.png",
  "images/Businessplan1.png",
  "images/Businessplan2.png",
  "images/Businessplan3.png"
];

let bookIndex = Number(localStorage.getItem("bookIndex")) || 0;

function showBook() {
  bookContainer.classList.remove("hidden");
  updateBook();
}

function updateBook() {
  rightPage.src = pages[bookIndex];
  leftPage.src = bookIndex > 0 ? "images/Businessplan4.jpg" : "";
  continueQuestBtn.style.display = bookIndex === pages.length - 1 ? "block" : "none";
  localStorage.setItem("bookIndex", bookIndex);
}

document.querySelector(".book").onclick = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  if (e.clientX > rect.left + rect.width / 2 && bookIndex < pages.length - 1) {
    bookIndex++;
  } else if (bookIndex > 0) {
    bookIndex--;
  }
  rightPage.classList.add("turn");
  updateBook();
  setTimeout(() => rightPage.classList.remove("turn"), 500);
};

continueQuestBtn.onclick = () => {
  bookContainer.classList.add("hidden");
  spawnPirate3();
};

/* =====================================================
   ✨ PIRATE 3 + DIALOGUES 2
===================================================== */
function spawnPirate3() {
  pirate3.classList.remove("hidden");
  setTimeout(() => pirate3.classList.add("show"), 50);
}

const dialogues2 = [
  { p: pirate3, t: "Vous êtes nouveaux sur le marché ? On a entendu parler de vous" },
  { p: pirate2, t: "Oui, nous revendons des pierres précieuses !" },
  { p: pirate3, t: "Les clients n’ont confiance qu’en un seul revendeur…" },
  { p: pirate2, t: "Comment allons-nous faire pour qu’ils aient confiance ?" },
  { p: pirate5, t: "Va les rencontrer et montre tes pierres." },
  { p: pirate2, t: "Mais nous avons une échoppe…" },
  { p: pirate5, t: "Pars avec quelques pierres et des papiers." },
  { p: pirate2, t: "Bonne idée !" }
];

pirate3.onclick = () => {
  showDialogueSequence(dialogues2, () =>
    fade("Dernier mini jeux avant de finir la quête", endMiniGame2)
  );
};

/* =====================================================
   🎮 MINI-JEU 2 (SIMPLIFIÉ)
===================================================== */
function endMiniGame2() {
  fade("Mini jeu réussi !", showEndScreen);
}

/* =====================================================
   🏁 FIN DE QUÊTE
===================================================== */
const endScreen = document.getElementById("endScreen");
const endSubtitle = document.getElementById("endSubtitle");
const rewardBubbles = document.querySelectorAll(".rewardBubble");
const backToMenuBtn = document.getElementById("backToMenuBtn");

function showEndScreen() {
  localStorage.setItem("quest_commerce_completed", "true");
  endScreen.classList.remove("hidden");

  typeWriter(endSubtitle, "tu as gagné ...", () => {
    rewardBubbles.forEach((b, i) => {
      setTimeout(() => {
        b.style.opacity = "1";
        b.style.transform = "scale(1)";
      }, i * 700);
    });

    setTimeout(() => {
      backToMenuBtn.classList.remove("hidden");
    }, rewardBubbles.length * 700 + 600);
  });
}

backToMenuBtn.onclick = () => {
  window.location.href = "menu.html";
