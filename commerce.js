document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   📌 ELEMENTS DOM
===================================================== */
const background = document.getElementById("background");

const pirate2 = document.getElementById("pirate2bis");
const pirate5 = document.getElementById("pirate5bis");
const pirate3 = document.getElementById("pirate3bis");

const bubbleContainer = document.getElementById("bubbleContainer");
const skipBtn = document.getElementById("skipDialoguesBtn");

const miniGame = document.getElementById("miniGameContainer");
const gameQ = document.getElementById("gameQuestion");
const gameA = document.getElementById("gameAnswers");
const gameF = document.getElementById("gameFeedback");

const bookContainer = document.getElementById("bookContainer");
const leftPage = document.getElementById("leftPage");
const rightPage = document.getElementById("rightPage");
const continueBtn = document.getElementById("continueQuestBtn");

const merchantGame = document.getElementById("merchantGame");
const clueEl = document.getElementById("clue");

/* =====================================================
   🔧 OUTILS
===================================================== */
function vibrate(p = 15) {
  if (navigator.vibrate) navigator.vibrate(p);
}

/* =====================================================
   🌑 LOADER GLOBAL
===================================================== */
const fadeScreen = document.getElementById("fadeScreen");
const loaderBox = fadeScreen.querySelector(".loaderBox");

function showLoader(text, time = 700, cb) {
  loaderBox.innerHTML = text;
  fadeScreen.classList.remove("hidden");
  setTimeout(() => {
    fadeScreen.classList.add("hidden");
    if (typeof cb === "function") cb();
  }, time);
}

/* =====================================================
   🎬 VIDEO INTRO
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const questVideo = document.getElementById("questVideo");
const toggleSound = document.getElementById("toggleSound");
const closeVideo = document.getElementById("closeVideo");

questVideo.muted = true;
questVideo.play().catch(()=>{});

toggleSound.onclick = () => {
  questVideo.muted = !questVideo.muted;
  toggleSound.textContent = questVideo.muted ? "🔇" : "🔊";
};

closeVideo.onclick = () => {
  closeVideo.classList.add("glowClick");
  setTimeout(endVideo, 300);
};

questVideo.onended = endVideo;

function endVideo() {
  questVideo.pause();
  videoContainer.style.display = "none";
  showLoader("Chargement...", 600, showBackground);
}

/* =====================================================
   🌅 BACKGROUND + PIRATES INIT
===================================================== */
function showBackground() {
  background.classList.remove("hidden");
  pirate2.classList.remove("hidden");
  pirate5.classList.remove("hidden");
  enablePirate5();
}

/* =====================================================
   🏴‍☠️ PIRATE 5
===================================================== */
function enablePirate5() {
  pirate5.addEventListener("mouseenter", () => pirate5.classList.add("glow"));
  pirate5.addEventListener("mouseleave", () => pirate5.classList.remove("glow"));
  pirate5.addEventListener("click", startDialogues1, { once: true });
}

/* =====================================================
   💬 DIALOGUES
===================================================== */
let dialogues = [];
let dIndex = 0;
let dialogueCallback = null;

function playDialogues(list, cb) {
  dialogues = list;
  dIndex = 0;
  dialogueCallback = cb;
  skipBtn.classList.remove("hidden");
  renderDialogue();
}

function renderDialogue() {
  bubbleContainer.innerHTML = "";

  if (dIndex >= dialogues.length) {
    endDialogues();
    return;
  }

  const d = dialogues[dIndex];
  const anchor = d.anchor;

  const bubble = document.createElement("div");
  bubble.className = "dialogue-bubble";
  bubble.innerHTML = d.text;

  if (anchor && !anchor.classList.contains("hidden")) {
    const r = anchor.getBoundingClientRect();
    let top = r.top - 90;
    if (top < 30) top = r.bottom + 15;
    bubble.style.left = r.left + r.width / 2 + "px";
    bubble.style.top = top + "px";
    bubble.style.transform = "translateX(-50%)";
  } else {
    bubble.style.left = "50%";
    bubble.style.top = "50%";
    bubble.style.transform = "translate(-50%, -50%)";
  }

  bubble.onclick = () => {
    vibrate();
    dIndex++;
    renderDialogue();
  };

  bubbleContainer.appendChild(bubble);
}

function endDialogues() {
  bubbleContainer.innerHTML = "";
  skipBtn.classList.add("hidden");
  if (typeof dialogueCallback === "function") {
    setTimeout(dialogueCallback, 300);
  }
}

skipBtn.onclick = () => {
  skipBtn.classList.add("glowClick");
  vibrate(25);
  setTimeout(() => {
    skipBtn.classList.remove("glowClick");
    endDialogues();
  }, 200);
};

/* =====================================================
   💬 DIALOGUES 1 → MINI-JEU 1
===================================================== */
function startDialogues1() {
  playDialogues([
    { text: "Moussaillon ! Bienvenue sur le marché des trésors.", anchor: pirate5 },
    { text: "Créons ton business plan.", anchor: pirate2 }
  ], launchMiniGame1);
}

/* =====================================================
   🎮 MINI-JEU 1
===================================================== */
function launchMiniGame1() {
  showLoader("Préparation du mini-jeu...", 600, () => {
    miniGame.classList.remove("hidden");
    gameQ.textContent = "Quelle est la première étape ?";
    gameA.innerHTML = "";
    gameF.textContent = "";

    ["Acheter un bateau","Définir clairement son offre","Fixer les prix"]
      .forEach((txt, i) => {
        const btn = document.createElement("button");
        btn.textContent = txt;
        btn.onclick = () => {
          if (i === 1) {
            gameF.textContent = "✅ Bonne décision";
            setTimeout(winMiniGame1, 800);
          } else {
            gameF.textContent = "❌ Mauvais choix";
          }
        };
        gameA.appendChild(btn);
      });
  });
}

