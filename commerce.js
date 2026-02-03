document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   🔗 DOM
===================================================== */
const background = document.getElementById("background");
const pirate2 = document.getElementById("pirate2bis");
const pirate3 = document.getElementById("pirate3bis");
const pirate5 = document.getElementById("pirate5bis");

const bubbleContainer = document.getElementById("bubbleContainer");
const skipBtn = document.getElementById("skipDialoguesBtn");

const fadeScreen = document.getElementById("fadeScreen");
const loaderBox = fadeScreen.querySelector(".loaderBox");

/* Mini-jeu 1 */
const communicationGame = document.getElementById("communicationGame");
const commQuestion = document.getElementById("commQuestion");
const commAnswers = document.getElementById("commAnswers");
const commFeedback = document.getElementById("commFeedback");

/* Mini-jeu 2 */
const visualGame = document.getElementById("visualIdentityGame");
const visualChoices = document.getElementById("visualChoices");
const visualFeedback = document.getElementById("visualFeedback");

/* Livre */
const bookContainer = document.getElementById("bookContainer");
const leftPage = document.getElementById("leftPage");
const rightPage = document.getElementById("rightPage");
const continueBtn = document.getElementById("continueQuestBtn");

/* Mini-jeu 3 */
const merchantGame = document.getElementById("merchantGame");
const btnKeep = document.getElementById("btnKeep");

/* =====================================================
   🔧 UTILS
===================================================== */
const vibrate = (p = 20) => navigator.vibrate && navigator.vibrate(p);

function showLoader(text, time = 1200, cb) {
  loaderBox.innerHTML = `<div>${text}</div><canvas id="gemsCanvas"></canvas>`;
  fadeScreen.classList.remove("hidden");
  spawnGems();
  setTimeout(() => {
    fadeScreen.classList.add("hidden");
    cb && cb();
  }, time);
}

/* =====================================================
   🎬 VIDEO – boutons top right
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const questVideo = document.getElementById("questVideo");
const toggleSound = document.getElementById("toggleSound");
const closeVideo = document.getElementById("closeVideo");

toggleSound.style.right = "150px";
closeVideo.style.right = "20px";

questVideo.muted = true;
questVideo.play().catch(()=>{});

toggleSound.onclick = () => {
  questVideo.muted = !questVideo.muted;
  toggleSound.textContent = questVideo.muted ? "🔇" : "🔊";
};

closeVideo.onclick = endVideo;
questVideo.onended = endVideo;

function endVideo() {
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

  pirate5.classList.add("glowStart");
  pirate5.onclick = () => {
    pirate5.classList.remove("glowStart");
    startDialogues1();
  };
}

/* =====================================================
   💬 DIALOGUES (AU-DESSUS DES PIRATES)
===================================================== */
let dialogues = [], index = 0, callback = null;

function playDialogues(list, cb) {
  dialogues = list;
  index = 0;
  callback = cb;
  skipBtn.classList.remove("hidden");
  showDialogue();
}

function showDialogue() {
  bubbleContainer.innerHTML = "";
  if (index >= dialogues.length) return endDialogues();

  const d = dialogues[index];
  const bubble = document.createElement("div");
  bubble.className = "dialogue-bubble";
  bubble.innerHTML = d.text;

  const r = d.anchor.getBoundingClientRect();
  bubble.style.left = r.left + r.width / 2 + "px";
  bubble.style.top = r.top - 120 + "px";
  bubble.style.transform = "translateX(-50%)";

  bubble.onclick = () => {
    vibrate();
    index++;
    showDialogue();
  };

  bubbleContainer.appendChild(bubble);
}

function endDialogues() {
  bubbleContainer.innerHTML = "";
  skipBtn.classList.add("hidden");
  callback && callback();
}

skipBtn.onclick = endDialogues;

/* =====================================================
   💬 DIALOGUES 1
===================================================== */
function startDialogues1() {
  playDialogues([
    { text: "Avant de vendre, il faut comprendre le marché.", anchor: pirate5 },
    { text: "On commence par une étude sérieuse.", anchor: pirate2 }
  ], startMiniGame1);
}

