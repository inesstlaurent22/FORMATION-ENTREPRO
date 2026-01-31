document.addEventListener("DOMContentLoaded", () => {

  const video = document.getElementById("questVideo");
  const skipBtn = document.getElementById("skipVideo");
  const loader = document.getElementById("loader");
  const loaderGame = document.getElementById("loaderGame");
  const scene = document.getElementById("scene");

  const pirateLegal = document.getElementById("pirateLegal");
  const dLegal = document.getElementById("dialogueLegal");
  const dPirate = document.getElementById("dialoguePirate");

  const miniGame = document.getElementById("miniGame");
  const gameContent = document.getElementById("gameContent");

  /* ===== VIDÉO ===== */
  skipBtn.onclick = endVideo;
  video.onended = endVideo;

  function endVideo() {
    document.getElementById("videoContainer").style.display = "none";
    loader.style.display = "flex";
    setTimeout(() => {
      loader.style.display = "none";
      scene.style.display = "block";
    }, 1500);
  }

  /* ===== DIALOGUES 1 ===== */
  pirateLegal.onclick = () => {
    pirateLegal.style.filter = "none";
    pirateLegal.style.boxShadow = "none";

    dLegal.innerText = "Pour vendre nos pierres légalement, nous devons nous inscrire comme auto-entrepreneurs à l’URSSAF.";
    dPirate.innerText = "Sans inscription, même un commerce honnête devient illégal.";

    dLegal.style.display = "block";
    setTimeout(() => dPirate.style.display = "block", 2000);
    setTimeout(startMiniGame, 4500);
  };

  /* ===== MINI-JEU ===== */
  const questions = [
    {
      q: "Où dois-je m’inscrire pour être auto-entrepreneur ?",
      a: ["Sur le site de l’URSSAF", "À la mairie", "À la banque"],
      good: [0]
    },
    {
      q: "Qu’est-ce que l’ACRE ?",
      a: [
        "L’aide à la création ou à la reprise d’une entreprise",
        "Permet une réduction partielle des cotisations sociales",
        "À demander lors de la création ou sous 45 jours"
      ],
      good: [0,1,2]
    },
    {
      q: "Quand dois-je déclarer mes gains ?",
      a: ["Uniquement si je gagne", "Tous les mois", "Même si les gains sont à 0"],
      good: [1,2]
    }
  ];

  let index = 0;
  let score = 0;

  function startMiniGame() {
    loaderGame.style.display = "flex";
    setTimeout(() => {
      loaderGame.style.display = "none";
      miniGame.style.display = "flex";
      showQuestion();
    }, 1500);
  }

  function showQuestion() {
    const q = questions[index];
    gameContent.innerHTML = `<p>${q.q}</p>`;
    q.a.forEach((txt, i) => {
      const btn = document.createElement("button");
      btn.innerText = txt;
      btn.onclick = () => {
        if (q.good.includes(i)) score++;
        index++;
        index < questions.length ? showQuestion() : endGame();
      };
      gameContent.appendChild(btn);
    });
  }

  function endGame() {
    miniGame.style.display = "none";
    if (score === questions.length) {
      explodeGems();
      setTimeout(dialogues2, 1200);
    }
  }

  /* ===== GEMS ===== */
  function explodeGems() {
    const g = document.getElementById("gems");
    for (let i = 0; i < 120; i++) {
      const gem = document.createElement("div");
      gem.className = "gem";
      gem.style.left = "50%";
      gem.style.top = "50%";
      gem.style.setProperty("--x", `${Math.random()*600-300}px`);
      gem.style.setProperty("--y", `${Math.random()*600-300}px`);
      g.appendChild(gem);
    }
    setTimeout(() => g.innerHTML = "", 1500);
  }

  /* ===== DIALOGUES 2 ===== */
  function dialogues2() {
    dLegal.innerText = "L’ACRE est utile quand l’activité commence à faire des bénéfices. Sinon, l’avantage est perdu.";
    dPirate.innerText = "Et même avec 0 gain, la déclaration est obligatoire. Selon le chiffre d’affaires, la SA ou la SARL peuvent devenir plus adaptées.";
  }

});
