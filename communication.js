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

  const miniGame    = document.getElementById("miniGameContainer");

  /* =====================================================
     🎬 VIDEO (iOS SAFE)
  ===================================================== */
  introVideo.muted = true;
  introVideo.play().catch(() => {});

  toggleSound.addEventListener("click", () => {
    introVideo.muted = !introVideo.muted;
    introVideo.play().catch(() => {});
    toggleSound.textContent = introVideo.muted ? "🔊" : "🔈";
  });

  function endVideo(){
    videoIntro.classList.add("hidden");
    loader.classList.remove("hidden");
    loaderText.textContent = "Chargement…";

    setTimeout(() => {
      loader.classList.add("hidden");
      scene.classList.remove("hidden");
    }, 1500);
  }

  closeVideo.addEventListener("click", endVideo);
  introVideo.addEventListener("ended", endVideo);

  /* =====================================================
     💬 DIALOGUES IMMERSIFS (clic sur la bulle)
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

    const target = current.speaker === "pirate2" ? pirate2 : pirate3;
    const rect = target.getBoundingClientRect();

    dialogBox.style.left =
      `${rect.left + rect.width / 2 - dialogBox.offsetWidth / 2}px`;
    dialogBox.style.top =
      `${rect.top - dialogBox.offsetHeight - 20}px`;
  }

  dialogBox.addEventListener("click", () => {
    dialogIndex++;
    if(dialogIndex < dialogs.length){
      showDialogLine();
    } else {
      dialogBox.classList.add("hidden");
      if(dialogCallback) dialogCallback();
    }
  });

  pirate3.addEventListener("click", () => {
    playDialog([
      { speaker:"pirate3", text:"Capitaine, ton trésor est prêt…" },
      { speaker:"pirate2", text:"Mais sans communication, personne ne viendra." },
      { speaker:"pirate3", text:"Commençons par attirer les clients." }
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
        { text:"Te faire découvrir", correct:true },
        { text:"Montrer ton univers", correct:true },
        { text:"Forcer la vente immédiate", correct:false }
      ],
      explanation:
        "Les réseaux sociaux servent à créer de la visibilité et donner envie de découvrir ta marque."
    }
  ];

  let quizIndex = -2;
  let selectedAnswers = [];

  function startMiniGame1(){
    miniGame.classList.remove("hidden");
    quizIndex = -2;
    renderQuiz();
  }

  function renderQuiz(){
    miniGame.innerHTML = "";

    if(quizIndex === -2){
      addText("🏴‍☠️ Mission : Communication");
      addText("Pour vendre ton trésor, le marché doit te connaître.");
      addButton("Commencer", nextQuiz);
      return;
    }

    if(quizIndex === -1){
      addText("🎯 Objectif");
      addText("Comprendre comment attirer les clients.");
      addText("💡 Une bonne communication crée confiance et intérêt.", true);
      addButton("Continuer", nextQuiz);
      return;
    }

    if(quizIndex >= quizSteps.length){
      miniGame.classList.add("hidden");
      startClientsGauge();
      return;
    }

    selectedAnswers = [];
    const step = quizSteps[quizIndex];
    const goodCount = step.answers.filter(a => a.correct).length;

    addText(step.title);
    addText(step.question);
    addHTML(`<div class="correctCount">${goodCount} bonnes réponses</div>`);

    step.answers.forEach((a, i) => {
      addButton(a.text, () => selectAnswer(i));
    });
  }

  function selectAnswer(index){
    if(selectedAnswers.includes(index)) return;
    selectedAnswers.push(index);

    const step = quizSteps[quizIndex];
    const goodIndexes = step.answers
      .map((a, i) => a.correct ? i : null)
      .filter(i => i !== null);

    const allCorrect =
      goodIndexes.every(i => selectedAnswers.includes(i)) &&
      selectedAnswers.every(i => step.answers[i].correct);

    if(allCorrect){
      addText("✅ Bonne réponse !");
      addText(step.explanation, true);
      addButton("Continuer", nextQuiz);
    }
  }

  function nextQuiz(){
    quizIndex++;
    renderQuiz();
  }

  /* =====================================================
     ⏳ JAUGE CLIENTS (3 / 10) – À DROITE
  ===================================================== */
  function startClientsGauge(){
    const gauge = document.createElement("div");
    gauge.className = "clientsGauge";

    gauge.innerHTML = `
      <div class="clientsGaugeTitle">
        Nombre de clients qui viennent d’entrer dans l’échoppe
      </div>
      <div class="clientsProgressBar">
        <div class="clientsProgressFill"></div>
      </div>
      <div class="clientsProgressCount">0 / 10</div>
    `;

    document.body.appendChild(gauge);

    const fill  = gauge.querySelector(".clientsProgressFill");
    const count = gauge.querySelector(".clientsProgressCount");

    let value = 0;
    const interval = setInterval(() => {
      value++;
      fill.style.width = `${value * 10}%`;
      count.textContent = `${value} / 10`;

      if(value === 3){
        clearInterval(interval);
        setTimeout(() => {
          gauge.remove();
          startMiniGame2();
        }, 800);
      }
    }, 400);
  }

  /* =====================================================
     🎨 MINI-JEU 2 – IDENTITÉ VISUELLE
  ===================================================== */
  function startMiniGame2(){
    miniGame.classList.remove("hidden");
    miniGame.innerHTML = "";

    addText("🎨 Identité visuelle");
    addText(
      "L’identité visuelle permet aux clients de reconnaître une marque immédiatement.",
      true
    );
    addText(
      "🎯 Objectif : créer une identité visuelle dont les clients se souviendront."
    );
    addButton("Commencer", chooseLogo);
  }

  /* --- LOGO (choix libre) --- */
  function chooseLogo(){
    miniGame.innerHTML = "";
    addText("Choisis ton logo (choix libre)");

    ["Logo A", "Logo B", "Logo C"].forEach(() => {
      addButton("Choisir ce logo", chooseColors);
    });
  }

  /* --- COULEURS (1 seule bonne réponse) --- */
  function chooseColors(){
    miniGame.innerHTML = "";
    addText("🎨 Les couleurs");

    ["Palette 1", "Palette 2", "Palette 3"].forEach((label, index) => {
      addButton(label, () => {
        if(index === 0){
          addText("✅ Bonne réponse !");
          addText(
            "Les couleurs doivent être cohérentes avec le style du logo. " +
            "Ce seront tes couleurs obligatoires pour flyers, newsletters et réseaux sociaux.",
            true
          );
          addButton("Continuer", chooseTypography);
        }
      });
    });
  }

  /* --- TYPOGRAPHIE --- */
  function chooseTypography(){
    miniGame.innerHTML = "";
    addText("✍️ Typographie");
    addText(
      "Le style d’écriture (polices, tons et mise en forme).",
      true
    );

    ["Style 1", "Style 2", "Style 3"].forEach((label, index) => {
      addButton(label, () => {
        if(index === 0){
          addText("✅ Bonne réponse !");
          addText(
            "La typographie est très importante. Comme le logo, " +
            "tu devras la garder pour tous tes designs.",
            true
          );
          addButton("Finaliser", endVisual);
        }
      });
    });
  }

  function endVisual(){
    miniGame.innerHTML = "";
    addText(
      "🎉 Maintenant que tu as créé ton identité visuelle, " +
      "ta marque sera reconnue par tous et très rapidement."
    );
  }

  /* =====================================================
     🧩 HELPERS UI
  ===================================================== */
  function addText(text, subtle = false){
    const p = document.createElement("p");
    p.textContent = text;
    if(subtle) p.style.opacity = ".8";
    miniGame.appendChild(p);
  }

  function addButton(label, action){
    const b = document.createElement("button");
    b.textContent = label;
    b.addEventListener("click", action);
    miniGame.appendChild(b);
  }

  function addHTML(html){
    const div = document.createElement("div");
    div.innerHTML = html;
    miniGame.appendChild(div);
  }

});
