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

/* =====================================================
   🎬 VIDÉO INTRO — VERSION FIXE
===================================================== */

let videoClosed = false;

if(questVideo){

  questVideo.muted = true;
  questVideo.playsInline = true;
  questVideo.style.pointerEvents = "none";

  const tryPlay = () => {
    questVideo.play().catch(()=>{});
  };

  questVideo.addEventListener("canplay", tryPlay);
  questVideo.addEventListener("loadeddata", tryPlay);

  // fin normale
  questVideo.addEventListener("ended", closeIntro);

  // fallback sécurité (iOS)
  questVideo.addEventListener("timeupdate", () => {
    if(
      !videoClosed &&
      questVideo.duration &&
      questVideo.currentTime >= questVideo.duration - 0.3
    ){
      closeIntro();
    }
  });

  // sécurité ultime (anti blocage)
  setTimeout(()=>{
    if(!videoClosed){
      console.log("FORCE END VIDEO");
      closeIntro();
    }
  }, 12000);
}

/* 🔊 SON */
if(toggleSound){
  toggleSound.onclick = (e) => {
    e.stopPropagation();
    questVideo.muted = !questVideo.muted;
    toggleSound.textContent = questVideo.muted ? "🔇" : "🔊";
  };
}

/* ❌ SKIP */
if(closeVideo){

  const skip = (e) => {
    e.stopPropagation();
    closeIntro();
  };

  closeVideo.addEventListener("click", skip);
  closeVideo.addEventListener("touchstart", skip); // 🔥 iOS fix
}

/* =====================================================
   FERMETURE VIDÉO
===================================================== */
function closeIntro(){

  if(videoClosed) return;
  videoClosed = true;

  console.log("VIDEO CLOSED");

  if(questVideo){
    questVideo.pause();
    questVideo.currentTime = 0;
  }

  if(videoContainer){
    videoContainer.classList.add("hidden");
  }

  if(fadeScreen){
    fadeScreen.classList.add("hidden");
    fadeScreen.style.pointerEvents = "none";
  }

  // 👉 IMPORTANT
  showScene();
}

/* =====================================================
   🌑 LOADER
===================================================== */
function showLoader(duration = 1200, cb){
  if(!fadeScreen){ cb && cb(); return; }
  fadeScreen.classList.remove("hidden");
  setTimeout(() => {
    fadeScreen.classList.add("hidden");
    cb && cb();
  }, duration);
}

function shake(el){
  el.classList.add("screen-shake");
  setTimeout(()=>el.classList.remove("screen-shake"),400);
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
    { text:"Clients, concurrence, besoins, prix… rien ne doit être laissé au hasard.", anchor:pirate5 }
  ], startMiniGame1);
}

/* =====================================================
   MINI-JEU 1
===================================================== */
function startMiniGame1(){

  showLoader(900, ()=>{

    game1.classList.remove("hidden");
    q1.textContent="Pourquoi réaliser une étude de marché ?";
    a1.innerHTML="";

    [
      {t:"Décorer la boutique",ok:false},
      {t:"Comprendre les clients",ok:true},
      {t:"Copier les concurrents",ok:false}
    ].forEach(q=>{

      const b=document.createElement("button");
      b.textContent=q.t;

      b.onclick=()=>{

        if(!q.ok){
          shake(game1);
          return;
        }

        b.classList.add("correct-locked");
        b.disabled = true;

        setTimeout(()=>{

          game1.classList.add("hidden");

          startDialogues2();

        },600);
      };

      a1.appendChild(b);
    });

  });
}

/* =====================================================
   DIALOGUES 2
===================================================== */
function startDialogues2(){
  playDialogues([
    { text:"Parfait. Maintenant, il faut structurer tout ça.", anchor:pirate5 },
    { text:"Un bon business plan évite bien des naufrages.", anchor:pirate5 }
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
      question: "Construction du business plan",
      answers: [
        { t: "Définir la cible", ok: true },
        { t: "Choisir la couleur du bateau", ok: false },
        { t: "Identifier le problème client", ok: true }
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
    { text:"Ton plan est solide.", anchor:pirate5 },
    { text:"Il est temps d'affronter le marché.", anchor:pirate5 }
  ], startMiniGame3);

};
   }
   
/* =====================================================
   MINI-JEU 3 — STRATÉGIES COMMERCIALES
===================================================== */
function startMiniGame3(){

  game3.classList.remove("hidden");

  const text = document.getElementById("strategyText");
  const choices = document.getElementById("strategyChoices");
  const hintBox = document.getElementById("strategyHint");
  const hintBtn = document.getElementById("strategyHintBtn");

  let step = 0;

  const steps = [
    {
      text:`Les autres vendeurs vendent à <strong>300 PO</strong>, sans pierres rouges.
      Vous en avez. Quel prix afficher ?`,
      hint:"💡 Avantage concurrentiel = marge possible.",
      answers:[
        { label:"350 PO", correct:true },
        { label:"300 PO", correct:false },
        { label:"250 PO", correct:false }
      ]
    },
    {
      text:`Vous ajoutez des boîtes en bois (20 PO).
      Comment ajuster le prix ?`,
      hint:"💡 Le coût est déjà intégré.",
      answers:[
        { label:"370 PO", correct:false },
        { label:"350 PO", correct:true },
        { label:"330 PO", correct:false }
      ]
    },
    {
      text:`Objectif : acheter un bateau rapidement.`,
      hint:"💡 Vendre vite plutôt que luxe.",
      answers:[
        { label:"400 PO", correct:false },
        { label:"350 PO", correct:false },
        { label:"300 PO", correct:true }
      ],
      finalText:`<strong>Bonne stratégie.</strong><br>
      Les pirates vendent plus vite à 300 PO
      pour acheter leur bateau sans attendre.`
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

        // ===== DERNIÈRE ÉTAPE =====
        if(s.finalText){

          text.innerHTML = s.finalText;
          choices.innerHTML = "";
          hintBtn.classList.add("hidden");

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

});
