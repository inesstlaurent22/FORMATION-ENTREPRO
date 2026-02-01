document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     🎬 VIDEO INTRO
  ===================================================== */
  const videoContainer = document.getElementById("videoContainer");
  const video = document.getElementById("questVideo");
  const skipBtn = document.getElementById("skipVideo");
  const scene = document.getElementById("scene");

  skipBtn.onclick = endVideo;
  video.onended = endVideo;

  function endVideo(){
    videoContainer.style.display = "none";
    scene.style.display = "block";
    startDialogue1();
  }

  /* =====================================================
     🏴‍☠️ DIALOGUE 1 — INTRO LÉGAL
  ===================================================== */
  const pirateLegal = document.getElementById("pirateLegal");
  const dLegal = document.getElementById("dialogueLegal");
  const dPirate = document.getElementById("dialoguePirate");

  const dialogue1 = [
    { el: dLegal, text: "Pour vendre nos pierres légalement, nous devons nous inscrire comme auto-entrepreneurs à l’URSSAF." },
    { el: dPirate, text: "Sans inscription, même un commerce honnête devient illégal." },
    { el: dLegal, text: "Je vais t’expliquer les règles du royaume." }
  ];

  let d1Index = 0;

  function startDialogue1(){
    pirateLegal.onclick = showDialogue1;
  }

  function showDialogue1(){
    if(d1Index >= dialogue1.length){
      dLegal.style.display = "none";
      dPirate.style.display = "none";
      startMiniGame1();
      return;
    }

    const cur = dialogue1[d1Index];
    cur.el.innerHTML = `<p>${cur.text}</p>`;
    cur.el.style.display = "block";

    cur.el.onclick = () => {
      cur.el.style.display = "none";
      cur.el.onclick = null;
      d1Index++;
      showDialogue1();
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
  let selected = [];

  function startMiniGame1(){
    scene.classList.add("sceneDark");
    miniGame.style.display = "block";
    showQuestion1();
  }

  function showQuestion1(){
    selected = [];
    const q = questions1[q1Index];
    gameContent.innerHTML = `<p>${q.q}</p>`;

    q.answers.forEach((txt,i)=>{
      const btn = document.createElement("button");
      btn.textContent = txt;
      btn.onclick = () => toggle(btn,i);
      gameContent.appendChild(btn);
    });

    const validate = document.createElement("button");
    validate.textContent = "Valider";
    validate.onclick = checkAnswer1;
    gameContent.appendChild(validate);
  }

  function toggle(btn,i){
    btn.classList.toggle("selected");
    selected.includes(i)
      ? selected = selected.filter(x=>x!==i)
      : selected.push(i);
  }

  function checkAnswer1(){
    const good = questions1[q1Index].good.sort().join(",");
    const user = selected.sort().join(",");

    if(good === user){
      q1Index++;
      q1Index < questions1.length ? showQuestion1() : endMiniGame1();
    }else{
      shake();
    }
  }

  function endMiniGame1(){
    miniGame.style.display = "none";
    scene.classList.remove("sceneDark");
    startDialogue2();
  }

  /* =====================================================
     🏴‍☠️ DIALOGUE 2 — TRANSITION STATUTS
  ===================================================== */
  const dialogue2 = [
    { el: dLegal, text: "L’auto-entrepreneuriat est un bon départ." },
    { el: dPirate, text: "Mais quand le trésor grandit, il faut penser à créer une société." },
    { el: dLegal, text: "Je vais t’aider à choisir le bon statut juridique." }
  ];

  let d2Index = 0;

  function startDialogue2(){
    showDialogue2();
  }

  function showDialogue2(){
    if(d2Index >= dialogue2.length){
      startMiniGame2();
      return;
    }

    const cur = dialogue2[d2Index];
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
      <button onclick="window.qSolo()">Oui</button>
      <button onclick="window.qGroup()">Non</button>
    `;
  }

  window.qSolo = () => {
    game2Content.innerHTML += `<div class="infoBox">EI • EURL • SASU</div>`;
    setTimeout(showQ2_2,1200);
  };

  window.qGroup = () => {
    game2Content.innerHTML += `<div class="infoBox">SARL • SAS</div>`;
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
      <p>Quand quitter l’auto-entrepreneuriat ?</p>
      <button onclick="endMiniGame2(true)">CA &gt; 60-70k</button>
      <button onclick="endMiniGame2(true)">Embaucher / se protéger</button>
      <button onclick="endMiniGame2(true)">Charges faibles</button>
      <button onclick="shake()">Quand je le décide</button>
    `;
  }

  window.endMiniGame2 = (success)=>{
    if(!success){ shake(); return; }

    miniGame2.style.display = "none";
    scene.classList.remove("sceneDark");
    startDialogue3();
  };

  /* =====================================================
     🏴‍☠️ DIALOGUE 3 — CONCLUSION
  ===================================================== */
  const dialogue3 = [
    { el: dLegal, text: "Tu connais maintenant les règles légales du royaume." },
    { el: dPirate, text: "Notre trésor est protégé, et notre avenir aussi." },
    { el: dLegal, text: "Tu peux désormais poursuivre ton aventure." }
  ];

  let d3Index = 0;

  function startDialogue3(){
    showDialogue3();
  }

  function showDialogue3(){
    if(d3Index >= dialogue3.length){
      return;
    }

    const cur = dialogue3[d3Index];
    cur.el.innerHTML = `<p>${cur.text}</p>`;
    cur.el.style.display = "block";

    cur.el.onclick = () => {
      cur.el.style.display = "none";
      cur.el.onclick = null;
      d3Index++;
      showDialogue3();
    };
  }

  /* =====================================================
     📳 SHAKE
  ===================================================== */
  function shake(){
    document.body.classList.add("shake");
    setTimeout(()=>document.body.classList.remove("shake"),350);
  }

});
