document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   🧠 ÉTAT GLOBAL
===================================================== */
let dialogueIndex = 0;
let quizIndex = 0;
let currentSpeaker = null;
let playerPO = 0;

/* =====================================================
   📦 ÉLÉMENTS
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const questVideo = document.getElementById("questVideo");
const background = document.getElementById("background");

const pirate2 = document.getElementById("pirate2bis");
const pirate5 = document.getElementById("pirate5bis");
const pirate3 = document.getElementById("pirate3bis");

const bubbleContainer = document.getElementById("bubbleContainer");

const miniGame = document.getElementById("miniGameContainer");
const gameQ = document.getElementById("gameQuestion");
const gameA = document.getElementById("gameAnswers");
const gameF = document.getElementById("gameFeedback");

const fadeScreen = document.getElementById("fadeScreen");
const poCounter = document.getElementById("poCounter");

const bookContainer = document.getElementById("bookContainer");
const leftPage = document.getElementById("leftPage");
const rightPage = document.getElementById("rightPage");
const continueBtn = document.getElementById("continueQuestBtn");

const merchantGame = document.getElementById("merchantGame");

/* =====================================================
   ⏳ LOADER GÉNÉRIQUE
===================================================== */
function showLoader(text, duration = 1200, callback){
  fadeScreen.classList.remove("hidden");
  fadeScreen.querySelector(".loaderBox").textContent = text;

  setTimeout(() => {
    fadeScreen.classList.add("hidden");
    if(callback) callback();
  }, duration);
}

/* =====================================================
   🎬 VIDÉO → LOADER → BACKGROUND
===================================================== */
questVideo.onended = endVideo;
document.getElementById("closeVideo").onclick = endVideo;

function endVideo(){
  questVideo.pause();
  videoContainer.style.display = "none";

  showLoader("Chargement...", 1200, () => {
    forceBackground();
    startDialogues1();
  });
}

function forceBackground(){
  background.style.display = "block";
  background.classList.remove("hidden");

  [pirate2, pirate5].forEach(p => {
    p.classList.remove("hidden");
    p.style.opacity = "1";
  });
}

/* =====================================================
   💬 BULLES — POSITION AUTO AU-DESSUS DU PIRATE
===================================================== */
function showDialogue(dialogues, speaker, onEnd){
  dialogueIndex = 0;
  currentSpeaker = speaker;
  bubbleContainer.innerHTML = "";

  const bubble = document.createElement("div");
  bubble.className = "dialogue-bubble";

  const skipBtn = document.createElement("button");
  skipBtn.textContent = "Passer les dialogues";
  skipBtn.className = "skipDialogueBtn";
  skipBtn.onclick = () => {
    bubbleContainer.innerHTML = "";
    onEnd();
  };

  document.body.appendChild(skipBtn);

  function positionBubble(){
    const rect = speaker.getBoundingClientRect();
    bubble.style.left = rect.left + rect.width / 2 + "px";
    bubble.style.top = rect.top - 20 + "px";
    bubble.style.transform = "translate(-50%, -100%)";
  }

  bubble.onclick = () => {
    dialogueIndex++;
    if(dialogueIndex < dialogues.length){
      bubble.textContent = dialogues[dialogueIndex];
      positionBubble();
    } else {
      bubbleContainer.innerHTML = "";
      skipBtn.remove();
      onEnd();
    }
  };

  bubble.textContent = dialogues[0];
  bubbleContainer.appendChild(bubble);
  positionBubble();
}

/* =====================================================
   💬 DIALOGUES 1
===================================================== */
const dialogues1 = [
  "Bienvenue dans notre échoppe.",
  "Nous allons te raconter notre histoire.",
  "Puis ce sera à toi de juger."
];

function startDialogues1(){
  showDialogue(dialogues1, pirate5, () => {
    showLoader("Le mini-jeu va commencer...", 1200, startQuiz1);
  });
}

