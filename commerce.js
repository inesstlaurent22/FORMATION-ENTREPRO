document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   📌 ÉLÉMENTS DOM
===================================================== */
const background = document.getElementById("background");

const pirate2 = document.getElementById("pirate2bis");
const pirate5 = document.getElementById("pirate5bis");
const pirate3 = document.getElementById("pirate3bis");

const bubbleContainer = document.getElementById("bubbleContainer");
const skipBtn = document.getElementById("skipDialoguesBtn");

/* =====================================================
   🔧 OUTILS
===================================================== */
function vibrate(p = 15) {
  if (navigator.vibrate) navigator.vibrate(p);
}

/* =====================================================
   🌑 LOADER
===================================================== */
const fadeScreen = document.getElementById("fadeScreen");
const loaderBox = fadeScreen.querySelector(".loaderBox");

function showLoader(text, time = 800, cb) {
  loaderBox.innerHTML = text;
  fadeScreen.classList.remove("hidden");

  setTimeout(() => {
    fadeScreen.classList.add("hidden");
    if (typeof cb === "function") cb();
  }, time);
}

/* =====================================================
   🎬 VIDÉO INTRO
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const questVideo = document.getElementById("questVideo");
const toggleSound = document.getElementById("toggleSound");
const closeVideo  = document.getElementById("closeVideo");

questVideo.muted = true;
toggleSound.textContent = "🔇";

toggleSound.onclick = () => {
  questVideo.muted = !questVideo.muted;
  toggleSound.textContent = questVideo.muted ? "🔇" : "🔊";
};

questVideo.addEventListener("ended", endVideo);
closeVideo.addEventListener("click", endVideo);

function endVideo() {
  questVideo.pause();
  videoContainer.style.display = "none";
  showLoader("Chargement...", 800, showBackground);
}

/* =====================================================
   🌅 BACKGROUND + PIRATES
===================================================== */
function showBackground() {
  background.classList.remove("hidden");
  pirate2.classList.remove("hidden");
  pirate5.classList.remove("hidden");
  enablePirate5();
}

/* =====================================================
   🏴‍☠️ PIRATE 5
===================================================== */
function enablePirate5() {
  pirate5.classList.add("interactive");

  pirate5.onmouseenter = () => pirate5.classList.add("glow");
  pirate5.onmouseleave = () => pirate5.classList.remove("glow");

  pirate5.onclick = () => {
    pirate5.style.pointerEvents = "none";
    startDialogues1();
  };
}

/* =====================================================
   💬 DIALOGUES – SYSTÈME ROBUSTE
===================================================== */
let dialogues = [];
let dIndex = 0;
let onDialogueEnd = null;
let dialogueActive = false;

function playDialogues(list, cb) {
  dialogues = list;
  dIndex = 0;
  onDialogueEnd = cb;
  dialogueActive = true;
  skipBtn.classList.remove("hidden");
  renderDialogue();
}

function renderDialogue() {
  if (!dialogueActive) return;

  bubbleContainer.innerHTML = "";
  const d = dialogues[dIndex];
  const r = d.anchor.getBoundingClientRect();

  const bubble = document.createElement("div");
  bubble.className = "dialogue-bubble";
  bubble.innerHTML = d.text;

  let top = r.top - 90;
  if (top < 20) top = r.bottom + 10;

  bubble.style.left = `${r.left + r.width / 2}px`;
  bubble.style.top = `${top}px`;
  bubble.style.transform = "translateX(-50%)";

  bubble.onclick = () => {
    vibrate(10);
    dIndex++;
    dIndex < dialogues.length ? renderDialogue() : endDialogues();
  };

  bubbleContainer.appendChild(bubble);
}

function endDialogues() {
  if (!dialogueActive) return;
  dialogueActive = false;
  bubbleContainer.innerHTML = "";
  skipBtn.classList.add("hidden");
  if (onDialogueEnd) onDialogueEnd();
}

skipBtn.onclick = endDialogues;

/* =====================================================
   💬 DIALOGUES 1 → MINI-JEU 1
===================================================== */
function startDialogues1() {
  playDialogues([
    { text: "Moussaillon ! Bienvenue sur le marché des trésors.", anchor: pirate5 },
    { text: "Créons ton business plan.", anchor: pirate2 }
  ], () => {
    showLoader("Préparation du mini-jeu...", 800, startMiniGame1);
  });
}

