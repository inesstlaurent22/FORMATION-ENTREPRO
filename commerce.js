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
   🎬 VIDÉO
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const questVideo = document.getElementById("questVideo");
const toggleSound = document.getElementById("toggleSound");
const closeVideo  = document.getElementById("closeVideo");

questVideo.muted = true;

toggleSound.addEventListener("click", () => {
  questVideo.muted = !questVideo.muted;
  toggleSound.textContent = questVideo.muted ? "🔇" : "🔊";
});

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
   🏴‍☠️ PIRATE 5 (jamais grisé)
===================================================== */
function enablePirate5() {
  pirate5.classList.add("interactive");

  pirate5.addEventListener("mouseenter", () => pirate5.classList.add("glow"));
  pirate5.addEventListener("mouseleave", () => pirate5.classList.remove("glow"));

  pirate5.addEventListener("click", () => {
    pirate5.style.pointerEvents = "none";
    startDialogues1();
  }, { once: true });
}

/* =====================================================
   💬 DIALOGUES – SYSTÈME
===================================================== */
let dialogues = [];
let dIndex = 0;
let onDialogueEnd = null;
let dialogueFinished = false;

function playDialogues(list, cb) {
  dialogues = list;
  dIndex = 0;
  onDialogueEnd = cb;
  dialogueFinished = false;
  skipBtn.classList.remove("hidden");
  renderDialogue();
}

function renderDialogue() {
  if (dialogueFinished) return;

  bubbleContainer.innerHTML = "";
  const d = dialogues[dIndex];
  const r = d.anchor.getBoundingClientRect();

  const bubble = document.createElement("div");
  bubble.className = "dialogue-bubble";
  bubble.innerHTML = d.text;

  /* bulles plus proches des pirates */
  let top = r.top - 90;
  if (top < 20) top = r.bottom + 10;

  bubble.style.left = `${r.left + r.width / 2}px`;
  bubble.style.top = `${top}px`;
  bubble.style.transform = "translateX(-50%)";

  bubble.addEventListener("click", () => {
    vibrate(10);
    dIndex++;
    dIndex < dialogues.length ? renderDialogue() : endDialogues();
  });

  bubbleContainer.appendChild(bubble);
}

function endDialogues() {
  if (dialogueFinished) return;
  dialogueFinished = true;
  bubbleContainer.innerHTML = "";
  skipBtn.classList.add("hidden");
  if (typeof onDialogueEnd === "function") onDialogueEnd();
}

skipBtn.addEventListener("click", endDialogues);

/* =====================================================
   💬 DIALOGUES 1
===================================================== */
function startDialogues1() {
  playDialogues([
    { text: "Moussaillon ! Bienvenue sur le marché des trésors.", anchor: pirate5 },
    { text: "Créons ton business plan.", anchor: pirate2 }
  ], () => showLoader("Chargement...", 800, startMiniGame1));
}

const mentor = document.getElementById("pirateMentor");
const mentorText = document.getElementById("mentorText");

const mentorDialogs = [
  "Tout bon projet commence par l’origine du trésor…",
  "Un capitaine n’avance jamais sans équipage.",
  "Garde ton objectif en tête, moussaillon !",
  "Observe bien le marché avant d’agir.",
  "Explique toujours la valeur de ton trésor.",
  "Sans calcul, pas de bateau !",
  "Démarque-toi des autres pirates.",
  "Compte ton or avant de lever l’ancre.",
  "Un trésor bien organisé évite les mutineries."
];

function showMentor(step) {
  if (!mentor || !mentorText) return;

  mentorText.textContent = mentorDialogs[step] || "Bonne chance, capitaine !";
  mentor.classList.remove("hidden");
}

function hideMentor() {
  if (!mentor) return;
  mentor.classList.add("hidden");
}

/* =====================================================
   🎮 MINI-JEU 1
===================================================== */
const miniGame = document.getElementById("miniGameContainer");
const gameQ = document.getElementById("gameQuestion");
const gameA = document.getElementById("gameAnswers");
const gameF = document.getElementById("gameFeedback");

function startMiniGame1() {
  miniGame.classList.remove("hidden");
  gameQ.textContent = "Quelle est la première étape ?";
  gameA.innerHTML = "";
  gameF.textContent = "";

  ["Acheter un bateau", "Définir clairement son offre", "Fixer les prix"]
    .forEach((txt, i) => {
      const btn = document.createElement("button");
      btn.textContent = txt;
      btn.onclick = () => {
        if (i === 1) {
          gameF.textContent = "✅ Bonne décision";
          setTimeout(winMiniGame1, 900);
        } else {
          gameF.textContent = "❌ Mauvais choix";
        }
      };
      gameA.appendChild(btn);
    });
}

/* =====================================================
   🏆 VICTOIRE MINI-JEU 1
===================================================== */
function winMiniGame1() {
  miniGame.classList.add("hidden");

  loaderBox.innerHTML = `
    <div class="winBravo">BRAVO</div>
    <div class="winText">Tu as gagné</div>
    <div class="winCounter"><span id="poCounter">0</span></div>
    <div class="winText">pièces d’or 💰</div>
    <div class="winText">et ton business plan 🎁</div>
  `;

  fadeScreen.classList.remove("hidden");

  let value = 0;
  const counter = document.getElementById("poCounter");
  const interval = setInterval(() => {
    value += 100;
    counter.textContent = value;
    if (value >= 5000) {
      clearInterval(interval);
      setTimeout(() => {
        fadeScreen.classList.add("hidden");
        showBook();
      }, 1000);
    }
  }, 30);
}

