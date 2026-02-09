document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   FLAGS
===================================================== */
let pirate5Locked = false;

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

/* Mini-jeux */
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
   🎬 VIDÉO INTRO
===================================================== */
fadeScreen.classList.remove("hidden");
fadeScreen.style.pointerEvents = "none";

questVideo.muted = true;

questVideo.oncanplay = () => {
  fadeScreen.classList.add("hidden");
  fadeScreen.style.pointerEvents = "auto";
  questVideo.play().catch(()=>{});
};

toggleSound.onclick = () => {
  questVideo.muted = !questVideo.muted;
  toggleSound.textContent = questVideo.muted ? "🔇" : "🔊";
};

closeVideo.onclick = endVideo;
questVideo.onended = endVideo;

function endVideo(){
  videoContainer.classList.add("hidden");
  showLoader(1000, showScene);
}

/* =====================================================
   🌑 LOADER
===================================================== */
function showLoader(duration = 1000, cb){
  fadeScreen.classList.remove("hidden");
  setTimeout(() => {
    fadeScreen.classList.add("hidden");
    cb && cb();
  }, duration);
}

/* =====================================================
   🌅 SCÈNE INITIALE
===================================================== */
function showScene(){
  background.classList.remove("hidden");
  pirate2.classList.remove("hidden");
  pirate5.classList.remove("hidden");

  pirate5.style.left = "1200px";
  pirate5.style.transition = "left 1.2s ease";

  requestAnimationFrame(() => {
    pirate5.style.left = "900px";
  });

  setTimeout(() => {
    if(!pirate5Locked){
      pirate5.classList.add("glowStart");
    }

    pirate5.onclick = () => {
      pirate5Locked = true;
      pirate5.classList.remove("glowStart");
      pirate5.style.pointerEvents = "none";
      startDialogues1();
    };
  }, 1300);
}

/* =====================================================
   💬 DIALOGUES ENGINE
===================================================== */
let dialogues = [];
let index = 0;
let callback = null;

function playDialogues(list, cb){
  dialogues = list;
  index = 0;
  callback = cb;
  skipBtn.classList.remove("hidden");
  renderDialogue();
}

function renderDialogue(){
  bubbleContainer.innerHTML = "";
  if(index >= dialogues.length) return endDialogues();

  const d = dialogues[index];
  const bubble = document.createElement("div");
  bubble.className = "dialogue-bubble";
  bubble.innerHTML = d.text;

  const r = d.anchor.getBoundingClientRect();
  bubble.style.left = r.left + r.width / 2 + "px";
  bubble.style.top = r.top - 120 + "px";
  bubble.style.transform = "translateX(-50%)";

  bubble.onclick = () => {
    index++;
    renderDialogue();
  };

  bubbleContainer.appendChild(bubble);
}

function endDialogues(){
  bubbleContainer.innerHTML = "";
  skipBtn.classList.add("hidden");
  callback && callback();
}

skipBtn.onclick = endDialogues;

/* =====================================================
   💬 DIALOGUES 1
===================================================== */
function startDialogues1(){
  playDialogues([
    { text:"Bien joué, moussaillons. Lancer son activité demande du courage.", anchor: pirate5 },
    { text:"Merci capitaine ! Le marché est ouvert, on est prêts à vendre.", anchor: pirate2 },
    { text:"Avant de foncer, observez. Un bon marchand connaît son marché.", anchor: pirate5 },
    { text:"Qui sont vos clients ? Qu’achètent-ils ? À quel prix ?", anchor: pirate5 },
    { text:"Étudiez vos concurrents : leur réputation, leurs forces, leurs erreurs.", anchor: pirate5 },
    { text:"Fixez le bon prix, et les clients viendront d’abord chez vous.", anchor: pirate5 },
    { text:"Comprendre avant d’agir… on a encore à apprendre.", anchor: pirate2 }
  ], () => showLoader(800, startMiniGame1));
}

/* =====================================================
   🌪️ SHAKE
===================================================== */
function shake(el){
  el.classList.add("screen-shake");
  setTimeout(()=> el.classList.remove("screen-shake"), 400);
}

