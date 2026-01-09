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
   🎬 VIDÉO INTRO
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const questVideo = document.getElementById("questVideo");
const toggleSound = document.getElementById("toggleSound");
const closeVideo  = document.getElementById("closeVideo");

questVideo.muted = true;
toggleSound.textContent = "🔇";

toggleSound.onclick = ()=>{
  questVideo.muted = !questVideo.muted;
  toggleSound.textContent = questVideo.muted ? "🔇" : "🔊";
};

questVideo.onended = endVideo;
closeVideo.onclick = endVideo;

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
   🏴‍☠️ PIRATE 5 — GLOW UNIQUEMENT AU HOVER
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
   💬 DIALOGUES — SYSTÈME GLOBAL
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
    vibrate(10);
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

skipBtn.onclick = ()=>{
  skipBtn.classList.add("hidden");
  if(onDialogueEnd){
    const cb = onDialogueEnd;
    onDialogueEnd = null;
    cb();
  }
};

/* =====================================================
   💬 DIALOGUES 1 — INTRO
===================================================== */
function startDialogues1(){
  playDialogues([
    { text:"Moussaillon ! Bienvenue sur le marché des trésors.", anchor: pirate5 },
    { text:"Ici, la confiance vaut plus que l’or.", anchor: pirate5 },
    { text:"Créons d’abord ton business plan.", anchor: pirate2 }
  ], ()=> showLoader("Chargement du mini-jeu…", 800, startMiniGame1));
}

/* =====================================================
   🎮 MINI-JEU 1 — BUSINESS PLAN
===================================================== */
const miniGame = document.getElementById("miniGameContainer");
const gameQ = document.getElementById("gameQuestion");
const gameA = document.getElementById("gameAnswers");
const gameF = document.getElementById("gameFeedback");

const quiz1 = [{
  q:"Quelle est la première étape d’un business plan ?",
  a:["Acheter un bateau","Définir clairement son offre","Fixer les prix"],
  c:1
}];

function startMiniGame1(){
  miniGame.classList.remove("hidden");
  showQuestion1();
}

function showQuestion1(){
  const q = quiz1[0];
  gameQ.textContent = q.q;
  gameA.innerHTML = "";
  gameF.textContent = "";

  q.a.forEach((txt,i)=>{
    const b = document.createElement("button");
    b.textContent = txt;
    b.onclick = ()=>{
      gameA.querySelectorAll("button").forEach(x=>x.classList.remove("selected"));
      b.classList.add("selected");

      if(i === q.c){
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
   📖 LIVRE + TAMPON
===================================================== */
const bookContainer = document.getElementById("bookContainer");
const continueBtn = document.getElementById("continueQuestBtn");
const book = document.querySelector(".book");

function showBook(){
  bookContainer.classList.remove("hidden");
}

continueBtn.onclick = ()=>{
  const stamp = document.createElement("div");
  stamp.className = "bookStamp";
  stamp.textContent = "APPROUVÉ";
  book.appendChild(stamp);

  setTimeout(()=>{
    bookContainer.classList.add("hidden");
    spawnPirate3();
  }, 2000);
};

/* =====================================================
   🏴‍☠️ PIRATE 3 → MINI-JEU 2
===================================================== */
function spawnPirate3(){
  pirate3.classList.remove("hidden");
  pirate3.classList.add("glow");

  pirate3.addEventListener("click", ()=>{
    pirate3.classList.remove("glow");
    pirate3.style.pointerEvents = "none";
    startDialogues2();
  }, { once:true });
}

function startDialogues2(){
  playDialogues([
    { text:"Ces pierres inspirent confiance.", anchor: pirate3 },
    { text:"Encore faut-il convaincre le marché.", anchor: pirate5 }
  ], ()=> showLoader("Chargement...", 800, startMiniGame2));
}

/* =====================================================
   🎮 MINI-JEU 2 — JUGEMENT DU MARCHÉ
===================================================== */
const merchantGame = document.getElementById("merchantGame");
const clueEl = document.getElementById("clue");

function startMiniGame2(){
  merchantGame.classList.remove("hidden");
  clueEl.textContent = "Analyse le marché avant de décider";
}

document.getElementById("btnHint").onclick = ()=>{
  clueEl.textContent = "💡 Peu de concurrents sur ce port";
};

document.getElementById("btnKeep").onclick = ()=>{
  merchantGame.classList.add("hidden");
  startDialogues3();
};

document.getElementById("btnLower").onclick = ()=>{
  clueEl.textContent = "❌ Mauvaise décision";
};

/* =====================================================
   💬 DIALOGUES 3 — BASE DE DONNÉES
===================================================== */
function startDialogues3(){
  playDialogues([
    { text:"Note les coordonnées de tes clients.", anchor: pirate5 },
    { text:"C’est ta base de données.", anchor: pirate2 }
  ], showDatabaseBox);
}

function showDatabaseBox(){
  bubbleContainer.innerHTML = "";
  skipBtn.classList.add("hidden");

  const box = document.createElement("div");
  box.className = "dialogue-bubble";
  box.style.left = "50%";
  box.style.top = "50%";
  box.style.transform = "translate(-50%,-50%)";

  box.innerHTML = `
    <h2>Ton registre commercial est prêt</h2>
    <button class="finalBtn">Clique pour terminer</button>
  `;

  box.querySelector("button").onclick = ()=>{
    sessionStorage.setItem("unlock_pirate3", "true");
    window.location.href = "menu.html";
  };

  bubbleContainer.appendChild(box);
}

});
