document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     🎬 VIDÉO
  =============================== */
  const video = document.getElementById("questVideo");
  const videoContainer = document.getElementById("videoContainer");
  const toggleSoundBtn = document.getElementById("toggleSound");
  const closeVideoBtn = document.getElementById("closeVideo");

  const background = document.getElementById("background");
  const pirate5 = document.getElementById("pirate5bis");
  const pirate2 = document.getElementById("pirate2bis");

  const miniGame0 = document.getElementById("miniGame0");
  const financeGame = document.getElementById("financeGame");
  const part1 = document.getElementById("part1");
  const part2 = document.getElementById("part2");

  video.muted = true;
  video.play().catch(() => {});

  toggleSoundBtn.onclick = () => {
    video.muted = !video.muted;
    toggleSoundBtn.textContent = video.muted ? "🔇" : "🔊";
  };

  closeVideoBtn.onclick = endVideo;
  video.onended = endVideo;

  function endVideo() {
    video.pause();
    videoContainer.classList.add("hidden");

    setTimeout(() => {
      background.classList.remove("hidden");
      pirate5.classList.remove("hidden");
      pirate2.classList.remove("hidden");
      enablePirateGlow();
    }, 400);
  }

  /* ===============================
     ✨ ANIMATION PIRATE 5
  =============================== */
  function enablePirateGlow() {
    pirate5.style.filter = "drop-shadow(0 0 30px gold)";
  }

  function disablePirateGlow() {
    pirate5.style.filter = "";
  }

  /* ===============================
     💬 DIALOGUES
  =============================== */
  const dialoguesIntro = [
    { s: pirate5, t: "🏴‍☠️ Te voilà enfin…" },
    { s: pirate2, t: "Capitaine, il veut apprendre à gérer l’or !" },
    { s: pirate5, t: "Alors qu’il fasse ses preuves." }
  ];

  const dialoguesAfterMini0 = [
    { s: pirate5, t: "Bien… tu comprends les registres." },
    { s: pirate2, t: "Voyons maintenant les clients." }
  ];

  const dialoguesAfterMini1 = [
    { s: pirate5, t: "Bon choix. Tous les clients ne se valent pas." },
    { s: pirate2, t: "Passons aux résultats de la boutique." }
  ];

  const dialoguesAfterMini2 = [
    { s: pirate5, t: "Ce calcul nous mène à l’EBE." },
    { s: pirate5, t: "Il mesure la richesse créée par l’activité." }
  ];

  let dArr = [];
  let dIndex = 0;

  const bubble = document.createElement("div");
  bubble.id = "dialogueBox";
  bubble.classList.add("hidden");
  background.appendChild(bubble);

  pirate5.onclick = () => {
    disablePirateGlow();
    startDialogues(dialoguesIntro, startMiniGame0);
  };

  function startDialogues(arr, callback) {
    dArr = arr;
    dIndex = 0;
    bubble.classList.remove("hidden");
    showDialogue(callback);
  }

  function showDialogue(callback) {
    const d = dArr[dIndex];
    bubble.textContent = d.t;

    const r = d.s.getBoundingClientRect();
    bubble.style.left = r.left + r.width / 2 + "px";
    bubble.style.top = r.top - 90 + "px";
    bubble.style.transform = "translateX(-50%)";

    bubble.onclick = () => {
      dIndex++;
      if (dIndex < dArr.length) {
        showDialogue(callback);
      } else {
        bubble.classList.add("hidden");
        callback && callback();
      }
    };
  }

  /* ===============================
     📘 MINI-JEU 0 – REGISTRES
  =============================== */
  miniGame0.innerHTML = `
    <h3>📘 Épreuve des registres</h3>
    <p id="qText"></p>
    <div id="qChoices"></div>
  `;

  const questions = [
    {
      q: "À quoi sert le journal périodique des ventes ?",
      good: ["Pour noter toutes les ventes de la journée"],
      bad: ["Pour compter l’or", "Pour payer les impôts"]
    },
    {
      q: "Pourquoi faut-il un livre des comptes mensuels ?",
      good: [
        "Pour comparer les ventes des différents mois",
        "Pour avoir un point de vue extérieur sur les ventes du mois"
      ],
      bad: ["Pour décorer la boutique"]
    }
  ];

  let qIndex = 0;
  let goodCount = 0;

  function startMiniGame0() {
    miniGame0.classList.remove("hidden");
    qIndex = 0;
    showQuestion();
  }

  function showQuestion() {
    goodCount = 0;
    qText.textContent = questions[qIndex].q;
    qChoices.innerHTML = "";

    [...questions[qIndex].good.map(t => ({ t, ok: true })),
     ...questions[qIndex].bad.map(t => ({ t, ok: false }))]

      .sort(() => Math.random() - 0.5)
      .forEach(choice => {
        const btn = document.createElement("button");
        btn.textContent = choice.t;
        btn.onclick = () => {
          if (choice.ok) {
            btn.disabled = true;
            btn.style.opacity = 0.6;
            goodCount++;
            if (goodCount === questions[qIndex].good.length) {
              qIndex++;
              qIndex < questions.length
                ? showQuestion()
                : finishMiniGame0();
            }
          } else {
            screenShake();
          }
        };
        qChoices.appendChild(btn);
      });
  }

  function finishMiniGame0() {
    miniGame0.classList.add("hidden");
    startDialogues(dialoguesAfterMini0, startMiniGame1);
  }

  /* ===============================
     🧾 MINI-JEU 1 – LIVRE DU TRÉSOR
     (BOUTONS HORIZONTAUX GÉRÉS PAR CSS)
  =============================== */
  function startMiniGame1() {
    financeGame.classList.remove("hidden");
    part1.classList.remove("hidden");
  }

  window.showBill = client => {
    bill.innerHTML = {
      A: "🧾 Barbe-Cuivre : TOTAL 950",
      B: "🧾 Vent-Noir : TOTAL 850",
      C: "🧾 Crâne-Rouge : TOTAL 530"
    }[client];

    if (client === "A") {
      part1.classList.add("hidden");
      startDialogues(dialoguesAfterMini1, startMiniGame2);
    } else {
      msg1.textContent = "❌ Mauvais client, recommence.";
      screenShake();
    }
  };

  /* ===============================
     💰 MINI-JEU 2
  =============================== */
  function startMiniGame2() {
    part2.classList.remove("hidden");
  }

  window.checkResult = ok => {
    if (!ok) {
      msg2.textContent = "❌ Mauvais calcul.";
      screenShake();
      return;
    }
    part2.classList.add("hidden");
    startDialogues(dialoguesAfterMini2, () => {});
  };

});

/* ===============================
   🧯 SHAKE
=============================== */
function screenShake() {
  document.body.classList.add("shake");
  setTimeout(() => document.body.classList.remove("shake"), 400);
}
