document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   DOM
===================================================== */
const background = document.getElementById("background");

const pirate2 = document.getElementById("pirate2bis");
const pirate5 = document.getElementById("pirate5bis");
const pirate3 = document.getElementById("pirate3bis");

const bubbleContainer = document.getElementById("bubbleContainer");
const skipBtn = document.getElementById("skipDialoguesBtn");

const fadeScreen = document.getElementById("fadeScreen");
const loaderBox = fadeScreen.querySelector(".loaderBox");

/* Mini-jeux */
const game1 = document.getElementById("communicationGame");
const q1 = document.getElementById("commQuestion");
const a1 = document.getElementById("commAnswers");

const game2 = document.getElementById("visualIdentityGame");
const visualChoices = document.getElementById("visualChoices");

const game3 = document.getElementById("merchantGame");
const btnKeep = document.getElementById("btnKeep");

/* =====================================================
   UTILS — LOADER
===================================================== */
function showLoader(type = "intro", time = 1200, cb) {
  loaderBox.textContent = "";
  loaderBox.classList.remove("final");

  if (type === "final") {
    loaderBox.classList.add("final");
    explodeGems();
  }

  fadeScreen.classList.remove("hidden");

  setTimeout(() => {
    fadeScreen.classList.add("hidden");
    cb && cb();
  }, time);
}

/* =====================================================
   UTILS
===================================================== */
function vibrate(p = 20) {
  navigator.vibrate && navigator.vibrate(p);
}

/* =====================================================
   💎 EXPLOSION DE GEMS
===================================================== */
function explodeGems(){
  for (let i = 0; i < 100; i++) {
    const g = document.createElement("div");
    g.className = "gem";
    g.style.left = "50%";
    g.style.top = "50%";
    g.style.background = `hsl(${Math.random()*360},100%,60%)`;
    g.style.setProperty("--x", (Math.random()*800 - 400) + "px");
    g.style.setProperty("--y", (Math.random()*800 - 400) + "px");
    document.body.appendChild(g);
    setTimeout(() => g.remove(), 1600);
  }
}

/* =====================================================
   🎬 VIDÉO
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

closeVideo.onclick = endVideo;
questVideo.onended = endVideo;

function endVideo() {
  videoContainer.classList.add("hidden");

  // Loader de transition vidéo → scène
  showLoader("intro", 1400, showScene);
}

/* =====================================================
   🌅 SCÈNE INITIALE + ENTRÉE PIRATE 5
===================================================== */
function showScene() {
  background.classList.remove("hidden");

  pirate2.classList.remove("hidden");
  pirate5.classList.remove("hidden");

  pirate5.classList.remove("glowStart");
  pirate5.style.transition = "none";
  pirate5.style.left = "1200px";

  // Animation entrée pirate5
  requestAnimationFrame(() => {
    pirate5.style.transition = "left 1.2s ease";
    pirate5.style.left = "900px";
  });

  setTimeout(() => {
    pirate5.classList.add("glowStart");

    pirate5.onclick = () => {
      pirate5.classList.remove("glowStart");
      startDialogues1();
    };
  }, 1300);
}

/* =====================================================
   💬 DIALOGUES ENGINE
===================================================== */
let dialogues = [], index = 0, callback = null;

function playDialogues(list, cb) {
  dialogues = list;
  index = 0;
  callback = cb;
  skipBtn.classList.remove("hidden");
  renderDialogue();
}

function renderDialogue() {
  bubbleContainer.innerHTML = "";
  if (index >= dialogues.length) return endDialogues();

  const d = dialogues[index];
  const bubble = document.createElement("div");
  bubble.className = "dialogue-bubble";
  bubble.innerHTML = d.text;

  const r = d.anchor.getBoundingClientRect();
  bubble.style.left = r.left + r.width / 2 + "px";
  bubble.style.top = r.top - 120 + "px";
  bubble.style.transform = "translateX(-50%)";

  bubble.onclick = () => {
    vibrate();
    index++;
    renderDialogue();
  };

  bubbleContainer.appendChild(bubble);
}

