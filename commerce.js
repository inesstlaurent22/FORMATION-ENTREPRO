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
  showLoader("Chargement du marché...", 900, showBackground);
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

  pirate5.classList.add("glow");
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

let dialogues=[], dIndex=0, onDialogueEnd=null;

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

  bubble.style.left = r.left + r.width/2 + "px";
  bubble.style.top = top + "px";
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
    { text:"Bienvenue sur le marché des trésors.", anchor: pirate5 },
    { text:"Ici, la confiance vaut plus que l’or.", anchor: pirate5 },
    { text:"Construisons ton business plan.", anchor: pirate2 }
  ], ()=> showLoader("Chargement du mini-jeu…", 900, startMiniGame1));
}

/* =====================================================
   🎮 MINI-JEU 1 (MULTI-RÉPONSES)
===================================================== */
const miniGame = document.getElementById("miniGameContainer");
const gameQ = document.getElementById("gameQuestion");
const gameA = document.getElementById("gameAnswers");
const gameF = document.getElementById("gameFeedback");

function startMiniGame1(){
  miniGame.style.display = "flex";
  gameF.textContent = "";
  gameQ.innerHTML = `
    Comment rassurer les clients ?
    <div style="font-size:14px;color:gold;margin-top:6px">
      ⚠️ Plusieurs réponses possibles
    </div>
  `;

  const choices = [
    {t:"Montrer les pierres", ok:true},
    {t:"Mentir sur l’origine", ok:false},
    {t:"Donner une adresse fiable", ok:true}
  ];

  let selected=[];
  gameA.innerHTML="";

  choices.forEach((c,i)=>{
    const b=document.createElement("button");
    b.textContent=c.t;
    b.onclick=()=>{
      b.classList.toggle("selected");
      selected.includes(i)
        ? selected=selected.filter(x=>x!==i)
        : selected.push(i);
    };
    gameA.appendChild(b);
  });

  const v=document.createElement("button");
  v.textContent="Valider mes choix";
  v.className="validateBtn";

  v.onclick=()=>{
    const ok = selected.length===2 && selected.every(i=>choices[i].ok);
    if(ok){
      gameF.innerHTML="<strong style='color:#7CFF7C'>Bonne décision ✔️</strong>";
      setTimeout(winMiniGame1,1000);
    }else{
      gameF.textContent="❌ Mauvaise stratégie";
    }
  };

  gameA.appendChild(v);
}

/* =====================================================
   🎆 FEUX D’ARTIFICE (EXPLOSION)
===================================================== */
function fireworks(){
  const c=document.createElement("canvas");
  c.width=innerWidth; c.height=innerHeight;
  c.style.position="fixed"; c.style.inset=0;
  c.style.pointerEvents="none"; c.style.zIndex=3000;
  document.body.appendChild(c);

  const ctx=c.getContext("2d");
  let p=[];
  for(let i=0;i<180;i++){
    const a=Math.random()*Math.PI*2;
    p.push({
      x:innerWidth/2,y:innerHeight/2,
      vx:Math.cos(a)*(6+Math.random()*6),
      vy:Math.sin(a)*(6+Math.random()*6),
      r:2+Math.random()*3,
      life:90
    });
  }

  (function anim(){
    ctx.clearRect(0,0,c.width,c.height);
    p.forEach(o=>{
      o.vy+=0.08;
      o.x+=o.vx; o.y+=o.vy; o.life--;
      ctx.fillStyle="gold";
      ctx.beginPath(); ctx.arc(o.x,o.y,o.r,0,Math.PI*2); ctx.fill();
    });
    p=p.filter(o=>o.life>0);
    p.length?requestAnimationFrame(anim):c.remove();
  })();
}

