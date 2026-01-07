document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   🧠 ÉTAT GLOBAL
===================================================== */
let playerPO = 0;
let dialogueIndex = 0;

/* =====================================================
   🎬 VIDÉO (ANTI FOND NOIR)
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const questVideo = document.getElementById("questVideo");
const closeVideo = document.getElementById("closeVideo");
const toggleSound = document.getElementById("toggleSound");

toggleSound.onclick = () => {
  questVideo.muted = !questVideo.muted;
  toggleSound.textContent = questVideo.muted ? "🔇" : "🔊";
};

closeVideo.onclick = endVideo;
questVideo.onended = endVideo;

function endVideo(){

  // 1️⃣ FORCER le background AVANT tout
  forceBackground();

  // 2️⃣ attendre 1 frame navigateur
  requestAnimationFrame(() => {

    // 3️⃣ cacher la vidéo APRÈS
    videoContainer.style.display = "none";

    // 4️⃣ sécurité mobile (iOS)
    setTimeout(() => {
      forceBackground();
      startDialogues1();
    }, 100);

  });
}

/* =====================================================
   🌅 BACKGROUND + PIRATES (FORÇAGE TOTAL)
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
    p.style.visibility = "visible";
    p.style.opacity = "1";
  });
}

/* =====================================================
   💬 DIALOGUES 1
===================================================== */
const bubbleContainer = document.getElementById("bubbleContainer");
const skipBtn = document.getElementById("skipDialoguesBtn");

const dialogues1 = [
  "Bienvenue dans mon échoppe.",
  "Ici, seuls les bons marchands survivent.",
  "Montre-moi ce que tu vaux."
];

skipBtn.onclick = () => {
  bubbleContainer.innerHTML = "";
  skipBtn.style.display = "none";
  startMiniGame1();
};

function startDialogues1(){
  dialogueIndex = 0;
  skipBtn.style.display = "block";
  showDialogue(dialogues1, startMiniGame1);
}

/* =====================================================
   🎮 MINI-JEU 1 (QCM SIMPLE)
===================================================== */
const miniGame = document.getElementById("miniGameContainer");
const gameQ = document.getElementById("gameQuestion");
const gameA = document.getElementById("gameAnswers");
const gameF = document.getElementById("gameFeedback");

function startMiniGame1(){
  miniGame.classList.remove("hidden");
  gameF.textContent = "";
  gameQ.textContent = "Quel prix est le plus juste pour vendre ce trésor ?";

  gameA.innerHTML = "";
  ["200 PO", "500 PO", "1200 PO"].forEach((txt, i) => {
    const btn = document.createElement("button");
    btn.textContent = txt;
    btn.onclick = () => i === 1 ? winMiniGame1() : gameF.textContent = "Mauvais choix.";
    gameA.appendChild(btn);
  });
}

function winMiniGame1(){
  miniGame.classList.add("hidden");
  showReward(5000, openBook);
}

/* =====================================================
   🏆 RÉCOMPENSE + PO
===================================================== */
const fadeScreen = document.getElementById("fadeScreen");
const poCounter = document.getElementById("poCounter");

function showReward(amount, callback){
  playerPO += amount;
  poCounter.textContent = `+${amount} PO`;

  fadeScreen.classList.remove("hidden");

  setTimeout(() => {
    fadeScreen.classList.add("hidden");
    callback();
  }, 2500);
}

/* =====================================================
   📖 LIVRE DIGITAL
===================================================== */
const bookContainer = document.getElementById("bookContainer");
const continueBtn = document.getElementById("continueQuestBtn");

function openBook(){
  bookContainer.classList.remove("hidden");
}

continueBtn.onclick = () => {
  bookContainer.classList.add("hidden");
  spawnPirate3();
};

/* =====================================================
   🏴‍☠️ PIRATE CLIENT + DIALOGUES 2
===================================================== */
const dialogues2 = [
  "J’ai entendu parler de ton talent.",
  "Voyons si tu sais juger une vraie affaire."
];

function spawnPirate3(){
  forceBackground();
  pirate3.classList.remove("hidden");
  setTimeout(() => pirate3.classList.add("show"), 100);
  setTimeout(() => showDialogue(dialogues2, startMiniGame2), 800);
}

/* =====================================================
   🎮 MINI-JEU 2 – LE JUGEMENT DU MARCHAND
===================================================== */
function startMiniGame2(){
  miniGame.classList.remove("hidden");
  gameF.textContent = "";
  gameQ.textContent = "Quel est le meilleur jugement commercial ?";

  gameA.innerHTML = "";
  ["Baisser le prix", "Refuser la vente", "Négocier intelligemment"].forEach((txt, i) => {
    const btn = document.createElement("button");
    btn.textContent = txt;
    btn.onclick = () => i === 2 ? winFinal() : gameF.textContent = "Mauvais jugement.";
    gameA.appendChild(btn);
  });
}

/* =====================================================
   🎆 RÉUSSITE FINALE + FEUX D’ARTIFICE
===================================================== */
function winFinal(){
  miniGame.classList.add("hidden");
  showReward(8000, fireworksAndEnd);
}

function fireworksAndEnd(){
  document.body.classList.add("fireworks");

  setTimeout(() => {
    window.location.href = "menu.html";
  }, 3000);
}

/* =====================================================
   💬 FONCTION DIALOGUE GÉNÉRIQUE
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
      skipBtn.style.display = "none";
      onEnd();
    }
  };

  bubble.textContent = dialogues[0];
}

});
