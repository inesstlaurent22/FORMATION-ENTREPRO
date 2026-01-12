document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   📌 ÉLÉMENTS DOM
===================================================== */
const background = document.getElementById("background");
const pirate2 = document.getElementById("pirate2bis");
const pirate5 = document.getElementById("pirate5bis");
const pirate3 = document.getElementById("pirate3bis");

const bubbleContainer = document.getElementById("bubbleContainer");
const skipBtn = document.getElementById("skipDialoguesBtn");

/* =====================================================
   🌑 LOADER (SÉCURISÉ)
===================================================== */
const fadeScreen = document.getElementById("fadeScreen");
const loaderBox = fadeScreen.querySelector(".loaderBox");

function showLoader(text, time = 800, cb) {
  loaderBox.innerHTML = text;
  fadeScreen.classList.remove("hidden");

  setTimeout(() => {
    fadeScreen.classList.add("hidden"); // ✅ fermeture garantie
    if (typeof cb === "function") cb();
  }, time);
}

/* =====================================================
   🎬 VIDÉO INTRO
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const questVideo = document.getElementById("questVideo");
const toggleSound = document.getElementById("toggleSound");
const closeVideo  = document.getElementById("closeVideo");

questVideo.muted = true;
toggleSound.textContent = "🔇";

toggleSound.onclick = () => {
  questVideo.muted = !questVideo.muted;
  toggleSound.textContent = questVideo.muted ? "🔇" : "🔊";
};

function endVideo() {
  questVideo.pause();
  videoContainer.style.display = "none";
  showLoader("Chargement...", 800, showBackground);
}

questVideo.addEventListener("ended", endVideo);
closeVideo.addEventListener("click", endVideo);

/* =====================================================
   🌅 BACKGROUND + PIRATES
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
  pirate5.classList.add("interactive");

  pirate5.onclick = () => {
    pirate5.style.pointerEvents = "none";
    startDialogues1();
  };
}

/* =====================================================
   💬 DIALOGUES – SYSTÈME ROBUSTE
===================================================== */
let dialogues = [];
let dIndex = 0;
let onDialogueEnd = null;

function playDialogues(list, cb) {
  dialogues = list;
  dIndex = 0;
  onDialogueEnd = cb;
  skipBtn.classList.remove("hidden");
  renderDialogue();
}

function renderDialogue() {
  bubbleContainer.innerHTML = "";
  const d = dialogues[dIndex];
  const r = d.anchor.getBoundingClientRect();

  const bubble = document.createElement("div");
  bubble.className = "dialogue-bubble";
  bubble.innerHTML = d.text;

  bubble.style.left = `${r.left + r.width / 2}px`;
  bubble.style.top = `${r.top - 90}px`;
  bubble.style.transform = "translateX(-50%)";

  bubble.onclick = () => {
    dIndex++;
    dIndex < dialogues.length ? renderDialogue() : endDialogues();
  };

  bubbleContainer.appendChild(bubble);
}

function endDialogues() {
  bubbleContainer.innerHTML = "";
  skipBtn.classList.add("hidden");
  if (onDialogueEnd) onDialogueEnd();
}

skipBtn.onclick = endDialogues;

/* =====================================================
   💬 DIALOGUES 1 → MINI-JEU 1
===================================================== */
function startDialogues1() {
  playDialogues([
    { text: "Moussaillon ! Bienvenue sur le marché des trésors.", anchor: pirate5 },
    { text: "Créons ton business plan.", anchor: pirate2 }
  ], () => {
    showLoader("Préparation du mini-jeu...", 800, startMiniGame1);
  });
}

/* =====================================================
   🏴‍☠️ MENTOR
===================================================== */
const mentor = document.getElementById("pirateMentor");
const mentorText = document.getElementById("mentorText");

const mentorDialogs = [
  "Tout bon projet commence par l’origine du trésor.",
  "Un capitaine a besoin d’un équipage.",
  "Garde ton objectif en tête.",
  "Observe le marché.",
  "Explique la valeur du trésor.",
  "Sans calcul, pas de bateau.",
  "Démarque-toi.",
  "Compte ton or.",
  "Organisation = réussite."
];

function showMentor(step) {
  mentorText.textContent = mentorDialogs[step];
  mentor.classList.remove("hidden");
}

function hideMentor() {
  mentor.classList.add("hidden");
}

/* =====================================================
   🎮 MINI-JEU 1 — BUSINESS PLAN
===================================================== */
const miniGame = document.getElementById("miniGameContainer");
const gameQ = document.getElementById("gameQuestion");
const gameA = document.getElementById("gameAnswers");
const gameF = document.getElementById("gameFeedback");

const steps = [
  { q:"Origine du trésor ?", a:["Coffre secret","Marché","Cadeau"], c:0 },
  { q:"Équipage ?", a:["Capitaine + moussaillons","Seul","Famille"], c:0 },
  { q:"Objectif ?", a:["Acheter un bateau","Vacances","Décoration"], c:0 },
  { q:"Observer ?", a:["Prix concurrents","Météo","Tenues"], c:0 },
  { q:"Expliquer ?", a:["Valeur","Couleur","Taille"], c:0 },
  { q:"Modèle économique ?", a:["Combien vendre","Nettoyer","Compter mouettes"], c:0 },
  { q:"Stratégie ?", a:["Bien présenter","Crier","Pas de prix"], c:0 },
  { q:"Plan financier ?", a:["Vérifier l’or","Dessiner","Chanter"], c:0 },
  { q:"Organisation ?", a:["Éviter conflits","Nom perroquet","Sabres"], c:0 }
];

let currentStep = 0;

function startMiniGame1() {
  fadeScreen.classList.add("hidden"); // 🔒 sécurité anti-blocage
  miniGame.classList.remove("hidden");
  currentStep = 0;
  loadMiniGameStep();
}

function loadMiniGameStep() {
  showMentor(currentStep);
  gameQ.textContent = steps[currentStep].q;
  gameA.innerHTML = "";
  gameF.textContent = "";

  steps[currentStep].a.forEach((txt, i) => {
    const btn = document.createElement("button");
    btn.textContent = txt;
    btn.onclick = () => {
      if (i === steps[currentStep].c) {
        gameF.textContent = "✅ Bonne décision";
        setTimeout(() => {
          currentStep++;
          currentStep < steps.length ? loadMiniGameStep() : endMiniGame1();
        }, 600);
      } else {
        gameF.textContent = "❌ Mauvais choix";
      }
    };
    gameA.appendChild(btn);
  });
}

function endMiniGame1() {
  hideMentor();
  miniGame.classList.add("hidden");
  showBook();
}

/* =====================================================
   📖 LIVRE (FIN MINI-JEU 1)
===================================================== */
function showBook() {
  document.getElementById("bookContainer").classList.remove("hidden");
}

/* =====================================================
   🏁 (La suite : mini-jeu 2, base de données, fin
   → reste inchangée et fonctionne déjà)
===================================================== */

});
