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
     💬 SYSTÈME DE DIALOGUES
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
    } else {
      dialogBox.classList.add("hidden");
      if(dialogCallback) dialogCallback();
    }
  };

  function positionDialogAbove(speaker){
    let target = speaker === "pirate2" ? pirate2 : pirate3;
    if(!target) return;

    const rect = target.getBoundingClientRect();
    dialogBox.style.left =
      `${rect.left + rect.width / 2 - dialogBox.offsetWidth / 2}px`;
    dialogBox.style.top =
      `${rect.top - dialogBox.offsetHeight - 20}px`;
  }

  /* =====================================================
     🏴‍☠️ DIALOGUES → MINI-JEU 1
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
     🎮 MINI-JEU 1 – COMMUNICATION
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
        <button onclick="nextQuiz()">Commencer</button>
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
        <button onclick="nextQuiz()">Continuer</button>
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
        <button onclick="endMiniGame1()">Continuer</button>
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
        ${step.answers
          .sort(() => Math.random() - 0.5)
          .map(
            (a, i) =>
              `<button onclick="selectAnswer(${i}, event)">${a.text}</button>`
          ).join("")}
      </div>

      <div id="gameFeedback"></div>

      <button id="continueBtn" class="hidden" onclick="nextQuiz()">
        Continuer
      </button>
    `;
  }

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
      document.getElementById("gameFeedback").innerText =
        "✅ Bonne réponse ! " + step.explanation;
      document.getElementById("continueBtn").classList.remove("hidden");
    }
  };

  window.nextQuiz = function(){
    quizIndex++;
    renderQuiz();
  };

  function endMiniGame1(){
    miniGame.classList.add("hidden");
    startClientsLoader();
  }

  /* =====================================================
     ⏳ LOADER CLIENTS
  ===================================================== */
  function startClientsLoader(){
    loaderText.innerHTML = `
      Bravo, <strong>2 clients</strong> sont entrés dans la boutique<br><br>
      <div class="progressBar"><div class="progressFill"></div></div>
      <div class="progressCount">0 / 10</div>
    `;
    loader.classList.remove("hidden");

    let v = 0;
    const fill = loader.querySelector(".progressFill");
    const count = loader.querySelector(".progressCount");

    const interval = setInterval(() => {
      v++;
      fill.style.width = `${v * 10}%`;
      count.textContent = `${v} / 10`;
      if(v >= 10){
        clearInterval(interval);
        loader.classList.add("hidden");
        startFlyerDialogues();
      }
    }, 200);
  }

  /* =====================================================
     💬 DIALOGUES FLYER
  ===================================================== */
  function startFlyerDialogues(){
    playDialog([
      { speaker: "pirate2", text: "Dis, tu trouves mon flyer correct ?" },
      { speaker: "pirate3", text: "Voyons ça ensemble." }
    ], showFlyer);
  }

  function showFlyer(){
    const flyer = document.createElement("img");
    flyer.src = "images/flyer.png";
    flyer.id = "flyerCenter";
    document.body.appendChild(flyer);

    flyer.onclick = () => {
      flyer.remove();
      playDialog([
        { speaker: "pirate3", text: "Il manque le logo et il y a trop de couleurs." },
        { speaker: "pirate2", text: "Que devons-nous modifier ?" },
        { speaker: "pirate3", text: "Nous allons créer une identité visuelle." },
        { speaker: "pirate3", text: "Un logo, des couleurs et une typographie cohérentes." },
        { speaker: "pirate2", text: "Pourquoi est-ce si important ?" },
        { speaker: "pirate3", text: "Ainsi, les clients te reconnaîtront immédiatement." }
      ], startMiniGame2);
    };
  }

  /* =====================================================
     🎨 MINI-JEU 2 – IDENTITÉ VISUELLE
  ===================================================== */
  function startMiniGame2(){
    miniGame.classList.remove("hidden");
    miniGame.innerHTML = `
      <h2>🎨 Identité visuelle</h2>
      <p>
        1️⃣ L’identité visuelle permet de reconnaître une marque au premier coup d’œil.<br><br>
        2️⃣ Elle est composée du logo, des couleurs, des écritures et du style graphique.<br><br>
        👉 Choisis les bons éléments pour créer ton identité.
      </p>
      <button onclick="startVisualRound1()">Commencer</button>
    `;
  }

  function startVisualRound1(){
    miniGame.innerHTML = `
      <h3>Choisis ton logo (choix libre)</h3>
      <div class="choices">
        <button onclick="startVisualRound2()">Logo A</button>
        <button onclick="startVisualRound2()">Logo B</button>
        <button onclick="startVisualRound2()">Logo C</button>
      </div>
    `;
  }

  function startVisualRound2(){
    miniGame.innerHTML = `
      <h3>Choisis les bonnes couleurs</h3>
      <div class="choices">
        <button onclick="startVisualRound3()">Noir & Or</button>
        <button>Rose & Vert</button>
        <button>Bleu & Rouge</button>
      </div>
    `;
  }

  function startVisualRound3(){
    miniGame.innerHTML = `
      <h3>Choisis la bonne typographie</h3>
      <div class="choices">
        <button onclick="endVisual()">Typographie élégante</button>
        <button>Typographie fun</button>
        <button>Typographie futuriste</button>
      </div>
    `;
  }

  function endVisual(){
    miniGame.innerHTML = `
      <h2>🎉 Identité visuelle créée !</h2>
      <p>
        Grâce à ton logo, tes couleurs et ton écriture,
        les clients reconnaîtront ta marque au premier coup d’œil.
      </p>
    `;
  }

});
