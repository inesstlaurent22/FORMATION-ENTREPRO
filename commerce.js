document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     🎬 VIDÉO INTRO
  ===================================================== */

  const videoContainer = document.getElementById("videoContainer");
  const video = document.getElementById("questVideo");
  const toggleSound = document.getElementById("toggleSound");
  const closeVideo = document.getElementById("closeVideo");

  video.muted = true;

  toggleSound.addEventListener("click", () => {
    video.muted = !video.muted;
    toggleSound.textContent = video.muted ? "🔇" : "🔊";
  });

  closeVideo.addEventListener("click", (e) => {
    e.stopPropagation();
    endVideo();
  });

  video.addEventListener("ended", endVideo);

  function endVideo() {
    video.pause();
    videoContainer.style.opacity = 0;
    setTimeout(() => {
      videoContainer.style.display = "none";
      showBackgroundAndPirates();
    }, 1000);
  }

  /* =====================================================
     🌅 BACKGROUND + PIRATES
  ===================================================== */

  const background = document.getElementById("background");
  const pirate2bis = document.getElementById("pirate2bis");
  const pirate5bis = document.getElementById("pirate5bis");

  function showBackgroundAndPirates() {
    background.style.display = "block";
  }

  /* =====================================================
     💬 DIALOGUES (COMPLETS)
  ===================================================== */

  const bubbleContainer = document.getElementById("bubbleContainer");

  let dialogueStep = 0;

  const dialogues = [
    {
      who: "maitre",
      text: "Moussaillon ! Bienvenue sur le marché des trésors ! Ici, plein de pirates vendent des pierres précieuses… mais pour toi, qui débutes, faudra suivre mes conseils !",
      anchor: pirate5bis
    },
    {
      who: "apprenti",
      text: "J’suis prêt, capitaine !",
      anchor: pirate2bis
    },
    {
      who: "maitre",
      text: "Écoute bien ! D’abord, tu dois te mettre au niveau des autres pirates… parle comme eux, montre que tu connais tes pierres. Ensuite… sois plus malin et plus rapide qu’eux ! Faut que tous les clients viennent chez toi !",
      anchor: pirate5bis
    },
    {
      who: "apprenti",
      text: "Mais comment je fais ça ?",
      anchor: pirate2bis
    },
    {
      who: "maitre",
      text: "Regarde bien : la plupart ont une petite échoppe et vendent leurs pierres dans des petits sachets en velours. Les clients adorent ça ! Donc toi aussi, il te faudra une échoppe et des sachets. Mais attention… tes pierres ressemblent à celles des autres ! Faut que tu te démarques !",
      anchor: pirate5bis
    },
    {
      who: "apprenti",
      text: "Me démarquer… c’est-à-dire ?",
      anchor: pirate2bis
    },
    {
      who: "maitre",
      text: "Plusieurs stratégies, moussaillon :<br>• vendre moins cher<br>• vendre tes pierres dans des boîtes en bois plus luxueuses<br>• avoir une grande boutique visible<br>• aller directement chez les clients",
      anchor: pirate5bis
    },
    {
      who: "apprenti",
      text: "Ahhh… donc je choisis la meilleure stratégie selon mes clients !",
      anchor: pirate2bis
    },
    {
      who: "maitre",
      text: "Exactement ! Observe, teste, et deviens le pirate que tout le monde veut rencontrer.",
      anchor: pirate5bis
    },
    {
      who: "apprenti",
      text: "MERCI capitaine !",
      anchor: pirate2bis
    }
  ];

  function createBubble(dialogue) {
    bubbleContainer.innerHTML = "";

    const bubble = document.createElement("div");
    bubble.className = "dialogue-bubble";

    const name =
      dialogue.who === "maitre"
        ? "Maître pirate"
        : "Apprenti pirate";

    bubble.innerHTML = `<strong>${name}</strong><br>${dialogue.text}`;

    const btn = document.createElement("button");
    btn.textContent =
      dialogueStep < dialogues.length - 1
        ? "Suite"
        : "OK, j’ai compris";

    btn.addEventListener("click", nextDialogue);
    bubble.appendChild(btn);

    bubbleContainer.appendChild(bubble);

    const rect = dialogue.anchor.getBoundingClientRect();
    bubble.style.left = rect.left + "px";
    bubble.style.top =
      rect.top - bubble.offsetHeight - 20 + "px";
  }

  function nextDialogue() {
    dialogueStep++;
    if (dialogueStep < dialogues.length) {
      createBubble(dialogues[dialogueStep]);
    } else {
      bubbleContainer.innerHTML = "";
      launchMiniGame();
    }
  }

  pirate5bis.addEventListener("click", () => {
    dialogueStep = 0;
    createBubble(dialogues[0]);
  });

  /* =====================================================
     🌑 FADE → MINI JEU
  ===================================================== */

  const fadeScreen = document.getElementById("fadeScreen");

  function launchMiniGame() {
    fadeScreen.style.display = "flex";
    setTimeout(() => {
      fadeScreen.style.display = "none";
      startMiniGame();
    }, 1800);
  }

  /* =====================================================
     🎮 MINI JEU QCM (SIMPLE + MULTIPLE)
  ===================================================== */

  const miniGameContainer = document.getElementById("miniGameContainer");
  const gameQuestion = document.getElementById("gameQuestion");
  const gameAnswers = document.getElementById("gameAnswers");
  const gameFeedback = document.getElementById("gameFeedback");

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
      correct: [0, 1]
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
  let selectedAnswers = [];

  function startMiniGame() {
    miniGameContainer.style.display = "flex";
    step = 0;
    showStep();
  }

  function showStep() {
    if (step >= questions.length) {
      miniGameContainer.style.display = "none";
      showReward(); // fonction déjà prévue pour la suite
      return;
    }

    const q = questions[step];
    gameQuestion.innerHTML = q.q;
    gameAnswers.innerHTML = "";
    gameFeedback.textContent = "";
    selectedAnswers = [];

    const isMultiple = Array.isArray(q.correct);

    q.answers.forEach((ans, i) => {
      const btn = document.createElement("button");
      btn.textContent = ans;

      btn.addEventListener("click", () => {
        if (!isMultiple) {
          checkSingle(i);
        } else {
          btn.classList.toggle("selected");
          if (selectedAnswers.includes(i)) {
            selectedAnswers = selectedAnswers.filter(x => x !== i);
          } else {
            selectedAnswers.push(i);
          }
        }
      });

      gameAnswers.appendChild(btn);
    });

    if (isMultiple) {
      const validate = document.createElement("button");
      validate.textContent = "Valider";
      validate.addEventListener("click", checkMultiple);
      gameAnswers.appendChild(validate);
    }
  }

  function checkSingle(i) {
    if (i === questions[step].correct) {
      gameFeedback.textContent = "✅ Bonne réponse !";
      step++;
      setTimeout(showStep, 700);
    } else {
      gameFeedback.textContent = "❌ Essaie encore";
    }
  }

  function checkMultiple() {
    const correct = [...questions[step].correct].sort();
    const user = [...selectedAnswers].sort();

    const ok =
      correct.length === user.length &&
      correct.every((v, i) => v === user[i]);

    if (ok) {
      gameFeedback.textContent = "✅ Excellent !";
      step++;
      setTimeout(showStep, 700);
    } else {
      gameFeedback.textContent =
        "❌ Toutes les bonnes réponses ne sont pas cochées";
    }
  }

  document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     🎬 VIDÉO INTRO
  ===================================================== */

  const videoContainer = document.getElementById("videoContainer");
  const video = document.getElementById("questVideo");
  const toggleSound = document.getElementById("toggleSound");
  const closeVideo = document.getElementById("closeVideo");

  video.muted = true;

  toggleSound.addEventListener("click", () => {
    video.muted = !video.muted;
    toggleSound.textContent = video.muted ? "🔇" : "🔊";
  });

  closeVideo.addEventListener("click", (e) => {
    e.stopPropagation();
    endVideo();
  });

  video.addEventListener("ended", endVideo);

  function endVideo() {
    video.pause();
    videoContainer.style.opacity = 0;
    setTimeout(() => {
      videoContainer.style.display = "none";
      showBackgroundAndPirates();
    }, 1000);
  }

  /* =====================================================
     🌅 BACKGROUND + PIRATES
  ===================================================== */

  const background = document.getElementById("background");
  const pirate2bis = document.getElementById("pirate2bis");
  const pirate5bis = document.getElementById("pirate5bis");

  function showBackgroundAndPirates() {
    background.style.display = "block";
  }

  /* =====================================================
     💬 DIALOGUES (COMPLETS)
  ===================================================== */

  const bubbleContainer = document.getElementById("bubbleContainer");

  let dialogueStep = 0;

  const dialogues = [
    {
      who: "maitre",
      text: "Moussaillon ! Bienvenue sur le marché des trésors ! Ici, plein de pirates vendent des pierres précieuses… mais pour toi, qui débutes, faudra suivre mes conseils !",
      anchor: pirate5bis
    },
    {
      who: "apprenti",
      text: "J’suis prêt, capitaine !",
      anchor: pirate2bis
    },
    {
      who: "maitre",
      text: "Écoute bien ! D’abord, tu dois te mettre au niveau des autres pirates… parle comme eux, montre que tu connais tes pierres. Ensuite… sois plus malin et plus rapide qu’eux ! Faut que tous les clients viennent chez toi !",
      anchor: pirate5bis
    },
    {
      who: "apprenti",
      text: "Mais comment je fais ça ?",
      anchor: pirate2bis
    },
    {
      who: "maitre",
      text: "Regarde bien : la plupart ont une petite échoppe et vendent leurs pierres dans des petits sachets en velours. Les clients adorent ça ! Donc toi aussi, il te faudra une échoppe et des sachets. Mais attention… tes pierres ressemblent à celles des autres ! Faut que tu te démarques !",
      anchor: pirate5bis
    },
    {
      who: "apprenti",
      text: "Me démarquer… c’est-à-dire ?",
      anchor: pirate2bis
    },
    {
      who: "maitre",
      text: "Plusieurs stratégies, moussaillon :<br>• vendre moins cher<br>• vendre tes pierres dans des boîtes en bois plus luxueuses<br>• avoir une grande boutique visible<br>• aller directement chez les clients",
      anchor: pirate5bis
    },
    {
      who: "apprenti",
      text: "Ahhh… donc je choisis la meilleure stratégie selon mes clients !",
      anchor: pirate2bis
    },
    {
      who: "maitre",
      text: "Exactement ! Observe, teste, et deviens le pirate que tout le monde veut rencontrer.",
      anchor: pirate5bis
    },
    {
      who: "apprenti",
      text: "MERCI capitaine !",
      anchor: pirate2bis
    }
  ];

  function createBubble(dialogue) {
    bubbleContainer.innerHTML = "";

    const bubble = document.createElement("div");
    bubble.className = "dialogue-bubble";

    const name =
      dialogue.who === "maitre"
        ? "Maître pirate"
        : "Apprenti pirate";

    bubble.innerHTML = `<strong>${name}</strong><br>${dialogue.text}`;

    const btn = document.createElement("button");
    btn.textContent =
      dialogueStep < dialogues.length - 1
        ? "Suite"
        : "OK, j’ai compris";

    btn.addEventListener("click", nextDialogue);
    bubble.appendChild(btn);

    bubbleContainer.appendChild(bubble);

    const rect = dialogue.anchor.getBoundingClientRect();
    bubble.style.left = rect.left + "px";
    bubble.style.top =
      rect.top - bubble.offsetHeight - 20 + "px";
  }

  function nextDialogue() {
    dialogueStep++;
    if (dialogueStep < dialogues.length) {
      createBubble(dialogues[dialogueStep]);
    } else {
      bubbleContainer.innerHTML = "";
      launchMiniGame();
    }
  }

  pirate5bis.addEventListener("click", () => {
    dialogueStep = 0;
    createBubble(dialogues[0]);
  });

  /* =====================================================
     🌑 FADE → MINI JEU
  ===================================================== */

  const fadeScreen = document.getElementById("fadeScreen");

  function launchMiniGame() {
    fadeScreen.style.display = "flex";
    setTimeout(() => {
      fadeScreen.style.display = "none";
      startMiniGame();
    }, 1800);
  }

  /* =====================================================
     🎮 MINI JEU QCM (SIMPLE + MULTIPLE)
  ===================================================== */

  const miniGameContainer = document.getElementById("miniGameContainer");
  const gameQuestion = document.getElementById("gameQuestion");
  const gameAnswers = document.getElementById("gameAnswers");
  const gameFeedback = document.getElementById("gameFeedback");

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
      correct: [0, 1]
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
  let selectedAnswers = [];

  function startMiniGame() {
    miniGameContainer.style.display = "flex";
    step = 0;
    showStep();
  }

  function showStep() {
    if (step >= questions.length) {
      miniGameContainer.style.display = "none";
      showReward(); // fonction déjà prévue pour la suite
      return;
    }

    const q = questions[step];
    gameQuestion.innerHTML = q.q;
    gameAnswers.innerHTML = "";
    gameFeedback.textContent = "";
    selectedAnswers = [];

    const isMultiple = Array.isArray(q.correct);

    q.answers.forEach((ans, i) => {
      const btn = document.createElement("button");
      btn.textContent = ans;

      btn.addEventListener("click", () => {
        if (!isMultiple) {
          checkSingle(i);
        } else {
          btn.classList.toggle("selected");
          if (selectedAnswers.includes(i)) {
            selectedAnswers = selectedAnswers.filter(x => x !== i);
          } else {
            selectedAnswers.push(i);
          }
        }
      });

      gameAnswers.appendChild(btn);
    });

    if (isMultiple) {
      const validate = document.createElement("button");
      validate.textContent = "Valider";
      validate.addEventListener("click", checkMultiple);
      gameAnswers.appendChild(validate);
    }
  }

  function checkSingle(i) {
    if (i === questions[step].correct) {
      gameFeedback.textContent = "✅ Bonne réponse !";
      step++;
      setTimeout(showStep, 700);
    } else {
      gameFeedback.textContent = "❌ Essaie encore";
    }
  }

  function checkMultiple() {
    const correct = [...questions[step].correct].sort();
    const user = [...selectedAnswers].sort();

    const ok =
      correct.length === user.length &&
      correct.every((v, i) => v === user[i]);

    if (ok) {
      gameFeedback.textContent = "✅ Excellent !";
      step++;
      setTimeout(showStep, 700);
    } else {
      gameFeedback.textContent =
        "❌ Toutes les bonnes réponses ne sont pas cochées";
    }
  }

  /* =====================================================
     🏆 PLACEHOLDER RÉCOMPENSE
     (déjà branchée dans ton projet)
  ===================================================== */

  function showReward() {
    console.log("Mini-jeu réussi → récompense + livre");
  }

});