function endDialogues() {
  bubbleContainer.innerHTML = "";
  skipBtn.classList.add("hidden");
  callback && callback();
}

skipBtn.onclick = endDialogues;

/* =====================================================
   💬 DIALOGUES 1
===================================================== */
function startDialogues1() {
  playDialogues([
    { text: "Avant d’agir, il faut comprendre le marché.", anchor: pirate5 },
    { text: "L’étude de marché et le business plan sont essentiels.", anchor: pirate2 }
  ], () => showLoader("intro", 1000, startMiniGame1));
}

/* =====================================================
   🎮 MINI-JEU 1
===================================================== */
function startMiniGame1() {
  game1.classList.remove("hidden");

  const quiz = [
    { q: "Pourquoi faire une étude de marché ?", ok: 0,
      a: ["Comprendre clients et concurrents", "Copier les autres"] },
    { q: "Que permet-elle ?", ok: 0,
      a: ["Analyser prix, produits, stratégies", "Décorer la boutique"] }
  ];

  let i = 0;

  function step() {
    q1.innerHTML = quiz[i].q;
    a1.innerHTML = "";

    quiz[i].a.forEach((t, idx) => {
      const b = document.createElement("button");
      b.textContent = t;
      b.onclick = () => {
        if (idx === quiz[i].ok) {
          i++;
          if (i < quiz.length) step();
          else {
            game1.classList.add("hidden");
            showScene();
            startDialogues2();
          }
        }
      };
      a1.appendChild(b);
    });
  }

  step();
}

/* =====================================================
   💬 DIALOGUES 2
===================================================== */
function startDialogues2() {
  playDialogues([
    { text: "Avec ces informations, tu peux bâtir ton business plan.", anchor: pirate2 },
    { text: "Passons à l’étape suivante.", anchor: pirate5 }
  ], () => showLoader("intro", 1000, startMiniGame2));
}

/* =====================================================
   🎨 MINI-JEU 2
===================================================== */
function startMiniGame2() {
  game2.classList.remove("hidden");
  visualChoices.innerHTML = "";

  const quiz = [
    { t: "Définir la cible", ok: true },
    { t: "Choisir la couleur du bateau", ok: false },
    { t: "Identifier le problème à résoudre", ok: true }
  ];

  let success = 0;

  quiz.forEach(q => {
    const b = document.createElement("button");
    b.textContent = q.t;
    b.onclick = () => {
      b.disabled = true;
      if (q.ok) {
        success++;
        if (success === 2) {
          game2.classList.add("hidden");
          showScene();
          spawnPirate3();
        }
      }
    };
    visualChoices.appendChild(b);
  });
}

/* =====================================================
   🏴‍☠️ PIRATE 3 — ARRIVÉE
===================================================== */
function spawnPirate3() {
  pirate5.classList.remove("glowStart");
  pirate5.onclick = null;

  pirate3.classList.remove("hidden");
  pirate3.style.left = "1200px";
  pirate3.style.transition = "left 1s ease";

  requestAnimationFrame(() => {
    pirate3.style.left = "638px";
  });

  setTimeout(() => {
    pirate3.classList.add("glowStart");
    pirate3.onclick = () => {
      pirate3.classList.remove("glowStart");
      startFinalDialogues();
    };
  }, 1200);
}

/* =====================================================
   💬 DIALOGUES FINAUX
===================================================== */
function startFinalDialogues() {
  playDialogues([
    { text: "Le marché est exigeant.", anchor: pirate3 },
    { text: "À toi de choisir ta stratégie.", anchor: pirate5 }
  ], () => showLoader("intro", 1000, startMiniGame3));
}

/* =====================================================
   🎮 MINI-JEU 3
===================================================== */
function startMiniGame3() {
  game3.classList.remove("hidden");
  btnKeep.onclick = () => {
    game3.classList.add("hidden");
    endQuest();
  };
}

/* =====================================================
   🏆 FIN
===================================================== */
function endQuest() {
  sessionStorage.setItem("unlock_pirate3", "true");
  sessionStorage.setItem("fromCommerce", "true");

  showLoader("final", 2600, () => {
    window.location.href = "menu.html";
  });
}

});
