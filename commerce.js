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
    if (cb) cb();
  }, time);
}

/* =====================================================
   🎬 VIDÉO
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const questVideo = document.getElementById("questVideo");
const toggleSound = document.getElementById("toggleSound");
const closeVideo  = document.getElementById("closeVideo");

const background = document.getElementById("background");
const pirate2 = document.getElementById("pirate2bis");
const pirate5 = document.getElementById("pirate5bis");
const pirate3 = document.getElementById("pirate3bis");

questVideo.muted = true;
toggleSound.textContent = "🔇";

toggleSound.onclick = () => {
  questVideo.muted = !questVideo.muted;
  toggleSound.textContent = questVideo.muted ? "🔇" : "🔊";
};

questVideo.onended = endVideo;
closeVideo.onclick = endVideo;

let videoFinished = false;

function endVideo() {
  if (videoFinished) return;
  videoFinished = true;

  questVideo.pause();
  videoContainer.style.display = "none";
  showLoader("Chargement...", 600, showBackground);
}

/* =====================================================
   🌅 BACKGROUND + PIRATES
===================================================== */
function showBackground() {
  background.classList.remove("hidden");

  pirate2.classList.remove("hidden");
  pirate5.classList.remove("hidden");

  pirate2.style.pointerEvents = "auto";
  pirate5.style.pointerEvents = "auto";

  enablePirate5();
}

/* =====================================================
   🏴‍☠️ PIRATE 5 — HOVER + CLIC
===================================================== */
function enablePirate5() {
  pirate5.classList.add("interactive");

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
  skipBtn.onclick = endDialogues;

  renderDialogue();
}

function renderDialogue() {
  bubbleContainer.innerHTML = "";

  const d = dialogues[dIndex];
  const r = d.anchor.getBoundingClientRect();

  const bubble = document.createElement("div");
  bubble.className = "dialogue-bubble";
  bubble.textContent = d.text;

  let top = r.top - 140;
  if (top < 80) top = r.bottom + 20;

  bubble.style.left = (r.left + r.width / 2) + "px";
  bubble.style.top = top + "px";
  bubble.style.transform = "translateX(-50%)";

  bubble.onclick = () => {
    vibrate(10);
    dIndex++;
    if (dIndex < dialogues.length) {
      renderDialogue();
    } else {
      endDialogues();
    }
  };

  bubbleContainer.appendChild(bubble);
}

function endDialogues() {
  bubbleContainer.innerHTML = "";
  skipBtn.classList.add("hidden");
  if (onDialogueEnd) onDialogueEnd();
}

/* =====================================================
   💬 DIALOGUES 1
===================================================== */
function startDialogues1() {
  playDialogues([
    { text: "Moussaillon ! Bienvenue sur le marché des trésors.", anchor: pirate5 },
    { text: "Créons ton business plan.", anchor: pirate2 }
  ], () => showLoader("Chargement...", 600, startMiniGame1));
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

  [
    "Acheter un bateau",
    "Définir clairement son offre",
    "Fixer les prix"
  ].forEach((txt, i) => {
    const btn = document.createElement("button");
    btn.textContent = txt;

    btn.onclick = () => {
      if (i === 1) {
        gameF.textContent = "✅ Bonne décision";
        setTimeout(winMiniGame1, 800);
      } else {
        gameF.textContent = "❌ Mauvais choix";
      }
    };

    gameA.appendChild(btn);
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
    <div class="winText">ton business plan 🎁</div>
  `;

  fadeScreen.classList.remove("hidden");

  setTimeout(() => {
    fadeScreen.classList.add("hidden");
    showBook();
  }, 1600);
}

/* =====================================================
   📖 LIVRE (simple)
===================================================== */
const bookContainer = document.getElementById("bookContainer");
const continueBtn = document.getElementById("continueQuestBtn");

function showBook() {
  bookContainer.classList.remove("hidden");
  continueBtn.classList.remove("hidden");
}

continueBtn.onclick = () => {
  bookContainer.classList.add("hidden");
  spawnPirate3();
};

/* =====================================================
   🏴‍☠️ PIRATE 3
===================================================== */
function spawnPirate3() {
  pirate3.classList.remove("hidden");
  pirate3.style.left = "638px";
  pirate3.style.pointerEvents = "auto";

  pirate3.onclick = () => {
    startDialogues2();
  };
}

/* =====================================================
   💬 DIALOGUES 2
===================================================== */
function startDialogues2() {
  playDialogues([
    { text: "Le marché est exigeant.", anchor: pirate3 },
    { text: "Observe avant d’agir.", anchor: pirate5 }
  ], () => alert("Suite du jeu ici 🚀"));
}

});
