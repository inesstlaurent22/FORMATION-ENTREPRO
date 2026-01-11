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

function showLoader(text, time = 800, cb) {
  loaderBox.innerHTML = text;
  fadeScreen.classList.remove("hidden");
  setTimeout(() => {
    fadeScreen.classList.add("hidden");
    cb && cb();
  }, time);
}

/* =====================================================
   ⏳ SABLIER LIVRE (GLOBAL FIXE)
===================================================== */
const bookLoader = document.getElementById("bookLoader");

/* =====================================================
   🎬 VIDEO
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const questVideo = document.getElementById("questVideo");
const toggleSound = document.getElementById("toggleSound");
const closeVideo  = document.getElementById("closeVideo");

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
   🌅 BACKGROUND + PIRATES INIT
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

  let top = r.top - 140;
  if (top < 20) top = r.bottom + 20;

  bubble.style.left = (r.left + r.width / 2) + "px";
  bubble.style.top = top + "px";
  bubble.style.transform = "translateX(-50%)";

  bubble.onclick = () => {
    dIndex++;
    dIndex < dialogues.length ? renderDialogue() : endDialogues();
  };

  bubbleContainer.appendChild(bubble);
}

function endDialogues() {
  if (dialogueFinished) return;
  dialogueFinished = true;
  bubbleContainer.innerHTML = "";
  skipBtn.classList.add("hidden");
  typeof onDialogueEnd === "function" && onDialogueEnd();
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
   🏆 FIN MINI-JEU 1 → LIVRE
===================================================== */
function winMiniGame1() {
  miniGame.classList.add("hidden");
  showLoader("📖 Ouverture du grimoire...", 800, showBook);
}

/* =====================================================
   📖 LIVRE + SABLIER
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
  bookLoader.classList.remove("hidden");

  const imgs = bookSteps.flatMap(s => [s.left, s.right]);
  let loaded = 0;

  imgs.forEach(src => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      loaded++;
      if (loaded === imgs.length) {
        bookLoader.classList.add("hidden");
        bookContainer.classList.remove("hidden");
        bookIndex = 0;
        renderBook();
      }
    };
  });
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
  const mid = rect.left + rect.width / 2;

  if (e.clientX > mid && bookIndex < bookSteps.length - 1) {
    bookIndex++;
    renderBook();
  } else if (e.clientX < mid && bookIndex > 0) {
    bookIndex--;
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
  pirate3.style.transition = "none";
  pirate3.style.left = "900px";

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

  const box = document.createElement("div");
  box.className = "dialogue-bubble";
  box.style.left = "50%";
  box.style.top = "50%";
  box.style.transform = "translate(-50%,-50%)";

  box.innerHTML = `
    <h2 class="dbTitle">📜 Base de données</h2>
    <div class="dbSeparator"></div>
    <p>Elle te permet de fidéliser tes clients et de bâtir ton empire.</p>
    <button class="finalBtn">Terminer la quête</button>
  `;

  box.querySelector("button").onclick = winFinal;
  bubbleContainer.appendChild(box);
}

/* =====================================================
   🏁 FIN + RETOUR MENU
===================================================== */
function winFinal() {
  bubbleContainer.innerHTML = "";
  showLoader("🎉 Quête terminée", 2000, () => {
    window.location.href = "menu.html";
  });
}

});
