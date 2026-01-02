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
  videoContainer.style.opacity = 1;

  background.style.display = "none";
  pirate2bis.style.display = "none";
  pirate5bis.style.display = "none";
  startMissionButton.style.opacity = 0;
  miniGameContainer.style.display = "none";
  overlayBlur.style.display = "none";
  victoryScreen.style.display = "none";

  /* ========================================================
        BOUTONS VIDEO
  ======================================================== */
  if(toggleSound){
    toggleSound.addEventListener("click", ()=>{
      questVideo.muted = !questVideo.muted;
      toggleSound.textContent = questVideo.muted ? "🔇" : "🔊";
    });
  }
  if(closeVideo){
    closeVideo.addEventListener("click", ()=>{
      questVideo.pause();
      questVideo.dispatchEvent(new Event('ended'));
    });
  }

  /* ========================================================
        FIN VIDEO → FOND + PIRATES
  ======================================================== */
  questVideo.addEventListener("ended", ()=>{
    videoContainer.style.opacity = 0;
    setTimeout(()=>{
      videoContainer.style.display = "none";
      background.style.display = "block";
      pirate2bis.style.display = "flex";
      pirate5bis.style.display = "flex";
    }, 800);
  });

  /* ========================================================
        DIALOGUES PIRATES (DERNIÈRE BULLE = BOUTON OK)
  ======================================================== */
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
    { who:"apprenti", text:"MERCI capitaine !", anchor: pirate2bis }
  ];

  function createBubble(dialogue){
    bubbleContainer.innerHTML = "";
    const rect = dialogue.anchor.getBoundingClientRect();
    const div = document.createElement("div");
    div.className = "bubble";
    const title = dialogue.who === "maitre" ? "Maître pirate" : "Apprenti pirate";
    div.innerHTML = `<div class="name">${title}</div><div>${dialogue.text}</div>`;

    // Dernière bulle : bouton "Ok, j'ai compris"
    if(dialogueStep === dialogues.length - 1){
      const btn = document.createElement("button");
      btn.textContent = "Ok, j'ai compris";
      btn.onclick = () => {
        bubbleContainer.innerHTML = "";
        startMissionButton.style.opacity = 1;
        startMissionButton.classList.add("show");
      };
      div.appendChild(btn);
    }

    bubbleContainer.appendChild(div);

    // Positionnement bulle
    const bubbleWidth = div.offsetWidth;
    const bubbleHeight = div.offsetHeight;
    let leftPos = rect.left + rect.width/2 - bubbleWidth/2;
    let topPos = rect.top - bubbleHeight - 20;
    if(leftPos < 10) leftPos = 10;
    if(leftPos + bubbleWidth > window.innerWidth - 10) leftPos = window.innerWidth - bubbleWidth - 10;
    if(topPos < 10) topPos = 10;
    div.style.left = leftPos + "px";
    div.style.top = topPos + "px";
  }

  pirate5bis.addEventListener("click", ()=>{
    dialogueStep = 0;
    createBubble(dialogues[dialogueStep]);
  });

  /* ========================================================
        MINI-JEU
  ======================================================== */
  const steps = [
    { question:"Où les pirates ont-ils trouvé leurs pierres ?", answers:["Dans un coffre","Au marché","La tante les a données"], correct:0 },
    { question:"Qui fait partie de l'équipage pirate ?", answers:["Toi et les deux moussaillons","Juste le capitaine","Toute la famille pirate"], correct:0 },
  ];

  let currentStep = 0;

  function showStep(){
    if(currentStep < steps.length){
      const stepObj = steps[currentStep];
      gameQuestion.textContent = stepObj.question;
      gameAnswers.innerHTML = "";
      gameFeedback.textContent = "";
      stepObj.answers.forEach((ans,i)=>{
        const btn = document.createElement("button");
        btn.textContent = ans;
        btn.addEventListener("click",()=>handleAnswer(i));
        gameAnswers.appendChild(btn);
      });
    } else {
      miniGameContainer.style.opacity = 0;
      setTimeout(()=>{
        miniGameContainer.style.display = "none";
        overlayBlur.style.opacity = 0;
        overlayBlur.style.display = "none";
        victoryScreen.style.display = "flex";
      },500);
    }
  }

  function handleAnswer(i){
    const stepObj = steps[currentStep];
    if(i === stepObj.correct){
      gameFeedback.textContent = "✅ Bonne réponse !";
      setTimeout(()=>{ currentStep++; showStep(); },700);
    } else gameFeedback.textContent = "❌ Essaie encore !";
  }

  startMissionButton.addEventListener("click", ()=>{
    startMissionButton.classList.remove("show");
    overlayBlur.style.display = "block";
    overlayBlur.style.opacity = 1;
    miniGameContainer.style.display = "flex";
    miniGameContainer.style.opacity = 1;
    currentStep = 0;
    showStep();
  });

});
