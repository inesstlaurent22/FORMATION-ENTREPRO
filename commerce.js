document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   🧠 ÉTAT GLOBAL (INDISPENSABLE)
===================================================== */

let gameState = "video"; 
// video | background | dialogues | minigame | reward | book

/* =====================================================
   🔗 ÉLÉMENTS DOM
===================================================== */

const videoContainer = document.getElementById("videoContainer");
const video = document.getElementById("questVideo");
const toggleSound = document.getElementById("toggleSound");
const closeVideo = document.getElementById("closeVideo");

const background = document.getElementById("background");
const pirate2bis = document.getElementById("pirate2bis");
const pirate5bis = document.getElementById("pirate5bis");

const bubbleContainer = document.getElementById("bubbleContainer");
const fadeScreen = document.getElementById("fadeScreen");
const miniGameContainer = document.getElementById("miniGameContainer");
const gameQuestion = document.getElementById("gameQuestion");
const gameAnswers = document.getElementById("gameAnswers");
const gameFeedback = document.getElementById("gameFeedback");

const rewardScreen = document.getElementById("rewardScreen");
const bookContainer = document.getElementById("bookContainer");
const continueBtn = document.getElementById("continueQuestBtn");

/* =====================================================
   🧹 CACHER TOUT (ANTI ÉCRAN NOIR)
===================================================== */

function hideAll() {
  videoContainer.style.display = "none";
  background.style.display = "none";
  bubbleContainer.innerHTML = "";
  fadeScreen.style.display = "none";
  miniGameContainer.style.display = "none";
  rewardScreen.style.display = "none";
  bookContainer.style.display = "none";
  continueBtn.style.display = "none";
}

/* =====================================================
   🎬 VIDÉO (PREMIER ÉCRAN)
===================================================== */

hideAll();
videoContainer.style.display = "flex";
video.muted = true;
toggleSound.textContent = "🔇";

video.play().catch(() => {
  video.muted = true;
  video.play();
});

toggleSound.onclick = () => {
  video.muted = !video.muted;
  toggleSound.textContent = video.muted ? "🔇" : "🔊";
};

closeVideo.onclick = (e) => {
  e.stopPropagation();
  if (gameState !== "video") return;
  showBackground();
};

video.addEventListener("ended", () => {
  if (gameState !== "video") return;
  showBackground();
});

/* =====================================================
   🌅 BACKGROUND + PIRATES
===================================================== */

function showBackground() {
  gameState = "background";
  hideAll();

  background.style.display = "block";
  background.style.opacity = 0;

  pirate2bis.style.left = "516px";
  pirate2bis.style.top = "406px";
  pirate2bis.style.transform = "scale(1.005)";

  pirate5bis.style.left = "785px";
  pirate5bis.style.top = "397px";

  movePiratesUp(20);

  requestAnimationFrame(() => {
    background.style.opacity = 1;
  });
}

function movePiratesUp(percent) {
  [pirate2bis, pirate5bis].forEach(p => {
    p.style.top =
      (p.offsetTop - window.innerHeight * (percent / 100)) + "px";
  });
}

/* =====================================================
   💬 DIALOGUES
===================================================== */

let dialogueStep = 0;

const dialogues = [
  { who:"maitre", text:"Moussaillon ! Bienvenue sur le marché des trésors ! Ici, plein de pirates vendent des pierres précieuses… mais pour toi, qui débutes, faudra suivre mes conseils !", anchor:pirate5bis },
  { who:"apprenti", text:"J’suis prêt, capitaine !", anchor:pirate2bis },
  { who:"maitre", text:"Écoute bien ! Tu dois observer les autres pirates et leurs stratégies.", anchor:pirate5bis },
  { who:"apprenti", text:"Mais comment je fais ça ?", anchor:pirate2bis },
  { who:"maitre", text:"Regarde le marché, les clients, les prix… et démarque-toi !", anchor:pirate5bis },
  { who:"apprenti", text:"MERCI capitaine !", anchor:pirate2bis }
];

pirate5bis.onclick = () => {
  if (gameState !== "background") return;
  gameState = "dialogues";
  dialogueStep = 0;
  createBubble(dialogues[0]);
};

function typeWriter(el, text, speed, cb) {
  el.innerHTML = "";
  let i = 0;
  function write() {
    if (i < text.length) {
      el.innerHTML += text[i++];
      setTimeout(write, speed);
    } else if (cb) cb();
  }
  write();
}

