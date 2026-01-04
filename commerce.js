document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
      🎬 VIDÉO
  =============================== */
  const videoContainer = document.getElementById("videoContainer");
  const questVideo = document.getElementById("questVideo");

  const toggleSound = document.getElementById("toggleSound");
  const closeVideo = document.getElementById("closeVideo");

  /* sécurités d'affichage */
  if (toggleSound) toggleSound.style.display = "block";
  if (closeVideo) closeVideo.style.display = "block";

  /* ▶️ LECTURE AUTO SAFE */
  if (questVideo) {
    questVideo.muted = true;
    questVideo.play().catch(() => {});
  }

  /* 🔊 SON */
  if (toggleSound && questVideo) {
    toggleSound.addEventListener("click", () => {

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

  /* ❌ FERMER VIDÉO */
  if (closeVideo && questVideo && videoContainer) {

    closeVideo.addEventListener("click", () => {

      questVideo.pause();
      questVideo.currentTime = 0;

      videoContainer.style.display = "none";

      showBackgroundAndPirates();
    });
  }

  /* ===============================
      🌅 FOND + PIRATES
  =============================== */
  const background = document.getElementById("background");
  const pirate2bis = document.getElementById("pirate2bis");
  const pirate5bis = document.getElementById("pirate5bis");

  function showBackgroundAndPirates(){
    if(!background) return;
    background.style.display = "block";
    setTimeout(()=> background.style.opacity = 1, 50);
    startDialogues();
  }

  /* ===============================
      💬 DIALOGUES
  =============================== */
  let dialogueStep = 0;

  const dialogues = [
    { who:"maitre", text:"Moussaillon ! Bienvenue sur le marché des trésors !", anchor:pirate5bis },
    { who:"apprenti", text:"J’suis prêt capitaine !", anchor:pirate2bis },
    { who:"maitre", text:"Observe, teste, deviens le meilleur vendeur pirate !", anchor:pirate5bis }
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
    if(!d.anchor) return;

    const rect = d.anchor.getBoundingClientRect();

    const bubble = document.createElement("div");
    bubble.classList.add("dialogue-bubble");

    bubble.innerHTML = `<strong>${d.who==="maitre"?"Maître Pirate":"Moussaillon"}</strong><hr>${d.text}`;

    bubble.style.left = rect.left + "px";
    bubble.style.top = (rect.top - 120) + "px";

    bubble.addEventListener("click", ()=>{
      dialogueStep++;
      showDialogue();
    });

    document.body.appendChild(bubble);
  }

  /* ===============================
      ⏳ LOADER
  =============================== */
  const loaderContainer = document.getElementById("loaderContainer");

  function showLoader(){
    loaderContainer.style.display = "flex";

    setTimeout(()=>{
      loaderContainer.style.display = "none";
      startMiniGame();
    },2000);
  }

  /* ===============================
      🎮 MINI JEU
  =============================== */
  const miniGameContainer = document.getElementById("miniGameContainer");
  const gameQuestion = document.getElementById("gameQuestion");
  const gameAnswers = document.getElementById("gameAnswers");
  const gameFeedback = document.getElementById("gameFeedback");

  const questions = [
    { q:"Où trouvent-ils les pierres ?", answers:["Dans une grotte","Au marché","Dans la mer"], correct:0 }
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

    q.answers.forEach((a,i)=>{
      const b = document.createElement("button");
      b.textContent = a;
      b.addEventListener("click", ()=> checkAnswer(i,q.correct));
      gameAnswers.appendChild(b);
    });
  }

  function checkAnswer(i,correct){
    if(i===correct){
      gameFeedback.textContent="✅ Bravo !";
      step++;
      setTimeout(showStep,600);
    } else {
      gameFeedback.textContent="❌ Essaie encore";
    }
  }

  /* ===============================
      🏆 VICTOIRE
  =============================== */
  function showVictory(){
    alert("🎉 Bravo moussaillon !");
  }

});
