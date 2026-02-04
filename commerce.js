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
   LOADERS
===================================================== */
function showPirateLoader(duration = 800, cb) {
  loaderBox.dataset.type = "pirate";
  fadeScreen.classList.remove("hidden");
  setTimeout(() => {
    fadeScreen.classList.add("hidden");
    cb && cb();
  }, duration);
}

function loadBackground(cb) {
  loaderBox.dataset.type = "hourglass";
  fadeScreen.classList.remove("hidden");

  // TEXTE AU-DESSUS DU LOADER
  let loaderText = document.createElement("div");
  loaderText.id = "loaderText";
  loaderText.textContent = "Tu vas bientôt pouvoir entrer sur le marché…";
  fadeScreen.appendChild(loaderText);

  const img = new Image();
  img.src = backgroundImg.src;

  const finish = () => {
    loaderText.remove();
    fadeScreen.classList.add("hidden");
    cb && cb();
  };

  img.complete ? finish() : (img.onload = img.onerror = finish);
}

/* =====================================================
   UTILS
===================================================== */
function vibrate(p = 20) {
  navigator.vibrate && navigator.vibrate(p);
}

/* =====================================================
   🎬 VIDÉO INTRO
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const questVideo = document.getElementById("questVideo");
const toggleSound = document.getElementById("toggleSound");
const closeVideo = document.getElementById("closeVideo");

questVideo.muted = true;
questVideo.oncanplay = () => questVideo.play().catch(()=>{});

toggleSound.onclick = () => {
  questVideo.muted = !questVideo.muted;
  toggleSound.textContent = questVideo.muted ? "🔇" : "🔊";
};

closeVideo.onclick = endVideo;
questVideo.onended = endVideo;

function endVideo() {
  videoContainer.classList.add("hidden");
  showPirateLoader(700, () => loadBackground(showScene));
}

/* =====================================================
   🌅 SCÈNE INITIALE
===================================================== */
function showScene() {
  pirate5Locked = false;

  background.classList.remove("hidden");
  pirate2.classList.remove("hidden");
  pirate5.classList.remove("hidden");

  pirate5.style.left = "1200px";
  pirate5.style.pointerEvents = "auto";

  requestAnimationFrame(() => {
    pirate5.style.transition = "left 1.2s ease";
    pirate5.style.left = "900px";
  });

  setTimeout(() => {
    pirate5.classList.add("glowStart");

    pirate5.onclick = () => {
      if (pirate5Locked) return;
      pirate5Locked = true;

      pirate5.classList.remove("glowStart");
      pirate5.onclick = null;

      startDialogues1();
    };
  }, 1300);
}

/* =====================================================
   💬 DIALOGUES ENGINE
===================================================== */
let dialogues = [];
let index = 0;
let callback = null;

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
    { text: "Qui sont vos clients ? Qu’achètent-ils ? À quel prix ?", anchor: pirate5 },
    { text: "Étudiez vos concurrents : leur réputation, leurs forces, leurs erreurs.", anchor: pirate5 },
    { text: "Fixez le bon prix, et les clients viendront d’abord chez vous.", anchor: pirate5 },
    { text: "Comprendre avant d’agir… on a encore à apprendre.", anchor: pirate2 }
  ], startMiniGame1);
}

/* =====================================================
   🎮 MINI-JEU 1 — ÉTUDE DE MARCHÉ
===================================================== */
function startMiniGame1() {
  game1.classList.remove("hidden");

  const quiz = [
    {
      q: "Pourquoi réaliser des études de marché avant de se lancer ?",
      ok: [1, 2],
      a: [
        "Choisir les couleurs de sa boutique",
        "Comprendre les attentes des clients",
        "Identifier la concurrence et la demande du marché"
      ]
    },
    {
      q: "Sur quoi dois-tu analyser tes concurrents ?",
      ok: [0, 2],
      a: [
        "Leur réputation et leur stratégie",
        "Leur lieu de vacances",
        "Leurs prix et leur positionnement"
      ]
    },
    {
      q: "Pourquoi faut-il réaliser des études de produit ?",
      ok: [0, 1],
      a: [
        "S’assurer que le produit répond aux besoins des clients",
        "Améliorer le produit et se différencier",
        "Créer un produit sans objectif précis"
      ]
    },
    {
      q: "Après avoir analysé les prix des concurrents, quelles stratégies sont possibles ?",
      ok: [0, 1],
      a: [
        "S’aligner sur les prix du marché",
        "Proposer plus de valeur à un prix plus élevé",
        "Fixer un prix au hasard"
      ]
    }
  ];

  let i = 0;
  let found = [];

  function step() {
    q1.textContent = quiz[i].q;
    a1.innerHTML = "";
    found = [];

    quiz[i].a.forEach((txt, idx) => {
      const btn = document.createElement("button");
      btn.textContent = txt;

      btn.onclick = () => {
        if (!quiz[i].ok.includes(idx)) return;
        if (found.includes(idx)) return;

        found.push(idx);
        btn.classList.add("pressed");
        btn.disabled = true;

        if (found.length === quiz[i].ok.length) {
          setTimeout(() => {
            i++;
            i < quiz.length ? step() : (
              game1.classList.add("hidden"),
              showPirateLoader(700, startDialogues2)
            );
          }, 600);
        }
      };

      a1.appendChild(btn);
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
  ], startMiniGame2);
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
      if (q.ok && ++success === 2) {
        game2.classList.add("hidden");
        showPirateLoader(700, spawnPirate3);
      }
    };
    visualChoices.appendChild(b);
  });
}

/* =====================================================
   🏴‍☠️ PIRATE 3
===================================================== */
function spawnPirate3() {
  pirate3.classList.remove("hidden");
  pirate3.style.left = "1200px";

  requestAnimationFrame(() => {
    pirate3.style.transition = "left 1s ease";
    pirate3.style.left = "638px";
  });

  setTimeout(() => {
    pirate3.classList.add("glowStart");
    pirate3.onclick = () => {
      pirate3.classList.remove("glowStart");
      pirate3.onclick = null;
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
  ], startMiniGame3);
}

/* =====================================================
   🎮 MINI-JEU 3
===================================================== */
function startMiniGame3() {
  game3.classList.remove("hidden");
  btnKeep.onclick = () => {
    game3.classList.add("hidden");
    showPirateLoader(700, endQuest);
  };
}

/* =====================================================
   🏆 FIN
===================================================== */
function endQuest() {
  sessionStorage.setItem("unlock_pirate3", "true");
  sessionStorage.setItem("fromCommerce", "true");
  window.location.href = "menu.html";
}

});
