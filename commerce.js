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
   🎬 VIDÉO INTRO — CORRIGÉE
===================================================== */
fadeScreen.classList.remove("hidden");
fadeScreen.style.pointerEvents = "none";

questVideo.muted = true;

questVideo.addEventListener("canplay", () => {
  fadeScreen.classList.add("hidden");
  fadeScreen.style.pointerEvents = "none";
  questVideo.play().catch(()=>{});
});

toggleSound.onclick = () => {
  questVideo.muted = !questVideo.muted;
  toggleSound.textContent = questVideo.muted ? "🔇" : "🔊";
};

closeVideo.onclick = () => {
  questVideo.pause();
  endVideo();
};

questVideo.onended = endVideo;

function endVideo(){
  videoContainer.classList.add("hidden");
  showLoader(1000, showScene);
}

/* =====================================================
   🌑 LOADER SIMPLE
===================================================== */
function showLoader(duration = 1000, cb){
  fadeScreen.classList.remove("hidden");
  fadeScreen.style.pointerEvents = "none";
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

  requestAnimationFrame(() => pirate5.style.left = "900px");

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
    { text:"Bien joué, moussaillons. Lancer son activité demande du courage.", anchor:pirate5 },
    { text:"Merci capitaine ! Le marché est ouvert, on est prêts à vendre.", anchor:pirate2 },
    { text:"Avant de foncer, observez. Un bon marchand connaît son marché.", anchor:pirate5 },
    { text:"Qui sont vos clients ? Qu’achètent-ils ? À quel prix ?", anchor:pirate5 },
    { text:"Étudiez vos concurrents : leurs forces, leurs faiblesses, leurs prix.", anchor:pirate5 },
    { text:"Comprendre avant d’agir… voilà la clé.", anchor:pirate2 }
  ], () => showLoader(800, startMiniGame1));
}

/* =====================================================
   🌪️ SHAKE
===================================================== */
function shake(el){
  el.classList.add("screen-shake");
  setTimeout(()=>el.classList.remove("screen-shake"), 400);
}