/* =====================================================
   🎮 MINI-JEU 1
===================================================== */
function startMiniGame1(){
  game1.classList.remove("hidden");

  const quiz = [
    {
      q:"Pourquoi réaliser des études de marché avant de se lancer ?",
      ok:[1,2],
      a:[
        "Choisir les couleurs de sa boutique",
        "Comprendre les attentes des clients",
        "Identifier la concurrence et la demande du marché"
      ]
    },
    {
      q:"Sur quoi dois-tu analyser tes concurrents ?",
      ok:[0,2],
      a:[
        "Leur réputation et leur stratégie",
        "Leur lieu de vacances",
        "Leurs prix et leur positionnement"
      ]
    }
  ];

  let i = 0, found = [];

  function step(){
    q1.innerHTML = quiz[i].q;
    a1.innerHTML = "";
    found = [];

    quiz[i].a.forEach((t,idx)=>{
      const b = document.createElement("button");
      b.textContent = t;
      b.onclick = ()=>{
        if(!quiz[i].ok.includes(idx)){
          shake(game1); return;
        }
        found.push(idx);
        b.classList.add("pressed");
        b.disabled = true;

        if(found.length === quiz[i].ok.length){
          setTimeout(()=>{
            i++;
            if(i < quiz.length) step();
            else{
              game1.classList.add("hidden");
              startDialogues2();
            }
          },600);
        }
      };
      a1.appendChild(b);
    });
  }
  step();
}

/* =====================================================
   💬 DIALOGUES 2
===================================================== */
function startDialogues2(){
  playDialogues([
    { text:"Avec ces informations, tu peux bâtir ton business plan.", anchor: pirate2 },
    { text:"Passons à l’étape suivante.", anchor: pirate5 }
  ], () => showLoader(800, startMiniGame2));
}

/* =====================================================
   🎨 MINI-JEU 2
===================================================== */
function startMiniGame2(){
  game2.classList.remove("hidden");
  visualChoices.innerHTML = "";

  const quiz = [
    { t:"Définir la cible", ok:true },
    { t:"Choisir la couleur du bateau", ok:false },
    { t:"Identifier le problème à résoudre", ok:true }
  ];

  let success = 0;

  quiz.forEach(q=>{
    const b = document.createElement("button");
    b.textContent = q.t;
    b.onclick = ()=>{
      if(!q.ok){ shake(game2); return; }
      b.disabled = true;
      success++;
      if(success === 2){
        game2.classList.add("hidden");
        showLoader(800, showBusinessPlanLoader);
      }
    };
    visualChoices.appendChild(b);
  });
}

/* =====================================================
   📘 LIVRE BUSINESS PLAN
===================================================== */
function showBusinessPlanLoader(){
  const overlay = document.createElement("div");
  overlay.id = "identity-loader";
  overlay.innerHTML = `
    <div class="identity-center">
      <h2>📘 Construction du Business plan</h2>
      <div class="book-container">
        <button id="prevPage" class="book-nav-btn hidden">«</button>
        <div class="book-pages">
          <img id="leftPage" class="hidden">
          <img id="rightPage">
        </div>
        <button id="nextPage" class="book-nav-btn hidden">></button>
      </div>
      <button id="continueQuestBtn" class="hidden">Continuer la quête</button>
    </div>
  `;
  document.body.appendChild(overlay);

  const left = overlay.querySelector("#leftPage");
  const right = overlay.querySelector("#rightPage");
  const next = overlay.querySelector("#nextPage");
  const prev = overlay.querySelector("#prevPage");
  const cont = overlay.querySelector("#continueQuestBtn");

  const pages = [
    ["","images/Businessplancov.png"],
    ["images/Businessplan4.png","images/Businessplan1.png"],
    ["images/Businessplan4.png","images/Businessplan2.png"],
    ["images/Businessplan4.png","images/Businessplan3.png"]
  ];

  let step = 0;

  function update(){
    const [l,r] = pages[step];
    if(l){
      left.src = l;
      left.classList.remove("hidden");
      prev.classList.remove("hidden");
    }else{
      left.classList.add("hidden");
      prev.classList.add("hidden");
    }
    right.src = r;
    next.classList.toggle("hidden", step === pages.length-1);
    cont.classList.toggle("hidden", step !== pages.length-1);
  }

  next.onclick = ()=>{ step++; update(); };
  prev.onclick = ()=>{ step--; update(); };
  cont.onclick = ()=>{
    overlay.remove();
    showLoader(800, spawnPirate3);
  };

  update();
}

