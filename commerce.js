document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   📳 VIBRATION
===================================================== */
const vibrate = (p=15)=>{
  if(navigator.vibrate) navigator.vibrate(p);
};

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
  }, 2000);
}

/* =====================================================
   🎬 VIDÉO
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const video = document.getElementById("questVideo");

document.getElementById("toggleSound").onclick = ()=>{
  video.muted = !video.muted;
  vibrate(10);
};

document.getElementById("closeVideo").onclick = endVideo;
video.onended = endVideo;

function endVideo(){
  vibrate(20);
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
  setTimeout(()=>background.style.opacity=1,50);
}

/* =====================================================
   💬 BULLES DE DIALOGUE
===================================================== */
const bubbleContainer = document.getElementById("bubbleContainer");

function playDialogues(dialogues, onEnd){
  let i = 0;

  function show(){
    bubbleContainer.innerHTML = "";
    const d = dialogues[i];
    const bubble = document.createElement("div");
    bubble.className = "dialogue-bubble";
    bubble.innerHTML = d.text;

    const r = d.anchor.getBoundingClientRect();
    bubble.style.left = r.left + "px";
    bubble.style.top = (r.top - 150) + "px";

    bubble.onclick = ()=>{
      vibrate(10);
      i++;
      i < dialogues.length ? show() : end();
    };

    bubbleContainer.appendChild(bubble);
  }

  function end(){
    bubbleContainer.innerHTML = "";
    onEnd && onEnd();
  }

  show();
}

/* =====================================================
   💬 DIALOGUES 1
===================================================== */
pirate5.onclick = ()=>{
  playDialogues([
    { text:"Moussaillon ! Bienvenue sur le marché des trésors !", anchor:pirate5 },
    { text:"J’suis prêt, capitaine !", anchor:pirate2 },
    { text:"Observe les autres pirates et sois plus malin qu’eux.", anchor:pirate5 },
    { text:"Je ferai mieux qu’eux !", anchor:pirate2 }
  ], ()=>{
    fade("Termines ce mini jeu pour poursuivre ta quête", startMiniGame1);
  });
};

/* =====================================================
   🎮 MINI-JEU 1
===================================================== */
const miniGameContainer = document.getElementById("miniGameContainer");
const gameQuestion = document.getElementById("gameQuestion");
const gameAnswers = document.getElementById("gameAnswers");
const gameFeedback = document.getElementById("gameFeedback");

const quiz1 = [
  { q:"Pourquoi vendre les pierres ?", a:["Acheter un bateau","Les manger","Décorer"], c:0 },
  { q:"Où observer les concurrents ?", a:["Au marché","À la taverne","En mer"], c:0 }
];

let step = 0;

function startMiniGame1(){
  miniGameContainer.style.display = "flex";
  step = 0;
  showQuestion();
}

function showQuestion(){
  if(step >= quiz1.length){
    miniGameContainer.style.display = "none";
    showReward();
    return;
  }

  const q = quiz1[step];
  gameQuestion.textContent = q.q;
  gameAnswers.innerHTML = "";
  gameFeedback.textContent = "";

  q.a.forEach((ans,i)=>{
    const btn = document.createElement("button");
    btn.textContent = ans;
    btn.onclick = ()=>{
      document.querySelectorAll("#gameAnswers button")
        .forEach(b=>b.classList.remove("selected"));
      btn.classList.add("selected");

      if(i === q.c){
        vibrate(25);
        step++;
        setTimeout(showQuestion,600);
      } else {
        vibrate([10,30,10]);
        gameFeedback.textContent = "❌ Réfléchis encore";
      }
    };
    gameAnswers.appendChild(btn);
  });
}

/* =====================================================
   💰 RÉCOMPENSE OR + LIVRE
===================================================== */
function showReward(){
  fade(`
    <strong>Bravo !</strong><br><br>
    Tu as gagné <span id="goldCounter">0</span> pièces d’or<br>
    et ton <strong>Business Plan</strong>
    <div id="coinExplosion"></div>
  `, showBook);

  let gold = 0;
  const counter = document.getElementById("goldCounter");

  const it = setInterval(()=>{
    gold += 100;
    counter.textContent = gold;
    if(gold >= 5000){
      counter.textContent = "5000";
      clearInterval(it);
    }
  },30);

  const explosion = document.getElementById("coinExplosion");
  for(let i=0;i<20;i++){
    const c = document.createElement("div");
    c.className = "coin";
    c.style.setProperty("--x",Math.random());
    c.style.setProperty("--y",Math.random());
    explosion.appendChild(c);
  }
}

