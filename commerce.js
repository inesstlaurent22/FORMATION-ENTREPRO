document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     🎬 VIDÉO – TOUJOURS EN PREMIER
  ===================================================== */

  const videoContainer = document.getElementById("videoContainer");
  const video = document.getElementById("questVideo");
  const toggleSound = document.getElementById("toggleSound");
  const closeVideo = document.getElementById("closeVideo");

  const background = document.getElementById("background");
  const pirate2bis = document.getElementById("pirate2bis");
  const pirate5bis = document.getElementById("pirate5bis");

  /* cacher tout sauf la vidéo au départ */
  background.style.display = "none";

  video.muted = true;

  /* autoplay sécurisé */
  video.play().catch(() => {
    video.muted = true;
    video.play();
  });

  toggleSound.textContent = "🔇";

  toggleSound.addEventListener("click", () => {
    video.muted = !video.muted;
    toggleSound.textContent = video.muted ? "🔇" : "🔊";
  });

  closeVideo.addEventListener("click", (e) => {
    e.stopPropagation();
    endVideo();
  });

  video.addEventListener("ended", endVideo);

  function endVideo() {
    video.pause();
    videoContainer.style.opacity = 0;

    setTimeout(() => {
      videoContainer.style.display = "none";
      showBackground();
    }, 1000);
  }

  /* =====================================================
     🌅 BACKGROUND + PIRATES
  ===================================================== */

