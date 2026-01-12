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

toggleSound.onclick = () => {
  questVideo.muted = !questVideo.muted;
  toggleSound.textContent = questVideo.muted ? "🔇" : "🔊";
};

questVideo.onended = endVideo;
closeVideo.onclick = endVideo;

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
   🏴‍☠️ PIRATE 5 (DÉCLENCHEUR)
===================================================== */
function enablePirate5() {
  pirate5.addEventListener("click", startDialogues1, { once: true });
}

/* =====================================================
   💬 SYSTÈME DE DIALOGUES (STABLE)
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

skipBtn.onclick = endDialogues;

/* =====================================================
   💬 DIALOGUES 1 → MINI-JEU 1
===================================================== */
function startDialogues1() {
  playDialogues([
    { text: "Moussaillon ! Bienvenue sur le marché des trésors.", anchor: pirate5 },
    { text: "Créons ton business plan.", anchor: pirate2 }
  ], launchMiniGame1);
}

function launchMiniGame1() {
  showLoader("Préparation du mini-jeu...", 600, () => {
    miniGame.classList.remove("hidden");
    gameQ.textContent = "Quelle est la première étape ?";
    gameA.innerHTML = "";
    gameF.textContent = "";

    [
      "Acheter un bateau",
      "Définir clairement son offre",
      "Fixer les prix"
    ].forEach((txt, i) => {
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
   📖 LIVRE + LOADER ⏳
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
      }
    };
  });
}

function renderBook() {
  leftPage.src = bookSteps[bookIndex].left;
  rightPage.src = bookSteps[bookIndex].right;
  continueBtn.classList.toggle("hidden", bookIndex !== bookSteps.length - 1);
}

document.querySelector(".book").onclick = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
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

continueBtn.onclick = () => {
  bookContainer.classList.add("hidden");
  spawnPirate3();
};

/* =====================================================
   🏴‍☠️ PIRATE 3 – SURVOL ACTIF
===================================================== */
function spawnPirate3() {
  pirate3.classList.remove("hidden");
  pirate3.style.left = "1200px";
  pirate3.style.transition = "left 1s ease-out";

  requestAnimationFrame(() => {
    pirate3.style.left = "638px";
  });

  const hoverOn = () => pirate3.classList.add("glow");
  const hoverOff = () => pirate3.classList.remove("glow");

  pirate3.addEventListener("mouseenter", hoverOn);
  pirate3.addEventListener("mouseleave", hoverOff);

  pirate3.addEventListener("click", () => {
    pirate3.classList.remove("glow");
    pirate3.removeEventListener("mouseenter", hoverOn);
    pirate3.removeEventListener("mouseleave", hoverOff);
    pirate3.style.pointerEvents = "none";
    startDialogues2();
  }, { once: true });
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
   🎮 MINI-JEU 2 – JUGEMENT DU MARCHÉ
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
   💬 DIALOGUES 3 → BASE DE DONNÉES
===================================================== */
function startDialogues3() {
  playDialogues([
    { text: "Note les coordonnées de tes clients.", anchor: pirate5 },
    { text: "C’est ta base de données.", anchor: pirate2 }
  ], showDatabaseBox);
}

/* =====================================================
   📦 BASE DE DONNÉES
===================================================== */
function showDatabaseBox() {
  bubbleContainer.innerHTML = "";
  skipBtn.classList.add("hidden");

  const box = document.createElement("div");
  box.className = "dialogue-bubble database";
  box.style.left = "50%";
  box.style.top = "50%";
  box.style.transform = "translate(-50%, -50%)";

  box.innerHTML = `
    <h2 class="dbTitle">Base de données</h2>
    <div class="dbSeparator"></div>
    <p>
      Elle te permet de fidéliser tes clients<br>
      et de bâtir ton empire commercial.
    </p>
    <button class="finalBtn">Terminer la quête</button>
  `;

  box.querySelector("button").onclick = winFinal;
  bubbleContainer.appendChild(box);
}

/* =====================================================
   🏁 FIN COMMERCE
===================================================== */
function winFinal() {
  bubbleContainer.innerHTML = "";
  showLoader("🎉 Bravo, tu as gagné cette quête", 2200);
  launchGems();

  setTimeout(() => {
    localStorage.setItem("mpi_unlocked", "true");
    window.location.href = "menu.html";
  }, 2300);
}

/* =====================================================
   💎 EXPLOSION DE GEMS
===================================================== */
function launchGems() {
  const canvas = document.createElement("canvas");
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  canvas.style.position = "fixed";
  canvas.style.inset = 0;
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = 3100;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let gems = [];

  for (let i = 0; i < 200; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = Math.random() * 10 + 4;
    gems.push({
      x: innerWidth / 2,
      y: innerHeight / 2,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s,
      life: 90,
      c: `hsl(${Math.random() * 360},100%,60%)`
    });
  }

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gems.forEach(g => {
      g.vy += 0.15;
      g.x += g.vx;
      g.y += g.vy;
      g.life--;
      ctx.fillStyle = g.c;
      ctx.fillRect(g.x, g.y, 4, 4);
    });
    gems = gems.filter(g => g.life > 0);
    gems.length ? requestAnimationFrame(update) : canvas.remove();
  }

  update();
}

});
