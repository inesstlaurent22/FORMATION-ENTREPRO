document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   HELPERS
===================================================== */
const $ = (id) => document.getElementById(id);

/* =====================================================
   DOM
===================================================== */
const DOM = {
  background: $("background"),
  pirate2: $("pirate2bis"),
  pirate5: $("pirate5bis"),
  pirate3: $("pirate3bis"),

  bubble: $("bubbleContainer"),
  skip: $("skipDialoguesBtn"),
  fade: $("fadeScreen"),

  game1: $("communicationGame"),
  q1: $("commQuestion"),
  a1: $("commAnswers"),

  game2: $("visualIdentityGame"),
  visualChoices: $("visualChoices"),

  game3: $("merchantGame"),

  videoContainer: $("videoContainer"),
  video: $("questVideo"),
  sound: $("toggleSound"),
  closeVideo: $("closeVideo")
};

/* =====================================================
   INIT SÉCURISÉ
===================================================== */
if (DOM.fade) {
  DOM.fade.classList.add("hidden");
}

/* =====================================================
   LOADER
===================================================== */
let loaderTimer = null;

function showLoader(duration = 1200, cb){

  if(loaderTimer){
    clearTimeout(loaderTimer);
    loaderTimer = null;
  }

  if(!DOM.fade){
    if(typeof cb === "function") cb();
    return;
  }

  DOM.fade.classList.remove("hidden");

  loaderTimer = setTimeout(() => {

    DOM.fade.classList.add("hidden");

    if(typeof cb === "function"){
      cb();
    }

    loaderTimer = null;

  }, duration);
}

/* =====================================================
   SHAKE
===================================================== */
function shake(el){
  if(!el) return;

  el.classList.remove("screen-shake");
  void el.offsetWidth; // force reflow
  el.classList.add("screen-shake");

  setTimeout(() => {
    el.classList.remove("screen-shake");
  }, 400);
}

/* =====================================================
   PROGRESSION
===================================================== */
const KEY = "commerce_progress_v1";

const STEPS = [
  "dialogue1","game1","dialogue2","game2","dialogue3","game3"
];

function getProgress(){
  try{
    return JSON.parse(sessionStorage.getItem(KEY)) || {};
  }catch(e){
    console.warn("Progression corrompue", e);
    return {};
  }
}

function setDone(step){
  const p = getProgress();

  if(p[step]) return;

  p[step] = true;
  sessionStorage.setItem(KEY, JSON.stringify(p));

  updateProgressBar?.(); // 🔥 sécurisé
}

function nextStep(){
  const p = getProgress();
  return STEPS.find(s => !p[s]) || "done";
}

/* =====================================================
   FLOW
===================================================== */
let lockedFlow = false;

function startFlow(){

  if(lockedFlow) return;
  lockedFlow = true;

  const step = nextStep();

  switch(step){
    case "dialogue1": startDialogues1(); break;
    case "game1": startMiniGame1(); break;
    case "dialogue2": startDialogues2(); break;
    case "game2": startMiniGame2(); break;
    case "dialogue3": showBusinessPlanLoader(); break;
    case "game3": startMiniGame3(); break;
    default: showCommerceWin();
  }

  setTimeout(() => {
    lockedFlow = false;
  }, 300);
}

/* =====================================================
   VIDEO
===================================================== */
let videoDone = false;

if(DOM.video){

  DOM.video.muted = true;

  DOM.video.addEventListener("canplay", () => {
    DOM.fade?.classList.add("hidden");

    const playPromise = DOM.video.play();
    if(playPromise !== undefined){
      playPromise.catch(()=>{});
    }
  });

  DOM.video.addEventListener("ended", endVideo);
}

if(DOM.sound && DOM.video){
  DOM.sound.addEventListener("click", () => {
    DOM.video.muted = !DOM.video.muted;
    DOM.sound.textContent = DOM.video.muted ? "🔇" : "🔊";
  });
}

