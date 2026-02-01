document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     🎬 VIDÉO INTRO + ⏳ LOADING
  ===================================================== */
  const videoContainer = document.getElementById("videoContainer");
  const video = document.getElementById("questVideo");
  const skipBtn = document.getElementById("skipVideo");

  const scene = document.getElementById("scene");
  const loaderGame = document.getElementById("loaderGame");

  // ⏳ indicateur vidéo
  const videoLoader = document.createElement("div");
  videoLoader.innerText = "⏳";
  videoLoader.style.position = "absolute";
  videoLoader.style.fontSize = "48px";
  videoLoader.style.color = "gold";
  videoLoader.style.zIndex = "4000";
  videoContainer.appendChild(videoLoader);

  video.addEventListener("canplaythrough", () => {
    videoLoader.remove();
  });

  skipBtn.onclick = endVideo;
  video.onended = endVideo;

  function endVideo(){
    videoContainer.style.display = "none";
    scene.style.display = "block";
  }

  /* =====================================================
     🏴‍☠️ DIALOGUES INTRO
  ===================================================== */
  const pirateLegal = document.getElementById("pirateLegal");
  const dLegal = document.getElementById("dialogueLegal");
  const dPirate = document.getElementById("dialoguePirate");

  const introDialogues = [
    { el: dLegal, text: "Pour vendre nos pierres légalement, nous devons nous inscrire comme auto-entrepreneurs à l’URSSAF." },
    { el: dPirate, text: "Sans inscription, même un commerce honnête devient illégal." },
    { el: dLegal, text: "Je vais t’expliquer les règles du royaume, étape par étape." }
  ];

  let introIndex = 0;

  pirateLegal.onclick = () => {
    showIntroDialogue();
  };

  function showIntroDialogue(){
    if(introIndex >= introDialogues.length){
      startMiniGame1();
      return;
    }

    const cur = introDialogues[introIndex];
    cur.el.innerHTML = `<p>${cur.text}</p>`;
    cur.el.style.display = "block";

    cur.el.onclick = () => {
      cur.el.style.display = "none";
      cur.el.onclick = null;
      introIndex++;
      showIntroDialogue();
    };
  }

  /* =====================================================
     🎮 MINI-JEU 1 — AUTO-ENTREPRENEUR (QCM MULTI)
  ===================================================== */
  const miniGame = document.getElementById("miniGame");
  const gameContent = document.getElementById("gameContent");

  const questions = [
    {
      q: "Où dois-je m’inscrire pour être auto-entrepreneur ?",
      answers: ["Sur le site de l’URSSAF", "À la banque", "À la mairie"],
      good: [0]
    },
    {
      q: "Qu’est-ce que l’ACRE ?",
      answers: [
        "L’aide à la création ou à la reprise d’une entreprise",
        "Permet une réduction partielle des cotisations sociales",
        "À demander lors de la création ou sous 45 jours"
      ],
      good: [0,1,2]
    },
    {
      q: "Quand dois-je déclarer mes gains ?",
      answers: ["Uniquement si je gagne", "Tous les mois", "Même si les gains sont à 0"],
      good: [1,2]
    }
  ];

  let qIndex = 0;
  let selected = [];

  function startMiniGame1(){
    scene.classList.add("sceneDark");
    loaderGame.setAttribute("data-text","Chargement du mini jeu..");
    loaderGame.style.display = "flex";

    setTimeout(()=>{
      loaderGame.style.display = "none";
      miniGame.style.display = "block";
      showQuestion();
    },1000);
  }

  function showQuestion(){
    selected = [];
    const q = questions[qIndex];
    gameContent.innerHTML = `<p>${q.q}</p>`;

    q.answers.forEach((txt,i)=>{
      const btn = document.createElement("button");
      btn.textContent = txt;
      btn.onclick = () => toggleAnswer(btn,i);
      gameContent.appendChild(btn);
    });

    const validate = document.createElement("button");
    validate.textContent = "Valider";
    validate.onclick = checkAnswer;
    gameContent.appendChild(validate);
  }

  function toggleAnswer(btn,i){
    if(selected.includes(i)){
      selected = selected.filter(x=>x!==i);
      btn.classList.remove("selected");
    }else{
      selected.push(i);
      btn.classList.add("selected");
    }
  }

  function checkAnswer(){
    const good = questions[qIndex].good.sort().join(",");
    const user = selected.sort().join(",");

    if(good === user){
      qIndex++;
      qIndex < questions.length ? showQuestion() : endMiniGame1();
    }else{
      vibratePage();
    }
  }

  function vibratePage(){
    document.body.classList.add("shake");
    setTimeout(()=>document.body.classList.remove("shake"),350);
  }

  function endMiniGame1(){
    miniGame.style.display = "none";
    scene.classList.remove("sceneDark");
    explodeGems();
    setTimeout(startDialogues2,1200);
  }

  /* =====================================================
     💬 DIALOGUES 2 — STATUTS
  ===================================================== */
  const dialogues2 = [
    { el: dLegal, text: "Quand ton trésor grandit, il faut parfois créer une société." },
    { el: dPirate, text: "Mais comment choisir le bon statut ?" },
    { el: dLegal, text: "Je vais t’aider à décider." }
  ];

  let d2Index = 0;

  function startDialogues2(){
    showDialogue2();
  }

  function showDialogue2(){
    if(d2Index >= dialogues2.length){
      startMiniGame2();
      return;
    }

    const cur = dialogues2[d2Index];
    cur.el.innerHTML = `<p>${cur.text}</p>`;
    cur.el.style.display = "block";

    cur.el.onclick = ()=>{
      cur.el.style.display = "none";
      cur.el.onclick = null;
      d2Index++;
      showDialogue2();
    };
  }

  /* =====================================================
     🎮 MINI-JEU 2 — STATUT JURIDIQUE
  ===================================================== */
  const miniGame2 = document.getElementById("miniGame2");
  const game2Content = document.getElementById("game2Content");

  function startMiniGame2(){
    scene.classList.add("sceneDark");
    miniGame2.style.display = "block";
    showQ2_1();
  }

  function showQ2_1(){
    game2Content.innerHTML = `
      <p>Crées-tu ta société seul ou en groupe ?</p>
      <button onclick="window.__solo()">Oui</button>
      <button onclick="window.__group()">Non</button>
    `;
  }

  window.__solo = () => {
    game2Content.innerHTML += `
      <div class="infoBox">
        EI – Simple<br>
        EURL – Protège le patrimoine<br>
        SASU – Image professionnelle
      </div>`;
    setTimeout(showQ2_2,1200);
  };

  window.__group = () => {
    game2Content.innerHTML += `
      <div class="infoBox">
        SARL – Sécurisée<br>
        SAS – Flexible
      </div>`;
    setTimeout(showQ2_2,1200);
  };

  function showQ2_2(){
    game2Content.innerHTML = `
      <p>Pourquoi veux-tu changer de statut ?</p>
      <button onclick="showQ2_3()">Simplifier mes démarches</button>
      <button onclick="showQ2_3()">Plus de rentabilité</button>
      <button onclick="showQ2_3()">Image luxueuse</button>
      <button onclick="showQ2_3()">Projet à risques</button>
      <button onclick="showQ2_3()">Travail en équipe</button>
    `;
  }

  function showQ2_3(){
    game2Content.innerHTML = `
      <p>Quand dois-tu quitter l’auto-entrepreneuriat ?</p>
      <button onclick="endMiniGame2(true)">CA &gt; 60-70k</button>
      <button onclick="endMiniGame2(true)">Embauche / protection</button>
      <button onclick="endMiniGame2(true)">Charges faibles</button>
      <button onclick="vibratePage()">Quand je le décide</button>
    `;
  }

  window.endMiniGame2 = (success)=>{
    if(!success){ vibratePage(); return; }

    miniGame2.style.display = "none";
    scene.classList.remove("sceneDark");
    explodeGems();
    setTimeout(showReward,1200);
  };

  /* =====================================================
     💎 GEMS
  ===================================================== */
  function explodeGems(){
    const g = document.getElementById("gems");
    g.innerHTML = "";
    for(let i=0;i<120;i++){
      const gem = document.createElement("div");
      gem.className = "gem";
      gem.style.left = "50%";
      gem.style.top = "50%";
      gem.style.setProperty("--x",`${Math.random()*600-300}px`);
      gem.style.setProperty("--y",`${Math.random()*600-300}px`);
      g.appendChild(gem);
    }
    setTimeout(()=>g.innerHTML="",1600);
  }

  /* =====================================================
     🎁 RÉCOMPENSE
  ===================================================== */
  const reward = document.getElementById("reward");

  function showReward(){
    reward.style.display = "flex";
    setTimeout(()=>reward.style.display="none",3000);
  }

});