function showBackground() {
  background.style.display = "block";
  background.style.opacity = 0;

  // positions demandées
  pirate2bis.style.position = "absolute";
  pirate2bis.style.left = "516px";
  pirate2bis.style.top = "406px";

  pirate5bis.style.position = "absolute";
  pirate5bis.style.left = "785px";
  pirate5bis.style.top = "397px";

  setTimeout(() => {
    background.style.opacity = 1;
  }, 50);
}
  
  /* =====================================================
     💬 DIALOGUES
  ===================================================== */

  const bubbleContainer = document.getElementById("bubbleContainer");

  let dialogueStep = 0;

  const dialogues = [
    { who:"maitre", text:"Moussaillon ! Bienvenue sur le marché des trésors ! Ici, plein de pirates vendent des pierres précieuses… mais pour toi, qui débutes, faudra suivre mes conseils !", anchor: pirate5bis },
    { who:"apprenti", text:"J’suis prêt, capitaine !", anchor: pirate2bis },
    { who:"maitre", text:"Écoute bien ! D’abord, tu dois te mettre au niveau des autres pirates… parle comme eux, montre que tu connais tes pierres. Ensuite… sois plus malin et plus rapide qu’eux !", anchor: pirate5bis },
    { who:"apprenti", text:"Mais comment je fais ça ?", anchor: pirate2bis },
    { who:"maitre", text:"La plupart ont une échoppe et vendent dans des sachets en velours. Tu dois faire pareil… ou mieux !", anchor: pirate5bis },
    { who:"apprenti", text:"Me démarquer… c’est-à-dire ?", anchor: pirate2bis },
    { who:"maitre", text:"Moins cher, plus luxueux, plus visible… ou aller directement chez les clients !", anchor: pirate5bis },
    { who:"apprenti", text:"Je vois… je choisis selon mes clients !", anchor: pirate2bis },
    { who:"maitre", text:"Exactement. Observe, teste, et deviens le meilleur pirate commerçant.", anchor: pirate5bis },
    { who:"apprenti", text:"MERCI capitaine !", anchor: pirate2bis }
  ];

  function createBubble(d) {
    bubbleContainer.innerHTML = "";

    const div = document.createElement("div");
    div.className = "dialogue-bubble";
    div.innerHTML = `<strong>${d.who === "maitre" ? "Maître pirate" : "Apprenti pirate"}</strong><br>${d.text}`;

    const btn = document.createElement("button");
    btn.textContent = dialogueStep < dialogues.length - 1 ? "Suite" : "OK, j’ai compris";
    btn.onclick = nextDialogue;

    div.appendChild(btn);
    bubbleContainer.appendChild(div);

    const rect = d.anchor.getBoundingClientRect();
    div.style.left = rect.left + "px";
    div.style.top = (rect.top - div.offsetHeight - 20) + "px";
  }

  function nextDialogue() {
    dialogueStep++;
    if (dialogueStep < dialogues.length) {
      createBubble(dialogues[dialogueStep]);
    } else {
      bubbleContainer.innerHTML = "";
      launchMiniGame();
    }
  }

  pirate5bis.addEventListener("click", () => {
    dialogueStep = 0;
    createBubble(dialogues[0]);
  });

  /* =====================================================
     🌑 FADE + LOADER MINI-JEU
  ===================================================== */

  const fadeScreen = document.getElementById("fadeScreen");

  function launchMiniGame() {
    fadeScreen.style.display = "flex";
    fadeScreen.innerHTML = `<div class="loaderBox">Termine ce mini-jeu avant de poursuivre la quête</div>`;

    setTimeout(() => {
      fadeScreen.style.display = "none";
      startMiniGame();
    }, 2200);
  }

  /* =====================================================
     🎮 MINI-JEU QCM
  ===================================================== */

  const miniGameContainer = document.getElementById("miniGameContainer");
  const gameQuestion = document.getElementById("gameQuestion");
  const gameAnswers = document.getElementById("gameAnswers");
  const gameFeedback = document.getElementById("gameFeedback");

  const questions = [
    {
      q:"Où les pirates ont-ils trouvé leurs pierres ?",
      answers:["Dans un coffre dans une grotte secrète","Au marché","La tante"],
      correct:0
    },
    {
      q:"Qui fait partie de l'équipage pirate ?",
      answers:["Juste le capitaine","Toute la famille","Toi et les deux moussaillons"],
      correct:2
    },
    {
      q:"Qu’est-ce que les pirates doivent observer sur le marché ?",
      answers:["Les pierres","Les concurrents","La météo"],
      correct:[0,1]
    }
  ];

  let step = 0;
  let selected = [];

  function startMiniGame() {
    miniGameContainer.style.display = "flex";
    step = 0;
    showQuestion();
  }

  function showQuestion() {
    if (step >= questions.length) {
      showReward();
      return;
    }

    const q = questions[step];
    gameQuestion.innerHTML = q.q;
    gameAnswers.innerHTML = "";
    gameFeedback.textContent = "";
    selected = [];

    const multi = Array.isArray(q.correct);

    q.answers.forEach((a,i)=>{
      const b = document.createElement("button");
      b.textContent = a;
      b.onclick = () => {
        if(!multi){
          checkSingle(i);
        } else {
          b.classList.toggle("selected");
          selected.includes(i) ? selected.splice(selected.indexOf(i),1) : selected.push(i);
        }
      };
      gameAnswers.appendChild(b);
    });

    if(multi){
      const validate = document.createElement("button");
      validate.textContent="Valider";
      validate.onclick = checkMulti;
      gameAnswers.appendChild(validate);
    }
  }

  function checkSingle(i){
    if(i === questions[step].correct){
      step++;
      setTimeout(showQuestion,600);
    } else {
      gameFeedback.textContent="❌ Essaie encore";
    }
  }

  function checkMulti(){
    const c = questions[step].correct.sort().join();
    const u = selected.sort().join();
    if(c === u){
      step++;
      setTimeout(showQuestion,600);
    } else {
      gameFeedback.textContent="❌ Pas toutes les bonnes réponses";
    }
  }

  /* =====================================================
     🏆 RÉCOMPENSE + LIVRE
  ===================================================== */

  const rewardScreen = document.getElementById("rewardScreen");
  const bookContainer = document.getElementById("bookContainer");
  const continueBtn = document.getElementById("continueQuestBtn");

  function showReward(){
    miniGameContainer.style.display="none";
    rewardScreen.style.display="flex";

    setTimeout(()=>{
      rewardScreen.style.display="none";
      bookContainer.style.display="flex";
    },2600);
  }

  /* =====================================================
     📖 LIVRE → CONTINUER
  ===================================================== */

  const pages = document.querySelectorAll(".page");
  let currentPage = 0;

  pages.forEach((p,i)=>p.style.zIndex = pages.length - i);

  document.querySelector(".book").addEventListener("click",(e)=>{
    const r = e.currentTarget.getBoundingClientRect();
    if(e.clientX - r.left > r.width/2 && currentPage < pages.length){
      pages[currentPage++].classList.add("flipped");
    }
    if(currentPage === pages.length){
      continueBtn.style.display="block";
    }
  });

  continueBtn.addEventListener("click",()=>{
    bookContainer.style.display="none";
    continueBtn.style.display="none";
    background.style.display="block";
  });

});