if(DOM.closeVideo){
  DOM.closeVideo.addEventListener("click", endVideo);
}

function endVideo(){

  if(videoDone) return;
  videoDone = true;

  if(DOM.video){
    DOM.video.pause();
    DOM.video.removeAttribute("src");
    DOM.video.load();
  }

  DOM.videoContainer?.classList.add("hidden");

  showLoader(1200, showScene);
}

// 🔥 FALLBACK SI LA VIDÉO NE SE LANCE PAS
setTimeout(() => {
  if(!videoDone){
    console.warn("Fallback vidéo activé");
    endVideo();
  }
}, 6000);

/* =====================================================
   SCENE
===================================================== */
function showScene(){

  DOM.background?.classList.remove("hidden");
  DOM.pirate2?.classList.remove("hidden");
  DOM.pirate5?.classList.remove("hidden");

  if(!DOM.pirate5){
  console.error("pirate5bis introuvable");
  return;
}

  // 🔒 bloque double init
  if(DOM.pirate5.dataset.init === "true") return;
  DOM.pirate5.dataset.init = "true";

  DOM.pirate5.classList.add("glowStart");

  DOM.pirate5.onclick = () => {

    DOM.pirate5.classList.remove("glowStart");
    DOM.pirate5.style.pointerEvents = "none";

    startFlow();
  };
}

/* =====================================================
   DIALOGUES ENGINE
===================================================== */
let dialogues = [];
let i = 0;
let cb = null;
let lock = false;

function playDialogues(list, callback){

  // 🔒 sécurité
  if(!DOM.bubble){
    if(typeof callback === "function") callback();
    return;
  }

  if(!Array.isArray(list) || list.length === 0){
    endDialogues();
    return;
  }

  dialogues = list;
  i = 0;
  cb = typeof callback === "function" ? callback : null;

  DOM.skip?.classList.remove("hidden");

  renderDialogue();
}

function renderDialogue(){

  if(!DOM.bubble) return;

  DOM.bubble.innerHTML = "";

  if(i >= dialogues.length){
    endDialogues();
    return;
  }

  const d = dialogues[i];

  // 🔥 hook optionnel
  if(d?.onShow && typeof d.onShow === "function"){
    d.onShow();
  }

  if(!d || !d.text){
    i++;
    renderDialogue();
    return;
  }

  const bubble = document.createElement("div");
  bubble.className = "dialogue-bubble";
  bubble.innerHTML = d.text;

  /* ===============================
     POSITION
  =============================== */
  if(d.anchor && typeof d.anchor.getBoundingClientRect === "function"){

    const r = d.anchor.getBoundingClientRect();

    bubble.style.left = (r.left + r.width / 2) + "px";
    bubble.style.top = (r.top - 120) + "px";
    bubble.style.transform = "translateX(-50%)";

  }else{

    bubble.style.left = "50%";
    bubble.style.top = "30%";
    bubble.style.transform = "translate(-50%, -50%)";
  }

  /* ===============================
     CLICK NEXT
  =============================== */
  bubble.onclick = () => {

    if(lock) return;

    lock = true;
    i++;

    requestAnimationFrame(() => {
      lock = false;
      renderDialogue();
    });
  };

  DOM.bubble.appendChild(bubble);
}

function endDialogues(){

  if(DOM.bubble){
    DOM.bubble.innerHTML = "";
  }

  DOM.skip?.classList.add("hidden");

  const fn = cb;
  cb = null;

  if(typeof fn === "function"){
    showLoader(1000, fn);
  }else{
    showLoader(1000);
  }
}

/* =====================================================
   SKIP BUTTON
===================================================== */
if(DOM.skip){
  DOM.skip.onclick = () => {
    endDialogues();
  };
}

