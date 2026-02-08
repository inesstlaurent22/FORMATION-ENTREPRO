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
const btnKeep = document.getElementById("btnKeep");

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
  showLoader(1200, showScene);
}

/* =====================================================
   🌑 LOADER SIMPLE
===================================================== */
function showLoader(duration = 1200, cb){
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

  // ⛔ Ne jamais réactiver l’illumination après clic
  if(!pirate5Locked){
    pirate5.classList.add("glowStart");
  }

  pirate5.onclick = () => {
    pirate5Locked = true;                 // ⬅️ verrou définitif
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
   💬 DIALOGUES 1  ✅ CONSERVÉS
===================================================== */
function startDialogues1() {
  playDialogues([
    { text: "Bien joué, moussaillons. Lancer son activité demande du courage.", anchor: pirate5 },
    { text: "Merci capitaine ! Le marché est ouvert, on est prêts à vendre.", anchor: pirate2 },
    { text: "Avant de foncer, observez. Un bon marchand connaît son marché.", anchor: pirate5 },
    { text: "Qui sont vos clients ? Qu’achètent-ils ? À quel prix ?", anchor: pirate5 },
    { text: "Étudiez vos concurrents : leur réputation, leurs forces, leurs erreurs.", anchor: pirate5 },
    { text: "Fixez le bon prix, et les clients viendront d’abord chez vous.", anchor: pirate5 },
    { text: "Comprendre avant d’agir… on a encore à apprendre.", anchor: pirate2 }
  ], () => showLoader(1000, startMiniGame1));
}

/* =====================================================
   SHAKE MAUVAISE RÉPONSE
===================================================== */
   
function shake(element){
  element.classList.add("screen-shake");
  setTimeout(() => {
    element.classList.remove("screen-shake");
  }, 400);
}
   
/* =====================================================
   🎮 MINI-JEU 1 — MULTI BONNES RÉPONSES 
===================================================== */
function startMiniGame1() {
  game1.classList.remove("hidden");

  const quiz = [
    {
      q: "Pourquoi réaliser des études de marché avant de se lancer ?",
      ok: [1, 2],
      a: [
        "Choisir les couleurs de sa boutique",
        "Comprendre les attentes des clients",
        "Identifier la concurrence et la demande du marché"
      ]
    },
    {
      q: "Sur quoi dois-tu analyser tes concurrents ?",
      ok: [0, 2],
      a: [
        "Leur réputation et leur stratégie",
        "Leur lieu de vacances",
        "Leurs prix et leur positionnement"
      ]
    },
    {
      q: "Pourquoi faut-il réaliser des études de produit ?",
      ok: [0, 1],
      a: [
        "S’assurer que le produit répond aux besoins des clients",
        "Améliorer le produit et se différencier",
        "Créer un produit sans objectif précis"
      ]
    },
    {
      q: "Après avoir analysé les prix des concurrents, quelles stratégies sont possibles pour fixer tes prix ?",
      ok: [0, 1],
      a: [
        "S’aligner sur les prix du marché",
        "Proposer un prix plus élevé en offrant plus de valeur",
        "Fixer un prix au hasard"
      ]
    }
  ];

  let i = 0;
  let found = [];

  function step() {
    q1.innerHTML = quiz[i].q;
    a1.innerHTML = "";
    found = [];

    quiz[i].a.forEach((t, idx) => {
      const b = document.createElement("button");
      b.textContent = t;

      b.onclick = () => {
        if (!quiz[i].ok.includes(idx)) return;
        if (found.includes(idx)) return;

        found.push(idx);
        b.classList.add("pressed");
        b.disabled = true;

        if (found.length === quiz[i].ok.length) {
          setTimeout(() => {
            i++;
            if (i < quiz.length) {
              step();
            } else {
              game1.classList.add("hidden");
              showScene();
              startDialogues2();
            }
          }, 600);
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
  ], () => showLoader(1000, startMiniGame2));
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
      b.disabled = true;
      if(q.ok){
        success++;
if(success === 2){
  game2.classList.add("hidden");

  // ⬅️ arrêt illumination pirate5 après mini-jeu 2
  pirate5.classList.remove("glowStart");

  showLoader(800, spawnPirate3);
}
      }
    };
    visualChoices.appendChild(b);
  });
}

/* =====================================================
   🏴‍☠️ PIRATE 3
===================================================== */
function spawnPirate3(){
  pirate5.classList.remove("glowStart"); // ⬅️ stop illumination pirate5

  pirate3.classList.remove("hidden");
  pirate3.classList.add("glowStart");

pirate3.onclick = ()=>{
  pirate3.classList.remove("glowStart");   // ⬅️ stop glow immédiatement
  pirate3.style.pointerEvents = "none";    // ⬅️ évite double clic
  startFinalDialogues();
};
}

/* =====================================================
   💬 DIALOGUES FINAUX
===================================================== */
function startFinalDialogues(){
  playDialogues([
    { text:"Le marché est exigeant.", anchor: pirate3 },
    { text:"À toi de choisir ta stratégie.", anchor: pirate5 }
  ], () => showLoader(800, startMiniGame3));
}

/* =====================================================
   🎮 MINI-JEU 3
===================================================== */
function startMiniGame3(){
  game3.classList.remove("hidden");
  btnKeep.onclick = ()=>{
    game3.classList.add("hidden");
    showCommerceWin();
  };
}

/* =====================================================
   🏆 VICTOIRE + EXPLOSION
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

    requestAnimationFrame(()=>{
      launchGemsExplosion(overlay.querySelector(".gems-container"));
    });

    /* =====================================================
       ✅ FLAGS MENU (CRUCIAL)
    ===================================================== */
    sessionStorage.setItem("fromCommerce", "true");        // ➜ déclenche le mot de passe
    sessionStorage.setItem("unlock_pirate3", "true");     // ➜ débloque pirate 3

    setTimeout(()=>{
      window.location.href = "menu.html";
    },4200);
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
