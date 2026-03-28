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

if(fadeScreen){
  fadeScreen.classList.add("hidden");
}

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

const progressSteps = document.querySelectorAll(".progress-step");

/* =====================================================
   OUTILS
===================================================== */
function showLoader(duration = 1200, cb){
  if(!fadeScreen){
    cb && cb();
    return;
  }

  fadeScreen.classList.remove("hidden");

  setTimeout(() => {
    fadeScreen.classList.add("hidden");
    if(typeof cb === "function"){
      cb();
    }
  }, duration);
}

function shake(el){
  el.classList.add("screen-shake");
  setTimeout(()=>el.classList.remove("screen-shake"),400);
}

/* =====================================================
   🔒 ANTI RETOUR TOTAL (VERSION ROBUSTE)
===================================================== */

// Empêche retour navigateur classique
function lockNavigation(){

  // Empile un état fictif
  history.pushState(null, null, location.href);

  window.addEventListener("popstate", () => {
    // Re-pousse l'état → impossible de revenir
    history.pushState(null, null, location.href);
  });

}

// Active au démarrage
lockNavigation();


// Empêche swipe iOS + cache page
window.addEventListener("pageshow", function (event) {
  if (event.persisted) {
    location.reload();
  }
});

// Empêche refresh arrière Android
window.addEventListener("pagehide", function () {
  history.pushState(null, null, location.href);
});
   
/* =====================================================
   📊 PROGRESS BAR
===================================================== */

   const stepsOrder = [
  "dialogue1",
  "game1",
  "dialogue2",
  "game2",
  "book",
  "dialogue3",
  "game3"
];

function createProgressBar(){

  if(document.getElementById("progressBar")) return;

  const bar = document.createElement("div");
  bar.id = "progressBar";

  stepsOrder.forEach(step=>{
    const item = document.createElement("div");
    item.className = "progress-step";
    item.dataset.step = step;

    // ✅ gestion emojis
    if(step.includes("dialogue")){
      item.textContent = "💬";
    }
    else if(step === "book"){
      item.textContent = "📖"; // ← emoji livre (remplace ton caractère vide)
    }
    else{
      item.textContent = "🎮";
    }

    bar.appendChild(item);
  });

  document.body.appendChild(bar);
}

function updateProgressBar(stepIndex){

  const steps = document.querySelectorAll(".progress-step");
  if(!steps.length) return;

  stepIndex = Math.min(stepIndex, steps.length);

  steps.forEach((el, i)=>{
    if(i < stepIndex){
      el.classList.add("done");
      el.style.opacity = "1";
    }else{
      el.classList.remove("done");
      el.style.opacity = "0.4";
    }
  });
}

/* ✅ INIT */
createProgressBar();
updateProgressBar(0);

// 🔥 AJOUT ICI
resumeProgress();
   
/* =====================================================
   VIDÉO INTRO
===================================================== */

let videoEnded = false;

if (questVideo) {

  questVideo.muted = true;

  questVideo.addEventListener("canplay", () => {
    if (fadeScreen) {
      fadeScreen.classList.add("hidden");
    }

    // Sécurise autoplay (iOS safe)
    const playPromise = questVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  });

  questVideo.addEventListener("ended", endVideo);
}

if (toggleSound && questVideo) {
  toggleSound.addEventListener("click", () => {
    questVideo.muted = !questVideo.muted;
    toggleSound.textContent = questVideo.muted ? "🔇" : "🔊";
  });
}

if (closeVideo) {
  closeVideo.addEventListener("click", endVideo);
}

function endVideo() {

  if (videoEnded) return;
  videoEnded = true;

  if (questVideo) {
    questVideo.pause();
    questVideo.removeAttribute("src");
    questVideo.load();
  }

  if (videoContainer) {
    videoContainer.classList.add("hidden");
  }

  // 🔥 Affiche le loader pirate AVANT la scène
  showLoader(1200, () => {
    showScene();
  });
}

/* =====================================================
   SCÈNE INITIALE
===================================================== */
function showScene(){

  if(background){
    background.classList.remove("hidden");
  }

  if(pirate2){
    pirate2.classList.remove("hidden");
  }

  if(pirate5){
    pirate5.classList.remove("hidden");

    pirate5.classList.add("glowStart");

    // évite les doubles clics
    pirate5.onclick = null;

    pirate5.addEventListener("click", ()=>{

      pirate5.classList.remove("glowStart");
      pirate5.style.pointerEvents = "none";

      startDialogues1();

    }, { once:true });
  }

}