/* =====================================================
   DIALOGUES 1
===================================================== */
function startDialogues1(){

  playDialogues([
    { text:"Avant de vendre quoi que ce soit, il faut <strong>comprendre ton marché</strong>.", anchor: DOM.pirate5 },

    { text:"Clients, concurrence, besoins, prix… rien ne doit être laissé au <strong>hasard</strong>.", anchor: DOM.pirate5 },

    { text:"On vient d’arriver… et on ne connaît rien du tout.", anchor: DOM.pirate2 },

    { text:"Parfait. On va commencer par la base : <strong>l’étude de marché</strong>.", anchor: DOM.pirate5 },

    { text:"Elle permet d’<strong>analyser</strong> les <strong>clients</strong>, la <strong>concurrence</strong> et les <strong>opportunités</strong>.", anchor: DOM.pirate5 },

    { text:"Donc… il faut espionner les autres pirates ?", anchor: DOM.pirate2 },

    { text:"Pas espionner… mais <strong>observer et comprendre</strong>.", anchor: DOM.pirate5 },

    { text:"Tu peux utiliser <strong>des questionnaires</strong>, <strong>des interviews</strong> ou <strong>des données en ligne</strong>.", anchor: DOM.pirate5 },

    { text:"Tout ça pour vérifier si ton produit <strong>intéresse vraiment</strong> les clients.", anchor: DOM.pirate5 },

    { text:"Un bon produit, c’est un produit qui <strong>répond à un besoin</strong> ou <strong>résout un problème</strong>.", anchor: DOM.pirate5 },

    { text:"Nos pierres sont magnifiques… donc ça va marcher, non ?", anchor: DOM.pirate2 },

    { text:"Peut-être… mais sans données, ce n’est qu’une <strong>supposition</strong>.", anchor: DOM.pirate5 },

    { text:"Un entrepreneur ne devine pas… il <strong>valide avec des faits</strong>.", anchor: DOM.pirate5 },

    { text:"Alors… à toi de prouver que ton idée peut vraiment fonctionner.", anchor: DOM.pirate5 }

  ], () => {

    setDone("dialogue1"); // 🔥 correction nom fonction

    startMiniGame1();

  });
}

/* =====================================================
   MINI-JEU 1
===================================================== */
function startMiniGame1(){

  if(!DOM.game1 || !DOM.q1 || !DOM.a1){
    console.error("Mini-jeu 1 cassé : éléments manquants");
    return;
  }

  showLoader(900, ()=>{

    DOM.game1.classList.remove("hidden");

    const questions = [
      {
        question: "Pourquoi réaliser une étude de marché ?",
        answers: [
          { t:"Comprendre les clients", ok:true },
          { t:"Analyser la concurrence", ok:true },
          { t:"Décorer sa boutique", ok:false },
          { t:"Valider une idée de produit", ok:true }
        ]
      },
      {
        question: "Que permet d’analyser une étude de marché ?",
        answers: [
          { t:"Les besoins des clients", ok:true },
          { t:"Les tendances du marché", ok:true },
          { t:"Les opportunités", ok:true },
          { t:"La météo du jour", ok:false }
        ]
      },
      {
        question: "Comment obtenir des informations sur son marché ?",
        answers: [
          { t:"Des questionnaires", ok:true },
          { t:"Des interviews", ok:true },
          { t:"Des recherches en ligne", ok:true },
          { t:"Au hasard", ok:false }
        ]
      },
      {
        question: "Un bon produit est un produit qui :",
        answers: [
          { t:"Répond à un besoin", ok:true },
          { t:"Résout un problème", ok:true },
          { t:"Est juste joli", ok:false },
          { t:"Est choisi au hasard", ok:false }
        ]
      },
      {
        question: "Que risque un entrepreneur sans étude de marché ?",
        answers: [
          { t:"Créer un produit inutile", ok:true },
          { t:"Ne pas trouver de clients", ok:true },
          { t:"Réussir à coup sûr", ok:false },
          { t:"Perdre du temps et de l’argent", ok:true }
        ]
      },
      {
        question: "Après une étude de marché, que faut-il faire ?",
        answers: [
          { t:"Adapter son offre", ok:true },
          { t:"Construire une stratégie", ok:true },
          { t:"Lancer son produit intelligemment", ok:true },
          { t:"Ignorer les résultats", ok:false }
        ]
      }
    ];

    let current = 0;

    function renderQuestion(){

      if(!questions[current]) return;

      DOM.q1.textContent = questions[current].question;
      DOM.a1.innerHTML = "";

      let success = 0;
      const correctCount = questions[current].answers.filter(a => a.ok).length;

      questions[current].answers.forEach(q => {

        const btn = document.createElement("button");
        btn.textContent = q.t;

        btn.onclick = () => {

          if(!q.ok){
            shake(DOM.game1);
            return;
          }

          if(btn.classList.contains("correct-locked")) return;

          btn.classList.add("correct-locked");
          btn.disabled = true;

          success++;

          if(success === correctCount){

            setTimeout(()=>{

              current++;

              if(current < questions.length){

                renderQuestion();

              }else{

                DOM.game1.classList.add("hidden");

                setDone("game1");

                startDialogues2();
              }

            }, 800);
          }
        };

        DOM.a1.appendChild(btn);
      });
    }

    renderQuestion();

  });
}
   
