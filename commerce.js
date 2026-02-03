document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   📌 ELEMENTS DOM
===================================================== */
const background = document.getElementById("background");

const pirate2 = document.getElementById("pirate2bis");
const pirate3 = document.getElementById("pirate3bis");
const pirate5 = document.getElementById("pirate5bis");

const bubbleContainer = document.getElementById("bubbleContainer");
const skipBtn = document.getElementById("skipDialoguesBtn");

const fadeScreen = document.getElementById("fadeScreen");
const loaderBox = fadeScreen.querySelector(".loaderBox");

/* === MINI-JEU 1 === */
const miniGame1 = document.getElementById("miniGameContainer");
const gameQ = document.getElementById("gameQuestion");
const gameA = document.getElementById("gameAnswers");
const gameF = document.getElementById("gameFeedback");

/* === MINI-JEU 2 (BUSINESS PLAN) === */
const businessGame = document.getElementById("businessGame");

/* === LIVRE === */
const bookContainer = document.getElementById("bookContainer");
const leftPage = document.getElementById("leftPage");
const rightPage = document.getElementById("rightPage");
const continueBtn = document.getElementById("continueQuestBtn");

/* === MINI-JEU FINAL === */
const merchantGame = document.getElementById("merchantGame");

/* =====================================================
   🔧 OUTILS
===================================================== */
const vibrate = (p = 15) => navigator.vibrate && navigator.vibrate(p);

function showLoader(text, time = 900, cb) {
  loaderBox.innerHTML = text;
  fadeScreen.classList.remove("hidden");
  setTimeout(() => {
    fadeScreen.classList.add("hidden");
    cb && cb();
  }, time);
}

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

closeVideo.onclick = endVideo;
questVideo.onended = endVideo;

function endVideo() {
  questVideo.pause();
  videoContainer.classList.add("hidden");
  showLoader("Chargement du marché…", 1000, showCommerceScene);
}

/* =====================================================
   🌅 SCÈNE COMMERCE
===================================================== */
function showCommerceScene() {
  background.classList.remove("hidden");
  pirate2.classList.remove("hidden");
  pirate5.classList.remove("hidden");

  pirate5.addEventListener("click", startDialoguesCommerce, { once: true });
}

/* =====================================================
   💬 MOTEUR DE DIALOGUES
===================================================== */
let dialogues = [];
let index = 0;
let callback = null;

function playDialogues(list, cb) {
  dialogues = list;
  index = 0;
  callback = cb;
  skipBtn.classList.remove("hidden");
  renderDialogue();
}

function renderDialogue() {
  bubbleContainer.innerHTML = "";
  if (index >= dialogues.length) return endDialogues();

  const d = dialogues[index];
  const bubble = document.createElement("div");
  bubble.className = "dialogue-bubble";
  bubble.innerHTML = d.text;

  const r = d.anchor.getBoundingClientRect();
  bubble.style.left = r.left + r.width / 2 + "px";
  bubble.style.top = (r.top - 90 < 30 ? r.bottom + 15 : r.top - 90) + "px";
  bubble.style.transform = "translateX(-50%)";

  bubble.onclick = () => {
    vibrate();
    index++;
    renderDialogue();
  };

  bubbleContainer.appendChild(bubble);
}

function endDialogues() {
  bubbleContainer.innerHTML = "";
  skipBtn.classList.add("hidden");
  callback && setTimeout(callback, 300);
}

skipBtn.onclick = endDialogues;

/* =====================================================
   💬 DIALOGUES COMMERCE
===================================================== */
function startDialoguesCommerce() {
  playDialogues([
    { text: "Bienvenue sur le marché des trésors.", anchor: pirate5 },
    { text: "Avant de vendre, il faut structurer ton idée.", anchor: pirate2 }
  ], launchMiniGame1);
}

