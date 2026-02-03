document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   🔗 RÉFÉRENCES DOM (HTML RÉEL)
===================================================== */
const background = document.getElementById("background");

const pirate2 = document.getElementById("pirate2bis");
const pirate3 = document.getElementById("pirate3bis");
const pirate5 = document.getElementById("pirate5bis");

const bubbleContainer = document.getElementById("bubbleContainer");
const skipBtn = document.getElementById("skipDialoguesBtn");

const fadeScreen = document.getElementById("fadeScreen");
const loaderBox = fadeScreen.querySelector(".loaderBox");

/* === MINI-JEU COMMUNICATION === */
const communicationGame = document.getElementById("communicationGame");
const commQuestion = document.getElementById("commQuestion");
const commAnswers = document.getElementById("commAnswers");
const commFeedback = document.getElementById("commFeedback");

/* === LOADER CLIENTS === */
const clientsLoader = document.getElementById("clientsLoader");
const clientCount = document.getElementById("clientCount");

/* === IDENTITÉ VISUELLE === */
const visualDialogues = document.getElementById("visualDialogues");
const visualGame = document.getElementById("visualIdentityGame");
const visualChoices = document.getElementById("visualChoices");
const visualFeedback = document.getElementById("visualFeedback");

/* === LIVRE === */
const bookContainer = document.getElementById("bookContainer");
const leftPage = document.getElementById("leftPage");
const rightPage = document.getElementById("rightPage");
const continueBtn = document.getElementById("continueQuestBtn");

/* === JUGEMENT FINAL === */
const merchantGame = document.getElementById("merchantGame");
const btnKeep = document.getElementById("btnKeep");

/* =====================================================
   🔧 OUTILS
===================================================== */
const vibrate = (p = 20) => navigator.vibrate && navigator.vibrate(p);

function showLoader(text, time = 900, cb) {
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
  showLoader("Arrivée au marché pirate…", 1000, showScene);
}

/* =====================================================
   🌅 SCÈNE INITIALE
===================================================== */
function showScene() {
  background.classList.remove("hidden");
  pirate2.classList.remove("hidden");
  pirate5.classList.remove("hidden");

  pirate5.addEventListener("click", startDialogues1, { once: true });
}

/* =====================================================
   💬 MOTEUR DE DIALOGUES (CORRIGÉ)
===================================================== */
let dialogues = [];
let index = 0;
let callback = null;
let dialogueRunning = false;

function playDialogues(list, cb) {
  dialogues = list;
  index = 0;
  callback = cb;
  dialogueRunning = true;
  skipBtn.classList.remove("hidden");
  renderDialogue();
}

function renderDialogue() {
  if (!dialogueRunning) return;

  bubbleContainer.innerHTML = "";

  if (index >= dialogues.length) {
    endDialogues();
    return;
  }

  const d = dialogues[index];
  const bubble = document.createElement("div");
  bubble.className = "dialogue-bubble";
  bubble.innerHTML = d.text;

  const r = d.anchor.getBoundingClientRect();
  bubble.style.left = r.left + r.width / 2 + "px";
  bubble.style.top = (r.top - 90 < 30 ? r.bottom + 12 : r.top - 90) + "px";
  bubble.style.transform = "translateX(-50%)";

  bubble.onclick = (e) => {
    e.stopPropagation();
    vibrate();
    index++;
    renderDialogue();
  };

  bubbleContainer.appendChild(bubble);
}

function endDialogues() {
  dialogueRunning = false;
  bubbleContainer.innerHTML = "";
  skipBtn.classList.add("hidden");

  setTimeout(() => {
    typeof callback === "function" && callback();
  }, 200);
}

skipBtn.onclick = endDialogues;

/* =====================================================
   💬 DIALOGUES 1 → COMMUNICATION
===================================================== */
function startDialogues1() {
  playDialogues([
    { text: "Bienvenue sur le marché des trésors.", anchor: pirate5 },
    { text: "Il faut attirer les clients.", anchor: pirate2 }
  ], startCommunicationGame);
}

