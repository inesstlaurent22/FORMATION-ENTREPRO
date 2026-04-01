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

/* 🎬 VIDÉO */
const videoContainer = document.getElementById("videoContainer");
const questVideo = document.getElementById("questVideo");
const toggleSound = document.getElementById("toggleSound");
const closeVideo = document.getElementById("closeVideo");

/* sécurité loader */
if(fadeScreen){
  fadeScreen.classList.add("hidden");
  fadeScreen.style.pointerEvents = "none";
}

/* =====================================================
   🎬 VIDÉO INTRO — VERSION STABLE CLEAN
===================================================== */

let videoClosed = false;
let safetyTimeout = null;
let startCheckTimeout = null;

/* =========================
   FERMETURE
========================= */
function closeIntro(){

  if(videoClosed) return;
  videoClosed = true;

  if(safetyTimeout){
    clearTimeout(safetyTimeout);
  }

  if(questVideo){
    try{
      questVideo.pause();
      questVideo.currentTime = 0;
    }catch(e){}
  }

  if(videoContainer){
    videoContainer.style.display = "none";
  }

  // 🔥 ICI : afficher loader AVANT la scène
  showLoader(600, () => {
    showScene();
  });
}

/* =========================
   INIT VIDEO
========================= */
if(questVideo){

  questVideo.muted = true;
  questVideo.playsInline = true;
  questVideo.setAttribute("playsinline","");

  /* 🔥 IMPORTANT : ne bloque PAS les clics */
  questVideo.style.pointerEvents = "none";

  /* AUTOPLAY */
  const playPromise = questVideo.play();
  if(playPromise && playPromise.catch){
    playPromise.catch(()=>{});
  }

  /* FIN */
  questVideo.addEventListener("ended", closeIntro);

  /* FALLBACK TEMPS */
  const onTimeUpdate = () => {

    if(videoClosed) return;

    if(
      questVideo.duration &&
      questVideo.currentTime >= questVideo.duration - 1
    ){
      questVideo.removeEventListener("timeupdate", onTimeUpdate);
      closeIntro();
    }
  };

  questVideo.addEventListener("timeupdate", onTimeUpdate);

  /* SI VIDÉO BLOQUÉE */
  startCheckTimeout = setTimeout(()=>{
    if(!videoClosed && questVideo.currentTime === 0){
      closeIntro();
    }
  }, 2000);

  /* SÉCURITÉ */
  safetyTimeout = setTimeout(()=>{
    if(!videoClosed){
      closeIntro();
    }
  }, 8000);
}

/* =========================
   BOUTON SKIP — FIX TOTAL
========================= */
if(closeVideo){

  closeVideo.style.pointerEvents = "auto"; // 🔥 sécurité

  closeVideo.addEventListener("click", (e)=>{
    e.preventDefault();
    e.stopPropagation();
    closeIntro();
  }, { passive:false });

}

/* =========================
   SON
========================= */
if(toggleSound && questVideo){

  toggleSound.style.pointerEvents = "auto";

  toggleSound.addEventListener("click",(e)=>{
    e.preventDefault();
    e.stopPropagation();

    questVideo.muted = !questVideo.muted;
    toggleSound.textContent = questVideo.muted ? "🔇" : "🔊";
  });

}
   
