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


/* =====================================================
   OUTILS
===================================================== */

let loaderTimeout = null;

function showLoader(duration = 1200, cb){

  // 🔥 clear ancien loader (évite bugs)
  if(loaderTimeout){
    clearTimeout(loaderTimeout);
    loaderTimeout = null;
  }

  if(!fadeScreen){
    if(typeof cb === "function") cb();
    return;
  }

  fadeScreen.classList.remove("hidden");

  loaderTimeout = setTimeout(() => {

    fadeScreen.classList.add("hidden");

    if(typeof cb === "function"){
      cb();
    }

    loaderTimeout = null;

  }, duration);
}

function shake(el){
  if(!el) return;

  el.classList.remove("screen-shake"); // reset propre
  void el.offsetWidth; // 🔥 force reflow (important)
  el.classList.add("screen-shake");

  setTimeout(()=>{
    el.classList.remove("screen-shake");
  },400);
}

/* =====================================================
   PROGRESSION
===================================================== */

const PROGRESS_KEY = "commerce_progress_v1";

const stepsOrder = [
  "dialogue1",
  "game1",
  "dialogue2",
  "game2",
  "dialogue3",
  "game3"
];

function getProgress(){
  try{
    return JSON.parse(sessionStorage.getItem(PROGRESS_KEY)) || {};
  }catch(e){
    return {};
  }
}

function setStepDone(step){

  const p = getProgress();

  // 🔥 empêche overwrite inutile
  if(p[step]) return;

  p[step] = true;

  sessionStorage.setItem(PROGRESS_KEY, JSON.stringify(p));

  updateProgressBar();
}

function getNextStep(){
  const p = getProgress();
  return stepsOrder.find(s => !p[s]) || "done";
}

/* =====================================================
   FLOW GLOBAL
===================================================== */

let flowStarted = false;

function startProgressFlow(){

  if(flowStarted) return; // 🔥 bloque double lancement
  flowStarted = true;

  const next = getNextStep();

  switch(next){

    case "dialogue1":
      startDialogues1();
    break;

    case "game1":
      startMiniGame1();
    break;

    case "dialogue2":
      startDialogues2();
    break;

    case "game2":
      startMiniGame2();
    break;

    case "dialogue3":
      showBusinessPlanLoader(); // ✅ OK ici
    break;

    case "game3":
      startMiniGame3();
    break;

    default:
      showCommerceWin();
  }
}

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

  if(background) background.classList.remove("hidden");
  if(pirate2) pirate2.classList.remove("hidden");
  if(pirate5) pirate5.classList.remove("hidden");

  // 🔥 BLOQUE DOUBLE INIT
  if(!pirate5) return;
if(pirate5.dataset.init) return;

  pirate5.dataset.init = "true";

  pirate5.classList.add("glowStart");

  pirate5.onclick = ()=>{
    pirate5.classList.remove("glowStart");
    pirate5.style.pointerEvents = "none";

    startProgressFlow();
  };
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

  // 🔒 Sécurité anti crash
  if(!Array.isArray(list) || list.length === 0){
    endDialogues();
    return;
  }

  dialogues = list;
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

   if(d.onShow && typeof d.onShow === "function"){
  d.onShow();
}
   
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

  playDialogues([
    { text:"Avant de vendre quoi que ce soit, il faut <strong>comprendre ton marché</strong>.", anchor:pirate5 },

    { text:"Clients, concurrence, besoins, prix… rien ne doit être laissé au <strong>hasard</strong>.", anchor:pirate5 },

    { text:"On vient d’arriver… et on ne connaît rien du tout.", anchor:pirate2 },

    { text:"Parfait. On va commencer par la base : <strong>l’étude de marché</strong>.", anchor:pirate5 },

    { text:"Elle permet d’<strong>analyser</strong> les <strong>clients</strong>, la <strong>concurrence</strong> et les <strong>opportunités</strong>.", anchor:pirate5 },

    { text:"Donc… il faut espionner les autres pirates ?", anchor:pirate2 },

    { text:"Pas espionner… mais <strong>observer et comprendre</strong>.", anchor:pirate5 },

    { text:"Tu peux utiliser <strong>des questionnaires</strong>, <strong>des interviews</strong> ou <strong>des données en ligne</strong>.", anchor:pirate5 },

    { text:"Tout ça pour vérifier si ton produit <strong>intéresse vraiment</strong> les clients.", anchor:pirate5 },

    { text:"Un bon produit, c’est un produit qui <strong>répond à un besoin</strong> ou <strong>résout un problème</strong>.", anchor:pirate5 },

    { text:"Nos pierres sont magnifiques… donc ça va marcher, non ?", anchor:pirate2 },

    { text:"Peut-être… mais sans données, ce n’est qu’une <strong>supposition</strong>.", anchor:pirate5 },

    { text:"Un entrepreneur ne devine pas… il <strong>valide avec des faits</strong>.", anchor:pirate5 },

    { text:"Alors… à toi de prouver que ton idée peut vraiment fonctionner.", anchor:pirate5 }
  ], () => {

    // ✅ Marque le dialogue comme terminé (ANTI-RETOUR + JAUGE)
    setStepDone("dialogue1");

    // ➜ Lance le jeu suivant
    startMiniGame1();

  });

}

