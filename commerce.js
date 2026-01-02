document.addEventListener("DOMContentLoaded", () => {

  /* ============================
     🎬 VIDÉO
  ============================ */
  const videoContainer = document.getElementById("videoContainer");
  const video = document.getElementById("questVideo");
  const closeVideo = document.getElementById("closeVideo");
  const toggleSound = document.getElementById("toggleSound");

  video.muted = true;

  toggleSound.addEventListener("click", ()=>{
    video.muted = !video.muted;
    toggleSound.textContent = video.muted ? "🔇" : "🔊";
  });

  closeVideo.addEventListener("click", endVideo);
  video.addEventListener("ended", endVideo);

  function endVideo(){
    video.pause();
    videoContainer.style.opacity=0;
    setTimeout(()=>{
      videoContainer.style.display="none";
      showBackgroundAndPirates();
    },1000);
  }

  /* ============================
     🌅 FOND + PIRATES
  ============================ */
  const background = document.getElementById("background");
  const pirate2bis = document.getElementById("pirate2bis");
  const pirate5bis = document.getElementById("pirate5bis");

  pirate2bis.style.left="516px";
  pirate2bis.style.top="406px";
  pirate5bis.style.left="785px";
  pirate5bis.style.top="397px";

  function showBackgroundAndPirates(){
    background.style.display="block";
    setTimeout(()=> background.style.opacity=1,50);
    startDialogues();
  }

  /* ============================
     💬 BULLES
  ============================ */
  let dialogueStep = 0;
  const dialogues = [
    { who:"maitre", text:"Bienvenue au marché des trésors !", anchor: pirate5bis },
    { who:"apprenti", text:"Je suis prêt maître pirate !", anchor: pirate2bis },
    { who:"maitre", text:"Observe, compare, et trouve ta stratégie…", anchor: pirate5bis },
    { who:"apprenti", text:"Je vais tout donner capitaine !", anchor: pirate2bis },
    { who:"maitre", text:"Alors montre-moi ce dont tu es capable !", anchor: pirate5bis, last:true }
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

    const speaker = d.who==="maitre" ? "Maître Pirate" : "Moussaillon";
    bubble.innerHTML = `<strong>${speaker}</strong><hr>${d.text}`;

    const rect = d.anchor.getBoundingClientRect();
    bubble.style.left = rect.left+"px";
    bubble.style.top = (rect.top-120)+"px";

    if(d.last){
      const btn = document.createElement("button");
      btn.textContent = "Ok, j’ai compris";
      btn.addEventListener("click", ()=>{
        bubble.remove();
        showLoader(); // déclenche loader seulement après clic sur le bouton
      });
      bubble.appendChild(btn);
    }else{
      bubble.addEventListener("click", ()=>{
        dialogueStep++;
        showDialogue();
      });
    }

    document.body.appendChild(bubble);
  }

  /* ============================
     🌟 LOADER
  ============================ */
  const loaderContainer = document.getElementById("loaderContainer");
  const loaderText = document.getElementById("loaderText");

  function showLoader(){
    loaderContainer.style.display="block";
    setTimeout(()=> loaderText.style.opacity=1,50);
    setTimeout(()=>{
      loaderText.style.opacity=0;
      setTimeout(()=>{
        loaderContainer.style.display="none";
        startMiniGame();
      },800);
    },2000);
  }

  /* ============================
     🎮 MINI-JEU
  ============================ */
  const miniGameContainer = document.getElementById("miniGameContainer");
  const gameQuestion = document.getElementById("gameQuestion");
  const gameAnswers = document.getElementById("gameAnswers");
  const gameFeedback = document.getElementById("gameFeedback");

  const questions=[
    {q:"Pourquoi les pirates vendent leurs pierres ?",a:["Acheter un bateau","Décorer la cale","Les manger"],c:0},
    {q:"Où ont-ils trouvé les pierres ?",a:["Grotte secrète","Supermarché","Internet"],c:0},
    {q:"Que doivent-ils faire au marché ?",a:["Observer les concurrents","Dormir","Crier"],c:0}
  ];

  let step = 0;

  function startMiniGame(){
    miniGameContainer.style.display="flex";
    step=0;
    showStep();
  }

  function showStep(){
    if(step >= questions.length){ showVictory(); return; }
    const q = questions[step];
    gameQuestion.textContent = q.q;
    gameAnswers.innerHTML="";
    gameFeedback.textContent="";
    q.a.forEach((ans,i)=>{
      const b = document.createElement("button");
      b.textContent = ans;
      b.addEventListener("click", ()=>checkAnswer(i,q.c));
      gameAnswers.appendChild(b);
    });
  }

  function checkAnswer(i,correct){
    if(i === correct){
      gameFeedback.textContent="✅ Bravo moussaillon";
      step++;
      setTimeout(showStep,600);
    } else gameFeedback.textContent="❌ Essaie encore";
  }

  /* ============================
     🏆 VICTOIRE AVEC FADE IN + PIÈCES
  ============================ */
  const victoryScreen = document.getElementById("victoryScreen");
  const victoryBox = document.querySelector(".victoryBox");

  function showVictory(){
    miniGameContainer.style.display="none";
    victoryBox.innerHTML = "🎉 Bravo moussaillon ! 🎉<br>Tu as gagné <strong>5000 PO 💰</strong>";

    // Préparer fade-in
    victoryScreen.style.display="flex";
    victoryScreen.style.opacity=0;
    victoryScreen.style.pointerEvents="auto";

    setTimeout(()=> {
      victoryScreen.style.opacity=1; // fade-in
      launchCoins(victoryBox); // explosion de pièces derrière le texte
    },50);

    // Disparaît après 3s
    setTimeout(()=>{
      victoryScreen.style.opacity=0;
      setTimeout(()=>{
        victoryScreen.style.display="none";
        background.style.display="block";
        setTimeout(()=> background.style.opacity=1,50);
      },1000);
    },3000);
  }

  function launchCoins(box){
    const container = document.createElement("div");
    container.style.position="absolute";
    container.style.inset=0;
    container.style.zIndex=1; // derrière le texte
    box.appendChild(container);

    for(let i=0;i<40;i++){
      const c = document.createElement("div");
      c.textContent="🪙";
      c.style.position="absolute";
      c.style.left="50%";
      c.style.top="50%";
      c.style.transform="translate(-50%,0)";
      c.style.opacity=0;
      c.style.transition="transform 1.2s, opacity 1.2s";
      container.appendChild(c);

      setTimeout(()=>{
        const x = Math.random()*200 - 100;
        const y = Math.random()*200 - 100;
        c.style.opacity=1;
        c.style.transform=`translate(${x}px, ${y}px) scale(1.3)`;
      },50);

      setTimeout(()=>c.remove(),1400);
    }
  }

});