/* =====================================================
   🏴‍☠️ MENTOR
===================================================== */
const mentor = document.getElementById("pirateMentor");
const mentorText = document.getElementById("mentorText");

const mentorDialogs = [
  "Tout bon projet commence par l’origine du trésor.",
  "Un capitaine a toujours besoin d’un équipage.",
  "Garde ton objectif en tête.",
  "Observe le marché avant d’agir.",
  "Explique la valeur de ton trésor.",
  "Sans calcul, pas de bateau.",
  "Démarque-toi des autres pirates.",
  "Compte ton or avec soin.",
  "Un plan clair évite les mutineries."
];

function showMentor(step) {
  mentorText.textContent = mentorDialogs[step];
  mentor.classList.remove("hidden");
}

function hideMentor() {
  mentor.classList.add("hidden");
}

/* =====================================================
   🎮 MINI-JEU 1 — BUSINESS PLAN
===================================================== */
const miniGame = document.getElementById("miniGameContainer");
const gameQ = document.getElementById("gameQuestion");
const gameA = document.getElementById("gameAnswers");
const gameF = document.getElementById("gameFeedback");

const steps = [
  { q:"Origine des pierres ?", a:["Coffre secret","Marché","Cadeau"], c:0 },
  { q:"Équipage ?", a:["Capitaine + moussaillons","Capitaine seul","Famille"], c:0 },
  { q:"Objectif ?", a:["Acheter un bateau","Vacances","Décoration"], c:0 },
  { q:"Observer ?", a:["Prix concurrents","Météo","Vêtements"], c:0 },
  { q:"Expliquer ?", a:["Valeur et rareté","Couleur","Taille"], c:0 },
  { q:"Modèle économique ?", a:["Combien vendre","Nettoyer","Compter"], c:0 },
  { q:"Stratégie ?", a:["Bien présenter","Crier","Pas de prix"], c:0 },
  { q:"Plan financier ?", a:["Vérifier l’or","Dessiner","Chanter"], c:0 },
  { q:"Organisation ?", a:["Éviter conflits","Nom perroquet","Sabres"], c:0 }
];

let currentStep = 0;

function startMiniGame1() {
  currentStep = 0;
  miniGame.classList.remove("hidden");
  loadMiniGameStep();
}

function loadMiniGameStep() {
  showMentor(currentStep);
  gameQ.textContent = steps[currentStep].q;
  gameA.innerHTML = "";
  gameF.textContent = "";

  steps[currentStep].a.forEach((txt, i) => {
    const btn = document.createElement("button");
    btn.textContent = txt;
    btn.onclick = () => {
      if (i === steps[currentStep].c) {
        gameF.textContent = "✅ Bonne décision";
        setTimeout(() => {
          currentStep++;
          currentStep < steps.length ? loadMiniGameStep() : endMiniGame1();
        }, 600);
      } else {
        gameF.textContent = "❌ Mauvais choix";
      }
    };
    gameA.appendChild(btn);
  });
}

function endMiniGame1() {
  hideMentor();
  miniGame.classList.add("hidden");
  winMiniGame1();
}

/* =====================================================
   🏆 VICTOIRE MINI-JEU 1 → LIVRE
===================================================== */
function winMiniGame1() {
  loaderBox.innerHTML = `
    <div class="winBravo">BRAVO</div>
    <div class="winText">Tu as gagné</div>
    <div class="winCounter"><span id="poCounter">0</span></div>
    <div class="winText">pièces d’or 💰</div>
  `;
  fadeScreen.classList.remove("hidden");

  let v = 0;
  const counter = document.getElementById("poCounter");
  const interval = setInterval(() => {
    v += 100;
    counter.textContent = v;
    if (v >= 5000) {
      clearInterval(interval);
      fadeScreen.classList.add("hidden");
      showBook();
    }
  }, 30);
}

/* =====================================================
   📖 LIVRE → PIRATE 3
===================================================== */
const bookContainer = document.getElementById("bookContainer");
const leftPage = document.getElementById("leftPage");
const rightPage = document.getElementById("rightPage");
const continueBtn = document.getElementById("continueQuestBtn");
const book = document.querySelector(".book");

