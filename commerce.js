document.addEventListener("DOMContentLoaded", () => {

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
    cb && cb();
  }, time);
}

/* =====================================================
   🎬 VIDÉO INTRO
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const questVideo = document.getElementById("questVideo");
const toggleSound = document.getElementById("toggleSound");
const closeVideo = document.getElementById("closeVideo");

const background = document.getElementById("background");
const pirate2 = document.getElementById("pirate2bis");
const pirate5 = document.getElementById("pirate5bis");
const pirate3 = document.getElementById("pirate3bis");

let videoFinished = false;

/* état initial */
questVideo.muted = true;
toggleSound.textContent = "🔇";

/* 🔊 toggle son */
toggleSound.addEventListener("click", (e) => {
  e.preventDefault();
  questVideo.muted = !questVideo.muted;
  toggleSound.textContent = questVideo.muted ? "🔇" : "🔊";

  setTimeout(endVideo, 300);
});

/* ⏭ PASSER LA VIDÉO */
closeVideo.addEventListener("click", (e) => {
  e.preventDefault();
  endVideo();
});

/* 🎞️ FIN NATURELLE */
questVideo.addEventListener("ended", endVideo);

/* 🔥 TRANSITION UNIQUE */
function endVideo() {
  if (videoFinished) return;
  videoFinished = true;

  questVideo.pause();
  videoContainer.classList.add("hidden");

  background.classList.remove("hidden");
  pirate2.classList.remove("hidden");
  pirate5.classList.remove("hidden");

  enablePirate5();
}

/* =====================================================
   🏴‍☠️ PIRATE 5
===================================================== */
function enablePirate5() {
  pirate5.addEventListener("mouseenter", () => pirate5.classList.add("glow"));
  pirate5.addEventListener("mouseleave", () => pirate5.classList.remove("glow"));

  pirate5.addEventListener("click", () => {
    pirate5.classList.remove("glow");
    pirate5.style.pointerEvents = "none";
    startDialogues1();
  }, { once: true });
}

/* =====================================================
   💬 DIALOGUES — SYSTÈME
===================================================== */
const bubbleContainer = document.getElementById("bubbleContainer");
const skipBtn = document.getElementById("skipDialoguesBtn");

let dialogues = [];
let dIndex = 0;
let onDialogueEnd = null;

function playDialogues(list, cb) {
  dialogues = list;
  dIndex = 0;
  onDialogueEnd = cb;
  skipBtn.classList.remove("hidden");
  renderDialogue();
}

function renderDialogue() {
  bubbleContainer.innerHTML = "";
  const d = dialogues[dIndex];
  const r = d.anchor.getBoundingClientRect();

  const bubble = document.createElement("div");
  bubble.className = "dialogue-bubble";
  bubble.innerHTML = d.text;

  let top = r.top - 140;
  if (top < 20) top = r.bottom + 20;

  bubble.style.left = (r.left + r.width / 2) + "px";
  bubble.style.top = top + "px";
  bubble.style.transform = "translateX(-50%)";

  bubble.onclick = () => {
    vibrate(10);
    dIndex++;
    dIndex < dialogues.length ? renderDialogue() : endDialogues();
  };

  bubbleContainer.appendChild(bubble);
}

function endDialogues() {
  bubbleContainer.innerHTML = "";
  skipBtn.classList.add("hidden");
  onDialogueEnd && onDialogueEnd();
}

skipBtn.onclick = endDialogues;

/* =====================================================
   💬 DIALOGUES 1
===================================================== */
function startDialogues1() {
  playDialogues([
    { text: "Moussaillon ! Bienvenue sur le marché des trésors.", anchor: pirate5 },
    { text: "Créons ton business plan.", anchor: pirate2 }
  ], () => showLoader("Chargement...", 800, startMiniGame1));
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
      const b = document.createElement("button");
      b.textContent = txt;
      b.onclick = () => {
        if (i === 1) {
          gameF.textContent = "✅ Bonne décision";
          setTimeout(winMiniGame1, 900);
        } else {
          gameF.textContent = "❌ Mauvais choix";
        }
      };
      gameA.appendChild(b);
    });
}

