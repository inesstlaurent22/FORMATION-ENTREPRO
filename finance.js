// ===============================
// 🎬 VIDÉO + LOGIQUE GLOBALE
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("questVideo");
  const videoContainer = document.getElementById("videoContainer");
  const toggleSoundBtn = document.getElementById("toggleSound");
  const closeVideoBtn = document.getElementById("closeVideo");

  const background = document.getElementById("background");
  const pirate5 = document.getElementById("pirate5bis");
  const pirate2 = document.getElementById("pirate2bis");
  const financeGame = document.getElementById("financeGame");

  // ---------- Fondu + écran de réussite ----------
  const fade = document.createElement("div");
  fade.id = "fadeOverlay";
  Object.assign(fade.style, {
    position: "fixed",
    inset: 0,
    background: "black",
    opacity: 0,
    pointerEvents: "none",
    transition: "opacity 0.6s ease",
    zIndex: 9999
  });
  document.body.appendChild(fade);

  const success = document.createElement("div");
  success.id = "successScreen";
  Object.assign(success.style, {
    position: "fixed",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    background: "rgba(0,0,0,0.85)",
    color: "#f5e6c8",
    fontSize: "24px",
    opacity: 0,
    pointerEvents: "none",
    transition: "opacity 0.4s ease",
    zIndex: 10000
  });
  document.body.appendChild(success);

  function fadeIn() { fade.style.opacity = 1; }
  function fadeOut() { fade.style.opacity = 0; }

  function showSuccess(text, cb) {
    success.innerHTML = `<div><h2>✅ Réussite</h2><p>${text}</p></div>`;
    success.style.opacity = 1;
    success.style.pointerEvents = "auto";
    setTimeout(() => {
      success.style.opacity = 0;
      success.style.pointerEvents = "none";
      cb && cb();
    }, 1200);
  }

  // ---------- Vidéo ----------
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
      enablePirate5Hover();
    }, 300);
  }

  function enablePirate5Hover() {
    pirate5.addEventListener("mouseenter", () => pirate5.style.filter = "drop-shadow(0 0 30px gold)");
    pirate5.addEventListener("mouseleave", () => pirate5.style.filter = "");
  }
  function disablePirate5Hover() {
    pirate5.style.filter = "";
    pirate5.onmouseenter = null;
    pirate5.onmouseleave = null;
  }

  // ===============================
  // 💬 DIALOGUES
  // ===============================
  const dialogueIntro = [
    { s: pirate5, t: "🏴‍☠️ Te voilà enfin…" },
    { s: pirate2, t: "Capitaine, il veut apprendre à gérer l’or !" },
    { s: pirate5, t: "Alors qu’il fasse ses preuves." }
  ];

  const dialogueAfterRegisters = [
    { s: pirate5, t: "Bien… tu maîtrises les registres." },
    { s: pirate2, t: "Passons aux clients !" }
  ];

  const dialogueEBE = [
    { s: pirate5, t: "Parlons maintenant d’un indicateur clé : l’EBE." },
    { s: pirate5, t: "L’EBE signifie Excédent Brut d’Exploitation." },
    { s: pirate5, t: "Il mesure la performance économique avant amortissements et impôts." },
    { s: pirate5, t: "C’est la richesse réellement créée par l’activité." }
  ];

  const dialogueFinal = [
    { s: pirate5, t: "Bravo, tu commences à connaître les particularités comptables." }
  ];

  let dIdx = 0, dArr = [];
  const bubble = document.createElement("div");
  bubble.id = "dialogueBox";
  bubble.classList.add("hidden");
  background.appendChild(bubble);

  pirate5.onclick = () => {
    disablePirate5Hover();
    startDialogues(dialogueIntro, startMiniGame0);
  };

  function startDialogues(arr, cb) {
    dArr = arr; dIdx = 0;
    bubble.classList.remove("hidden");
    showDialogue(cb);
  }
  function showDialogue(cb) {
    const d = dArr[dIdx];
    bubble.textContent = d.t;
    const r = d.s.getBoundingClientRect();
    bubble.style.left = r.left + r.width / 2 + "px";
    bubble.style.top = r.top - 90 + "px";
    bubble.style.transform = "translateX(-50%)";
    bubble.onclick = () => {
      dIdx++;
      if (dIdx < dArr.length) showDialogue(cb);
      else { bubble.classList.add("hidden"); cb && cb(); }
    };
  }

  // ===============================
  // 📘 MINI-JEU 0 – ÉPREUVE DES REGISTRES
  // ===============================
  const miniGame0 = document.createElement("div");
  miniGame0.id = "miniGame0";
  miniGame0.classList.add("hidden");
  miniGame0.innerHTML = `<h3>📘 Épreuve des registres</h3><p id="qText"></p><div id="qChoices"></div>`;
  background.appendChild(miniGame0);

  const questions = [
    { q:"À quoi sert le journal périodique des ventes ?", g:["Pour noter toutes les ventes de la journée"], b:["Pour compter l’or","Pour payer les impôts"] },
    { q:"Pourquoi faut-il un livre des comptes mensuels ?", g:["Pour avoir un point de vue extérieur sur les ventes du mois","Pour comparer les ventes des différents mois"], b:["Pour décorer la boutique"] },
    { q:"Quels sont les deux livres des comptes annuels ?", g:["Le bilan comptable","Le Compte de Résultat"], b:["Le journal de bord"] },
    { q:"À quoi sert le Compte de Résultat ?", g:["À mesurer le résultat net de l’entreprise (son chiffre d’affaires)"], b:["À compter les pirates"] }
  ];
  let qIdx = 0;

  function startMiniGame0() {
    miniGame0.classList.remove("hidden");
    qIdx = 0; showQuestion();
  }
  function showQuestion() {
    const q = questions[qIdx];
    document.getElementById("qText").textContent = q.q;
    const c = document.getElementById("qChoices"); c.innerHTML = "";
    [...q.g.map(t=>({t,ok:true})), ...q.b.map(t=>({t,ok:false}))].sort(()=>Math.random()-0.5)
      .forEach(x=>{
        const b=document.createElement("button");
        b.textContent=x.t;
        b.onclick=()=> x.ok ? nextQ() : screenShake();
        c.appendChild(b);
      });
  }
  function nextQ() {
    qIdx++;
    if (qIdx < questions.length) showQuestion();
    else {
      miniGame0.classList.add("hidden");
      showSuccess("Épreuve des registres réussie", () =>
        startDialogues(dialogueAfterRegisters, startMiniGame1)
      );
    }
  }

  // ===============================
  // 🧾 MINI-JEUX 1 → 2 → 3
  // ===============================
  function startMiniGame1() {
    financeGame.classList.remove("hidden");
    part1.classList.remove("hidden");
  }

  // ===============================
  // 🧮 CALCULATRICE
  // ===============================
  const calc = document.getElementById("calc");
  if (calc) {
    calc.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        try { calc.value = Function("return " + calc.value)(); }
        catch { calc.value = "Erreur"; }
      }
    });
  }

  // ===============================
  // 🏁 FIN
  // ===============================
  window.showFinalDialogue = function () {
    financeGame.classList.add("hidden");
    showSuccess("Mini-jeu terminé", () =>
      startDialogues(dialogueFinal, ()=>{})
    );
  };
});

