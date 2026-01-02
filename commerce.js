document.addEventListener("DOMContentLoaded", () => {

  /* ============================
     🎬 VIDEO
  ============================ */
  const videoContainer = document.getElementById("videoContainer");
  const video = document.getElementById("questVideo");
  const closeVideo = document.getElementById("closeVideo");
  const toggleSound = document.getElementById("toggleSound");

  video.preload = "auto";
  video.muted = false;

  function playVideo() {
    video.play().catch(()=>{});
    videoContainer.removeEventListener("click", playVideo);
  }
  videoContainer.addEventListener("click", playVideo);

  toggleSound.addEventListener("click", () => {
    video.muted = !video.muted;
    toggleSound.textContent = video.muted ? "🔇" : "🔊";
  });

  closeVideo.addEventListener("click", endVideo);
  video.addEventListener("ended", endVideo);

  function endVideo() {
    video.pause();
    videoContainer.style.transition = "opacity 1s";
    videoContainer.style.opacity = 0;
    setTimeout(() => {
      videoContainer.style.display = "none";
      showBackgroundAndPirates();
    }, 1000);
  }

  /* ============================
     🏝️ FOND + PIRATES
  ============================ */
  const background = document.getElementById("background");
  const pirate2bis = document.getElementById("pirate2bis");
  const pirate5bis = document.getElementById("pirate5bis");

  pirate2bis.style.position = "absolute";
  pirate2bis.style.left = "516px";
  pirate2bis.style.top = "406px";

  pirate5bis.style.position = "absolute";
  pirate5bis.style.left = "785px";
  pirate5bis.style.top = "397px";

  function showBackgroundAndPirates() {
    background.style.opacity = 0;
    background.style.display = "block";
    setTimeout(() => {
      background.style.transition = "opacity 1s";
      background.style.opacity = 1;
    }, 50);

    startDialogues();
  }

  /* ============================
     💬 DIALOGUES
  ============================ */
  let dialogueStep = 0;
  const dialogues = [
    { who:"maitre", text:"Bienvenue au marché des trésors !", anchor: pirate5bis },
    { who:"apprenti", text:"Je suis prêt maître pirate !", anchor: pirate2bis },
    { who:"maitre", text:"Observe, compare, et trouve ta stratégie…", anchor: pirate5bis },
    { who:"apprenti", text:"Je vais tout donner capitaine !", anchor: pirate2bis },
    { who:"maitre", text:"Alors montre-moi ce dont tu es capable !", anchor: pirate5bis, last:true }
  ];

  function startDialogues() {
    dialogueStep = 0;
    showDialogue();
  }

  function showDialogue() {
    const old = document.querySelector(".dialogue-bubble");
    if (old) old.remove();

    if (dialogueStep >= dialogues.length) return;

    const d = dialogues[dialogueStep];
    const bubble = document.createElement("div");
    bubble.classList.add("dialogue-bubble");

    // Fond clair et texte foncé pour visibilité
    bubble.style.background = "#fdf4e3";
    bubble.style.color = "#3b1b00";
    bubble.style.padding = "12px";
    bubble.style.borderRadius = "14px";
    bubble.style.maxWidth = "320px";
    bubble.style.position = "absolute";
    bubble.style.zIndex = 3000; // devant tout
    bubble.style.boxShadow = "0 5px 0 #3b1b00";

    const speaker = d.who === "maitre" ? "<strong>Maître Pirate</strong><hr>" : "<strong>Moussaillon</strong><hr>";
    bubble.innerHTML = speaker + d.text;

    const rect = d.anchor.getBoundingClientRect();
    bubble.style.left = rect.left + "px";
    bubble.style.top = (rect.top - 120) + "px";

    if (d.last) {
      const btn = document.createElement("button");
      btn.textContent = "Ok, j’ai compris";
      btn.style.marginTop = "10px";
      btn.addEventListener("click", () => {
        bubble.remove();
        launchLoader();
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
     🌟 LOADER
  ============================ */
  function launchLoader() {
    // Masquer fond et pirates
    background.style.display = "none";

    const loader = document.createElement("div");
    loader.id = "loaderScreen";
    loader.style.position = "fixed";
    loader.style.left = 0;
    loader.style.top = 0;
    loader.style.width = "100%";
    loader.style.height = "100%";
    loader.style.background = "black";
    loader.style.color = "white";
    loader.style.display = "flex";
    loader.style.alignItems = "center";
    loader.style.justifyContent = "center";
    loader.style.fontSize = "28px";
    loader.style.opacity = 0;
    loader.style.transition = "opacity 1.2s";
    loader.style.textAlign = "center";
    loader.style.textShadow = "0 0 15px yellow, 0 0 25px gold";
    loader.innerHTML = "Termine ce mini-jeu pour continuer la quête";
    document.body.appendChild(loader);

    setTimeout(() => loader.style.opacity = 1, 50);
    setTimeout(() => {
      loader.remove();
      startMiniGame();
    }, 2500);
  }

  /* ============================
     🎮 MINI-JEU
  ============================ */
  const miniGameContainer = document.getElementById("miniGameContainer");
  const gameQuestion = document.getElementById("gameQuestion");
  const gameAnswers = document.getElementById("gameAnswers");
  const gameFeedback = document.getElementById("gameFeedback");

  const questions = [
    {q:"Pourquoi les pirates vendent leurs pierres ?",a:["Acheter un bateau","Décorer la cale","Les manger"],c:0},
    {q:"Où ont-ils trouvé les pierres ?",a:["Grotte secrète","Supermarché","Internet"],c:0},
    {q:"Que doivent-ils faire au marché ?",a:["Observer les concurrents","Dormir","Crier"],c:0}
  ];

  let step = 0;

  function startMiniGame(){
    miniGameContainer.style.display = "flex";
    step = 0;
    showStep();
  }

  function showStep(){
    if(step >= questions.length){
      showVictory();
      return;
    }
    const q = questions[step];
    gameQuestion.textContent = q.q;
    gameAnswers.innerHTML = "";
    gameFeedback.textContent = "";
    q.a.forEach((ans,i)=>{
      const b = document.createElement("button");
      b.textContent = ans;
      b.addEventListener("click", ()=> checkAnswer(i,q.c));
      gameAnswers.appendChild(b);
    });
  }

  function checkAnswer(i,correct){
    if(i===correct){
      gameFeedback.textContent="✅ Bravo moussaillon";
      step++;
      setTimeout(showStep,600);
    } else {
      gameFeedback.textContent="❌ Essaie encore";
    }
  }

  /* ============================
     🏆 VICTOIRE + PIÈCES + RETOUR FOND
  ============================ */
  function showVictory(){
    miniGameContainer.style.display="none";

    const panel = document.createElement("div");
    panel.classList.add("victoryPanel");
    panel.style.position="fixed";
    panel.style.left=0;
    panel.style.top=0;
    panel.style.width="100%";
    panel.style.height="100%";
    panel.style.display="flex";
    panel.style.alignItems="center";
    panel.style.justifyContent="center";
    panel.style.zIndex=3000;
    panel.style.flexDirection="column";
    panel.innerHTML = `
      <div class="victoryBox" style="position:relative; z-index:2; text-align:center; color:white; font-size:32px; font-weight:bold;">
        🎉 Bravo !<br>
        Tu as gagné <strong>5000 PO</strong> 💰
      </div>
    `;
    document.body.appendChild(panel);

    // explosion pièces derrière le texte
    launchCoins(panel.querySelector(".victoryBox"));

    // retour fond + pirates après 3s
    setTimeout(()=>{
      panel.remove();
      background.style.display = "block";
    }, 3000);
  }

  function launchCoins(box){
    const container = document.createElement("div");
    container.style.position="absolute";
    container.style.inset=0;
    container.style.zIndex=1; // derrière le texte
    box.appendChild(container);

    for(let i=0;i<40;i++){
      const c=document.createElement("div");
      c.textContent="🪙";
      c.style.position="absolute";
      c.style.left=Math.random()*100+"%";
      c.style.top="60%";
      c.style.opacity=0;
      c.style.transition="transform 1.2s, opacity 1.2s";
      container.appendChild(c);

      setTimeout(()=>{
        c.style.opacity=1;
        c.style.transform=`translate(${Math.random()*200-100}px,-${Math.random()*200}px) scale(1.3)`;
      },50);

      setTimeout(()=>c.remove(),1400);
    }
  }

});
