document.addEventListener("DOMContentLoaded", () => {

  /* ============================
     🎬 VIDÉO
  ============================ */
  const video = document.getElementById("questVideo");
  const videoContainer = document.getElementById("videoContainer");
  const closeVideo = document.getElementById("closeVideo");
  const toggleSound = document.getElementById("toggleSound");

  video.preload = "auto";

  // lecture auto au chargement
  video.play().catch(() => {});

  // bouton mute
  toggleSound.addEventListener("click", () => {
    video.muted = !video.muted;
    toggleSound.textContent = video.muted ? "🔇" : "🔊";
  });

  // fermeture vidéo = démarre dialogues
  closeVideo.addEventListener("click", () => {
    video.pause();
    videoContainer.style.display = "none";
    startDialogues();
  });

  // fin vidéo = démarre dialogues
  video.addEventListener("ended", () => {
    videoContainer.style.display = "none";
    startDialogues();
  });

  /* ============================
     🎭 PERSONNAGES
  ============================ */
  const pirate2bis = document.getElementById("pirate2bis");
  const pirate5bis = document.getElementById("pirate5bis");

  pirate2bis.style.position = "absolute";
  pirate2bis.style.left = "516px";
  pirate2bis.style.top = "406px";

  pirate5bis.style.position = "absolute";
  pirate5bis.style.left = "785px";
  pirate5bis.style.top = "397px";

  /* ============================
     💬 DIALOGUES
  ============================ */
  let dialogueStep = 0;

  const dialogues = [
    { who:"maitre", text:"Moussaillon ! Bienvenue sur le marché des trésors !...", anchor: pirate5bis },
    { who:"apprenti", text:"J’suis prêt, capitaine !", anchor: pirate2bis },
    { who:"maitre", text:"Écoute bien ! D’abord, tu dois te mettre au niveau des autres pirates…", anchor: pirate5bis },
    { who:"apprenti", text:"Mais comment je fais ça ?", anchor: pirate2bis },
    { who:"maitre", text:"Regarde bien : la plupart ont une petite échoppe...", anchor: pirate5bis },
    { who:"apprenti", text:"Me démarquer… c’est-à-dire ?", anchor: pirate2bis },
    { who:"maitre", text:"Plusieurs stratégies, moussaillon :<br>• vendre moins cher<br>• boîtes en bois luxe<br>• grande boutique visible<br>• aller chez les clients", anchor: pirate5bis },
    { who:"apprenti", text:"Ahhh… donc je choisis la meilleure stratégie selon mes clients !", anchor: pirate2bis },
    { who:"maitre", text:"Exactement ! Observe, teste, et deviens le pirate que tout le monde veut rencontrer.", anchor: pirate5bis },
    { who:"apprenti", text:"MERCI capitaine !", anchor: pirate2bis },
    { who:"maitre", text:"Tu es prêt ? Alors prouve-le maintenant !", anchor: pirate5bis, last:true }
  ];

  function startDialogues() {
    dialogueStep = 0;
    showDialogue();
  }

  function showDialogue() {

    const oldBubble = document.querySelector(".dialogue-bubble");
    if (oldBubble) oldBubble.remove();

    if (dialogueStep >= dialogues.length) return;

    const d = dialogues[dialogueStep];

    const bubble = document.createElement("div");
    bubble.classList.add("dialogue-bubble");

    const speaker =
      d.who === "maitre"
        ? "<strong>Maître Pirate</strong><hr>"
        : "<strong>Moussaillon</strong><hr>";

    bubble.innerHTML = `${speaker}${d.text}`;

    const rect = d.anchor.getBoundingClientRect();
    bubble.style.position = "absolute";
    bubble.style.left = rect.left + "px";
    bubble.style.top = (rect.top - 120) + "px";
    bubble.style.maxWidth = "320px";
    bubble.style.padding = "12px";
    bubble.style.background = "white";
    bubble.style.borderRadius = "14px";
    bubble.style.zIndex = "50";

    // dernière bulle = bouton
    if (d.last) {
      const btn = document.createElement("button");
      btn.textContent = "Ok, j’ai compris";
      btn.style.marginTop = "10px";
      btn.style.padding = "8px 14px";
      btn.style.fontWeight = "bold";
      btn.style.borderRadius = "8px";

      btn.addEventListener("click", () => {
        bubble.remove();
        launchLoaderThenMiniGame();
      });

      bubble.appendChild(btn);
    } else {
      bubble.addEventListener("click", () => {
        dialogueStep++;
        showDialogue();
      });
    }

    document.body.appendChild(bubble);
  }

  /* ============================
     ⏳ LOADER
  ============================ */
  function launchLoaderThenMiniGame() {

    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.left = 0;
    overlay.style.top = 0;
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "black";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.flexDirection = "column";
    overlay.style.zIndex = 200;

    const msg = document.createElement("div");
    msg.innerHTML = "Gagne ce mini-jeu pour continuer ta quête";
    msg.style.color = "white";
    msg.style.fontSize = "28px";
    msg.style.fontWeight = "bold";

    overlay.appendChild(msg);
    document.body.appendChild(overlay);

    setTimeout(() => {
      overlay.remove();
      startMiniGame();
    }, 2000);
  }

  /* ============================
     🎮 MINI-JEU
  ============================ */
  const miniGameContainer = document.getElementById("miniGameContainer");
  const gameQuestion = document.getElementById("gameQuestion");
  const gameAnswers = document.getElementById("gameAnswers");
  const gameFeedback = document.getElementById("gameFeedback");

  const steps = [
    { question: "Où les pirates ont-ils trouvé leurs pierres ?", answers: ["Dans un coffre dans une grotte secrète","Ils les ont achetées au marché","La tante les leur a données"], correct: 0 },
    { question: "Qui fait partie de l'équipage pirate ?", answers: ["Toi et les deux moussaillons","Juste le capitaine","Toute la famille pirate"], correct: 0 },
    { question: "Quel est le but du projet des pirates ?", answers: ["Construire un bateau","Partir en vacances","Garder les pierres pour décorer la cale"], correct: 0 }
  ];

  let currentStep = 0;

  function startMiniGame() {
    miniGameContainer.style.display = "flex";
    currentStep = 0;
    showStep();
  }

  function showStep() {
    if (currentStep >= steps.length) {
      handleWinMiniGame();
      return;
    }

    const s = steps[currentStep];

    gameQuestion.textContent = s.question;
    gameAnswers.innerHTML = "";
    gameFeedback.textContent = "";

    s.answers.forEach((ans, i) => {
      const btn = document.createElement("button");
      btn.textContent = ans;
      btn.addEventListener("click", () => handleAnswer(i));
      gameAnswers.appendChild(btn);
    });
  }

  function handleAnswer(i) {
    if (i === steps[currentStep].correct) {
      gameFeedback.textContent = "✅ Bonne réponse !";
      setTimeout(() => {
        currentStep++;
        showStep();
      }, 600);
    } else {
      gameFeedback.textContent = "❌ Essaie encore !";
    }
  }

  /* ============================
     🏆 VICTOIRE
  ============================ */
  function handleWinMiniGame() {

    miniGameContainer.style.display = "none";

    const panel = document.createElement("div");
    panel.classList.add("win-panel");
    panel.innerHTML = `
      <div class="victoryBox">
        <h2>🎉 Bravo !</h2>
        <h3>Tu as gagné 5000 PO 💰</h3>
      </div>
    `;

    document.body.appendChild(panel);

    // feu d'artifice pièces DERRIÈRE le cadre
    setTimeout(() => {
      launchCoinFireworks(panel.querySelector(".victoryBox"));
    }, 200);
  }

  /* ============================
     🪙 FEU D’ARTIFICE OR DERRIÈRE LE TEXTE
  ============================ */
  function launchCoinFireworks(behindBox) {

    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.inset = "0";
    container.style.zIndex = "0";

    behindBox.style.position = "relative";
    behindBox.appendChild(container);

    for (let i = 0; i < 40; i++) {
      const coin = document.createElement("div");
      coin.textContent = "🪙";
      coin.style.position = "absolute";
      coin.style.fontSize = "26px";
      coin.style.left = Math.random() * 100 + "%";
      coin.style.top = "60%";
      coin.style.opacity = "0";

      coin.style.transition = "transform 1.2s linear, opacity 1.2s";

      container.appendChild(coin);

      setTimeout(() => {
        coin.style.opacity = 1;
        coin.style.transform = `translate(${(Math.random()*200-100)}px, -${Math.random()*200}px) scale(1.3)`;
      }, 50);

      setTimeout(() => coin.remove(), 1400);
    }
  }

});
