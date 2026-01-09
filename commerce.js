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
  showLoader("⚓ Chargement du marché…", 900, showBackground);
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
   🏴‍☠️ PIRATE 5 → DIALOGUES
===================================================== */
function enablePirate5(){
  pirate5.classList.add("glow");
  pirate5.style.cursor = "pointer";

  pirate5.onclick = ()=>{
    pirate5.classList.remove("glow");
    pirate5.style.pointerEvents = "none";
    startDialogues1();
  };
}

/* =====================================================
   💬 DIALOGUES (SYSTÈME ROBUSTE)
===================================================== */
const bubbleContainer = document.getElementById("bubbleContainer");
const skipBtn = document.getElementById("skipDialoguesBtn");

function playDialogues(dialogues, onEnd){
  let index = 0;
  skipBtn.style.display = "block";

  function render(){
    bubbleContainer.innerHTML = "";
    const d = dialogues[index];

    const bubble = document.createElement("div");
    bubble.className = "dialogue-bubble";
    bubble.innerHTML = d.text;

    const r = d.anchor.getBoundingClientRect();
    let top = r.top - 140;
    if(top < 20) top = r.bottom + 20;

    bubble.style.left = r.left + r.width/2 + "px";
    bubble.style.top  = top + "px";
    bubble.style.transform = "translateX(-50%)";

    bubble.onclick = ()=>{
      vibrate(10);
      index++;
      index < dialogues.length ? render() : end();
    };

    bubbleContainer.appendChild(bubble);
  }

  function end(){
    bubbleContainer.innerHTML = "";
    skipBtn.style.display = "none";
    onEnd && onEnd();
  }

  skipBtn.onclick = end;
  render();
}

/* =====================================================
   💬 DIALOGUES 1
===================================================== */
function startDialogues1(){
  playDialogues([
    { text:"Moussaillon ! Bienvenue sur le marché des trésors !", anchor:pirate5 },
    { text:"Ici, la confiance vaut plus que l’or.", anchor:pirate5 },
    { text:"Créons d’abord ton business plan.", anchor:pirate2 }
  ], ()=>{
    showLoader("Chargement du mini-jeu…", 900, startMiniGame1);
  });
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
  gameQ.innerHTML = `
    Quelle action rassure les clients ?
    <div style="font-size:14px;color:gold">⚠️ Plusieurs réponses possibles</div>
  `;
  gameA.innerHTML = "";
  gameF.textContent = "";

  const choices = [
    {t:"Montrer les pierres", ok:true},
    {t:"Mentir sur l’origine", ok:false},
    {t:"Expliquer leur valeur", ok:true}
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
  validate.style.marginTop = "18px";

  validate.onclick = ()=>{
    const good = selected.length === 2 && selected.every(i=>choices[i].ok);
    if(good){
      miniGame.classList.add("hidden");
      showReward();
    }else{
      gameF.textContent = "❌ Mauvaise stratégie";
    }
  };

  gameA.appendChild(validate);
}

/* =====================================================
   🎆 RÉCOMPENSE + COMPTEUR
===================================================== */
function showReward(){
  loaderBox.innerHTML = `
    <h1 style="color:gold">Bravo !</h1>
    <p>Tu as gagné</p>
    <h2 id="poCounter">0</h2>
    <p>pièces d’or 💰</p>
    <p>et ton business plan</p>
  `;
  fadeScreen.style.display="flex";
  launchFireworks();

  let v=0;
  const t=setInterval(()=>{
    v+=100;
    document.getElementById("poCounter").textContent=v;
    if(v>=5000){
      clearInterval(t);
      setTimeout(()=>{
        fadeScreen.style.display="none";
        openBook();
      },1000);
    }
  },30);
}

/* =====================================================
   🎇 FEUX D’ARTIFICE
===================================================== */
function launchFireworks(){
  const c=document.createElement("canvas");
  c.width=innerWidth;c.height=innerHeight;
  c.style.position="fixed";c.style.inset=0;
  c.style.pointerEvents="none";c.style.zIndex=5000;
  document.body.appendChild(c);
  const x=c.getContext("2d");
  let p=[];
  for(let i=0;i<200;i++){
    const a=Math.random()*Math.PI*2;
    const s=Math.random()*8+4;
    p.push({x:innerWidth/2,y:innerHeight/2,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:100});
  }
  (function anim(){
    x.clearRect(0,0,c.width,c.height);
    p.forEach(o=>{
      o.vy+=0.15;o.x+=o.vx;o.y+=o.vy;o.l--;
      x.fillStyle="gold";x.beginPath();x.arc(o.x,o.y,3,0,7);x.fill();
    });
    p=p.filter(o=>o.l>0);
    p.length?requestAnimationFrame(anim):c.remove();
  })();
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

let page=0;

function openBook(){
  bookContainer.classList.remove("hidden");
  updateBook();
}

function updateBook(){
  leftPage.src = pages[page];
  rightPage.src = pages[page+1] || "";
  continueBtn.style.display = page >= pages.length-2 ? "block" : "none";
}

document.querySelector(".book").onclick = e=>{
  const mid=e.currentTarget.offsetWidth/2;
  e.offsetX>mid && page<pages.length-2 ? page+=2 :
  e.offsetX<mid && page>0 ? page-=2 : null;
  updateBook();
};

continueBtn.onclick = ()=>{
  bookContainer.classList.add("hidden");
  spawnPirate3();
};

/* =====================================================
   🏴‍☠️ PIRATE 3 — ENTRÉE
===================================================== */
function spawnPirate3(){
  pirate3.classList.remove("hidden");
  pirate3.classList.add("show");
  pirate3.onclick = startDialogues2;
}

/* =====================================================
   💬 DIALOGUES 2
===================================================== */
function startDialogues2(){
  playDialogues([
    {text:"Les clients ont besoin de confiance.",anchor:pirate3},
    {text:"Prouve-leur la valeur de tes pierres.",anchor:pirate5}
  ], startMiniGame2);
}

/* =====================================================
   🎮 MINI-JEU 2 — JUGEMENT DU MARCHÉ
===================================================== */
function startMiniGame2(){
  showLoader("Le jugement du marché commence…",900,()=>{
    playDialogues([
      {text:"Bonne décision. Les clients te feront confiance.",anchor:pirate3}
    ], winFinal);
  });
}

/* =====================================================
   🏁 FIN
===================================================== */
function winFinal(){
  showLoader("🎉 Quête terminée",2000,()=>{
    window.location.href="menu.html";
  });
}

});
