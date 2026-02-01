document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   📌 ELEMENTS DOM
===================================================== */
const background = document.getElementById("background");

const pirate2 = document.getElementById("pirate2bis");
const pirate5 = document.getElementById("pirate5bis");
const pirate3 = document.getElementById("pirate3bis");

const bubbleContainer = document.getElementById("bubbleContainer");
const skipBtn = document.getElementById("skipDialoguesBtn");

const miniGame = document.getElementById("communicationGame");
const gameQ = document.getElementById("commQuestion");
const gameA = document.getElementById("commAnswers");
const gameF = document.getElementById("commFeedback");

const bookContainer = document.getElementById("bookContainer");
const leftPage = document.getElementById("leftPage");
const rightPage = document.getElementById("rightPage");
const continueBtn = document.getElementById("continueQuestBtn");

const merchantGame = document.getElementById("merchantGame");

/* =====================================================
   🔧 OUTILS
===================================================== */
function vibrate(p = 15) {
  if (navigator.vibrate) navigator.vibrate(p);
}

function triggerGlow(el) {
  el.classList.remove("glowClick");
  void el.offsetWidth;
  el.classList.add("glowClick");
}

/* =====================================================
   🌑 LOADER GLOBAL
===================================================== */
const fadeScreen = document.getElementById("fadeScreen");
const loaderBox = fadeScreen.querySelector(".loaderBox");