/* =====================================================
   DIALOGUES ENGINE
===================================================== */
let dialogues = [];
let index = 0;
let callback = null;
let dialogueLocked = false;

function playDialogues(list, cb){

  if(!bubbleContainer) return;

  dialogues = Array.isArray(list) ? list : [];
  index = 0;
  callback = typeof cb === "function" ? cb : null;

  if(skipBtn){
    skipBtn.classList.remove("hidden");
  }

  renderDialogue();
}

function renderDialogue(){

  if(!bubbleContainer) return;

  bubbleContainer.innerHTML = "";

  if(index >= dialogues.length){
    endDialogues();
    return;
  }

  const d = dialogues[index];
  if(!d || !d.text){
    index++;
    renderDialogue();
    return;
  }

  const bubble = document.createElement("div");
  bubble.className = "dialogue-bubble";
  bubble.innerHTML = d.text;

  // Positionnement sécurisé
  if(d.anchor && d.anchor.getBoundingClientRect){

    const rect = d.anchor.getBoundingClientRect();

    bubble.style.left = rect.left + rect.width / 2 + "px";
    bubble.style.top = rect.top - 120 + "px";
    bubble.style.transform = "translateX(-50%)";

  }else{
    // fallback centre écran
    bubble.style.left = "50%";
    bubble.style.top = "30%";
    bubble.style.transform = "translate(-50%, -50%)";
  }

  bubble.addEventListener("click", () => {

    if(dialogueLocked) return;
    dialogueLocked = true;

    index++;

    requestAnimationFrame(() => {
      dialogueLocked = false;
      renderDialogue();
    });

  });

  bubbleContainer.appendChild(bubble);
}

function endDialogues(){

  if(bubbleContainer){
    bubbleContainer.innerHTML = "";
  }

  if(skipBtn){
    skipBtn.classList.add("hidden");
  }

  const cb = callback;
  callback = null;

if(cb){
  showLoader(1000, cb);
}
}

if(skipBtn){
  skipBtn.addEventListener("click", endDialogues);
}

/* =====================================================
   DIALOGUES 1
===================================================== */
function startDialogues1(){

  updateProgressBar(1);

  playDialogues([
    { text:"Avant de vendre quoi que ce soit, il faut comprendre ton <strong>marché</strong>.", anchor:pirate5 },
    { text:"Une <strong>étude de marché</strong> te permet de savoir à qui tu t’adresses vraiment.", anchor:pirate5 },
    { text:"Qui sont tes <strong>clients</strong> ? Quels sont leurs <strong>besoins</strong>, leurs <strong>habitudes</strong>, leurs <strong>problèmes</strong> ?", anchor:pirate5 },
    { text:"Tu dois aussi analyser tes <strong>concurrents</strong> : leurs <strong>prix</strong>, leurs <strong>offres</strong>, leurs <strong>forces</strong>.", anchor:pirate5 },
    { text:"Sans ça, tu avances à l’aveugle… et tu risques de te tromper de <strong>stratégie</strong>.", anchor:pirate5 },
    { text:"Une bonne <strong>étude de marché</strong>, c’est ce qui transforme une <strong>idée</strong> en <strong>projet rentable</strong>.", anchor:pirate5 }
  ], ()=>{
  setStepDone("dialogue1");
  startMiniGame1();
});

}

/* =====================================================
   MINI-JEU 1
===================================================== */
function startMiniGame1(){

  showLoader(900, ()=>{

    if(!game1 || !q1 || !a1){
      console.error("MG1 éléments manquants");
      return;
    }

    game1.classList.remove("hidden");

    const questions = [
      {
        q:"Pourquoi réaliser une étude de marché ?",
        answers:[
          {t:"Décorer la boutique",ok:false},
          {t:"Comprendre les clients",ok:true},
          {t:"Copier les concurrents",ok:false}
        ]
      },
      {
        q:"Que permet d’identifier une étude de marché ?",
        answers:[
          {t:"Les besoins des clients",ok:true},
          {t:"La couleur du logo",ok:false},
          {t:"Le nom de l’entreprise",ok:false}
        ]
      },
      {
        q:"Pourquoi analyser les concurrents ?",
        answers:[
          {t:"Pour copier sans réfléchir",ok:false},
          {t:"Pour se différencier et s’adapter",ok:true},
          {t:"Pour éviter de vendre",ok:false}
        ]
      }
    ];

    let currentQuestion = 0;

    function loadQuestion(){

      const data = questions[currentQuestion];

      q1.textContent = data.q;
      a1.innerHTML = "";

      data.answers.forEach(ans => {

        const b = document.createElement("button");
        b.textContent = ans.t;

        b.onclick = () => {

          if(!ans.ok){
            shake(game1);
            return;
          }

          b.classList.add("correct-locked");
          b.disabled = true;

          setTimeout(()=>{

            currentQuestion++;

            if(currentQuestion < questions.length){
              loadQuestion(); // question suivante
            }else{

              setStepDone("game1");
              updateProgressBar(2);
              game1.classList.add("hidden");
              startDialogues2();

            }

          },600);
        };

        a1.appendChild(b);

      });

    }

    loadQuestion();

  });
}