function createBubble(d) {
  bubbleContainer.innerHTML = "";

  const bubble = document.createElement("div");
  bubble.className = "dialogue-bubble";

  const name = document.createElement("div");
  name.className = "name";
  name.textContent = d.who === "maitre" ? "Maître pirate" : "Apprenti pirate";

  const text = document.createElement("div");
  text.className = "text";

  bubble.append(name, text);
  bubbleContainer.appendChild(bubble);

  requestAnimationFrame(() => {
    const r = d.anchor.getBoundingClientRect();
    bubble.style.left = r.left + r.width/2 - bubble.offsetWidth/2 + "px";
    bubble.style.top = r.top - bubble.offsetHeight - 20 + "px";
  });

  typeWriter(text, d.text, 25, () => {
    const btn = document.createElement("button");
    btn.textContent = dialogueStep < dialogues.length - 1 ? "Suite" : "OK, j’ai compris";
    btn.onclick = nextDialogue;
    bubble.appendChild(btn);
  });
}

function nextDialogue() {
  dialogueStep++;
  if (dialogueStep < dialogues.length) {
    createBubble(dialogues[dialogueStep]);
  } else {
    bubbleContainer.innerHTML = "";
    launchMiniGame();
  }
}

/* =====================================================
   🌑 FADE + MINI JEU
===================================================== */

const questions = [
  { q:"Où les pirates ont-ils trouvé leurs pierres ?", a:["Dans une grotte","Au marché","Chez la tante"], c:0 },
  { q:"Qui fait partie de l’équipage ?", a:["Capitaine","Famille","Deux moussaillons"], c:2 },
  { q:"Que doivent-ils observer ?", a:["Pierres","Concurrents","Météo"], c:[0,1] }
];

let step = 0, selected = [];

function launchMiniGame() {
  gameState = "minigame";
  hideAll();

  fadeScreen.style.display = "flex";
  fadeScreen.innerHTML = `<div class="loaderBox">Termines ce mini jeux et tu pourras continuer la quête</div>`;

  setTimeout(() => {
    fadeScreen.style.display = "none";
    startMiniGame();
  }, 2200);
}

function startMiniGame() {
  miniGameContainer.style.display = "flex";
  step = 0;
  showQuestion();
}

function showQuestion() {
  if (step >= questions.length) return showReward();

  const q = questions[step];
  gameQuestion.textContent = q.q;
  gameAnswers.innerHTML = "";
  gameFeedback.textContent = "";
  selected = [];

  const multi = Array.isArray(q.c);

  if (multi) {
    const hint = document.createElement("div");
    hint.className = "multiHint";
    hint.textContent = "Plusieurs réponses possibles";
    gameAnswers.appendChild(hint);
  }

  q.a.forEach((ans,i)=>{
    const b = document.createElement("button");
    b.textContent = ans;
    b.onclick = () => {
      if (!multi) checkSingle(i);
      else {
        b.classList.toggle("selected");
        selected.includes(i) ? selected.splice(selected.indexOf(i),1) : selected.push(i);
      }
    };
    gameAnswers.appendChild(b);
  });

  if (multi) {
    const v = document.createElement("button");
    v.textContent = "Valider";
    v.onclick = checkMulti;
    gameAnswers.appendChild(v);
  }
}

function checkSingle(i){
  if (i === questions[step].c) {
    step++; setTimeout(showQuestion,600);
  } else gameFeedback.textContent = "❌ Essaie encore";
}

function checkMulti(){
  if (selected.sort().join() === questions[step].c.sort().join()) {
    step++; setTimeout(showQuestion,600);
  } else gameFeedback.textContent = "❌ Pas toutes les bonnes réponses";
}

/* =====================================================
   🏆 RÉCOMPENSE → LIVRE
===================================================== */

function showReward() {
  gameState = "reward";
  hideAll();

  rewardScreen.style.display = "flex";
  rewardScreen.style.opacity = 1;

  setTimeout(() => {
    rewardScreen.style.opacity = 0;
    setTimeout(showBook, 800);
  }, 2800);
}

function showBook() {
  gameState = "book";
  hideAll();
  bookContainer.style.display = "flex";
}

/* =====================================================
   📖 LIVRE → CONTINUER
===================================================== */

const pages = document.querySelectorAll(".page");
let currentPage = 0;
pages.forEach((p,i)=>p.style.zIndex = pages.length - i);

document.querySelector(".book").onclick = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  if (e.clientX - r.left > r.width/2 && currentPage < pages.length) {
    pages[currentPage++].classList.add("flipped");
  }
  if (currentPage === pages.length) continueBtn.style.display = "block";
};

continueBtn.onclick = () => {
  showBackground();
};

});
