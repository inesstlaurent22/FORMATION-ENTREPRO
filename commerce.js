document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   🎬 VIDÉO INTRO
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const questVideo = document.getElementById("questVideo");
const toggleSound = document.getElementById("toggleSound");
const closeVideo = document.getElementById("closeVideo");

if (questVideo) {
  questVideo.muted = true;
  toggleSound.textContent = "🔇";

  toggleSound.onclick = () => {
    questVideo.muted = !questVideo.muted;
    toggleSound.textContent = questVideo.muted ? "🔇" : "🔊";
  };

  closeVideo.onclick = () => {
    questVideo.pause();
    videoContainer.classList.add("hidden");
    document.getElementById("background").classList.remove("hidden");
  };
}

/* =====================================================
   🌑 LOADER
===================================================== */
const fadeScreen = document.getElementById("fadeScreen");
const loaderBox = fadeScreen.querySelector(".loaderBox");

function showLoader(text, duration, callback) {
  loaderBox.innerHTML = `<div class="loaderText">${text}</div>`;
  fadeScreen.classList.remove("hidden");

  setTimeout(() => {
    fadeScreen.classList.add("hidden");
    if (callback) callback();
  }, duration);
}

/* =====================================================
   🎮 MINI-JEU — BUSINESS PLAN
===================================================== */
const miniGame = document.getElementById("miniGame");
const gameQ = document.getElementById("gameQ");
const gameA = document.getElementById("gameA");
const gameF = document.getElementById("gameF");

const steps = [
  {
    question: "Comment les pirates ont-ils obtenu leurs pierres précieuses ?",
    answers: [
      "En trouvant un coffre dans une grotte secrète",
      "En les achetant au marché",
      "Un pirate inconnu les a données"
    ],
    correct: 0
  },
  {
    question: "Qui fait partie de l’équipage pirate ?",
    answers: [
      "Le capitaine et deux moussaillons",
      "Seulement le capitaine",
      "Toute la famille pirate"
    ],
    correct: 0
  },
  {
    question: "Quel est l’objectif du projet pirate ?",
    answers: [
      "Vendre les pierres pour acheter un bateau",
      "Partir en vacances",
      "Décorer la cale"
    ],
    correct: 0
  },
  {
    question: "Que faut-il observer au marché ?",
    answers: [
      "Les autres marchands et leurs prix",
      "La météo",
      "Les vêtements"
    ],
    correct: 0
  },
  {
    question: "Que doivent expliquer les pirates aux acheteurs ?",
    answers: [
      "La valeur et la rareté des pierres",
      "Seulement la couleur",
      "Seulement la taille"
    ],
    correct: 0
  },
  {
    question: "À quoi sert le modèle économique ?",
    answers: [
      "Savoir combien vendre pour acheter le bateau",
      "Faire le ménage",
      "Compter les mouettes"
    ],
    correct: 0
  },
  {
    question: "Quelle stratégie est la meilleure ?",
    answers: [
      "Bien présenter le trésor",
      "Crier très fort",
      "Vendre sans prix"
    ],
    correct: 0
  },
  {
    question: "À quoi sert le plan financier ?",
    answers: [
      "Vérifier si l’or suffit pour le bateau",
      "Dessiner une carte",
      "Chanter"
    ],
    correct: 0
  },
  {
    question: "Pourquoi organiser l’activité pirate ?",
    answers: [
      "Pour savoir à qui appartient l’or",
      "Nommer le perroquet",
      "Fabriquer des sabres"
    ],
    correct: 0
  }
];

let currentStep = 0;

/* =====================================================
   🏴‍☠️ PNJ PIRATE MENTOR
===================================================== */
const mentor = document.getElementById("pirateMentor");
const mentorText = document.getElementById("mentorText");

const mentorDialogs = [
  "Tout bon trésor a une origine claire…",
  "Un capitaine n’est rien sans son équipage.",
  "Garde ton objectif en vue, moussaillon.",
  "Observe le marché avant d’agir.",
  "Explique pourquoi ton trésor vaut de l’or.",
  "Sans calcul, pas de navire.",
  "Démarque-toi des autres pirates.",
  "Compte ton or avant de lever l’ancre.",
  "Un trésor bien organisé évite les mutineries."
];

function showMentor(step) {
  mentorText.textContent = mentorDialogs[step];
  mentor.classList.remove("hidden");
}

function hideMentor() {
  mentor.classList.add("hidden");
}

/* =====================================================
   ▶️ LANCER LE MINI-JEU
===================================================== */
window.launchMiniGame1 = function () {
  currentStep = 0;

  showLoader("Préparation du mini-jeu...", 600, () => {
    miniGame.classList.remove("hidden");
    loadStep();
  });
};

/* =====================================================
   ❓ QUESTIONS
===================================================== */
function loadStep() {
  showMentor(currentStep);

  gameQ.textContent = steps[currentStep].question;
  gameA.innerHTML = "";
  gameF.textContent = "";

  steps[currentStep].answers.forEach((txt, i) => {
    const btn = document.createElement("button");
    btn.textContent = txt;

    btn.onclick = () => {
      if (i === steps[currentStep].correct) {
        gameF.textContent = "✅ Bonne décision, capitaine !";

        setTimeout(() => {
          currentStep++;
          if (currentStep < steps.length) {
            loadStep();
          } else {
            hideMentor();
            winMiniGame1();
          }
        }, 700);
      } else {
        gameF.textContent = "❌ Mauvais choix… écoute le mentor !";
      }
    };

    gameA.appendChild(btn);
  });
}

/* =====================================================
   🏆 VICTOIRE
===================================================== */
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
   📖 LIVRE (PLACEHOLDER)
===================================================== */
function showBook() {
  document.getElementById("bookContainer").classList.remove("hidden");
}

});