/* =====================================================
   DIALOGUES 2
===================================================== */
function startDialogues2(){

  playDialogues([
    { text:"Parfait. Maintenant, il faut <strong>structurer</strong> tout ça.", anchor:pirate5 },
    { text:"Un bon <strong>business plan</strong> évite bien des <strong>naufrages</strong>.", anchor:pirate5 },
    { text:"Il te permet de définir ton <strong>offre</strong>, ton <strong>positionnement</strong> et tes <strong>objectifs</strong>.", anchor:pirate5 },
    { text:"Tu dois aussi prévoir tes <strong>ressources</strong>, tes <strong>coûts</strong> et tes <strong>revenus</strong>.", anchor:pirate5 },
    { text:"À partir de là, tu construis ta <strong>stratégie commerciale</strong>.", anchor:pirate5 },
    { text:"Choix des <strong>prix</strong>, des <strong>canaux de vente</strong>, et des <strong>actions marketing</strong>.", anchor:pirate5 },
    { text:"Un business plan solide, c’est ta <strong>boussole</strong> pour développer ton projet.", anchor:pirate5 }
  ], startMiniGame2);

   setStepDone("dialogue2");
  updateProgressBar(3);

}

/* =====================================================
   MINI-JEU 2
===================================================== */
function startMiniGame2(){

  if(!game2 || !visualChoices){
    console.error("MG2 éléments manquants");
    return;
  }

  showLoader(900, ()=>{
    game2.classList.remove("hidden");

   const questions = [

  {
    question: "Étude du produit, qu’est-ce que je dois analyser en premier ?",
    answers: [
      { t: "Les besoins du client", ok: true },
      { t: "La couleur du logo", ok: false },
      { t: "La valeur apportée par le produit", ok: true },
      { t: "Le nombre de likes Instagram", ok: false }
    ]
  },

  {
    question: "Étude du marché, est-ce que je dois analyser seulement les concurrents ?",
    answers: [
      { t: "Oui", ok: false },
      { t: "Non, il faut aussi analyser les clients et les tendances", ok: true }
    ]
  },

  {
    question: "Construction du business plan, que dois-tu inclure ?",
    answers: [
      { t: "Définir la cible", ok: true },
      { t: "Choisir la couleur du bateau", ok: false },
      { t: "Identifier le problème client", ok: true },
      { t: "Prévoir les coûts et revenus", ok: true }
    ]
  },

  {
    question: "Stratégie commerciale, quel est le bon objectif ?",
    answers: [
      { t: "Vendre au hasard", ok: false },
      { t: "Adapter son offre au marché", ok: true },
      { t: "Fixer des prix cohérents", ok: true },
      { t: "Ignorer les concurrents", ok: false }
    ]
  }

];

  let current = 0;

  function renderQuestion(){

    visualChoices.innerHTML = "";

    const qBox = document.createElement("div");
    qBox.className = "gameQuestion";
    qBox.textContent = questions[current].question;

    visualChoices.appendChild(qBox);

    let success = 0;
    const correctCount = questions[current].answers.filter(a => a.ok).length;

    questions[current].answers.forEach(q => {

      const b = document.createElement("button");
      b.textContent = q.t;

      b.onclick = ()=>{

        if(!q.ok){
          shake(game2);
          return;
        }

        if(b.classList.contains("correct-locked")) return;

        b.classList.add("correct-locked");
        b.disabled = true;
        success++;

        if(success === correctCount){

          setTimeout(()=>{
            current++;

            if(current < questions.length){
              renderQuestion();
            }else{
game2.classList.add("hidden");

setTimeout(()=>{

   setStepDone("game2");
   updateProgressBar(4);
   
  showBusinessPlanLoader();
},600);
            }

          },800);
        }
      };

      visualChoices.appendChild(b);
    });
  }

  renderQuestion();
  }); 
}
/* =====================================================
   📘 LIVRE
===================================================== */
function showBusinessPlanLoader(){

     setStepDone("book");
      updateProgressBar(5);

  const overlay = document.createElement("div");
  overlay.id = "identity-loader";

  overlay.innerHTML = `
  <div class="identity-center">

    <div class="book-wrapper">

      <h2 class="bp-title hidden" id="bpTitle">
        Bravo 🎉 Tu as créé ton business plan
      </h2>

      <div class="book-container">

        <div class="book-loading" id="bookLoading">⏳</div>

        <div class="book-pages hidden" id="bookPages">

          <div class="left-wrapper">
            <img id="leftPage" class="hidden">
          </div>

          <div class="right-wrapper">
            <img id="rightPage">
            <button id="zoomPageBtn" class="zoom-btn hidden">🔎</button>
          </div>

        </div>

      </div>

    </div>

    <button id="continueQuestBtn" class="hidden">
      Continuer la quête
    </button>

  </div>
`;

  document.body.appendChild(overlay);

  const left = overlay.querySelector("#leftPage");
  const right = overlay.querySelector("#rightPage");
  const cont = overlay.querySelector("#continueQuestBtn");
  const loader = overlay.querySelector("#bookLoading");
  const pagesWrap = overlay.querySelector("#bookPages");
  const title = overlay.querySelector("#bpTitle");
  const zoomBtn = overlay.querySelector("#zoomPageBtn");

  const pages = [
    ["","images/Businessplancov.png"],
    ["images/Businessplan4.jpg","images/Businessplan1.jpg"],
    ["images/Businessplan4.jpg","images/Businessplan2.jpg"],
    ["images/Businessplan4.jpg","images/Businessplan3.jpg"]
  ];

  const allImages = pages.flat().filter(Boolean);
  let loaded = 0;
  let step = 0;

  /* ===============================
     PRELOAD IMAGES
  =============================== */
  if(allImages.length === 0){
    finishLoading();
  }else{
    let finished = false;

    allImages.forEach(src=>{
      const img = new Image();

      img.onload = img.onerror = ()=>{
        if(finished) return;
        loaded++;

        if(loaded >= allImages.length){
          finished = true;
          finishLoading();
        }
      };

      img.src = src;
    });
  }

  function finishLoading(){
    loader.classList.add("hidden");
    pagesWrap.classList.remove("hidden");
    zoomBtn.classList.remove("hidden");
    title.classList.remove("hidden");
    title.classList.add("title-appear");
    update();
  }

  /* ===============================
     UPDATE PAGES
  =============================== */
  function update(){

    const [l, r] = pages[step];

    if(l){
      left.src = l;
      left.classList.remove("hidden");
    }else{
      left.classList.add("hidden");
    }

    right.src = r;

    cont.classList.toggle("hidden", step !== pages.length - 1);
  }

  /* ===============================
     PAGE TURN
  =============================== */
  function turnPage(direction){

    if(direction === "right" && step >= pages.length - 1) return;
    if(direction === "left" && step <= 0) return;

    const pageToAnimate = direction === "right" ? right : left;
    const animClass = direction === "right" ? "turn-right" : "turn-left";

    pageToAnimate.classList.remove("turn-right","turn-left");
    void pageToAnimate.offsetWidth;
    pageToAnimate.classList.add(animClass);

    pageToAnimate.addEventListener("animationend", () => {

      step += (direction === "right") ? 1 : -1;
      update();
      pageToAnimate.classList.remove(animClass);

    }, { once:true });
  }

  /* ===============================
     CLIC DIRECT SUR LES PAGES
  =============================== */
  right.style.cursor = "pointer";
  left.style.cursor = "pointer";

  right.addEventListener("click", ()=> turnPage("right"));
  left.addEventListener("click", ()=> turnPage("left"));

  /* ===============================
     ZOOM PAGE DROITE
  =============================== */
  zoomBtn.onclick = ()=>{

    const currentSrc = pages[step][1];
    if(!currentSrc) return;

    const zoom = document.createElement("div");
    zoom.className = "page-zoom";

    const loaderZoom = document.createElement("div");
    loaderZoom.className = "book-loading";
    loaderZoom.textContent = "⏳";

    const img = document.createElement("img");
    img.style.display = "none";

    zoom.appendChild(loaderZoom);
    zoom.appendChild(img);
    document.body.appendChild(zoom);

    img.onload = ()=>{
      loaderZoom.remove();
      img.style.display = "block";
    };

    img.onerror = ()=>{
      loaderZoom.textContent = "Erreur de chargement";
    };

    img.src = currentSrc;

    zoom.onclick = (e)=>{
      if(e.target === zoom){
        zoom.remove();
      }
    };
  };

  /* ===============================
     CONTINUER
  =============================== */
cont.onclick = ()=>{

  overlay.remove();

  playDialogues([
  { text:"Ton <strong>plan</strong> est solide.", anchor:pirate5 },
  { text:"Il est temps d'affronter le <strong>marché</strong>.", anchor:pirate5 },
  { text:"Pour vendre tes pierres, tu dois adapter ta <strong>stratégie commerciale</strong>.", anchor:pirate5 },
  { text:"Choisis le bon <strong>prix</strong> : ni trop élevé, ni trop bas.", anchor:pirate5 },
  { text:"Travaille ton <strong>argumentaire</strong> : mets en avant la <strong>valeur</strong> et les <strong>bénéfices</strong>.", anchor:pirate5 },
  { text:"Sélectionne les bons <strong>canaux de vente</strong> : marché, en ligne ou négociation directe.", anchor:pirate5 },
  { text:"Observe les <strong>réactions des clients</strong> et ajuste ta stratégie.", anchor:pirate5 },
  { text:"Un bon vendeur ne vend pas juste un produit… il vend une <strong>solution</strong>.", anchor:pirate5 }
], startMiniGame3);

     setStepDone("dialogue3");
      updateProgressBar(6);
   
   };
   }
   
