document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   DOM
===================================================== */
const background = document.getElementById("background");
const pirate2 = document.getElementById("pirate2bis");
const pirate5 = document.getElementById("pirate5bis");
const pirate3 = document.getElementById("pirate3bis");

const bubbleContainer = document.getElementById("bubbleContainer");
const skipBtn = document.getElementById("skipDialoguesBtn");
const fadeScreen = document.getElementById("fadeScreen");

const game1 = document.getElementById("communicationGame");
const q1 = document.getElementById("commQuestion");
const a1 = document.getElementById("commAnswers");

const game2 = document.getElementById("visualIdentityGame");
const visualChoices = document.getElementById("visualChoices");

const game3 = document.getElementById("merchantGame");

/* Vidéo */
const videoContainer = document.getElementById("videoContainer");
const questVideo = document.getElementById("questVideo");
const toggleSound = document.getElementById("toggleSound");
const closeVideo = document.getElementById("closeVideo");

/* =====================================================
   OUTILS
===================================================== */
function showLoader(duration = 800, cb){
  fadeScreen.classList.remove("hidden");
  setTimeout(()=>{
    fadeScreen.classList.add("hidden");
    cb && cb();
  }, duration);
}

function shake(el){
  el.classList.add("screen-shake");
  setTimeout(()=>el.classList.remove("screen-shake"),400);
}

/* =====================================================
   VIDÉO
===================================================== */
questVideo.muted = true;

questVideo.oncanplay = ()=>{
  fadeScreen.classList.add("hidden");
  questVideo.play().catch(()=>{});
};

toggleSound.onclick = ()=>{
  questVideo.muted = !questVideo.muted;
  toggleSound.textContent = questVideo.muted ? "🔇" : "🔊";
};

closeVideo.onclick = endVideo;
questVideo.onended = endVideo;

function endVideo(){
  videoContainer.classList.add("hidden");
  showScene();
}

/* =====================================================
   SCÈNE INITIALE
===================================================== */
function showScene(){
  background.classList.remove("hidden");
  pirate2.classList.remove("hidden");
  pirate5.classList.remove("hidden");

  pirate5.classList.add("glowStart");
  pirate5.onclick = ()=>{
    pirate5.classList.remove("glowStart");
    pirate5.style.pointerEvents = "none";
    startDialogues1();
  };
}

/* =====================================================
   DIALOGUES ENGINE
===================================================== */
let dialogues=[], index=0, callback=null;

function playDialogues(list, cb){
  dialogues=list; index=0; callback=cb;
  skipBtn.classList.remove("hidden");
  renderDialogue();
}

function renderDialogue(){
  bubbleContainer.innerHTML="";
  if(index>=dialogues.length){ endDialogues(); return; }

  const d=dialogues[index];
  const b=document.createElement("div");
  b.className="dialogue-bubble";
  b.innerHTML=d.text;

  const r=d.anchor.getBoundingClientRect();
  b.style.left=r.left+r.width/2+"px";
  b.style.top=r.top-120+"px";
  b.style.transform="translateX(-50%)";

  b.onclick=()=>{ index++; renderDialogue(); };
  bubbleContainer.appendChild(b);
}

function endDialogues(){
  bubbleContainer.innerHTML="";
  skipBtn.classList.add("hidden");
  callback && callback();
}

skipBtn.onclick=endDialogues;

/* =====================================================
   DIALOGUES 1
===================================================== */
function startDialogues1(){
  playDialogues([
    {text:"Avant de vendre, il faut comprendre ton marché.", anchor:pirate5},
    {text:"Clients, concurrence, prix… tout compte.", anchor:pirate5}
  ], ()=>startMiniGame1());
}

/* =====================================================
   MINI-JEU 1 (simple)
===================================================== */
function startMiniGame1(){
  game1.classList.remove("hidden");
  q1.textContent="Pourquoi faire une étude de marché ?";
  a1.innerHTML="";

  [
    {t:"Décorer la boutique",ok:false},
    {t:"Comprendre les clients",ok:true},
    {t:"Copier les autres",ok:false}
  ].forEach(q=>{
    const b=document.createElement("button");
    b.textContent=q.t;
    b.onclick=()=>{
      if(!q.ok){ shake(game1); return; }
      game1.classList.add("hidden");
      startDialogues2();
    };
    a1.appendChild(b);
  });
}

/* =====================================================
   DIALOGUES 2
===================================================== */
function startDialogues2(){
  playDialogues([
    {text:"Parfait. Construisons maintenant le business plan.", anchor:pirate5}
  ], ()=>startMiniGame2());
}

/* =====================================================
   MINI-JEU 2
===================================================== */
function startMiniGame2(){
  game2.classList.remove("hidden");
  visualChoices.innerHTML="";
  let success=0;

  [
    {t:"Définir la cible",ok:true},
    {t:"Choisir la couleur du bateau",ok:false},
    {t:"Identifier le problème",ok:true}
  ].forEach(q=>{
    const b=document.createElement("button");
    b.textContent=q.t;
    b.onclick=()=>{
      if(!q.ok){ shake(game2); return; }
      b.disabled=true;
      success++;
      if(success===2){
        game2.classList.add("hidden");
        showBusinessPlanBook();
      }
    };
    visualChoices.appendChild(b);
  });
}

