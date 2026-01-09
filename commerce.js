document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   🔧 OUTILS
===================================================== */
function vibrate(p=15){
  if (navigator.vibrate) navigator.vibrate(p);
}

/* =====================================================
   🌑 LOADER
===================================================== */
const fadeScreen = document.getElementById("fadeScreen");
const loaderBox  = fadeScreen.querySelector(".loaderBox");

function showLoader(text, time = 1000, cb){
  loaderBox.innerHTML = text;
  fadeScreen.classList.remove("hidden");
  setTimeout(()=>{
    fadeScreen.classList.add("hidden");
    cb && cb();
  }, time);
}

/* =====================================================
   🎬 VIDÉO INTRO — FIXED
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const questVideo = document.getElementById("questVideo");
const toggleSound = document.getElementById("toggleSound");
const closeVideo  = document.getElementById("closeVideo");

questVideo.muted = true;
toggleSound.textContent = "🔇";

/* 🔊 Toggle son */
toggleSound.addEventListener("click", (e)=>{
  e.stopPropagation();
  questVideo.muted = !questVideo.muted;
  toggleSound.textContent = questVideo.muted ? "🔇" : "🔊";
});

/* ⏭️ Passer la vidéo */
closeVideo.addEventListener("click", (e)=>{
  e.stopPropagation();
  endVideo();
});

questVideo.addEventListener("ended", endVideo);

function endVideo(){
  questVideo.pause();
  videoContainer.style.display = "none";
  showLoader("Chargement...", 800, showBackground);
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
   🏴‍☠️ PIRATE 5 — HOVER UNIQUEMENT
===================================================== */
function enablePirate5(){
  pirate5.addEventListener("mouseenter", ()=>pirate5.classList.add("glow"));
  pirate5.addEventListener("mouseleave", ()=>pirate5.classList.remove("glow"));

  pirate5.addEventListener("click", ()=>{
    pirate5.classList.remove("glow");
    pirate5.style.pointerEvents = "none";
    startDialogues1();
  }, { once:true });
}

/* =====================================================
   💬 DIALOGUES
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

  let top = r.top - 140;
  if(top < 20) top = r.bottom + 20;

  bubble.style.left = (r.left + r.width/2) + "px";
  bubble.style.top  = top + "px";
  bubble.style.transform = "translateX(-50%)";

  bubble.onclick = ()=>{
    dIndex++;
    dIndex < dialogues.length ? renderDialogue() : endDialogues();
  };

  bubbleContainer.appendChild(bubble);
}

function endDialogues(){
  bubbleContainer.innerHTML = "";
  skipBtn.classList.add("hidden");
  const cb = onDialogueEnd;
  onDialogueEnd = null;
  cb && cb();
}

skipBtn.onclick = endDialogues;

/* =====================================================
   💬 DIALOGUES 1 — INTRO
===================================================== */
function startDialogues1(){
  playDialogues([
    { text:"Moussaillon ! Bienvenue sur le marché des trésors.", anchor: pirate5 },
    { text:"Créons ton business plan.", anchor: pirate2 }
  ], ()=> showLoader("Chargement...", 800, startMiniGame1));
}

/* =====================================================
   🎮 MINI-JEU 1 — BUSINESS PLAN
===================================================== */
const miniGame = document.getElementById("miniGameContainer");
const gameQ = document.getElementById("gameQuestion");
const gameA = document.getElementById("gameAnswers");
const gameF = document.getElementById("gameFeedback");

function startMiniGame1(){
  miniGame.classList.remove("hidden");
  document.querySelector(".quizTitle").textContent = "La création de ton business plan";
  gameQ.textContent = "Quelle est la première étape ?";
  gameA.innerHTML = "";
  gameF.textContent = "";

  ["Acheter un bateau","Définir clairement son offre","Fixer les prix"].forEach((txt,i)=>{
    const b = document.createElement("button");
    b.textContent = txt;
    b.onclick = ()=>{
      if(i === 1){
        gameF.textContent = "✅ Bonne décision";
        setTimeout(winMiniGame1, 900);
      }else{
        gameF.textContent = "❌ Mauvais choix";
      }
    };
    gameA.appendChild(b);
  });
}

/* =====================================================
   🏆 RÉUSSITE MINI-JEU 1
===================================================== */
function winMiniGame1(){
  miniGame.classList.add("hidden");

  loaderBox.innerHTML = `
    <div class="winBravo">BRAVO 🎉</div>
    <div class="winText">Tu as gagné</div>
    <div class="winCounter"><span id="poCounter">0</span></div>
    <div class="winText">pièces d’or 💰</div>
    <div class="winText">et ton business plan 🎁</div>
  `;
  fadeScreen.classList.remove("hidden");

  let v = 0;
  const counter = document.getElementById("poCounter");
  const i = setInterval(()=>{
    v += 100;
    counter.textContent = v;
    if(v >= 5000){
      clearInterval(i);
      setTimeout(()=>{
        fadeScreen.classList.add("hidden");
        showBook();
      }, 1200);
    }
  }, 30);
}

/* =====================================================
   📖 LIVRE — IMAGES BUSINESS PLAN
===================================================== */
const bookContainer = document.getElementById("bookContainer");
const leftPage = document.getElementById("leftPage");
const rightPage = document.getElementById("rightPage");
const continueBtn = document.getElementById("continueQuestBtn");
const book = document.querySelector(".book");

/* Ordre exact des pages */
const bookSteps = [
  {
    left: "images/Businessplancov.png",
    right: "images/Businessplan1.png"
  },
  {
    left: "images/Businessplan4.png",
    right: "images/Businessplan2.png"
  },
  {
    left: "images/Businessplan4.png",
    right: "images/Businessplan3.png"
  }
];

let bookIndex = 0;

/* On cache le skip pendant le livre */
skipBtn.classList.add("hidden");

function showBook(){
  bookContainer.classList.remove("hidden");
  bookIndex = 0;
  renderBook();
}

function renderBook(){
  const step = bookSteps[bookIndex];
  leftPage.src = step.left;
  rightPage.src = step.right;

  continueBtn.classList.toggle(
    "hidden",
    bookIndex < bookSteps.length - 1
  );
}

/* Clic sur la page droite uniquement */
book.onclick = (e)=>{
  const rect = book.getBoundingClientRect();

  if (
    e.clientX > rect.left + rect.width / 2 &&
    bookIndex < bookSteps.length - 1
  ){
    bookIndex++;
    renderBook();
  }
};

/* Bouton poursuivre → tampon + pause */
continueBtn.onclick = ()=>{
  const stamp = document.createElement("div");
  stamp.className = "bookStamp";
  stamp.textContent = "APPROUVÉ";
  stamp.style.top = "50%";
  stamp.style.left = "50%";
  stamp.style.transform = "translate(-50%, -50%) rotate(-12deg)";

  book.appendChild(stamp);

  setTimeout(()=>{
    bookContainer.classList.add("hidden");
    stamp.remove();
    spawnPirate3();
  }, 2000);
};

/* =====================================================
   🏴‍☠️ PIRATE 3 — FIN DE QUÊTE
===================================================== */
function spawnPirate3(){
  pirate3.classList.remove("hidden");
  pirate3.classList.add("glow");

  pirate3.onclick = ()=>{
    sessionStorage.setItem("unlock_pirate3", "true");
    window.location.href = "menu.html";
  };
}

});
