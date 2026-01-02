document.addEventListener("DOMContentLoaded", () => {

  /* ============================
     🎭 PERSONNAGES
  ============================ */
  const pirate2bis = document.getElementById("pirate2bis");
  const pirate5bis = document.getElementById("pirate5bis");

  // positions demandées
  pirate2bis.style.position = "absolute";
  pirate2bis.style.left = "516px";
  pirate2bis.style.top = "406px";

  pirate5bis.style.position = "absolute";
  pirate5bis.style.left = "785px";
  pirate5bis.style.top = "397px";

  /* ============================
     💬 DIALOGUES
  ============================ */
  let dialogueStep = 0;

  const dialogues = [
    { who:"maitre", text:"Moussaillon ! Bienvenue sur le marché des trésors !...", anchor: pirate5bis },
    { who:"apprenti", text:"J’suis prêt, capitaine !", anchor: pirate2bis },
    { who:"maitre", text:"Écoute bien ! D’abord, tu dois te mettre au niveau des autres pirates…", anchor: pirate5bis },
    { who:"apprenti", text:"Mais comment je fais ça ?", anchor: pirate2bis },
    { who:"maitre", text:"Regarde bien : la plupart ont une petite échoppe...", anchor: pirate5bis },
    { who:"apprenti", text:"Me démarquer… c’est-à-dire ?", anchor: pirate2bis },
    { who:"maitre", text:"Plusieurs stratégies, moussaillon :<br>• vendre moins cher<br>• boîtes en bois luxe<br>• grande boutique visible<br>• aller chez les clients", anchor: pirate5bis },
    { who:"apprenti", text:"Ahhh… donc je choisis la meilleure stratégie selon mes clients !", anchor: pirate2bis },
    { who:"maitre", text:"Exactement ! Observe, teste, et deviens le pirate que tout le monde veut rencontrer.", anchor: pirate5bis },
    { who:"apprenti", text:"MERCI capitaine !", anchor: pirate2bis },
    // dernière bulle avec le bouton
    { who:"maitre", text:"Tu es prêt ? Alors prouve-le maintenant !", anchor: pirate5bis, last:true }
  ];

  /* ============================
     🗨️ CREATION BULLE
  ============================ */
  function showDialogue() {

    // retirer bulle précédente
    const oldBubble = document.querySelector(".dialogue-bubble");
    if (oldBubble) oldBubble.remove();

    if (dialogueStep >= dialogues.length) return;

    const d = dialogues[dialogueStep];

    const bubble = document.createElement("div");
    bubble.classList.add("dialogue-bubble");

    // nom en gras séparé
    const speaker =
      d.who === "maitre"
      ? "<strong>Maître Pirate</strong><hr>"
      : "<strong>Moussaillon</strong><hr>";

    bubble.innerHTML = `
      ${speaker}
      ${d.text}
    `;

    // positionner près du pirate concerné
    const rect = d.anchor.getBoundingClientRect();
    bubble.style.position = "absolute";
    bubble.style.left = rect.left + "px";
    bubble.style.top = (rect.top - 120) + "px";
    bubble.style.maxWidth = "320px";
    bubble.style.padding = "12px";
    bubble.style.background = "white";
    bubble.style.borderRadius = "14px";
    bubble.style.zIndex = "50";

    // bouton seulement sur dernière bulle
    if (d.last) {
      const btn = document.createElement("button");
      btn.textContent = "Ok, j’ai compris";
      btn.style.marginTop = "10px";
      btn.style.padding = "8px 14px";
      btn.style.fontWeight = "bold";
      btn.style.borderRadius = "8px";
      btn.style.cursor = "pointer";

      btn.addEventListener("click", () => {
        bubble.remove();
        launchLoaderThenMiniGame();
      });

      bubble.appendChild(btn);
    } else {
      // passage au dialogue suivant en cliquant sur la bulle
      bubble.addEventListener("click", () => {
        dialogueStep++;
        showDialogue();
      });
    }

    document.body.appendChild(bubble);
  }

  showDialogue();

  /* ============================
     ⏳ LOADER + TEXTE CLIGNOTANT
  ============================ */
  function launchLoaderThenMiniGame() {

    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.left = 0;
    overlay.style.top = 0;
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "black";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.flexDirection = "column";
    overlay.style.zIndex = 200;
    overlay.style.animation = "fadein 1s forwards";

    const msg = document.createElement("div");
    msg.innerHTML = "Gagne ce mini-jeu pour continuer ta quête";
    msg.style.color = "white";
    msg.style.fontSize = "28px";
    msg.style.fontWeight = "bold";
    msg.style.textAlign = "center";
    msg.style.animation = "blink 1s infinite";

    overlay.appendChild(msg);
    document.body.appendChild(overlay);

    // effet faisceau jaune
    overlay.style.boxShadow = "0 0 80px 20px yellow inset";

    setTimeout(() => {
      overlay.remove();
      startMiniGame();
    }, 2500);
  }

  /* ============================
     🎮 MINI-JEU (SIMPLE DEMO)
  ============================ */
  // MINI-JEU
 const steps = [
    { question: "Où les pirates ont-ils trouvé leurs pierres ?", answers: ["Dans un coffre dans une grotte secrète","Ils les ont achetées au marché","La tante les leur a données"], correct: 0 },
    { question: "Qui fait partie de l'équipage pirate ?", answers: ["Toi et les deux moussaillons","Juste le capitaine","Toute la famille pirate"], correct: 0 },
    { question: "Quel est le but du projet des pirates ?", answers: ["Construire un bateau","Partir en vacances","Garder les pierres pour décorer la cale"], correct: 0 },
    { question: "Qu’est-ce que les pirates doivent observer sur le marché ?", answers: ["Nos pierres","Les concurrents","La météo"], correct: 0,1 },
    { question: "Que doivent-ils décrire pour leurs pierres ?", answers: ["Caractéristiques, nombre, qualités et défauts","Seulement la couleur","Seulement la taille"], correct: 0,1,2 },
    { question: "À quoi sert le modèle économique ?", answers: ["Savoir combien de pierres vendre pour acheter le bateau","Savoir qui fait la vaisselle","Compter les mouettes"], correct: 0 },
    { question: "Quelle stratégie les différencie des autres ?", answers: ["Vendre les pierres dans des boîtes en bois","Crier très fort au marché","Vendre sans dire le prix"], correct: 0 },
    { question: "Qu’est-ce que le plan financier ?", answers: ["Un document qui prévoit les dépenses et les gains","Une carte au trésor","Une chanson de pirates"], correct: 0 },
    { question: "À quoi sert le statut juridique ?", answers: ["À dire comment l’activité pirate est organisée légalement","À choisir le nom du perroquet","À fabriquer des épées"], correct: 0 }
  ];

  let currentStep=0;

  function showStep(){
    if(currentStep<steps.length){
      const stepObj=steps[currentStep];
      gameQuestion.textContent=stepObj.question;
      gameAnswers.innerHTML=""; gameFeedback.textContent="";
      stepObj.answers.forEach((ans,i)=>{
        const btn=document.createElement("button");
        btn.textContent=ans;
        btn.addEventListener("click",()=> handleAnswer(i));
        gameAnswers.appendChild(btn);
      });
    } else showVictory();
  }

  function handleAnswer(i){
    if(i===steps[currentStep].correct){
      gameFeedback.textContent="✅ Bonne réponse !";
      setTimeout(()=>{currentStep++; showStep();},700);
    } else gameFeedback.textContent="❌ Essaie encore !";
  }

  function launchMiniGame(){
    miniGameContainer.style.display="flex"; miniGameContainer.style.opacity=1; currentStep=0; showStep();
  }

  //

  /* ============================
     🎉 PANEL VICTOIRE
  ============================ */
  function showWinPanel() {

    const panel = document.createElement("div");
    panel.classList.add("win-panel");

    panel.innerHTML = `
      🎉<br>
      <strong>Bravo !</strong><br>
      Tu as gagné <strong>5000 PO 💰</strong>
    `;

    document.body.appendChild(panel);

    // feu d'artifice derrière
    setTimeout(() => {
      launchCoinFireworks();
    }, 200);
  }

  /* ============================
     🪙 FEU D’ARTIFICE PIECES D’OR
  ============================ */
  function launchCoinFireworks() {

    const fireContainer = document.createElement("div");
    fireContainer.classList.add("coin-fireworks");
    document.body.appendChild(fireContainer);

    for (let i = 0; i < 35; i++) {

      const coin = document.createElement("div");
      coin.classList.add("coin");
      coin.textContent = "🪙";

      coin.style.left = Math.random() * 100 + "%";
      coin.style.top = Math.random() * 40 + "%";
      coin.style.animationDelay = (Math.random() * 0.6) + "s";

      fireContainer.appendChild(coin);

      setTimeout(() => coin.remove(), 2200);
    }

    setTimeout(() => fireContainer.remove(), 2500);
  }

});
