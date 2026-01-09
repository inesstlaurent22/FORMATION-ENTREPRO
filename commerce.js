document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   🔧 OUTILS
===================================================== */
function vibrate(p=15){
  if(navigator.vibrate) navigator.vibrate(p);
}

/* =====================================================
   🌑 LOADER GLOBAL
===================================================== */
const fadeScreen = document.getElementById("fadeScreen");
const loaderBox  = fadeScreen.querySelector(".loaderBox");

function showLoader(text="Chargement...", time=1200, cb){
  loaderBox.innerHTML = text;
  fadeScreen.style.display = "flex";
  setTimeout(()=>{
    fadeScreen.style.display = "none";
    cb && cb();
  }, time);
}

/* =====================================================
   🎬 VIDÉO
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const video = document.getElementById("questVideo");
const toggleSound = document.getElementById("toggleSound");
const closeVideo  = document.getElementById("closeVideo");

video.muted = true;
toggleSound.textContent = "🔇";

toggleSound.onclick = ()=>{
  video.muted = !video.muted;
  toggleSound.textContent = video.muted ? "🔇" : "🔊";
};

video.onended = endVideo;
closeVideo.onclick = endVideo;

function endVideo(){
  video.pause();
  videoContainer.style.display = "none";
  showLoader("Chargement...", 1000, showBackground);
}

/* =====================================================
   🌅 BACKGROUND + PIRATES 1
===================================================== */
const background = document.getElementById("background");
const pirate2 = document.getElementById("pirate2bis");
const pirate5 = document.getElementById("pirate5bis");
const pirate3 = document.getElementById("pirate3bis");

function showBackground(){
  background.classList.remove("hidden");
  pirate2.classList.remove("hidden");
  pirate5.classList.remove("hidden");

  pirate5.classList.add("glow");
  pirate5.addEventListener("click", startDialogues1, { once:true });
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
  skipBtn.style.display = "none";
  onDialogueEnd && onDialogueEnd();
}

skipBtn.onclick = endDialogues;