/* =====================================================
   📖 LIVRE
===================================================== */
const bookContainer = document.getElementById("bookContainer");
const leftPage = document.getElementById("leftPage");
const rightPage = document.getElementById("rightPage");
const continueBtn = document.getElementById("continueQuestBtn");
const book = document.querySelector(".book");

const bookSteps = [
  { left: "images/Businessplancov.png", right: "images/Businessplan1.jpg" },
  { left: "images/Businessplancov.png", right: "images/Businessplan2.jpg" },
  { left: "images/Businessplancov.png", right: "images/Businessplan3.jpg" }
];

let bookIndex = 0;

function showBook() {
  bookContainer.classList.remove("hidden");
  bookIndex = 0;
  renderBook();
}

function renderBook() {
  leftPage.src = bookSteps[bookIndex].left;
  rightPage.src = bookSteps[bookIndex].right;
  continueBtn.classList.toggle("hidden", bookIndex !== bookSteps.length - 1);
}

book.addEventListener("click", (e) => {
  const rect = book.getBoundingClientRect();
  const mid = rect.left + rect.width / 2;

  if (e.clientX > mid && bookIndex < bookSteps.length - 1) {
    bookIndex++;
    renderBook();
  } else if (e.clientX < mid && bookIndex > 0) {
    bookIndex--;
    renderBook();
  }
});

continueBtn.addEventListener("click", () => {
  bookContainer.classList.add("hidden");
  spawnPirate3();
});

/* =====================================================
   🏴‍☠️ PIRATE 3 – ARRIVÉE DROITE
===================================================== */
function spawnPirate3() {
  pirate3.classList.remove("hidden");
  pirate3.style.transition = "none";
  pirate3.style.left = "1200px";

  requestAnimationFrame(() => {
    pirate3.style.transition = "left 1s ease-out";
    pirate3.style.left = "638px";
  });

  pirate3.addEventListener("mouseenter", () => pirate3.classList.add("glow"));
  pirate3.addEventListener("mouseleave", () => pirate3.classList.remove("glow"));

  pirate3.addEventListener("click", () => {
    pirate3.style.pointerEvents = "none";
    startDialogues2();
  }, { once: true });
}

/* =====================================================
   💬 DIALOGUES 2
===================================================== */
function startDialogues2() {
  playDialogues([
    { text: "Ces pierres inspirent confiance.", anchor: pirate3 },
    { text: "Mais le marché est exigeant.", anchor: pirate5 }
  ], () => showLoader("Chargement...", 800, startMiniGame2));
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

document.getElementById("btnHint").onclick = () => {
  clueEl.textContent = "💡 Peu de concurrence sur ce port.";
};

document.getElementById("btnKeep").onclick = () => {
  merchantGame.classList.add("hidden");
  startDialogues3();
};

document.getElementById("btnLower").onclick = () => {
  clueEl.textContent = "❌ Mauvaise décision.";
};

/* =====================================================
   💬 DIALOGUES 3
===================================================== */
function startDialogues3() {
  playDialogues([
    { text: "Note les coordonnées de tes clients.", anchor: pirate5 },
    { text: "C’est ta base de données.", anchor: pirate2 }
  ], showDatabaseBox);
}

/* =====================================================
   📦 BASE DE DONNÉES
===================================================== */
function showDatabaseBox() {
  bubbleContainer.innerHTML = "";
  skipBtn.classList.add("hidden");

  const box = document.createElement("div");
  box.className = "dialogue-bubble";
  box.style.left = "50%";
  box.style.top = "50%";
  box.style.transform = "translate(-50%, -50%)";

  box.innerHTML = `
    <h2 class="dbTitle">La base de données</h2>
    <div class="dbSeparator"></div>
    <p>Elle te permet de fidéliser tes clients et de bâtir ton empire.</p>
    <button class="finalBtn">Terminer la quête</button>
  `;

  box.querySelector("button").addEventListener("click", winFinal);
  bubbleContainer.appendChild(box);
}

/* =====================================================
   🏁 FIN COMMERCE – GEMS PENDANT LOADER
===================================================== */
function winFinal() {
  bubbleContainer.innerHTML = "";

  showLoader("🎉 Bravo, tu as gagné cette quête", 2200);
  launchGems();

  setTimeout(() => {
    localStorage.setItem("mpi_unlocked", "true");
    window.location.href = "menu.html";
  }, 2300);
}

/* =====================================================
   💎 EXPLOSION DE GEMS
===================================================== */
function launchGems() {
  const canvas = document.createElement("canvas");
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  canvas.style.position = "fixed";
  canvas.style.inset = 0;
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = 3100;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let gems = [];

  for (let i = 0; i < 200; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 10 + 4;
    gems.push({
      x: innerWidth / 2,
      y: innerHeight / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 90,
      color: `hsl(${Math.random() * 360},100%,60%)`
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gems.forEach(g => {
      g.vy += 0.15;
      g.x += g.vx;
      g.y += g.vy;
      g.life--;
      ctx.fillStyle = g.color;
      ctx.fillRect(g.x, g.y, 4, 4);
    });
    gems = gems.filter(g => g.life > 0);
    gems.length ? requestAnimationFrame(animate) : canvas.remove();
  }

  animate();
}

});
