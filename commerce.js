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
   💬 MOTEUR DE DIALOGUES (SÉCURISÉ)
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
   💬 DIALOGUES 1 → LOADER → MINI-JEU 1
===================================================== */
function startDialogues1() {
  playDialogues(
    [
      { text: "Bienvenue sur le marché des trésors.", anchor: pirate5 },
      { text: "Avant d’agir, il faut comprendre le terrain.", anchor: pirate2 }
    ],
    () => {
      showLoader(
        "📊 Analyse du marché et construction du business plan…",
        1200,
        startCommunicationGame
      );
    }
  );
}

/* =====================================================
   🎮 MINI-JEU COMMUNICATION (QUIZZ BUSINESS PLAN)
===================================================== */
function startCommunicationGame() {
  communicationGame.classList.remove("hidden");
  commFeedback.classList.add("hidden");
  commAnswers.innerHTML = "";

  const quiz = [
    {
      question: "Pourquoi réalise-t-on une étude de marché avant de se lancer ?",
      answers: [
        { text: "Pour copier exactement les concurrents", ok: false },
        { text: "Pour comprendre le marché, les clients et les concurrents", ok: true },
        { text: "Pour choisir un logo et des couleurs", ok: false }
      ],
      explanation:
        "L’étude de marché permet de comprendre l’environnement : concurrents, attentes des clients, prix pratiqués et tendances."
    },
    {
      question: "Que permet d’analyser une étude de marché ?",
      answers: [
        { text: "Les produits qui marchent, les prix et les stratégies de vente", ok: true },
        { text: "Uniquement le nom des concurrents", ok: false },
        { text: "La décoration de la boutique", ok: false }
      ],
      explanation:
        "On analyse les produits performants, les prix, les canaux de vente et les stratégies utilisées par les concurrents."
    },
    {
      question: "À quoi sert le business plan ?",
      answers: [
        { text: "À faire joli pour les investisseurs", ok: false },
        { text: "À définir la ligne directrice de l’activité", ok: true },
        { text: "À fixer uniquement les prix", ok: false }
      ],
      explanation:
        "Le business plan définit le problème résolu, la cible, les ambitions, les enjeux et la stratégie globale."
    },
    {
      question: "Comment peut-on faire face à la concurrence ?",
      answers: [
        { text: "En baissant toujours les prix", ok: false },
        { text: "Par la négociation, l’adaptabilité ou la différenciation", ok: true },
        { text: "En ignorant le marché", ok: false }
      ],
      explanation:
        "Une entreprise solide s’adapte, se différencie ou négocie intelligemment selon le contexte."
    }
  ];

  let step = 0;

  function showStep() {
    const item = quiz[step];
    commQuestion.innerHTML = `<strong>${item.q}</strong>`;
    commAnswers.innerHTML = "";
    commFeedback.classList.add("hidden");

    item.a.forEach(ans => {
      const btn = document.createElement("button");
      btn.textContent = ans.t;

      btn.onclick = () => {
        vibrate();
        if (ans.ok) {
          commFeedback.innerHTML = `✅ ${item.exp}`;
          commFeedback.classList.remove("hidden");
          setTimeout(() => {
            step++;
            if (step < quiz.length) {
              showStep();
            } else {
              communicationGame.classList.add("hidden");
              startClientsLoader();
            }
          }, 1500);
        } else {
          btn.classList.add("shake");
          setTimeout(() => btn.classList.remove("shake"), 400);
        }
      };

      commAnswers.appendChild(btn);
    });
  }

  showStep();
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