/* =====================================================
   💬 DIALOGUES 1
===================================================== */
function startDialogues1(){
  pirate5.classList.remove("glow");
  pirate5.style.pointerEvents = "none";

  playDialogues([
    { text:"Bienvenue sur le marché des trésors.", anchor:pirate5 },
    { text:"Je veux réussir ici.", anchor:pirate2 },
    { text:"Alors commence par ton business plan.", anchor:pirate5 }
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
  gameQ.innerHTML = `
    Que dois-tu faire pour rassurer les clients ?
    <div class="multiHint">⚠️ Plusieurs réponses possibles</div>
  `;
  gameA.innerHTML = "";
  gameF.textContent = "";

  const choices = [
    {t:"Montrer les pierres", ok:true},
    {t:"Mentir", ok:false},
    {t:"Expliquer l’origine", ok:true}
  ];

  let selected = [];

  choices.forEach((c,i)=>{
    const b=document.createElement("button");
    b.textContent=c.t;
    b.onclick=()=>{
      b.classList.toggle("selected");
      selected.includes(i)
        ? selected.splice(selected.indexOf(i),1)
        : selected.push(i);
    };
    gameA.appendChild(b);
  });

  const validate=document.createElement("button");
  validate.className="validateBtn";
  validate.textContent="Valider mes choix";
  validate.onclick=()=>{
    const good = selected.length===2 && selected.every(i=>choices[i].ok);
    if(good){
      miniGame.classList.add("hidden");
      reward5000();
    }else{
      gameF.textContent="❌ Mauvaise stratégie";
    }
  };
  gameA.appendChild(validate);
}

/* =====================================================
   🏆 RÉCOMPENSE 5000 + FEU D’ARTIFICE
===================================================== */
function reward5000(){
  showLoader(`
    <h2>Bravo ! Tu as gagné</h2>
    <div id="poCounter">0</div>
    <p>pièces d’or 💰</p>
    <p>et ton Business Plan</p>
  `, 100, ()=>{
    let v=0;
    const counter=document.getElementById("poCounter");
    const t=setInterval(()=>{
      v+=100;
      counter.textContent=v;
      if(v>=5000){
        clearInterval(t);
        launchFireworks();
        setTimeout(showBook,1200);
      }
    },30);
  });
}

/* =====================================================
   📖 LIVRE
===================================================== */
const bookContainer=document.getElementById("bookContainer");
const leftPage=document.getElementById("leftPage");
const rightPage=document.getElementById("rightPage");
const continueBtn=document.getElementById("continueQuestBtn");

const pages=[
  "images/Businessplancov.png",
  "images/Businessplan1.png",
  "images/Businessplan2.png",
  "images/Businessplan3.png"
];
let page=0;

function showBook(){
  bookContainer.classList.remove("hidden");
  updateBook();
}

function updateBook(){
  leftPage.src=pages[page];
  rightPage.src=pages[page+1]||"";
  continueBtn.style.display = page>=pages.length-2?"block":"none";
}

document.querySelector(".book").onclick=(e)=>{
  const rect=e.currentTarget.getBoundingClientRect();
  if(e.clientX>rect.left+rect.width/2 && page<pages.length-2) page++;
  else if(page>0) page--;
  updateBook();
};

continueBtn.onclick=()=>{
  bookContainer.classList.add("hidden");
  showLoader("Chargement…",1000,spawnPirate3);
};

/* =====================================================
   🏴‍☠️ PIRATE 3 + FUMÉE
===================================================== */
function spawnPirate3(){
  pirate3.classList.remove("hidden");
  pirate3.classList.add("show");
  pirate3.classList.add("glow");

  pirate3.addEventListener("click",()=>{
    pirate3.classList.remove("glow");
    startDialogues2();
  },{once:true});
}

/* =====================================================
   💬 DIALOGUES 2
===================================================== */
function startDialogues2(){
  playDialogues([
    {text:"Les clients ont besoin de confiance.",anchor:pirate3},
    {text:"Comment vas-tu faire ?",anchor:pirate5}
  ],()=>showLoader("Chargement…",1000,startMiniGame2));
}

/* =====================================================
   🎮 MINI-JEU 2 — JUGEMENT
===================================================== */
function startMiniGame2(){
  miniGame.classList.remove("hidden");
  gameQ.textContent="Que fais-tu ?";
  gameA.innerHTML="";
  ["Expliquer","Baisser le prix","Ignorer"].forEach((t,i)=>{
    const b=document.createElement("button");
    b.textContent=t;
    b.onclick=()=>{
      miniGame.classList.add("hidden");
      i===0 ? startDialogues3() : startMiniGame2();
    };
    gameA.appendChild(b);
  });
}

/* =====================================================
   💬 DIALOGUES 3 + FIN
===================================================== */
function startDialogues3(){
  playDialogues([
    {text:"Tu as gagné leur confiance.",anchor:pirate3},
    {text:"Note leurs informations.",anchor:pirate5}
  ],finalReward);
}

function finalReward(){
  showLoader("<h1>Bravo tu as terminé la quête</h1>",1500,()=>{
    launchFireworks();
    setTimeout(()=>location.href="menu.html",3000);
  });
}

/* =====================================================
   🎆 FEUX D’ARTIFICE
===================================================== */
function launchFireworks(){
  const c=document.createElement("canvas");
  c.width=innerWidth;c.height=innerHeight;
  c.style.position="fixed";c.style.inset=0;c.style.pointerEvents="none";
  document.body.appendChild(c);
  const ctx=c.getContext("2d");
  let p=[];
  for(let i=0;i<200;i++){
    const a=Math.random()*Math.PI*2;
    p.push({x:innerWidth/2,y:innerHeight/2,vx:Math.cos(a)*8,vy:Math.sin(a)*8,l:80});
  }
  function draw(){
    ctx.clearRect(0,0,c.width,c.height);
    p.forEach(o=>{
      o.vy+=0.15;o.x+=o.vx;o.y+=o.vy;o.l--;
      ctx.fillStyle="gold";
      ctx.beginPath();ctx.arc(o.x,o.y,3,0,Math.PI*2);ctx.fill();
    });
    p=p.filter(o=>o.l>0);
    p.length?requestAnimationFrame(draw):c.remove();
  }
  draw();
}

});