/* =====================================================
   🎮 MINI-JEU 1 — ÉTUDE DE MARCHÉ
===================================================== */
function startMiniGame1() {
  communicationGame.classList.remove("hidden");
  const quiz = [
    {
      q: "Pourquoi faire une étude de marché ?",
      a: [
        { t: "Comprendre clients et concurrents", ok: true },
        { t: "Copier les autres", ok: false }
      ]
    },
    {
      q: "Que permet-elle d’analyser ?",
      a: [
        { t: "Produits, prix et stratégies", ok: true },
        { t: "La décoration", ok: false }
      ]
    }
  ];

  let i = 0;
  function step() {
    commQuestion.innerHTML = quiz[i].q;
    commAnswers.innerHTML = "";
    quiz[i].a.forEach(ans => {
      const b = document.createElement("button");
      b.textContent = ans.t;
      b.onclick = () => {
        if (ans.ok) {
          i++;
          if (i < quiz.length) step();
          else {
            communicationGame.classList.add("hidden");
            showLoader("Construction du business plan…", 1200, startMiniGame2);
          }
        }
      };
      commAnswers.appendChild(b);
    });
  }
  step();
}

/* =====================================================
   🎮 MINI-JEU 2 — BUSINESS PLAN (QUIZ)
===================================================== */
function startMiniGame2() {
  visualGame.classList.remove("hidden");

  const quiz = [
    {
      q: "Quel est le rôle du business plan ?",
      a: [
        { t: "Définir la stratégie globale", ok: true },
        { t: "Faire joli", ok: false }
      ]
    },
    {
      q: "Que définit-il ?",
      a: [
        { t: "Problème, cible, ambitions", ok: true },
        { t: "Uniquement le prix", ok: false }
      ]
    }
  ];

  let i = 0;
  function step() {
    visualChoices.innerHTML = "";
    quiz[i].a.forEach(ans => {
      const b = document.createElement("button");
      b.textContent = ans.t;
      b.onclick = () => {
        if (ans.ok) {
          i++;
          if (i < quiz.length) step();
          else {
            visualGame.classList.add("hidden");
            showBook();
          }
        }
      };
      visualChoices.appendChild(b);
    });
  }
  step();
}

/* =====================================================
   📖 LIVRE — PAGES ANIMÉES
===================================================== */
const pages = [
  ["Businessplancov.png", "Businessplan1.jpg"],
  ["Businessplancov.png", "Businessplan2.jpg"],
  ["Businessplancov.png", "Businessplan3.jpg"]
];

let page = 0;

function showBook() {
  bookContainer.classList.remove("hidden");
  renderPages();
}

function renderPages() {
  leftPage.src = "images/" + pages[page][0];
  rightPage.src = "images/" + pages[page][1];
  continueBtn.classList.toggle("hidden", page !== pages.length - 1);
}

bookContainer.onclick = (e) => {
  if (e.clientX > window.innerWidth / 2 && page < pages.length - 1) {
    page++;
    renderPages();
  } else if (page > 0) {
    page--;
    renderPages();
  }
};

continueBtn.onclick = () => {
  bookContainer.classList.add("hidden");
  spawnPirate3();
};

/* =====================================================
   🏴‍☠️ PIRATE 3 — ENTRÉE + DIALOGUES FINAUX
===================================================== */
function spawnPirate3() {
  pirate3.classList.remove("hidden");
  pirate3.style.left = "1200px";
  pirate3.style.transition = "left 1s ease-out";
  requestAnimationFrame(() => pirate3.style.left = "638px");

  setTimeout(() => {
    playDialogues([
      { text: "Le marché est exigeant…", anchor: pirate3 },
      { text: "À toi de choisir ta stratégie.", anchor: pirate5 }
    ], startMiniGame3);
  }, 1200);
}

/* =====================================================
   🎮 MINI-JEU 3 — JUGEMENT DU MARCHÉ
===================================================== */
function startMiniGame3() {
  merchantGame.classList.remove("hidden");
  btnKeep.onclick = () => {
    merchantGame.classList.add("hidden");
    endQuest();
  };
}

/* =====================================================
   🏁 FIN + GEMS + DÉBLOCAGE
===================================================== */
function endQuest() {
  sessionStorage.setItem("pirate3Unlocked", "true");
  showLoader("🎉 Quête Commerce réussie", 2000, () => {
    window.location.href = "menu.html";
  });
}

/* =====================================================
   💎 GEMS
===================================================== */
function spawnGems() {
  const canvas = document.getElementById("gemsCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  for (let i = 0; i < 120; i++) {
    ctx.fillStyle = `hsl(${Math.random()*360},100%,60%)`;
    ctx.beginPath();
    ctx.arc(Math.random()*canvas.width, Math.random()*canvas.height, 3, 0, Math.PI*2);
    ctx.fill();
  }
}

});
