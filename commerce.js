document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   📌 ELEMENTS DOM
===================================================== */
const background = document.getElementById("background");
const pirate2 = document.getElementById("pirate2bis");
const pirate5 = document.getElementById("pirate5bis");
const pirate3 = document.getElementById("pirate3bis");

/* =====================================================
   🌑 LOADER GLOBAL
===================================================== */
const fadeScreen = document.getElementById("fadeScreen");
const loaderBox = fadeScreen.querySelector(".loaderBox");

/* =====================================================
   ⏳ SABLIER / LOADER LIVRE
===================================================== */
const bookLoader = document.getElementById("bookLoader");

/* =====================================================
   🎬 VIDEO
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const questVideo = document.getElementById("questVideo");
const toggleSound = document.getElementById("toggleSound");
const closeVideo = document.getElementById("closeVideo");

questVideo.muted = true;

toggleSound.onclick = () => {
  questVideo.muted = !questVideo.muted;
  toggleSound.textContent = questVideo.muted ? "🔇" : "🔊";
};

questVideo.onended = endVideo;
closeVideo.onclick = endVideo;

function endVideo() {
  questVideo.pause();
  videoContainer.style.display = "none";
  showBackground();
}

/* =====================================================
   🔧 LOADER UTILITAIRE
===================================================== */
function showLoader(text, time = 1200, cb) {
  loaderBox.innerHTML = text;
  fadeScreen.classList.remove("hidden");
  setTimeout(() => {
    fadeScreen.classList.add("hidden");
    cb && cb();
  }, time);
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
   🏴‍☠️ PIRATE 5 → DIALOGUES 1
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
   💬 DIALOGUES SYSTEME
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

  bubble.style.left = (r.left + r.width / 2) + "px";
  bubble.style.top = (r.top - 140 < 20 ? r.bottom + 20 : r.top - 140) + "px";
  bubble.style.transform = "translateX(-50%)";

  bubble.onclick = () => {
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
  ], startMiniGame1);
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
          setTimeout(winMiniGame1, 800);
        } else {
          gameF.textContent = "❌ Mauvais choix";
        }
      };
      gameA.appendChild(b);
    });
}

/* =====================================================
   🏆 FIN MINI-JEU 1 → LOADER + COMPTEUR
===================================================== */
function winMiniGame1() {
  miniGame.classList.add("hidden");

  let gold = 0;
  fadeScreen.classList.remove("hidden");
  loaderBox.innerHTML = `
    <div class="winBravo">BRAVO 🎉</div>
    <div><span id="goldCounter">0</span> pièces d’or</div>
  `;

  const counter = document.getElementById("goldCounter");
  const interval = setInterval(() => {
    gold += 100;
    counter.textContent = gold;
    if (gold >= 5000) {
      clearInterval(interval);
      setTimeout(() => {
        fadeScreen.classList.add("hidden");
        showBook();
      }, 800);
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
  book.classList.remove("page-turn");
  void book.offsetWidth;
  book.classList.add("page-turn");

  leftPage.src = bookSteps[bookIndex].left;
  rightPage.src = bookSteps[bookIndex].right;

  continueBtn.classList.toggle("hidden", bookIndex !== bookSteps.length - 1);
}

book.addEventListener("click", (e) => {
  const mid = book.getBoundingClientRect().left + book.offsetWidth / 2;
  if (e.clientX > mid && bookIndex < bookSteps.length - 1) {
    bookIndex++;
    renderBook();
  }
});

continueBtn.onclick = () => {
  bookContainer.classList.add("hidden");
  spawnPirate3();
};

/* =====================================================
   🏴‍☠️ PIRATE 3 APPARITION
===================================================== */
function spawnPirate3() {
  pirate3.classList.remove("hidden");
  pirate3.style.left = "900px";
  pirate3.style.transition = "none";

  requestAnimationFrame(() => {
    pirate3.style.transition = "left 1s ease-out";
    pirate3.style.left = "638px";
  });

  pirate3.addEventListener("click", startDialogues2, { once: true });
}

/* =====================================================
   💬 DIALOGUES 2
===================================================== */
function startDialogues2() {
  playDialogues([
    { text: "Ces pierres inspirent confiance.", anchor: pirate3 },
    { text: "Mais le marché est exigeant.", anchor: pirate5 }
  ], startMiniGame2);
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

document.getElementById("btnKeep").onclick = () => {
  merchantGame.classList.add("hidden");
  startDialogues3();
};

/* =====================================================
   💬 DIALOGUES 3
===================================================== */
function startDialogues3() {
  playDialogues([
    { text: "Note les coordonnées de tes clients.", anchor: pirate5 },
    { text: "C’est ton business plan.", anchor: pirate2 }
  ], showBusinessPlanBox);
}

/* =====================================================
   📦 BUSINESS PLAN
===================================================== */
function showBusinessPlanBox() {
  bubbleContainer.innerHTML = "";

  const box = document.createElement("div");
  box.className = "dialogue-bubble";
  box.style.left = "50%";
  box.style.top = "50%";
  box.style.transform = "translate(-50%,-50%)";

  box.innerHTML = `
    <h2 class="dbTitle">📜 Business Plan</h2>
    <p>Tu possèdes maintenant les bases pour bâtir ton empire.</p>
    <button>Valider</button>
  `;

  box.querySelector("button").onclick = winFinal;
  bubbleContainer.appendChild(box);
}

/* =====================================================
   🏁 FIN
===================================================== */
function winFinal() {
  showLoader("🎉 Bravo, tu as gagné cette quête", 2000, () => {
    launchGems();
    setTimeout(() => window.location.href = "menu.html", 2500);
  });
}

/* =====================================================
   💎 EXPLOSION GEMS
===================================================== */
function launchGems() {
  for (let i = 0; i < 60; i++) {
    const g = document.createElement("div");
    g.textContent = "💎";
    g.style.position = "fixed";
    g.style.left = "50%";
    g.style.top = "50%";
    g.style.fontSize = "24px";
    g.style.transform =
      `translate(-50%,-50%) translate(${Math.random()*500-250}px,${Math.random()*500-250}px)`;
    g.style.transition = "all 1.5s ease-out";
    document.body.appendChild(g);
    setTimeout(() => g.remove(), 1500);
  }
}

});
