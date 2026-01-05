document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     🧠 ÉTAT GLOBAL
  ===================================================== */

  let gameState = "video";
  let dialogueStep = 0;
  let quizStep = 0;
  let selected = [];

  /* =====================================================
     🎬 VIDÉO
  ===================================================== */

  const videoContainer = document.getElementById("videoContainer");
  const video = document.getElementById("questVideo");
  const toggleSound = document.getElementById("toggleSound");
  const closeVideo = document.getElementById("closeVideo");

  const background = document.getElementById("background");
  const pirate2bis = document.getElementById("pirate2bis");
  const pirate5bis = document.getElementById("pirate5bis");

  background.style.display = "none";
  video.muted = true;
  toggleSound.textContent = "🔇";

  video.play().catch(() => {});

  toggleSound.onclick = () => {
    video.muted = !video.muted;
    toggleSound.textContent = video.muted ? "🔇" : "🔊";
  };

  closeVideo.onclick = () => endVideo(true);
  video.onended = () => endVideo(false);

  function endVideo(skipFade) {
    video.pause();

    if (skipFade) {
      videoContainer.style.display = "none";
      showBackground();
    } else {
      videoContainer.style.opacity = 0;
      setTimeout(() => {
        videoContainer.style.display = "none";
        showBackground();
      }, 1000);
    }
  }

  /* =====================================================
     🌅 BACKGROUND + PIRATES
  ===================================================== */
function showBackground() {
  gameState = "background";

  background.style.display = "block";
  background.style.opacity = 0;

  // Pirate apprenti (pirate2bis)
  pirate2bis.style.position = "absolute";
  pirate2bis.style.left = "516px";
  pirate2bis.style.top = "406px";
  pirate2bis.style.width = "186px";
  pirate2bis.style.height = "178px";

  // Maître pirate (pirate5bis)
  pirate5bis.style.position = "absolute";
  pirate5bis.style.left = "785px";
  pirate5bis.style.top = "397px";
  pirate5bis.style.width = "143px";
  pirate5bis.style.height = "187px";

  requestAnimationFrame(() => background.style.opacity = 1);
}

  /* =====================================================
     💬 DIALOGUES
  ===================================================== */

  const bubbleContainer = document.getElementById("bubbleContainer");
  const skipDialoguesBtn = document.getElementById("skipDialoguesBtn");

  const dialogues = [
    { who: "maitre", text: "Moussaillon ! Bienvenue sur le marché des trésors !", anchor: pirate5bis },
    { who: "apprenti", text: "J’suis prêt, capitaine !", anchor: pirate2bis },
    { who: "maitre", text: "Observe, compare et trouve la meilleure stratégie.", anchor: pirate5bis },
    { who: "apprenti", text: "Ok, j’ai compris !", anchor: pirate2bis }
  ];

  pirate5bis.onclick = () => {
    if (gameState !== "background") return;
    gameState = "dialogues";
    dialogueStep = 0;
    skipDialoguesBtn.style.display = "block";
    createBubble(dialogues[0]);
  };

  skipDialoguesBtn.onclick = endDialogues;

  function endDialogues() {
    skipDialoguesBtn.style.display = "none";
    bubbleContainer.innerHTML = "";
    launchMiniGame();
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

    const r = d.anchor.getBoundingClientRect();
    bubble.style.left = r.left + "px";
    bubble.style.top = (r.top - bubble.offsetHeight - 12) + "px";

    typeWriter(text, d.text, 25, () => {
      const btn = document.createElement("button");
      btn.textContent = dialogueStep < dialogues.length - 1 ? "Suite" : "OK, j’ai compris";
      btn.onclick = nextDialogue;
      bubble.appendChild(btn);
    });
  }

  function nextDialogue() {
    dialogueStep++;
    dialogueStep < dialogues.length
      ? createBubble(dialogues[dialogueStep])
      : endDialogues();
  }

  function typeWriter(el, text, speed, cb) {
    let i = 0;
    el.innerHTML = "";
    (function loop() {
      if (i < text.length) {
        el.innerHTML += text[i++];
        setTimeout(loop, speed);
      } else cb && cb();
    })();
  }

  /* =====================================================
     🌑 MINI-JEU
  ===================================================== */

  const fadeScreen = document.getElementById("fadeScreen");
  const miniGameContainer = document.getElementById("miniGameContainer");
  const gameQuestion = document.getElementById("gameQuestion");
  const gameAnswers = document.getElementById("gameAnswers");

  const questions = [
    { q: "Où les pirates ont-ils trouvé leurs pierres ?", a: ["Dans une grotte", "Au marché", "Chez la tante"], c: [0] },
    { q: "Que doivent-ils observer ?", a: ["Pierres", "Concurrents", "Météo"], c: [0, 1] }
  ];

  function launchMiniGame() {
    fadeScreen.style.display = "flex";
    setTimeout(() => {
      fadeScreen.style.display = "none";
      startMiniGame();
    }, 2000);
  }

  function startMiniGame() {
    quizStep = 0;
    miniGameContainer.style.display = "flex";
    showQuestion();
  }

  function showQuestion() {
    if (quizStep >= questions.length) return showReward();

    const q = questions[quizStep];
    gameQuestion.textContent = q.q;
    gameAnswers.innerHTML = "";
    selected = [];

    q.a.forEach((ans, i) => {
      const b = document.createElement("button");
      b.textContent = ans;

      b.onclick = () => {
        if (selected.includes(i)) return;
        selected.push(i);
        if (selected.length === q.c.length) {
          selected.sort().join() === q.c.sort().join()
            ? (quizStep++, showQuestion())
            : showQuestion();
        }
      };

      gameAnswers.appendChild(b);
    });
  }

  /* =====================================================
     🏆 RÉCOMPENSE → LIVRE
  ===================================================== */

  const rewardScreen = document.getElementById("rewardScreen");
  const bookContainer = document.getElementById("bookContainer");
  const continueBtn = document.getElementById("continueQuestBtn");

