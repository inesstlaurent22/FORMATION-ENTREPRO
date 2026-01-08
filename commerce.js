document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   🔧 OUTILS
===================================================== */
function vibrate(p=15){
  if(navigator.vibrate) navigator.vibrate(p);
}

/* =====================================================
   🌑 LOADER CENTRAL (UNIQUE)
===================================================== */
const fadeScreen = document.getElementById("fadeScreen");
const loaderBox  = fadeScreen.querySelector(".loaderBox");

function showLoader(text, time=1200, cb){
  loaderBox.innerHTML = text;
  fadeScreen.classList.remove("hidden");
  setTimeout(()=>{
    fadeScreen.classList.add("hidden");
    cb && cb();
  }, time);
}

/* =====================================================
   🎬 VIDÉO
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const questVideo = document.getElementById("questVideo");
const toggleSound = document.getElementById("toggleSound");
const closeVideo  = document.getElementById("closeVideo");

questVideo.muted = true;
toggleSound.textContent = "🔇";

toggleSound.onclick = ()=>{
  vibrate(10);
  questVideo.muted = !questVideo.muted;
  toggleSound.textContent = questVideo.muted ? "🔇" : "🔊";
};

questVideo.onended = endVideo;
closeVideo.onclick = endVideo;

function endVideo(){
  questVideo.pause();
  videoContainer.style.display = "none";
  showLoader("Chargement...", 900, showBackground);
}

/* =====================================================
   🌅 BACKGROUND + PIRATES
===================================================== */
const background = document.getElementById("background");
const pirate2 = document.getElementById("pirate2bis");
const pirate5 = document.getElementById("pirate5bis");
const pirate3 = document.getElementById("pirate3bis");

function showBackground(){
  background.classList.remove("hidden");
  pirate2.classList.remove("hidden");
  pirate5.classList.remove("hidden");
  enablePirate5();
}

/* =====================================================
   🏴‍☠️ PIRATE 5
===================================================== */
function enablePirate5(){
  pirate5.classList.add("glow");
  pirate5.addEventListener("click", startDialogues1, { once:true });
}

/* =====================================================
   💬 DIALOGUES (SYSTÈME STABLE)
===================================================== */
const bubbleContainer = document.getElementById("bubbleContainer");
const skipBtn = document.getElementById("skipDialoguesBtn");

let dialogues = [];
let dIndex = 0;
let onDialogueEnd = null;

function playDialogues(list, cb){
  dialogues = list;
  dIndex = 0;
  onDialogueEnd = cb;
  skipBtn.classList.remove("hidden");
  renderDialogue();
}

function renderDialogue(){
  bubbleContainer.innerHTML = "";
  const d = dialogues[dIndex];
  const r = d.anchor.getBoundingClientRect();

  const bubble = document.createElement("div");
  bubble.className = "dialogue-bubble";
  bubble.innerHTML = d.text;

  let top = r.top - 150;
  if(top < 20) top = r.bottom + 20;

  bubble.style.left = r.left + r.width/2 + "px";
  bubble.style.top  = top + "px";
  bubble.style.transform = "translateX(-50%)";

  bubble.onclick = ()=>{
    vibrate(10);
    dIndex++;
    dIndex < dialogues.length ? renderDialogue() : endDialogues();
  };

  bubbleContainer.appendChild(bubble);
}

function endDialogues(){
  bubbleContainer.innerHTML = "";
  skipBtn.classList.add("hidden");
  onDialogueEnd && onDialogueEnd();
}

skipBtn.onclick = endDialogues;

/* =====================================================
   💬 DIALOGUES 1
===================================================== */
function startDialogues1(){
  playDialogues([
    { text:"Moussaillon ! Bienvenue sur le marché des trésors !", anchor:pirate5 },
    { text:"J’suis prêt, capitaine !", anchor:pirate2 },
    { text:"Observe les autres vendeurs et dépasse-les.", anchor:pirate5 }
  ], ()=> showLoader("Le mini-jeu va commencer…", 900, startQuiz1));
}