/* =====================================================
   🌑 LOADER
===================================================== */
function showLoader(duration = 800, cb){

  if(!fadeScreen){
    if(typeof cb === "function") cb();
    return;
  }

  fadeScreen.classList.add("active");

  setTimeout(()=>{
    fadeScreen.classList.remove("active");

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
   🔒 ANTI RETOUR UTILISATEUR
===================================================== */

function lockNavigation(){

  // 1. Empêche bouton "retour"
  history.pushState(null, "", location.href);

  window.addEventListener("popstate", function () {
    history.pushState(null, "", location.href);
  });

  // 2. Bloque swipe retour (iOS / mobile)
  let startX = 0;

  document.addEventListener("touchstart", (e)=>{
    startX = e.touches[0].clientX;
  }, { passive:true });

  document.addEventListener("touchmove", (e)=>{
    const currentX = e.touches[0].clientX;

    // swipe depuis le bord gauche
    if(startX < 50 && currentX > startX){
      e.preventDefault();
    }

  }, { passive:false });

  // 3. Sécurité : re-push régulièrement (empêche hacks historiques)
  setInterval(()=>{
    history.pushState(null, "", location.href);
  }, 1000);
}

// 🔥 ACTIVE LE VERROU
lockNavigation();

/* =====================================================
   📊 PROGRESSION
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

function getProgress(){
  return JSON.parse(sessionStorage.getItem("commerce_progress") || "{}");
}

function setProgress(step){
  const progress = getProgress();
  progress[step] = true;
  sessionStorage.setItem("commerce_progress", JSON.stringify(progress));
  updateProgressBar();
}

function createProgressBar(){

  const bar = document.createElement("div");
  bar.id = "progressBar";

  stepsOrder.forEach(step=>{
    const item = document.createElement("div");
    item.className = "progress-step";
    item.dataset.step = step;

    if(step === "book"){
      item.textContent = "📖";
    }else{
      item.textContent = step.includes("dialogue") ? "💬" : "🎮";
    }

    bar.appendChild(item);
  });

  document.body.appendChild(bar);
  updateProgressBar();
}

function updateProgressBar(){

  const progress = getProgress();
  const steps = document.querySelectorAll(".progress-step");

  if(!steps.length) return;

  steps.forEach(el=>{
    const step = el.dataset.step;

    progress[step]
      ? el.classList.add("done")
      : el.classList.remove("done");
  });
}
   
/* =====================================================
   SCÈNE INITIALE
===================================================== */
function showScene(){

  console.log("SHOW SCENE");

  if(background) background.classList.remove("hidden");
  if(pirate2) pirate2.classList.remove("hidden");
  if(pirate5) pirate5.classList.remove("hidden");

  if(pirate5){
    pirate5.classList.add("glowStart");

    pirate5.onclick = ()=>{
      pirate5.classList.remove("glowStart");
      pirate5.style.pointerEvents = "none";
      startDialogues1();
    };
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
  bubble.innerHTML = sanitizeHTML(d.text);

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

function sanitizeHTML(str){
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML
    .replace(/&lt;strong&gt;/g,"<strong>")
    .replace(/&lt;\/strong&gt;/g,"</strong>");
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
  showLoader(400, cb);
}
}

if(skipBtn){
  skipBtn.addEventListener("click", endDialogues);
}

/* =====================================================
   DIALOGUES 1
===================================================== */
function startDialogues1(){
  setProgress("dialogue1");
  playDialogues([
  { text:"Avant de lancer ton <strong>activité</strong>, il faut comprendre ton <strong>marché</strong>.", anchor:pirate5 },
  { text:"Une <strong>étude de marché</strong>, c’est comme une <strong>enquête</strong> pour savoir à qui tu vas vendre.", anchor:pirate5 },
  { text:"Elle t’aide à découvrir ce que les <strong>clients</strong> aiment et ce dont ils ont vraiment <strong>besoin</strong>.", anchor:pirate5 },
  { text:"Comme ça, tu évites de créer quelque chose que <strong>personne ne veut</strong>.", anchor:pirate5 },
  { text:"Tu peux aussi observer tes <strong>concurrents</strong> et voir ce qu’ils font déjà.", anchor:pirate5 },
  { text:"Et surtout, tu trouves des idées pour faire <strong>mieux</strong> ou <strong>différent</strong>.", anchor:pirate5 },
  { text:"Une bonne étude de marché te permet aussi de fixer le <strong>bon prix</strong>.", anchor:pirate5 },
  { text:"Ni trop <strong>cher</strong>, ni trop <strong>bas</strong>, pour que ton activité fonctionne.", anchor:pirate5 },
  { text:"En résumé, l’étude de marché t’aide à prendre les <strong>bonnes décisions</strong>.", anchor:pirate5 },
  { text:"C’est ce qui transforme une <strong>idée</strong> en vrai <strong>projet solide</strong>.", anchor:pirate5 }
], startMiniGame1);
}

/* =====================================================
   MINI-JEU 1
===================================================== */
function startMiniGame1(){

  if(!game1 || !q1 || !a1) return;

  showLoader(800, ()=>{

    game1.classList.remove("hidden");

    const questions = [
      {
        question:"Pourquoi réaliser une étude de marché ?",
        answers:[
          {t:"Comprendre les clients",ok:true},
          {t:"Choisir une couleur de logo",ok:false},
          {t:"Décorer la boutique",ok:false}
        ]
      },
      {
        question:"Pourquoi analyser les concurrents ?",
        answers:[
          {t:"Analyser les concurrents",ok:true},
          {t:"Copier exactement les concurrents",ok:false},
          {t:"Ignorer les autres entreprises",ok:false}
        ]
      },
      {
        question:"Pourquoi fixer un prix ?",
        answers:[
          {t:"Fixer le bon prix",ok:true},
          {t:"Mettre un prix au hasard",ok:false},
          {t:"Regarder combien les clients peuvent payer",ok:true}
        ]
      },
      {
        question:"Pourquoi tester son idée ?",
        answers:[
          {t:"Savoir si ton idée peut marcher",ok:true},
          {t:"Lancer sans réfléchir",ok:false},
          {t:"Comprendre les besoins du marché",ok:true}
        ]
      }
    ];

    let current = 0;
    let locked = false;

    function render(){

      locked = false;

      const q = questions[current];
      if(!q) return;

      q1.textContent = q.question;
      a1.innerHTML = "";

      let success = 0;
      const total = q.answers.filter(a => a.ok).length;

      q.answers.forEach(ans => {

        const b = document.createElement("button");
        b.textContent = ans.t;

        b.onclick = ()=>{

          if(locked) return;

          if(!ans.ok){
            shake(game1);
            return;
          }

          if(b.classList.contains("correct-locked")) return;

          b.classList.add("correct-locked");
          b.disabled = true;

          success++;

          if(success === total){

            locked = true;

            setTimeout(()=>{

              current++;

              if(current < questions.length){
                render();
              }else{

                // ✅ progression (optionnel)
                if(typeof setProgress === "function"){
                  setProgress("game1");
                }

                game1.classList.add("hidden");
                startDialogues2();
              }

            },500);
          }
        };

        a1.appendChild(b);
      });
    }

    render();
  });
}
   
/* =====================================================
   DIALOGUES 2
===================================================== */
function startDialogues2(){
  setProgress("dialogue2");
  playDialogues([
  { text:"Parfait. Maintenant, il faut <strong>structurer</strong> tout ça.", anchor:pirate5 },
  { text:"Un <strong>business plan</strong>, c’est le plan de ton projet.", anchor:pirate5 },
  { text:"Il explique ton <strong>idée</strong>, tes <strong>objectifs</strong> et comment tu vas réussir.", anchor:pirate5 },
  { text:"Tu y décris aussi tes <strong>clients</strong> et ton <strong>marché</strong>.", anchor:pirate5 },
  { text:"Et tu montres comment tu vas <strong>gagner de l’argent</strong>.", anchor:pirate5 },
  { text:"Il t’aide à organiser tes <strong>actions</strong> étape par étape.", anchor:pirate5 },
  { text:"C’est aussi utile pour convaincre des <strong>partenaires</strong> ou des <strong>investisseurs</strong>.", anchor:pirate5 },
  { text:"Avec un bon business plan, tu sais où tu vas.", anchor:pirate5 },
  { text:"Et tu évites les <strong>erreurs</strong> dès le départ.", anchor:pirate5 },
  { text:"C’est ton <strong>guide</strong> pour transformer ton idée en <strong>projet réussi</strong>.", anchor:pirate5 }
], startMiniGame2);
}

/* =====================================================
   MINI-JEU 2
===================================================== */
function startMiniGame2(){

  if(!game2 || !visualChoices) return;

  showLoader(400, ()=>{

    game2.classList.remove("hidden");

    const questions = [
      {
        question: "À quoi sert un business plan ?",
        answers: [
          { t: "Organiser son projet", ok: true },
          { t: "Décorer son site internet", ok: false },
          { t: "Expliquer son idée", ok: true },
          { t: "Acheter du matériel au hasard", ok: false }
        ]
      },
      {
        question: "Que doit contenir un business plan ?",
        answers: [
          { t: "Les clients et le marché", ok: true },
          { t: "Les objectifs du projet", ok: true },
          { t: "La couleur du logo", ok: false },
          { t: "Comment gagner de l’argent", ok: true }
        ]
      },
      {
        question: "Pourquoi faire un business plan ?",
        answers: [
          { t: "Éviter les erreurs", ok: true },
          { t: "Convaincre des partenaires", ok: true },
          { t: "Aller plus vite sans réfléchir", ok: false },
          { t: "Avoir un guide pour avancer", ok: true }
        ]
      },
      {
        question: "Un business plan permet de…",
        answers: [
          { t: "Savoir où on va", ok: true },
          { t: "Suivre des étapes", ok: true },
          { t: "Faire comme les autres sans réfléchir", ok: false },
          { t: "Transformer une idée en projet", ok: true }
        ]
      }
    ];

    let current = 0;
    let locked = false;

    function renderQuestion(){

      locked = false;

      const q = questions[current];
      if(!q) return;

      visualChoices.innerHTML = "";

      const qBox = document.createElement("div");
      qBox.className = "gameQuestion";
      qBox.textContent = q.question;

      visualChoices.appendChild(qBox);

      let success = 0;
      const correctCount = q.answers.filter(a => a.ok).length;

      q.answers.forEach(ans => {

        const b = document.createElement("button");
        b.textContent = ans.t;

        b.onclick = ()=>{

          if(locked) return;

          if(!ans.ok){
            shake(game2);
            return;
          }

          if(b.classList.contains("correct-locked")) return;

          b.classList.add("correct-locked");
          b.disabled = true;

          success++;

          if(success === correctCount){

            locked = true;

            setTimeout(()=>{
              current++;

              if(current < questions.length){
                renderQuestion();
              }else{

                // ✅ progression
                if(typeof setProgress === "function"){
                  setProgress("game2");
                }

                game2.classList.add("hidden");

                setTimeout(()=>{
                  showBusinessPlanLoader();
                },400);
              }

            },400);
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

  if(!left || !right || !cont || !loader || !pagesWrap || !title || !zoomBtn){
    console.warn("Book loader elements missing");
    return;
  }

  const pages = [
    ["","images/Businessplancov.png"],
    ["images/Businessplan4.jpg","images/Businessplan1.jpg"],
    ["images/Businessplan4.jpg","images/Businessplan2.jpg"],
    ["images/Businessplan4.jpg","images/Businessplan3.jpg"]
  ];

  let step = 0;
  let animating = false;

  const allImages = pages.flat().filter(Boolean);

  /* ===============================
     PRELOAD (SAFE)
  =============================== */
  Promise.all(
    allImages.map(src => new Promise(resolve=>{
      const img = new Image();
      img.onload = img.onerror = resolve;
      img.src = src;
    }))
  ).then(finishLoading);

  function finishLoading(){

    loader.classList.add("hidden");

    pagesWrap.classList.remove("hidden");
    zoomBtn.classList.remove("hidden");
    title.classList.remove("hidden");
    title.classList.add("title-appear");

    update();

    if(typeof setProgress === "function"){
      setProgress("book");
    }
  }

  /* ===============================
     UPDATE
  =============================== */
  function update(){

    step = Math.max(0, Math.min(step, pages.length - 1));

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

    if(animating) return;

    if(direction === "right" && step >= pages.length - 1) return;
    if(direction === "left" && step <= 0) return;

    animating = true;

    const pageToAnimate = direction === "right" ? right : left;
    const animClass = direction === "right" ? "turn-right" : "turn-left";

    pageToAnimate.classList.remove("turn-right","turn-left");
    void pageToAnimate.offsetWidth;
    pageToAnimate.classList.add(animClass);

    pageToAnimate.addEventListener("animationend", () => {

      step += (direction === "right") ? 1 : -1;
      update();

      pageToAnimate.classList.remove(animClass);
      animating = false;

    }, { once:true });
  }

  /* ===============================
     EVENTS
  =============================== */
  right.style.cursor = "pointer";
  left.style.cursor = "pointer";

  right.onclick = ()=> turnPage("right");
  left.onclick = ()=> turnPage("left");

  /* ===============================
     ZOOM
  =============================== */
  zoomBtn.onclick = ()=>{

    const currentSrc = pages[step]?.[1];
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

  if(!overlay) return;

  // 🔒 bloque double clic
  cont.disabled = true;

  overlay.remove();

  // ✅ progression
  if(typeof setProgress === "function"){
    setProgress("dialogue3");
  }

  // 🎬 transition propre
  showLoader(400, ()=>{

    playDialogues([
      { text:"Ton <strong>plan</strong> est solide.", anchor:pirate5 },
      { text:"Maintenant, il faut choisir ta <strong>stratégie</strong>.", anchor:pirate5 },
      { text:"Ta stratégie, c’est la façon dont tu vas <strong>attirer des clients</strong>.", anchor:pirate5 },
      { text:"Grâce à ton <strong>étude de marché</strong>, tu sais déjà ce que les gens veulent.", anchor:pirate5 },
      { text:"Et avec ton <strong>business plan</strong>, tu sais comment t’organiser.", anchor:pirate5 },
      { text:"Tu peux décider où <strong>vendre</strong>, comment <strong>communiquer</strong> et à quel <strong>prix</strong>.", anchor:pirate5 },
      { text:"Tu choisis aussi ce qui te rend <strong>différent</strong> des autres.", anchor:pirate5 },
      { text:"Une bonne stratégie t’aide à faire les <strong>bons choix</strong> au bon moment.", anchor:pirate5 },
      { text:"Elle te permet d’avancer avec un <strong>objectif clair</strong>.", anchor:pirate5 },
      { text:"C’est ce qui va transformer ton projet en <strong>succès</strong>.", anchor:pirate5 }
    ], startMiniGame3);

  });

};
   } 
   
/* =====================================================
   MINI-JEU 3 — STRATÉGIES COMMERCIALES
===================================================== */
function startMiniGame3(){

  if(!game3) return;

  const text = document.getElementById("strategyText");
  const choices = document.getElementById("strategyChoices");
  const hintBox = document.getElementById("strategyHint");
  const hintBtn = document.getElementById("strategyHintBtn");

  if(!text || !choices || !hintBox || !hintBtn) return;

  game3.classList.remove("hidden");

  let step = 0;
  let locked = false;

  const steps = [
    {
      text:`Tu veux attirer plus de <strong>clients</strong> que tes concurrents.
      Quelle stratégie choisis-tu ?`,
      hint:"💡 Être différent ou plus intéressant.",
      answers:[
        { label:"Proposer quelque chose de différent", correct:true },
        { label:"Faire exactement pareil que les autres", correct:false },
        { label:"Ignorer les clients", correct:false }
      ]
    },
    {
      text:`Tu sais que tes clients veulent des prix <strong>accessibles</strong>.
      Que fais-tu ?`,
      hint:"💡 Adapter ton offre au marché.",
      answers:[
        { label:"Mettre un prix adapté", correct:true },
        { label:"Mettre un prix très élevé", correct:false },
        { label:"Choisir un prix au hasard", correct:false }
      ]
    },
    {
      text:`Tu veux te faire connaître rapidement.
      Quelle action choisis-tu ?`,
      hint:"💡 Communication = visibilité.",
      answers:[
        { label:"Communiquer sur ton produit", correct:true },
        { label:"Ne rien dire à personne", correct:false },
        { label:"Attendre sans rien faire", correct:false }
      ]
    },
    {
      text:`Ton objectif est de réussir ton projet.`,
      hint:"💡 Suivre une direction claire.",
      answers:[
        { label:"Suivre une stratégie claire", correct:true },
        { label:"Changer d’idée tous les jours", correct:false },
        { label:"Décider au hasard", correct:false }
      ],
      finalText:`<strong>Bonne stratégie.</strong><br>
      Tu avances avec des choix réfléchis,
      basés sur ton marché et ton plan.`
    }
  ];

  function render(){

    locked = false;

    const s = steps[step];
    if(!s) return;

    text.innerHTML = s.text;

    choices.innerHTML = "";
    hintBox.classList.add("hidden");
    hintBox.innerHTML = s.hint;

    s.answers.forEach(a=>{

      const b = document.createElement("button");
      b.textContent = a.label;

      b.onclick = ()=>{

        if(locked) return;

        if(!a.correct){
          shake(game3);
          return;
        }

        locked = true;

        b.classList.add("flash-success");

        setTimeout(()=>{
          b.classList.remove("flash-success");
          b.classList.add("correct-locked");
        },300);

        b.disabled = true;

        // ===== DERNIÈRE ÉTAPE =====
        if(s.finalText){

          text.innerHTML = s.finalText;
          choices.innerHTML = "";
          hintBtn.classList.add("hidden");

          // ✅ progression
          if(typeof setProgress === "function"){
            setProgress("game3");
          }

          setTimeout(()=>{

            game3.classList.add("hidden");

            showLoader(1000, ()=>{
              showCommerceWin();
            });

          }, 2500);

        }else{

          setTimeout(()=>{
            step++;
            render();
          },400);

        }
      };

      choices.appendChild(b);
    });
  }

  hintBtn.onclick = ()=>{
    hintBox.classList.remove("hidden");
  };

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

   createProgressBar();

});