/* =====================================================
   🏆 RÉUSSITE MINI-JEU 1
===================================================== */
function winMiniGame1() {
  miniGame.classList.add("hidden");

  loaderBox.innerHTML = `
    <div class="winBravo">BRAVO 🎉</div>
    <div class="winText">Tu as gagné</div>
    <div class="winCounter"><span id="poCounter">0</span></div>
    <div class="winText">pièces d’or 💰</div>
    <div class="winText">et ton business plan 🎁</div>
  `;
  fadeScreen.classList.remove("hidden");

  let v = 0;
  const counter = document.getElementById("poCounter");
  const i = setInterval(() => {
    v += 100;
    counter.textContent = v;
    if (v >= 5000) {
      clearInterval(i);
      setTimeout(() => {
        fadeScreen.classList.add("hidden");
        showBook();
      }, 1200);
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
  const step = bookSteps[bookIndex];
  leftPage.src = step.left;
  rightPage.src = step.right;
  continueBtn.classList.toggle("hidden", bookIndex !== bookSteps.length - 1);
}

book.addEventListener("click", (e) => {
  const rect = book.getBoundingClientRect();
  const middle = rect.left + rect.width / 2;

  if (e.clientX > middle && bookIndex < bookSteps.length - 1) {
    bookIndex++;
    renderBook();
  }

  if (e.clientX < middle && bookIndex > 0) {
    bookIndex--;
    renderBook();
  }
});

continueBtn.addEventListener("click", () => {
  bookContainer.classList.add("hidden");
  spawnPirate3Animated();
});

/* =====================================================
   🏴‍☠️ PIRATE 3
===================================================== */
function spawnPirate3Animated() {
  pirate3.classList.remove("hidden");
  pirate3.style.transition = "none";
  pirate3.style.right = "-300px";

  requestAnimationFrame(() => {
    pirate3.style.transition = "right 1s ease-out";
    pirate3.style.right = "120px";
  });

  pirate3.addEventListener("mouseenter", () => pirate3.classList.add("glow"));
  pirate3.addEventListener("mouseleave", () => pirate3.classList.remove("glow"));

  pirate3.addEventListener("click", () => {
    pirate3.classList.remove("glow");
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
  box.style.transform = "translate(-50%,-50%)";

  box.innerHTML = `
    <h2 style="color:gold;text-align:center">📜 Base de données</h2>
    <p>Elle te permet de fidéliser tes clients et de bâtir ton empire.</p>
    <button class="finalBtn">Sceller cette connaissance</button>
  `;

  box.querySelector("button").onclick = winFinal;
  bubbleContainer.appendChild(box);
}

/* =====================================================
   🏁 FIN
===================================================== */
function winFinal() {
  bubbleContainer.innerHTML = "";
  showLoader("🎉 Bravo, tu as gagné cette quête", 2000, launchFireworks);
}

/* =====================================================
   🎆 FEUX D’ARTIFICE
===================================================== */
function launchFireworks() {
  const canvas = document.createElement("canvas");
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  canvas.style.position = "fixed";
  canvas.style.inset = 0;
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = 5000;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let particles = [];

  for (let i = 0; i < 180; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = Math.random() * 8 + 4;
    particles.push({
      x: innerWidth / 2,
      y: innerHeight / 2,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s,
      life: 100,
      c: `hsl(${Math.random() * 360},100%,60%)`
    });
  }

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.vy += 0.12;
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      ctx.fillStyle = p.c;
      ctx.fillRect(p.x, p.y, 3, 3);
    });
    particles = particles.filter(p => p.life > 0);
    particles.length ? requestAnimationFrame(update) : canvas.remove();
  }

  update();
}

});
