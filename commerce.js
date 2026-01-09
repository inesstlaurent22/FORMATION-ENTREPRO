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
   🏴‍☠️ PIRATE 5 — HOVER + CLICK
===================================================== */
function enablePirate5(){
  pirate5.style.cursor = "pointer";

  pirate5.onmouseenter = ()=> pirate5.classList.add("glow");
  pirate5.onmouseleave = ()=> pirate5.classList.remove("glow");

  pirate5.addEventListener("click", ()=>{
    pirate5.classList.remove("glow");
    pirate5.onmouseenter = null;
    pirate5.onmouseleave = null;
    pirate5.style.pointerEvents = "none";
    startDialogues1();
  }, { once:true });
}

/* =====================================================
   💬 SYSTÈME DE DIALOGUES (UNIQUE)
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
  skipBtn.style.display = "block";
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
  skipBtn.style.display = "none";
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

function startMiniGame1(){
  miniGame.classList.remove("hidden");
  gameQ.innerHTML = "Que dois-tu faire pour rassurer les clients ?<div class='multiHint'>⚠️ Plusieurs réponses possibles</div>";
  gameA.innerHTML = "";
  gameF.textContent = "";

  const choices = [
    { t:"Montrer les pierres", ok:true },
    { t:"Mentir sur l’origine", ok:false },
    { t:"Donner l’adresse", ok:true }
  ];

  let selected = [];

  choices.forEach((c,i)=>{
    const b = document.createElement("button");
    b.textContent = c.t;
    b.onclick = ()=>{
      vibrate(10);
      b.classList.toggle("selected");
      selected.includes(i)
        ? selected = selected.filter(x=>x!==i)
        : selected.push(i);
    };
    gameA.appendChild(b);
  });

  const validate = document.createElement("button");
  validate.className = "validateBtn";
  validate.textContent = "Valider mes choix";

  validate.onclick = ()=>{
    const ok = selected.length===2 && selected.every(i=>choices[i].ok);
    if(ok){
      miniGame.classList.add("hidden");
      showReward();
    } else {
      gameF.textContent = "❌ Mauvaise décision";
    }
  };

  gameA.appendChild(validate);
}

/* =====================================================
   🎆 RÉCOMPENSE + FEU D’ARTIFICE
===================================================== */
function showReward(){
  fadeScreen.classList.remove("hidden");
  loaderBox.innerHTML = `
    <h2>Bravo ! Tu as gagné</h2>
    <div id="poCounter">0</div>
    <div>pièces d’or 💰</div>
    <div>et ton business plan</div>
  `;

  firework();
  let v=0;
  const c=document.getElementById("poCounter");

  const i=setInterval(()=>{
    v+=100;
    c.textContent=v;
    if(v>=5000){
      clearInterval(i);
      setTimeout(()=>{fadeScreen.classList.add("hidden"); showBook();},1200);
    }
  },25);
}

/* =====================================================
   📖 LIVRE DIGITAL
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

function showBook(){
  bookContainer.classList.remove("hidden");
  updateBook();
}

function updateBook(){
  leftPage.src = "images/"+pages[page];
  rightPage.src = pages[page+1] ? "images/"+pages[page+1] : "";
  continueBtn.style.display = page===pages.length-1 ? "block":"none";
}

document.querySelector(".book").onclick = (e)=>{
  const rect=e.currentTarget.getBoundingClientRect();
  if(e.clientX > rect.left + rect.width/2 && page < pages.length-1) page++;
  else if(page>0) page--;
  updateBook();
};

continueBtn.onclick = ()=>{
  bookContainer.classList.add("hidden");
  showLoader("Chargement…",800,spawnPirate3);
};

/* =====================================================
   🏴‍☠️ PIRATE 3 — ARRIVÉE + HOVER
===================================================== */
function spawnPirate3(){
  pirate3.classList.remove("hidden");
  pirate3.classList.add("show");

  pirate3.onmouseenter=()=>pirate3.classList.add("glow");
  pirate3.onmouseleave=()=>pirate3.classList.remove("glow");

  pirate3.onclick=()=>{
    pirate3.onmouseenter=null;
    pirate3.onmouseleave=null;
    pirate3.style.pointerEvents="none";
    startDialogues2();
  };
}

/* =====================================================
   💬 DIALOGUES 2
===================================================== */
function startDialogues2(){
  playDialogues([
    { text:"Ces pierres sont-elles fiables ?", anchor: pirate3 },
    { text:"Oui, et certifiées.", anchor: pirate2 },
    { text:"Alors voyons ton sens du commerce.", anchor: pirate5 }
  ], ()=> showLoader("Chargement…",800,startMiniGame2));
}

/* =====================================================
   🎮 MINI-JEU 2 — JUGEMENT DU MARCHÉ
===================================================== */
function startMiniGame2(){
  miniGame.classList.remove("hidden");
  gameQ.textContent="Un client hésite sur le prix. Que fais-tu ?";
  gameA.innerHTML="";
  gameF.textContent="";

  const options=[
    {t:"Expliquer la valeur",ok:true},
    {t:"Baisser fortement",ok:false},
    {t:"Ignorer",ok:false}
  ];

  options.forEach(o=>{
    const b=document.createElement("button");
    b.textContent=o.t;
    b.onclick=()=>{
      if(o.ok){
        miniGame.classList.add("hidden");
        startDialogues3();
      }else{
        gameF.textContent="❌ Mauvais choix";
      }
    };
    gameA.appendChild(b);
  });
}

/* =====================================================
   💬 DIALOGUES 3
===================================================== */
function startDialogues3(){
  playDialogues([
    { text:"Tu as gagné la confiance du marché.", anchor: pirate3 },
    { text:"Note bien tes clients.", anchor: pirate5 }
  ], showDatabase);
}

/* =====================================================
   📦 BASE DE DONNÉES + FIN
===================================================== */
function showDatabase(){
  const box=document.createElement("div");
  box.className="dialogue-bubble";
  box.style.left="50%";
  box.style.top="50%";
  box.style.transform="translate(-50%,-50%)";
  box.innerHTML="<h2>Base de données</h2><p>Note les infos clients pour les fidéliser.</p><p>(Clique)</p>";
  box.onclick=winFinal;
  bubbleContainer.appendChild(box);
}

function winFinal(){
  bubbleContainer.innerHTML="";
  showLoader("🎉 Bravo tu as terminé la quête",2000,()=>{
    firework();
    setTimeout(()=>location.href="menu.html",2000);
  });
}

/* =====================================================
   🎆 FEUX D’ARTIFICE
===================================================== */
function firework(){
  const c=document.createElement("canvas");
  c.width=innerWidth;c.height=innerHeight;
  c.style.position="fixed";c.style.inset=0;c.style.pointerEvents="none";c.style.zIndex=4000;
  document.body.appendChild(c);
  const x=c.getContext("2d");
  let p=[];
  for(let i=0;i<180;i++){
    const a=Math.random()*Math.PI*2;
    p.push({x:c.width/2,y:c.height/2,vx:Math.cos(a)*(6+Math.random()*4),vy:Math.sin(a)*(6+Math.random()*4),l:100});
  }
  (function f(){
    x.clearRect(0,0,c.width,c.height);
    p.forEach(o=>{
      o.vy+=0.12;o.x+=o.vx;o.y+=o.vy;o.l--;
      x.fillStyle="hsl("+Math.random()*360+",100%,60%)";
      x.beginPath();x.arc(o.x,o.y,3,0,Math.PI*2);x.fill();
    });
    p=p.filter(o=>o.l>0);
    p.length?requestAnimationFrame(f):c.remove();
  })();
}

});