function winMiniGame1() {
  miniGame.classList.add("hidden");

  loaderBox.innerHTML = `
    <div class="winBravo">BRAVO</div>
    <div class="winText">Tu as gagné</div>
    <div class="winCounter"><span id="poCounter">0</span></div>
    <div class="winText">pièces d’or 💰</div>
    <div class="winText">et ton business plan 🎁</div>
  `;
  fadeScreen.classList.remove("hidden");

  let v = 0;
  const counter = document.getElementById("poCounter");

  const interval = setInterval(() => {
    v += 100;
    counter.textContent = v;
    counter.style.transform = "scale(1.25)";
    setTimeout(() => counter.style.transform = "scale(1)", 120);

    if (v >= 5000) {
      clearInterval(interval);
      setTimeout(() => {
        fadeScreen.classList.add("hidden");
        showBook();
      }, 900);
    }
  }, 30);
}

/* =====================================================
   📖 LIVRE
===================================================== */
const bookSteps = [
  { left: "images/Businessplancov.png", right: "images/Businessplan1.jpg" },
  { left: "images/Businessplancov.png", right: "images/Businessplan2.jpg" },
  { left: "images/Businessplancov.png", right: "images/Businessplan3.jpg" }
];

let bookIndex = 0;

function showBook() {
  const loader = document.createElement("div");
  loader.id = "bookLoader";
  loader.innerHTML = "<span>⏳</span>";
  document.body.appendChild(loader);

  bookContainer.classList.remove("hidden");
  bookIndex = 0;

  const images = bookSteps.flatMap(s => [s.left, s.right]);
  let loaded = 0;

  images.forEach(src => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      loaded++;
      if (loaded === images.length) {
        loader.remove();
        renderBook();
        enableBookNavigation();
      }
    };
  });
}

function renderBook() {
  leftPage.src = bookSteps[bookIndex].left;
  rightPage.src = bookSteps[bookIndex].right;
  continueBtn.classList.toggle("hidden", bookIndex !== bookSteps.length - 1);
}

function enableBookNavigation() {
  const book = document.querySelector(".book");
  if (!book) return;

  book.onclick = (e) => {
    const rect = book.getBoundingClientRect();
    const mid = rect.left + rect.width / 2;

    if (e.clientX > mid && bookIndex < bookSteps.length - 1) {
      bookIndex++;
      renderBook();
    }
    if (e.clientX < mid && bookIndex > 0) {
      bookIndex--;
      renderBook();
    }
  };
}

continueBtn.onclick = () => {
  bookContainer.classList.add("hidden");
  spawnPirate3();
};

/* =====================================================
   🏴‍☠️ PIRATE 3
===================================================== */
function spawnPirate3() {
  pirate3.classList.remove("hidden");
  pirate3.style.left = "1200px";
  pirate3.style.transition = "left 1s ease-out";

  requestAnimationFrame(() => pirate3.style.left = "638px");

  pirate3.addEventListener("mouseenter", () => pirate3.classList.add("glow"));
  pirate3.addEventListener("mouseleave", () => pirate3.classList.remove("glow"));
  pirate3.addEventListener("click", startDialogues2, { once: true });
}

/* =====================================================
   💬 DIALOGUES 2 → MINI-JEU 2
===================================================== */
function startDialogues2() {
  playDialogues([
    { text: "Ces pierres inspirent confiance.", anchor: pirate3 },
    { text: "Mais le marché est exigeant.", anchor: pirate5 }
  ], startMiniGame2);
}

/* =====================================================
   🎮 MINI-JEU 2
===================================================== */
function startMiniGame2() {
  merchantGame.classList.remove("hidden");
  clueEl.textContent = "Analyse le marché avant de décider.";
}

document.getElementById("btnHint").onclick = () => {
  clueEl.textContent = "💡 Peu de concurrence sur ce port.";
};

document.getElementById("btnKeep").onclick = () => {
  merchantGame.classList.add("hidden");
  startDialogues3();
};

document.getElementById("btnLower").onclick = () => {
  clueEl.textContent = "❌ Mauvaise décision.";
};

/* =====================================================
   💬 DIALOGUES 3 → FIN
===================================================== */
function startDialogues3() {
  playDialogues([
    { text: "Note les coordonnées de tes clients.", anchor: pirate5 },
    { text: "C’est ta base de données.", anchor: pirate2 }
  ], winFinal);
}

/* =====================================================
   🏁 FIN + EXPLOSION DE GEMS
===================================================== */
function winFinal() {
  loaderBox.innerHTML = "🎉 Bravo, tu as gagné cette quête";
  fadeScreen.classList.remove("hidden");

  const gems = document.createElement("div");
  gems.className = "gems";
  fadeScreen.appendChild(gems);

  for (let i = 0; i < 60; i++) {
    const g = document.createElement("div");
    g.className = "gem";
    g.style.left = "50%";
    g.style.top = "50%";
    g.style.background = `hsl(${Math.random()*360},100%,60%)`;
    g.style.setProperty("--x", `${(Math.random()-0.5)*600}px`);
    g.style.setProperty("--y", `${(Math.random()-0.5)*600}px`);
    gems.appendChild(g);
  }

  setTimeout(() => {
    gems.remove();
    window.location.href = "menu.html";
  }, 2300);
}

});