/* =====================================================
   MINI-JEU 1
===================================================== */
function startMiniGame1(){

  showLoader(900, ()=>{

    game1.classList.remove("hidden");

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

      q1.textContent = questions[current].question;
      a1.innerHTML = "";

      let success = 0;
      const correctCount = questions[current].answers.filter(a => a.ok).length;

      questions[current].answers.forEach(q => {

        const b = document.createElement("button");
        b.textContent = q.t;

        b.onclick = ()=>{

          if(!q.ok){
            shake(game1);
            return;
          }

          // éviter double clic
          if(b.classList.contains("correct-locked")) return;

          b.classList.add("correct-locked");
          b.disabled = true;
          success++;

          // si toutes les bonnes réponses trouvées
          if(success === correctCount){

            setTimeout(()=>{

              current++;

              if(current < questions.length){
                renderQuestion();
              }else{
                game1.classList.add("hidden");
                 setStepDone("game1");
                startDialogues2();
              }

            },800);
          }
        };

        a1.appendChild(b);
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
    { text:"Avant de vendre quoi que ce soit, tu dois <strong>comprendre ton marché</strong>.", anchor:pirate5 },
    { text:"Clients, concurrence, besoins, prix… rien ne doit être laissé au <strong>hasard</strong>.", anchor:pirate5 },
    { text:"On vient d’arriver… et on ne connaît absolument rien.", anchor:pirate2 },
    { text:"Parfait. C’est là que commence le travail d’un vrai entrepreneur.", anchor:pirate5 },
    { text:"Première étape : <strong>l’étude de marché</strong>.", anchor:pirate5 },
    { text:"Elle permet d’<strong>analyser</strong> les <strong>clients</strong>, la <strong>concurrence</strong>, les <strong>tendances</strong> et les <strong>opportunités</strong>.", anchor:pirate5 },
    { text:"Donc… il faut deviner ce que veulent les clients ?", anchor:pirate2 },
    { text:"Non. Tu dois <strong>collecter des informations réelles</strong>.", anchor:pirate5 },
    { text:"Avec <strong>des questionnaires</strong>, <strong>des interviews</strong> ou <strong>des données déjà existantes</strong>.", anchor:pirate5 },
    { text:"Tout cela permet de savoir si ton produit <strong>intéresse vraiment</strong> le marché.", anchor:pirate5 },
    { text:"Un bon produit, c’est un produit qui <strong>répond à un besoin</strong> ou <strong>résout un problème</strong>.", anchor:pirate5 },
    { text:"Nos pierres sont magnifiques… les clients vont forcément adorer, non ?", anchor:pirate2 },
    { text:"Peut-être. Mais sans données, ce n’est qu’une <strong>supposition</strong>.", anchor:pirate5 },
    { text:"Un entrepreneur ne suppose pas… il <strong>valide avec des faits</strong>.", anchor:pirate5 },
    { text:"Prends des notes. Tu vas devoir prouver que ton idée peut fonctionner.", anchor:pirate5 }
  ];

  playDialogues(dialoguesMarket, () => {

    // ✅ MAJ progression
    setStepDone("dialogue2");

    // ➜ Suite logique
    startMiniGame2();

  });
}

/* =====================================================
   MINI-JEU 2
===================================================== */
function startMiniGame2(){

  showLoader(900, ()=>{

    game2.classList.remove("hidden");

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
    if(loader) loader.classList.add("hidden");
    if(pagesWrap) pagesWrap.classList.remove("hidden");
    if(zoomBtn) zoomBtn.classList.remove("hidden");
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

    if(!pages[step]) return; // 🔥 FIX CRASH

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

    if(cont){
      cont.classList.toggle("hidden", step !== pages.length - 1);
    }
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
  if(right){
    right.style.cursor = "pointer";
    right.addEventListener("click", ()=> turnPage("right"));
  }

  if(left){
    left.style.cursor = "pointer";
    left.addEventListener("click", ()=> turnPage("left"));
  }

  if(zoomBtn){
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
  }

  if(cont){
    cont.onclick = () => {

      overlay.remove();

      playDialogues([
    { text:"Ton <strong>business plan</strong> est solide… maintenant, place à la <strong>réalité du terrain</strong>.", anchor:pirate5 },

    { text:"La réalité du terrain ?", anchor:pirate2 },

    { text:"Les clients ne paient que s’ils perçoivent une <strong>vraie valeur</strong>.", anchor:pirate5 },

    { text:"Tu dois donc les convaincre de <strong>l’intérêt de ton produit</strong>.", anchor:pirate5 },

    { text:"Mais avant ça… encore faut-il <strong>les faire venir jusqu’à toi</strong>.", anchor:pirate5 },

    { text:"Comment attirer des clients ?", anchor:pirate2 },

    { text:"Grâce à la <strong>prospection</strong>.", anchor:pirate5 },

    { text:"La prospection, c’est <strong>chercher activement de nouveaux clients</strong>.", anchor:pirate5 },

    { text:"Tu identifies des personnes <strong>potentiellement intéressées</strong> par ton offre.", anchor:pirate5 },

    { text:"Puis tu notes leurs <strong>informations</strong> dans une <strong>base de données</strong>.", anchor:pirate5 },

    { text:"Ensuite, tu les contactes : <strong>appels</strong>, <strong>emails</strong>, ou <strong>réseaux sociaux</strong>.", anchor:pirate5 },

    { text:"Le but est simple : <strong>attirer leur attention</strong> et <strong>donner envie</strong>.", anchor:pirate5 },

    { text:"Un bon entrepreneur n'attend pas… il va <strong>chercher ses clients</strong>.", anchor:pirate5 },
        { text:"Prépare-toi. Le marché t’attend.", anchor:pirate5 }
      ], () => {

        setStepDone("dialogue3");

        setTimeout(() => {
          startMiniGame3();
        }, 300);

      });
    };
  }
}

};
   
/* =====================================================
   MINI-JEU 3 — STRATÉGIES COMMERCIALES
===================================================== */
function startMiniGame3(){

  if(game3) game3.classList.remove("hidden");

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

    const s = steps[step];

    text.innerHTML = s.text;
    choices.innerHTML = "";
    hintBox.classList.add("hidden");
    hintBox.innerHTML = s.hint;

    let success = 0;
    const totalCorrect = s.answers.filter(a => a.correct).length;

    s.answers.forEach(a=>{

      const b = document.createElement("button");
      b.textContent = a.label;

      b.onclick = ()=>{

        if(!a.correct){
          shake(game3);
          return;
        }

        if(b.classList.contains("correct-locked")) return;

        b.disabled = true;
        b.classList.add("correct-locked");
        success++;

        // 👉 attendre toutes les bonnes réponses
        if(success === totalCorrect){

          if(s.finalText){

            text.innerHTML = s.finalText;
            choices.innerHTML = "";

            if(hintBtn) hintBtn.classList.add("hidden");

            setTimeout(()=>{
              game3.classList.add("hidden");
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

   setStepDone("game3");

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
   📊 PROGRESS BAR
===================================================== */
function createProgressBar(){

  // 🔥 éviter doublon
  let existing = document.getElementById("progressBar");
  if(existing) existing.remove();

  const bar = document.createElement("div");
  bar.id = "progressBar";

  stepsOrder.forEach(step=>{
    const item = document.createElement("div");
    item.className = "progress-step";
    item.dataset.step = step;
    item.textContent = step.includes("dialogue") ? "💬" : "🎮";
    bar.appendChild(item);
  });

  document.body.appendChild(bar);

  // 🔥 styles critiques
  bar.style.position = "fixed";
  bar.style.bottom = "20px";
  bar.style.left = "50%";
  bar.style.transform = "translateX(-50%)";
  bar.style.display = "flex";
  bar.style.gap = "10px";
  bar.style.zIndex = "999999";

  updateProgressBar();
}

function updateProgressBar(){

  const progress = JSON.parse(sessionStorage.getItem(PROGRESS_KEY) || "{}");

  const bar = document.getElementById("progressBar");
  if(!bar) return;

  bar.querySelectorAll(".progress-step").forEach(el=>{
    const step = el.dataset.step;

    if(progress[step]){
      el.classList.add("done");
    }else{
      el.classList.remove("done");
    }
  });
}

   createProgressBar();
   
});
