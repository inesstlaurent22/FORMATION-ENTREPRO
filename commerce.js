document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   🧠 ÉTAT GLOBAL
===================================================== */
let dialogueIndex = 0;
let quizIndex = 0;
let currentDialogues = [];
let currentOnEnd = null;

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
   ⏳ LOADER
===================================================== */
function showLoader(text, duration = 1200, callback){
  loaderBox.innerHTML = text;
  fadeScreen.classList.remove("hidden");

  setTimeout(() => {
    fadeScreen.classList.add("hidden");
    if(callback) callback();
  }, duration);
}

/* =====================================================
   🎬 VIDÉO → BACKGROUND
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
  pirate2.classList.remove("hidden");
  pirate5.classList.remove("hidden");
}

/* =====================================================
   💬 SYSTÈME DE DIALOGUES AVANCÉ (ANCRÉ)
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
  bubble.style.top = rect.top - 15 + "px";
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
   💬 DIALOGUES 1 (SCRIPT FINAL)
===================================================== */
function startDialogues1(){

  const dialogues1 = [
    { text:"Moussaillon ! Bienvenue sur le marché des trésors ! Ici, plein de pirates vendent des pierres précieuses… mais pour toi, qui débutes, faudra suivre mes conseils !", anchor: pirate5 },
    { text:"J’suis prêt, capitaine !", anchor: pirate2 },
    { text:"Écoute bien ! D’abord, tu dois te mettre au niveau des autres pirates… parle comme eux, montre que tu connais tes pierres. Ensuite… sois plus malin et plus rapide qu’eux !", anchor: pirate5 },
    { text:"Mais comment je fais ça ?", anchor: pirate2 },
    { text:"Regarde bien : la plupart ont une petite échoppe et vendent leurs pierres dans des petits sachets en velours. Les clients adorent ça ! Mais attention… faut te démarquer !", anchor: pirate5 },
    { text:"Me démarquer… c’est-à-dire ?", anchor: pirate2 },
    { text:"Plusieurs stratégies :<br>• vendre moins cher<br>• boîtes luxe<br>• grande boutique visible<br>• aller chez les clients", anchor: pirate5 },
    { text:"Donc je choisis selon mes clients !", anchor: pirate2 },
    { text:"Exactement. Observe, teste, et deviens incontournable.", anchor: pirate5 },
    { text:"MERCI capitaine !", anchor: pirate2 }
  ];

  showDialogues(dialogues1, () => {
    showLoader("Le mini-jeu va commencer…", 1000, startQuiz1);
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
   🏆 FIN QUIZ 1 → PO → LIVRE
===================================================== */
function winQuiz1(){
  miniGame.classList.add("hidden");

  loaderBox.innerHTML = `<div class="rewardCounter" id="poCounter">0 PO</div>`;
  fadeScreen.classList.remove("hidden");

  let count = 0;
  const interval = setInterval(() => {
    count += 100;
    document.getElementById("poCounter").textContent = count + " PO";
    if(count >= 5000){
      clearInterval(interval);
      setTimeout(() => {
        fadeScreen.classList.add("hidden");
        openBook();
      }, 600);
    }
  }, 25);
}

/* =====================================================
   📖 LIVRE — ANIMATION RÉALISTE DE PAGE
===================================================== */
const bookPages = [
  ["Businessplancov.png", ""],
  ["Businessplan4.jpg", "Businessplan1.png"],
  ["Businessplan2.png", "Businessplan3.png"]
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

book.addEventListener("click", e => {
  if(isTurning || pageIndex >= bookPages.length - 1) return;
  turnPage(1);
});

document.addEventListener("keydown", e => {
  if(bookContainer.classList.contains("hidden")) return;
  if(e.key === "ArrowLeft" && pageIndex > 0) turnPage(-1);
  if(e.key === "ArrowRight" && pageIndex < bookPages.length - 1) turnPage(1);
});

function turnPage(direction){
  isTurning = true;

  book.style.transform = "rotateY(" + (direction > 0 ? "-10deg" : "10deg") + ")";
  book.style.boxShadow = direction > 0
    ? "-30px 0 60px rgba(0,0,0,.5)"
    : "30px 0 60px rgba(0,0,0,.5)";

  setTimeout(() => {
    pageIndex += direction;
    updateBook();

    book.style.transform = "rotateY(0deg)";
    book.style.boxShadow = "0 0 40px rgba(0,0,0,.4)";
  }, 350);

  setTimeout(() => {
    isTurning = false;
  }, 700);
}

continueBtn.onclick = () => {
  bookContainer.classList.add("hidden");
  spawnPirate3();
};

/* =====================================================
   🏴‍☠️ PIRATE 3 → DIALOGUES 2 → MINI-JEU 2
===================================================== */
function spawnPirate3(){
  pirate3.classList.remove("hidden");
  pirate3.style.left = "517px";
  pirate3.style.top = "141px";

  const dialogues2 = [
    { text:"J’ai entendu parler de toi.", anchor: pirate3 },
    { text:"Voyons comment tu gères une vraie négociation.", anchor: pirate3 }
  ];

  showDialogues(dialogues2, () => {
    showLoader("Le Jugement du Marchand va commencer…", 1200, startMerchantGame);
  });
}

/* =====================================================
   🎮 MINI-JEU 2 — JUGEMENT DU MARCHAND
===================================================== */
function startMerchantGame(){
  merchantGame.classList.remove("hidden");
}

/* =====================================================
   🎆 FIN — FEUX D’ARTIFICE + MENU
===================================================== */
function endFinal(){
  merchantGame.classList.add("hidden");

  showLoader(
    `<h1 style="color:gold;text-shadow:0 0 30px gold">
      🎉 Bravo tu as gagné cette quête
    </h1>`,
    3000,
    () => window.location.href = "menu.html"
  );
}

});
