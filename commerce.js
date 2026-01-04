document.addEventListener("DOMContentLoaded", () => {

  /* ========================================================
        ÉLÉMENTS DOM
  ======================================================== */
  const videoContainer = document.getElementById("videoContainer");
  const questVideo = document.getElementById("questVideo");
  const toggleSound = document.getElementById("toggleSound");
  const closeVideo = document.getElementById("closeVideo");

  const background = document.getElementById("background");
  const pirate2bis = document.getElementById("pirate2bis");
  const pirate5bis = document.getElementById("pirate5bis");
  const bubbleContainer = document.getElementById("bubbleContainer");

  const buttonsContainer = document.getElementById("buttonsContainer");
  const replayVideo = document.getElementById("replayVideo");
  const finishQuest = document.getElementById("finishQuest");

  const startMissionButton = document.getElementById("startMissionButton");
  const overlayBlur = document.getElementById("overlayBlur");
  const miniGameContainer = document.getElementById("miniGameContainer");
  const victoryScreen = document.getElementById("victoryScreen");

  const gameQuestion = document.getElementById("gameQuestion");
  const gameAnswers = document.getElementById("gameAnswers");
  const gameFeedback = document.getElementById("gameFeedback");

  /* ========================================================
        ÉTAT INITIAL
  ======================================================== */
  questVideo.muted = true;
  questVideo.setAttribute("playsinline", "");
  questVideo.setAttribute("webkit-playsinline", "");
  questVideo.loop = false;

  videoContainer.style.display = "flex";
  videoContainer.style.opacity = "1";

  background.classList.remove("show");
  buttonsContainer.style.display = "none";
  pirate2bis.style.display = "none";
  pirate5bis.style.display = "none";
  startMissionButton.style.opacity = 0;
  miniGameContainer.style.display = "none";
  overlayBlur.style.display = "none";
  victoryScreen.style.display = "none";

  /* ========================================================
        VIDEO AUTO-PLAY
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
    questVideo.play().catch(() => createLaunchButton());
  }

  setTimeout(tryPlayVideo, 200);

  /* ========================================================
        FIN VIDEO → FOND + PIRATES
  ======================================================== */
  function showScene() {
    videoContainer.style.transition = "opacity 0.8s";
    videoContainer.style.opacity = 0;

    setTimeout(() => {
      videoContainer.style.display = "none";
      background.classList.add("show");
      pirate2bis.style.display = "flex";
      pirate5bis.style.display = "flex";
      buttonsContainer.style.display = "flex";
      replayVideo.style.display = "flex";
      finishQuest.style.display = "flex";
    }, 800);
  }

  questVideo.addEventListener("ended", showScene);

  if (closeVideo) {
    closeVideo.addEventListener("click", () => {
      questVideo.pause();
      questVideo.dispatchEvent(new Event('ended'));
    });
  }

  if (toggleSound) {
    toggleSound.addEventListener("click", () => {
      questVideo.muted = !questVideo.muted;
      toggleSound.textContent = questVideo.muted ? "🔇" : "🔊";
    });
  }

  if (replayVideo) {
    replayVideo.addEventListener("click", () => {
      videoContainer.style.display = "flex";
      videoContainer.style.opacity = "1";
      background.classList.remove("show");
      buttonsContainer.style.display = "none";
      questVideo.currentTime = 0;
      questVideo.play();
    });
  }

  /* ========================================================
        BULLES DE TEXTE DES PIRATES
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
      bubbleContainer.innerHTML = `
        <div class="bubble">
          <p>Merci Capitaine ! Grâce à toi, la tante pirate a tout compris !</p>
        </div>
      `;
      // AFFICHER LE BOUTON COMMENCER MINI-JEU APRES LA DERNIERE BULLE
      setTimeout(() => {
        startMissionButton.style.opacity = 1;
        startMissionButton.classList.add("show");
      }, 600);
    }
  }

  function startPirateDialogues() {
    step = 0;
    createBubble(dialogues[0]);
  }

  pirate5bis.addEventListener("click", startPirateDialogues);

  /* ========================================================
        MINI JEU
  ======================================================== */
  const questions = [
  {
    q: "Où les pirates ont-ils trouvé leurs pierres ?",
    answers: [
      "Dans un coffre dans une grotte secrète",
      "Ils les ont achetées au marché",
      "La tante les leur a données"
    ],
    correct: 0
  },

  {
    q: "Qui fait partie de l'équipage pirate ?",
    answers: [
      "Juste le capitaine",
      "Toute la famille pirate",
      "Toi et les deux moussaillons"
    ],
    correct: 2
  },

  {
    q: "Quel est le but du projet des pirates ?",
    answers: [
      "Construire un bateau",
      "Partir en vacances",
      "Garder les pierres pour décorer la cale"
    ],
    correct: 0
  },

  {
    q: "Qu’est-ce que les pirates doivent observer sur le marché ?",
    answers: [
      "Les pierres",
      "Les concurrents",
      "La météo"
    ],
    correct: [0, 1]
  },

  {
    q: "Que doivent-ils décrire pour leurs pierres ?",
    answers: [
      "Le nombre",
      "Les qualités et défauts des pierres",
      "Seulement la couleur",
      "Seulement la taille"
    ],
    correct: [0, 1]   // ✅ bonnes réponses : 0 et 1
  },

  {
    q: "À quoi sert le modèle économique ?",
    answers: [
      "Savoir combien de pierres vendre pour acheter le bateau",
      "Savoir qui fait la vaisselle",
      "Compter les mouettes"
    ],
    correct: [0, 1]
  },

  {
    q: "Quelle stratégie les différencie des autres ?",
    answers: [
      "Vendre les pierres dans des boîtes en bois",
      "Proposer une livraison directement chez le client",
      "Vendre sans dire le prix"
    ],
    correct: 0
  },

  {
    q: "Qu’est-ce que le plan financier ?",
    answers: [
      "Un document qui prévoit les dépenses et les gains",
      "Une carte au trésor",
      "Une chanson de pirates"
    ],
    correct: 0
  },

  {
    q: "À quoi sert le statut juridique ?",
    answers: [
      "À dire comment l’activité pirate est organisée légalement",
      "À choisir le nom du perroquet",
      "À fabriquer des épées"
    ],
    correct: 0
  }
];

let step = 0;

  let currentStep = 0;

  function showStep() {
    if (currentStep < steps.length) {
      const step = steps[currentStep];
      gameQuestion.textContent = step.question;
      gameAnswers.innerHTML = "";
      gameFeedback.textContent = "";
      step.answers.forEach((ans, i) => {
        const btn = document.createElement("button");
        btn.textContent = ans;
        btn.addEventListener("click", () => handleAnswer(i));
        gameAnswers.appendChild(btn);
      });
    } else {
      // FIN MINI-JEU → écran victoire
      miniGameContainer.style.opacity = 0;
      setTimeout(() => {
        miniGameContainer.style.display = "none";
        overlayBlur.style.opacity = 0;
        overlayBlur.style.display = "none";
        victoryScreen.style.display = "flex";
      }, 500);
    }
  }

  function handleAnswer(index) {
    const stepObj = steps[currentStep];
    if (index === stepObj.correct) {
      gameFeedback.textContent = "✅ Bonne réponse !";
      setTimeout(() => {
        currentStep++;
        showStep();
      }, 700);
    } else {
      gameFeedback.textContent = "❌ Essaie encore !";
    }
  }

  startMissionButton.addEventListener("click", () => {
    startMissionButton.classList.remove("show");
    overlayBlur.style.display = "block";
    overlayBlur.style.opacity = 1;
    miniGameContainer.style.display = "flex";
    miniGameContainer.style.opacity = 1;
    currentStep = 0;
    showStep();
  });

  /* ============================
     ✨ LOADER BUSINESS PLAN + LIVRE
  ============================ */
  const book = document.querySelector(".book");

  function showBusinessPlanLoader(){
    const div = document.createElement("div");
    div.id = "businessPlanLoaderRuntime";
    div.innerHTML = "✨ Tu as créé ton premier business plan ✨";
    div.style.position="fixed";
    div.style.top="50%";
    div.style.left="50%";
    div.style.transform="translate(-50%,-50%)";
    div.style.fontSize="2em";
    div.style.color="gold";
    div.style.opacity=0;
    div.style.transition="opacity .5s ease";
    document.body.appendChild(div);

    setTimeout(()=> div.style.opacity = 1, 50);

    setTimeout(()=>{
      div.style.opacity = 0;
      setTimeout(()=>{
        div.remove();
        showBook();
      }, 600);
    }, 2200);
  }

  function showBook(){
    book.style.display="flex";
    book.style.opacity=0;
    setTimeout(()=> book.style.opacity = 1, 200);
  }

});