/* =====================================================
   🎮 MINI-JEU 1 (QUIZ)
===================================================== */
const miniGame = document.getElementById("miniGameContainer");
const gameQ = document.getElementById("gameQuestion");
const gameA = document.getElementById("gameAnswers");
const gameF = document.getElementById("gameFeedback");

const quiz1 = [
  {
    q:"Où les pirates ont-ils trouvé leurs pierres ?",
    a:["Dans un coffre dans une grotte secrète","Au marché","La tante"],
    c:0
  },
  {
    q:"Qui fait partie de l'équipage ?",
    a:["Toi et les moussaillons","Le capitaine","La famille"],
    c:0
  }
];

let qIndex = 0;

function startQuiz1(){
  qIndex = 0;
  miniGame.classList.remove("hidden");
  showQuestion();
}

function showQuestion(){
  const q = quiz1[qIndex];
  gameQ.textContent = q.q;
  gameA.innerHTML = "";
  gameF.textContent = "";

  q.a.forEach((txt,i)=>{
    const b = document.createElement("button");
    b.textContent = txt;
    b.onclick = ()=>{
      if(i === q.c){
        gameF.textContent = "✅ Bonne réponse";
        setTimeout(()=>{
          qIndex++;
          qIndex < quiz1.length ? showQuestion() : winQuiz1();
        },700);
      }else{
        gameF.textContent = "❌ Mauvaise réponse";
      }
    };
    gameA.appendChild(b);
  });
}

/* =====================================================
   🏆 FIN MINI-JEU 1 → LIVRE
===================================================== */
function winQuiz1(){
  miniGame.classList.add("hidden");
  showLoader("Bravo ! Tu as gagné 5000 pièces d’or 💰", 1400, openBook);
}

/* =====================================================
   📖 LIVRE
===================================================== */
const bookContainer = document.getElementById("bookContainer");
const leftPage = document.getElementById("leftPage");
const continueBtn = document.getElementById("continueQuestBtn");

const pages = [
  "Businessplancov.png",
  "Businessplan1.png",
  "Businessplan2.png",
  "Businessplan3.png"
];

let page = 0;

function openBook(){
  bookContainer.classList.remove("hidden");
  updateBook();
}

function updateBook(){
  leftPage.src = "images/" + pages[page];
  continueBtn.classList.toggle("hidden", page !== pages.length-1);
}

leftPage.onclick = ()=>{
  if(page < pages.length-1){
    page++;
    updateBook();
  }
};

continueBtn.onclick = ()=>{
  bookContainer.classList.add("hidden");
  preparePirate3();
};

/* =====================================================
   🏴‍☠️ PIRATE 3 + MINI-JEU 2
===================================================== */
function preparePirate3(){
  pirate3.classList.remove("hidden");
  pirate3.addEventListener("click", startMerchantGame, { once:true });
}

/* =====================================================
   🎮 MINI-JEU 2 — JUGEMENT DU MARCHÉ
===================================================== */
const merchantGame = document.getElementById("merchantGame");
const clueEl = document.getElementById("clue");

function startMerchantGame(){
  merchantGame.classList.remove("hidden");
  clueEl.textContent = "Analyse le marché avant de décider";
}

window.analyzeClient = ()=>{
  clueEl.textContent = "💡 Vous êtes peu nombreux sur ce marché";
};

window.keepPrice = ()=>{
  merchantGame.classList.add("hidden");
  winFinal();
};

window.lowerPrice = ()=>{
  clueEl.textContent = "❌ Mauvaise décision";
};

/* =====================================================
   🎆 FIN
===================================================== */
function winFinal(){
  showLoader("🎉 Bravo tu as gagné ta quête", 2000, ()=>{
    window.location.href = "menu.html";
  });
}

});
