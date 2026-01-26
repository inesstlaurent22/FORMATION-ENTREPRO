document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     🎬 VIDÉO
  ===================================================== */
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
  const part3 = document.getElementById("part3");

  const calc = document.getElementById("calc");

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
      pirate5.style.filter = "drop-shadow(0 0 30px gold)";
    }, 300);
  }

  /* =====================================================
     💬 DIALOGUES
  ===================================================== */
  const dialoguesIntro = [
    { s: pirate5, t: "🏴‍☠️ Te voilà enfin…" },
    { s: pirate2, t: "Il veut apprendre à gérer l’or, capitaine." },
    { s: pirate5, t: "Alors qu’il fasse ses preuves." }
  ];

  const dialoguesAfterMini0 = [
    { s: pirate5, t: "Bien. Tu maîtrises les registres." },
    { s: pirate2, t: "Passons maintenant aux clients." }
  ];

  const dialoguesEBE = [
    { s: pirate5, t: "Avec ces calculs, on peut parler d’EBE." },
    { s: pirate5, t: "L’Excédent Brut d’Exploitation mesure la richesse créée." },
    { s: pirate5, t: "Avant amortissements, impôts et charges financières." }
  ];

  const dialogueFinal = [
    { s: pirate5, t: "Bravo. Tu comprends désormais les bases de la comptabilité pirate." }
  ];

  let dArr = [];
  let dIndex = 0;

  const bubble = document.createElement("div");
  bubble.id = "dialogueBox";
  bubble.classList.add("hidden");
  background.appendChild(bubble);

  pirate5.onclick = () => {
    pirate5.style.filter = "";
    startDialogues(dialoguesIntro, startMiniGame0);
  };

  function startDialogues(arr, cb) {
    dArr = arr;
    dIndex = 0;
    bubble.classList.remove("hidden");
    showDialogue(cb);
  }

  function showDialogue(cb) {
    const d = dArr[dIndex];
    bubble.textContent = d.t;
    const r = d.s.getBoundingClientRect();
    bubble.style.left = r.left + r.width / 2 + "px";
    bubble.style.top = r.top - 90 + "px";
    bubble.style.transform = "translateX(-50%)";

    bubble.onclick = () => {
      dIndex++;
      if (dIndex < dArr.length) {
        showDialogue(cb);
      } else {
        bubble.classList.add("hidden");
        cb && cb();
      }
    };
  }

  /* =====================================================
     📘 MINI-JEU 0 — REGISTRES
  ===================================================== */
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
    },
    {
      q: "Quels sont les deux livres des comptes annuels ?",
      good: ["Le bilan comptable", "Le Compte de Résultat"],
      bad: ["Le journal de bord"]
    },
    {
      q: "À quoi sert le Compte de Résultat ?",
      good: ["À mesurer le résultat net de l’entreprise (son chiffre d’affaires)"],
      bad: ["À compter les pirates"]
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

    const all = [
      ...questions[qIndex].good.map(t => ({ t, ok: true })),
      ...questions[qIndex].bad.map(t => ({ t, ok: false }))
    ].sort(() => Math.random() - 0.5);

    all.forEach(choice => {
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

  /* =====================================================
     🧾 MINI-JEU 1 — CLIENTS
  ===================================================== */
  let viewedClients = { A:false, B:false, C:false };

  function startMiniGame1() {
    financeGame.classList.remove("hidden");
    part1.classList.remove("hidden");

    document
      .querySelectorAll(".clients button:last-child")
      .forEach(btn => btn.disabled = true);
  }

  window.showBill = client => {
    viewedClients[client] = true;

    bill.innerHTML = {
      A: "🧾 Barbe-Cuivre : TOTAL 950",
      B: "🧾 Vent-Noir : TOTAL 850",
      C: "🧾 Crâne-Rouge : TOTAL 530"
    }[client];

    if (Object.values(viewedClients).every(v => v)) {
      document
        .querySelectorAll(".clients button:last-child")
        .forEach(btn => btn.disabled = false);
    }
  };

  window.chooseClient = client => {
    if (client === "A") {
      part1.classList.add("hidden");
      part2.classList.remove("hidden");
    } else {
      msg1.textContent = "❌ Mauvais choix, recommence.";
      screenShake();
    }
  };

  /* =====================================================
     💰 MINI-JEU 2 — RÉSULTAT ANNUEL
  ===================================================== */
  window.checkResult = ok => {
    if (!ok) {
      msg2.textContent = "❌ Mauvais calcul.";
      screenShake();
      return;
    }
    part2.classList.add("hidden");
    part3.classList.remove("hidden");
    calc.classList.remove("hidden");
  };

  /* =====================================================
     🛠️ MINI-JEU 3 — AMORTISSEMENTS
  ===================================================== */
  window.checkAmortBase = ok => {
    if (!ok) {
      msg3.textContent = "❌ Mauvais montant.";
      screenShake();
      return;
    }
    msg3.textContent = "✅ Base amortissable : 350 pièces d’or.";
    amortMonth.classList.remove("hidden");
  };

  window.checkMonthlyAmort = ok => {
    if (!ok) {
      msgMonth.textContent = "❌ Mauvais montant.";
      screenShake();
      return;
    }
    startDialogues(dialoguesEBE, () =>
      startDialogues(dialogueFinal)
    );
  };

  /* =====================================================
     🧮 CALCULATRICE
  ===================================================== */
  calc.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      try {
        calc.value = Function("return " + calc.value)();
      } catch {
        calc.value = "Erreur";
      }
    }
  });

});

/* =====================================================
   🧯 SHAKE
===================================================== */
function screenShake() {
  document.body.classList.add("shake");
  setTimeout(() => document.body.classList.remove("shake"), 400);
}
