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

  let dialogueActive = false;

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
    background.classList.remove("hidden");
    pirate5.classList.remove("hidden");
    pirate2.classList.remove("hidden");
  }

  /* =====================================================
     ✨ PIRATE 5 – SURVOL
  ===================================================== */
  pirate5.onmouseenter = () => {
    if (!dialogueActive) pirate5.style.filter = "drop-shadow(0 0 30px gold)";
  };
  pirate5.onmouseleave = () => {
    pirate5.style.filter = "";
  };

  /* =====================================================
     💬 SYSTÈME DE DIALOGUES
  ===================================================== */
  const bubble = document.createElement("div");
  bubble.id = "dialogueBox";
  bubble.classList.add("hidden");
  background.appendChild(bubble);

  let dialogues = [];
  let dIndex = 0;

  function playDialogues(arr, cb) {
    dialogueActive = true;
    pirate5.style.filter = "";
    dialogues = arr;
    dIndex = 0;
    bubble.classList.remove("hidden");
    showDialogue(cb);
  }

  function showDialogue(cb) {
    const d = dialogues[dIndex];
    bubble.textContent = d.t;

    const r = d.s.getBoundingClientRect();
    bubble.style.left = r.left + r.width / 2 + "px";
    bubble.style.top = r.top - 90 + "px";
    bubble.style.transform = "translateX(-50%)";

    bubble.onclick = () => {
      dIndex++;
      if (dIndex < dialogues.length) {
        showDialogue(cb);
      } else {
        bubble.classList.add("hidden");
        dialogueActive = false;
        cb && cb();
      }
    };
  }

  pirate5.onclick = () => {
    if (dialogueActive) return;
    playDialogues(dialoguesDocs, showLoaderMiniGame1);
  };

  /* =====================================================
     📚 DIALOGUES – DOCUMENTS
  ===================================================== */
  const dialoguesDocs = [
    { s: pirate5, t: "Pour gérer une boutique pirate, il faut des registres." },
    { s: pirate2, t: "Le journal des ventes note chaque transaction." },
    { s: pirate5, t: "Le grand livre regroupe les comptes." },
    { s: pirate2, t: "La balance vérifie l’équilibre." },
    { s: pirate5, t: "Et le compte de résultat mesure la rentabilité." }
  ];

  /* =====================================================
     ⏳ LOADER
  ===================================================== */
  function showLoaderMiniGame1() {
    const loader = document.createElement("div");
    loader.id = "loader";
    loader.textContent = "Chargement…";
    background.appendChild(loader);

    setTimeout(() => {
      loader.remove();
      startMiniGame1();
    }, 1400);
  }

  /* =====================================================
     🎮 MINI-JEU 1 — QCM
  ===================================================== */
  const questions = [
    {
      q: "À quoi sert le journal des ventes ?",
      good: ["À noter toutes les ventes", "À suivre l’activité quotidienne"],
      bad: ["À payer les impôts"]
    },
    {
      q: "À quoi sert la balance comptable ?",
      good: ["À vérifier l’équilibre", "À contrôler débit et crédit"],
      bad: ["À gérer la caisse"]
    }
  ];

  let qIndex = 0;
  let goodCount = 0;

  function startMiniGame1() {
    miniGame0.innerHTML = `
      <h3>📘 Épreuve des registres</h3>
      <p id="qText"></p>
      <div id="qChoices"></div>
    `;
    miniGame0.classList.remove("hidden");
    qIndex = 0;
    showQuestion();
  }

  function showQuestion() {
    goodCount = 0;
    qText.textContent = questions[qIndex].q;
    qChoices.innerHTML = "";

    const answers = [
      ...questions[qIndex].good.map(t => ({ t, ok: true })),
      ...questions[qIndex].bad.map(t => ({ t, ok: false }))
    ].sort(() => Math.random() - 0.5);

    answers.forEach(a => {
      const btn = document.createElement("button");
      btn.textContent = a.t;
      btn.onclick = () => {
        if (a.ok) {
          btn.classList.add("selectedAnswer");
          btn.disabled = true;
          goodCount++;
          if (goodCount === questions[qIndex].good.length) {
            qIndex++;
            qIndex < questions.length ? showQuestion() : endMiniGame1();
          }
        } else {
          screenShake();
        }
      };
      qChoices.appendChild(btn);
    });
  }

  function endMiniGame1() {
    miniGame0.classList.add("hidden");
    showSuccess("📘 Registres maîtrisés !");
    setTimeout(() => startMiniGame2(), 2200);
  }

  /* =====================================================
     🎮 MINI-JEU 2 — GESTION + CALCULATRICE
  ===================================================== */
  function startMiniGame2() {
    financeGame.classList.remove("hidden");
    part1.classList.remove("hidden");
    injectCalculator(part1);
  }

  function injectCalculator(container) {
    if (container.querySelector(".calcWrapper")) return;

    const wrap = document.createElement("div");
    wrap.className = "calcWrapper";

    const btn = document.createElement("button");
    btn.className = "calcToggle";
    btn.textContent = "🧮 Calculatrice";

    const input = document.createElement("input");
    input.className = "calcInput hidden";
    input.placeholder = "Ex : 300-150 puis Entrée";

    btn.onclick = () => input.classList.toggle("hidden");

    input.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        try {
          input.value = Function("return " + input.value)();
        } catch {
          input.value = "Erreur";
        }
      }
    });

    wrap.appendChild(btn);
    wrap.appendChild(input);
    container.prepend(wrap);
  }

  window.showBill = c => {
    bill.textContent = {
      A: "🧾 Barbe-Cuivre : 950",
      B: "🧾 Vent-Noir : 850",
      C: "🧾 Crâne-Rouge : 530"
    }[c];
  };

  window.chooseClient = btn => {
    const all = [...document.querySelectorAll(".clients button:last-child")];
    if (btn === all[all.length - 1]) {
      part1.classList.add("hidden");
      part2.classList.remove("hidden");
      injectCalculator(part2);
    } else {
      screenShake();
    }
  };

  window.checkResult = ok => {
    if (!ok) return screenShake();
    part2.classList.add("hidden");
    part3.classList.remove("hidden");
    injectCalculator(part3);
  };

  window.checkAmortBase = ok => {
    if (!ok) return screenShake();
    amortMonth.classList.remove("hidden");
  };

  window.checkMonthlyAmort = ok => {
    if (!ok) return screenShake();
    financeGame.classList.add("hidden");
    showSuccess("💰 Gestion réussie !");
  };

  /* =====================================================
     🎉 SUCCÈS / SHAKE
  ===================================================== */
  function showSuccess(text) {
    const s = document.createElement("div");
    s.className = "successOverlay";
    s.textContent = text;
    background.appendChild(s);
    setTimeout(() => s.remove(), 2200);
  }

  function screenShake() {
    document.body.classList.add("shake");
    setTimeout(() => document.body.classList.remove("shake"), 400);
  }

});
