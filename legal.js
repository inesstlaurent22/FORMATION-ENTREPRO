document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     🎬 VIDÉO
  ===================================================== */
  const videoContainer = document.getElementById("videoContainer");
  const video = document.getElementById("questVideo");
  const skipBtn = document.getElementById("skipVideo");
  const soundBtn = document.getElementById("soundBtn");
  const scene = document.getElementById("scene");

  video.muted = true;
  soundBtn.textContent = "🔊";

  soundBtn.onclick = (e) => {
    e.stopPropagation();
    video.muted = !video.muted;
    soundBtn.textContent = video.muted ? "🔊" : "🔈";
    video.play().catch(()=>{});
  };

  skipBtn.onclick = endVideo;
  video.onended = endVideo;

  function endVideo(){
    video.pause();
    videoContainer.style.display = "none";
    scene.style.display = "block";
    enablePirate();
  }

  /* =====================================================
     🏴‍☠️ PIRATE LEGAL
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

  const dialogues1 = [
    { el:dLegal, text:"Pour vendre nos pierres légalement, nous devons nous inscrire comme auto-entrepreneurs à l’URSSAF." },
    { el:dPirate, text:"Sans inscription, même un commerce honnête devient illégal." },
    { el:dLegal, text:"Passons aux obligations." }
  ];

  let dIndex = 0;

  function startDialogues1(){
    disablePirate();
    dIndex = 0;
    runDialogues(dialogues1, startMiniGame1);
  }

  /* =====================================================
     💬 DIALOGUES — BLOC 2
  ===================================================== */
  const dialogues2 = [
    { el:dLegal, text:"L’auto-entrepreneuriat est un bon début…" },
    { el:dPirate, text:"…mais quand le trésor grandit, il faut évoluer." },
    { el:dLegal, text:"Choisissons le bon statut." }
  ];

  function startDialogues2(){
    dIndex = 0;
    runDialogues(dialogues2, startMiniGame2);
  }

  function runDialogues(list, callback){
    if(dIndex >= list.length){
      hideDialogs();
      callback();
      return;
    }

    const cur = list[dIndex];
    cur.el.innerHTML = `<p>${cur.text}</p>`;
    cur.el.style.display = "block";

    cur.el.onclick = () => {
      cur.el.style.display = "none";
      dIndex++;
      runDialogues(list, callback);
    };
  }

  function hideDialogs(){
    dLegal.style.display = "none";
    dPirate.style.display = "none";
  }

  /* =====================================================
     🎮 MINI-JEU 1
  ===================================================== */
  const miniGame1 = document.getElementById("miniGame");

  const questions = [
    {
      q:"Où dois-je m’inscrire ?",
      good:["Sur le site de l’URSSAF"],
      bad:["À la mairie","À la banque"]
    },
    {
      q:"Qu’est-ce que l’ACRE ?",
      good:[
        "Aide à la création ou reprise d’entreprise",
        "Réduction partielle des cotisations",
        "À demander à la création ou sous 45 jours"
      ],
      bad:["Une taxe"]
    },
    {
      q:"Quand déclarer mes gains ?",
      good:["Tous les mois","Même à 0"],
      bad:["Uniquement si je gagne"]
    }
  ];

  let q = 0, good = 0;

  function startMiniGame1(){
    scene.classList.add("sceneDim");
    miniGame1.style.display = "block";

    miniGame1.innerHTML = `
      <h3>📜 Devoirs de l’auto-entrepreneur</h3>
      <p id="qText"></p>
      <div id="qChoices"></div>
    `;

    q = 0;
    showQuestion();
  }

  function showQuestion(){
    good = 0;
    document.getElementById("qText").textContent = questions[q].q;
    const box = document.getElementById("qChoices");
    box.innerHTML = "";

    const answers = [
      ...questions[q].good.map(t=>({t,ok:true})),
      ...questions[q].bad.map(t=>({t,ok:false}))
    ].sort(()=>Math.random()-0.5);

    answers.forEach(a=>{
      const b = document.createElement("button");
      b.textContent = a.t;
      b.onclick = ()=>{
        if(a.ok){
          b.classList.add("selectedAnswer");
          b.disabled = true;
          good++;
          if(good === questions[q].good.length){
            q++;
            q < questions.length ? showQuestion() : endMiniGame1();
          }
        } else shake();
      };
      box.appendChild(b);
    });
  }

  function endMiniGame1(){
    miniGame1.style.display = "none";
    scene.classList.remove("sceneDim");
    startDialogues2();
  }

  /* =====================================================
     🎮 MINI-JEU 2 (CORRIGÉ)
  ===================================================== */
  const miniGame2 = document.getElementById("miniGame2");
  const game2Content = document.getElementById("game2Content");

  function startMiniGame2(){
    scene.classList.add("sceneDim");
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

  window.selectStatut = (s) => {
    document.getElementById("mg2Right").innerHTML =
      `<div class="infoBox">Statut conseillé : <strong>${s}</strong></div>`;
  };

  /* =====================================================
     📳 SHAKE
  ===================================================== */
  function shake(){
    document.body.classList.add("shake");
    setTimeout(()=>document.body.classList.remove("shake"),350);
  }

});
