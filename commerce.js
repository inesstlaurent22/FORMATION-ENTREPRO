document.addEventListener("DOMContentLoaded", () => {

  /* =============================
     🎥 GESTION VIDÉO
  ============================= */

  const videoContainer = document.getElementById("videoContainer");
  const video = document.getElementById("questVideo");
  const toggleSoundBtn = document.getElementById("toggleSound");
  const closeVideoBtn = document.getElementById("closeVideo");

  // configuration pour démarrage rapide
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  video.preload = "auto";
  video.autoplay = true;
  video.muted = true;

  // démarrage dès que possible
  video.addEventListener("canplaythrough", () => {
    video.play().catch(()=>{});
  });

  // sécurité : si ça traîne → force play
  setTimeout(()=>{
    if(video.paused) video.play().catch(()=>{});
  },1000);

  // bouton son
  toggleSoundBtn.addEventListener("click", () => {
    video.muted = !video.muted;
    toggleSoundBtn.textContent = video.muted ? "🔇" : "🔊";
  });

  // bouton close = skip vidéo
  closeVideoBtn.addEventListener("click", () => {
    video.pause();
    videoContainer.style.display = "none";
    startDialogues();
  });

  // fin vidéo naturelle
  video.addEventListener("ended", () => {
    videoContainer.style.display = "none";
    startDialogues();
  });


  /* =============================
     🏴‍☠️ PIRATES POSITION
  ============================= */

  const pirate2bis = document.getElementById("pirate2bis");
  const pirate5bis = document.getElementById("pirate5bis");

  pirate2bis.style.position = "absolute";
  pirate2bis.style.left = "516px";
  pirate2bis.style.top = "406px";

  pirate5bis.style.position = "absolute";
  pirate5bis.style.left = "785px";
  pirate5bis.style.top = "397px";


  /* =============================
     💬 DIALOGUES
  ============================= */

  let dialogueStep = 0;

  const dialogues = [
    { who:"maitre", text:"Moussaillon ! Bienvenue sur le marché des trésors ! Ici, plein de pirates vendent des pierres précieuses… mais pour toi, qui débutes, faudra suivre mes conseils !", anchor: pirate5bis },
    { who:"apprenti", text:"J’suis prêt, capitaine !", anchor: pirate2bis },
    { who:"maitre", text:"Écoute bien ! D’abord, tu dois te mettre au niveau des autres pirates : parle comme eux, et montre que tu connais tes pierres.", anchor: pirate5bis },
    { who:"apprenti", text:"Mais comment je fais ça ?", anchor: pirate2bis },
    { who:"maitre", text:"Regarde bien : la plupart ont une échoppe et des sachets en velours. Les clients adorent ça. Mais tes pierres ressemblent aux autres : il faut te démarquer.", anchor: pirate5bis },
    { who:"apprenti", text:"Me démarquer… c’est-à-dire ?", anchor: pirate2bis },
    { who:"maitre", text:"Plusieurs stratégies, moussaillon :<br>• vendre moins cher<br>• boîtes en bois luxe<br>• grande boutique visible<br>• aller chez les clients", anchor: pirate5bis },
    { who:"apprenti", text:"Ahhh… donc je choisis la meilleure stratégie selon mes clients !", anchor: pirate2bis },
    { who:"maitre", text:"Exactement ! Observe, teste, et deviens le pirate que tout le monde veut rencontrer.", anchor: pirate5bis },
    { who:"apprenti", text:"MERCI capitaine !", anchor: pirate2bis },
    { who:"maitre", text:"Tu es prêt ? Alors prouve-le maintenant !", anchor: pirate5bis, last:true }
  ];


  function startDialogues(){
    dialogueStep = 0;
    showDialogue();
  }


  function showDialogue(){

    const old = document.querySelector(".dialogue-bubble");
    if(old) old.remove();

    if(dialogueStep >= dialogues.length) return;

    const d = dialogues[dialogueStep];

    const bubble = document.createElement("div");
    bubble.classList.add("dialogue-bubble");

    const speaker = d.who==="maitre"
      ? "<strong>Maître Pirate</strong><hr>"
      : "<strong>Moussaillon</strong><hr>";

    bubble.innerHTML = `${speaker}${d.text}`;

    // positionner proche du pirate
    const r = d.anchor.getBoundingClientRect();
    bubble.style.position = "absolute";
    bubble.style.left = (r.left - 40) + "px";
    bubble.style.top = (r.top - 130) + "px";
    bubble.style.maxWidth = "350px";
    bubble.style.padding = "14px";
    bubble.style.background = "rgba(255,255,255,0.92)";
    bubble.style.borderRadius = "16px";
    bubble.style.border = "3px solid #704214";
    bubble.style.fontFamily = "Georgia";
    bubble.style.fontSize = "17px";
    bubble.style.zIndex = "200";

    // bouton final
    if(d.last){
      const btn = document.createElement("button");
      btn.textContent = "Ok, j’ai compris";
      btn.style.marginTop = "12px";
      btn.style.padding = "8px 14px";
      btn.style.fontWeight = "bold";
      btn.style.borderRadius = "10px";
      btn.style.cursor = "pointer";
      btn.addEventListener("click", ()=>{
        bubble.remove();
        launchLoaderThenMiniGame();
      });
      bubble.appendChild(btn);
    } else {
      bubble.addEventListener("click", ()=>{
        dialogueStep++;
        showDialogue();
      });
    }

    document.body.appendChild(bubble);
  }


  /* =============================
     ⏳ LOADER + FADE
  ============================= */

  function launchLoaderThenMiniGame(){

    const overlay = document.createElement("div");
    overlay.style.position="fixed";
    overlay.style.left=0;
    overlay.style.top=0;
    overlay.style.width="100%";
    overlay.style.height="100%";
    overlay.style.background="rgba(0,0,0,0.95)";
    overlay.style.display="flex";
    overlay.style.flexDirection="column";
    overlay.style.alignItems="center";
    overlay.style.justifyContent="center";
    overlay.style.zIndex=500;

    const txt = document.createElement("div");
    txt.textContent = "Gagne ce mini-jeu pour continuer ta quête";
    txt.style.color="white";
    txt.style.fontSize="28px";
    txt.style.fontWeight="bold";
    txt.style.animation="blink 1s infinite";

    overlay.style.boxShadow="0 0 150px 30px gold inset";

    overlay.appendChild(txt);
    document.body.appendChild(overlay);

    setTimeout(()=>{
      overlay.remove();
      startMiniGame();
    },2300);
  }


  /* =============================
     🎮 MINI-JEU
  ============================= */

  const gameQuestion = document.getElementById("gameQuestion");
  const gameAnswers = document.getElementById("gameAnswers");
  const gameFeedback = document.getElementById("gameFeedback");
  const miniGameContainer = document.getElementById("miniGameContainer");

  const steps = [
    { question:"Où les pirates ont-ils trouvé leurs pierres ?", answers:["Dans un coffre secret","Au marché","La tante les a données"], correct:0 },
    { question:"Qui fait partie de l'équipage ?", answers:["Toi et deux moussaillons","Seulement le capitaine","Toute la famille"], correct:0 },
    { question:"But du projet ?", answers:["Acheter un bateau","Partir en vacances","Ranger la cale"], correct:0 }
  ];

  let currentStep = 0;

  function startMiniGame(){
    miniGameContainer.style.display="flex";
    miniGameContainer.style.opacity=1;
    currentStep=0;
    showStep();
  }

  function showStep(){
    if(currentStep >= steps.length){
      showWinPanel();
      return;
    }

    const st = steps[currentStep];
    gameQuestion.textContent = st.question;
    gameAnswers.innerHTML="";
    gameFeedback.textContent="";

    st.answers.forEach((ans,i)=>{
      const b=document.createElement("button");
      b.textContent=ans;
      b.addEventListener("click",()=> handleAnswer(i));
      gameAnswers.appendChild(b);
    });
  }

  function handleAnswer(i){
    if(i===steps[currentStep].correct){
      gameFeedback.textContent="✅ Bonne réponse !";
      setTimeout(()=>{currentStep++;showStep();},600);
    } else {
      gameFeedback.textContent="❌ Essaie encore !";
    }
  }


  /* =============================
     🎉 VICTOIRE
  ============================= */

  function showWinPanel(){

    miniGameContainer.style.display="none";

    const panel = document.createElement("div");
    panel.classList.add("win-panel");

    panel.innerHTML = `
      <strong>🎉 Bravo !</strong><br>
      Tu as gagné <strong>5000 PO 💰</strong>
    `;

    panel.style.position="fixed";
    panel.style.left="50%";
    panel.style.top="50%";
    panel.style.transform="translate(-50%,-50%)";
    panel.style.background="rgba(255,255,255,0.95)";
    panel.style.border="4px solid gold";
    panel.style.borderRadius="20px";
    panel.style.padding="25px";
    panel.style.fontSize="24px";
    panel.style.zIndex="300";

    document.body.appendChild(panel);

    launchCoinFireworks(panel);
  }


  /* =============================
     🪙 FEU D’ARTIFICE PIECÉ DOR
     (derrière panneau)
  ============================= */

  function launchCoinFireworks(panel){

    const container = document.createElement("div");
    container.style.position="fixed";
    container.style.left=0;
    container.style.top=0;
    container.style.width="100%";
    container.style.height="100%";
    container.style.pointerEvents="none";
    container.style.zIndex=250;   // derrière panneau
    document.body.appendChild(container);

    for(let i=0;i<40;i++){
      const coin=document.createElement("div");
      coin.textContent="🪙";
      coin.style.position="absolute";
      coin.style.left=Math.random()*100+"%";
      coin.style.top="60%";
      coin.style.fontSize="28px";
      coin.style.animation=`coinUp 1.4s ease-out ${Math.random()}s forwards`;
      container.appendChild(coin);
    }

    setTimeout(()=>container.remove(),2200);
  }

});
