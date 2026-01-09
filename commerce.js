document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   🔧 OUTILS
===================================================== */
function vibrate(p=20){
  if(navigator.vibrate) navigator.vibrate(p);
}

/* =====================================================
   🌑 LOADER CENTRAL
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
   🎬 VIDÉO INTRO
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
  onDialogueEnd && onDialogueEnd();
}

skipBtn.onclick = endDialogues;

/* =====================================================
   💬 DIALOGUES 1
===================================================== */
function startDialogues1(){
  playDialogues([
    { text:"Moussaillon ! Bienvenue sur le marché des trésors.", anchor: pirate5 },
    { text:"Ici, la confiance vaut plus que l’or.", anchor: pirate5 },
    { text:"Créons d’abord ton business plan.", anchor: pirate2 }
  ], ()=> showLoader("Chargement du mini-jeu…", 1000, startMiniGame1));
}

/* =====================================================
   🎮 MINI-JEU 1
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
  gameQ.innerHTML = q.q + "<div class='multiHint'>⚠️ Une seule bonne réponse</div>";
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
   🏆 VICTOIRE MINI-JEU 1
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

  launchFireworks();

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
   🎆 FEUX D’ARTIFICE
===================================================== */
function launchFireworks(){
  const canvas = document.createElement("canvas");
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  canvas.style.position = "fixed";
  canvas.style.inset = 0;
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = 3000;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let particles = [];

  for(let i=0;i<160;i++){
    const a = Math.random()*Math.PI*2;
    const s = Math.random()*8+4;
    particles.push({
      x:innerWidth/2, y:innerHeight/2,
      vx:Math.cos(a)*s, vy:Math.sin(a)*s,
      life:100, c:`hsl(${Math.random()*360},100%,60%)`
    });
  }

  function update(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p=>{
      p.vy+=0.12; p.x+=p.vx; p.y+=p.vy; p.life--;
      ctx.fillStyle=p.c; ctx.fillRect(p.x,p.y,3,3);
    });
    particles=particles.filter(p=>p.life>0);
    particles.length?requestAnimationFrame(update):canvas.remove();
  }
  update();
}

/* =====================================================
   📖 LIVRE DIGITAL
===================================================== */
const bookContainer = document.getElementById("bookContainer");
const leftPage = document.getElementById("leftPage");
const rightPage = document.getElementById("rightPage");
const continueBtn = document.getElementById("continueQuestBtn");

const pages = [
  "images/Businessplancov.png",
  "images/Businessplan1.png",
  "images/Businessplan2.png",
  "images/Businessplan3.png"
];

let pageIndex = 0;

function showBook(){
  bookContainer.classList.remove("hidden");
  pageIndex = 0;
  updateBook();
}

function updateBook(){
  leftPage.src = pages[pageIndex];
  rightPage.src = pages[pageIndex+1] || "";
  continueBtn.classList.toggle("hidden", pageIndex < pages.length-2);
}

document.querySelector(".book").onclick = (e)=>{
  const rect = e.currentTarget.getBoundingClientRect();
  const isLast = pageIndex >= pages.length - 2;

  if(e.clientX > rect.left + rect.width/2){
    if(!isLast) pageIndex++;
  }else{
    if(pageIndex > 0) pageIndex--;
  }
  updateBook();
};

continueBtn.onclick = ()=>{
  bookContainer.classList.add("hidden");
  showLoader("Chargement...", 800, spawnPirate3);
};

/* =====================================================
   🏴‍☠️ PIRATE 3
===================================================== */
function spawnPirate3(){
  pirate3.classList.remove("hidden");
  pirate3.classList.add("glow");

  pirate3.addEventListener("mouseenter", ()=>pirate3.classList.add("glow"));
  pirate3.addEventListener("mouseleave", ()=>pirate3.classList.remove("glow"));

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
   🎮 MINI-JEU 2
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
   💬 DIALOGUES 3 — SCEAU PIRATE
===================================================== */
function startDialogues3(){
  playDialogues([
    { text:"Note les coordonnées de tes clients.", anchor: pirate5 },
    { text:"C’est ta base de données.", anchor: pirate2 }
  ], showDatabaseBox);
}

function showDatabaseBox(){
  bubbleContainer.innerHTML = "";
  skipBtn.classList.remove("hidden");

  const box = document.createElement("div");
  box.className = "dialogue-bubble";
  box.style.left = "50%";
  box.style.top = "50%";
  box.style.transform = "translate(-50%,-50%)";

  box.innerHTML = `
    <h2 class="finalTitle">📜 Business plan validé</h2>
    <div class="finalSeal">☠️ APPROUVÉ ☠️</div>
    <p>Ton registre commercial est désormais prêt.</p>
    <p>Tu peux fidéliser tes clients et développer ton empire.</p>
    <p><strong>(Clique pour terminer)</strong></p>
  `;

  bubbleContainer.appendChild(box);

  const seal = box.querySelector(".finalSeal");
  seal.style.animation = "sealDrop .6s ease-out";
  vibrate(40);

  box.onclick = ()=>{
    skipBtn.classList.add("hidden");
    winFinal();
  };
}

/* =====================================================
   🏁 FIN → MENU
===================================================== */
function winFinal(){
  bubbleContainer.innerHTML = "";
  showLoader("🎉 Bravo tu as terminé la quête", 2000, ()=>{
    launchFireworks();
    setTimeout(()=>{
      sessionStorage.setItem("unlock_pirate3", "true");
      window.location.href = "menu.html";
    }, 3000);
  });
}

});
