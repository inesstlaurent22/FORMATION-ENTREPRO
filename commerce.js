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
    { who:"maitre", text:"Bienvenue sur le marché des trésors !", anchor:pirate5bis },
    { who:"apprenti", text:"J’suis prêt capitaine !", anchor:pirate2bis },
    { who:"maitre", text:"Observe, teste et deviens le meilleur pirate commerçant.", anchor:pirate5bis }
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
    {
      question: "Où trouvent-ils les pierres ?",
      answers: [
        "Dans un coffre secret",
        "Au marché",
        "Offertes par la tante"
      ],
      correct: 0
    },
    {
      question: "Qui fait partie de l'équipage ?",
      answers: [
        "Toi et deux moussaillons",
        "Juste le capitaine",
        "Toute la famille"
      ],
      correct: 0
    }
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
