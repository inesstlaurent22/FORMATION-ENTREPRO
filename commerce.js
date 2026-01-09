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

toggleSound.onclick = e=>{
  e.stopPropagation();
  questVideo.muted = !questVideo.muted;
  toggleSound.textContent = questVideo.muted ? "🔇" : "🔊";
};

closeVideo.onclick = e=>{
  e.stopPropagation();
  endVideo();
};

questVideo.onended = endVideo;

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
   🏴‍☠️ PIRATE 5 — HOVER → CLIC
===================================================== */
function enablePirate5(){
  pirate5.addEventListener("mouseenter", ()=>{
    pirate5.classList.add("glow");
  });

  pirate5.addEventListener("mouseleave", ()=>{
    pirate5.classList.remove("glow");
  });

  pirate5.addEventListener("click", ()=>{
    pirate5.classList.remove("glow");
    pirate5.classList.add("frozen");
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

  let top = r.top - 140;
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

const quiz1 = {
  question: "Que faut-il pour rassurer les clients ?",
  multi: true,
  answers: [
    { t:"Être transparent sur le produit", ok:true },
    { t:"Mentir pour vendre", ok:false },
    { t:"Montrer la valeur des pierres", ok:true }
  ]
};

let selected = [];

function startMiniGame1(){
  miniGame.classList.remove("hidden");
  selected = [];
  gameF.textContent = "";

  gameQ.innerHTML = quiz1.question + `<div class="multiHint">⚠️ Plusieurs réponses possibles</div>`;
  gameA.innerHTML = "";

  quiz1.answers.forEach((a,i)=>{
    const b = document.createElement("button");
    b.textContent = a.t;
    b.onclick = ()=>{
      b.classList.toggle("selected");
      selected.includes(i)
        ? selected = selected.filter(x=>x!==i)
        : selected.push(i);
    };
    gameA.appendChild(b);
  });

  const v = document.createElement("button");
  v.className = "validateBtn";
  v.textContent = "Valider";
  v.onclick = validateMiniGame1;
  gameA.appendChild(v);
}

function validateMiniGame1(){
  const success =
    selected.length === 2 &&
    selected.every(i=>quiz1.answers[i].ok);

  if(success){
    miniGame.classList.add("hidden");
    showReward();
  }else{
    gameF.textContent = "❌ Mauvais choix, essaie encore";
  }
}

/* =====================================================
   🎉 RÉCOMPENSE + FEUX D’ARTIFICE
===================================================== */
function showReward(){
  fadeScreen.classList.remove("hidden");
  loaderBox.innerHTML = `
    <div class="rewardTitle">Bravo !</div>
    <div class="rewardCounter" id="poCounter">0</div>
    <div class="rewardLabel">Pièces d’or 💰</div>
    <div class="rewardSub">et ton Business Plan</div>
  `;

  fireGems();

  let po = 0;
  const t = setInterval(()=>{
    po += 100;
    document.getElementById("poCounter").textContent = po;
    if(po >= 5000){
      clearInterval(t);
      setTimeout(openBook, 1200);
    }
  },25);
}

/* =====================================================
   💎 FEUX D’ARTIFICE
===================================================== */
function fireGems(){
  const canvas = document.createElement("canvas");
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  canvas.style.position="fixed";
  canvas.style.inset=0;
  canvas.style.pointerEvents="none";
  canvas.style.zIndex=4000;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let gems=[];

  for(let i=0;i<180;i++){
    const a = Math.random()*Math.PI*2;
    const s = Math.random()*8+4;
    gems.push({
      x:innerWidth/2,
      y:innerHeight/2,
      vx:Math.cos(a)*s,
      vy:Math.sin(a)*s,
      r:Math.random()*3+2,
      c:`hsl(${Math.random()*360},100%,60%)`,
      life:120
    });
  }

  function anim(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    gems.forEach(g=>{
      g.vy+=0.12;
      g.x+=g.vx;
      g.y+=g.vy;
      g.life--;
      ctx.fillStyle=g.c;
      ctx.beginPath();
      ctx.arc(g.x,g.y,g.r,0,Math.PI*2);
      ctx.fill();
    });
    gems=gems.filter(g=>g.life>0);
    gems.length ? requestAnimationFrame(anim) : canvas.remove();
  }
  anim();
}

/* =====================================================
   📖 LIVRE
===================================================== */
const bookContainer = document.getElementById("bookContainer");
const leftPage = document.getElementById("leftPage");
const rightPage = document.getElementById("rightPage");
const continueBtn = document.getElementById("continueQuestBtn");

const pages = [
  "Businessplancov.png",
  "Businessplan1.png",
  "Businessplan2.png",
  "Businessplan3.png"
];

let page = 0;

function openBook(){
  fadeScreen.classList.add("hidden");
  bookContainer.classList.remove("hidden");
  updateBook();
}

function updateBook(){
  leftPage.src = "images/" + pages[page];
  rightPage.src = pages[page+1] ? "images/"+pages[page+1] : "";
  continueBtn.classList.toggle("hidden", page < pages.length-2);
}

leftPage.onclick = ()=>{ if(page>0){ page-=2; updateBook(); }};
rightPage.onclick = ()=>{ if(page<pages.length-2){ page+=2; updateBook(); }};

continueBtn.onclick = ()=>{
  bookContainer.classList.add("hidden");
  showLoader("Chargement...", 900, showPirate3);
};

/* =====================================================
   🏴‍☠️ PIRATE 3 — ENTRÉE
===================================================== */
function showPirate3(){
  pirate3.classList.remove("hidden");
  pirate3.style.transition="right .8s ease";
  pirate3.style.right="120px";

  pirate3.addEventListener("mouseenter",()=>pirate3.classList.add("glow"));
  pirate3.addEventListener("mouseleave",()=>pirate3.classList.remove("glow"));
  pirate3.addEventListener("click",()=>{
    pirate3.classList.remove("glow");
    pirate3.classList.add("frozen");
    startDialogues2();
  },{once:true});
}

/* =====================================================
   💬 DIALOGUES 2
===================================================== */
function startDialogues2(){
  playDialogues([
    { text:"Ces pierres inspirent confiance.", anchor: pirate3 },
    { text:"Un bon marchand connaît ses clients.", anchor: pirate5 }
  ], ()=> showLoader("Chargement...",900,startMiniGame2));
}

/* =====================================================
   🎮 MINI-JEU 2
===================================================== */
function startMiniGame2(){
  alert("Mini-jeu 2 prêt (logique validée)");
}

/* =====================================================
   🏁 FIN
===================================================== */
function winFinal(){
  showLoader("🎉 Bravo tu as terminé la quête",2000,()=>{
    window.location.href="menu.html";
  });
}

});
