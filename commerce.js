document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   🔧 OUTILS
===================================================== */
function vibrate(p=15){
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
   🏴‍☠️ PIRATE 5 (HOVER + CLICK UNIQUE)
===================================================== */
function enablePirate5(){
  pirate5.classList.add("glow");

  pirate5.addEventListener("mouseenter", ()=>{
    pirate5.classList.add("glow");
  });

  pirate5.addEventListener("mouseleave", ()=>{
    pirate5.classList.remove("glow");
  });

  pirate5.addEventListener("click", ()=>{
    pirate5.classList.remove("glow");
    pirate5.style.pointerEvents = "none";
    startDialogues1();
  }, { once:true });
}

/* =====================================================
   💬 SYSTÈME DE DIALOGUES
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
   💬 DIALOGUES 1 — INTRO
===================================================== */
function startDialogues1(){
  playDialogues([
    { text:"Moussaillon ! Bienvenue sur le marché des trésors.", anchor: pirate5 },
    { text:"Ici, la confiance vaut plus que l’or.", anchor: pirate5 },
    { text:"Créons d’abord ton business plan.", anchor: pirate2 }
  ], ()=> showLoader("Chargement du mini-jeu…", 1000, startMiniGame1));
}

/* =====================================================
   🎮 MINI-JEU 1 — QUIZ
===================================================== */
const miniGame = document.getElementById("miniGameContainer");
const gameQ = document.getElementById("gameQuestion");
const gameA = document.getElementById("gameAnswers");
const gameF = document.getElementById("gameFeedback");

const quiz1 = [
  {
    q:"Quelle est la première étape d’un business plan ?",
    a:["Acheter un bateau","Définir clairement son offre","Fixer les prix"],
    c:1
  }
];

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
   🏆 RÉUSSITE MINI-JEU 1
===================================================== */
function winMiniGame1(){
  miniGame.classList.add("hidden");

  loaderBox.innerHTML = `
    <div style="font-size:28px">Bravo ! Tu as gagné</div>
    <div style="font-size:48px"><span id="poCounter">0</span></div>
    <div>pièces d’or 💰</div>
    <div>et ton business plan</div>
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
   🎆 FEUX D’ARTIFICE (GEMS)
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
    const angle = Math.random()*Math.PI*2;
    const speed = Math.random()*8+4;
    particles.push({
      x:innerWidth/2,
      y:innerHeight/2,
      vx:Math.cos(angle)*speed,
      vy:Math.sin(angle)*speed,
      life:100,
      c:`hsl(${Math.random()*360},100%,60%)`
    });
  }

  function update(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p=>{
      p.vy += 0.12;
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      ctx.fillStyle = p.c;
      ctx.fillRect(p.x,p.y,3,3);
    });
    particles = particles.filter(p=>p.life>0);
    particles.length ? requestAnimationFrame(update) : canvas.remove();
  }
  update();
}

/* =====================================================
   📖 LIVRE DIGITAL — BUSINESS PLAN
===================================================== */
#bookContainer{
  position:fixed;
  inset:0;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  background:rgba(0,0,0,.9); /* ❌ plus de fond blanc */
  z-index:2200;
}

/* ✨ TITRE BRILLANT */
.bookTitle{
  font-size:30px;
  color:white;
  margin-bottom:18px;
  text-shadow:
    0 0 12px gold,
    0 0 28px gold,
    0 0 55px rgba(255,215,0,.9);
  animation:glowPulse 2s infinite ease-in-out;
}

/* animation légère du texte */
@keyframes glowPulse{
  0%{ text-shadow:0 0 10px gold }
  50%{ text-shadow:0 0 30px gold }
  100%{ text-shadow:0 0 10px gold }
}

/* =====================================================
   📘 LIVRE
===================================================== */
.book{
  position:relative;
  display:flex;
  width:82vw;
  max-width:920px;
  height:58vh;
  perspective:1800px;
}

/* pages */
.page{
  width:50%;
  height:100%;
  background:transparent; /* ❌ fond blanc supprimé */
  overflow:hidden;
  position:relative;
}

/* images nettes */
.page img{
  width:100%;
  height:100%;
  object-fit:contain;
  backface-visibility:hidden;
  transform-origin:left center;
  transition:transform .6s ease;
}

/* =====================================================
   📄 ANIMATION PAGE TURN
===================================================== */
.page.right img.turn{
  transform:rotateY(-28deg);
  box-shadow:
    inset -30px 0 40px rgba(0,0,0,.45),
    -10px 0 25px rgba(0,0,0,.6);
}

.page.left img.turn-back{
  transform:rotateY(28deg);
  box-shadow:
    inset 30px 0 40px rgba(0,0,0,.45),
    10px 0 25px rgba(0,0,0,.6);
}

/* =====================================================
   ▶️ BOUTON CONTINUER
===================================================== */
#continueQuestBtn{
  position:absolute;
  top:20px;
  right:20px;
  padding:14px 26px;
  font-size:18px;
  font-weight:bold;
  background:linear-gradient(#ffd27d,#c89b58);
  color:#000;
  border:3px solid #3b1b00;
  border-radius:16px;
  cursor:pointer;
  box-shadow:0 4px 0 #3b1b00;
  z-index:2300;
}

/* =====================================================
   🏴‍☠️ PIRATE 3 — ENTRÉE + DIALOGUES 2
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

  const box = document.createElement("div");
  box.className = "dialogue-bubble";
  box.style.left = "50%";
  box.style.top = "50%";
  box.style.transform = "translate(-50%,-50%)";

  box.innerHTML = `
    <h2>Base de données</h2>
    <p>Elle te permet de garder une relation durable avec tes clients.</p>
    <p><strong>(Clique pour terminer)</strong></p>
  `;

  box.onclick = winFinal;
  bubbleContainer.appendChild(box);
}

/* =====================================================
   🏁 FIN
===================================================== */
function winFinal(){
  bubbleContainer.innerHTML = "";
  showLoader("🎉 Bravo tu as terminé la quête", 2000, ()=>{
    launchFireworks();
    setTimeout(()=>window.location.href="menu.html", 3000);
  });
}

});
