document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   🔧 UTILITAIRES
===================================================== */
function fade(text, cb) {
  fadeScreen.querySelector(".loaderBox").textContent = text;
  fadeScreen.style.display = "flex";

  setTimeout(() => {
    fadeScreen.style.display = "none";
    cb && cb();
  }, 1800);
}

function typeWriter(el, text, cb) {
  let i = 0;
  el.textContent = "";
  const t = setInterval(() => {
    el.textContent += text[i++];
    if (i >= text.length) {
      clearInterval(t);
      cb && cb();
    }
  }, 80);
}

/* =====================================================
   🎬 VIDÉO INTRO
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const video = document.getElementById("questVideo");
const toggleSound = document.getElementById("toggleSound");
const closeVideo = document.getElementById("closeVideo");

toggleSound.onclick = () => {
  video.muted = !video.muted;
  toggleSound.textContent = video.muted ? "🔇" : "🔊";
};

closeVideo.onclick = endVideo;
video.onended = endVideo;

function endVideo() {
  video.pause();
  videoContainer.style.display = "none";
  fade("Chargement...", showBackground);
}

/* =====================================================
   🌅 BACKGROUND
===================================================== */
const background = document.getElementById("background");
const pirate2 = document.getElementById("pirate2bis");
const pirate5 = document.getElementById("pirate5bis");
const pirate3 = document.getElementById("pirate3bis");

function showBackground() {
  background.classList.remove("hidden");
}

/* =====================================================
   💬 BULLES – GESTION GÉNÉRIQUE
===================================================== */
const bubbleContainer = document.getElementById("bubbleContainer");

function showDialogueSequence(dialogues, endCallback) {
  let index = 0;

  function showBubble() {
    bubbleContainer.innerHTML = "";

    const d = dialogues[index];
    const bubble = document.createElement("div");
    bubble.className = "dialogue-bubble";
    bubble.textContent = d.t;

    const r = d.p.getBoundingClientRect();
    bubble.style.left = r.left + "px";
    bubble.style.top = (r.top - 150) + "px";

    bubble.onclick = () => {
      index++;
      index < dialogues.length ? showBubble() : (bubbleContainer.innerHTML = "", endCallback());
    };

    bubbleContainer.appendChild(bubble);
  }

  showBubble();
}

/* =====================================================
   💬 DIALOGUES 1
===================================================== */
const dialogues1 = [
  { p: pirate5, t: "Bienvenue sur le marché des trésors !" },
  { p: pirate2, t: "Je suis prêt capitaine !" },
  { p: pirate5, t: "Observe bien le marché avant de vendre." }
];

pirate5.onclick = () => {
  showDialogueSequence(dialogues1, () =>
    fade("Termines ce mini jeu pour poursuivre ta quête", startQuiz)
  );
};

/* =====================================================
   🎮 MINI-JEU 1 – QUIZ
===================================================== */
const miniGameContainer = document.getElementById("miniGameContainer");
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const progressEl = document.getElementById("progress");

const steps = [
  { question: "Où les pirates ont-ils trouvé leurs pierres ?", answers: ["Dans un coffre dans une grotte secrète","Ils les ont achetées au marché","La tante les leur a données"], correct: 0 },
  { question: "Qui fait partie de l'équipage pirate ?", answers: ["Toi et les deux moussaillons","Juste le capitaine","Toute la famille pirate"], correct: 0 },
  { question: "Quel est le but du projet des pirates ?", answers: ["Construire un bateau","Partir en vacances","Garder les pierres pour décorer la cale"], correct: 0 },
  { question: "Qu’est-ce que les pirates doivent observer sur le marché ?", answers: ["Nos pierres","Les chapeaux des concurrents","La météo"], correct: 0 },
  { question: "Que doivent-ils décrire pour leurs pierres ?", answers: ["Caractéristiques, nombre, qualités et défauts","Seulement la couleur","Seulement la taille"], correct: 0 },
  { question: "À quoi sert le modèle économique ?", answers: ["Savoir combien de pierres vendre pour acheter le bateau","Savoir qui fait la vaisselle","Compter les mouettes"], correct: 0 },
  { question: "Quelle stratégie les différencie des autres ?", answers: ["Vendre les pierres dans des boîtes en bois","Crier très fort au marché","Vendre sans dire le prix"], correct: 0 },
  { question: "Qu’est-ce que le plan financier ?", answers: ["Un document qui prévoit les dépenses et les gains","Une carte au trésor","Une chanson de pirates"], correct: 0 },
  { question: "À quoi sert le statut juridique ?", answers: ["À dire comment l’activité pirate est organisée légalement","À choisir le nom du perroquet","À fabriquer des épées"], correct: 0 }
];