/* =====================================================
   MINI-JEU 3 — STRATÉGIES COMMERCIALES
===================================================== */
function startMiniGame3(){

   if(!game3) return;

game3.classList.remove("hidden");

const text = document.getElementById("strategyText");
const choices = document.getElementById("strategyChoices");
const hintBox = document.getElementById("strategyHint");
const hintBtn = document.getElementById("strategyHintBtn");

// 🔥 FIX CRASH
if(!text || !choices || !hintBox || !hintBtn){
  console.error("MG3 éléments manquants");
  return;
}

  let currentStep = 0;

  const steps = [

  {
    text:`Les autres vendeurs vendent à <strong>300 PO</strong>, sans pierres rouges.
    Vous en avez. Quel prix afficher ?`,
    hint:"💡 Avantage concurrentiel = tu peux augmenter la valeur.",
    answers:[
      { label:"350 PO", correct:true },
      { label:"300 PO", correct:false },
      { label:"250 PO", correct:false }
    ]
  },

  {
    text:`Vous ajoutez des boîtes en bois (coût : <strong>20 PO</strong>).
    Comment ajuster le prix ?`,
    hint:"💡 Tu peux répercuter le coût si la valeur perçue augmente.",
    answers:[
      { label:"370 PO", correct:true },
      { label:"350 PO", correct:false },
      { label:"320 PO", correct:false }
    ]
  },

  {
    text:`Objectif : acheter un bateau rapidement.
    Quelle stratégie adopter ?`,
    hint:"💡 Le volume de vente > à la marge financière dans une logique rapide.",
    answers:[
      { label:"400 PO", correct:false },
      { label:"350 PO", correct:false },
      { label:"300 PO", correct:true }
    ]
  },

  {
    text:`Les ventes ralentissent. Que faire ?`,
    hint:"💡 Adapter sa stratégie est essentiel.",
    answers:[
      { label:"Baisser légèrement le prix", correct:true },
      { label:"Ne rien changer", correct:false },
      { label:"Augmenter fortement le prix", correct:false }
    ],
    finalText:`<strong>Excellente stratégie.</strong><br>
    Un bon vendeur <strong>s’adapte</strong> en permanence :
    prix, offre et approche évoluent selon le <strong>marché</strong>.`
  }

];

  function render(){

    if(currentStep >= steps.length) return;

const s = steps[currentStep];

    text.innerHTML = s.text;

    choices.innerHTML = "";
    hintBox.classList.add("hidden");
    hintBox.innerHTML = s.hint;

    s.answers.forEach(a=>{

      const b = document.createElement("button");
      b.textContent = a.label;

      b.onclick = ()=>{

        if(!a.correct){
          shake(game3);
          return;
        }

        b.classList.add("flash-success");

setTimeout(()=>{
   
  b.classList.remove("flash-success");
  b.classList.add("correct-locked");
},400);
        b.disabled = true;

        // ===== DERNIÈRE ÉTAPE =====
        if(s.finalText){

           setStepDone("game3");
           updateProgressBar(7);

          text.innerHTML = s.finalText;
          choices.innerHTML = "";
          hintBtn.classList.add("hidden");

          setTimeout(()=>{

            if(!game3) return;

game3.classList.add("hidden"); // ✅

            showLoader(1200, ()=>{
              showCommerceWin();
            });

          }, 3200);

        }
         else{
  currentStep++;   // ✅ AJOUT
  if(currentStep < steps.length){
    render();
  }
}
      };

      choices.appendChild(b);
    });
  }

  if(hintBtn){
  hintBtn.onclick = ()=>{
    hintBox.classList.remove("hidden");
  };
}

  render();
}
   
