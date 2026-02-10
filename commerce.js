document.addEventListener("DOMContentLoaded", () => {

   fadeScreen.classList.add("hidden");

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
   VIDÉO INTRO
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
  questVideo.pause();
  questVideo.currentTime = 0;

  videoContainer.classList.add("hidden");

  showLoader(300, showScene);
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
    { text:"Avant de vendre quoi que ce soit, il faut comprendre ton marché.", anchor:pirate5 },
    { text:"Clients, concurrence, besoins, prix… rien ne doit être laissé au hasard.", anchor:pirate5 }
  ], startMiniGame1);
}

/* =====================================================
   MINI-JEU 1 — ÉTUDE DE MARCHÉ
===================================================== */
function startMiniGame1(){
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
    { text:"Parfait. Maintenant, il faut structurer tout ça.", anchor:pirate5 },
    { text:"Un bon business plan évite bien des naufrages.", anchor:pirate5 }
  ], startMiniGame2);
}

/* =====================================================
   MINI-JEU 2 — BUSINESS PLAN
===================================================== */
function startMiniGame2(){
  game2.classList.remove("hidden");
  visualChoices.innerHTML="";
  let success=0;

  [
    {t:"Définir la cible",ok:true},
    {t:"Choisir la couleur du bateau",ok:false},
    {t:"Identifier le problème client",ok:true}
  ].forEach(q=>{
    const b=document.createElement("button");
    b.textContent=q.t;
    b.onclick=()=>{
      if(!q.ok){ shake(game2); return; }
      b.disabled=true;
      success++;
      if(success===2){
        game2.classList.add("hidden");
        showBusinessPlanLoader();
      }
    };
    visualChoices.appendChild(b);
  });
}