let quizIndex = 0;

function startQuiz() {
  miniGameContainer.style.display = "flex";
  quizIndex = 0;
  showQuizQuestion();
}

function showQuizQuestion() {
  const q = steps[quizIndex];
  questionEl.textContent = q.question;
  answersEl.innerHTML = "";
  progressEl.textContent = `${quizIndex + 1}/${steps.length}`;

  q.answers.forEach((ans, i) => {
    const btn = document.createElement("button");
    btn.textContent = ans;
    btn.onclick = () => {
      if (i === q.correct) {
        quizIndex++;
        quizIndex < steps.length ? showQuizQuestion() : endQuiz();
      } else {
        showQuizQuestion();
      }
    };
    answersEl.appendChild(btn);
  });
}

function endQuiz() {
  miniGameContainer.style.display = "none";
  fade("Bravo ! Ton business plan est prêt", showBook);
}

/* =====================================================
   📖 LIVRE DIGITAL
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

let bookIndex = Number(localStorage.getItem("bookIndex")) || 0;

function showBook() {
  bookContainer.classList.remove("hidden");
  updateBook();
}

function updateBook() {
  rightPage.src = pages[bookIndex];
  leftPage.src = bookIndex > 0 ? "images/Businessplan4.jpg" : "";
  continueQuestBtn.style.display = bookIndex === pages.length - 1 ? "block" : "none";
  localStorage.setItem("bookIndex", bookIndex);
}

document.querySelector(".book").onclick = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  if (e.clientX > rect.left + rect.width / 2 && bookIndex < pages.length - 1) {
    bookIndex++;
  } else if (bookIndex > 0) {
    bookIndex--;
  }
  rightPage.classList.add("turn");
  updateBook();
  setTimeout(() => rightPage.classList.remove("turn"), 500);
};

continueQuestBtn.onclick = () => {
  bookContainer.classList.add("hidden");
  spawnPirate3();
};

/* =====================================================
   ✨ PIRATE 3 + DIALOGUES 2
===================================================== */
function spawnPirate3() {
  pirate3.classList.remove("hidden");
  setTimeout(() => pirate3.classList.add("show"), 50);
}

const dialogues2 = [
  { p: pirate3, t: "Vous êtes nouveaux sur le marché ? On a entendu parler de vous" },
  { p: pirate2, t: "Oui, nous revendons des pierres précieuses !" },
  { p: pirate3, t: "Les clients n’ont confiance qu’en un seul revendeur…" },
  { p: pirate2, t: "Comment allons-nous faire pour qu’ils aient confiance ?" },
  { p: pirate5, t: "Va les rencontrer et montre tes pierres." },
  { p: pirate2, t: "Mais nous avons une échoppe…" },
  { p: pirate5, t: "Pars avec quelques pierres et des papiers." },
  { p: pirate2, t: "Bonne idée !" }
];

pirate3.onclick = () => {
  showDialogueSequence(dialogues2, () =>
    fade("Dernier mini jeux avant de finir la quête", endMiniGame2)
  );
};

/* =====================================================
   🎮 MINI-JEU 2 (SIMPLIFIÉ)
===================================================== */
function endMiniGame2() {
  fade("Mini jeu réussi !", showEndScreen);
}

/* =====================================================
   🏁 FIN DE QUÊTE
===================================================== */
const endScreen = document.getElementById("endScreen");
const endSubtitle = document.getElementById("endSubtitle");
const rewardBubbles = document.querySelectorAll(".rewardBubble");
const backToMenuBtn = document.getElementById("backToMenuBtn");

function showEndScreen() {
  localStorage.setItem("quest_commerce_completed", "true");
  endScreen.classList.remove("hidden");

  typeWriter(endSubtitle, "tu as gagné ...", () => {
    rewardBubbles.forEach((b, i) => {
      setTimeout(() => {
        b.style.opacity = "1";
        b.style.transform = "scale(1)";
      }, i * 700);
    });

    setTimeout(() => {
      backToMenuBtn.classList.remove("hidden");
    }, rewardBubbles.length * 700 + 600);
  });
}

backToMenuBtn.onclick = () => {
  window.location.href = "menu.html";
};

});
