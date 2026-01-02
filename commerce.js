document.addEventListener("DOMContentLoaded", () => {

  /* ---------------------- ELEMENTS ---------------------- */

  const videoContainer = document.getElementById("videoContainer");
  const questVideo = document.getElementById("questVideo");
  const toggleSound = document.getElementById("toggleSound");
  const closeVideo = document.getElementById("closeVideo");

  const background = document.getElementById("background");
  const pirate2bis = document.getElementById("pirate2bis");
  const pirate5bis = document.getElementById("pirate5bis");

  const bubbleContainer = document.getElementById("bubbleContainer");

  const overlayBlur = document.getElementById("overlayBlur");
  const loaderContainer = document.getElementById("loaderContainer");

  const miniGameContainer = document.getElementById("miniGameContainer");
  const gameQuestion = document.getElementById("gameQuestion");
  const gameAnswers = document.getElementById("gameAnswers");
  const gameFeedback = document.getElementById("gameFeedback");

  const victoryScreen = document.getElementById("victoryScreen");
  const fireworksCanvas = document.getElementById("fireworksCanvas");

  /* ---------------------- ETATS INIT ---------------------- */

  questVideo.muted = true;
  questVideo.loop = false;

  background.style.display = "none";
  pirate2bis.style.display = "none";
  pirate5bis.style.display = "none";

  miniGameContainer.style.display = "none";
  overlayBlur.style.display = "none";
  loaderContainer.style.display = "none";
  victoryScreen.style.display = "none";

  /* Position pirates */
  pirate2bis.style.left = "516px";
  pirate2bis.style.top = "406px";

  pirate5bis.style.left = "785px";
  pirate5bis.style.top = "397px";


  /* ---------------------- VIDEO ---------------------- */

  // lancement sûr après chargement
  questVideo.addEventListener("loadeddata", () => {
    questVideo.play().catch(() => {});
  });

  // sécurité iOS : lance au premier clic
  document.body.addEventListener(
    "click",
    () => questVideo.play().catch(() => {}),
    { once: true }
  );

  toggleSound.addEventListener("click", () => {
    questVideo.muted = !questVideo.muted;
    toggleSound.textContent = questVideo.muted ? "🔇" : "🔊";
  });

  closeVideo.addEventListener("click", () => {
    questVideo.pause();
    questVideo.dispatchEvent(new Event("ended"));
  });

  // FIN VIDEO → fond + pirates
  questVideo.addEventListener("ended", () => {
    videoContainer.style.display = "none";

    background.style.display = "block";
    pirate2bis.style.display = "block";
    pirate5bis.style.display = "block";
  });


  /* ---------------------- BULLES ---------------------- */

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

  function createBubble(dialogue, isLast = false) {

    bubbleContainer.innerHTML = "";

    const rect = dialogue.anchor.getBoundingClientRect();

    const div = document.createElement("div");
    div.className = "bubble";

    const title = dialogue.who === "maitre" ? "Maître pirate" : "Apprenti pirate";

    div.innerHTML = `
      <div class="name">${title}</div>
      <hr>
      <div style="font-size:16px;">${dialogue.text}</div>
    `;

    const btn = document.createElement("button");
    btn.textContent = isLast ? "Ok j'ai compris" : "Suite";
    btn.onclick = isLast ? showLoader : nextDialogue;

    div.appendChild(btn);

    bubbleContainer.appendChild(div);

    div.style.position = "fixed";
    div.style.zIndex = "3000";

    let left = rect.left + rect.width / 2 - 150;
    let top = rect.top - div.offsetHeight - 20;

    if (left < 10) left = 10;
    if (top < 10) top = 10;

    div.style.left = left + "px";
    div.style.top = top + "px";
  }

  function nextDialogue() {
    dialogueStep++;
    createBubble(dialogues[dialogueStep], dialogueStep === dialogues.length - 1);
  }

  pirate5bis.addEventListener("click", () => {
    dialogueStep = 0;
    createBubble(dialogues[0]);
  });


  /* ---------------------- FADE + MINI JEU ---------------------- */

  function showLoader() {

    // cacher TOUT sauf le loader
    bubbleContainer.innerHTML = "";
    pirate2bis.style.display = "none";
    pirate5bis.style.display = "none";

    overlayBlur.style.display = "block";
    loaderContainer.style.display = "block";

    setTimeout(() => {
      loaderContainer.style.display = "none";
      launchMiniGame();
    }, 2000);
  }


  /* ---------------------- MINI JEU ---------------------- */

  const steps = [
    { question: "Où les pirates ont-ils trouvé leurs pierres ?", answers: ["La tante les leur a données","Ils les ont achetées au marché","Dans un coffre"], correct: 2 },
    { question: "Qui fait partie de l'équipage pirate ?", answers: ["Toi et les deux moussaillons","Juste le capitaine","Toute la famille pirate"], correct: 0 },
    { question: "Quel est le but du projet des pirates ?", answers: ["Acheter un bateau de pirate","Partir en vacances","Garder les pierres pour décorer la cale"], correct: 0 },
    { question: "Qu’est-ce que les pirates doivent observer sur le marché ?", answers: ["Les autres pierres","Les concurrents","Les clients"], correct: 0,1,2 },
    { question: "Que doivent-ils décrire pour leurs pierres ?", answers: ["Couleur, nombre et prix, qualités et défauts","Seulement la couleur","Seulement la taille"], correct: 0,1,2 },
    { question: "À quoi sert le modèle économique ?", answers: ["Savoir combien de pierres vendre pour acheter le bateau","Savoir qui fait la vaisselle","Compter les mouettes"], correct: 0 },
    { question: "Quelle stratégie les différencie des autres ?", answers: ["Crier très fort au marché","Vendre les pierres dans des boîtes en bois","Vendre sans dire le prix"], correct: 1 }
    { question: "Qu’est-ce que le plan financier ?", answers: ["Un document qui prévoit les dépenses et les gains","Une carte au trésor","Une chanson de pirates"], correct: 0 },
    { question: "À quoi sert le statut juridique ?", answers: ["À choisir le nom du perroquet","À fabriquer des épées","À dire comment l’activité pirate est organisée légalement"], correct: 0 }
  ];

  let currentStep = 0;

  function launchMiniGame() {
    overlayBlur.style.display = "none";

    miniGameContainer.style.display = "flex";

    currentStep = 0;
    showStep();
  }

  function showStep() {

    if (currentStep >= steps.length) {
      showVictory();
      return;
    }

    const s = steps[currentStep];

    gameQuestion.textContent = s.question;
    gameAnswers.innerHTML = "";
    gameFeedback.textContent = "";

    s.answers.forEach((ans, i) => {
      const btn = document.createElement("button");
      btn.textContent = ans;

      btn.addEventListener("click", () => handleAnswer(i));

      gameAnswers.appendChild(btn);
    });
  }

  function handleAnswer(i) {
    if (i === steps[currentStep].correct) {
      gameFeedback.textContent = "✅ Bonne réponse !";
      currentStep++;
      setTimeout(showStep, 700);
    } else {
      gameFeedback.textContent = "❌ Essaie encore !";
    }
  }


  /* ---------------------- VICTOIRE ---------------------- */

  function showVictory() {

    miniGameContainer.style.display = "none";

    victoryScreen.style.display = "flex";

    startFireworks();
  }

  function startFireworks() {

    const c = fireworksCanvas;
    c.width = window.innerWidth;
    c.height = window.innerHeight;

    const ctx = c.getContext("2d");

    const particles = [];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: c.width / 2,
        y: c.height / 2,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 1.2) * 10,
        r: Math.random() * 3 + 2
      });
    }

    const interval = setInterval(() => {

      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fillRect(0, 0, c.width, c.height);

      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "yellow";
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12;
      });
    }, 30);

    setTimeout(() => clearInterval(interval), 3000);
  }

});
