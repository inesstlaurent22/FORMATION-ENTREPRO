document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   🔧 OUTILS
===================================================== */
function vibrate(p=15){
  if(navigator.vibrate) navigator.vibrate(p);
}

/* =====================================================
   🌑 LOADER
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
   🌅 BACKGROUND + PIRATES INIT
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
   🏴‍☠️ PIRATE 5 — HOVER ONLY
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
   💬 DIALOGUES — SYSTEM
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

  bubble.style.left = (r.left + r.width/2) + "px";
  bubble.style.top  = (r.top - 140) + "px";
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

/* =====================================================
   💬 DIALOGUES 1
===================================================== */
function startDialogues1(){
  playDialogues([
    { text:"Bienvenue sur le marché des trésors.", anchor: pirate5 },
    { text:"Créons ton business plan.", anchor: pirate2 }
  ], ()=> showLoader("Chargement...", 800, showBook));
}

/* =====================================================
   📖 LIVRE (appel déjà OK)
===================================================== */
/* showBook() déjà présent chez toi */

/* =====================================================
   🏴‍☠️ PIRATE 3 — APPARITION ANIMÉE
===================================================== */
function spawnPirate3Animated(){
  pirate3.classList.remove("hidden");

  pirate3.style.transition = "none";
  pirate3.style.right = "-300px";
  pirate3.style.left = "auto";

  requestAnimationFrame(()=>{
    pirate3.style.transition = "right 1s ease-out";
    pirate3.style.right = "120px";
  });

  enablePirate3();
}

function enablePirate3(){
  pirate3.addEventListener("mouseenter", ()=>pirate3.classList.add("glow"));
  pirate3.addEventListener("mouseleave", ()=>pirate3.classList.remove("glow"));

  pirate3.addEventListener("click", ()=>{
    pirate3.classList.remove("glow");
    pirate3.style.pointerEvents = "none";
    startDialogues2();
  }, { once:true });
}

/* =====================================================
   💬 DIALOGUES 2
===================================================== */
function startDialogues2(){
  playDialogues([
    { text:"Ces pierres inspirent confiance.", anchor: pirate3 },
    { text:"Mais le marché est exigeant.", anchor: pirate5 }
  ], ()=> showLoader("Chargement...", 800, startMiniGame2));
}

/* =====================================================
   🎮 MINI-JEU 2 — JUGEMENT DU MARCHÉ
===================================================== */
const merchantGame = document.getElementById("merchantGame");
const clueEl = document.getElementById("clue");

function startMiniGame2(){
  merchantGame.classList.remove("hidden");
  clueEl.textContent = "Analyse le marché avant de décider.";
}

document.getElementById("btnHint").onclick = ()=>{
  clueEl.textContent = "💡 Peu de concurrence sur ce port.";
};

document.getElementById("btnKeep").onclick = ()=>{
  merchantGame.classList.add("hidden");
  startDialogues3();
};

document.getElementById("btnLower").onclick = ()=>{
  clueEl.textContent = "❌ Mauvaise décision.";
};

/* =====================================================
   💬 DIALOGUES 3
===================================================== */
function startDialogues3(){
  playDialogues([
    { text:"Note les coordonnées de tes clients.", anchor: pirate5 },
    { text:"C’est ta base de données.", anchor: pirate2 }
  ], showDatabaseBox);
}

/* =====================================================
   📦 BASE DE DONNÉES — ENCADRÉ
===================================================== */
function showDatabaseBox(){
  bubbleContainer.innerHTML = "";
  skipBtn.classList.add("hidden");

  const box = document.createElement("div");
  box.className = "dialogue-bubble";
  box.style.left = "50%";
  box.style.top = "50%";
  box.style.transform = "translate(-50%,-50%)";

  box.innerHTML = `
    <h2>Base de données</h2>
    <p>Elle te permet de fidéliser tes clients.</p>
    <button class="finalBtn">Clique pour terminer</button>
  `;

  box.querySelector("button").onclick = winFinal;
  bubbleContainer.appendChild(box);
}

/* =====================================================
   🏁 FIN DE QUÊTE
===================================================== */
function winFinal(){
  bubbleContainer.innerHTML = "";
  showLoader("🎉 Bravo, tu as gagné cette quête", 2000, ()=>{
    launchFireworks();
  });
}

/* =====================================================
   🎆 FEUX D’ARTIFICE — GEMS
===================================================== */
function launchFireworks(){
  const canvas = document.createElement("canvas");
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  canvas.style.position = "fixed";
  canvas.style.inset = 0;
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = 4000;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let particles = [];

  for(let i=0;i<180;i++){
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

});
