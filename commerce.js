document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   🧠 ÉTAT GLOBAL
===================================================== */
let dialogueIndex = 0;
let quizIndex = 0;
let currentDialogues = [];
let currentOnEnd = null;
let soundOn = false;

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
const loaderBox = fadeScreen.querySelector(".loaderBox");

const bookContainer = document.getElementById("bookContainer");
const book = document.querySelector(".book");
const leftPage = document.getElementById("leftPage");
const rightPage = document.getElementById("rightPage");
const continueBtn = document.getElementById("continueQuestBtn");

const merchantGame = document.getElementById("merchantGame");

/* =====================================================
   🎬 VIDÉO — SOUND + FIN
===================================================== */
const soundBtn = document.createElement("button");
soundBtn.textContent = "🔇";
soundBtn.style.position = "absolute";
soundBtn.style.top = "20px";
soundBtn.style.left = "20px";
soundBtn.style.zIndex = "3200";
videoContainer.appendChild(soundBtn);

soundBtn.onclick = () => {
  soundOn = !soundOn;
  questVideo.muted = !soundOn;
  soundBtn.textContent = soundOn ? "🔊" : "🔇";
};

questVideo.onended = endVideo;
document.getElementById("closeVideo").onclick = endVideo;

function endVideo(){
  questVideo.pause();
  videoContainer.style.display = "none";
  showLoader("Chargement...", 1000, () => {
    forceBackground();
    enableFirstDialogueTrigger();
  });
}

/* =====================================================
   🌅 BACKGROUND
===================================================== */
function forceBackground(){
  background.classList.remove("hidden");
  pirate2.classList.remove("hidden");
  pirate5.classList.remove("hidden");
}

/* =====================================================
   🏴‍☠️ PIRATE 5 — HOVER + CLICK
===================================================== */
pirate5.style.cursor = "pointer";

pirate5.addEventListener("mouseenter", () => {
  pirate5.classList.add("glow");
});

pirate5.addEventListener("mouseleave", () => {
  pirate5.classList.remove("glow");
});

function enableFirstDialogueTrigger(){
  pirate5.addEventListener("click", startDialogues1, { once:true });
}

/* =====================================================
   💬 SYSTÈME DE DIALOGUES (BULLE SUIT PIRATE)
===================================================== */
function showDialogues(dialogues, onEnd){
  currentDialogues = dialogues;
  currentOnEnd = onEnd;
  dialogueIndex = 0;

  bubbleContainer.innerHTML = "";

  const bubble = document.createElement("div");
  bubble.className = "dialogue-bubble";

  const skipBtn = document.createElement("button");
  skipBtn.className = "skipDialogueBtn";
  skipBtn.textContent = "Passer les dialogues";
  skipBtn.onclick = endDialogues;

  document.body.appendChild(skipBtn);
  bubbleContainer.appendChild(bubble);

  bubble.onclick = nextDialogue;
  renderDialogue();
}

function renderDialogue(){
  const d = currentDialogues[dialogueIndex];
  const anchor = d.anchor;
  const rect = anchor.getBoundingClientRect();
  const bubble = document.querySelector(".dialogue-bubble");

  bubble.innerHTML = d.text;
  bubble.style.left = rect.left + rect.width / 2 + "px";
  bubble.style.top = rect.top - 10 + "px";
  bubble.style.transform = "translate(-50%, -100%)";
}

function nextDialogue(){
  dialogueIndex++;
  if(dialogueIndex < currentDialogues.length){
    renderDialogue();
  } else {
    endDialogues();
  }
}

function endDialogues(){
  bubbleContainer.innerHTML = "";
  document.querySelectorAll(".skipDialogueBtn").forEach(b => b.remove());
  if(currentOnEnd) currentOnEnd();
}

/* =====================================================
   💬 DIALOGUES 1 (CLIC SUR PIRATE 5)
===================================================== */
function startDialogues1(){

  const dialogues1 = [
    { text:"Moussaillon ! Bienvenue sur le marché des trésors ! Ici, plein de pirates vendent des pierres précieuses… mais pour toi, qui débutes, faudra suivre mes conseils !", anchor: pirate5 },
    { text:"J’suis prêt, capitaine !", anchor: pirate2 },
    { text:"Écoute bien ! D’abord, tu dois te mettre au niveau des autres pirates… Ensuite… sois plus malin qu’eux !", anchor: pirate5 },
    { text:"MERCI capitaine !", anchor: pirate2 }
  ];

  showDialogues(dialogues1, () => {
    showLoader("Le mini-jeu va commencer…", 900, startQuiz1);
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
        }, 700);
      } else {
        gameF.textContent = "Mauvaise réponse.";
      }
    };
    gameA.appendChild(btn);
  });
}

