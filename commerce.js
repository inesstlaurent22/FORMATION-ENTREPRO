document.addEventListener("DOMContentLoaded", () => {

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
      1️⃣ AU CHARGEMENT : ON MONTRE LA VIDÉO
  ======================================================== */
  pirate2bis.style.display = "none";
  pirate5bis.style.display = "none";
  replayVideo.style.display = "none";
  finishQuest.style.display = "none";

  questVideo.muted = true;
  questVideo.currentTime = 0;

  setTimeout(() => {
    videoContainer.classList.add("show");
    questVideo.play().catch(()=>{});
  }, 50);

  /* ========================= */
  /* SYSTEME BULLES DIALOGUES */
  /* ========================= */

  let step = 0;

  const dialogues = [
    {
      who: "maitre",
      text: "Moussaillon ! Bienvenue sur le marché des trésors ! Ici, plein de pirates vendent des pierres précieuses… mais pour toi, qui débutes, faudra suivre mes conseils !",
      anchor: pirate5bis
    },
    {
      who: "apprenti",
      text: "J’suis prêt, capitaine !",
      anchor: pirate2bis
    },
    {
      who: "maitre",
      text: "Écoute bien ! D’abord, tu dois te mettre au niveau des autres pirates… parle comme eux, montre que tu connais tes pierres. Ensuite… sois plus malin et plus rapide qu’eux ! Faut que tous les clients viennent chez toi !",
      anchor: pirate5bis
    },
    {
      who: "apprenti",
      text: "Mais comment je fais ça ?",
      anchor: pirate2bis
    },
    {
      who: "maitre",
      text: "Regarde bien : la plupart ont une petite échoppe et vendent leurs pierres dans des petits sachets en velours. Les clients adorent ça ! Donc toi aussi, il te faudra une échoppe et des sachets. Mais attention… tes pierres ressemblent à celles des autres ! Faut que tu te démarques !",
      anchor: pirate5bis
    },
    {
      who: "apprenti",
      text: "Me démarquer… c’est-à-dire ?",
      anchor: pirate2bis
    },
    {
      who: "maitre",
      text: "Plusieurs stratégies, moussaillon :\n• Vendre tes pierres moins cher\n• Boîtes en bois pour le luxe\n• Louer un magasin plus visible\n• Aller directement chez les clients !",
      anchor: pirate5bis
    },
    {
      who: "apprenti",
      text: "Ahhh… donc je choisis la meilleure stratégie selon mes clients !",
      anchor: pirate2bis
    },
    {
      who: "maitre",
      text: "Exactement, sur tes clients, tes concurrents et ton marché! Observe, teste, et deviens le pirate que tout le monde veut rencontrer. Le marché est grand, les trésors sont là… à toi de jouer !",
      anchor: pirate5bis
    },
    {
      who: "apprenti",
      text: "MERCI, capitaine ! Je vais leur montrer mes pierres et devenir le meilleur pirate du marché !",
      anchor: pirate2bis
    }
  ];

  function createBubble(dialogue) {

    bubbleContainer.innerHTML = "";

    const rect = dialogue.anchor.getBoundingClientRect();

    const div = document.createElement("div");
    div.className = "bubble";

    const title =
      dialogue.who === "maitre"
        ? "Maître pirate"
        : "Apprenti pirate";

    div.innerHTML =
      `<div class="name">${title}</div>
       <div>${dialogue.text.replace(/\n/g, "<br>")}</div>`;

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
    if (step < dialogues.length) {
      createBubble(dialogues[step]);
    } else {
      bubbleContainer.innerHTML = "";
      pirate5bis.classList.remove("glow");
    }
  }

  // premier clic démarre les bulles
  pirate5bis.addEventListener("click", () => {
    step = 0;
    createBubble(dialogues[0]);
  });

});
