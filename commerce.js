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

function showLoader(text, cb){
  loaderBox.innerHTML = text;
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


  /* ======== SÉCURITÉ ======== */
  const videoContainer = document.getElementById("videoContainer");
  const video = document.getElementById("questVideo");
  const toggleSound = document.getElementById("toggleSound");
  const closeVideo = document.getElementById("closeVideo");

  if (!video || !toggleSound || !closeVideo) {
    console.error("❌ Boutons vidéo introuvables dans le DOM");
    return;
  }

  video.muted = true;

  /* ======== SON ======== */
  toggleSound.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    video.muted = !video.muted;
    toggleSound.textContent = video.muted ? "🔇" : "🔊";

    console.log("🔊 Toggle sound :", !video.muted);
  });

  /* ======== FERMER VIDÉO ======== */
  closeVideo.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("❌ Vidéo fermée");
    endVideo();
  });

  /* ======== FIN VIDÉO AUTO ======== */
  video.addEventListener("ended", endVideo);

  function endVideo(){
    video.pause();
    video.currentTime = 0;
    videoContainer.style.display = "none";

    // fallback sécurisé
    if (typeof showLoader === "function") {
      showLoader("Chargement...", showBackground);
    } else if (typeof showBackground === "function") {
      showBackground();
    } else {
      console.warn("⚠️ Aucun loader / background défini");
    }
  }

});
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
}

/* =====================================================
   💬 DIALOGUES + SKIP
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
   ▶️ PIRATE 5 → DIALOGUES 1 → MINI-JEU 1
===================================================== */
pirate5.onclick = () => {
  playDialogues([
    { text:"Bienvenue sur le marché des trésors.", anchor: pirate5 },
    { text:"Je veux réussir ici.", anchor: pirate2 },
    { text:"Alors prouve que tu es digne de confiance.", anchor: pirate5 }
  ], () => {
    showLoader("Termine ce mini-jeu pour continuer la quête", startMiniGame1);
  });
};

/* =====================================================
   🎮 MINI-JEU 1 — STRATÉGIE
===================================================== */
const miniGame = document.getElementById("miniGameContainer");
const gameQuestion = document.getElementById("gameQuestion");
const gameAnswers = document.getElementById("gameAnswers");
const gameFeedback = document.getElementById("gameFeedback");

function startMiniGame1(){
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

  choices.forEach((c,i)=>{
    const btn = document.createElement("button");
    btn.textContent = c.text;
    btn.onclick = ()=>{
      vibrate(10);
      btn.classList.toggle("selected");
      selected.includes(i)
        ? selected = selected.filter(x=>x!==i)
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
      gameFeedback.innerHTML = "✅ <strong>Bonne décision !</strong>";
      setTimeout(()=>{
        miniGame.style.display = "none";
        showLoader(
          "Bravo ! Tu as gagné 5000 pièces d’or 💰 et ton Business Plan",
          showBook
        );
      }, 1200);
    }else{
      gameFeedback.textContent = "❌ Mauvaise stratégie";
    }
  };

  gameAnswers.appendChild(validate);
}

/* =====================================================
   📖 LIVRE DIGITAL
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
  bookContainer.style.display = "flex";
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
  const right = e.clientX > rect.left + rect.width/2;

  if(right && bookIndex < bookPages.length-1) bookIndex++;
  else if(!right && bookIndex > 0) bookIndex--;

  updateBook();
};

continueBtn.onclick = ()=>{
  bookContainer.style.display = "none";
  spawnPirate3();
};

/* =====================================================
   ✨ PIRATE 3 → MINI-JEU 2
===================================================== */
function spawnPirate3(){
  pirate3.classList.remove("hidden");
  pirate3.classList.add("show");
}

pirate3.onclick = ()=>{
  playDialogues([
    { text:"Vous êtes nouveaux sur le marché ?", anchor: pirate3 },
    { text:"Oui, nous vendons des pierres précieuses.", anchor: pirate2 },
    { text:"Je vais juger votre sérieux.", anchor: pirate3 }
  ], ()=>{
    showLoader("Le jugement du marchand commence...", startMiniGame2);
  });
};

/* =====================================================
   ⚖️ MINI-JEU 2 — LE JUGEMENT DU MARCHAND
===================================================== */
const jugement = [
  { q:"Montres-tu toujours tes pierres ?", ok:true },
  { q:"Mentir est-il une bonne stratégie ?", ok:false },
  { q:"Le packaging influence-t-il la confiance ?", ok:true }
];

let jIndex = 0;

function startMiniGame2(){
  miniGame.style.display = "flex";
  showJugement();
}

function showJugement(){
  if(jIndex >= jugement.length){
    endQuest();
    return;
  }

  const q = jugement[jIndex];
  gameQuestion.textContent = q.q;
  gameAnswers.innerHTML = "";
  gameFeedback.textContent = "";

  ["Vrai","Faux"].forEach(v=>{
    const btn = document.createElement("button");
    btn.textContent = v;
    btn.onclick = ()=>{
      const answer = (v === "Vrai");
      answer === q.ok
        ? gameFeedback.textContent = "✅ Bon jugement"
        : gameFeedback.textContent = "❌ Mauvais choix";

      jIndex++;
      setTimeout(showJugement, 700);
    };
    gameAnswers.appendChild(btn);
  });
}

/* =====================================================
   🏁 FIN DE QUÊTE
===================================================== */
function endQuest(){
  showLoader("🎆 Bravo, tu as gagné la quête 🎆", ()=>{
    setTimeout(()=>{
      window.location.href = "menu.html";
    }, 2000);
  });
}

});
