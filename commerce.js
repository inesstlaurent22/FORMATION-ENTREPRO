document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   📳 UTILITAIRES
===================================================== */
function vibrate(p=15){
  if("vibrate" in navigator) navigator.vibrate(p);
}

/* =====================================================
   🌑 LOADER / FADE
===================================================== */
const fadeScreen = document.getElementById("fadeScreen");
const loaderBox  = fadeScreen.querySelector(".loaderBox");

function showLoader(text, cb){
  loaderBox.textContent = text;
  fadeScreen.style.display = "flex";
  fadeScreen.style.opacity = "1";

  setTimeout(()=>{
    fadeScreen.style.opacity = "0";
    setTimeout(()=>{
      fadeScreen.style.display = "none";
      cb && cb();
    },400);
  },1400);
}

/* =====================================================
   🎬 VIDÉO
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const video = document.getElementById("questVideo");
const toggleSound = document.getElementById("toggleSound");
const closeVideo = document.getElementById("closeVideo");

video.muted = true;

toggleSound.onclick = ()=>{
  vibrate(10);
  video.muted = !video.muted;
  toggleSound.textContent = video.muted ? "🔇" : "🔊";
};

closeVideo.onclick = endVideo;
video.onended = endVideo;

function endVideo(){
  video.pause();
  videoContainer.style.display="none";
  showLoader("Chargement...", showBackground);
}

/* =====================================================
   🌅 BACKGROUND + PIRATES (FORÇAGE TOTAL)
===================================================== */
const background = document.getElementById("background");
const pirate2    = document.getElementById("pirate2bis");
const pirate5    = document.getElementById("pirate5bis");
const pirate3    = document.getElementById("pirate3bis");

function showBackground(){
  console.log("✅ BACKGROUND AFFICHÉ");

  background.classList.remove("hidden");
  background.style.display    = "block";
  background.style.opacity    = "1";
  background.style.visibility = "visible";

  [pirate2, pirate5].forEach(p => {
    p.classList.remove("hidden");
    p.style.display    = "block";
    p.style.opacity    = "1";
    p.style.visibility = "visible";
  });
}

/* =====================================================
   💬 BULLES (GÉNÉRIQUE)
===================================================== */
const bubbleContainer = document.getElementById("bubbleContainer");
const skipBtn = document.getElementById("skipDialoguesBtn");

function playDialogues(dialogues, onEnd){
  let i=0;
  skipBtn.style.display="block";

  function show(){
    bubbleContainer.innerHTML="";
    const d = dialogues[i];
    const b = document.createElement("div");
    b.className="dialogue-bubble";
    b.innerHTML=d.text;

    const r = d.anchor.getBoundingClientRect();
    b.style.left = r.left+"px";
    b.style.top  = (r.top-140)+"px";

    b.onclick=()=>{
      vibrate(10);
      i++;
      i<dialogues.length ? show() : end();
    };
    bubbleContainer.appendChild(b);
  }

  function end(){
    bubbleContainer.innerHTML="";
    skipBtn.style.display="none";
    onEnd && onEnd();
  }

  skipBtn.onclick=end;
  show();
}

/* =====================================================
   💬 DIALOGUES 1 → MINI-JEU 1
===================================================== */
pirate5.onclick=()=>{
  playDialogues([
    {text:"Bienvenue sur le marché des trésors.",anchor:pirate5},
    {text:"Je veux réussir ici.",anchor:pirate2},
    {text:"Alors prouve que tu es digne de confiance.",anchor:pirate5}
  ],()=>{
    showLoader("Termine ce mini-jeu pour continuer la quête",startMiniGame1);
  });
};

/* =====================================================
   🎮 MINI-JEU 1 (MULTI-RÉPONSES)
===================================================== */
const miniGame = document.getElementById("miniGameContainer");
const gameQuestion=document.getElementById("gameQuestion");
const gameAnswers=document.getElementById("gameAnswers");
const gameFeedback=document.getElementById("gameFeedback");

function startMiniGame1(){
  miniGame.style.display="flex";
  gameFeedback.textContent="";
  gameQuestion.innerHTML=`
    Que dois-tu faire pour rassurer les clients ?
    <div class="multiHint">⚠️ Plusieurs réponses possibles</div>
  `;
  gameAnswers.innerHTML="";

  const choices=[
    {t:"Montrer les pierres",ok:true},
    {t:"Mentir sur leur origine",ok:false},
    {t:"Donner l’adresse de l’échoppe",ok:true}
  ];
  let selected=[];

  choices.forEach((c,i)=>{
    const b=document.createElement("button");
    b.textContent=c.t;
    b.onclick=()=>{
      vibrate(10);
      b.classList.toggle("selected");
      selected.includes(i)
        ? selected=selected.filter(x=>x!==i)
        : selected.push(i);
    };
    gameAnswers.appendChild(b);
  });

  const v=document.createElement("button");
  v.textContent="Valider mes choix";
  v.className="validateBtn";
  v.onclick=()=>{
    const ok = selected.length===2 && selected.every(i=>choices[i].ok);
    if(ok){
      gameFeedback.innerHTML="✅ <strong>Bonne décision !</strong>";
      setTimeout(()=>{
        miniGame.style.display="none";
        showReward();
      },1200);
    }else{
      gameFeedback.textContent="❌ Mauvaise stratégie";
    }
  };
  gameAnswers.appendChild(v);
}