/* =====================================================
   📘 LIVRE BUSINESS PLAN
===================================================== */
function showBusinessPlanBook(){

  const overlay=document.createElement("div");
  overlay.id="identity-loader";
  overlay.innerHTML=`
    <div class="identity-center">
      <h2>📘 Construction du Business plan</h2>

      <div class="book-container">
        <button id="prevPage" class="book-nav-btn hidden">‹</button>

        <div class="book-pages">
          <img id="leftPage">
          <img id="rightPage">
        </div>

        <button id="nextPage" class="book-nav-btn">›</button>
      </div>

      <button id="continueQuestBtn" class="hidden">Continuer la quête</button>
    </div>
  `;
  document.body.appendChild(overlay);

  const pages=[
    ["","images/Businessplancov.png"],
    ["images/Businessplan4.jpg","images/Businessplan1.jpg"],
    ["images/Businessplan4.jpg","images/Businessplan2.jpg"],
    ["images/Businessplan4.jpg","images/Businessplan3.jpg"]
  ];

  const left=document.getElementById("leftPage");
  const right=document.getElementById("rightPage");
  const next=document.getElementById("nextPage");
  const prev=document.getElementById("prevPage");
  const cont=document.getElementById("continueQuestBtn");

  let step=0;

  function update(){
    const [l,r]=pages[step];
    left.src=l||""; right.src=r;
    prev.classList.toggle("hidden",step===0);
    next.classList.toggle("hidden",step===pages.length-1);
    cont.classList.toggle("hidden",step!==pages.length-1);
  }

  next.onclick=()=>{ step++; update(); };
  prev.onclick=()=>{ step--; update(); };

  [left,right].forEach(img=>{
    img.onclick=()=>{
      if(!img.src) return;
      const z=document.createElement("div");
      z.className="page-zoom";
      z.innerHTML=`<img src="${img.src}">`;
      z.onclick=()=>z.remove();
      document.body.appendChild(z);
    };
  });

  cont.onclick=()=>{
    overlay.remove();
    spawnPirate3();
  };

  update();
}

/* =====================================================
   PIRATE 3 → MINI-JEU 3
===================================================== */
function spawnPirate3(){
  pirate3.classList.remove("hidden");
  pirate3.classList.add("glowStart");

  pirate3.onclick=()=>{
    pirate3.classList.remove("glowStart");
    startMiniGame3();
  };
}

/* =====================================================
   MINI-JEU 3 — STRATÉGIES COMMERCIALES
===================================================== */
function startMiniGame3(){
  game3.classList.remove("hidden");

  const text=document.getElementById("strategyText");
  const choices=document.getElementById("strategyChoices");
  const hint=document.getElementById("strategyHint");
  const hintBtn=document.getElementById("strategyHintBtn");

  let step=0;

  const steps=[
    {
      text:`Les autres vendeurs proposent des pierres à <strong>300 PO</strong>,
      mais ils n’ont pas de <strong>pierres rouges</strong>.
      Vous, oui. Les pierres sont vendues en lot.
      Quel prix afficher ?`,
      hint:"Vous êtes en position de force grâce aux pierres rouges.",
      answers:[
        {t:"Augmenter le prix – 350 PO",ok:true},
        {t:"Prix identique – 300 PO",ok:false},
        {t:"Baisser le prix – 250 PO",ok:false}
      ]
    },
    {
      text:`Les concurrents utilisent des sacs de velours fragiles.
      Vous choisissez des boîtes en bois (20 PO).
      Comment ajuster le prix ?`,
      hint:"Le coût des boîtes est déjà inclus.",
      answers:[
        {t:"Augmenter – 370 PO",ok:false},
        {t:"Prix identique – 350 PO",ok:true},
        {t:"Baisser – 330 PO",ok:false}
      ]
    },
    {
      text:`Dernière décision :
      vendre vite pour acheter un bateau ou vendre plus cher ?
      Les clients sont très informés.`,
      hint:"L’objectif est d’acheter un bateau rapidement.",
      answers:[
        {t:"Augmenter – 400 PO",ok:false},
        {t:"Prix identique – 350 PO",ok:false},
        {t:"Baisser – 300 PO",ok:true}
      ],
      final:`Bonne stratégie.<br><br>
      Les pirates préfèrent vendre rapidement à 300 PO
      afin d’acheter leur bateau sans attendre
      que leur réputation de luxe se construise.`
    }
  ];

  function render(){
    const s=steps[step];
    text.innerHTML=s.text;
    hint.textContent=s.hint;
    hint.classList.add("hidden");
    choices.innerHTML="";

    s.answers.forEach(a=>{
      const b=document.createElement("button");
      b.textContent=a.t;
      b.onclick=()=>{
        if(!a.ok){ shake(game3); return; }
        if(s.final){
          text.innerHTML=s.final;
          choices.innerHTML="";
          hintBtn.classList.add("hidden");
        }else{
          step++; render();
        }
      };
      choices.appendChild(b);
    });
  }

  hintBtn.onclick=()=>hint.classList.remove("hidden");
  render();
}

});