/* =====================================================
   🎬 VIDEO INTRO
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const questVideo = document.getElementById("questVideo");
const toggleSound = document.getElementById("toggleSound");
const closeVideo = document.getElementById("closeVideo");

questVideo.muted = true;
questVideo.play().catch(()=>{});

toggleSound.onclick = () => {
  questVideo.muted = !questVideo.muted;
  toggleSound.textContent = questVideo.muted ? "🔇" : "🔊";
};

closeVideo.onclick = () => {
  triggerGlow(closeVideo);
  endVideo();
};

questVideo.onended = endVideo;

function endVideo() {
  questVideo.pause();
  videoContainer.style.display = "none";
  showLoader("Chargement...", 600, showBackground);
}

/* =====================================================
   🌑 LOADER
===================================================== */
function showLoader(text, time = 700, cb) {
  loaderBox.innerHTML = text;
  fadeScreen.classList.remove("hidden");

  setTimeout(() => {
    fadeScreen.classList.add("hidden");
    if (typeof cb === "function") cb();
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
   🏴‍☠️ PIRATE 5
===================================================== */
function enablePirate5() {
  pirate5.addEventListener("mouseenter", () => pirate5.classList.add("glow"));
  pirate5.addEventListener("mouseleave", () => pirate5.classList.remove("glow"));
  pirate5.addEventListener("click", startDialogues1, { once: true });
}

/* =====================================================
   💬 DIALOGUES – MOTEUR
===================================================== */
let dialogues = [];
let dIndex = 0;
let dialogueCallback = null;

function playDialogues(list, cb) {
  dialogues = list;
  dIndex = 0;
  dialogueCallback = cb;
  skipBtn.classList.remove("hidden");
  renderDialogue();
}

function renderDialogue() {
  bubbleContainer.innerHTML = "";

  if (dIndex >= dialogues.length) {
    endDialogues();
    return;
  }

  const d = dialogues[dIndex];
  const bubble = document.createElement("div");
  bubble.className = "dialogue-bubble";
  bubble.innerHTML = d.text;

  const anchor = d.anchor;
  if (anchor && !anchor.classList.contains("hidden")) {
    const r = anchor.getBoundingClientRect();
    bubble.style.left = r.left + r.width / 2 + "px";
    bubble.style.top = (r.top - 90 < 30 ? r.bottom + 15 : r.top - 90) + "px";
    bubble.style.transform = "translateX(-50%)";
  } else {
    bubble.style.left = "50%";
    bubble.style.top = "50%";
    bubble.style.transform = "translate(-50%, -50%)";
  }

  bubble.onclick = () => {
    vibrate();
    dIndex++;
    renderDialogue();
  };

  bubbleContainer.appendChild(bubble);
}

function endDialogues() {
  bubbleContainer.innerHTML = "";
  skipBtn.classList.add("hidden");
  if (typeof dialogueCallback === "function") {
    setTimeout(dialogueCallback, 300);
  }
}

skipBtn.onclick = () => {
  triggerGlow(skipBtn);
  vibrate(25);
  endDialogues();
};

/* =====================================================
   💬 DIALOGUES 1 → MINI-JEU 1
===================================================== */
function startDialogues1() {
  playDialogues([
    { text: "Moussaillon ! Bienvenue sur le marché des trésors.", anchor: pirate5 },
    { text: "Créons ton business plan.", anchor: pirate2 }
  ], launchMiniGame1);
}

/* =====================================================
   🎮 MINI-JEU 1 (CORRIGÉ)
===================================================== */
function launchMiniGame1() {
  fadeScreen.classList.add("hidden"); // 🔥 déblocage clics

  miniGame.classList.remove("hidden");
  miniGame.style.display = "flex";

  gameQ.textContent = "Quelle est la première étape ?";
  gameA.innerHTML = "";
  gameF.textContent = "";

const answers = [
  { text: "Acheter un bateau", ok: false },
  { text: "Définir clairement son offre", ok: true },
  { text: "Fixer les prix", ok: false }
];

answers.forEach(a => {
  const btn = document.createElement("button");
  btn.textContent = a.text;

  btn.onclick = () => {
    vibrate();
    if (a.ok) {
      gameF.textContent = "✅ Bonne décision";
      setTimeout(winMiniGame1, 700);
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

  let v = 0;
  const counter = document.getElementById("poCounter");

  const interval = setInterval(() => {
    v += 100;
    counter.textContent = v;
    counter.style.transform = "scale(1.2)";
    setTimeout(() => counter.style.transform = "scale(1)", 120);

    if (v >= 5000) {
      clearInterval(interval);
      setTimeout(() => {
        fadeScreen.classList.add("hidden");
        showBook();
      }, 800);
    }
  }, 30);
}

/* =====================================================
   📖 LIVRE (INCHANGÉ)
===================================================== */
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

continueBtn.onclick = () => {
  bookContainer.classList.add("hidden");
  spawnPirate3();
};

/* =====================================================
   🏴‍☠️ PIRATE 3 + SUITE
===================================================== */
function spawnPirate3() {
  pirate3.classList.remove("hidden");
  pirate3.style.left = "1200px";
  pirate3.style.transition = "left 1s ease-out";
  requestAnimationFrame(() => pirate3.style.left = "638px");

  pirate3.addEventListener("click", startDialogues2, { once: true });
}

function startDialogues2() {
  playDialogues([
    { text: "Ces pierres inspirent confiance.", anchor: pirate3 },
    { text: "Mais le marché est exigeant.", anchor: pirate5 }
  ], startMiniGame2);
}

/* =====================================================
   🎮 MINI-JEU 2 + FIN
===================================================== */
function startMiniGame2() {
  merchantGame.classList.remove("hidden");
  merchantGame.innerHTML = `
    <h1>🧔‍♂️ Le Jugement du Marché</h1>
    <p>📦 Prix : <strong>300 PO</strong></p>
    <p>🏷️ Concurrence : <strong>250 PO</strong></p>
    <p id="clue">Analyse avant décision.</p>
    <button id="btnKeep">⚖️ Maintenir le prix</button>
  `;

  document.getElementById("btnKeep").onclick = () => {
    merchantGame.classList.add("hidden");
    winFinal();
  };
}

/* =====================================================
   🏁 FIN
===================================================== */
function winFinal() {
  loaderBox.innerHTML = "🎉 Quête réussie";
  fadeScreen.classList.remove("hidden");

  setTimeout(() => {
    sessionStorage.setItem("fromCommerce", "true");
    window.location.href = "menu.html";
  }, 2200);
}

});