/* =====================================================
   DIALOGUES 2
===================================================== */
function startDialogues2(){

  const dialoguesMarket = [
    { text:"Avant de vendre quoi que ce soit, tu dois <strong>comprendre ton marché</strong>.", anchor: DOM.pirate5 },
    { text:"Clients, concurrence, besoins, prix… rien ne doit être laissé au <strong>hasard</strong>.", anchor: DOM.pirate5 },
    { text:"On vient d’arriver… et on ne connaît absolument rien.", anchor: DOM.pirate2 },
    { text:"Parfait. C’est là que commence le travail d’un vrai entrepreneur.", anchor: DOM.pirate5 },
    { text:"Première étape : <strong>l’étude de marché</strong>.", anchor: DOM.pirate5 },
    { text:"Elle permet d’<strong>analyser</strong> les <strong>clients</strong>, la <strong>concurrence</strong>, les <strong>tendances</strong> et les <strong>opportunités</strong>.", anchor: DOM.pirate5 },
    { text:"Donc… il faut deviner ce que veulent les clients ?", anchor: DOM.pirate2 },
    { text:"Non. Tu dois <strong>collecter des informations réelles</strong>.", anchor: DOM.pirate5 },
    { text:"Avec <strong>des questionnaires</strong>, <strong>des interviews</strong> ou <strong>des données déjà existantes</strong>.", anchor: DOM.pirate5 },
    { text:"Tout cela permet de savoir si ton produit <strong>intéresse vraiment</strong> le marché.", anchor: DOM.pirate5 },
    { text:"Un bon produit, c’est un produit qui <strong>répond à un besoin</strong> ou <strong>résout un problème</strong>.", anchor: DOM.pirate5 },
    { text:"Nos pierres sont magnifiques… les clients vont forcément adorer, non ?", anchor: DOM.pirate2 },
    { text:"Peut-être. Mais sans données, ce n’est qu’une <strong>supposition</strong>.", anchor: DOM.pirate5 },
    { text:"Un entrepreneur ne suppose pas… il <strong>valide avec des faits</strong>.", anchor: DOM.pirate5 },
    { text:"Prends des notes. Tu vas devoir prouver que ton idée peut fonctionner.", anchor: DOM.pirate5 }
  ];

  playDialogues(dialoguesMarket, () => {

    setDone("dialogue2"); // 🔥 correction nom fonction

    startMiniGame2();

  });
}