/* =====================================================
   🏆 VICTOIRE COMMUNICATION
===================================================== */
function showCommerceWin(){

  // 🔥 Supprime loader pirate s'il est visible
  if(fadeScreen){
    fadeScreen.classList.add("hidden");
  }

  const overlay = document.createElement("div");
  overlay.id="communication-win";
  overlay.innerHTML=`
    <div class="win-box">
      <h2>🏴‍☠️ Bravo !</h2>
      <p>Tu as gagné la quête Commerce !</p>
      <div class="gems-container"></div>
    </div>`;

  document.body.appendChild(overlay);

  const gemsContainer = overlay.querySelector(".gems-container");

  requestAnimationFrame(()=>{
    launchGemsExplosion(gemsContainer);
  });

  /* 🔓 DÉBLOCAGES */
  sessionStorage.setItem("unlock_pirate3","true");
  sessionStorage.setItem("unlock_password_page","true");
  sessionStorage.setItem("fromCommerce","true");

  /* ⏳ Redirection après explosion */
  setTimeout(()=>{
    window.location.href="menu.html";
  },2500);
}

/* =====================================================
   💎 GEMS
===================================================== */
function launchGemsExplosion(container){
  const colors=["#ffd700","#00f2ff","#ff4fd8","#7cff00","#ff8c00"];
  for(let i=0;i<50;i++){
    const g=document.createElement("div");
    g.className="gem";
    const size=Math.random()*10+8;
    g.style.width=size+"px";
    g.style.height=size+"px";
    g.style.background=colors[Math.floor(Math.random()*colors.length)];
    g.style.left="50%";
    g.style.top="50%";

    const angle=Math.random()*Math.PI*2;
    const dist=Math.random()*260+80;
    g.style.setProperty("--x",Math.cos(angle)*dist+"px");
    g.style.setProperty("--y",Math.sin(angle)*dist+"px");

    container.appendChild(g);
  }
}

   /* =====================================================
   💾 PROGRESSION (ANTI-RETOUR)
===================================================== */

