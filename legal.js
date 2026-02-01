document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     🎬 VIDÉO INTRO
  ===================================================== */
  const videoContainer = document.getElementById("videoContainer");
  const video = document.getElementById("questVideo");
  const skipBtn = document.getElementById("skipVideo");

  const loader = document.getElementById("loader");
  const loaderGame = document.getElementById("loaderGame");
  const scene = document.getElementById("scene");

  skipBtn.onclick = endVideo;
  video.onended = endVideo;

  function endVideo(){
    videoContainer.style.display = "none";
    showLoader(loader, "Chargement..", 1200, () => {
      scene.style.display = "block";
    });
  }

  /* =====================================================
     ⏳ LOADER UTILITAIRE
  ===================================================== */
  function showLoader(el, text, duration, callback){
    el.setAttribute("data-text", text);
    el.style.display = "flex";
    setTimeout(() => {
      el.style.display = "none";
      if(callback) callback();
    }, duration);
  }

  /* =====================================================
     🏴‍☠️ DIALOGUES INTRO (CLIQUABLES)
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

  pirateLegal.addEventListener("click", () => {
    pirateLegal.style.filter = "none";
    pirateLegal.style.transform = "scale(1)";
    showIntroDialogue();
  });

  function showIntroDialogue(){
    if(introIndex >= introDialogues.length){
      startMiniGame1();
      return;
    }

    const current = introDialogues[introIndex];
    current.el.innerHTML = `<p>${current.text}</p>`;
    current.el.style.display = "block";

    current.el.onclick = () => {
      current.el.style.display = "none";
      current.el.onclick = null;
      introIndex++;
      showIntroDialogue();
    };
  }

  /* =====================================================
     🎮 MINI-JEU 1 — AUTO-ENTREPRENEUR
  ===================================================== */
  const miniGame = document.getElementById("miniGame");
  const gameContent = document.getElementById("gameContent");

  const questions1 = [
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

  let q1Index = 0;
  let score1 = 0;

  function startMiniGame1(){
    scene.classList.add("sceneDark");
    showLoader(loaderGame, "Chargement du mini jeu..", 1000, () => {
      miniGame.style.display = "block";
      showQuestion1();
    });
  }

  function showQuestion1(){
    const q = questions1[q1Index];
    gameContent.innerHTML = `<p>${q.q}</p>`;

    q.answers.forEach((txt, i) => {
      const btn = document.createElement("button");
      btn.textContent = txt;
      btn.onclick = () => {
        if(q.good.includes(i)) score1++;
        q1Index++;
        q1Index < questions1.length ? showQuestion1() : endMiniGame1();
      };
      gameContent.appendChild(btn);
    });
  }

  function endMiniGame1(){
    miniGame.style.display = "none";
    scene.classList.remove("sceneDark");

    if(score1 === questions1.length){
      explodeGems();
      setTimeout(startDialogues2, 1200);
    }
  }

  /* =====================================================
     💬 DIALOGUES 2 — TRANSITION STATUTS
  ===================================================== */
  const dialogues2 = [
    { el: dLegal, text: "L’auto-entrepreneuriat est un bon départ… mais parfois, créer une société devient nécessaire." },
    { el: dPirate, text: "Il existe plusieurs statuts juridiques selon ta situation." },
    { el: dLegal, text: "Je vais t’aider à choisir, en te posant quelques questions." }
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

    cur.el.onclick = () => {
      cur.el.style.display = "none";
      cur.el.onclick = null;
      d2Index++;
      showDialogue2();
    };
  }

  /* =====================================================
     🎮 MINI-JEU 2 — CHOIX DU STATUT
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

  window.__solo = function(){
    game2Content.innerHTML += `
      <div class="infoBox">
        <b>Tu peux choisir :</b><br><br>
        EI – Entreprise Individuelle<br>
        EURL – Protection du patrimoine<br>
        SASU – Image professionnelle et flexible
      </div>
    `;
    setTimeout(showQ2_2, 1200);
  };

  window.__group = function(){
    game2Content.innerHTML += `
      <div class="infoBox">
        <b>Tu peux choisir :</b><br><br>
        SARL – Structure encadrée<br>
        SAS – Grande flexibilité
      </div>
    `;
    setTimeout(showQ2_2, 1200);
  };

  function showQ2_2(){
    game2Content.innerHTML = `
      <p>Pourquoi veux-tu changer de statut juridique ?</p>
      <button onclick="window.__info('EI – Entrepreneur Individuel')">Simplifier mes démarches</button>
      <button onclick="window.__info('EURL – Plus de rentabilité')">Pour plus de rentabilité</button>
      <button onclick="window.__info('SASU – Image luxueuse')">Image luxueuse</button>
      <button onclick="window.__info('SARL – Projet à risques')">Projet à risques avec investisseurs</button>
      <button onclick="window.__info('SAS – Stabilité en équipe')">Travail en équipe</button>
    `;
  }

  window.__info = function(txt){
    game2Content.innerHTML += `<div class="infoBox">${txt}</div>`;
    setTimeout(showQ2_3, 1200);
  };

  function showQ2_3(){
    game2Content.innerHTML = `
      <p>Quand dois-tu passer de l’auto-entrepreneur à une entreprise ?</p>
      <button onclick="endMiniGame2(true)">CA > 60-70k</button>
      <button onclick="endMiniGame2(true)">Embauche et protection</button>
      <button onclick="endMiniGame2(true)">Charges faibles vs CA</button>
      <button onclick="endMiniGame2(false)">Quand je le décide</button>
    `;
  }

  window.endMiniGame2 = function(success){
    miniGame2.style.display = "none";
    scene.classList.remove("sceneDark");

    if(success){
      explodeGems();
      setTimeout(showReward, 1200);
    }
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
      gem.style.setProperty("--x", `${Math.random()*600-300}px`);
      gem.style.setProperty("--y", `${Math.random()*600-300}px`);
      g.appendChild(gem);
    }
    setTimeout(()=>g.innerHTML="",1600);
  }

  /* =====================================================
     🎁 RÉCOMPENSE FINALE
  ===================================================== */
  const reward = document.getElementById("reward");

  function showReward(){
    reward.style.display = "flex";
    setTimeout(()=>{
      reward.style.display = "none";
      // retour scène libre pour suite KIT IN
    },3000);
  }

});