/* =====================================================
   📖 LIVRE
===================================================== */
const bookContainer = document.getElementById("bookContainer");
const leftPage = document.getElementById("leftPage");
const rightPage = document.getElementById("rightPage");
const continueQuestBtn = document.getElementById("continueQuestBtn");

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
  continueQuestBtn.style.display =
    bookIndex === pages.length - 1 ? "block" : "none";
}

document.querySelector(".book").onclick = (e)=>{
  const rect = e.currentTarget.getBoundingClientRect();
  const img = rightPage;

  if(e.clientX > rect.left + rect.width/2 && bookIndex < pages.length-1){
    bookIndex++;
    img.classList.add("turn-next");
  } else if(bookIndex > 0){
    bookIndex--;
    img.classList.add("turn-prev");
  }

  updateBook();
  setTimeout(()=>img.className="",500);
};

continueQuestBtn.onclick = ()=>{
  vibrate(20);
  bookContainer.classList.remove("show");
  spawnPirate3();
};

/* =====================================================
   ✨ PIRATE 3 + DIALOGUES 2
===================================================== */
function spawnPirate3(){
  pirate3.classList.remove("hidden");
  setTimeout(()=>pirate3.classList.add("show"),50);
}

const dialogues2 = [
  { text:"Vous êtes nouveaux sur le marché ? On a entendu parler de vous.", anchor:pirate3 },
  { text:"Oui, nous revendons des pierres précieuses !", anchor:pirate2 },
  { text:"Les clients n’ont confiance qu’en un seul revendeur.", anchor:pirate3 },
  { text:"Comment gagner leur confiance ?", anchor:pirate2 },
  { text:"Va les rencontrer et montre-leur tes pierres.", anchor:pirate5 },
  { text:"Bonne idée !", anchor:pirate2 }
];

pirate3.onclick = ()=>{
  playDialogues(dialogues2, ()=>{
    fade("Dernier mini jeu avant de finir la quête", startMiniGame2);
  });
};

/* =====================================================
   🎮 MINI-JEU 2
===================================================== */
let confiance = 0;

function startMiniGame2(){
  confiance = 0;
  miniGameContainer.style.display = "flex";
  gameQuestion.textContent = "Comment gagner la confiance des clients ?";
  gameAnswers.innerHTML = "";
  gameFeedback.textContent = "";

  ["Montrer les pierres","Rester caché","Distribuer l’adresse"]
  .forEach((c,i)=>{
    const btn = document.createElement("button");
    btn.textContent = c;
    btn.onclick = ()=>{
      if(i===0 || i===2){
        vibrate(25);
        confiance++;
        gameFeedback.textContent = "👍 Bonne action";
      } else {
        vibrate([10,30,10]);
        gameFeedback.textContent = "❌ Mauvaise idée";
      }
      if(confiance >= 2){
        setTimeout(endMiniGame2,800);
      }
    };
    gameAnswers.appendChild(btn);
  });
}

function endMiniGame2(){
  vibrate([30,50,30]);
  miniGameContainer.style.display = "none";
  fade("Bravo tu as gagné la quête", showEndScreen);
}

/* =====================================================
   🏁 FIN DE QUÊTE
===================================================== */
const endScreen = document.getElementById("endScreen");
const endSubtitle = document.getElementById("endSubtitle");
const rewardBubbles = document.querySelectorAll(".rewardBubble");
const backToMenuBtn = document.getElementById("backToMenuBtn");

function showEndScreen(){
  endScreen.style.display = "flex";

  typeWriter(endSubtitle, "tu as gagné ...", ()=>{
    rewardBubbles.forEach((b,i)=>{
      setTimeout(()=>{
        b.style.opacity="1";
        b.style.transform="scale(1)";
      }, i*700);
    });

    setTimeout(()=>{
      backToMenuBtn.style.display="block";
    }, rewardBubbles.length*700 + 600);
  });
}

backToMenuBtn.onclick = ()=>{
  vibrate(20);
  window.location.href = "menu.html";
};

});
