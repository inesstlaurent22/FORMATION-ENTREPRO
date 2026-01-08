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

  pirate3.style.pointerEvents = "none";
  pirate3.classList.add("raise-5");

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
  pirate3.classList.remove("raise-5");
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