/* =====================================================
   🎮 MINI-JEU 1 – QCM
===================================================== */
function launchMiniGame1() {
  miniGame1.classList.remove("hidden");
  gameQ.textContent = "Quelle est la première étape pour lancer ton activité ?";
  gameA.innerHTML = "";
  gameF.textContent = "";

  [
    { text: "Acheter du stock", ok: false },
    { text: "Définir clairement son offre", ok: true },
    { text: "Fixer les prix", ok: false }
  ].forEach(a => {
    const btn = document.createElement("button");
    btn.textContent = a.text;
    btn.onclick = () => {
      vibrate();
      if (a.ok) {
        gameF.textContent = "✅ Bonne réponse";
        setTimeout(winMiniGame1, 800);
      } else {
        gameF.textContent = "❌ Mauvais choix";
      }
    };
    gameA.appendChild(btn);
  });
}

function winMiniGame1() {
  miniGame1.classList.add("hidden");
  showLoader("Business plan débloqué 💼", 1200, startBusinessDialogues);
}

/* =====================================================
   💬 DIALOGUES BUSINESS PLAN
===================================================== */
function startBusinessDialogues() {
  playDialogues([
    { text: "Un business plan te guide à chaque étape.", anchor: pirate5 },
    { text: "Valide ses fondations.", anchor: pirate2 }
  ], launchBusinessGame);
}

/* =====================================================
   🎮 MINI-JEU 2 – BUSINESS PLAN
===================================================== */
function launchBusinessGame() {
  businessGame.classList.remove("hidden");
  businessGame.innerHTML = `
    <h2>📊 Business Plan</h2>
    <p>Choisis l’élément indispensable :</p>
    <button data-ok="false">Logo</button>
    <button data-ok="true">Proposition de valeur</button>
    <button data-ok="false">Couleur du bateau</button>
  `;

  businessGame.querySelectorAll("button").forEach(btn => {
    btn.onclick = () => {
      vibrate();
      if (btn.dataset.ok === "true") {
        businessGame.classList.add("hidden");
        showLoader("Business plan validé 📘", 1200, showBook);
      } else {
        btn.classList.add("shake");
        setTimeout(() => btn.classList.remove("shake"), 400);
      }
    };
  });
}

/* =====================================================
   📖 LIVRE
===================================================== */
const bookSteps = [
  { left: "images/Businessplancov.png", right: "images/Businessplan1.jpg" },
  { left: "images/Businessplancov.png", right: "images/Businessplan2.jpg" },
  { left: "images/Businessplancov.png", right: "images/Businessplan3.jpg" }
];

let page = 0;

function showBook() {
  bookContainer.classList.remove("hidden");
  page = 0;
  renderBook();
}

function renderBook() {
  leftPage.src = bookSteps[page].left;
  rightPage.src = bookSteps[page].right;
  continueBtn.classList.toggle("hidden", page !== bookSteps.length - 1);
}

continueBtn.onclick = () => {
  bookContainer.classList.add("hidden");
  startFinalDialogues();
};

/* =====================================================
   💬 DIALOGUE FINAL
===================================================== */
function startFinalDialogues() {
  pirate3.classList.remove("hidden");
  playDialogues([
    { text: "Le marché va maintenant juger ton projet.", anchor: pirate3 }
  ], launchFinalGame);
}

/* =====================================================
   ⚖️ MINI-JEU FINAL – JUGEMENT DU MARCHÉ
===================================================== */
function launchFinalGame() {
  merchantGame.classList.remove("hidden");
  merchantGame.innerHTML = `
    <h2>⚖️ Jugement du Marché</h2>
    <p>Ton prix : <strong>300 PO</strong></p>
    <p>Concurrence : <strong>250 PO</strong></p>
    <button id="keepPrice">Maintenir le prix</button>
  `;

  document.getElementById("keepPrice").onclick = winFinal;
}

/* =====================================================
   🏁 FIN
===================================================== */
function winFinal() {
  merchantGame.classList.add("hidden");
  showLoader("🎉 Quête Commerce réussie", 1800, () => {
    sessionStorage.setItem("fromCommerce", "true");
    window.location.href = "menu.html";
  });
}

});
