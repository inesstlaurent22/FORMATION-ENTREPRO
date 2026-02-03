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
   UTILS
===================================================== */
function showLoader(text, time = 1200, cb) {
  loaderBox.innerHTML = `
    <div>${text}</div>
    ${text.includes("Bravo") ? '<canvas id="gemsCanvas"></canvas>' : ''}
  `;
  fadeScreen.classList.remove("hidden");

  if (text.includes("Bravo")) spawnGems();

  setTimeout(() => {
    fadeScreen.classList.add("hidden");
    cb && cb();
  }, time);
}

function vibrate(p = 20) {
  navigator.vibrate && navigator.vibrate(p);
}

/* =====================================================
   🎬 VIDÉO
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const questVideo = document.getElementById("questVideo");
const toggleSound = document.getElementById("toggleSound");
const closeVideo = document.getElementById("closeVideo");

/* boutons petits + top right */
toggleSound.style.cssText = "top:15px;right:70px;font-size:14px;padding:6px 10px;";
closeVideo.style.cssText  = "top:15px;right:15px;font-size:14px;padding:6px 10px;";

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
  showLoader("Chargement…", 1000, showScene);
}

/* =====================================================
   🌅 SCÈNE INITIALE
===================================================== */
function showScene() {
  background.classList.remove("hidden");
  pirate2.classList.remove("hidden");
  pirate5.classList.remove("hidden");

  pirate5.classList.add("glowStart");

  pirate5.addEventListener("click", () => {
    pirate5.classList.remove("glowStart");
    startDialogues1();
  }, { once: true });
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
  ], () => showLoader("Le mini jeu commence…", 1000, startMiniGame1));
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
  ], () => showLoader("Le mini jeu commence…", 1000, startMiniGame2));
}

/* =====================================================
   🎮 MINI-JEU 2 — BUSINESS PLAN
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
      if (q.ok) {
        success++;
        b.disabled = true;
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
   🏴‍☠️ PIRATE 3 — ARRIVÉE + GLOW
===================================================== */
function spawnPirate3() {
  pirate3.classList.remove("hidden");
  pirate3.style.left = "1200px";
  pirate3.style.transition = "left 1s ease";
  requestAnimationFrame(() => pirate3.style.left = "638px");

  setTimeout(() => {
    pirate3.classList.add("glowStart");
    pirate3.addEventListener("click", () => {
      pirate3.classList.remove("glowStart");
      startFinalDialogues();
    }, { once: true });
  }, 1200);
}

/* =====================================================
   💬 DIALOGUES FINAUX
===================================================== */
function startFinalDialogues() {
  playDialogues([
    { text: "Le marché est exigeant.", anchor: pirate3 },
    { text: "À toi de choisir ta stratégie.", anchor: pirate5 }
  ], () => showLoader("Le mini jeu commence…", 1000, startMiniGame3));
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
  sessionStorage.setItem("pirate3Unlocked", "true");
  showLoader("Bravo tu as gagné la quête", 2200, () => {
    window.location.href = "menu.html";
  });
}

/* =====================================================
   💎 GEMS
===================================================== */
function spawnGems() {
  const canvas = document.getElementById("gemsCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  for (let i = 0; i < 150; i++) {
    ctx.fillStyle = `hsl(${Math.random()*360},100%,60%)`;
    ctx.beginPath();
    ctx.arc(
      Math.random()*canvas.width,
      Math.random()*canvas.height,
      3,
      0,
      Math.PI*2
    );
    ctx.fill();
  }
}

});
