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
  showLoader("Chargement...", 1000, showBackground);
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
   🏴‍☠️ PIRATE 5 (HOVER → CLICK)
===================================================== */
function enablePirate5(){
  pirate5.classList.add("glow");
  pirate5.style.cursor = "pointer";

  pirate5.addEventListener("mouseenter", ()=>pirate5.classList.add("glow"));
  pirate5.addEventListener("mouseleave", ()=>pirate5.classList.remove("glow"));

  pirate5.addEventListener("click", ()=>{
    pirate5.classList.remove("glow");
    pirate5.style.pointerEvents = "none";
    startDialogues1();
  }, { once:true });
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

skipBtn.onclick = endDialogues;

/* =====================================================
   💬 DIALOGUES 1
===================================================== */
function startDialogues1(){
  playDialogues([
    { text:"Moussaillon ! Bienvenue sur le marché des trésors.", anchor:pirate5 },
    { text:"Ici, la confiance vaut plus que l’or.", anchor:pirate5 },
    { text:"Créons d’abord ton business plan.", anchor:pirate2 }
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
  gameF.textContent = "";
  gameQ.innerHTML = `
    Quelle est la première étape d’un business plan ?
    <div class="multiHint">⚠️ Plusieurs réponses possibles</div>
  `;
  gameA.innerHTML = "";

  const choices = [
    {t:"Définir clairement ton offre", ok:true},
    {t:"Acheter un bateau", ok:false},
    {t:"Identifier tes clients", ok:true}
  ];

  let selected = [];

  choices.forEach((c,i)=>{
    const b = document.createElement("button");
    b.textContent = c.t;
    b.onclick = ()=>{
      b.classList.toggle("selected");
      selected.includes(i)
        ? selected.splice(selected.indexOf(i),1)
        : selected.push(i);
    };
    gameA.appendChild(b);
  });

  const validate = document.createElement("button");
  validate.textContent = "Valider mes choix";
  validate.className = "validateBtn";

  validate.onclick = ()=>{
    const success =
      selected.length === 2 &&
      selected.every(i => choices[i].ok);

    if(success){
      miniGame.classList.add("hidden");
      showReward();
    } else {
      gameF.textContent = "❌ Mauvaise stratégie";
    }
  };

  gameA.appendChild(validate);
}

/* =====================================================
   🎉 RÉUSSITE + COMPTEUR + FEU D’ARTIFICE
===================================================== */
function showReward(){
  fadeScreen.classList.remove("hidden");
  loaderBox.innerHTML = `
    <div class="rewardTitle">Bravo ! Tu as gagné</div>
    <div class="rewardCounter"><span id="poCounter">0</span></div>
    <div class="rewardLabel">pièces d’or 💰</div>
    <div class="rewardSub">et ton business plan</div>
  `;

  launchFireworks();

  let v = 0;
  const c = document.getElementById("poCounter");
  const timer = setInterval(()=>{
    v += 100;
    c.textContent = v;
    if(v >= 5000){
      clearInterval(timer);
      setTimeout(()=>{
        fadeScreen.classList.add("hidden");
        openBook();
      },1000);
    }
  },30);
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

  for(let i=0;i<180;i++){
    const a = Math.random()*Math.PI*2;
    const s = Math.random()*8+4;
    particles.push({
      x:innerWidth/2,
      y:innerHeight/2,
      vx:Math.cos(a)*s,
      vy:Math.sin(a)*s,
      r:Math.random()*3+2,
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
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fill();
    });
    particles = particles.filter(p=>p.life>0);
    particles.length ? requestAnimationFrame(update) : canvas.remove();
  }
  update();
}

/* =====================================================
   📖 LIVRE
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

function openBook(){
  bookContainer.classList.remove("hidden");
  pageIndex = 0;
  updateBook();
}

function updateBook(){
  leftPage.src = pages[pageIndex] || "";
  rightPage.src = pages[pageIndex+1] || "";
  continueBtn.classList.toggle("hidden", pageIndex < pages.length-2);
}

document.querySelector(".book").onclick = e=>{
  const rect = e.currentTarget.getBoundingClientRect();
  const right = e.clientX > rect.left + rect.width/2;

  if(right && pageIndex < pages.length-2){
    pageIndex += 2;
  }else if(!right && pageIndex > 0){
    pageIndex -= 2;
  }
  updateBook();
};

continueBtn.onclick = ()=>{
  bookContainer.classList.add("hidden");
  showLoader("Chargement...", 800, spawnPirate3);
};

/* =====================================================
   🌫️ PIRATE 3 — ARRIVÉE
===================================================== */
function spawnPirate3(){
  pirate3.classList.remove("hidden");
  pirate3.style.right = "-300px";
  pirate3.style.transition = "right .8s ease";
  setTimeout(()=> pirate3.style.right = "30%", 50);

  pirate3.onmouseenter = ()=>pirate3.classList.add("glow");
  pirate3.onmouseleave = ()=>pirate3.classList.remove("glow");

  pirate3.onclick = ()=>{
    pirate3.classList.remove("glow");
    pirate3.style.pointerEvents = "none";
    startDialogues2();
  };
}

/* =====================================================
   💬 DIALOGUES 2
===================================================== */
function startDialogues2(){
  playDialogues([
    { text:"Vous êtes nouveaux sur le marché ?", anchor:pirate3 },
    { text:"Oui, nous vendons des pierres précieuses.", anchor:pirate2 },
    { text:"Les clients n’ont confiance qu’en un seul pirate.", anchor:pirate3 }
  ], ()=> showLoader("Chargement...", 800, startMiniGame2));
}

/* =====================================================
   🎮 MINI-JEU 2 — JUGEMENT DU MARCHÉ
===================================================== */
function startMiniGame2(){
  miniGame.classList.remove("hidden");
  gameQ.textContent = "Comment gagner la confiance des clients ?";
  gameA.innerHTML = "";
  gameF.textContent = "";

  ["Montrer les pierres","Mentir","Distribuer l’adresse"]
  .forEach((t,i)=>{
    const b=document.createElement("button");
    b.textContent=t;
    b.onclick=()=>{
      if(i!==1){
        miniGame.classList.add("hidden");
        startDialogues3();
      }else{
        gameF.textContent="❌ Mauvaise idée";
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
    { text:"Tu as gagné leur confiance.", anchor:pirate5 },
    { text:"Note leurs informations.", anchor:pirate5 },
    { text:"Bonne idée !", anchor:pirate2 }
  ], showDatabase);
}

/* =====================================================
   📦 BASE DE DONNÉES → FIN
===================================================== */
function showDatabase(){
  const box=document.createElement("div");
  box.className="dialogue-bubble";
  box.style.left="50%";
  box.style.top="50%";
  box.style.transform="translate(-50%,-50%)";
  box.innerHTML=`
    <h2>Base de données clients</h2>
    <p>Note noms, adresses et préférences.</p>
    <p><strong>(Clique pour terminer)</strong></p>
  `;
  box.onclick=()=>{
    bubbleContainer.innerHTML="";
    showLoader("🎉 Bravo tu as terminé la quête",2000,()=>{
      window.location.href="menu.html";
    });
  };
  bubbleContainer.appendChild(box);
}

});
