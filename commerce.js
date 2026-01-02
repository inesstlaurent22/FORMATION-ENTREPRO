document.addEventListener("DOMContentLoaded", () => {

  /* ========================================================
        0️⃣ ÉLÉMENTS DOM
  ======================================================== */
  const videoContainer = document.getElementById("videoContainer");
  const questVideo = document.getElementById("questVideo");
  const toggleSound = document.getElementById("toggleSound");
  const closeVideo = document.getElementById("closeVideo");
  const background = document.getElementById("background");

  const buttonsContainer = document.getElementById("buttonsContainer");
  const replayVideo = document.getElementById("replayVideo");
  const finishQuest = document.getElementById("finishQuest");

  const pirate2bis = document.getElementById("pirate2bis");
  const pirate5bis = document.getElementById("pirate5bis");
  const bubbleContainer = document.getElementById("bubbleContainer");

  const overlayBlur = document.getElementById("overlayBlur");
  const startMissionButton = document.getElementById("startMissionButton");

  const miniGameContainer = document.getElementById("miniGameContainer");
  const introText = document.getElementById("introText");
  const gameQuestion = document.getElementById("gameQuestion");
  const gameAnswers = document.getElementById("gameAnswers");
  const gameFeedback = document.getElementById("gameFeedback");

  const victoryScreen = document.getElementById("victoryScreen");

  /* ========================================================
        1️⃣ ÉTAT INITIAL
  ======================================================== */
  questVideo.muted = true;
  questVideo.setAttribute("playsinline", "");
  questVideo.setAttribute("webkit-playsinline", "");
  questVideo.loop = false;

  videoContainer.style.display = "flex";
  videoContainer.style.opacity = "1";

  if (background) background.classList.remove("show");
  if (buttonsContainer) buttonsContainer.style.display = "none";
  if (pirate2bis) pirate2bis.style.display = "none";
  if (pirate5bis) pirate5bis.style.display = "none";
  if (replayVideo) replayVideo.style.display = "none";
  if (finishQuest) finishQuest.style.display = "none";

  // cacher le bouton de mission au départ
  startMissionButton.style.display = "none";
  startMissionButton.style.opacity = 0;

  // cacher mini-jeu et overlay
  overlayBlur.style.display = "none";
  miniGameContainer.style.display = "none";
  victoryScreen.style.display = "none";

  /* ========================================================
        2️⃣ AUTOPLAY VIDÉO AVEC BOUTON SI BLOQUÉ
  ======================================================== */
  function createLaunchButton() {
    const btn = document.createElement("button");
    btn.id = "launchButton";
    btn.textContent = "⚓ Lancer la vidéo";
    Object.assign(btn.style, {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      padding: "20px 40px",
      fontSize: "1.5rem",
      background: "linear-gradient(#8a5a20, #c89b58)",
      color: "#fff5d6",
      border: "3px solid #3b1b00",
      borderRadius: "12px",
      boxShadow: "0 5px 0 #3b1b00",
      cursor: "pointer",
      zIndex: "1100",
      textShadow: "1px 1px 2px #000"
    });
    videoContainer.appendChild(btn);
    btn.addEventListener("click", () => {
      questVideo.play();
      btn.remove();
    });
  }

  function tryPlayVideo() {
    questVideo.play().then(() => {
      console.log("▶️ Vidéo démarrée automatiquement");
    }).catch(() => {
      console.warn("⛔ Autoplay bloqué, affichage du bouton Lancer");
      createLaunchButton();
    });
  }

  setTimeout(tryPlayVideo, 200);

  /* ========================================================
        3️⃣ FIN VIDÉO → SCÈNE FOND + PIRATES
  ======================================================== */
  function showScene() {
    // fade out vidéo
    videoContainer.style.transition = "opacity 0.5s";
    videoContainer.style.opacity = 0;
    setTimeout(() => {
      videoContainer.style.display = "none";

      if (background) background.classList.add("show");
      if (buttonsContainer) buttonsContainer.style.display = "flex";
      if (pirate2bis) pirate2bis.style.display = "flex";
      if (pirate5bis) pirate5bis.style.display = "flex";
      if (replayVideo) replayVideo.style.display = "flex";
      if (finishQuest) finishQuest.style.display = "flex";

      // lancer dialogues sur clic pirate5bis
      pirate5bis.addEventListener("click", startPirateDialogues);

    }, 500);
  }

  questVideo.addEventListener("ended", showScene);

  if (closeVideo) {
    closeVideo.addEventListener("click", () => {
      questVideo.pause();
      questVideo.dispatchEvent(new Event('ended'));
    });
  }

  /* ========================================================
        4️⃣ SON
  ======================================================== */
  if (toggleSound) {
    toggleSound.addEventListener("click", () => {
      questVideo.muted = !questVideo.muted;
      toggleSound.textContent = questVideo.muted ? "🔇" : "🔊";
    });
  }

  /* ========================================================
        5️⃣ REPLAY
  ======================================================== */
  if (replayVideo) {
    replayVideo.addEventListener("click", () => {
      videoContainer.style.display = "flex";
      videoContainer.style.opacity = "1";
      if (background) background.classList.remove("show");
      if (buttonsContainer) buttonsContainer.style.display = "none";
      questVideo.currentTime = 0;
      questVideo.play();
    });
  }

  /* ========================================================
        6️⃣ DIALOGUES PIRATES
  ======================================================== */
  let step = 0;
  const dialogues = [
    { who: "maitre", text: "Moussaillon ! Bienvenue sur le marché des trésors ! Ici, plein de pirates vendent des pierres précieuses… mais pour toi, qui débutes, faudra suivre mes conseils !", anchor: pirate5bis },
    { who: "apprenti", text: "J’suis prêt, capitaine !", anchor: pirate2bis },
    { who: "maitre", text: "Écoute bien ! D’abord, tu dois te mettre au niveau des autres pirates… parle comme eux, montre que tu connais tes pierres. Ensuite… sois plus malin et plus rapide qu’eux ! Faut que tous les clients viennent chez toi !", anchor: pirate5bis },
    { who: "apprenti", text: "Mais comment je fais ça ?", anchor: pirate2bis },
    { who: "maitre", text: "Regarde bien : la plupart ont une petite échoppe et vendent leurs pierres dans des petits sachets en velours. Les clients adorent ça ! Donc toi aussi, il te faudra une échoppe et des sachets. Mais attention… tes pierres ressemblent à celles des autres ! Faut que tu te démarques !", anchor: pirate5bis },
    { who: "apprenti", text: "Me démarquer… c’est-à-dire ?", anchor: pirate2bis },
    { who: "maitre", text: "Plusieurs stratégies, moussaillon :<br>• vendre moins cher<br>• boîtes en bois luxe<br>• grande boutique visible<br>• aller chez les clients", anchor: pirate5bis },
    { who: "apprenti", text: "Ahhh… donc je choisis la meilleure stratégie selon mes clients !", anchor: pirate2bis },
    { who: "maitre", text: "Exactement ! Observe, teste, et deviens le pirate que tout le monde veut rencontrer.", anchor: pirate5bis },
    { who: "apprenti", text: "MERCI capitaine !", anchor: pirate2bis }
  ];

  function createBubble(dialogue) {
    bubbleContainer.innerHTML = "";
    const rect = dialogue.anchor.getBoundingClientRect();
    const div = document.createElement("div");
    div.className = "bubble";

    const title = dialogue.who === "maitre" ? "Maître pirate" : "Apprenti pirate";
    div.innerHTML = `<div class="name">${title}</div><div>${dialogue.text}</div>`;

    if (step < dialogues.length - 1) {
      const btn = document.createElement("button");
      btn.textContent = "Suite";
      btn.onclick = nextBubble;
      div.appendChild(btn);
    }

    bubbleContainer.appendChild(div);

    // 📌 Position de la bulle
    const bubbleWidth = div.offsetWidth;
    const bubbleHeight = div.offsetHeight;
    let leftPos = rect.left + rect.width / 2 - bubbleWidth / 2;
    let topPos = rect.top - bubbleHeight - 20;
    if (leftPos < 10) leftPos = 10;
    if (leftPos + bubbleWidth > window.innerWidth - 10) leftPos = window.innerWidth - bubbleWidth - 10;
    if (topPos < 10) topPos = 10;
    div.style.left = leftPos + "px";
    div.style.top = topPos + "px";
  }

  function nextBubble() {
    step++;
    if (step < dialogues.length) {
      createBubble(dialogues[step]);
    } else {
      // dernière bulle
      bubbleContainer.innerHTML = `
        <div class="bubble">
          <p>Merci Capitaine ! Grâce à toi, la tante pirate a tout compris !</p>
        </div>
      `;

      // apparition progressive bouton mission
      setTimeout(() => {
        startMissionButton.style.display = "block";
        startMissionButton.style.transition = "opacity 0.5s";
        startMissionButton.style.opacity = 1;
      }, 600);
    }
  }

  function startPirateDialogues() {
    step = 0;
    createBubble(dialogues[0]);
  }

  // clic sur pirate5bis pour lancer dialogues
  pirate5bis.addEventListener("click", startPirateDialogues);

  /* ========================================================
        7️⃣ MINI JEU
  ======================================================== */

  // scénario du mini-jeu
  const stepsGame = [
    { text: "Étape 1 — Introduction : Comment avez-vous trouvé vos pierres précieuses ?", question: "Où les pirates ont-ils trouvé leurs pierres ?", answers: ["Dans un coffre dans une grotte secrète","Ils les ont achetées au marché","La tante les leur a données"], correct:0 },
    { text: "Étape 2 — Présentation de l’équipage", question: "Qui fait partie de l'équipage pirate ?", answers: ["Toi et les deux moussaillons","Juste le capitaine","Toute la famille pirate"], correct:0 },
    { text: "Étape 3 — Quel est votre projet ?", question: "Quel est le but du projet des pirates ?", answers: ["Construire un bateau","Partir en vacances","Garder les pierres pour décorer la cale"], correct:0 },
    { text: "Étape 4 — Étude du marché", question: "Qu’est-ce que les pirates doivent observer sur le marché ?", answers: ["Nos pierres","Les chapeaux des concurrents","La météo"], correct:0 },
    { text: "Étape 5 — Présentation des pierres", question: "Que doivent-ils décrire pour leurs pierres ?", answers: ["Caractéristiques, nombre, qualités et défauts","Seulement la couleur","Seulement la taille"], correct:0 },
    { text: "Étape 6 — Modèle économique", question: "À quoi sert le modèle économique ?", answers: ["Savoir combien de pierres vendre pour acheter le bateau","Savoir qui fait la vaisselle","Compter les mouettes"], correct:0 },
    { text: "Étape 7 — Stratégies commerciales", question: "Quelle stratégie les différencie des autres ?", answers: ["Vendre les pierres dans des boîtes en bois","Crier très fort au marché","Vendre sans dire le prix"], correct:0 },
    { text: "Étape 8 — Plan financier", question: "Qu’est-ce que le plan financier ?", answers: ["Un document qui prévoit les dépenses et les gains","Une carte au trésor","Une chanson de pirates"], correct:0 },
    { text: "Étape 9 — Statut juridique", question: "À quoi sert le statut juridique ?", answers: ["À dire comment l’activité pirate est organisée légalement","À choisir le nom du perroquet","À fabriquer des épées"], correct:0 }
  ];

  let currentGameStep = 0;

  function startMiniGame() {
    overlayBlur.style.display = "block";
    miniGameContainer.style.display = "block";
    introText.style.opacity = 0;
    setTimeout(() => {
      introText.style.transition = "opacity 0.5s";
      introText.style.opacity = 1;
    }, 200);

    showGameStep();
  }

  function showGameStep() {
    if (currentGameStep >= stepsGame.length) {
      // victoire
      miniGameContainer.style.display = "none";
      overlayBlur.style.display = "none";
      victoryScreen.style.display = "flex";
      return;
    }

    const step = stepsGame[currentGameStep];
    gameQuestion.textContent = step.question;
    gameAnswers.innerHTML = "";
    gameFeedback.textContent = "";

    step.answers.forEach((ans, i) => {
      const btn = document.createElement("button");
      btn.textContent = ans;
      btn.onclick = () => handleGameAnswer(i);
      gameAnswers.appendChild(btn);
    });
  }

  function handleGameAnswer(index) {
    const step = stepsGame[currentGameStep];
    if (index === step.correct) {
      gameFeedback.textContent = "Bonne réponse ! ✅";
      setTimeout(() => {
        currentGameStep++;
        showGameStep();
      }, 700);
    } else {
      gameFeedback.textContent = "Essaie encore ! ❌";
    }
  }

  // clic sur bouton commencer la mission
  startMissionButton.addEventListener("click", () => {
    startMissionButton.style.display = "none";
    startMiniGame();
  });

});