/* =====================================================
   MINI-JEU 2
===================================================== */
function startMiniGame2(){

  if(!DOM.game2 || !DOM.visualChoices){
    console.error("Mini-jeu 2 cassé : éléments manquants");
    return;
  }

  showLoader(900, ()=>{

    DOM.game2.classList.remove("hidden");

    const questions = [
      {
        question: "À quoi sert un business plan ?",
        answers: [
          { t:"Présenter un projet", ok:true },
          { t:"Convaincre des investisseurs ou partenaires", ok:true },
          { t:"Décorer une entreprise", ok:false },
          { t:"Fixer uniquement les prix", ok:false }
        ]
      },
      {
        question: "Que contient un business plan ?",
        answers: [
          { t:"Des prévisions financières", ok:true },
          { t:"Une étude de marché", ok:true },
          { t:"Une stratégie commerciale", ok:true },
          { t:"La couleur du logo", ok:false }
        ]
      },
      {
        question: "Pourquoi les prévisions financières sont importantes ?",
        answers: [
          { t:"Évaluer la rentabilité du projet", ok:true },
          { t:"Anticiper les dépenses", ok:true },
          { t:"Convaincre les investisseurs", ok:true },
          { t:"Choisir un logo", ok:false }
        ]
      },
      {
        question: "Qu’est-ce qu’une stratégie commerciale ?",
        answers: [
          { t:"Une méthode pour vendre un produit ou service", ok:true },
          { t:"Un plan pour attirer des clients", ok:true },
          { t:"Une organisation des bureaux", ok:false },
          { t:"Une règle juridique", ok:false }
        ]
      },
      {
        question: "Quelles actions font partie d’une stratégie commerciale ?",
        answers: [
          { t:"Faire de la publicité", ok:true },
          { t:"Proposer des promotions", ok:true },
          { t:"Fidéliser les clients", ok:true },
          { t:"Ignorer la concurrence", ok:false }
        ]
      },
      {
        question: "À quoi sert une stratégie commerciale ?",
        answers: [
          { t:"Attirer des clients", ok:true },
          { t:"Augmenter les ventes", ok:true },
          { t:"Développer son activité", ok:true },
          { t:"Remplacer le business plan", ok:false }
        ]
      }
    ];

    let current = 0;

    function renderQuestion(){

      if(!questions[current]) return;

      DOM.visualChoices.innerHTML = "";

      const qBox = document.createElement("div");
      qBox.className = "gameQuestion";
      qBox.textContent = questions[current].question;

      DOM.visualChoices.appendChild(qBox);

      let success = 0;
      const correctCount = questions[current].answers.filter(a => a.ok).length;

      questions[current].answers.forEach(q => {

        const btn = document.createElement("button");
        btn.textContent = q.t;

        btn.onclick = ()=>{

          if(!q.ok){
            shake(DOM.game2);
            return;
          }

          if(btn.classList.contains("correct-locked")) return;

          btn.classList.add("correct-locked");
          btn.disabled = true;

          success++;

          if(success === correctCount){

            setTimeout(()=>{

              current++;

              if(current < questions.length){

                renderQuestion();

              }else{

                DOM.game2.classList.add("hidden");

                setTimeout(()=>{
                  setDone("game2"); // 🔥 correction
                  showBusinessPlanLoader();
                },600);
              }

            },800);
          }
        };

        DOM.visualChoices.appendChild(btn);
      });
    }

    renderQuestion();

  });
}
   
