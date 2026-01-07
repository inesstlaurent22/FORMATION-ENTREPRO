document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   🧠 ÉTAT GLOBAL
===================================================== */
let playerPO = 0;
let dialogueIndex = 0;
let quizIndex = 0;

/* =====================================================
   🎬 VIDÉO — ANTI FOND NOIR
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const questVideo = document.getElementById("questVideo");
const closeVideo = document.getElementById("closeVideo");

closeVideo.onclick = endVideo;
questVideo.onended = endVideo;

// sécurité si la vidéo bug (mobile)
setTimeout(() => {
  if (videoContainer.style.display !== "none") {
    endVideo();
  }
}, 9000);

function endVideo(){
  forceBackground();
  requestAnimationFrame(() => {
    videoContainer.style.display = "none";
    startDialogues1();
  });
}

/* =====================================================
   🌅 BACKGROUND + PIRATES
===================================================== */
const background = document.getElementById("background");
const pirate2 = document.getElementById("pirate2bis");
const pirate5 = document.getElementById("pirate5bis");
const pirate3 = document.getElementById("pirate3bis");

function forceBackground(){
  background.style.display = "block";
  background.style.visibility = "visible";
  background.style.opacity = "1";
  background.classList.remove("hidden");

  [pirate2, pirate5].forEach(p => {
    p.classList.remove("hidden");
    p.style.display = "block";
    p.style.opacity = "1";
  });
}

/* =====================================================
   💬 DIALOGUES 1
===================================================== */
const bubbleContainer = document.getElementById("bubbleContainer");

const dialogues1 = [
  "Bienvenue dans mon échoppe.",
  "Voici comment nous avons bâti notre commerce.",
  "Écoutons maintenant ton jugement."
];

function startDialogues1(){
  showDialogue(dialogues1, startQuiz1);
}

/* =====================================================
   🎮 QUIZ 1 — QUESTIONS DEMANDÉES
===================================================== */
const quiz1 = [
  {
    question: "Où les pirates ont-ils trouvé leurs pierres ?",
    answers: [
      "Dans un coffre dans une grotte secrète",
      "Ils les ont achetées au marché",
      "La tante les leur a données"
    ],
    correct: 0
  },
  {
    question: "Qui fait partie de l'équipage pirate ?",
    answers: [
      "Toi et les deux moussaillons",
      "Juste le capitaine",
      "Toute la famille pirate"
    ],
    correct: 0
  }
];

const miniGame = document.getElementById("miniGameContainer");
const gameQ = document.getElementById("gameQuestion");
const gameA = document.getElementById("gameAnswers");
const gameF = document.getElementById("gameFeedback");

function startQuiz1(){
  quizIndex = 0;
  showQuestion();
}

function showQuestion(){
  miniGame.classList.remove("hidden");
  gameF.textContent = "";

  const q = quiz1[quizIndex];
  gameQ.textContent = q.question;
  gameA.innerHTML = "";

  q.answers.forEach((txt, i) => {
    const btn = document.createElement("button");
    btn.textContent = txt;
    btn.onclick = () => {
      if(i === q.correct){
        quizIndex++;
        quizIndex < quiz1.length ? showQuestion() : winQuiz1();
      } else {
        gameF.textContent = "Mauvaise réponse.";
      }
    };
    gameA.appendChild(btn);
  });
}

/* =====================================================
   🏆 RÉUSSITE QUIZ 1 + COMPTEUR PO
===================================================== */
const fadeScreen = document.getElementById("fadeScreen");
const poCounter = document.getElementById("poCounter");

function winQuiz1(){
  miniGame.classList.add("hidden");
  fadeScreen.classList.remove("hidden");

  let count = 0;
  const interval = setInterval(() => {
    count += 100;
    poCounter.textContent = `${count} PO`;
    if(count >= 5000){
      clearInterval(interval);
      playerPO = 5000;
      setTimeout(() => {
        fadeScreen.classList.add("hidden");
        openBook();
      }, 700);
    }
  }, 25);
}

/* =====================================================
   📖 LIVRE DIGITAL
===================================================== */
const bookContainer = document.getElementById("bookContainer");
const leftPage = document.getElementById("leftPage");
const rightPage = document.getElementById("rightPage");
const continueBtn = document.getElementById("continueQuestBtn");