/* =====================================================
   🏆 RÉUSSITE QUIZ 1 — PO + GEM EXPLOSION
===================================================== */
function winQuiz1(){
  miniGame.classList.add("hidden");

  fadeScreen.classList.remove("hidden");
  fadeScreen.classList.add("gems");

  loaderBox.innerHTML = `
    <div class="rewardTitle">Bravo ! Tu as gagné</div>
    <div class="rewardCounter" id="poCounter">0 PO</div>
  `;

  let count = 0;
  const interval = setInterval(() => {
    count += 100;
    document.getElementById("poCounter").textContent = count + " PO";
    if(count >= 5000){
      clearInterval(interval);
      setTimeout(() => {
        fadeScreen.classList.remove("gems");
        fadeScreen.classList.add("hidden");
        openBook();
      }, 800);
    }
  }, 25);
}

/* =====================================================
   📖 LIVRE — NOUVELLE LOGIQUE
===================================================== */
const bookPages = [
  ["Businessplancov.png","Businessplan4.jpg"],
  ["Businessplan1.png","Businessplan4.jpg"],
  ["Businessplan2.png","Businessplan4.jpg"],
  ["Businessplan3.png","Businessplan4.jpg"]
];

let pageIndex = 0;
let isTurning = false;

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

book.addEventListener("click", () => {
  if(isTurning || pageIndex >= bookPages.length - 1) return;
  turnPage(1);
});

function turnPage(dir){
  isTurning = true;
  book.style.transform = "rotateY(-8deg)";
  setTimeout(() => {
    pageIndex += dir;
    updateBook();
    book.style.transform = "rotateY(0deg)";
  }, 350);
  setTimeout(() => isTurning = false, 700);
}

continueBtn.onclick = () => {
  bookContainer.classList.add("hidden");
  spawnPirate3();
};

/* =====================================================
   🏴‍☠️ PIRATE 3 — PLUS HAUT + DIALOGUES
===================================================== */
function spawnPirate3(){
  pirate3.classList.remove("hidden");

  const y = pirate3.offsetTop;
  pirate3.style.top = (y - y * 0.2) + "px";

  const dialogues2 = [
    { text:"C’est toi le nouveau vendeur de pierres?", anchor: pirate5 },
    { text:"Oui, vous cherchez quel type de pierres ?", anchor: pirate2 },
    { text:"Je veux bien les voir, mais on fait confiance qu’à un seul vendeur…", anchor: pirate5 }
  ];

  showDialogues(dialogues2, () => {
    showLoader("Le Jugement du Marché va commencer…", 1000, startMerchantGame);
  });
}

/* =====================================================
   🎮 MINI-JEU 2 — JUGEMENT DU MARCHÉ
===================================================== */
function startMerchantGame(){
  merchantGame.classList.remove("hidden");
  document.getElementById("clue").textContent =
    "Règle : observe le marché et prends la meilleure décision.";
}

window.analyzeClient = function(){
  document.getElementById("clue").textContent =
    "💡 Vous n’êtes que 2 à vendre cette pierre";
};

window.lowerPrice = function(){
  failMerchant();
};

window.keepPrice = function(){
  winFinal();
};

window.refuseSale = function(){
  failMerchant();
};

function failMerchant(){
  document.getElementById("clue").textContent = "❌ Mauvaise décision.";
}

function winFinal(){
  merchantGame.classList.add("hidden");
  fadeScreen.classList.remove("hidden");
  fadeScreen.classList.add("fireworks");

  loaderBox.innerHTML = `
    <h1 style="color:gold;text-shadow:0 0 30px gold">
      🎉 Bravo tu as gagné cette quête
    </h1>
  `;

  setTimeout(() => {
    window.location.href = "menu.html";
  }, 3000);
}

/* =====================================================
   ⏳ LOADER GÉNÉRIQUE
===================================================== */
function showLoader(text, duration, callback){
  loaderBox.innerHTML = text;
  fadeScreen.classList.remove("hidden");

  setTimeout(() => {
    fadeScreen.classList.add("hidden");
    if(callback) callback();
  }, duration);
}

});