/* =====================================================
   🎮 MINI-JEU 1 — ÉTUDE DE MARCHÉ
===================================================== */
function startMiniGame1(){
  game1.classList.remove("hidden");

  const quiz = [
    {
      q:"Pourquoi réaliser une étude de marché ?",
      ok:[1,2],
      a:[
        "Décorer sa boutique",
        "Comprendre les attentes des clients",
        "Identifier la concurrence"
      ]
    },
    {
      q:"Que faut-il analyser chez les concurrents ?",
      ok:[0,2],
      a:[
        "Leur réputation",
        "Leur lieu de vacances",
        "Leur positionnement prix"
      ]
    }
  ];

  let i = 0, found = [];

  function step(){
    q1.textContent = quiz[i].q;
    a1.innerHTML = "";
    found = [];

    quiz[i].a.forEach((t, idx)=>{
      const b = document.createElement("button");
      b.textContent = t;

      b.onclick = ()=>{
        if(!quiz[i].ok.includes(idx)){
          shake(game1);
          return;
        }

        b.classList.add("pressed");
        b.disabled = true;
        found.push(idx);

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
    { text:"Parfait. Avec ces informations, tu peux bâtir ton business plan.", anchor:pirate5 },
    { text:"Passons à la construction.", anchor:pirate2 }
  ], () => showLoader(800, startMiniGame2));
}

/* =====================================================
   🎮 MINI-JEU 2 — BUSINESS PLAN
===================================================== */
function startMiniGame2(){
  game2.classList.remove("hidden");
  visualChoices.innerHTML = "";

  const quiz = [
    { t:"Définir la cible", ok:true },
    { t:"Choisir la couleur du bateau", ok:false },
    { t:"Identifier le problème client", ok:true }
  ];

  let success = 0;

  quiz.forEach(q=>{
    const b = document.createElement("button");
    b.textContent = q.t;

    b.onclick = ()=>{
      if(!q.ok){
        shake(game2);
        return;
      }
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
   📘 LIVRE — BUSINESS PLAN
===================================================== */
function showBusinessPlanLoader(){
  const overlay = document.createElement("div");
  overlay.id = "identity-loader";
  overlay.innerHTML = `
    <div class="identity-center">
      <h2>📘 Construction du Business plan</h2>
      <div class="book-container">
        <div class="book-loading"><span>⏳</span></div>
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
  const loader = overlay.querySelector(".book-loading");

  const pages = [
    ["","images/Businessplancov.png"],
    ["images/Businessplan4.jpg","images/Businessplan1.jpg"],
    ["images/Businessplan4.jpg","images/Businessplan2.jpg"],
    ["images/Businessplan4.jpg","images/Businessplan3.jpg"]
  ];

  let step = 0;
  let loaded = 0;
  const all = pages.flat().filter(Boolean);

  all.forEach(src=>{
    const i = new Image();
    i.onload = i.onerror = ()=>{
      loaded++;
      if(loaded === all.length){
        loader.remove();
        next.classList.remove("hidden");
        update();
      }
    };
    i.src = src;
    if(i.complete) i.onload();
  });

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
}

/* =====================================================
   🏴‍☠️ PIRATE 3
===================================================== */
function spawnPirate3(){
  pirate3.classList.remove("hidden");
  pirate3.classList.add("glowStart");

  pirate3.onclick = ()=>{
    pirate3.classList.remove("glowStart");
    pirate3.style.pointerEvents = "none";
    startFinalDialogues();
  };
}

/* =====================================================
   💬 DIALOGUES FINAUX
===================================================== */
function startFinalDialogues(){
  playDialogues([
    { text:"Le marché est exigeant.", anchor:pirate3 },
    { text:"À toi de choisir ta stratégie commerciale.", anchor:pirate5 }
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
      text:"Les autres vendeurs vendent à 300 PO sans pierres rouges. Vous avez des pierres rouges en lot.",
      hint:"Vous êtes en position de force.",
      answers:[
        {l:"Augmenter – 350 PO",c:true},
        {l:"Identique – 300 PO",c:false},
        {l:"Baisser – 250 PO",c:false}
      ]
    },
    {
      text:"Vous ajoutez des boîtes en bois (20 PO).",
      hint:"Le coût est déjà intégré.",
      answers:[
        {l:"370 PO",c:false},
        {l:"350 PO",c:true},
        {l:"330 PO",c:false}
      ]
    },
    {
      text:"Objectif : vendre vite pour acheter un bateau.",
      hint:"Rapidité > image luxe.",
      answers:[
        {l:"400 PO",c:false},
        {l:"350 PO",c:false},
        {l:"300 PO",c:true}
      ],
      final:true
    }
  ];

  function render(){
    const s = steps[step];
    text.innerHTML = s.text;
    hint.textContent = s.hint;
    hint.classList.add("hidden");
    choices.innerHTML = "";

    s.answers.forEach(a=>{
      const b = document.createElement("button");
      b.textContent = a.l;
      b.onclick = ()=>{
        if(!a.c){
          shake(game3);
          return;
        }
        if(s.final){
          game3.classList.add("hidden");
          showCommerceWin();
        }else{
          step++;
          render();
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
  showLoader(1000, ()=>{
    const overlay = document.createElement("div");
    overlay.id = "communication-win";
    overlay.innerHTML = `
      <div class="win-box">
        <h2>🏴‍☠️ Bravo !</h2>
        <p>Tu as terminé la quête Commerce</p>
        <div class="gems-container"></div>
      </div>
    `;
    document.body.appendChild(overlay);

    sessionStorage.setItem("fromCommerce","true");
    sessionStorage.setItem("unlock_pirate3","true");

    setTimeout(()=>location.href="menu.html",4200);
  });
}

});
