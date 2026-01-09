document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   🔧 OUTILS
===================================================== */
const isMobile = window.matchMedia("(max-width: 768px)").matches;

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
   🏴‍☠️ PIRATE 5 (GLOW 1 FOIS)
===================================================== */
function enablePirate5(){
  pirate5.classList.add("glow");

  if(!isMobile){
    pirate5.addEventListener("mouseenter", ()=>pirate5.classList.add("glow"));
    pirate5.addEventListener("mouseleave", ()=>pirate5.classList.remove("glow"));
  }

  pirate5.addEventListener("click", ()=>{
    pirate5.classList.remove("glow");
    pirate5.classList.add("frozen");
    startDialogues1();
  }, { once:true });
}

/* =====================================================
   💬 DIALOGUES — SYSTÈME STABLE
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
  if(top < 30 || isMobile) top = window.innerHeight * 0.15;

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
    { text:"Bienvenue sur le marché des trésors.", anchor:pirate5 },
    { text:"La confiance est la clé du commerce.", anchor:pirate5 },
    { text:"Préparons ton business plan.", anchor:pirate2 }
  ], ()=> showLoader("Chargement du mini-jeu...", 1200, startQuiz1));
}

/* =====================================================
   🎮 MINI-JEU 1
===================================================== */
const miniGame = document.getElementById("miniGameContainer");
const gameQ = document.getElementById("gameQuestion");
const gameA = document.getElementById("gameAnswers");
const gameF = document.getElementById("gameFeedback");

const quiz1 = {
  q:"Comment rassurer les clients ?",
  a:["Montrer les pierres","Mentir","Expliquer leur origine"],
  correct:[0,2]
};

let selected = [];

function startQuiz1(){
  miniGame.classList.remove("hidden");
  selected = [];
  gameF.textContent = "";
  gameQ.innerHTML = `
    ${quiz1.q}
    <div style="color:gold;font-size:14px;margin-top:6px">
      ⚠️ Plusieurs réponses possibles
    </div>
  `;
  gameA.innerHTML = "";

  quiz1.a.forEach((txt,i)=>{
    const b = document.createElement("button");
    b.textContent = txt;
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
  validate.onclick = ()=>{
    const ok = selected.length === quiz1.correct.length &&
               selected.every(i=>quiz1.correct.includes(i));
    ok ? winQuiz1() : gameF.textContent = "❌ Mauvais choix";
  };
  gameA.appendChild(validate);
}

/* =====================================================
   🎆 FEUX D’ARTIFICE
===================================================== */
function launchGems(){
  const canvas = document.createElement("canvas");
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  canvas.style.position = "fixed";
  canvas.style.inset = 0;
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = 3000;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let gems = [];

  for(let i=0;i<200;i++){
    const angle = Math.random()*Math.PI*2;
    const speed = Math.random()*14 + 6;
    gems.push({
      x:innerWidth/2,
      y:innerHeight/2,
      vx:Math.cos(angle)*speed,
      vy:Math.sin(angle)*speed,
      r:Math.random()*3+2,
      c:`hsl(${Math.random()*360},100%,60%)`,
      life:120
    });
  }

  function update(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    gems.forEach(g=>{
      g.vy += 0.12;
      g.x += g.vx;
      g.y += g.vy;
      g.life--;
      ctx.fillStyle = g.c;
      ctx.beginPath();
      ctx.arc(g.x,g.y,g.r,0,Math.PI*2);
      ctx.fill();
    });
    gems = gems.filter(g=>g.life>0);
    gems.length ? requestAnimationFrame(update) : canvas.remove();
  }
  update();
}

/* =====================================================
   🏆 RÉUSSITE → LIVRE
===================================================== */
function winQuiz1(){
  miniGame.classList.add("hidden");
  fadeScreen.classList.remove("hidden");

  loaderBox.innerHTML = `
    <div style="font-size:28px;color:gold">Bravo !</div>
    <div id="poCounter" style="font-size:40px">0</div>
    <div>pièces d’or 💰</div>
  `;

  launchGems();

  let po = 0;
  const t = setInterval(()=>{
    po += 100;
    document.getElementById("poCounter").textContent = po;
    if(po>=5000){
      clearInterval(t);
      setTimeout(()=>{
        fadeScreen.classList.add("hidden");
        openBook();
      },800);
    }
  },25);
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
  bookContainer.classList.remove("hidden");
  updateBook();
}

function updateBook(){
  leftPage.src = "images/" + pages[page];
  rightPage.src = pages[page+1] ? "images/" + pages[page+1] : "";
  continueBtn.classList.toggle("hidden", page < pages.length-2);
}

document.querySelector(".book").onclick = e=>{
  const r = e.currentTarget.getBoundingClientRect();
  if(e.clientX > r.left+r.width/2 && page < pages.length-2) page++;
  else if(e.clientX < r.left+r.width/2 && page > 0) page--;
  updateBook();
};

continueBtn.onclick = ()=>{
  bookContainer.classList.add("hidden");
  spawnPirate3();
};

/* =====================================================
   🏴‍☠️ PIRATE 3 — ARRIVÉE ANIMÉE
===================================================== */
function spawnPirate3(){
  pirate3.classList.remove("hidden");
  pirate3.style.transform = "translateX(120vw)";
  pirate3.style.transition = "transform .9s ease-out";

  requestAnimationFrame(()=>{
    pirate3.style.transform = "translateX(0)";
  });

  pirate3.addEventListener("mouseenter", ()=>pirate3.classList.add("glow"));
  pirate3.addEventListener("mouseleave", ()=>pirate3.classList.remove("glow"));
  pirate3.addEventListener("click", startDialogues2, { once:true });
}

/* =====================================================
   💬 DIALOGUES 2
===================================================== */
function startDialogues2(){
  playDialogues([
    { text:"Les clients observent tout.", anchor:pirate3 },
    { text:"Ils achètent à ceux en qui ils ont confiance.", anchor:pirate5 }
  ], startMiniGame2);
}

/* =====================================================
   🎮 MINI-JEU 2
===================================================== */
function startMiniGame2(){
  miniGame.classList.remove("hidden");
  gameQ.textContent = "Un client hésite. Que fais-tu ?";
  gameA.innerHTML = "";
  gameF.textContent = "";

  [
    {t:"Expliquer la valeur", ok:true},
    {t:"Baisser le prix", ok:false},
    {t:"Ignorer", ok:false}
  ].forEach(c=>{
    const b=document.createElement("button");
    b.textContent=c.t;
    b.onclick=()=>{
      c.ok ? winFinal() : gameF.textContent="❌ Mauvais choix";
    };
    gameA.appendChild(b);
  });
}

/* =====================================================
   🎆 FIN
===================================================== */
function winFinal(){
  miniGame.classList.add("hidden");
  fadeScreen.classList.remove("hidden");
  loaderBox.innerHTML="<h1>🎉 Quête terminée</h1>";
  launchGems();
  setTimeout(()=>window.location.href="menu.html",3000);
}

});
