document.addEventListener("DOMContentLoaded", () => {

  /* ========================================================
        0️⃣ ÉLÉMENTS DOM
  ======================================================== */
  const videoContainer = document.getElementById("videoContainer");
  const questVideo = document.getElementById("questVideo");
  const toggleSound = document.getElementById("toggleSound");
  const closeVideo = document.getElementById("closeVideo");
  const background = document.getElementById("background");

  const buttonsContainer = document.getElementById("buttonsContainer");
  const replayVideo = document.getElementById("replayVideo");
  const finishQuest = document.getElementById("finishQuest");

  const pirate2bis = document.getElementById("pirate2bis");
  const pirate5bis = document.getElementById("pirate5bis");
  const bubbleContainer = document.getElementById("bubbleContainer");

  /* ========================================================
        1️⃣ SÉCURITÉ AUTOPLAY ET ÉTAT INITIAL
  ======================================================== */
  questVideo.setAttribute("playsinline", "");
  questVideo.setAttribute("webkit-playsinline", "");
  questVideo.muted = true;

  pirate2bis.style.display = "none";
  pirate5bis.style.display = "none";
  replayVideo.style.display = "none";
  finishQuest.style.display = "none";

  videoContainer.style.display = "flex";
  background.classList.remove("show");

  /* ========================================================
        2️⃣ LANCEMENT VIDÉO
  ======================================================== */
  function startVideo() {
    videoContainer.classList.add("show");
    questVideo.currentTime = 0;

    const tryPlay = () => {
      questVideo.play().catch(() => {
        toggleSound.textContent = "▶️";
        toggleSound.onclick = () => questVideo.play();
      });
    };

    if (questVideo.readyState >= 2) tryPlay();
    else questVideo.addEventListener("canplaythrough", tryPlay, { once: true });
  }
  setTimeout(startVideo, 80);

  /* ========================================================
        3️⃣ AFFICHAGE SCÈNE APRÈS VIDÉO
  ======================================================== */
  function showScene() {
    videoContainer.classList.remove("show");
    setTimeout(() => {
      videoContainer.style.display = "none";
      background.classList.add("show");
      buttonsContainer.style.display = "flex";
      pirate2bis.style.display = "block";
      pirate5bis.style.display = "block";
      replayVideo.style.display = "block";
      finishQuest.style.display = "block";
    }, 400);
  }

  questVideo.addEventListener("ended", showScene);
  closeVideo.addEventListener("click", () => {
    questVideo.pause();
    showScene();
  });

  toggleSound.addEventListener("click", () => {
    questVideo.muted = !questVideo.muted;
    toggleSound.textContent = questVideo.muted ? "🔇" : "🔊";
  });

  replayVideo.addEventListener("click", () => {
    videoContainer.style.display = "flex";
    videoContainer.classList.add("show");
    background.classList.remove("show");
    buttonsContainer.style.display = "none";
    questVideo.currentTime = 0;
    questVideo.play();
  });

  /* ========================================================
        4️⃣ FIN DE LA QUÊTE → DÉBLOCAGE PIRATE
  ======================================================== */
  finishQuest.addEventListener("click", () => {
    // Débloque le pirate 3
    localStorage.setItem("pirate3_unlocked", "true");
    // Retour au menu
    window.location.href = "menu.html";
  });

  /* ========================================================
        5️⃣ DIALOGUES PIRATES
  ======================================================== */
  let step = 0;
  const dialogues = [
    { who: "maitre", text: "Moussaillon ! Bienvenue sur le marché des trésors ! Ici, plein de pirates vendent des pierres précieuses… mais pour toi, qui débutes, faudra suivre mes conseils !", anchor: pirate5bis },
    { who: "apprenti", text: "J’suis prêt, capitaine !", anchor: pirate2bis },
    { who: "maitre", text: "Écoute bien ! D’abord, tu dois te mettre au niveau des autres pirates… parle comme eux, montre que tu connais tes pierres. Ensuite… sois plus malin et plus rapide qu’eux ! Faut que tous les clients viennent chez toi !", anchor: pirate5bis },
    { who: "apprenti", text: "Mais comment je fais ça ?", anchor: pirate2bis },
    { who: "maitre", text: "Regarde bien : la plupart ont une petite échoppe et vendent leurs pierres dans des petits sachets en velours. Les clients adorent ça ! Donc toi aussi, il te faudra une échoppe et des sachets. Mais attention… tes pierres ressemblent à celles des autres ! Faut que tu te démarques !", anchor: pirate5bis },
    { who: "apprenti", text: "Me démarquer… c’est-à-dire ?", anchor: pirate2bis },
    { who: "maitre", text: "Plusieurs stratégies, moussaillon :<br>• vendre moins cher<br>• boîtes en bois luxe<br>• grande boutique visible<br>• aller chez les clients", anchor: pirate5bis },
    { who: "apprenti", text: "Ahhh… donc je choisis la meilleure stratégie selon mes clients !", anchor: pirate2bis },
    { who: "maitre", text: "Exactement ! Observe, teste, et deviens le pirate que tout le monde veut rencontrer.", anchor: pirate5bis },
    { who: "apprenti", text: "MERCI capitaine !", anchor: pirate2bis }
  ];

  function createBubble(dialogue) {
    bubbleContainer.innerHTML = "";
    const rect = dialogue.anchor.getBoundingClientRect();
    const div = document.createElement("div");
    div.className = "bubble";
    const title = dialogue.who === "maitre" ? "Maître pirate" : "Apprenti pirate";
    div.innerHTML = `<div class="name">${title}</div><div>${dialogue.text}</div>`;
    if (step < dialogues.length - 1) {
      const btn = document.createElement("button");
      btn.textContent = "Suite";
      btn.onclick = nextBubble;
      div.appendChild(btn);
    }
    bubbleContainer.appendChild(div);
    div.style.left = rect.left + rect.width / 2 - 150 + "px";
    div.style.top = rect.top - 120 + "px";
  }

  function nextBubble() {
    step++;
    if (step < dialogues.length) createBubble(dialogues[step]);
    else bubbleContainer.innerHTML = "";
  }

  pirate5bis.addEventListener("click", () => {
    step = 0;
    createBubble(dialogues[0]);
  });

});
