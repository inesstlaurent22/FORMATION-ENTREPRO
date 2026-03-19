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
    { text:"Avant de vendre quoi que ce soit, il faut comprendre ton marché.", anchor:pirate5 },
    { text:"Clients, concurrence, besoins, prix… rien ne doit être laissé au hasard.", anchor:pirate5 },
    { text:"On vient d'arriver sur le marché, on ne connaît rien.", anchor:pirate2 },
    { text:"Je vais t'expliquer. Prend un carnet de note car après tu auras un quizz.", anchor:pirate5 },
    { text:"Première information importante : Les études de marché.", anchor:pirate5 },
    { text:"Elle sert à analyser : les besoins des clients, la concurrence, les tendances, et les opportunités.", anchor:pirate5 },
    { text:"Mais comment avoir les informations pour les analyser ? ", anchor:pirate2 },
    { text:"à travers : des questionnaires, des interviews,ou l’analyse de données existantes trouvées sur internet.", anchor:pirate5 },
    { text:"Tout cela va te permettre de savoir si ton produit peut intérésser les clients.", anchor:pirate5 },
    { text:"Un bon produit est un produit qui répond à un problème que les clients ont.", anchor:pirate5 },
    { text:"Nos pierres sont les plus belles du marché, les clients n'aiment que ces pierres, c'est un bon début ? ", anchor:pirate2 },
    { text:"Oui, on va vérifier si tu as tout compris.", anchor:pirate5 }
  ], startMiniGame1);
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
          { t:"Décorer la boutique", ok:false },
          { t:"Comprendre les clients", ok:true },
          { t:"Copier les concurrents", ok:false }
        ]
      },

      {
        question: "Les études de marché sont-elles obligatoires ?",
        answers: [
          { t:"Oui", ok:true },
          { t:"Non", ok:false }
        ]
      },

      {
        question: "Après une étude de marché, que faire ?",
        answers: [
          { t:"Manger un burger pirate", ok:false },
          { t:"Vendre directement", ok:false },
          { t:"Préparer une stratégie de vente", ok:true }
        ]
      },

      {
        question: "De quoi sont constituées les études de marché ?",
        answers: [
          { t:"Analyse des clients", ok:true },
          { t:"Analyse de la concurrence", ok:true },
          { t:"Analyse de l’environnement", ok:true }
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
  playDialogues([
    { text:"Parfait. Maintenant, il faut structurer tout ça.", anchor:pirate5 },
    { text:"À partir des tes etudes, tu vas pouvoir créer tes stratégies commerciales", anchor:pirate5 },
    { text:"Peux tu me dire à quoi sert les stratégies commerciales s'il te plaît.", anchor:pirate2 },
    { text:"Une stratégie commerciale correspond à la manière dont une entreprise va vendre son offre.", anchor:pirate5 },
    { text:"Comment je dois faire s'il te plaît ? ", anchor:pirate2 },
    { text:"Les stratégies reposent sur le prix (haut de gamme ou accessible)", anchor:pirate5 },
    { text:"le positionnement (luxe, écologique, rapide, etc.)", anchor:pirate5 },
    { text:"les canaux de vente (magasin, site internet, application)", anchor:pirate5 },
    { text:"et la communication (publicité, promotions, influenceurs)", anchor:pirate5 },
    { text:"Cela fait beaucoup, comment ne rien oublier ? ", anchor:pirate2 },
    { text:"Tu vas tout noter sur ton business plan, la présentation de ton business", anchor:pirate5 }
  ], startMiniGame2);
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
        { t: "Décorer une entreprise", ok: false },
        { t: "Présenter un projet et convaincre des partenaires", ok: true },
        { t: "Fixer uniquement les prix", ok: false },
        { t: "Recruter des employés", ok: false }
      ]
    },
       
    {
      question: "Quel élément est indispensable dans un business plan ?",
      answers: [
        { t: "Les couleurs du logo", ok: false },
        { t: "Les prévisions financières", ok: true },
        { t: "Le nombre d’employés déjà recrutés", ok: false },
        { t: "Le nom des clients", ok: false }
      ]
    },
    
    {
      question: "Qu’est-ce qu’une stratégie commerciale ?",
      answers: [
        { t: "Une manière d’organiser les bureaux", ok: false },
        { t: "Une méthode pour vendre un produit ou service", ok: true },
        { t: "Un type de contrat", ok: false },
        { t: "Une règle juridique", ok: false }
      ]
    },

        {
      question: "Quelle est une stratégie commerciale ??",
      answers: [
        { t: "Baisser les prix pour attirer plus de clients", ok: true },
        { t: "Faire de la publicité sur les réseaux sociaux", ok: true },
        { t: "Proposer des promotions ou réductions", ok: true },
        { t: "Fidéliser les clients avec un programme de récompenses", ok: true }
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
  { text:"Ton Business plan  est solide, maintenant passons à la réalité du terrain.", anchor:pirate5 },
  { text:"Quelle est cette réalité ? ", anchor:pirate2 },
  { text:"Les clients ne veulent pas payer plus cher que ce qu'il souhaite.", anchor:pirate5 },
  { text:"Il faudra donc que tu les convainques de la nécéssité de ton produit.", anchor:pirate5 },
  { text:"Et pour ce faire, il faut que tu les fasses venir jusqu'à ta boutique", anchor:pirate5 },
  { text:"Comment faire ?", anchor:pirate2 },
  { text:"La prospection consiste à chercher de nouveaux clients.", anchor:pirate5 },
  { text:"Tu vas devoir rechercher des clients qui pourront être intéréssé par ton produit", anchor:pirate5 },
  { text:"Tu notes leurs informations (contact, adresse, entreprise) dans une base de donnée.", anchor:pirate5 },
  { text:"et tu vas les appeler, leur envoyer des mails ou des messages via les réseaux sociaux", anchor:pirate5 },
  { text:"afin d'attiser leur curiosité et de les faire venir jusqu'à toi", anchor:pirate5 },    
  { text:"Il est temps d'affronter le marché.", anchor:pirate5,
    onShow: ()=>{
  console.log("pirate3 déclenché");

  if(pirate3){
    pirate3.classList.remove("hidden");
  } else {
    console.warn("pirate3 introuvable");
  }
}
  }
], startMiniGame3);

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
    text:`Quelle est la première étape de la prospection ?.`,
    hint:"💡 Avant de contacter tu dois chercher leurs informations.",
    answers:[
      { label:"Contacter directement les clients", correct:false },
      { label:"Créer une base de données clients", correct:true },
      { label:"Lancer une publicité", correct:false },
      { label:"Fixer les prix", correct:false }
    ]
  },

  {
    text:`Comment peut-on contacter des clients ?`,
    hint:"💡 BtoB : Business to Business (entreprise à entreprise) // BtoC : Business to Consummer (entreprise à client)",
    answers:[
      { label:"Par mailing (email)", correct:true },
      { label:"Par phoning (téléphone)", correct:true },
      { label:"Par les réseaux sociaux", correct:true },
      { label:"Par LinkedIn (réseau professionnel BtoB)", correct:true }
    ]
  },

  {
    text:`Que faire si un client refuse à cause du prix ?`,
    hint:"💡 Les clients aiment faire des économies",
    answers:[
      { label:"Ignorer le client", correct:false },
      { label:"Augmenter le prix", correct:false },
      { label:"Proposer des promotions ou réductions", correct:true },
      { label:"Arrêter la vente", correct:false }
    ]
  },

  {
    text:`Que faire si un client ne voit pas l’utilité du produit ?`,
    hint:"💡 Baisser les prix n'est pas toujours la bonne réponse",
    answers:[
      { label:"Insister sans explication", correct:false },
      { label:"Montrer que le produit répond à un besoin", correct:true },
      { label:"Baisser immédiatement le prix", correct:false },
      { label:"Changer de client", correct:true }
    ],
    finalText:`<strong> 🎉 Bravo.</strong><br>
    Tu as tout bon et maintenant tu connais tout de la partie commerce. Passons à la suite`
  }
];

  function render(){

    const s = steps[step];

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

        if(s.finalText){

          text.innerHTML = s.finalText;
          choices.innerHTML = "";

          if(hintBtn) hintBtn.classList.add("hidden");

          setTimeout(()=>{
            game3.classList.add("hidden");

            showLoader(1200, ()=>{
              showCommerceWin();
            });

          }, 3200);

        }else{
          step++;
          render();
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

});