const bookPages = [
  ["Businessplancov.png", ""],
  ["Businessplan4.jpg", "Businessplan1.png"],
  ["Businessplan2.png", "Businessplan3.png"]
];

let pageIndex = 0;

function openBook(){
  pageIndex = 0;
  updateBook();
  bookContainer.classList.remove("hidden");
}

function updateBook(){
  leftPage.src = "images/" + bookPages[pageIndex][0];
  rightPage.src = "images/" + bookPages[pageIndex][1];
  continueBtn.classList.toggle("hidden", pageIndex !== bookPages.length - 1);
}

document.querySelector(".book").onclick = () => {
  if(pageIndex < bookPages.length - 1){
    pageIndex++;
    updateBook();
  }
};

continueBtn.onclick = () => {
  bookContainer.classList.add("hidden");
  spawnPirate3();
};

/* =====================================================
   🏴‍☠️ PIRATE 3 + DIALOGUES 2
===================================================== */
const dialogues2 = [
  "Alors c’est toi le nouveau marchand ?",
  "J’ai une affaire à te proposer.",
  "Voyons comment tu juges une vraie négociation."
];

function spawnPirate3(){
  forceBackground();
  pirate3.classList.remove("hidden");
  setTimeout(() => pirate3.classList.add("show"), 100);

  setTimeout(() => {
    showDialogue(dialogues2, startMerchantGame);
  }, 900);
}

/* =====================================================
   🎮 MINI-JEU 2 — LE JUGEMENT DU MARCHAND (INTÉGRÉ)
===================================================== */
const merchantGame = document.getElementById("merchantGame");

let basePrice = 300;
let merchantGold = 1200;
let merchantExperience = 65;
let clientCredibility = Math.floor(Math.random() * 100);
let clientLuck = Math.random();

const goldEl = document.getElementById("gold");
const priceEl = document.getElementById("price");
const clueEl = document.getElementById("clue");

function startMerchantGame(){
  merchantGame.classList.remove("hidden");
}

window.analyzeClient = function(){
  let score = clientCredibility + merchantExperience * 0.5;
  clueEl.textContent =
    score > 120 ? "🟢 Il semble sûr de lui."
    : score > 80 ? "🟡 Son histoire paraît douteuse."
    : "🔴 Il cache quelque chose.";
};

window.lowerPrice = function(){
  endMerchant("Bonne décision. Vente honnête.");
};

window.keepPrice = function(){
  clientCredibility > 60
    ? endMerchant("Le client accepte le prix.")
    : endMerchant("Le client s’en va.");
};

window.refuseSale = function(){
  endMerchant("Tu refuses la vente.");
};

function endMerchant(msg){
  clueEl.textContent = "✅ " + msg;
  setTimeout(endFinal, 2200);
}

/* =====================================================
   🎆 FIN — TEXTE + FEUX D’ARTIFICE + MENU
===================================================== */
function endFinal(){
  merchantGame.classList.add("hidden");

  const final = document.createElement("div");
  final.innerHTML = "<h1>🎉 Bravo tu as gagné cette première quête</h1>";
  final.style.position = "fixed";
  final.style.inset = "0";
  final.style.display = "flex";
  final.style.justifyContent = "center";
  final.style.alignItems = "center";
  final.style.fontSize = "32px";
  final.style.zIndex = "6000";
  document.body.appendChild(final);

  document.body.classList.add("fireworks");

  setTimeout(() => {
    window.location.href = "menu.html";
  }, 3500);
}

/* =====================================================
   💬 DIALOGUE GÉNÉRIQUE
===================================================== */
function showDialogue(dialogues, onEnd){
  dialogueIndex = 0;
  bubbleContainer.innerHTML = "";

  const bubble = document.createElement("div");
  bubble.className = "dialogue-bubble";
  bubbleContainer.appendChild(bubble);

  bubble.onclick = () => {
    dialogueIndex++;
    if(dialogueIndex < dialogues.length){
      bubble.textContent = dialogues[dialogueIndex];
    } else {
      bubbleContainer.innerHTML = "";
      onEnd();
    }
  };

  bubble.textContent = dialogues[0];
}

});
