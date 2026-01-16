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

  introVideo.muted = true;
  introVideo.play().catch(()=>{});

  toggleSound.addEventListener("click", () => {
    introVideo.muted = !introVideo.muted;
    introVideo.play().catch(()=>{});
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
     💬 DIALOGUES IMMERSIFS (clic)
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
      `${rect.left + rect.width/2 - dialogBox.offsetWidth/2}px`;
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
      { speaker:"pirate3", text:"Capitaine, ton trésor est prêt… mais personne ne le connaît." },
      { speaker:"pirate2", text:"Sans communication, le marché restera vide." },
      { speaker:"pirate3", text:"Apprenons à faire parler de ta marque." }
    ], startMiniGame1);
  });

  /* =====================================================
     🎮 MINI-JEU 1 – COMMUNICATION
  ===================================================== */
  const quizSteps = [
    {
      title:"📣 Réseaux sociaux",
      question:"Les réseaux sociaux servent principalement à :",
      answers:[
        {text:"Te faire découvrir", correct:true},
        {text:"Montrer ton univers", correct:true},
        {text:"Forcer la vente immédiate", correct:false}
      ],
      explanation:"Ils créent visibilité et attirent naturellement les clients."
    },
    {
      title:"📜 Newsletter",
      question:"Une newsletter permet de :",
      answers:[
        {text:"Rester présent dans l’esprit du client", correct:true},
        {text:"Créer un lien dans le temps", correct:true},
        {text:"Envoyer des promotions tous les jours", correct:false}
      ],
      explanation:"Elle entretient la relation sans pression commerciale."
    }
  ];

  let quizIndex = -2;
  let selected = [];

  function startMiniGame1(){
    miniGame.classList.remove("hidden");
    quizIndex = -2;
    renderQuiz();
  }

  function renderQuiz(){
    miniGame.innerHTML = "";

    if(quizIndex === -2){
      addText("🏴‍☠️ Mission : Communication");
      addText("Le marché doit te connaître et te faire confiance.");
      addButton("Commencer", nextQuiz);
      return;
    }

    if(quizIndex === -1){
      addText("🎯 Objectif");
      addText("Comprendre le rôle de chaque canal.");
      addText("💡 Chaque action rassure le client différemment.", true);
      addButton("Continuer", nextQuiz);
      return;
    }

    if(quizIndex >= quizSteps.length){
      addText("🎉 Mission réussie !");
      addButton("Continuer", startClientsLoader);
      return;
    }

    selected = [];
    const step = quizSteps[quizIndex];
    const count = step.answers.filter(a=>a.correct).length;

    addText(step.title);
    addText(step.question);
    addText(`(${count} bonne(s) réponse(s))`, true);

    step.answers.forEach((a,i)=>{
      addButton(a.text, () => selectAnswer(i));
    });
  }

  function selectAnswer(i){
    if(selected.includes(i)) return;
    selected.push(i);

    const step = quizSteps[quizIndex];
    const good = step.answers.map((a,i)=>a.correct?i:null).filter(i=>i!==null);

    if(good.every(i=>selected.includes(i)) &&
       selected.every(i=>step.answers[i].correct)){
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
     ⏳ LOADER CLIENTS
  ===================================================== */
  function startClientsLoader(){
    miniGame.classList.add("hidden");
    loader.classList.remove("hidden");

    loaderText.innerHTML = `
      Bravo, <strong>2 clients</strong> sont entrés dans la boutique<br><br>
      <div class="progressBar"><div class="progressFill"></div></div>
      <div class="progressCount">0 / 10</div>
    `;

    let v = 0;
    const fill = loader.querySelector(".progressFill");
    const count = loader.querySelector(".progressCount");

    const interval = setInterval(()=>{
      v++;
      fill.style.width = `${v*10}%`;
      count.textContent = `${v} / 10`;
      if(v >= 10){
        clearInterval(interval);
        loader.classList.add("hidden");
        startFlyerDialog();
      }
    }, 200);
  }

  /* =====================================================
     💬 FLYER + IDENTITÉ VISUELLE
  ===================================================== */
  function startFlyerDialog(){
    playDialog([
      { speaker:"pirate2", text:"Tu trouves mon flyer efficace ?" },
      { speaker:"pirate3", text:"Voyons ça ensemble." }
    ], showFlyer);
  }

  function showFlyer(){
    const flyer = document.createElement("img");
    flyer.src = "images/flyer.png";
    flyer.id = "flyerCenter";
    document.body.appendChild(flyer);

    flyer.addEventListener("click", () => {
      flyer.remove();
      playDialog([
        { speaker:"pirate3", text:"Il manque une identité claire." },
        { speaker:"pirate2", text:"Que devons-nous faire ?" },
        { speaker:"pirate3", text:"Créer une identité visuelle cohérente." }
      ], startMiniGame2);
    });
  }

  /* =====================================================
     🎨 MINI-JEU 2 – IDENTITÉ VISUELLE
  ===================================================== */
  function startMiniGame2(){
    miniGame.classList.remove("hidden");
    miniGame.innerHTML = "";
    addText("🎨 Identité visuelle");
    addText("Choisis des éléments cohérents pour être reconnu.");
    addButton("Créer mon identité", endVisual);
  }

  function endVisual(){
    miniGame.innerHTML = "";
    addText("🎉 Identité visuelle créée !");
    addText("Les clients reconnaîtront désormais ta marque.", true);
  }

  /* =====================================================
     🧩 HELPERS UI
  ===================================================== */
  function addText(text, subtle=false){
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

});