/* =====================================================
   🏆 RÉCOMPENSE + COMPTEUR
===================================================== */
function showReward(){
  fadeScreen.style.display="flex";
  loaderBox.innerHTML=`
    <div class="rewardTitle">Bravo ! Tu as gagné</div>
    <div class="rewardCounter"><span id="poCounter">0</span></div>
    <div class="rewardLabel">pièces d’or 💰</div>
    <div class="rewardSub">et ton business plan</div>
  `;
  let v=0;
  const c=document.getElementById("poCounter");
  const i=setInterval(()=>{
    v+=100;
    c.textContent=v;
    if(v>=5000){
      clearInterval(i);
      setTimeout(()=>{
        fadeScreen.style.display="none";
        showBook();
      },1200);
    }
  },30);
}

/* =====================================================
   📖 LIVRE
===================================================== */
const bookContainer=document.getElementById("bookContainer");
const leftPage=document.getElementById("leftPage");
const rightPage=document.getElementById("rightPage");
const continueBtn=document.getElementById("continueQuestBtn");

const pages=[
  {l:null,r:"images/Businessplancov.png"},
  {l:"images/Businessplan1.png",r:"images/Businessplan2.png"},
  {l:"images/Businessplan2.png",r:"images/Businessplan3.png"}
];
let page=0;

function showBook(){
  bookContainer.classList.add("show");
  page=0;
  updateBook();
}

function updateBook(){
  leftPage.src=pages[page].l||"";
  rightPage.src=pages[page].r;
  continueBtn.style.display = page===pages.length-1?"block":"none";
}

document.querySelector(".book").onclick=e=>{
  const r=e.currentTarget.getBoundingClientRect();
  const right=e.clientX>r.left+r.width/2;
  if(right && page<pages.length-1) page++;
  else if(!right && page>0) page--;
  updateBook();
};

continueBtn.onclick=()=>{
  bookContainer.classList.remove("show");
  spawnPirate3();
};

/* =====================================================
   ✨ PIRATE 3 + DIALOGUES 2
===================================================== */
function spawnPirate3(){
  pirate3.classList.remove("hidden");
  pirate3.classList.add("show");
}

pirate3.onclick=()=>{
  playDialogues([
    {text:"Je suis le marchand du marché.",anchor:pirate3},
    {text:"Je vais juger tes décisions.",anchor:pirate3},
    {text:"Réponds avec sagesse.",anchor:pirate3}
  ],()=>{
    showLoader("Le jugement du marchand commence…",startMiniGame2);
  });
};

/* =====================================================
   ⚖️ MINI-JEU 2 — LE JUGEMENT DU MARCHAND
===================================================== */
const judgments = [
  {
    q:"Un client doute de la qualité de tes pierres. Que fais-tu ?",
    a:["L’ignorer","Montrer les pierres","Baisser le prix"],
    c:1
  },
  {
    q:"Un client compare ton prix à un concurrent.",
    a:["Insulter le concurrent","Expliquer ta valeur","Mentir"],
    c:1
  },
  {
    q:"Le client hésite à acheter.",
    a:["Forcer la vente","Rassurer calmement","Crier plus fort"],
    c:1
  },
  {
    q:"Un client revient après un achat.",
    a:["Le remercier","L’ignorer","Augmenter le prix"],
    c:0
  }
];

let jIndex=0;
let score=0;

function startMiniGame2(){
  miniGame.style.display="flex";
  jIndex=0;
  score=0;
  showJudgment();
}

function showJudgment(){
  if(jIndex>=judgments.length){
    endJudgment();
    return;
  }
  const j=judgments[jIndex];
  gameQuestion.textContent=j.q;
  gameFeedback.textContent="";
  gameAnswers.innerHTML="";

  j.a.forEach((txt,i)=>{
    const b=document.createElement("button");
    b.textContent=txt;
    b.onclick=()=>{
      vibrate(15);
      if(i===j.c){
        score++;
        gameFeedback.textContent="✅ Le marchand approuve";
      }else{
        gameFeedback.textContent="❌ Mauvais jugement";
      }
      jIndex++;
      setTimeout(showJudgment,900);
    };
    gameAnswers.appendChild(b);
  });
}

function endJudgment(){
  miniGame.style.display="none";
  if(score>=3){
    showLoader("Bravo tu as gagné la quête 🎆",endQuest);
  }else{
    showLoader("Le marchand te juge encore trop novice…",startMiniGame2);
  }
}

/* =====================================================
   🏁 FIN
===================================================== */
function endQuest(){
  setTimeout(()=>window.location.href="menu.html",3000);
}

});
