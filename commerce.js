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
const clueEl = document.getElementById("clue");

/* =====================================================
   🔐 SÉCURITÉ MOBILE
===================================================== */
function safeShow(el){
  if(!el) return;
  el.classList.remove("hidden");
  el.style.display = "block";
}

function safeHide(el){
  if(!el) return;
  el.classList.add("hidden");
}

function enablePointer(el){
  if(el) el.style.pointerEvents = "auto";
}

function disablePointer(el){
  if(el) el.style.pointerEvents = "none";
}

/* =====================================================
   🎬 VIDÉO (MOBILE SAFE)
===================================================== */
questVideo.muted = true;
toggleSound.textContent = "🔇";

toggleSound.onclick = () => {
  soundOn = !soundOn;
  questVideo.muted = !soundOn;
  toggleSound.textContent = soundOn ? "🔊" : "🔇";
};

function endVideo(){
  questVideo.pause();
  videoContainer.style.display = "none";

  showLoader("Chargement...", 800, () => {
    safeShow(background);
    safeShow(pirate2);
    safeShow(pirate5);

    pirate5.style.top = (pirate5.offsetTop + 15) + "px";
    enablePirate5();
  });
}

questVideo.onended = endVideo;
closeVideo.onclick = endVideo;

/* 🔁 FALLBACK MOBILE SI LA VIDÉO NE SE LANCE PAS */
setTimeout(() => {
  if (videoContainer.style.display !== "none") {
    endVideo();
  }
}, 2500);

/* =====================================================
   🏴‍☠️ PIRATE 5
===================================================== */
function enablePirate5(){
  enablePointer(pirate5);
  pirate5.style.cursor = "pointer";

  pirate5.onmouseenter = () => pirate5.classList.add("glow");
  pirate5.onmouseleave = () => pirate5.classList.remove("glow");

  pirate5.addEventListener("click", startDialogues1, { once:true });
}

/* =====================================================
   💬 DIALOGUES (ROBUSTE)
===================================================== */
function showDialogues(dialogues, onEnd){
  currentDialogues = dialogues;
  currentOnEnd = onEnd;
  dialogueIndex = 0;

  bubbleContainer.innerHTML = "";
  enablePointer(bubbleContainer);

  const bubble = document.createElement("div");
  bubble.className = "dialogue-bubble";
  bubble.addEventListener("click", nextDialogue);

  bubbleContainer.appendChild(bubble);
  renderDialogue();
}

function renderDialogue(){
  const d = currentDialogues[dialogueIndex];
  const bubble = document.querySelector(".dialogue-bubble");

  safeShow(d.anchor);

  const r = d.anchor.getBoundingClientRect();

  bubble.innerHTML = d.text;
  bubble.style.left = (r.left + r.width / 2) + "px";
  bubble.style.top = (r.top - 10) + "px";
  bubble.style.transform = "translate(-50%,-100%)";
}

function nextDialogue(){
  dialogueIndex++;
  if(dialogueIndex < currentDialogues.length){
    renderDialogue();
  } else {
    endDialogues();
  }
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
    { text:"Observe les autres vendeurs et dépasse-les.", anchor: pirate5 }
  ], () => showLoader("Le mini-jeu commence…", 800, startQuiz1));
}

/* =====================================================
   🎮 MINI-JEU 1 — QUIZ
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
  safeShow(miniGame);
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

    btn.addEventListener("click", ()=>{
      if(i === q.correct){
        gameF.textContent = "Bonne réponse 👍";
        setTimeout(()=>{
          quizIndex++;
          quizIndex < quiz1.length ? showQuestion() : winQuiz1();
        },600);
      } else {
        gameF.textContent = "Mauvaise réponse ❌";
      }
    });

    gameA.appendChild(btn);
  });
}

/* =====================================================
   🏆 RÉCOMPENSE + GEMS
===================================================== */
let canvas, ctx, gems=[];

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
  gems=[];

  for(let i=0;i<150;i++){
    const a = Math.random()*Math.PI*2;
    const s = Math.random()*8+3;
    gems.push({
      x:canvas.width/2,
      y:canvas.height/2,
      vx:Math.cos(a)*s,
      vy:Math.sin(a)*s,
      r:Math.random()*3+2,
      c:`hsl(${Math.random()*360},100%,60%)`,
      life:100
    });
  }
  requestAnimationFrame(updateGems);
}

