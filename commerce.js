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

/* =====================================================
   🎬 VIDÉO INTRO
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const questVideo = document.getElementById("questVideo");
const toggleSound = document.getElementById("toggleSound");
const closeVideo = document.getElementById("closeVideo");

fadeScreen.classList.remove("hidden");
fadeScreen.style.pointerEvents = "none";

questVideo.oncanplay = () => {
  fadeScreen.classList.add("hidden");
  fadeScreen.style.pointerEvents = "auto";
  questVideo.play().catch(()=>{});
};

questVideo.muted = true;

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
   💬 DIALOGUES 1 — INTRO COMMERCE
===================================================== */
function startDialogues1(){
  playDialogues([
    { text:"Bien joué, moussaillons. Lancer une activité demande du courage.", anchor: pirate5 },
    { text:"Le marché est ouvert, capitaine. Nous sommes prêts à vendre.", anchor: pirate2 },
    { text:"Avant de foncer tête baissée, observez. Un bon marchand connaît son marché.", anchor: pirate5 },
    { text:"Qui sont vos clients ? Que recherchent-ils ? À quel prix achètent-ils ?", anchor: pirate5 },
    { text:"Étudiez vos concurrents : leurs forces, leurs erreurs et leur réputation.", anchor: pirate5 },
    { text:"Fixez le bon prix, et les clients viendront naturellement vers vous.", anchor: pirate5 },
    { text:"Comprendre avant d’agir… on a encore beaucoup à apprendre.", anchor: pirate2 }
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
      q:"Pourquoi réaliser des études de marché avant de se lancer ?",
      ok:[1,2],
      a:[
        "Choisir les couleurs de sa boutique",
        "Comprendre les attentes des clients",
        "Identifier la concurrence et la demande"
      ]
    },
    {
      q:"Sur quoi analyser ses concurrents ?",
      ok:[0,2],
      a:[
        "Leur réputation et leur stratégie",
        "Leur lieu de vacances",
        "Leurs prix et leur positionnement"
      ]
    }
  ];

  let i = 0;
  let found = [];

  function step(){
    q1.textContent = quiz[i].q;
    a1.innerHTML = "";
    found = [];

    quiz[i].a.forEach((txt,idx)=>{
      const b = document.createElement("button");
      b.textContent = txt;
      b.onclick = ()=>{
        if(!quiz[i].ok.includes(idx)){
          shake(game1);
          return;
        }
        b.disabled = true;
        b.classList.add("pressed");
        found.push(idx);

        if(found.length === quiz[i].ok.length){
          setTimeout(()=>{
            i++;
            if(i < quiz.length){
              step();
            }else{
              game1.classList.add("hidden");
              showLoader(800, startDialogues2);
            }
          },500);
        }
      };
      a1.appendChild(b);
    });
  }

  step();
}

/* =====================================================
   💬 DIALOGUES 2 — BUSINESS PLAN
===================================================== */
function startDialogues2(){
  playDialogues([
    { text:"Avec ces informations, vous pouvez maintenant bâtir un business plan solide.", anchor: pirate5 },
    { text:"Passons à l’étape suivante.", anchor: pirate2 }
  ], () => showLoader(800, startMiniGame2));
}

/* =====================================================
   🎮 MINI-JEU 2 — BUSINESS PLAN
===================================================== */
function startMiniGame2(){
  game2.classList.remove("hidden");
  visualChoices.innerHTML = "";

  const quiz = [
    { t:"Définir précisément la cible", ok:true },
    { t:"Choisir la couleur du bateau", ok:false },
    { t:"Identifier le problème à résoudre", ok:true }
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
    ["", "images/Businessplancov.png"],
    ["images/Businessplan4.jpg","images/Businessplan1.jpg"],
    ["images/Businessplan4.jpg","images/Businessplan2.jpg"],
    ["images/Businessplan4.jpg","images/Businessplan3.jpg"]
  ];

  let step = 0;
  let loaded = 0;
  const imgs = pages.flat().filter(Boolean);

  imgs.forEach(src=>{
    const img = new Image();
    img.onload = img.onerror = ()=>{
      loaded++;
      if(loaded === imgs.length){
        loader.remove();
        next.classList.remove("hidden");
        update();
      }
    };
    img.src = src;
    if(img.complete) img.onload();
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
    next.classList.toggle("hidden", step === pages.length - 1);
    cont.classList.toggle("hidden", step !== pages.length - 1);
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
    { text:"Le marché est exigeant.", anchor: pirate3 },
    { text:"À toi de définir ta stratégie commerciale.", anchor: pirate5 }
  ], () => showLoader(800, startMiniGame3));
}