function showReward() {
  // 🔥 IMPORTANT : on ferme TOUT
  miniGameContainer.style.display = "none";
  fadeScreen.style.display = "none";

  rewardScreen.style.display = "flex";

  setTimeout(() => {
    rewardScreen.style.display = "none";
    showBook();
  }, 2600);
} 

/* =====================================================
   📖 LIVRE
===================================================== */
/* =====================================================
   📖 LIVRE – LOGIQUE FINALE
===================================================== */

const rightPage = document.getElementById("rightPage");
const leftPage = bookContainer.querySelector(".page.left img");

const nextBook = document.getElementById("bookNextBtn");
const prevBook = document.getElementById("bookPrevBtn");

// index logique du livre
// 0 = couverture
// 1 → 3 = pages Businessplan1 → 3
let bookIndex = 0;

// pages droites
const rightPages = [
  "images/Businessplancov.png", // couverture
  "images/Businessplan1.png",
  "images/Businessplan2.png",
  "images/Businessplan3.png"
];

// verso fixe
const leftVerso = "images/Businessplan4.jpg";

function showBook() {
  rewardScreen.style.display = "none";
  miniGameContainer.style.display = "none";
  fadeScreen.style.display = "none";
  background.style.display = "none";
  videoContainer.style.display = "none";

  gameState = "book";
  bookContainer.style.display = "flex";
  bookContainer.classList.remove("show");
  void bookContainer.offsetWidth;
  bookContainer.classList.add("show");

  bookIndex = 0;
  updateBook();
}

function updateBook() {
  // animation page droite
  rightPage.style.animation = "none";
  rightPage.offsetHeight;
  rightPage.style.animation = "pageIn 0.5s ease";

  rightPage.src = rightPages[bookIndex];

  if (bookIndex === 0) {
    // couverture → pas de page gauche
    leftPage.style.visibility = "hidden";
  } else {
    // pages normales
    leftPage.style.visibility = "visible";
    leftPage.src = leftVerso;
  }

  // boutons navigation
  prevBook.style.opacity = bookIndex === 0 ? "0.4" : "1";
  nextBook.style.opacity = bookIndex === rightPages.length - 1 ? "0.4" : "1";

  // bouton continuer
  continueBtn.style.display =
    bookIndex === rightPages.length - 1 ? "block" : "none";
}

// navigation
nextBook.onclick = () => {
  if (bookIndex < rightPages.length - 1) {
    bookIndex++;
    updateBook();
  }
};

prevBook.onclick = () => {
  if (bookIndex > 0) {
    bookIndex--;
    updateBook();
  }
};

// sortie du livre
continueBtn.onclick = () => {
  bookContainer.style.display = "none";
  showBackground();
};