/* =====================================================
   🎮 MINI-JEU 1 — QUIZ
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

function startQuiz1(){
  quizIndex = 0;
  miniGame.classList.remove("hidden");
  showQuestion();
}

function showQuestion(){
  gameF.textContent = "";
  const q = quiz1[quizIndex];
  gameQ.textContent = q.question;
  gameA.innerHTML = "";

  q.answers.forEach((txt, i) => {
    const btn = document.createElement("button");
    btn.textContent = txt;
    btn.onclick = () => {
      if(i === q.correct){
        gameF.textContent = "Bonne réponse 👍";
        setTimeout(() => {
          quizIndex++;
          quizIndex < quiz1.length ? showQuestion() : winQuiz1();
        }, 800);
      } else {
        gameF.textContent = "Mauvaise réponse.";
      }
    };
    gameA.appendChild(btn);
  });
}

/* =====================================================
   🏆 RÉUSSITE QUIZ 1 — COMPTEUR PO
===================================================== */
function winQuiz1(){
  miniGame.classList.add("hidden");
  fadeScreen.classList.remove("hidden");

  let count = 0;
  const interval = setInterval(() => {
    count += 100;
    poCounter.textContent = count + " PO";
    if(count >= 5000){
      clearInterval(interval);
      fadeScreen.classList.add("hidden");
      openBook();
    }
  }, 25);
}

/* =====================================================
   📖 LIVRE DIGITAL — SANS CADRE / RETOUR ARRIÈRE
===================================================== */
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

document.addEventListener("keydown", e => {
  if(bookContainer.classList.contains("hidden")) return;
  if(e.key === "ArrowLeft" && pageIndex > 0){
    pageIndex--;
    updateBook();
  }
});

/* =====================================================
   🏴‍☠️ PIRATE 3 + DIALOGUES 2
===================================================== */
const dialogues2 = [
  "J’ai entendu parler de toi.",
  "Voyons comment tu gères une vraie négociation."
];

continueBtn.onclick = () => {
  bookContainer.classList.add("hidden");

  pirate3.style.left = "517px";
  pirate3.style.top = "141px";
  pirate3.classList.remove("hidden");

  setTimeout(() => {
    showDialogue(dialogues2, pirate3, () => {
      showLoader("Le Jugement du Marchand va commencer...", 1200, startMerchantGame);
    });
  }, 500);
};

/* =====================================================
   🎮 MINI-JEU 2 — JUGEMENT DU MARCHAND
===================================================== */
let basePrice = 300;
let merchantGold = 1200;
let competitorPrice = 250;
let clientCredibility = Math.floor(Math.random() * 100);

const goldEl = document.getElementById("gold");
const priceEl = document.getElementById("price");
const expEl = document.getElementById("exp");
const clueEl = document.getElementById("clue");

function startMerchantGame(){
  merchantGame.classList.remove("hidden");

  clueEl.textContent =
    "Règle : observe le client, utilise un indice si besoin, puis décide de ton prix.";

  expEl.textContent = competitorPrice;
}

window.analyzeClient = function(){
  clueEl.textContent = clientCredibility > 60
    ? "🟢 Le client semble honnête."
    : "🔴 Le client bluffe peut-être.";
};

window.lowerPrice = function(){
  endMerchant("Bonne décision.");
};

window.keepPrice = function(){
  endMerchant("Décision risquée, mais assumée.");
};

window.refuseSale = function(){
  endMerchant("Tu refuses la vente.");
};

function endMerchant(msg){
  merchantGame.classList.add("hidden");

  fadeScreen.classList.remove("hidden");
  fadeScreen.querySelector(".loaderBox").innerHTML =
    `<h1 style="color:gold;text-shadow:0 0 25px gold">
      🎉 Bravo tu as gagné cette quête
    </h1>`;

  document.body.classList.add("fireworks");

  setTimeout(() => {
    window.location.href = "menu.html";
  }, 3000);
}

});
