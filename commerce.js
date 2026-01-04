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

  closeVideo.addEventListener("click", (e)=>{
    e.stopPropagation();
    endVideo();
  });

  videoContainer.addEventListener("click", ()=>{
    video.play().catch(()=>{});
  });

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

  pirate2bis.style.left="516px"; pirate2bis.style.top="406px";
  pirate5bis.style.left="785px"; pirate5bis.style.top="397px";

  function showBackgroundAndPirates(){
    background.style.display="block";
    setTimeout(()=> background.style.opacity=1,50);
    startDialogues();
  }

  /* ============================
     💬 DIALOGUES
  ============================ */
  let dialogueStep = 0;
  const dialogues = [
     { who: "maitre", text: "Moussaillon ! Bienvenue sur le marché des trésors ! Ici, plein de pirates vendent des pierres précieuses… mais pour toi, qui débutes, faudra suivre mes conseils !", anchor: pirate5bis },
    { who: "apprenti", text: "J’suis prêt, capitaine !", anchor: pirate2bis },
    { who: "maitre", text: "Écoute bien ! D’abord, tu dois te mettre au niveau des autres pirates… parle comme eux, montre que tu connais tes pierres. Ensuite… sois plus malin et plus rapide qu’eux ! Faut que tous les clients viennent chez toi !", anchor: pirate5bis },
    { who: "apprenti", text: "Mais comment je fais ça ?", anchor: pirate2bis },
    { who: "maitre", text: "Regarde bien : la plupart ont une petite échoppe et vendent leurs pierres dans des petits sachets en velours. Les clients adorent ça ! Donc toi aussi, il te faudra une échoppe et des sachets. Mais attention… tes pierres ressemblent à celles des autres ! Faut que tu te démarques !", anchor: pirate5bis },
    { who: "apprenti", text: "Me démarquer… c’est-à-dire ?", anchor: pirate2bis },
    { who: "maitre", text: "Plusieurs stratégies, moussaillon :<br>• vendre moins cher<br>• vendre tes pierres dans des boîtes en bois qui sont plus luxueux que les sachets<br>• avoir une grande boutique visible<br>• aller chez les clients directement", anchor: pirate5bis },
    { who: "apprenti", text: "Ahhh… donc je choisis la meilleure stratégie selon mes clients !", anchor: pirate2bis },
    { who: "maitre", text: "Exactement ! Observe, teste, et deviens le pirate que tout le monde veut rencontrer.", anchor: pirate5bis },
    { who: "apprenti", text: "MERCI capitaine !", anchor: pirate2bis }
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
        showLoader();
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

  /* ============================
     🌟 LOADER
  ============================ */
  const loaderContainer = document.getElementById("loaderContainer");
  const loaderText = document.getElementById("loaderText");

  function showLoader(){
    loaderContainer.style.display="flex";
    loaderContainer.style.background="black"; // fond noir
    loaderText.style.opacity=0;
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

const questions = [
  {
    q: "Où les pirates ont-ils trouvé leurs pierres ?",
    answers: [
      "Dans un coffre dans une grotte secrète",
      "Ils les ont achetées au marché",
      "La tante les leur a données"
    ],
    correct: 0
  },

  {
    q: "Qui fait partie de l'équipage pirate ?",
    answers: [
      "Juste le capitaine",
      "Toute la famille pirate",
      "Toi et les deux moussaillons"
    ],
    correct: 2
  },

  {
    q: "Quel est le but du projet des pirates ?",
    answers: [
      "Construire un bateau",
      "Partir en vacances",
      "Garder les pierres pour décorer la cale"
    ],
    correct: 0
  },

  {
    q: "Qu’est-ce que les pirates doivent observer sur le marché ?",
    answers: [
      "Les pierres",
      "Les concurrents",
      "La météo"
    ],
    correct: [0, 1]
  },

  {
    q: "Que doivent-ils décrire pour leurs pierres ?",
    answers: [
      "Le nombre",
      "Les qualités et défauts des pierres",
      "Seulement la couleur",
      "Seulement la taille"
    ],
    correct: [0, 1]   // ✅ bonnes réponses : 0 et 1
  },

  {
    q: "À quoi sert le modèle économique ?",
    answers: [
      "Savoir combien de pierres vendre pour acheter le bateau",
      "Savoir qui fait la vaisselle",
      "Compter les mouettes"
    ],
    correct: [0, 1]
  },

  {
    q: "Quelle stratégie les différencie des autres ?",
    answers: [
      "Vendre les pierres dans des boîtes en bois",
      "Proposer une livraison directement chez le client",
      "Vendre sans dire le prix"
    ],
    correct: 0
  },

  {
    q: "Qu’est-ce que le plan financier ?",
    answers: [
      "Un document qui prévoit les dépenses et les gains",
      "Une carte au trésor",
      "Une chanson de pirates"
    ],
    correct: 0
  },

  {
    q: "À quoi sert le statut juridique ?",
    answers: [
      "À dire comment l’activité pirate est organisée légalement",
      "À choisir le nom du perroquet",
      "À fabriquer des épées"
    ],
    correct: 0
  }
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
     🏆 VICTOIRE FADE IN + FAISCEAUX
  ============================ */
  const victoryScreen = document.getElementById("victoryScreen");
  const victoryBox = document.querySelector(".victoryBox");
  const lightCanvas = document.getElementById("lightCanvas");
  const ctx = lightCanvas.getContext("2d");

  function resizeCanvas(){ lightCanvas.width = window.innerWidth; lightCanvas.height = window.innerHeight; }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  function showVictory(){
    miniGameContainer.style.display="none";
    victoryBox.innerHTML = "🎉 Bravo moussaillon ! 🎉<br>Tu as gagné <strong>5000 PO</strong> 💰";
    victoryScreen.style.display="flex";
    victoryScreen.style.opacity=0;
    setTimeout(()=> victoryScreen.style.opacity=1,50);

    launchLightBeams();

    setTimeout(()=>{
      victoryScreen.style.opacity=0;
      setTimeout(()=>{
        victoryScreen.style.display="none";
        background.style.display="block";
        setTimeout(()=> background.style.opacity=1,50);
      },1000);
    },3000);
  }

  function launchLightBeams(){
    const beams = [];
    for(let i=0;i<50;i++){
      beams.push({
        x: lightCanvas.width/2,
        y: lightCanvas.height/2,
        angle: Math.random()*2*Math.PI,
        length: Math.random()*100+50,
        speed: Math.random()*6+2,
        opacity:1
      });
    }

    let t=0;
    function animate(){
      ctx.clearRect(0,0,lightCanvas.width, lightCanvas.height);
      beams.forEach(b=>{
        const dx = Math.cos(b.angle)*b.speed*t;
        const dy = Math.sin(b.angle)*b.speed*t;
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(b.x+dx, b.y+dy);
        ctx.strokeStyle = `rgba(255,255,0,${b.opacity})`;
        ctx.lineWidth=2;
        ctx.stroke();
      });
      t+=1;
      if(t<30) requestAnimationFrame(animate);
    }
    animate();
  }

 /* ============================
   📖 BUSINESS PLAN BOOK
============================ */
const book = document.querySelector('.book');

/* --- Affichage du loader lumineux --- */
function showBusinessPlanLoader(){
  // créer loader spécifique
  const loader = document.createElement("div");
  loader.id = "businessPlanLoader";
  loader.style.position = "absolute";
  loader.style.top = "180px";        // ajustable au-dessus du livre
  loader.style.left = "50%";
  loader.style.transform = "translateX(-50%)";
  loader.style.fontSize = "2em";
  loader.style.fontWeight = "bold";
  loader.style.textAlign = "center";
  loader.style.color = "gold";
  loader.style.zIndex = 3000;
  loader.style.opacity = 0;
  loader.style.pointerEvents = "none";
  loader.innerHTML = "✨ Tu as créé ton premier business plan ✨";

  // ajouter animation pulsante via style
  loader.style.animation = "pulse 1.5s infinite alternate";

  document.body.appendChild(loader);

  // fade in
  setTimeout(()=> loader.style.opacity = 1, 50);

  // fade out et affichage du livre
  setTimeout(()=>{
    loader.style.opacity = 0;
    setTimeout(()=>{
      loader.remove();
      showBook();
    },1000);
  }, 2500);
}

/* --- Affichage du livre --- */
function showBook(){
  book.style.display = "flex";
  book.style.opacity = 0;
  book.style.justifyContent = "center";
  book.style.alignItems = "center";
  book.style.position = "relative";

  setTimeout(()=> book.style.opacity = 1, 200);
}

/* ============================
   📖 GESTION DU BOOK
============================ */
const pages = document.querySelectorAll('.page');
let currentPage = 0;
const totalPages = pages.length;

// ordre empilement
pages.forEach((page, index) => {
  page.style.zIndex = totalPages - index;
});

// clic sur le livre
book.addEventListener('click', (e) => {
  const bookRect = book.getBoundingClientRect();
  const clickX = e.clientX - bookRect.left;
  const bookWidth = bookRect.width;

  // clic droite : avancer
  if(clickX > bookWidth / 2 && currentPage < totalPages){
    pages[currentPage].classList.add("flipped");
    currentPage++;
  }
  // clic gauche : revenir
  else if(clickX < bookWidth / 2 && currentPage > 0){
    currentPage--;
    pages[currentPage].classList.remove("flipped");
  }
});
