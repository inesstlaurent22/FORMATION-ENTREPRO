document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     🧠 ÉTAT GLOBAL
  ===================================================== */

  let gameState = "video";
  let dialogueStep = 0;
  let quizStep = 0;
  let selected = [];
  let currentPage = 0;

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

    pirate2bis.style.position = "absolute";
    pirate2bis.style.left = "516px";
    pirate2bis.style.top = "406px";
    pirate2bis.style.transform = "scale(1.005)";

    pirate5bis.style.position = "absolute";
    pirate5bis.style.left = "785px";
    pirate5bis.style.top = "397px";

    movePiratesDown(5);

    requestAnimationFrame(() => background.style.opacity = 1);
  }

  function movePiratesDown(percent) {
    [pirate2bis, pirate5bis].forEach(p => {
      p.style.top =
        (p.offsetTop + window.innerHeight * (percent / 100)) + "px";
    });
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

    requestAnimationFrame(() => {
      const r = d.anchor.getBoundingClientRect();
      bubble.style.left = r.left + "px";
      bubble.style.top = (r.top - bubble.offsetHeight - 12) + "px";
    });

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
     🌑 FADE + MINI JEU
  ===================================================== */

  const fadeScreen = document.getElementById("fadeScreen");
  const miniGameContainer = document.getElementById("miniGameContainer");
  const gameQuestion = document.getElementById("gameQuestion");
  const gameAnswers = document.getElementById("gameAnswers");
  const gameFeedback = document.getElementById("gameFeedback");

  const questions = [
    { q: "Où les pirates ont-ils trouvé leurs pierres ?", a: ["Dans une grotte", "Au marché", "Chez la tante"], c: [0] },
    { q: "Que doivent-ils observer ?", a: ["Pierres", "Concurrents", "Météo"], c: [0, 1] }
  ];

  function launchMiniGame() {
    gameState = "quiz";
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
    gameFeedback.textContent = "";
    selected = [];

    const needed = q.c.length;

    if (needed > 1) {
      const hint = document.createElement("div");
      hint.className = "multiHint";
      hint.textContent = `Trouve ${needed} bonnes réponses`;
      gameAnswers.appendChild(hint);
    }

    q.a.forEach((ans, i) => {
      const b = document.createElement("button");
      b.textContent = ans;

      b.onclick = () => {
        if (selected.includes(i)) return;
        b.classList.add("selected");
        selected.push(i);

        if (selected.length === needed) {
          selected.sort().join() === q.c.sort().join()
            ? setTimeout(() => { quizStep++; showQuestion(); }, 600)
            : (gameFeedback.textContent = "❌ Mauvaises réponses", setTimeout(showQuestion, 900));
        }
      };

      gameAnswers.appendChild(b);
    });
  }

  /* =====================================================
     🏆 RÉCOMPENSE + LIVRE
  ===================================================== */

  const rewardScreen = document.getElementById("rewardScreen");
  const bookContainer = document.getElementById("bookContainer");
  const continueBtn = document.getElementById("continueQuestBtn");

  function showReward() {
    miniGameContainer.style.display = "none";
    rewardScreen.style.display = "flex";

    setTimeout(() => {
      rewardScreen.style.display = "none";
      showBook();
    }, 2600);
  }

  /* =====================================================
     📖 LIVRE + NAVIGATION
  ===================================================== */

  const pages = document.querySelectorAll(".page");
  const nextBtn = document.getElementById("bookNextBtn");
  const prevBtn = document.getElementById("bookPrevBtn");

  function showBook() {
    gameState = "book";
    bookContainer.style.display = "flex";
    currentPage = 0;

    pages.forEach((p, i) => {
      p.classList.remove("flipped");
      p.style.zIndex = pages.length - i;
    });

    continueBtn.style.display = "none";
  }

  function nextPage() {
    if (currentPage < pages.length) {
      pages[currentPage].classList.add("flipped");
      currentPage++;

      if (currentPage === pages.length) {
        continueBtn.style.display = "block";
      }
    }
  }

  function prevPage() {
    if (currentPage > 0) {
      currentPage--;
      pages[currentPage].classList.remove("flipped");
      continueBtn.style.display = "none";
    }
  }

  nextBtn.onclick = nextPage;
  prevBtn.onclick = prevPage;

  continueBtn.onclick = () => {
    continueBtn.style.display = "none";
    showBackground();
  };

});
