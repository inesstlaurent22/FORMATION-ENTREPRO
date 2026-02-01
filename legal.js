document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     🎬 VIDÉO — CONTRÔLES
  ===================================================== */
  const videoContainer = document.getElementById("videoContainer");
  const video = document.getElementById("questVideo");
  const skipBtn = document.getElementById("skipVideo");
  const soundBtn = document.getElementById("soundBtn");
  const scene = document.getElementById("scene");

  video.muted = true;
  soundBtn.textContent = "🔊";

  soundBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    video.muted = !video.muted;
    soundBtn.textContent = video.muted ? "🔊" : "🔈";
    video.play().catch(() => {});
  });

  skipBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    endVideo();
  });

  video.addEventListener("ended", endVideo);

  function endVideo(){
    video.pause();
    videoContainer.style.display = "none";
    scene.style.display = "block";
    enablePirate();
  }

  /* =====================================================
     🏴‍☠️ PIRATE LEGAL — ANIMATION
  ===================================================== */
  const pirateLegal = document.getElementById("pirateLegal");

  function enablePirate(){
    pirateLegal.classList.remove("noGlow");
    pirateLegal.onclick = startDialogues1;
  }

  function disablePirate(){
    pirateLegal.classList.add("noGlow");
    pirateLegal.onclick = null;
  }

  /* =====================================================
     💬 DIALOGUES — BLOC 1
  ===================================================== */
  const dLegal = document.getElementById("dialogueLegal");
  const dPirate = document.getElementById("dialoguePirate");

  const dialoguesBlock1 = [
    { el: dLegal, text: "Pour vendre nos pierres légalement, nous devons nous inscrire comme auto-entrepreneurs à l’URSSAF." },
    { el: dPirate, text: "Sans inscription, même un commerce honnête devient illégal." },
    { el: dLegal, text: "Voyons maintenant tes obligations." }
  ];

  let dialogueIndex = 0;

  function startDialogues1(){
    disablePirate();
    dialogueIndex = 0;
    showDialogues(dialoguesBlock1, startMiniGame1);
  }

  /* =====================================================
     💬 DIALOGUES — BLOC 2
  ===================================================== */
  const dialoguesBlock2 = [
    { el: dLegal, text: "L’auto-entrepreneuriat est une excellente base…" },
    { el: dPirate, text: "…mais quand le trésor grandit, il faut changer de statut." },
    { el: dLegal, text: "Je vais t’aider à choisir le bon." }
  ];

  function startDialogues2(){
    dialogueIndex = 0;
    showDialogues(dialoguesBlock2, startMiniGame2);
  }

  function showDialogues(dialogues, callback){
    if(dialogueIndex >= dialogues.length){
      hideDialogs();
      callback();
      return;
    }

    const cur = dialogues[dialogueIndex];
    cur.el.innerHTML = `<p>${cur.text}</p>`;
    cur.el.style.display = "block";

    cur.el.onclick = () => {
      cur.el.style.display = "none";
      dialogueIndex++;
      showDialogues(dialogues, callback);
    };
  }

  function hideDialogs(){
    dLegal.style.display = "none";
    dPirate.style.display = "none";
  }

  /* =====================================================
     🎮 MINI-JEU 1 — QCM
  ===================================================== */
  const miniGame1 = document.getElementById("miniGame");

  const questions = [
    {
      q: "Où dois-je m’inscrire pour être auto-entrepreneur ?",
      good: ["Sur le site de l’URSSAF"],
      bad: ["À la mairie", "À la banque"]
    },
    {
      q: "Qu’est-ce que l’ACRE ?",
      good: [
        "L’aide à la création ou à la reprise d’une entreprise",
        "Une réduction partielle des cotisations sociales",
        "À demander à la création ou sous 45 jours"
      ],
      bad: ["Une taxe obligatoire"]
    },
    {
      q: "Quand dois-je déclarer mes gains ?",
      good: ["Tous les mois", "Même si les gains sont à 0"],
      bad: ["Seulement quand je gagne"]
    }
  ];

  let qIndex = 0;
  let goodCount = 0;

  function startMiniGame1(){
    scene.classList.add("sceneDark");
    miniGame1.style.display = "block";

    miniGame1.innerHTML = `
      <h3>📜 Les devoirs de l’auto-entrepreneur</h3>
      <p id="qText"></p>
      <div id="qChoices"></div>
    `;

    qIndex = 0;
    showQuestion();
  }

  function showQuestion(){
    goodCount = 0;
    document.getElementById("qText").textContent = questions[qIndex].q;
    const qChoices = document.getElementById("qChoices");
    qChoices.innerHTML = "";

    const answers = [
      ...questions[qIndex].good.map(t => ({ t, ok:true })),
      ...questions[qIndex].bad.map(t => ({ t, ok:false }))
    ].sort(() => Math.random() - 0.5);

    answers.forEach(a => {
      const btn = document.createElement("button");
      btn.textContent = a.t;

      btn.onclick = () => {
        if(a.ok){
          btn.classList.add("selectedAnswer");
          btn.disabled = true;
          goodCount++;
          if(goodCount === questions[qIndex].good.length){
            qIndex++;
            qIndex < questions.length ? showQuestion() : endMiniGame1();
          }
        } else {
          shake();
        }
      };

      qChoices.appendChild(btn);
    });
  }

  function endMiniGame1(){
    miniGame1.style.display = "none";
    scene.classList.remove("sceneDark");
    startDialogues2();
  }

  /* =====================================================
     🎮 MINI-JEU 2 — STATUT JURIDIQUE
  ===================================================== */
  const miniGame2 = document.getElementById("miniGame2");
  const game2Content = document.getElementById("game2Content");

  function startMiniGame2(){
    scene.classList.add("sceneDark");
    miniGame2.style.display = "block";

    game2Content.innerHTML = `
      <p>Quel est ton objectif principal ?</p>
      <div class="mg2-layout">
        <div class="mg2-left">
          <button onclick="selectStatut('EI')">Simplicité</button>
          <button onclick="selectStatut('EURL')">Rentabilité</button>
          <button onclick="selectStatut('SASU')">Image premium</button>
          <button onclick="selectStatut('SARL')">Projet à risques</button>
          <button onclick="selectStatut('SAS')">Travail en équipe</button>
        </div>
        <div class="mg2-right" id="mg2Right"></div>
      </div>
    `;
  }

  window.selectStatut = (statut) => {
    document.getElementById("mg2Right").innerHTML =
      `<div class="infoBox">Statut conseillé : <strong>${statut}</strong></div>`;
  };

  /* =====================================================
     📳 SHAKE
  ===================================================== */
  function shake(){
    document.body.classList.add("shake");
    setTimeout(() => document.body.classList.remove("shake"), 350);
  }

});
