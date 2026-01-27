document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     🎬 VIDEO
  ===================================================== */
  const video = document.getElementById("questVideo");
  const videoContainer = document.getElementById("videoContainer");
  const toggleSoundBtn = document.getElementById("toggleSound");
  const closeVideoBtn = document.getElementById("closeVideo");

  const background = document.getElementById("background");
  const pirate5 = document.getElementById("pirate5bis");
  const pirate2 = document.getElementById("pirate2bis");

  const miniGame1 = document.getElementById("miniGame0");
  const financeGame = document.getElementById("financeGame");

  const part1 = document.getElementById("part1");
  const part2 = document.getElementById("part2");
  const part3 = document.getElementById("part3");

  let dialogueActive = false;
  let calcInput = null;

  /* =====================================================
     VIDEO LOGIC
  ===================================================== */
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
     ✨ PIRATE 5 HOVER
  ===================================================== */
  pirate5.onmouseenter = () => {
    if (!dialogueActive) pirate5.style.filter = "drop-shadow(0 0 30px gold)";
  };
  pirate5.onmouseleave = () => pirate5.style.filter = "";

  /* =====================================================
     💬 DIALOGUES
  ===================================================== */
  const bubble = document.createElement("div");
  bubble.id = "dialogueBox";
  bubble.classList.add("hidden");
  background.appendChild(bubble);

  let dialogues = [], dIndex = 0;

  function playDialogues(arr, cb) {
    dialogueActive = true;
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
      if (dIndex < dialogues.length) showDialogue(cb);
      else {
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
     💬 DIALOGUES – DOCUMENTS
  ===================================================== */
  const dialoguesDocs = [
    { s: pirate5, t: "Pour gérer une boutique, il faut des documents comptables." },
    { s: pirate2, t: "Journal, grand livre, balance et compte de résultat." },
    { s: pirate5, t: "Voyons si tu sais les utiliser." }
  ];

  /* =====================================================
     ⏳ LOADER
  ===================================================== */
  function showLoaderMiniGame1() {
    const loader = document.createElement("div");
    loader.id = "loader";
    loader.innerHTML = "<h2>Chargement…</h2>";
    background.appendChild(loader);
    setTimeout(() => {
      loader.remove();
      startMiniGame1();
    }, 1200);
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

  let qIndex = 0, goodCount = 0;

  function startMiniGame1() {
    miniGame1.innerHTML = `
      <h3>📘 Épreuve des registres</h3>
      <p id="qText"></p>
      <div id="qChoices"></div>
    `;
    miniGame1.classList.remove("hidden");
    qIndex = 0;
    showQuestion();
  }

  function showQuestion() {
    goodCount = 0;
    qText.textContent = questions[qIndex].q;
    qChoices.innerHTML = "";

    [...questions[qIndex].good.map(t => ({t, ok:true})),
     ...questions[qIndex].bad.map(t => ({t, ok:false}))].sort(() => Math.random()-0.5)
    .forEach(a => {
      const b = document.createElement("button");
      b.textContent = a.t;
      b.onclick = () => {
        if (a.ok) {
          b.classList.add("selectedAnswer");
          b.disabled = true;
          goodCount++;
          if (goodCount === questions[qIndex].good.length) {
            qIndex++;
            qIndex < questions.length ? showQuestion() : endMiniGame1();
          }
        } else screenShake();
      };
      qChoices.appendChild(b);
    });
  }

  function endMiniGame1() {
    miniGame1.classList.add("hidden");
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

    calcInput = document.createElement("input");
    calcInput.type = "text";
    calcInput.placeholder = "Ex : 300-150 puis Entrée";
    calcInput.className = "calcInput hidden";

    btn.onclick = () => calcInput.classList.toggle("hidden");

    calcInput.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        try {
          calcInput.value = Function("return " + calcInput.value)();
        } catch {
          calcInput.value = "Erreur";
        }
      }
    });

    wrap.appendChild(btn);
    wrap.appendChild(calcInput);
    container.prepend(wrap);
  }

  window.showBill = c => {
    bill.textContent = {
      A:"🧾 Barbe-Cuivre : 950",
      B:"🧾 Vent-Noir : 850",
      C:"🧾 Crâne-Rouge : 530"
    }[c];
  };

  window.chooseClient = btn => {
    const all = [...document.querySelectorAll(".clients button:last-child")];
    if (btn === all[all.length-1]) {
      part1.classList.add("hidden");
      part2.classList.remove("hidden");
      injectCalculator(part2);
    } else screenShake();
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
     🎉 SUCCÈS & SHAKE
  ===================================================== */
  function showSuccess(t) {
    const s = document.createElement("div");
    s.className = "successOverlay";
    s.textContent = t;
    background.appendChild(s);
    setTimeout(() => s.remove(), 2200);
  }

  function screenShake() {
    document.body.classList.add("shake");
    setTimeout(() => document.body.classList.remove("shake"), 400);
  }

});
