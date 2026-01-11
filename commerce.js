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
   ⏳ SABLIER LIVRE
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
  showLoader("Chargement...", 800, showBackground);
}

/* =====================================================
   🔧 LOADER
===================================================== */
function showLoader(text, time = 1000, cb) {
  loaderBox.textContent = text;
  fadeScreen.classList.remove("hidden");
  setTimeout(() => {
    fadeScreen.classList.add("hidden");
    cb && cb();
  }, time);
}

/* =====================================================
   🌅 BACKGROUND + PIRATE 5 APPARITION
===================================================== */
function showBackground() {
  background.classList.remove("hidden");
  pirate2.classList.remove("hidden");

  pirate5.classList.remove("hidden");
  pirate5.style.transform = "translateX(400px)";
  pirate5.style.opacity = "0";

  requestAnimationFrame(() => {
    pirate5.style.transition = "transform 1.2s ease-out, opacity 1.2s ease-out";
    pirate5.style.transform = "translateX(0)";
    pirate5.style.opacity = "1";
  });

  enablePirate5();
}

/* =====================================================
   🏴‍☠️ PIRATE 5 INTERACTION
===================================================== */
function enablePirate5() {
  pirate5.addEventListener("mouseenter", () => {
    pirate5.classList.add("glow");
  });

  pirate5.addEventListener("mouseleave", () => {
    pirate5.classList.remove("glow");
  });

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

  const top = r.top - 140 < 20 ? r.bottom + 20 : r.top - 140;

  bubble.style.left = r.left + r.width / 2 + "px";
  bubble.style.top = top + "px";
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
  ], () => showLoader("Chargement...", 800, startMiniGame1));
}

/* =====================================================
   🎮 MINI JEU 1
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
   🏆 FIN MINI JEU 1 → SABLIER
===================================================== */
function winMiniGame1() {
  miniGame.classList.add("hidden");
  bookLoader.classList.remove("hidden");

  setTimeout(showBook, 1200); // ⏳ sablier visible
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
  bookLoader.classList.add("hidden");
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
  const rect = book.getBoundingClientRect();
  const middle = rect.left + rect.width / 2;

  if (e.clientX > middle && bookIndex < bookSteps.length - 1) {
    bookIndex++;
    renderBook();
  }
});

continueBtn.onclick = () => {
  bookContainer.classList.add("hidden");
  spawnPirate3Animated();
};

/* =====================================================
   🏴‍☠️ PIRATE 3 APPARITION
===================================================== */
function spawnPirate3Animated() {
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
  ], () => showLoader("Chargement...", 800, startMiniGame2));
}

/* =====================================================
   🎮 MINI JEU 2
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
    { text: "C’est ta base de données.", anchor: pirate2 }
  ], showDatabaseBox);
}

/* =====================================================
   📦 BASE DE DONNEES
===================================================== */
function showDatabaseBox() {
  bubbleContainer.innerHTML = "";

  const box = document.createElement("div");
  box.className = "dialogue-bubble";
  box.style.left = "50%";
  box.style.top = "50%";
  box.style.transform = "translate(-50%,-50%)";

  box.innerHTML = `
    <h2 class="dbTitle">📜 Base de données</h2>
    <p>Elle te permet de fidéliser tes clients et de bâtir ton empire.</p>
    <button class="finalBtn">Terminer la quête</button>
  `;

  box.querySelector("button").onclick = winFinal;
  bubbleContainer.appendChild(box);
}

/* =====================================================
   🏁 FIN + GEMS + MENU
===================================================== */
function winFinal() {
  showLoader("🎉 Bravo, tu as gagné cette quête", 2000, () => {
    launchGems();
    setTimeout(() => {
      window.location.href = "menu.html";
    }, 2500);
  });
}

/* =====================================================
   💎 EXPLOSION DE GEMS
===================================================== */
function launchGems() {
  for (let i = 0; i < 60; i++) {
    const gem = document.createElement("div");
    gem.textContent = "💎";
    gem.style.position = "fixed";
    gem.style.left = "50%";
    gem.style.top = "50%";
    gem.style.fontSize = "24px";
    gem.style.transform = `translate(-50%,-50%) translate(${Math.random()*500-250}px,${Math.random()*500-250}px)`;
    gem.style.transition = "all 1.5s ease-out";
    document.body.appendChild(gem);
    setTimeout(() => gem.remove(), 1500);
  }
}

});
