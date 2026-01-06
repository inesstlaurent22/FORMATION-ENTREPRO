document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   📳 VIBRATION
===================================================== */
function vibrate(p = 15){
  if ("vibrate" in navigator) navigator.vibrate(p);
}

/* =====================================================
   🌑 FADE / LOADER
===================================================== */
const fadeScreen = document.getElementById("fadeScreen");
const loaderBox = fadeScreen.querySelector(".loaderBox");

function fade(text, cb){
  loaderBox.innerHTML = text;
  fadeScreen.style.display = "flex";
  setTimeout(()=>{
    fadeScreen.style.display = "none";
    cb && cb();
  }, 1800);
}

/* =====================================================
   🎬 VIDÉO
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const video = document.getElementById("questVideo");
const toggleSound = document.getElementById("toggleSound");
const closeVideo = document.getElementById("closeVideo");

video.muted = true;

toggleSound.onclick = ()=>{
  vibrate(10);
  video.muted = !video.muted;
  toggleSound.textContent = video.muted ? "🔇" : "🔊";
};

closeVideo.onclick = endVideo;
video.onended = endVideo;

function endVideo(){
  video.pause();
  videoContainer.style.display = "none";
  fade("Chargement...", showBackground);
}

/* =====================================================
   🌅 BACKGROUND + PIRATES
===================================================== */
const background = document.getElementById("background");
const pirate2 = document.getElementById("pirate2bis");
const pirate5 = document.getElementById("pirate5bis");
const pirate3 = document.getElementById("pirate3bis");

function showBackground(){
  background.style.display = "block";
  pirate2.classList.remove("hidden");
  pirate5.classList.remove("hidden");
  setTimeout(()=> background.style.opacity = 1, 50);
}

/* =====================================================
   💬 BULLES + SKIP
===================================================== */
const bubbleContainer = document.getElementById("bubbleContainer");
const skipBtn = document.getElementById("skipDialoguesBtn");

function playDialogues(dialogues, onEnd){
  let i = 0;
  skipBtn.style.display = "block";

  function show(){
    bubbleContainer.innerHTML = "";
    const d = dialogues[i];

    const bubble = document.createElement("div");
    bubble.className = "dialogue-bubble";
    bubble.innerHTML = d.text;

    const r = d.anchor.getBoundingClientRect();
    bubble.style.left = r.left + "px";
    bubble.style.top = (r.top - 120) + "px";

    bubble.onclick = ()=>{
      vibrate(10);
      i++;
      i < dialogues.length ? show() : end();
    };

    bubbleContainer.appendChild(bubble);
  }

  function end(){
    bubbleContainer.innerHTML = "";
    skipBtn.style.display = "none";
    onEnd && onEnd();
  }

  skipBtn.onclick = end;
  show();
}

/* =====================================================
   💬 DIALOGUES 1 → MINI-JEU 1
===================================================== */
pirate5.onclick = ()=>{
  playDialogues([
    { text:"Bienvenue sur le marché des trésors.", anchor: pirate5 },
    { text:"Je veux réussir ici.", anchor: pirate2 },
    { text:"Alors prouve que tu es digne de confiance.", anchor: pirate5 }
  ], ()=>{
    fade("Termine ce mini jeu pour continuer la quête", startMiniGame1);
  });
};

/* =====================================================
   🎮 MINI-JEU 1
===================================================== */
const miniGame = document.getElementById("miniGameContainer");
const gameQuestion = document.getElementById("gameQuestion");
const gameAnswers = document.getElementById("gameAnswers");
const gameFeedback = document.getElementById("gameFeedback");

let goodChoices = 0;

