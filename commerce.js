document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     🔧 UTILITAIRES
  ===================================================== */
  function vibrate(p = 15){
    if ("vibrate" in navigator) navigator.vibrate(p);
  }

  /* =====================================================
     🌑 FADE / LOADER (SÛR)
  ===================================================== */
  const fadeScreen = document.getElementById("fadeScreen");
  const loaderBox  = fadeScreen.querySelector(".loaderBox");

  function fade(text, cb){
    loaderBox.textContent = text;
    fadeScreen.style.display = "flex";
    fadeScreen.style.opacity = "1";

    setTimeout(() => {
      fadeScreen.style.opacity = "0";

      setTimeout(() => {
        fadeScreen.style.display = "none";
        cb && cb();
      }, 400);

    }, 1400);
  }

  /* =====================================================
     🎬 VIDÉO
  ===================================================== */
  const videoContainer = document.getElementById("videoContainer");
  const video          = document.getElementById("questVideo");
  const toggleSound    = document.getElementById("toggleSound");
  const closeVideo     = document.getElementById("closeVideo");

  video.muted = true;

  toggleSound.onclick = () => {
    vibrate(10);
    video.muted = !video.muted;
    toggleSound.textContent = video.muted ? "🔇" : "🔊";
  };

  closeVideo.onclick = endVideo;
  video.onended      = endVideo;

  function endVideo(){
    video.pause();
    videoContainer.style.display = "none";
    fade("Chargement...", showBackground);
  }

  /* =====================================================
     🌅 BACKGROUND + PIRATES (FORÇAGE ABSOLU)
  ===================================================== */
  const background = document.getElementById("background");
  const pirate2    = document.getElementById("pirate2bis");
  const pirate5    = document.getElementById("pirate5bis");
  const pirate3    = document.getElementById("pirate3bis");

  function showBackground(){
    console.log("▶ BACKGROUND AFFICHÉ");

    // background
    background.style.display    = "block";
    background.style.opacity    = "1";
    background.style.visibility = "visible";

    // pirates visibles
    [pirate2, pirate5].forEach(p => {
      p.classList.remove("hidden");
      p.style.display    = "block";
      p.style.opacity    = "1";
      p.style.visibility = "visible";
    });
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
      bubble.style.top  = (r.top - 130) + "px";

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
     💬 DIALOGUES 1 → MINI-JEU 1
  ===================================================== */
  pirate5.onclick = () => {
    playDialogues([
      { text:"Bienvenue sur le marché des trésors.", anchor: pirate5 },
      { text:"Je veux réussir ici.", anchor: pirate2 },
      { text:"Alors prouve que tu es digne de confiance.", anchor: pirate5 }
    ], () => {
      fade("Termine ce mini jeu pour continuer la quête", startMiniGame1);
    });
  };

  /* =====================================================
     🎮 MINI-JEU 1
  ===================================================== */
  const miniGame     = document.getElementById("miniGameContainer");
  const gameQuestion = document.getElementById("gameQuestion");
  const gameAnswers  = document.getElementById("gameAnswers");
  const gameFeedback = document.getElementById("gameFeedback");

function startMiniGame1(){
  miniGame.style.display = "flex";
  gameQuestion.innerHTML = `
    Que dois-tu faire pour rassurer les clients ?
    <div class="multiHint">⚠️ Plusieurs réponses possibles</div>
  `;
  gameFeedback.textContent = "";
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

      if (selected.includes(index)) {
        selected = selected.filter(i => i !== index);
      } else {
        selected.push(index);
      }
    };

    gameAnswers.appendChild(btn);
  });

  const validateBtn = document.createElement("button");
  validateBtn.textContent = "Valider mes choix";
  validateBtn.className = "validateBtn";

  validateBtn.onclick = () => {
    const success =
      selected.length === 2 &&
      selected.every(i => choices[i].ok);

    if (success) {
      gameFeedback.innerHTML = "✅ <strong>Bonne décision !</strong>";
      gameFeedback.classList.add("success");

      setTimeout(() => {
        miniGame.style.display = "none";
        fade(
          "Bravo, tu as gagné 5000 pièces d’or et ton Business Plan",
          showBook
        );
      }, 1200);
    } else {
      gameFeedback.innerHTML = "❌ Mauvaise stratégie, essaie encore";
    }
  };

  gameAnswers.appendChild(validateBtn);
}
function showRewardThenBook(){
  fadeScreen.style.display = "flex";

  const counterEl = document.getElementById("poCounter");
  let value = 0;
  const target = 5000;

  const interval = setInterval(()=>{
    value += 100;
    counterEl.textContent = value;
    if(value >= target){
      counterEl.textContent = "5000";
      clearInterval(interval);

      setTimeout(()=>{
        fadeScreen.querySelector(".rewardLoader").style.animation = "rewardOut .6s forwards";
        setTimeout(()=>{
          fadeScreen.style.display = "none";
          showBook();
        },600);
      },1200);
    }
  },30);
}
  
/* =====================================================
   🏆 RÉCOMPENSE + COMPTEUR 5000 PO
===================================================== */
function showRewardThenBook(){
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
        showBook();
      },1200);
    }
  },30);
}

/* =====================================================
   📖 LIVRE — RECTO / VERSO + PAGE TURN
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
     ✨ PIRATE 3 + MINI-JEU 2
  ===================================================== */
  function spawnPirate3(){
    pirate3.classList.remove("hidden");
    pirate3.classList.add("show");
  }

  pirate3.onclick = () => {
    playDialogues([
      { text:"Vous êtes nouveaux sur le marché ?", anchor: pirate3 },
      { text:"Oui, nous vendons des pierres précieuses.", anchor: pirate2 },
      { text:"Les clients ont besoin de confiance.", anchor: pirate3 }
    ], () => {
      fade("Dernier mini jeu avant de finir la quête", startMiniGame2);
    });
  };

  /* =====================================================
     🎮 MINI-JEU 2 — VRAI / FAUX
  ===================================================== */
  const vfQuestions = [
    { q:"Voir les pierres rassure les clients.", ok:true },
    { q:"Mentir augmente la confiance.", ok:false },
    { q:"Un bon packaging aide à vendre.", ok:true }
  ];

  let vfIndex = 0;

  function startMiniGame2(){
    vfIndex = 0;
    miniGame.style.display = "flex";
    showVF();
  }

  function showVF(){
    if(vfIndex >= vfQuestions.length){
      endQuest();
      return;
    }

    const q = vfQuestions[vfIndex];
    gameQuestion.textContent = q.q;
    gameFeedback.textContent = "";
    gameAnswers.innerHTML = "";

    ["Vrai","Faux"].forEach(val => {
      const btn = document.createElement("button");
      btn.textContent = val;

      btn.onclick = () => {
        vibrate(15);
        vfIndex++;
        setTimeout(showVF, 400);
      };

      gameAnswers.appendChild(btn);
    });
  }

  /* =====================================================
     🏁 FIN DE QUÊTE
  ===================================================== */
  const endScreen = document.getElementById("endScreen");

  function endQuest(){
    fade("Bravo, tu as gagné la quête", () => {
      endScreen.style.display = "flex";
      setTimeout(() => {
        window.location.href = "menu.html";
      }, 3000);
    });
  }

});
