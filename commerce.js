document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   📳 VIBRATION
===================================================== */
function vibrate(p = 15){
  if ("vibrate" in navigator) navigator.vibrate(p);
}

/* =====================================================
   🌑 LOADER / FADE
===================================================== */
const fadeScreen = document.getElementById("fadeScreen");
const loaderBox  = fadeScreen.querySelector(".loaderBox");

function showLoader(text, callback){
  loaderBox.textContent = text;
  fadeScreen.style.display = "flex";
  fadeScreen.style.opacity = "1";

  setTimeout(() => {
    fadeScreen.style.opacity = "0";
    setTimeout(() => {
      fadeScreen.style.display = "none";
      callback && callback();
    }, 400);
  }, 1400);
}

/* =====================================================
   🎬 VIDÉO
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const video = document.getElementById("questVideo");
const toggleSound = document.getElementById("toggleSound");
const closeVideo = document.getElementById("closeVideo");

video.muted = true;

toggleSound.onclick = (e)=>{
  e.stopPropagation();
  vibrate(10);
  video.muted = !video.muted;
  toggleSound.textContent = video.muted ? "🔇" : "🔊";
};

closeVideo.onclick = (e)=>{
  e.stopPropagation();
  endVideo();
};

video.onended = endVideo;

function endVideo(){
  video.pause();
  videoContainer.style.display = "none";
  showLoader("Chargement...", showBackground);
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
  background.style.opacity = "1";

  pirate2.classList.remove("hidden");
  pirate5.classList.remove("hidden");

  // 🔥 LANCEMENT GARANTI DES DIALOGUES
  setTimeout(startDialogues1, 500);
}

/* =====================================================
   💬 BULLES + SKIP (CORRIGÉ)
===================================================== */
const bubbleContainer = document.getElementById("bubbleContainer");
const skipBtn = document.getElementById("skipDialoguesBtn");

function playDialogues(dialogues, onEnd){
  let index = 0;

  // ✅ TOUJOURS AFFICHÉ
  skipBtn.style.display = "block";

  function renderDialogue(){
    bubbleContainer.innerHTML = "";

    const d = dialogues[index];
    const bubble = document.createElement("div");
    bubble.className = "dialogue-bubble";
    bubble.innerHTML = d.text;

    const r = d.anchor.getBoundingClientRect();
    bubble.style.left = r.left + "px";
    bubble.style.top  = (r.top - 130) + "px";

    bubble.onclick = ()=>{
      vibrate(10);
      index++;
      index < dialogues.length ? renderDialogue() : finish();
    };

    bubbleContainer.appendChild(bubble);
  }

  function finish(){
    bubbleContainer.innerHTML = "";
    skipBtn.style.display = "none";
    skipBtn.onclick = null;
    onEnd && onEnd();
  }

  skipBtn.onclick = finish;

  // 🔥 PREMIÈRE BULLE TOUJOURS AFFICHÉE
  renderDialogue();
}

/* =====================================================
   💬 DIALOGUES 1 → MINI-JEU 1
===================================================== */
function startDialogues1(){
  playDialogues([
    { text:"Bienvenue sur le marché des trésors.", anchor: pirate5 },
    { text:"Je veux réussir ici.", anchor: pirate2 },
    { text:"Alors prouve que tu es digne de confiance.", anchor: pirate5 }
  ], ()=>{
    showLoader(
      "Termine ce mini-jeu pour continuer la quête",
      startMiniGame1
    );
  });
}

/* =====================================================
   🎮 MINI-JEU 1
===================================================== */
const miniGame = document.getElementById("miniGameContainer");
const gameQuestion = document.getElementById("gameQuestion");
const gameAnswers = document.getElementById("gameAnswers");
const gameFeedback = document.getElementById("gameFeedback");

function startMiniGame1(){
  miniGame.style.display = "flex";
  gameFeedback.textContent = "";

  gameQuestion.innerHTML = `
    Comment rassurer les clients ?
    <div class="multiHint">⚠️ Plusieurs réponses possibles</div>
  `;

  gameAnswers.innerHTML = "";

  const choices = [
    { text:"Montrer les pierres", ok:true },
    { text:"Mentir sur leur origine", ok:false },
    { text:"Donner l’adresse de l’échoppe", ok:true }
  ];

  let selected = [];

  choices.forEach((choice,i)=>{
    const btn = document.createElement("button");
    btn.textContent = choice.text;

    btn.onclick = ()=>{
      vibrate(10);
      btn.classList.toggle("selected");
      selected.includes(i)
        ? selected.splice(selected.indexOf(i),1)
        : selected.push(i);
    };

    gameAnswers.appendChild(btn);
  });

  const validate = document.createElement("button");
  validate.className = "validateBtn";
  validate.textContent = "Valider mes choix";

  validate.onclick = ()=>{
    const success =
      selected.length === 2 &&
      selected.every(i => choices[i].ok);

    if(success){
      gameFeedback.innerHTML = "✅ Bonne décision !";
      setTimeout(()=>{
        miniGame.style.display = "none";
        showLoader("Bravo ! Tu progresses dans la quête…", ()=>{});
      },1200);
    }else{
      gameFeedback.textContent = "❌ Mauvaise stratégie";
    }
  };

  gameAnswers.appendChild(validate);
}

});