/* =====================================================
   📘 LOADER + LIVRE BUSINESS PLAN
===================================================== */
function showBusinessPlanLoader(){

  const overlay = document.createElement("div");
  overlay.id = "identity-loader";
  overlay.innerHTML = `
    <div class="identity-center">
<h2 class="bp-title">Bravo 🎉 Tu as créé ton business plan</h2>

      <div class="book-container">
        <div class="book-loading" id="bookLoading"><span>⏳</span></div>
        <button id="prevPage" class="book-nav-btn hidden">‹</button>

        <div class="book-pages">
          <img id="leftPage" class="hidden">
          <img id="rightPage">
        </div>

        <button id="nextPage" class="book-nav-btn hidden">›</button>
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
  const loader = overlay.querySelector("#bookLoading");

  const pages=[
    ["","images/Businessplancov.png"],
    ["images/Businessplan4.png","images/Businessplan1.png"],
    ["images/Businessplan4.png","images/Businessplan2.png"],
    ["images/Businessplan4.png","images/Businessplan3.png"]
  ];

  const allImages = pages.flat().filter(Boolean);
  let loaded=0, step=0;

  allImages.forEach(src=>{
    const img=new Image();
    img.onload=img.onerror=()=>{
      loaded++;
      if(loaded===allImages.length){
        loader.remove();
        next.classList.remove("hidden");
        update();
      }
    };
    img.src=src;
    if(img.complete) img.onload();
  });

  function update(){
    const [l,r]=pages[step];
    if(l){ left.src=l; left.classList.remove("hidden"); prev.classList.remove("hidden"); }
    else{ left.classList.add("hidden"); prev.classList.add("hidden"); }
    right.src=r;
    next.classList.toggle("hidden",step===pages.length-1);
    cont.classList.toggle("hidden",step!==pages.length-1);
  }

  next.onclick=()=>{ step++; update(); };
  prev.onclick=()=>{ step--; update(); };

  cont.onclick=()=>{
    overlay.remove();
    showLoader(800, startDialogues3);
  };
}

/* =====================================================
   DIALOGUES 3
===================================================== */
function startDialogues3(){
  playDialogues([
    { text:"Ton plan est prêt. Il est temps d’affronter le marché.", anchor:pirate5 },
    { text:"Chaque décision aura un impact direct sur tes ventes.", anchor:pirate5 }
  ], spawnPirate3);
}

/* =====================================================
   PIRATE 3 → MINI-JEU 3
===================================================== */
function spawnPirate3(){
  pirate3.classList.remove("hidden");
  pirate3.classList.add("glowStart");
  pirate3.style.pointerEvents = "auto"; // FIX

  pirate3.onclick=()=>{
    pirate3.classList.remove("glowStart");
    showLoader(800, startMiniGame3);
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
        {label:"350 PO",correct:true},
        {label:"300 PO",correct:false},
        {label:"250 PO",correct:false}
      ]
    },
    {
      text:`Vous ajoutez des boîtes en bois (20 PO).
      Comment ajuster le prix ?`,
      hint:"💡 Le coût est déjà intégré.",
      answers:[
        {label:"370 PO",correct:false},
        {label:"350 PO",correct:true},
        {label:"330 PO",correct:false}
      ]
    },
    {
      text:`Objectif : acheter un bateau rapidement.`,
      hint:"💡 Vendre vite plutôt que luxe.",
      answers:[
        {label:"400 PO",correct:false},
        {label:"350 PO",correct:false},
        {label:"300 PO",correct:true}
      ],
      finalText:`<strong>Bonne stratégie.</strong><br>
      Les pirates vendent plus vite à 300 PO
      pour acheter leur bateau sans attendre.`
    }
  ];

function render(){
  const s = steps[step];

  // Texte principal
  text.innerHTML = s.text;

  // Reset UI
  choices.innerHTML = "";
  hintBox.classList.add("hidden");
  hintBox.innerHTML = s.hint;

  // Réponses
  s.answers.forEach(a=>{
    const b = document.createElement("button");
    b.textContent = a.label;

    b.onclick = ()=>{
      if(!a.correct){
        shake(game3);
        return;
      }

      // Empêche double clic
      b.disabled = true;

      // Dernière étape
      if(s.finalText){
        text.innerHTML = s.finalText;
        choices.innerHTML = "";
        hintBtn.classList.add("hidden");

        setTimeout(()=>{
          game3.classList.add("hidden");
          showLoader(1000, showCommerceWin);
        }, 3200);

      }else{
        step++;
        render();
      }
    };

    choices.appendChild(b);
  });
}

// Bouton indice
hintBtn.onclick = ()=>{
  hintBox.classList.remove("hidden");
};

// Lancement initial
render();

/* =====================================================
   🏆 VICTOIRE + EXPLOSION + REDIRECTION
===================================================== */
function showCommerceWin(){
  showLoader(1000, ()=>{
    const overlay=document.createElement("div");
    overlay.id="commerce-win";
    overlay.innerHTML=`
      <div class="win-box">
        <h2>🏴‍☠️ Bravo !</h2>
        <p>Tu as terminé la quête Commerce</p>
        <div class="gems-container"></div>
      </div>`;
    document.body.appendChild(overlay);

    requestAnimationFrame(()=>{
      launchGemsExplosion(overlay.querySelector(".gems-container"));
    });

    sessionStorage.setItem("fromCommerce","true");
    sessionStorage.setItem("unlock_pirate4","true");

    setTimeout(()=>{ window.location.href="menu.html"; },4200);
  });
}

/* =====================================================
   💎 GEMS
===================================================== */
function launchGemsExplosion(container){
  const colors = ["#ffd700","#00f2ff","#ff4fd8","#7cff00","#ff8c00"];

  for(let i=0;i<50;i++){
    const gem = document.createElement("div");
    gem.className = "gem";
    const size = Math.random()*10 + 8;
    gem.style.width = size+"px";
    gem.style.height = size+"px";
    gem.style.background = colors[Math.floor(Math.random()*colors.length)];
    gem.style.left = "50%";
    gem.style.top = "50%";

    const angle = Math.random()*Math.PI*2;
    const distance = Math.random()*260 + 80;
    gem.style.setProperty("--x", Math.cos(angle)*distance+"px");
    gem.style.setProperty("--y", Math.sin(angle)*distance+"px");

    container.appendChild(gem);
  }
}

});
