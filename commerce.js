document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     📳 VIBRATION
  ===================================================== */
  const vibrate = (p = 15) => {
    if ("vibrate" in navigator) navigator.vibrate(p);
  };

  /* =====================================================
     🌑 FADE / LOADER
  ===================================================== */
  const fadeScreen = document.getElementById("fadeScreen");
  const loaderBox = fadeScreen.querySelector(".loaderBox");

  function fade(text, cb) {
    loaderBox.innerHTML = text;
    fadeScreen.style.display = "flex";
    setTimeout(() => {
      fadeScreen.style.display = "none";
      cb && cb();
    }, 1800);
  }

  /* =====================================================
     🎬 VIDÉO
  ===================================================== */
  const videoContainer = document.getElementById("videoContainer");
  const video = document.getElementById("questVideo");
  const closeVideo = document.getElementById("closeVideo");
  const toggleSound = document.getElementById("toggleSound");

  video.muted = true;

  toggleSound.onclick = () => {
    video.muted = !video.muted;
    toggleSound.textContent = video.muted ? "🔇" : "🔊";
    vibrate(10);
  };

  closeVideo.onclick = endVideo;
  video.onended = endVideo;

  function endVideo() {
    vibrate(20);
    video.pause();
    videoContainer.style.display = "none";
    fade("Chargement...", showBackground);
  }

  /* =====================================================
     🌅 BACKGROUND + PIRATES
  ===================================================== */
  const background = document.getElementById("background");
  const pirate2 = document.getElementById("pirate2bis");
  const pirate5 = document.getElementById("pirate5bis");
  const pirate3 = document.getElementById("pirate3bis");

  function showBackground() {
    background.style.display = "block";
    pirate2.classList.remove("hidden");
    pirate5.classList.remove("hidden");
    setTimeout(() => background.style.opacity = 1, 50);
  }

  /* =====================================================
     💬 BULLES DE DIALOGUE + SKIP
  ===================================================== */
  const bubbleContainer = document.getElementById("bubbleContainer");
  const skipBtn = document.getElementById("skipDialoguesBtn");

  function playDialogues(dialogues, onEnd) {
    let i = 0;
    skipBtn.style.display = "block";

    function showBubble() {
      bubbleContainer.innerHTML = "";

      const d = dialogues[i];
      const bubble = document.createElement("div");
      bubble.className = "dialogue-bubble";
      bubble.innerHTML = d.text;

      const r = d.anchor.getBoundingClientRect();
      bubble.style.left = r.left + "px";
      bubble.style.top = (r.top - 120) + "px";

      bubble.onclick = () => {
        vibrate(10);
        i++;
        i < dialogues.length ? showBubble() : endDialogues();
      };

      bubbleContainer.appendChild(bubble);
    }

    function endDialogues() {
      bubbleContainer.innerHTML = "";
      skipBtn.style.display = "none";
      onEnd && onEnd();
    }

    skipBtn.onclick = endDialogues;
    showBubble();
  }

  /* =====================================================
     💬 DIALOGUES 1 (MAÎTRE / APPRENTI)
  ===================================================== */
  pirate5.onclick = () => {
    playDialogues([
      { text: "Bienvenue sur le marché des trésors.", anchor: pirate5 },
      { text: "Je veux réussir ici.", anchor: pirate2 },
      { text: "Alors prouve que tu es digne de confiance.", anchor: pirate5 }
    ], () => {
      fade("Termine ce mini jeu pour continuer la quête", startMiniGame1);
    });
  };

  /* =====================================================
     🎮 MINI-JEU 1 — STRATÉGIE CLIENT
  ===================================================== */
  const miniGame = document.getElementById("miniGameContainer");
  const gameQuestion = document.getElementById("gameQuestion");
  const gameAnswers = document.getElementById("gameAnswers");
  const gameFeedback = document.getElementById("gameFeedback");

  let goodChoices = 0;

  function startMiniGame1() {
    goodChoices = 0;
    miniGame.style.display = "flex";

    gameQuestion.textContent = "Que dois-tu faire pour rassurer les clients ?";
    gameFeedback.textContent = "";
    gameAnswers.innerHTML = "";

    [
      { text: "Montrer les pierres", good: true },
      { text: "Mentir sur leur origine", good: false },
      { text: "Donner l’adresse de l’échoppe", good: true }
    ].forEach(choice => {
      const btn = document.createElement("button");
      btn.textContent = choice.text;

      btn.onclick = () => {
        btn.classList.add("selected");
        vibrate(20);

        if (choice.good) {
          goodChoices++;
          gameFeedback.textContent = "👍 Bonne décision";
        } else {
          gameFeedback.textContent = "❌ Mauvaise idée";
        }

        if (goodChoices >= 2) {
          miniGame.style.display = "none";
          showGoldReward();
        }
      };

      gameAnswers.appendChild(btn);
    });
  }

  /* =====================================================
     💰 RÉCOMPENSE OR + COMPTEUR
  ===================================================== */
  function showGoldReward() {
    fade(`
      <strong>Bravo !</strong><br><br>
      Tu as gagné <span id="goldCounter">0</span> pièces d’or<br>
      et ton <strong>Business Plan</strong>
      <div id="coinExplosion"></div>
    `, showBook);

    const counter = document.getElementById("goldCounter");
    let value = 0;

    const interval = setInterval(() => {
      value += 100;
      counter.textContent = value;
      if (value >= 5000) {
        counter.textContent = "5000";
        clearInterval(interval);
      }
    }, 30);

    const explosion = document.getElementById("coinExplosion");
    for (let i = 0; i < 24; i++) {
      const coin = document.createElement("div");
      coin.className = "coin";
      coin.style.setProperty("--x", Math.random());
      coin.style.setProperty("--y", Math.random());
      explosion.appendChild(coin);
    }
  }

  /* =====================================================
     📖 LIVRE DIGITAL
  ===================================================== */
  const bookContainer = document.getElementById("bookContainer");
  const leftPage = document.getElementById("leftPage");
  const rightPage = document.getElementById("rightPage");

  const pages = [
    "images/Businessplancov.png",
    "images/Businessplan1.png",
    "images/Businessplan2.png",
    "images/Businessplan3.png"
  ];

  let bookIndex = 0;

  function showBook() {
    bookContainer.classList.add("show");
    updateBook();
  }

  function updateBook() {
    rightPage.src = pages[bookIndex];
    leftPage.src = bookIndex > 0 ? "images/Businessplan4.jpg" : "";
  }

  document.querySelector(".book").onclick = () => {
    if (bookIndex >= pages.length - 1) return;

    rightPage.classList.add("turn");
    bookIndex++;
    updateBook();

    setTimeout(() => rightPage.classList.remove("turn"), 600);

    if (bookIndex === pages.length - 1) {
      setTimeout(spawnPirate3, 600);
    }
  };

  /* =====================================================
     ✨ PIRATE 3 + DIALOGUES 2
  ===================================================== */
  function spawnPirate3() {
    pirate3.classList.remove("hidden");
    setTimeout(() => pirate3.classList.add("show"), 50);
  }

  pirate3.onclick = () => {
    playDialogues([
      { text: "Vous êtes nouveaux sur le marché ?", anchor: pirate3 },
      { text: "Oui, nous vendons des pierres précieuses.", anchor: pirate2 },
      { text: "Les clients ont besoin de confiance.", anchor: pirate3 },
      { text: "Je vais aller à leur rencontre.", anchor: pirate2 }
    ], () => {
      fade("Bravo, tu as gagné la quête", showEndScreen);
    });
  };

  /* =====================================================
     🏁 FIN DE QUÊTE
  ===================================================== */
  const endScreen = document.getElementById("endScreen");

  function showEndScreen() {
    endScreen.style.display = "flex";

    // 🎆 retour automatique au menu
    setTimeout(() => {
      window.location.href = "menu.html";
    }, 3000);
  }

});