const PROGRESS_KEY = "communication_progress_v1";

function getProgress(){
  return JSON.parse(sessionStorage.getItem(PROGRESS_KEY) || "{}");
}

function setStepDone(step){
  const progress = getProgress();
  progress[step] = true;
  sessionStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));

  updateProgressBarFromProgress();
}

function isStepDone(step){
  return !!getProgress()[step];
}

function getNextStep(){
  const progress = getProgress();
  return stepsOrder.find(step => !progress[step]);
}

/* 🔥 Synchronisation avec ta progress bar actuelle */
function updateProgressBarFromProgress(){
  const progress = getProgress();
  const index = stepsOrder.findIndex(step => !progress[step]);

  if(index === -1){
    updateProgressBar(stepsOrder.length);
  }else{
    updateProgressBar(index);
  }
}

function resumeProgress(){

  const next = getNextStep();

  // Si aucune progression → début normal (vidéo)
  if(!next){
    showScene();
    return;
  }

  // 🔥 Reprise intelligente selon l'étape
  switch(next){

    case "dialogue1":
      showScene();
      break;

    case "game1":
      showScene();
      startMiniGame1();
      break;

    case "dialogue2":
      showScene();
      startDialogues2();
      break;

    case "game2":
      showScene();
      startMiniGame2();
      break;

    case "book":
      showScene();
      showBusinessPlanLoader();
      break;

    case "dialogue3":
      showScene();
      playDialogues([
        { text:"Ton <strong>plan</strong> est solide.", anchor:pirate5 },
        { text:"Il est temps d'affronter le <strong>marché</strong>.", anchor:pirate5 }
      ], startMiniGame3);
      break;

    case "game3":
      showScene();
      startMiniGame3();
      break;

    default:
      showScene();
  }

  updateProgressBarFromProgress();
}
   
}); 