/* =====================================================
   🎮 MINI-JEU COMMUNICATION
===================================================== */
function startCommunicationGame() {
  communicationGame.classList.remove("hidden");
  commFeedback.classList.add("hidden");
  commAnswers.innerHTML = "";

  const answers = [
    { text: "Créer des flyers", ok: true },
    { text: "Utiliser les réseaux sociaux", ok: true },
    { text: "Attendre sans rien faire", ok: false }
  ];

  answers.forEach(a => {
    const btn = document.createElement("button");
    btn.textContent = a.text;

    btn.onclick = () => {
      vibrate();
      if (a.ok) {
        commFeedback.classList.remove("hidden");
        setTimeout(() => {
          communicationGame.classList.add("hidden");
          startClientsLoader();
        }, 1200);
      } else {
        btn.classList.add("shake");
        setTimeout(() => btn.classList.remove("shake"), 400);
      }
    };

    commAnswers.appendChild(btn);
  });
}

/* =====================================================
   ⏳ LOADER CLIENTS
===================================================== */
function startClientsLoader() {
  clientsLoader.classList.remove("hidden");
  let count = 0;

  const interval = setInterval(() => {
    count++;
    clientCount.textContent = count;

    if (count >= 10) {
      clearInterval(interval);
      setTimeout(() => {
        clientsLoader.classList.add("hidden");
        startVisualDialogues();
      }, 600);
    }
  }, 120);
}

/* =====================================================
   💬 DIALOGUES IDENTITÉ VISUELLE
===================================================== */
function startVisualDialogues() {
  visualDialogues.classList.remove("hidden");
  const bubbles = visualDialogues.querySelectorAll(".dialogBubble");
  let i = 0;

  function next() {
    if (i < bubbles.length) {
      bubbles[i].classList.remove("hidden");
      bubbles[i].onclick = () => {
        bubbles[i].classList.add("hidden");
        i++;
        next();
      };
    } else {
      visualDialogues.classList.add("hidden");
      startVisualGame();
    }
  }
  next();
}

/* =====================================================
   🎨 MINI-JEU IDENTITÉ VISUELLE
===================================================== */
function startVisualGame() {
  visualGame.classList.remove("hidden");
  visualChoices.innerHTML = "";
  visualFeedback.textContent = "";

  [
    { text: "Logo", ok: true },
    { text: "Couleurs", ok: true },
    { text: "Agrandir le bateau", ok: false }
  ].forEach(c => {
    const btn = document.createElement("button");
    btn.textContent = c.text;

    btn.onclick = () => {
      vibrate();
      if (c.ok) {
        visualFeedback.textContent = "✅ Bon choix";
        setTimeout(() => {
          visualGame.classList.add("hidden");
          showBook();
        }, 700);
      } else {
        btn.classList.add("shake");
        setTimeout(() => btn.classList.remove("shake"), 400);
      }
    };

    visualChoices.appendChild(btn);
  });
}

/* =====================================================
   📖 LIVRE
===================================================== */
const pages = [
  { l: "images/Businessplancov.png", r: "images/Businessplan1.jpg" },
  { l: "images/Businessplancov.png", r: "images/Businessplan2.jpg" },
  { l: "images/Businessplancov.png", r: "images/Businessplan3.jpg" }
];

function showBook() {
  bookContainer.classList.remove("hidden");
  leftPage.src = pages[0].l;
  rightPage.src = pages[0].r;
  continueBtn.classList.remove("hidden");
}

continueBtn.onclick = () => {
  bookContainer.classList.add("hidden");
  startFinalGame();
};

/* =====================================================
   ⚖️ MINI-JEU FINAL
===================================================== */
function startFinalGame() {
  pirate3.classList.remove("hidden");
  merchantGame.classList.remove("hidden");

  btnKeep.onclick = endQuest;
}

/* =====================================================
   🏁 FIN
===================================================== */
function endQuest() {
  merchantGame.classList.add("hidden");
  showLoader("🎉 Quête Commerce réussie", 1800, () => {
    window.location.href = "menu.html";
  });
}

});
