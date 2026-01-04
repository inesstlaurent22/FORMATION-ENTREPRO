document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
      🎬 VARIABLES VIDÉO
  =============================== */
  const videoContainer = document.getElementById("videoContainer");
  const questVideo = document.getElementById("questVideo");

  /* 🎛 BOUTONS */
  const toggleSound = document.getElementById("toggleSound");
  const closeVideo = document.getElementById("closeVideo");

  /* ===============================
      🛠 SÉCURITÉS AFFICHAGE BOUTONS
  =============================== */
  if (toggleSound) {
    toggleSound.style.display = "block";
    toggleSound.style.opacity = "1";
    toggleSound.style.pointerEvents = "auto";
  }

  if (closeVideo) {
    closeVideo.style.display = "block";
    closeVideo.style.opacity = "1";
    closeVideo.style.pointerEvents = "auto";
  }

  /* ===============================
      🔊 BOUTON SON
  =============================== */
  if (toggleSound && questVideo) {

    toggleSound.addEventListener("click", () => {

      // desbloque autoplay policies on iPhone
      questVideo.muted = !questVideo.muted;

      if (questVideo.muted) {
        toggleSound.textContent = "🔇";
      } else {
        toggleSound.textContent = "🔊";
        questVideo.volume = 1;
        questVideo.play().catch(()=>{});
      }
    });
  }

  /* ===============================
      ❌ BOUTON FERMER VIDÉO
  =============================== */
  if (closeVideo && questVideo && videoContainer) {

    closeVideo.addEventListener("click", () => {

      questVideo.pause();
      questVideo.currentTime = 0;

      videoContainer.style.display = "none";

      // 👉 ici tu lances la suite du jeu
      if (typeof startGame === "function") {
        startGame();
      }
    });
  }

  /* ===============================
      ▶️ LECTURE VIDÉO AUTO SAFE
  =============================== */
  if (questVideo) {
    questVideo.play().catch(() => {
      // iPhone bloque → on garde muted mais boutons OK
      questVideo.muted = true;
      questVideo.play().catch(()=>{});
    });
  }
});
  /* ============================
     🌅 FOND + PIRATES
  ============================ */
  const background = document.getElementById("background");
  const pirate2bis = document.getElementById("pirate2bis");
  const pirate5bis = document.getElementById("pirate5bis");

  function showBackgroundAndPirates(){
    background.style.display = "block";
    setTimeout(()=> background.style.opacity = 1, 50);
    startDialogues();
  }

  /* ============================
     💬 DIALOGUES
  ============================ */
  let dialogueStep = 0;

  const dialogues = [
    { who:"maitre", text:"Moussaillon ! Bienvenue sur le marché des trésors !", anchor:pirate5bis },
    { who:"apprenti", text:"J’suis prêt capitaine !", anchor:pirate2bis },
    { who:"maitre", text:"Observe, teste, deviens le meilleur vendeur pirate !", anchor:pirate5bis, last:true }
  ];

  function startDialogues(){
    dialogueStep = 0;
    showDialogue();
  }

  function showDialogue(){
    const old = document.querySelector(".dialogue-bubble");
    if(old) old.remove();

    if(dialogueStep >= dialogues.length){
      showLoader();
      return;
    }

    const d = dialogues[dialogueStep];
    const bubble = document.createElement("div");
    bubble.classList.add("dialogue-bubble");

    bubble.innerHTML = `<strong>${
      d.who==="maitre" ? "Maître Pirate" : "Moussaillon"
    }</strong><hr>${d.text}`;

    const rect = d.anchor.getBoundingClientRect();
    bubble.style.left = rect.left + "px";
    bubble.style.top = (rect.top - 120) + "px";

    bubble.addEventListener("click", ()=>{
      dialogueStep++;
      showDialogue();
    });

    document.body.appendChild(bubble);
  }

  /* ============================
     ⏳ LOADER
  ============================ */
  const loaderContainer = document.getElementById("loaderContainer");

  function showLoader(){
    loaderContainer.style.display = "flex";
    loaderContainer.style.opacity = 0;

    setTimeout(()=> loaderContainer.style.opacity = 1, 80);

    setTimeout(()=>{
      loaderContainer.style.opacity = 0;
      setTimeout(()=>{
        loaderContainer.style.display = "none";
        startMiniGame();
      }, 500);
    }, 2000);
  }

  /* ============================
     🎮 MINI-JEU
  ============================ */
  const miniGameContainer = document.getElementById("miniGameContainer");
  const gameQuestion = document.getElementById("gameQuestion");
  const gameAnswers = document.getElementById("gameAnswers");
  const gameFeedback = document.getElementById("gameFeedback");

  const questions = [
    { q:"Où trouvent-ils les pierres ?", answers:["Dans une grotte","Au marché","Dans la mer"], correct:0 },
    { q:"Qui est pirate ?", answers:["Le capitaine seulement","Toute l'équipe","Personne"], correct:1 },
    { q:"Qu’observer ?", answers:["Les concurrents","Les mouettes","Le sable"], correct:[0] }
  ];

  let step = 0;
  let multiSelected = [];

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
    gameFeedback.textContent = "";
    gameAnswers.innerHTML = "";
    multiSelected = [];

    q.answers.forEach((ans, i)=>{
      const b = document.createElement("button");
      b.textContent = ans;

      b.addEventListener("click", ()=> checkAnswer(i, q.correct));

      gameAnswers.appendChild(b);
    });
  }

  function checkAnswer(i, correct){

    // 🔹 1 seule bonne réponse
    if(typeof correct === "number"){
      if(i === correct){
        gameFeedback.textContent = "✅ Bravo !";
        step++;
        setTimeout(showStep, 600);
      } else {
        gameFeedback.textContent = "❌ Essaie encore";
      }
      return;
    }

    // 🔹 plusieurs bonnes réponses
    if(!multiSelected.includes(i)) multiSelected.push(i);

    if(correct.includes(i)){
      gameFeedback.textContent = "✅ Oui, celle-ci est bonne";
    } else {
      gameFeedback.textContent = "❌ Mauvaise réponse";
      return;
    }

    if(correct.every(v => multiSelected.includes(v))){
      step++;
      setTimeout(showStep, 600);
    }
  }

  /* ============================
     🏆 VICTOIRE
  ============================ */
  const victoryScreen = document.getElementById("victoryScreen");
  const victoryBox = document.querySelector(".victoryBox");
  const lightCanvas = document.getElementById("lightCanvas");
  const ctx = lightCanvas.getContext("2d");

  function resizeCanvas(){
    lightCanvas.width = innerWidth;
    lightCanvas.height = innerHeight;
  }
  resizeCanvas();
  addEventListener("resize", resizeCanvas);

  function showVictory(){

    miniGameContainer.style.display = "none";

    victoryBox.innerHTML = "🎉 Bravo moussaillon ! 🎉<br>Tu as gagné <b>5000 PO</b>";

    victoryScreen.style.display = "flex";
    victoryScreen.style.opacity = 0;

    setTimeout(()=> victoryScreen.style.opacity = 1, 100);

    launchLightBeams();

    setTimeout(()=>{
      victoryScreen.style.opacity = 0;

      setTimeout(()=>{
        victoryScreen.style.display = "none";
        showBusinessPlanLoader();
      }, 800);

    }, 3000);
  }

  function launchLightBeams(){
    const beams = [];
    for(let i=0;i<40;i++){
      beams.push({
        angle: Math.random()*Math.PI*2,
        speed: Math.random()*6+2
      });
    }

    let t=0;
    function anim(){
      ctx.clearRect(0,0,lightCanvas.width,lightCanvas.height);
      beams.forEach(b=>{
        ctx.beginPath();
        ctx.moveTo(innerWidth/2, innerHeight/2);
        ctx.lineTo(
          innerWidth/2 + Math.cos(b.angle)*t*b.speed,
          innerHeight/2 + Math.sin(b.angle)*t*b.speed
        );
        ctx.strokeStyle = "rgba(255,255,0,.8)";
        ctx.lineWidth = 2;
        ctx.stroke();
      });
      t++;
      if(t<40) requestAnimationFrame(anim);
    }
    anim();
  }

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