const bookSteps = [
  {l:"images/Businessplancov.png", r:"images/Businessplan1.jpg"},
  {l:"images/Businessplancov.png", r:"images/Businessplan2.jpg"},
  {l:"images/Businessplancov.png", r:"images/Businessplan3.jpg"}
];

let bookIndex = 0;

function showBook() {
  bookContainer.classList.remove("hidden");
  bookIndex = 0;
  renderBook();
}

function renderBook() {
  leftPage.src = bookSteps[bookIndex].l;
  rightPage.src = bookSteps[bookIndex].r;
  continueBtn.classList.toggle("hidden", bookIndex !== bookSteps.length - 1);
}

book.onclick = (e) => {
  const mid = book.getBoundingClientRect().left + book.offsetWidth / 2;
  if (e.clientX > mid && bookIndex < bookSteps.length - 1) bookIndex++;
  else if (e.clientX < mid && bookIndex > 0) bookIndex--;
  renderBook();
};

continueBtn.onclick = () => {
  bookContainer.classList.add("hidden");
  spawnPirate3();
};

/* =====================================================
   🏴‍☠️ PIRATE 3 → MINI-JEU 2
===================================================== */
function spawnPirate3() {
  pirate3.classList.remove("hidden");
  pirate3.style.left = "1200px";
  requestAnimationFrame(() => pirate3.style.left = "638px");
  pirate3.onclick = startDialogues2;
}

function startDialogues2() {
  playDialogues([
    { text:"Ces pierres inspirent confiance.", anchor: pirate3 },
    { text:"Mais le marché est exigeant.", anchor: pirate5 }
  ], () => showLoader("Analyse du marché...", 800, startMiniGame2));
}

/* =====================================================
   🎮 MINI-JEU 2
===================================================== */
const merchantGame = document.getElementById("merchantGame");
const clueEl = document.getElementById("clue");

function startMiniGame2() {
  merchantGame.classList.remove("hidden");
  clueEl.textContent = "Analyse le marché avant de décider.";
}

document.getElementById("btnHint").onclick = () => clueEl.textContent = "💡 Peu de concurrence ici.";
document.getElementById("btnLower").onclick = () => clueEl.textContent = "❌ Mauvaise décision.";
document.getElementById("btnKeep").onclick = () => {
  merchantGame.classList.add("hidden");
  startDialogues3();
};

/* =====================================================
   💬 DIALOGUES 3 → BASE DE DONNÉES
===================================================== */
function startDialogues3() {
  playDialogues([
    { text:"Note les coordonnées de tes clients.", anchor: pirate5 },
    { text:"C’est ta base de données.", anchor: pirate2 }
  ], showDatabaseBox);
}

function showDatabaseBox() {
  bubbleContainer.innerHTML = "";
  const box = document.createElement("div");
  box.className = "dialogue-bubble";
  box.style.left = "50%";
  box.style.top = "50%";
  box.style.transform = "translate(-50%, -50%)";
  box.innerHTML = `
    <h2>📦 Base de données</h2>
    <p>Elle te permet de fidéliser tes clients.</p>
    <button>Terminer la quête</button>
  `;
  box.querySelector("button").onclick = winFinal;
  bubbleContainer.appendChild(box);
}

/* =====================================================
   🏁 FIN + GEMS
===================================================== */
function winFinal() {
  bubbleContainer.innerHTML = "";
  showLoader("🎉 Bravo, quête terminée !", 2200);
  launchGems();
  setTimeout(() => {
    localStorage.setItem("mpi_unlocked","true");
    window.location.href = "menu.html";
  }, 2300);
}

function launchGems() {
  const canvas = document.createElement("canvas");
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  canvas.style.position = "fixed";
  canvas.style.inset = 0;
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = 3000;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let gems = [];

  for (let i=0;i<200;i++){
    const a=Math.random()*Math.PI*2;
    const s=Math.random()*10+4;
    gems.push({x:innerWidth/2,y:innerHeight/2,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:90,color:`hsl(${Math.random()*360},100%,60%)`});
  }

  function anim(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    gems.forEach(g=>{
      g.vy+=0.15; g.x+=g.vx; g.y+=g.vy; g.life--;
      ctx.fillStyle=g.color;
      ctx.fillRect(g.x,g.y,4,4);
    });
    gems=gems.filter(g=>g.life>0);
    gems.length?requestAnimationFrame(anim):canvas.remove();
  }
  anim();
}

});
