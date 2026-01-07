document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     📳 VIBRATION
  ===================================================== */
  function vibrate(p = 15){
    if ("vibrate" in navigator) navigator.vibrate(p);
  }

  /* =====================================================
     🌑 FADE / LOADER (CENTRAL)
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

  toggleSound.onclick = () => {
    vibrate(10);
    video.muted = !video.muted;
    toggleSound.textContent = video.muted ? "🔇" : "🔊";
  };

  closeVideo.onclick = endVideo;
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

  function showBackground(){
    background.style.display = "block";
    background.style.opacity = "1";

    pirate2.classList.remove("hidden");
    pirate5.classList.remove("hidden");
  }

  /* =====================================================
     💬 DIALOGUES
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
      bubble.style.top  = (r.top - 140) + "px";

      bubble.onclick = () => {
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
     ▶️ CLIC PIRATE → DIALOGUES → LOADER → MINI-JEU 1
  ===================================================== */
  pirate5.onclick = () => {

    const dialogues1 = [
      { text:"Bienvenue sur le marché des trésors.", anchor: pirate5 },
      { text:"Je veux réussir ici.", anchor: pirate2 },
      { text:"Alors prouve que tu es digne de confiance.", anchor: pirate5 }
    ];

    playDialogues(dialogues1, () => {
      showLoader(
        "Termine ce mini-jeu pour continuer la quête",
        startMiniGame1
      );
    });
  };

  /* =====================================================
     🎮 MINI-JEU 1 — MULTI-RÉPONSES
  ===================================================== */
  const miniGame = document.getElementById("miniGameContainer");
  const gameQuestion = document.getElementById("gameQuestion");
  const gameAnswers = document.getElementById("gameAnswers");
  const gameFeedback = document.getElementById("gameFeedback");

  function startMiniGame1(){

    console.log("🎮 Mini-jeu 1 démarré");

    miniGame.style.display = "flex";
    gameFeedback.textContent = "";

    gameQuestion.innerHTML = `
      Que dois-tu faire pour rassurer les clients ?
      <div class="multiHint">⚠️ Plusieurs réponses possibles</div>
    `;

    gameAnswers.innerHTML = "";

    const choices = [
      { text:"Montrer les pierres", ok:true },
      { text:"Mentir sur leur origine", ok:false },
      { text:"Donner l’adresse de l’échoppe", ok:true }
    ];

    let selected = [];

    choices.forEach((choice, index) => {
      const btn = document.createElement("button");
      btn.textContent = choice.text;

      btn.onclick = () => {
        vibrate(10);
        btn.classList.toggle("selected");

        selected.includes(index)
          ? selected = selected.filter(i => i !== index)
          : selected.push(index);
      };

      gameAnswers.appendChild(btn);
    });

    const validateBtn = document.createElement("button");
    validateBtn.textContent = "Valider mes choix";
    validateBtn.className = "validateBtn";

    validateBtn.onclick = () => {
      vibrate(20);

      const success =
        selected.length === 2 &&
        selected.every(i => choices[i].ok);

      if(success){
        gameFeedback.innerHTML = "✅ <strong>Bonne décision !</strong>";

        setTimeout(() => {
          miniGame.style.display = "none";
          showLoader(
            "Bravo, tu as gagné 5000 pièces d’or et ton Business Plan",
            showBook   // ou ta suite
          );
        }, 1200);

      } else {
        gameFeedback.innerHTML = "❌ Mauvaise stratégie, essaie encore";
      }
    };

    gameAnswers.appendChild(validateBtn);
  }


/* =====================================================
   🏆 RÉCOMPENSE + COMPTEUR 5000 PO
===================================================== */
function showRewardThenBook(){
  fadeScreen.classList.remove("hidden");
  fadeScreen.style.display = "flex";

  loaderBox.innerHTML = `
    <div class="rewardTitle">Bravo ! Tu as gagné</div>
    <div class="rewardCounter"><span id="poCounter">0</span></div>
    <div class="rewardLabel">pièces d’or 💰</div>
    <div class="rewardSub">et ton business plan</div>
  `;

  let value = 0;
  const counter = document.getElementById("poCounter");

  const interval = setInterval(()=>{
    value += 100;
    counter.textContent = value;
    if(value >= 5000){
      counter.textContent = "5000";
      clearInterval(interval);

      setTimeout(()=>{
        fadeScreen.style.display = "none";
        fadeScreen.classList.add("hidden");
        showBook();
      },1200);
    }
  },30);
}

/* =====================================================
   📖 LIVRE
===================================================== */
const bookContainer = document.getElementById("bookContainer");
const leftPage = document.getElementById("leftPage");
const rightPage = document.getElementById("rightPage");
const continueBtn = document.getElementById("continueQuestBtn");

const bookPages = [
  { left:null, right:"images/Businessplancov.png" },
  { left:"images/Businessplan1.png", right:"images/Businessplan2.png" },
  { left:"images/Businessplan2.png", right:"images/Businessplan3.png" }
];

let bookIndex = 0;

function showBook(){
  bookContainer.classList.remove("hidden");
  bookContainer.classList.add("show");
  bookIndex = 0;
  updateBook();
}

function updateBook(){
  const p = bookPages[bookIndex];
  leftPage.src = p.left || "";
  rightPage.src = p.right;
  continueBtn.style.display =
    bookIndex === bookPages.length - 1 ? "block" : "none";
}

document.querySelector(".book").onclick = (e)=>{
  const rect = e.currentTarget.getBoundingClientRect();
  const isRight = e.clientX > rect.left + rect.width/2;

  if(isRight && bookIndex < bookPages.length-1){
    bookIndex++;
  }else if(!isRight && bookIndex > 0){
    bookIndex--;
  }
  updateBook();
};

continueBtn.onclick = ()=>{
  bookContainer.classList.remove("show");
  bookContainer.classList.add("hidden");
  spawnPirate3();
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
    { text:"Alors montre-les aux clients.", anchor: pirate3 }
  ], ()=>{
    fade("Dernier mini-jeu avant de finir la quête", startMiniGame2);
  });
};

/* =====================================================
   🎮 MINI-JEU 2
===================================================== */
function startMiniGame2(){
  selected = [];
  miniGame.style.display = "flex";

  gameQuestion.innerHTML = `
    Comment gagner la confiance des clients ?
    <div class="multiHint">⚠️ Plusieurs réponses possibles</div>
  `;
  gameAnswers.innerHTML = "";
  gameFeedback.textContent = "";

  const choices = [
    {text:"Expliquer l’origine", ok:true},
    {text:"Cacher les défauts", ok:false},
    {text:"Montrer la qualité", ok:true}
  ];

  choices.forEach((c,i)=>{
    const btn=document.createElement("button");
    btn.textContent=c.text;
    btn.onclick=()=>{
      vibrate(15);
      btn.classList.toggle("selected");
      selected.includes(i)
        ? selected.splice(selected.indexOf(i),1)
        : selected.push(i);
    };
    gameAnswers.appendChild(btn);
  });

  const validate=document.createElement("button");
  validate.className="validateBtn";
  validate.textContent="Valider mes choix";

  validate.onclick=()=>{
    const good =
      selected.length === 2 &&
      selected.every(i=>choices[i].ok);

    if(good){
      fade("Bravo, tu as gagné la quête 🎆", endQuest);
    }else{
      gameFeedback.textContent="❌ Mauvaise stratégie";
    }
  };

  gameAnswers.appendChild(validate);
}

/* =====================================================
   🏁 FIN → MENU
===================================================== */
function endQuest(){
  setTimeout(()=>{
    window.location.href="menu.html";
  },3000);
}

});