/* =====================================================
   🏆 RÉUSSITE MINI-JEU 1 → LIVRE
===================================================== */
function winMiniGame1(){
  miniGame.style.display="none";
  fadeScreen.style.display="flex";
  loaderBox.innerHTML=`
    <div style="font-size:26px;color:gold">Bravo ! Tu as gagné</div>
    <div style="font-size:52px" id="po">0</div>
    <div>pièces d’or 💰<br>et ton business plan</div>
  `;

  fireworks();

  let v=0;
  const i=setInterval(()=>{
    v+=100;
    document.getElementById("po").textContent=v;
    if(v>=5000){
      clearInterval(i);
      setTimeout(()=>{
        fadeScreen.style.display="none";
        openBook();
      },900);
    }
  },25);
}

/* =====================================================
   📖 LIVRE
===================================================== */
const bookContainer=document.getElementById("bookContainer");
const leftPage=document.getElementById("leftPage");
const rightPage=document.getElementById("rightPage");
const continueBtn=document.getElementById("continueQuestBtn");

const pages=[
  "Businessplancov.png",
  "Businessplan1.png",
  "Businessplan2.png",
  "Businessplan3.png"
];
let page=0;

function openBook(){
  bookContainer.style.display="flex";
  page=0;
  updateBook();
}

function updateBook(){
  leftPage.src="images/"+(pages[page]||"");
  rightPage.src="images/"+(pages[page+1]||"");
  continueBtn.style.display = page>=pages.length-2 ? "block":"none";
}

bookContainer.onclick=e=>{
  const r=e.currentTarget.getBoundingClientRect();
  if(e.clientX>r.width/2 && page<pages.length-2) page+=2;
  else if(e.clientX<r.width/2 && page>0) page-=2;
  updateBook();
};

continueBtn.onclick=e=>{
  e.stopPropagation();
  bookContainer.style.display="none";
  spawnPirate3();
};

/* =====================================================
   🏴‍☠️ PIRATE 3 — ENTRÉE FUMÉE
===================================================== */
function spawnPirate3(){
  pirate3.classList.remove("hidden");
  pirate3.style.right="-300px";
  pirate3.style.transition="right .8s ease";
  setTimeout(()=>pirate3.style.right="40%",50);
  setTimeout(startDialogues2,900);
}

/* =====================================================
   💬 DIALOGUES 2
===================================================== */
function startDialogues2(){
  playDialogues([
    {text:"Ces pierres inspirent confiance.", anchor:pirate3},
    {text:"Les clients observent chaque détail.", anchor:pirate5}
  ], startMiniGame2);
}

/* =====================================================
   🎮 MINI-JEU 2 — JUGEMENT DU MARCHAND
===================================================== */
const merchantGame=document.getElementById("merchantGame");
const clueEl=document.getElementById("clue");

function startMiniGame2(){
  merchantGame.style.display="flex";
  clueEl.textContent="Analyse le marché avant de décider";
}

window.analyzeClient=()=>{
  clueEl.textContent="💡 Peu de vendeurs, qualité perçue élevée";
};

window.keepPrice=()=>{
  merchantGame.style.display="none";
  startFinalDialogues();
};

window.lowerPrice=()=>{
  clueEl.textContent="❌ Tu perds la valeur perçue";
};

/* =====================================================
   💬 DIALOGUES FINAUX + BASE DE DONNÉES
===================================================== */
function startFinalDialogues(){
  playDialogues([
    {text:"Tu sais gagner la confiance.", anchor:pirate3},
    {text:"Note les infos de tes clients.", anchor:pirate5}
  ], showDatabaseBox);
}

function showDatabaseBox(){
  const b=document.createElement("div");
  b.className="dialogue-bubble";
  b.style.left="50%"; b.style.top="50%";
  b.style.transform="translate(-50%,-50%)";
  b.innerHTML="<strong>Base de données</strong><br>Elle te permet de fidéliser tes clients.";
  b.onclick=winFinal;
  bubbleContainer.appendChild(b);
}

/* =====================================================
   🏁 FIN
===================================================== */
function winFinal(){
  fadeScreen.style.display="flex";
  loaderBox.innerHTML="🎉 Bravo, quête terminée";
  fireworks();
  setTimeout(()=>location.href="menu.html",3000);
}

});