/* =====================================================
   🏴‍☠️ PIRATE 3 → DIALOGUES 3
===================================================== */
function spawnPirate3(){
  pirate3.classList.remove("hidden");
  pirate3.classList.add("glowStart");
  pirate3.style.pointerEvents = "auto";

  pirate3.onclick = ()=>{
    pirate3.classList.remove("glowStart");
    pirate3.style.pointerEvents = "none";
    showLoader(800, startFinalDialogues);
  };
}

/* =====================================================
   💬 DIALOGUES 3
===================================================== */
function startFinalDialogues(){
  playDialogues([
    { text:"Le marché est exigeant.", anchor: pirate3 },
    { text:"À toi de choisir ta stratégie commerciale.", anchor: pirate5 }
  ], () => showLoader(800, startMiniGame3));
}

/* =====================================================
   🎮 MINI-JEU 3 — STRATÉGIES
===================================================== */
function startMiniGame3(){
  game3.classList.remove("hidden");

  const text = document.getElementById("strategyText");
  const choices = document.getElementById("strategyChoices");
  const hint = document.getElementById("strategyHint");
  const hintBtn = document.getElementById("strategyHintBtn");

  let step = 0;

  const steps = [
    {
      text:`Les autres vendeurs proposent leurs pierres à <strong>300 PO</strong>.
Mais ils n’ont pas de pierres rouges. Vous en avez.<br><br>
Quel prix afficher ?`,
      hint:"Vous êtes en position de force grâce aux pierres rouges.",
      answers:[
        {label:"Augmenter le prix – 350 PO", ok:true},
        {label:"Prix identique – 300 PO", ok:false},
        {label:"Baisser le prix – 250 PO", ok:false}
      ]
    },
    {
      text:`Vous vendez désormais vos pierres dans des boîtes en bois solides.
Elles coûtent 20 PO à produire.`,
      hint:"Le coût des boîtes est déjà inclus.",
      answers:[
        {label:"Augmenter – 370 PO", ok:false},
        {label:"Prix identique – 350 PO", ok:true},
        {label:"Baisser – 330 PO", ok:false}
      ]
    },
    {
      text:`Dernier choix stratégique : vendre vite pour acheter un bateau.`,
      hint:"Objectif : vendre rapidement.",
      answers:[
        {label:"Augmenter – 400 PO", ok:false},
        {label:"Prix identique – 350 PO", ok:false},
        {label:"Baisser – 300 PO", ok:true}
      ],
      final:`Bonne stratégie ! Les pirates vendent vite pour acheter leur bateau.`
    }
  ];

  function render(){
    const s = steps[step];
    text.innerHTML = s.text;
    choices.innerHTML = "";
    hint.classList.add("hidden");
    hint.innerHTML = s.hint;

    s.answers.forEach(a=>{
      const b = document.createElement("button");
      b.textContent = a.label;
      b.onclick = ()=>{
        if(!a.ok){ shake(game3); return; }
        if(s.final){
          text.innerHTML = s.final;
          choices.innerHTML = "";
          hintBtn.classList.add("hidden");
          setTimeout(showCommerceWin,2000);
        }else{
          step++; render();
        }
      };
      choices.appendChild(b);
    });
  }

  hintBtn.onclick = ()=> hint.classList.remove("hidden");
  render();
}

/* =====================================================
   🏆 VICTOIRE
===================================================== */
function showCommerceWin(){
  showLoader(800, ()=>{
    const o = document.createElement("div");
    o.id = "communication-win";
    o.innerHTML = `
      <div class="win-box">
        <h2>🏴‍☠️ Bravo !</h2>
        <p>Tu as terminé la quête Commerce</p>
        <div class="gems-container"></div>
      </div>`;
    document.body.appendChild(o);
    launchGemsExplosion(o.querySelector(".gems-container"));
    setTimeout(()=> location.href="menu.html",4200);
  });
}

/* =====================================================
   💎 GEMS
===================================================== */
function launchGemsExplosion(c){
  const colors=["#ffd700","#00f2ff","#ff4fd8","#7cff00","#ff8c00"];
  for(let i=0;i<50;i++){
    const g=document.createElement("div");
    g.className="gem";
    g.style.background=colors[Math.floor(Math.random()*colors.length)];
    g.style.left="50%";
    g.style.top="50%";
    g.style.setProperty("--x",Math.cos(Math.random()*Math.PI*2)*300+"px");
    g.style.setProperty("--y",Math.sin(Math.random()*Math.PI*2)*300+"px");
    c.appendChild(g);
  }
}

});