/* =====================================================
   🎮 MINI-JEU 3 — STRATÉGIES COMMERCIALES
===================================================== */
function startMiniGame3(){

  game3.classList.remove("hidden");

  const text = document.getElementById("strategyText");
  const choices = document.getElementById("strategyChoices");
  const hint = document.getElementById("strategyHint");
  const hintBtn = document.getElementById("strategyHintBtn");

  let step = 0;

  const steps = [

    /* 1️⃣ PRIX */
    {
      text: `
Les autres vendeurs proposent des pierres précieuses à <strong>300 PO</strong>,
mais ils ne possèdent pas de <strong>pierres rouges</strong>.

Nos pirates vendent des pierres de toutes les couleurs,
y compris des rouges, ce qui les différencie fortement.
Les pierres sont vendues en <strong>lot</strong>.

Quel prix devraient-ils afficher ?
      `,
      hint:"💡 Vous êtes en position de force car vous avez des pierres rouges.",
      answers:[
        {l:"Augmenter le prix – 350 PO",c:true},
        {l:"Prix identique – 300 PO",c:false},
        {l:"Baisser le prix – 250 PO",c:false}
      ]
    },

    /* 2️⃣ PRODUIT */
    {
      text: `
Les autres vendeurs utilisent des sacs de velours.
C’est luxueux, mais ils se trouent facilement
et de nombreux clients perdent leurs pierres.

Nos pirates choisissent des <strong>boîtes en bois</strong>,
plus solides. Elles coûtent <strong>20 PO</strong> à l’unité.

Comment ajuster le prix ?
      `,
      hint:"💡 Le prix des boîtes est déjà inclus dans les 350 PO.",
      answers:[
        {l:"Augmenter le prix – 370 PO",c:false},
        {l:"Prix identique – 350 PO",c:true},
        {l:"Baisser le prix – 330 PO",c:false}
      ]
    },

    /* 3️⃣ VENTE */
    {
      text: `
Les pirates savent que le prix élevé donne une image luxueuse.
Mais les clients sont informés et comparent les vendeurs.

L’objectif principal des pirates est
<strong>d’acheter un bateau le plus rapidement possible</strong>.
      `,
      hint:"💡 L’objectif est de vendre vite.",
      answers:[
        {l:"Augmenter le prix – 400 PO",c:false},
        {l:"Prix identique – 350 PO",c:false},
        {l:"Baisser le prix – 300 PO",c:true}
      ],
      finalText: `
<strong>Bonne stratégie.</strong><br><br>
Les pirates choisissent de vendre à <strong>300 PO</strong>
afin d’attirer plus de clients et de vendre rapidement.

S’ils avaient opté pour une stratégie de luxe,
ils auraient attendu plus longtemps
le temps de construire leur réputation.
      `
    }
  ];

  function render(){
    const cur = steps[step];
    text.innerHTML = cur.text;
    choices.innerHTML = "";
    hint.textContent = cur.hint;
    hint.classList.add("hidden");

    cur.answers.forEach(a=>{
      const b = document.createElement("button");
      b.textContent = a.l;

      b.onclick = ()=>{
        if(!a.c){
          shake(game3);
          return;
        }

        if(cur.finalText){
          text.innerHTML = cur.finalText;
          choices.innerHTML = "";
          hintBtn.classList.add("hidden");

          setTimeout(()=>{
            game3.classList.add("hidden");
            showCommerceWin();
          },3500);
        }else{
          step++;
          render();
        }
      };

      choices.appendChild(b);
    });
  }

  hintBtn.onclick = ()=>hint.classList.remove("hidden");
  render();
}

/* =====================================================
   🏆 VICTOIRE
===================================================== */
function showCommerceWin(){
  showLoader(1000, ()=>{
    sessionStorage.setItem("fromCommerce","true");
    sessionStorage.setItem("unlock_pirate3","true");
    window.location.href = "menu.html";
  });
}

});