function updateGems(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  gems.forEach(g=>{
    g.vy += 0.12;
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

function winQuiz1(){
  safeHide(miniGame);
  safeShow(fadeScreen);

  loaderBox.innerHTML = `
    <div style="font-size:42px;color:gold;text-shadow:0 0 20px gold">
      Bravo 🎉
    </div>
    <div style="margin-top:12px">
      Tu as gagné <span id="poCounter">0</span> PO<br>
      et ton business plan 📘
    </div>
  `;

  launchGems();

  let po = 0;
  const t = setInterval(()=>{
    po += 100;
    document.getElementById("poCounter").textContent = po;
    if(po >= 5000){
      clearInterval(t);
      setTimeout(()=>{
        safeHide(fadeScreen);
        openBook();
      },900);
    }
  },30);
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
  pageIndex = 0;
  safeShow(bookContainer);

  const oldTitle = bookContainer.querySelector(".bookTitle");
  if(oldTitle) oldTitle.remove();

  const title = document.createElement("div");
  title.className = "bookTitle";
  title.textContent = "Ton Business Plan est prêt";
  title.style.textAlign = "center";
  title.style.fontSize = "28px";
  title.style.color = "gold";
  title.style.marginBottom = "10px";

  bookContainer.prepend(title);
  updateBook();
}

function updateBook(){
  leftPage.src = "images/" + bookPages[pageIndex];
  continueBtn.classList.toggle("hidden", pageIndex !== bookPages.length-1);
}

continueBtn.onclick = ()=>{
  safeHide(bookContainer);
  preparePirate3();
};

/* =====================================================
   🏴‍☠️ PIRATE 3
===================================================== */
function preparePirate3(){
  safeShow(pirate3);
  pirate3.style.top = (pirate3.offsetTop + 10) + "px";
  enablePointer(pirate3);

  pirate3.onmouseenter = () => pirate3.classList.add("glow");
  pirate3.onmouseleave = () => pirate3.classList.remove("glow");

  pirate3.addEventListener("click", startDialogues2, { once:true });
}

/* =====================================================
   💬 DIALOGUES 2
===================================================== */
function startDialogues2(){
  disablePointer(pirate3);

  showDialogues([
    { text:"C’est toi le nouveau vendeur de pierres ?", anchor: pirate3 },
    { text:"Oui, vous cherchez quel type de pierres ?", anchor: pirate2 },
    { text:"On fait confiance à un seul vendeur ici…", anchor: pirate5 }
  ], () => showLoader("Jugement du Marché…", 900, startMerchantGame));
}

/* =====================================================
   🎮 MINI-JEU 2
===================================================== */
function startMerchantGame(){
  safeShow(merchantGame);
  clueEl.textContent = "Analyse le marché avant de décider";
}

document.querySelectorAll("#buttons button")[0]
  .addEventListener("click", ()=> {
    clueEl.textContent = "💡 Vous êtes peu nombreux à vendre cet objet";
  });

document.querySelectorAll("#buttons button")[1]
  .addEventListener("click", ()=> {
    clueEl.textContent = "❌ Mauvaise décision";
  });

document.querySelectorAll("#buttons button")[2]
  .addEventListener("click", ()=> {
    clueEl.textContent = "Bonne décision ✔️";
    setTimeout(()=>{
      safeHide(merchantGame);
      endQuest();
    },1200);
  });

/* =====================================================
   🎆 FIN
===================================================== */
function endQuest(){
  safeShow(fadeScreen);
  loaderBox.innerHTML = "Bravo 🎉 quête terminée";
  launchGems();

  setTimeout(()=>{
    window.location.href = "menu.html";
  },2800);
}

/* =====================================================
   ⏳ LOADER
===================================================== */
function showLoader(text,time,cb){
  loaderBox.innerHTML = text;
  safeShow(fadeScreen);
  setTimeout(()=>{
    safeHide(fadeScreen);
    if(cb) cb();
  },time);
}

});