function startMiniGame1(){
  goodChoices = 0;
  miniGame.style.display = "flex";
  gameQuestion.textContent = "Que dois-tu faire pour rassurer les clients ?";
  gameFeedback.textContent = "";
  gameAnswers.innerHTML = "";

  [
    { text:"Montrer les pierres", good:true },
    { text:"Mentir sur leur origine", good:false },
    { text:"Donner l’adresse de l’échoppe", good:true }
  ].forEach(choice=>{
    const btn = document.createElement("button");
    btn.textContent = choice.text;

    btn.onclick = ()=>{
      vibrate(20);
      btn.classList.add("selected");

      if(choice.good){
        goodChoices++;
        gameFeedback.textContent = "👍 Bonne décision";
      } else {
        gameFeedback.textContent = "❌ Mauvaise idée";
      }

      if(goodChoices >= 2){
        miniGame.style.display = "none";
        fade("Bravo, tu as gagné 5000 pièces d’or et ton Business Plan", showBook);
      }
    };

    gameAnswers.appendChild(btn);
  });
}

/* =====================================================
   📖 LIVRE DIGITAL
===================================================== */
const bookContainer = document.getElementById("bookContainer");
const leftPage = document.getElementById("leftPage");
const rightPage = document.getElementById("rightPage");

const pages = [
  "images/Businessplancov.png",
  "images/Businessplan1.png",
  "images/Businessplan2.png",
  "images/Businessplan3.png"
];

let bookIndex = 0;

function showBook(){
  bookContainer.classList.add("show");
  updateBook();
}

function updateBook(){
  rightPage.src = pages[bookIndex];
  leftPage.src = bookIndex > 0 ? "images/Businessplan4.jpg" : "";
}

document.querySelector(".book").onclick = ()=>{
  if(bookIndex >= pages.length - 1) return;
  bookIndex++;
  updateBook();

  if(bookIndex === pages.length - 1){
    setTimeout(spawnPirate3, 600);
  }
};

/* =====================================================
   ✨ PIRATE 3 + DIALOGUES 2
===================================================== */
function spawnPirate3(){
  pirate3.classList.remove("hidden");
  pirate3.classList.add("show");
}

pirate3.onclick = ()=>{
  playDialogues([
    { text:"Vous êtes nouveaux sur le marché ?", anchor: pirate3 },
    { text:"Oui, nous vendons des pierres précieuses.", anchor: pirate2 },
    { text:"Les clients ont besoin de confiance.", anchor: pirate3 }
  ], ()=>{
    fade("Dernier mini jeu avant de finir la quête", startMiniGame2);
  });
};

/* =====================================================
   🎮 MINI-JEU 2 — VRAI / FAUX DU MARCHÉ PIRATE
===================================================== */
const vraiFauxQuestions = [
  { q:"Les clients ont plus confiance quand ils voient les pierres.", correct:true },
  { q:"Mentir sur la provenance rassure les clients.", correct:false },
  { q:"Le packaging influence la valeur perçue.", correct:true },
  { q:"Un pirate sérieux cache ses pierres.", correct:false }
];

let vfIndex = 0;
let vfScore = 0;

function startMiniGame2(){
  vfIndex = 0;
  vfScore = 0;
  miniGame.style.display = "flex";
  showVraiFaux();
}

function showVraiFaux(){
  if(vfIndex >= vraiFauxQuestions.length){
    endQuest();
    return;
  }

  const q = vraiFauxQuestions[vfIndex];
  gameQuestion.textContent = q.q;
  gameFeedback.textContent = "";
  gameAnswers.innerHTML = "";

  ["Vrai","Faux"].forEach(val=>{
    const btn = document.createElement("button");
    btn.textContent = val;

    btn.onclick = ()=>{
      vibrate(20);
      const isTrue = val === "Vrai";
      if(isTrue === q.correct){
        vfScore++;
        gameFeedback.textContent = "✅ Correct";
      } else {
        gameFeedback.textContent = "❌ Faux";
      }
      vfIndex++;
      setTimeout(showVraiFaux, 600);
    };

    gameAnswers.appendChild(btn);
  });
}

/* =====================================================
   🏁 FIN DE QUÊTE
===================================================== */
const endScreen = document.getElementById("endScreen");

function endQuest(){
  fade("Bravo, tu as gagné la quête", ()=>{
    endScreen.style.display = "flex";
    setTimeout(()=>{
      window.location.href = "menu.html";
    }, 3000);
  });
}

});