/* =====================================================
   📘 LIVRE
===================================================== */
function showBusinessPlanLoader(){

  const existing = document.getElementById("identity-loader");
  if(existing) existing.remove();

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

        <button id="continueQuestBtn" class="hidden">
          Continuer la quête
        </button>

      </div>
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

  if(!right || !pagesWrap){
    console.error("Livre cassé : éléments manquants");
    return;
  }

  const pages = [
    ["","images/Businessplancov.png"],
    ["images/Businessplan4.jpg","images/Businessplan1.jpg"],
    ["images/Businessplan4.jpg","images/Businessplan2.jpg"],
    ["images/Businessplan4.jpg","images/Businessplan3.jpg"]
  ];

  let step = 0;

  /* ===============================
     PRELOAD
  =============================== */
  const allImages = pages.flat().filter(Boolean);
  let loaded = 0;
  let finished = false;

  if(allImages.length === 0){
    finishLoading();
  }else{
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

    loader?.classList.add("hidden");
    pagesWrap.classList.remove("hidden");
    zoomBtn?.classList.remove("hidden");

    if(title){
      title.classList.remove("hidden");
      title.classList.add("title-appear");
    }

    update();
  }

  /* ===============================
     UPDATE
  =============================== */
  function update(){

    if(!pages[step]) return;

    const [l, r] = pages[step];

    if(left){
      if(l){
        left.src = l;
        left.classList.remove("hidden");
      }else{
        left.classList.add("hidden");
      }
    }

    if(right && r){
      right.src = r;
    }

    cont?.classList.toggle("hidden", step !== pages.length - 1);
  }

  /* ===============================
     TURN PAGE
  =============================== */
  function turnPage(direction){

    if(direction === "right" && step >= pages.length - 1) return;
    if(direction === "left" && step <= 0) return;

    const pageToAnimate = direction === "right" ? right : left;
    if(!pageToAnimate) return;

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
     EVENTS
  =============================== */

  right.style.cursor = "pointer";
  right.onclick = () => turnPage("right");

  if(left){
    left.style.cursor = "pointer";
    left.onclick = () => turnPage("left");
  }

  if(zoomBtn){
    zoomBtn.onclick = () => {

      const currentSrc = pages[step]?.[1];
      if(!currentSrc) return;

      const zoom = document.createElement("div");
      zoom.className = "page-zoom";

      const loaderZoom = document.createElement("div");
      loaderZoom.className = "book-loading";
      loaderZoom.textContent = "⏳";

      const img = document.createElement("img");
      img.style.display = "none";

      zoom.append(loaderZoom, img);
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
  }

  if(cont){
    cont.onclick = () => {

      overlay.remove();

      playDialogues([
        { text:"Ton <strong>business plan</strong> est solide… maintenant, place à la <strong>réalité du terrain</strong>.", anchor: DOM.pirate5 },
        { text:"La réalité du terrain ?", anchor: DOM.pirate2 },
        { text:"Les clients ne paient que s’ils perçoivent une <strong>vraie valeur</strong>.", anchor: DOM.pirate5 },
        { text:"Tu dois donc les convaincre de <strong>l’intérêt de ton produit</strong>.", anchor: DOM.pirate5 },
        { text:"Mais avant ça… encore faut-il <strong>les faire venir jusqu’à toi</strong>.", anchor: DOM.pirate5 },
        { text:"Comment attirer des clients ?", anchor: DOM.pirate2 },
        { text:"Grâce à la <strong>prospection</strong>.", anchor: DOM.pirate5 },
        { text:"La prospection, c’est <strong>chercher activement de nouveaux clients</strong>.", anchor: DOM.pirate5 },
        { text:"Tu identifies des personnes <strong>potentiellement intéressées</strong> par ton offre.", anchor: DOM.pirate5 },
        { text:"Puis tu notes leurs <strong>informations</strong> dans une <strong>base de données</strong>.", anchor: DOM.pirate5 },
        { text:"Ensuite, tu les contactes : <strong>appels</strong>, <strong>emails</strong>, ou <strong>réseaux sociaux</strong>.", anchor: DOM.pirate5 },
        { text:"Le but est simple : <strong>attirer leur attention</strong> et <strong>donner envie</strong>.", anchor: DOM.pirate5 },
        { text:"Un bon entrepreneur n'attend pas… il va <strong>chercher ses clients</strong>.", anchor: DOM.pirate5 },
        { text:"Prépare-toi. Le marché t’attend.", anchor: DOM.pirate5 }
      ], () => {

        setDone("dialogue3"); // 🔥 correction

        setTimeout(()=>{
          startMiniGame3();
        },300);

      });
    };
  }
}
   
/* =====================================================
   MINI-JEU 3 — STRATÉGIES COMMERCIALES
===================================================== */
function startMiniGame3(){

  if(!DOM.game3){
    console.error("Mini-jeu 3 cassé : container manquant");
    return;
  }

  DOM.game3.classList.remove("hidden");

  const text = document.getElementById("strategyText");
  const choices = document.getElementById("strategyChoices");
  const hintBox = document.getElementById("strategyHint");
  const hintBtn = document.getElementById("strategyHintBtn");

  if(!text || !choices || !hintBox){
    console.error("Mini-jeu 3 cassé : éléments manquants");
    return;
  }

  let step = 0;

  const steps = [
    {
      text:`Quelle est la première étape de la prospection ?`,
      hint:"💡 Avant de contacter, tu dois identifier tes futurs clients.",
      answers:[
        { label:"Identifier des prospects potentiels", correct:true },
        { label:"Créer une base de données clients", correct:true },
        { label:"Contacter directement sans préparation", correct:false },
        { label:"Fixer ses prix", correct:false }
      ]
    },
    {
      text:`Comment constituer une base de données de prospects ?`,
      hint:"💡 Tu dois collecter des informations utiles.",
      answers:[
        { label:"Rechercher des entreprises en ligne", correct:true },
        { label:"Récupérer des contacts (email, téléphone)", correct:true },
        { label:"Utiliser LinkedIn ou des annuaires", correct:true },
        { label:"Attendre que les clients viennent seuls", correct:false }
      ]
    },
    {
      text:`Quels sont les moyens de contacter des prospects ?`,
      hint:"💡 Pense aux différents canaux de communication.",
      answers:[
        { label:"Email (mailing)", correct:true },
        { label:"Téléphone (phoning)", correct:true },
        { label:"Réseaux sociaux", correct:true },
        { label:"Ne pas les contacter", correct:false }
      ]
    },
    {
      text:`Que faire si un client refuse à cause du prix ?`,
      hint:"💡 Il faut adapter ton offre intelligemment.",
      answers:[
        { label:"Proposer une promotion", correct:true },
        { label:"Expliquer la valeur du produit", correct:true },
        { label:"Augmenter le prix", correct:false },
        { label:"Ignorer le client", correct:false }
      ]
    },
    {
      text:`Que faire si un client ne voit pas l’utilité du produit ?`,
      hint:"💡 Mets en avant les bénéfices.",
      answers:[
        { label:"Montrer que le produit répond à un besoin", correct:true },
        { label:"Expliquer les avantages concrets", correct:true },
        { label:"Insister sans argument", correct:false },
        { label:"Changer immédiatement de client", correct:false }
      ]
    },
    {
      text:`Quel est l’objectif principal de la prospection ?`,
      hint:"💡 Ce n’est pas juste parler… c’est convertir.",
      answers:[
        { label:"Trouver de nouveaux clients", correct:true },
        { label:"Générer des ventes", correct:true },
        { label:"Créer une relation avec les prospects", correct:true },
        { label:"Éviter les clients", correct:false }
      ],
      finalText:`<strong>🎉 Bravo.</strong><br>
Tu sais maintenant comment prospecter efficacement :
trouver des clients, les contacter et répondre à leurs objections.

Tu es prêt à attirer un maximum de clients vers ton activité.`
    }
  ];

  function render(){

    if(!steps[step]) return; // 🔥 sécurité

    const s = steps[step];

    text.innerHTML = s.text;
    choices.innerHTML = "";

    hintBox.classList.add("hidden");
    hintBox.innerHTML = s.hint;

    let success = 0;
    const totalCorrect = s.answers.filter(a => a.correct).length;

    s.answers.forEach(a => {

      const btn = document.createElement("button");
      btn.textContent = a.label;

      btn.onclick = ()=>{

        if(!a.correct){
          shake(DOM.game3); // 🔥 correction
          return;
        }

        if(btn.classList.contains("correct-locked")) return;

        btn.disabled = true;
        btn.classList.add("correct-locked");

        success++;

        if(success === totalCorrect){

          if(s.finalText){

            text.innerHTML = s.finalText;
            choices.innerHTML = "";

            hintBtn?.classList.add("hidden");

            setTimeout(()=>{
              DOM.game3.classList.add("hidden");
              showCommerceWin();
            },2000);

          }else{

            setTimeout(()=>{
              step++;
              render();
            },1100);

          }
        }
      };

      choices.appendChild(btn);
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
   🏆 VICTOIRE COMMERCE
===================================================== */
function showCommerceWin(){

  setDone("game3"); // 🔥 correction

  // 🔥 Supprime loader
  if(DOM.fade){
    DOM.fade.classList.add("hidden");
  }

  const overlay = document.createElement("div");
  overlay.id = "communication-win";

  overlay.innerHTML = `
    <div class="win-box">
      <h2>🏴‍☠️ Bravo !</h2>
      <p>Tu as gagné la quête Commerce !</p>
      <div class="gems-container"></div>
    </div>
  `;

  document.body.appendChild(overlay);

  const gemsContainer = overlay.querySelector(".gems-container");

  if(!gemsContainer){
    console.error("Gems container manquant");
    return;
  }

  requestAnimationFrame(()=>{
    launchGemsExplosion(gemsContainer);
  });

  /* 🔓 DÉBLOCAGES */
  try{
    sessionStorage.setItem("unlock_pirate3","true");
    sessionStorage.setItem("unlock_password_page","true");
    sessionStorage.setItem("fromCommerce","true");
  }catch(e){
    console.warn("SessionStorage indisponible");
  }

  /* ⏳ Redirection */
  setTimeout(()=>{
    window.location.href = "menu.html";
  },2500);
}

/* =====================================================
   💎 GEMS
===================================================== */
function launchGemsExplosion(container){

  if(!container) return;

  const colors = ["#ffd700","#00f2ff","#ff4fd8","#7cff00","#ff8c00"];

  for(let i=0;i<50;i++){

    const g = document.createElement("div");
    g.className = "gem";

    const size = Math.random()*10 + 8;

    g.style.width = size + "px";
    g.style.height = size + "px";
    g.style.background = colors[Math.floor(Math.random()*colors.length)];

    g.style.left = "50%";
    g.style.top = "50%";

    const angle = Math.random()*Math.PI*2;
    const dist = Math.random()*260 + 80;

    g.style.setProperty("--x", Math.cos(angle)*dist + "px");
    g.style.setProperty("--y", Math.sin(angle)*dist + "px");

    container.appendChild(g);
  }
}

/* =====================================================
   📊 PROGRESS BAR
===================================================== */

function updateProgressBar(){

  if(typeof getProgress !== "function"){
    console.error("getProgress manquant");
    return;
  }

  const progress = getProgress() || {};

  document.querySelectorAll(".progress-step").forEach(el=>{

    const step = el.dataset.step;
    if(!step) return;

    if(progress[step]){
      el.classList.add("done");
    }else{
      el.classList.remove("done");
    }
  });
}

function createProgressBar(){

  if(!Array.isArray(STEPS)){
    console.error("STEPS non défini");
    return;
  }

  const existing = document.getElementById("progressBar");
  if(existing) existing.remove();

  if(!document.body){
    console.warn("body non disponible");
    return;
  }

  const bar = document.createElement("div");
  bar.id = "progressBar";

  STEPS.forEach(step=>{

    if(!step) return;

    const el = document.createElement("div");
    el.className = "progress-step";
    el.dataset.step = step;

    el.textContent = step.includes("dialogue") ? "💬" : "🎮";

    bar.appendChild(el);
  });

  document.body.appendChild(bar);

  Object.assign(bar.style,{
    position:"fixed",
    bottom:"20px",
    left:"50%",
    transform:"translateX(-50%)",
    display:"flex",
    gap:"10px",
    zIndex:"999999"
  });

  // ✅ appel correct
  updateProgressBar();
}

/* =====================================================
   INIT FINAL
===================================================== */

createProgressBar();

}); // ← fin du DOMContentLoaded

window.addEventListener("load", () => {
  console.log("Page commerce chargée");
});
