document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   FLAGS
===================================================== */
let pirate5Locked = false;

/* =====================================================
   DOM
===================================================== */
const background = document.getElementById("background");
const backgroundImg = background.querySelector("img");

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
function vibrate(p = 20) {
  navigator.vibrate && navigator.vibrate(p);
}

/* =====================================================
   🏴‍☠️ LOADER PIRATE (TEMPOREL)
===================================================== */
function showPirateLoader(duration = 800, cb) {
  loaderBox.dataset.type = "pirate";
  fadeScreen.classList.remove("hidden");

  setTimeout(() => {
    fadeScreen.classList.add("hidden");
    cb && cb();
  }, duration);
}

/* =====================================================
   ⏳ LOADER BACKGROUND (RÉEL)
===================================================== */
function loadBackground(cb) {
  loaderBox.dataset.type = "hourglass";
  fadeScreen.classList.remove("hidden");

  const img = new Image();
  img.src = backgroundImg.src;

  if (img.complete) {
    finish();
  } else {
    img.onload = finish;
    img.onerror = finish;
  }

  function finish() {
    fadeScreen.classList.add("hidden");
    cb && cb();
  }
}

/* =====================================================
   🎬 VIDÉO INTRO
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const questVideo = document.getElementById("questVideo");
const toggleSound = document.getElementById("toggleSound");
const closeVideo = document.getElementById("closeVideo");

questVideo.muted = true;

questVideo.oncanplay = () => {
  questVideo.play().catch(()=>{});
};

toggleSound.onclick = () => {
  questVideo.muted = !questVideo.muted;
  toggleSound.textContent = questVideo.muted ? "🔇" : "🔊";
};

closeVideo.onclick = endVideo;
questVideo.onended = endVideo;

/* ✅ VIDÉO → 🏴‍☠️ → ⏳ → SCÈNE */
function endVideo() {
  videoContainer.classList.add("hidden");

  showPirateLoader(700, () => {
    loadBackground(showScene);
  });
}

/* =====================================================
   🌅 SCÈNE INITIALE
===================================================== */
function showScene() {
  fadeScreen.classList.add("hidden"); // 🔥 garantit clics

  background.classList.remove("hidden");
  pirate2.classList.remove("hidden");
  pirate5.classList.remove("hidden");

  if (pirate5Locked) return;

  pirate5.style.pointerEvents = "none";
  pirate5.style.transition = "none";
  pirate5.style.left = "1200px";

  requestAnimationFrame(() => {
    pirate5.style.transition = "left 1.2s ease";
    pirate5.style.left = "900px";
  });

  setTimeout(() => {
    pirate5.style.pointerEvents = "auto";
    pirate5.classList.add("glowStart");

    pirate5.onclick = () => {
      if (pirate5Locked) return;

      pirate5Locked = true;
      pirate5.classList.remove("glowStart");
      pirate5.style.pointerEvents = "none";
      pirate5.onclick = null;

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
    { text: "Bien joué, moussaillons. Lancer son activité demande du courage.", anchor: pirate5 },
    { text: "Merci capitaine ! Le marché est ouvert, on est prêts à vendre.", anchor: pirate2 },
    { text: "Avant de foncer, observez. Un bon marchand connaît son marché.", anchor: pirate5 },
    { text: "Qui sont vos clients ? Qu’achètent-ils ? À quel prix ?", anchor: pirate5 }
  ], startMiniGame1);
}

/* =====================================================
   🎮 MINI-JEU 1 (INCHANGÉ)
===================================================== */
/* 👉 ton code mini-jeu 1 reste identique ici */

/* =====================================================
   🏆 FIN
===================================================== */
function endQuest() {
  sessionStorage.setItem("unlock_pirate3", "true");
  sessionStorage.setItem("fromCommerce", "true");
  window.location.href = "menu.html";
}

});
