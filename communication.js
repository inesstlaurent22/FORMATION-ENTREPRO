document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     🎬 VIDEO INTRO
  ===================================================== */
  const videoIntro  = document.getElementById("videoIntro");
  const introVideo  = document.getElementById("introVideo");
  const toggleSound = document.getElementById("toggleSound");
  const closeVideo  = document.getElementById("closeVideo");

  const loader      = document.getElementById("loader");
  const loaderText  = document.getElementById("loaderText");

  const scene       = document.getElementById("scene");
  const pirate2     = document.getElementById("pirate2");
  const pirate3     = document.getElementById("pirate3");

  const dialogBox   = document.getElementById("dialogBox");
  const dialogText  = document.getElementById("dialogText");
  const nextDialog  = document.getElementById("nextDialog");

  const miniGame    = document.getElementById("miniGameContainer");

  /* =====================================================
     🎬 VIDEO (AUTOPLAY SAFE iOS)
  ===================================================== */
  introVideo.muted = true;
  introVideo.play().catch(() => {});

  toggleSound.addEventListener("click", () => {
    introVideo.muted = !introVideo.muted;
  });

  closeVideo.addEventListener("click", endVideo);
  introVideo.addEventListener("ended", endVideo);

  function endVideo(){
    videoIntro.classList.add("hidden");

    loaderText.textContent = "Chargement…";
    loader.classList.remove("hidden");

    setTimeout(() => {
      loader.classList.add("hidden");
      scene.classList.remove("hidden");
    }, 1500);
  }

  /* =====================================================
     💬 SYSTÈME DE DIALOGUES AVEC POSITION DYNAMIQUE
  ===================================================== */
  let dialogs = [];
  let dialogIndex = 0;
  let dialogCallback = null;

  function playDialog(list, callback){
    dialogs = list;
    dialogIndex = 0;
    dialogCallback = callback;

    dialogBox.classList.remove("hidden");
    showDialogLine();
  }

  function showDialogLine(){
    const current = dialogs[dialogIndex];

    dialogText.textContent = current.text;
    positionDialogAbove(current.speaker);
  }

  nextDialog.onclick = () => {
    dialogIndex++;
    if(dialogIndex < dialogs.length){
      showDialogLine();
    }else{
      dialogBox.classList.add("hidden");
      if(dialogCallback) dialogCallback();
    }
  };

  function positionDialogAbove(speaker){
    let target;

    if(speaker === "pirate2") target = pirate2;
    if(speaker === "pirate3") target = pirate3;
    if(!target) return;

    const rect = target.getBoundingClientRect();

    const bubbleWidth = dialogBox.offsetWidth;
    const left = rect.left + rect.width / 2 - bubbleWidth / 2;
    const top  = rect.top - dialogBox.offsetHeight - 20;

    dialogBox.style.left = `${left}px`;
    dialogBox.style.top  = `${top}px`;
  }

  /* =====================================================
     🏴‍☠️ CLICK PIRATE 3 → LANCE LE JEU
  ===================================================== */
  pirate3.addEventListener("click", () => {
    playDialog([
      {
        speaker: "pirate3",
        text: "Capitaine, ton trésor est prêt… mais le marché ne te connaît pas."
      },
      {
        speaker: "pirate2",
        text: "Sans communication, personne ne viendra acheter."
      },
      {
        speaker: "pirate3",
        text: "Apprenons à faire parler de ta marque."
      }
    ], startMiniGame1);
  });

  /* =====================================================
     🎮 MINI-JEU 1 – QUIZ PÉDAGOGIQUE
  ===================================================== */

  const quizSteps = [
    {
      title: "📣 Réseaux sociaux",
      question: "Les réseaux sociaux servent principalement à :",
      answers: [
        { text: "Te faire découvrir", correct: true },
        { text: "Montrer ton univers", correct: true },
        { text: "Forcer la vente immédiate", correct: false }
      ],
      explanation:
        "Les réseaux sociaux servent à créer de la visibilité et donner envie de découvrir ta marque."
    },
    {
      title: "📜 Newsletter",
      question: "Une newsletter permet de :",
      answers: [
        { text: "Rester présent dans l’esprit du client", correct: true },
        { text: "Créer un lien dans le temps", correct: true },
        { text: "Envoyer des promotions tous les jours", correct: false }
      ],
      explanation:
        "La newsletter entretient la relation sans pression commerciale."
    },
    {
      title: "🕊️ Phoning / Mailing",
      question: "Le contact direct permet de :",
      answers: [
        { text: "Comprendre les besoins", correct: true },
        { text: "Créer une relation humaine", correct: true },
        { text: "Parler uniquement de prix", correct: false }
      ],
      explanation:
        "Le contact direct bien utilisé crée de la confiance."
    },
    {
      title: "⚓ Visite physique",
      question: "Rencontrer un client en vrai permet de :",
      answers: [
        { text: "Rassurer et écouter", correct: true },
        { text: "Créer une vraie connexion", correct: true },
        { text: "Ignorer ses attentes", correct: false }
      ],
      explanation:
        "La présence physique renforce fortement la crédibilité."
    }
  ];

  let quizIndex = -2;
  let selectedAnswers = [];

  function startMiniGame1(){
    quizIndex = -2;
    renderQuiz();
    miniGame.classList.remove("hidden");
  }

  function renderQuiz(){

    if(quizIndex === -2){
      miniGame.innerHTML = `
        <h2 class="quizTitle">🏴‍☠️ Mission : Communication</h2>
        <div class="quizSeparator"></div>
        <p>
          Capitaine, pour vendre ton trésor,
          le marché doit <strong>te connaître</strong>
          et <strong>te faire confiance</strong>.
        </p>
        <button id="continueQuestBtn" onclick="nextQuiz()">Commencer</button>
      `;
      return;
    }

    if(quizIndex === -1){
      miniGame.innerHTML = `
        <h2 class="quizTitle">🎯 Objectif</h2>
        <div class="quizSeparator"></div>
        <p>
          Découvre comment chaque forme de communication
          aide ta marque à gagner en visibilité et crédibilité.
        </p>
        <button id="continueQuestBtn" onclick="nextQuiz()">Continuer</button>
      `;
      return;
    }

    if(quizIndex >= quizSteps.length){
      miniGame.innerHTML = `
        <h2 class="quizTitle">🎉 Mission réussie</h2>
        <div class="quizSeparator"></div>
        <p>
          Tu l’as compris : une bonne communication
          utilise <strong>plusieurs canaux</strong>.
        </p>
        <button id="continueQuestBtn" onclick="endMiniGame1()">Continuer</button>
      `;
      return;
    }

    selectedAnswers = [];
    const step = quizSteps[quizIndex];

    miniGame.innerHTML = `
      <h2 class="quizTitle">${step.title}</h2>
      <div class="quizSeparator"></div>
      <p id="gameQuestion">${step.question}</p>

      <div id="gameAnswers">
        ${step.answers.map(
          (a, i) =>
            `<button onclick="selectAnswer(${i}, event)">${a.text}</button>`
        ).join("")}
      </div>

      <div id="gameFeedback"></div>

      <button id="continueQuestBtn" class="hidden" onclick="nextQuiz()">
        Continuer
      </button>
    `;
  }

  /* =====================================================
     ✅ VALIDATION MULTI-RÉPONSES
  ===================================================== */
  window.selectAnswer = function(index, event){
    if(!selectedAnswers.includes(index)){
      selectedAnswers.push(index);
      event.target.classList.add("selected");
    }

    const step = quizSteps[quizIndex];
    const correctIndexes = step.answers
      .map((a, i) => a.correct ? i : null)
      .filter(i => i !== null);

    const allCorrect =
      correctIndexes.every(i => selectedAnswers.includes(i)) &&
      selectedAnswers.every(i => step.answers[i].correct);

    if(allCorrect){
      document.getElementById("gameFeedback").innerText = step.explanation;
      document.getElementById("continueQuestBtn").classList.remove("hidden");
    }
  };

  /* =====================================================
     🔁 NAVIGATION QUIZ
  ===================================================== */
  window.nextQuiz = function(){
    quizIndex++;
    renderQuiz();
  };

  function endMiniGame1(){
    miniGame.classList.add("hidden");

    playDialog([
      {
        speaker: "pirate2",
        text: "Le marché commence à te reconnaître."
      },
      {
        speaker: "pirate3",
        text: "Ta communication est maintenant claire."
      }
    ], () => {
      // prêt pour mini-jeu 2
    });
  }

});
