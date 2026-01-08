document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   🔧 OUTILS
===================================================== */
function vibrate(p=15){
  if(navigator.vibrate) navigator.vibrate(p);
}

/* =====================================================
   🌑 LOADER CENTRAL (CORRIGÉ)
===================================================== */
const fadeScreen = document.getElementById("fadeScreen");
const loaderBox  = fadeScreen.querySelector(".loaderBox");

function showLoader(text, time=1200, cb){
  loaderBox.innerHTML = text;
  fadeScreen.style.display = "flex";   // 🔥 FIX CRITIQUE
  setTimeout(()=>{
    fadeScreen.style.display = "none";
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

skipBtn.onclick = endDialogues;

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

  bubble.style.left = (r.left + r.width/2) + "px";
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
  onDialogueEnd && onDialogueEnd();   // 🔥 GARANTI
}

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
   🎮 MINI-JEU 1
===================================================== */
const miniGame = document.getElementById("miniGameContainer");
const gameQ = document.getElementById("gameQuestion");
const gameA = document.getElementById("gameAnswers");
const gameF = document.getElementById("gameFeedback");

const quiz1 = [
  {
    q:"Où les pirates ont-ils trouvé leurs pierres ?",
    a:["Dans un coffre secret","Au marché","Chez la tante"],
    c:0
  },
  {
    q:"Qui fait partie de l’équipage ?",
    a:["Toi et les moussaillons","Le capitaine seul","Toute la famille"],
    c:0
  }
];

let qIndex = 0;

function startQuiz1(){
  qIndex = 0;
  miniGame.style.display = "flex";
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
   🏆 RÉUSSITE MINI-JEU 1 (5000 PO)
===================================================== */
function winQuiz1(){
  miniGame.style.display = "none";
  fadeScreen.style.display = "flex";

  loaderBox.innerHTML = `
    <div class="rewardTitle">Bravo ! Tu as gagné</div>
    <div class="rewardCounter"><span id="poCounter">0</span></div>
    <div class="rewardLabel">pièces d’or 💰</div>
    <div class="rewardSub">et ton business plan</div>
  `;

  let po = 0;
  const counter = document.getElementById("poCounter");

  const interval = setInterval(()=>{
    po += 100;
    counter.textContent = po;
    if(po >= 5000){
      counter.textContent = "5000";
      clearInterval(interval);
      setTimeout(()=>{
        fadeScreen.style.display = "none";
        openBook();
      },1000);
    }
  },30);
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
  bookContainer.style.display = "flex";
  page = 0;
  updateBook();
}

function updateBook(){
  leftPage.src = "images/" + pages[page];
  continueBtn.style.display = page === pages.length-1 ? "block" : "none";
}

leftPage.onclick = ()=>{
  if(page < pages.length-1){
    page++;
    updateBook();
  }
};

continueBtn.onclick = ()=>{
  bookContainer.style.display = "none";
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
  merchantGame.style.display = "flex";
  clueEl.textContent = "Analyse le marché avant de décider";
}

document.getElementById("btnHint").onclick = ()=>{
  clueEl.textContent = "💡 Vous êtes peu nombreux sur ce marché";
};

document.getElementById("btnKeep").onclick = ()=>{
  merchantGame.style.display = "none";
  winFinal();
};

document.getElementById("btnLower").onclick = ()=>{
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