// ===============================
// 🧾 MINI-JEU 1 – CLIENTS
// ===============================
let billViewed=false;
function toggleCalc(){ document.getElementById("calc").classList.toggle("hidden"); }
function showBill(c){
  billViewed=true;
  bill.innerHTML={A:"🧾 Barbe-Cuivre : TOTAL 950",B:"🧾 Vent-Noir : TOTAL 850",C:"🧾 Crâne-Rouge : TOTAL 530"}[c];
}
function chooseClient(){
  if(!billViewed)return;
  if(bill.textContent.includes("Barbe-Cuivre")){
    showSuccess("Bon client sélectionné", ()=>{
      part1.classList.add("hidden"); part2.classList.remove("hidden");
    });
  } else { screenShake(); msg1.textContent="❌ Mauvais client, recommence."; }
}

// ===============================
// 💰 MINI-JEU 2
// ===============================
function checkResult(ok){
  if(!ok){ msg2.textContent="❌ Mauvais calcul."; screenShake(); return; }
  showSuccess("Résultat annuel validé", ()=>{
    startEBEDialogues();
  });
}
function startEBEDialogues(){
  startDialogues([
    { s: pirate5, t: "Parlons maintenant d’un indicateur clé : l’EBE." },
    { s: pirate5, t: "Il mesure la performance économique avant amortissements et impôts." },
    { s: pirate5, t: "C’est la richesse créée par l’activité." }
  ], ()=>{
    part2.classList.add("hidden"); part3.classList.remove("hidden");
    document.getElementById("calc").classList.remove("hidden");
  });
}

// ===============================
// 🛠️ MINI-JEU 3
// ===============================
function checkAmortBase(ok){
  if(!ok){ msg3.textContent="❌ Mauvais montant."; screenShake(); return; }
  msg3.textContent="✅ Il reste 350 pièces à amortir.";
  amortMonth.classList.remove("hidden");
}
function checkMonthlyAmort(ok){
  if(!ok){ msgMonth.textContent="❌ Mauvais montant."; screenShake(); return; }
  showSuccess("Amortissements maîtrisés", ()=> window.showFinalDialogue());
}

// ===============================
// 🧯 SHAKE
// ===============================
function screenShake(){
  document.body.classList.add("shake");
  setTimeout(()=>document.body.classList.remove("shake"),400);
}
