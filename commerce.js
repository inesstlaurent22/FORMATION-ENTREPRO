document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   FLAGS
===================================================== */
let pirate5Locked = false;

/* =====================================================
   DOM
===================================================== */
const background = document.getElementById("background");
const backgroundImg = background.querySelector("img");

const pirate2 = document.getElementById("pirate2bis");
const pirate5 = document.getElementById("pirate5bis");
const pirate3 = document.getElementById("pirate3bis");

const bubbleContainer = document.getElementById("bubbleContainer");
const skipBtn = document.getElementById("skipDialoguesBtn");

const fadeScreen = document.getElementById("fadeScreen");
const loaderBox = fadeScreen.querySelector(".loaderBox");

/* Mini-jeux */
const game1 = document.getElementById("communicationGame");
const q1 = document.getElementById("commQuestion");
const a1 = document.getElementById("commAnswers");

const game2 = document.getElementById("visualIdentityGame");
const visualChoices = document.getElementById("visualChoices");

const game3 = document.getElementById("merchantGame");
const btnKeep = document.getElementById("btnKeep");

/* =====================================================
   UTILS
===================================================== */
function vibrate(p = 100) {
  if (navigator.vibrate) navigator.vibrate(p);
}

function screenShake(el) {
  vibrate(120);
  el.classList.add("screen-shake");
  setTimeout(() => el.classList.remove("screen-shake"), 400);
}

/* =====================================================
   LOADERS
===================================================== */
function showPirateLoader(duration = 800, cb) {
  loaderBox.dataset.type = "pirate";
  fadeScreen.classList.remove("hidden");
  setTimeout(() => {
    fadeScreen.classList.add("hidden");
    cb && cb();
  }, duration);
}

function loadBackground(cb) {
  loaderBox.dataset.type = "hourglass";
  fadeScreen.classList.remove("hidden");

  const loaderText = document.createElement("div");
  loaderText.id = "loaderText";
  loaderText.textContent = "Tu vas bientôt pouvoir entrer sur le marché…";
  fadeScreen.appendChild(loaderText);

  const img = new Image();
  img.src = backgroundImg.src;

  const finish = () => {
    loaderText.remove();
    fadeScreen.classList.add("hidden");
    cb && cb();
  };

  img.complete ? finish() : (img.onload = img.onerror = finish);
}

/* =====================================================
   🎬 VIDÉO INTRO
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const questVideo = document.getElementById("questVideo");
const toggleSound = document.getElementById("toggleSound");
const closeVideo = document.getElementById("closeVideo");

questVideo.muted = true;
questVideo.oncanplay = () => questVideo.play().catch(()=>{});

toggleSound.onclick = () => {
  questVideo.muted = !questVideo.muted;
  toggleSound.textContent = questVideo.muted ? "🔇" : "🔊";
};

closeVideo.onclick = endVideo;
questVideo.onended = endVideo;

function endVideo() {
  videoContainer.classList.add("hidden");
  showPirateLoader(700, () => loadBackground(showScene));
}

/* =====================================================
   🌅 SCÈNE INITIALE
===================================================== */
function showScene() {
  pirate5Locked = false;

  background.classList.remove("hidden");
  pirate2.classList.remove("hidden");
  pirate5.classList.remove("hidden");

  pirate5.style.left = "1200px";

  requestAnimationFrame(() => {
    pirate5.style.transition = "left 1.2s ease";
    pirate5.style.left = "900px";
  });

  setTimeout(() => {
    pirate5.classList.add("glowStart");
    pirate5.onclick = () => {
      if (pirate5Locked) return;
      pirate5Locked = true;
      pirate5.classList.remove("glowStart");
      pirate5.onclick = null;
      startDialogues1();
    };
  }, 1300);
}

/* =====================================================
   💬 DIALOGUES ENGINE
===================================================== */
let dialogues = [];
let index = 0;
let callback = null;

function playDialogues(list, cb) {
  dialogues = list;
  index = 0;
  callback = cb;
  skipBtn.classList.remove("hidden");
  renderDialogue();
}

function renderDialogue() {
  bubbleContainer.innerHTML = "";
  if (index >= dialogues.length) return endDialogues();

  const d = dialogues[index];
  const bubble = document.createElement("div");
  bubble.className = "dialogue-bubble";
  bubble.innerHTML = d.text;

  const r = d.anchor.getBoundingClientRect();
  bubble.style.left = r.left + r.width / 2 + "px";
  bubble.style.top = r.top - 120 + "px";
  bubble.style.transform = "translateX(-50%)";

  bubble.onclick = () => {
    vibrate(20);
    index++;
    renderDialogue();
  };

  bubbleContainer.appendChild(bubble);
}

function endDialogues() {
  bubbleContainer.innerHTML = "";
  skipBtn.classList.add("hidden");
  callback && callback();
}

skipBtn.onclick = endDialogues;

/* =====================================================
   💬 DIALOGUES 1 — INTRO MARCHÉ
===================================================== */
function startDialogues1() {
  playDialogues([
    { text: "Bien joué, moussaillons. Avant de vendre, il faut comprendre le marché.", anchor: pirate5 },
    { text: "On ne peut pas juste poser nos produits et espérer ?", anchor: pirate2 },
    { text: "Non. Un bon marchand observe, analyse et anticipe.", anchor: pirate5 },
    { text: "Clients, concurrents, produits, prix… tout compte.", anchor: pirate5 },
    { text: "Voyons si tu es prêt à entrer sur le marché.", anchor: pirate5 }
  ], startMiniGame1);
}

/* =====================================================
   🎮 MINI-JEU 1 — ÉTUDE DE MARCHÉ (QUESTIONS FINALES)
===================================================== */
function startMiniGame1() {
  game1.classList.remove("hidden");

  const quiz = [
    {
      q: "Pourquoi réaliser des études de marché avant de se lancer ?",
      ok: [1, 2],
      a: [
        "Choisir les couleurs de sa boutique",
        "Comprendre les attentes des clients",
        "Identifier la concurrence et la demande"
      ]
    },
    {
      q: "Sur quoi dois-tu analyser tes concurrents ?",
      ok: [0, 2],
      a: [
        "Leur réputation et leur stratégie",
        "Leur lieu de vacances",
        "Leurs prix et leur positionnement"
      ]
    },
    {
      q: "Pourquoi faut-il réaliser des études de produit ?",
      ok: [0, 1],
      a: [
        "S’assurer que le produit répond aux besoins des clients",
        "Améliorer le produit et se différencier",
        "Créer un produit sans objectif précis"
      ]
    },
    {
      q: "Après avoir analysé les prix des concurrents, quelles stratégies sont possibles ?",
      ok: [0, 1],
      a: [
        "S’aligner sur les prix du marché",
        "Proposer plus de valeur à un prix plus élevé",
        "Fixer un prix au hasard"
      ]
    }
  ];

  let i = 0;
  let found = [];

  function step() {
    q1.textContent = quiz[i].q;
    a1.innerHTML = "";
    found = [];

    quiz[i].a.forEach((txt, idx) => {
      const btn = document.createElement("button");
      btn.textContent = txt;

      btn.onclick = () => {

        // ❌ MAUVAISE RÉPONSE
        if (!quiz[i].ok.includes(idx)) {
          screenShake(game1);
          return;
        }

        // ✅ BONNE RÉPONSE
        if (found.includes(idx)) return;

        found.push(idx);
        btn.classList.add("pressed");
        btn.disabled = true;

        if (found.length === quiz[i].ok.length) {
          setTimeout(() => {
            i++;
            i < quiz.length
              ? step()
              : (game1.classList.add("hidden"),
                 showPirateLoader(700, startDialogues2));
          }, 600);
        }
      };

      a1.appendChild(btn);
    });
  }

  step();
}

/* =====================================================
   💬 DIALOGUES 2
===================================================== */
function startDialogues2() {
  playDialogues([
    { 
      text: "Bravo à vous deux. Vous avez analysé le marché et compris votre environnement.", 
      anchor: pirate5 
    },
    { 
      text: "C’est une étape essentielle avant d’aller plus loin.", 
      anchor: pirate5 
    },
    { 
      text: "Et maintenant ? Quelle est la suite ?", 
      anchor: pirate2 
    },
    { 
      text: "Maintenant, vous allez travailler sur l’un des documents fondateurs de votre activité : le business plan.", 
      anchor: pirate5 
    },
    { 
      text: "C’est la ligne directrice de tout votre projet. Sans lui, impossible d’avancer clairement.", 
      anchor: pirate5 
    },
    { 
      text: "Que contient exactement un business plan ?", 
      anchor: pirate2 
    },
    { 
      text: "Il commence par l’histoire de votre projet : pourquoi cette idée, d’où elle vient et quel problème elle résout.", 
      anchor: pirate5 
    },
    { 
      text: "Ensuite, vous présentez votre équipe : qui vous êtes, vos compétences et vos rôles respectifs.", 
      anchor: pirate5 
    },
    { 
      text: "Donc ce n’est pas seulement l’idée qui compte, mais aussi les personnes derrière.", 
      anchor: pirate2 
    },
    { 
      text: "Exactement. Puis vous définissez clairement l’objectif du projet, à court, moyen et long terme.", 
      anchor: pirate5 
    },
    { 
      text: "Les études de marché que nous avons faites servent aussi ici ?", 
      anchor: pirate2 
    },
    { 
      text: "Oui. Elles prouvent que votre projet repose sur des données réelles : la cible, la demande et la concurrence.", 
      anchor: pirate5 
    },
    { 
      text: "Vous présentez ensuite votre produit ou service, sa valeur et ce qui le différencie.", 
      anchor: pirate5 
    },
    { 
      text: "Et le budget entre en jeu à ce moment-là ?", 
      anchor: pirate2 
    },
    { 
      text: "Exact. Le modèle économique explique comment vous gagnez de l’argent, vos coûts et votre budget prévisionnel.", 
      anchor: pirate5 
    },
    { 
      text: "Pour finir, vous définissez vos stratégies commerciales : comment attirer et convaincre vos clients.", 
      anchor: pirate5 
    },
    { 
      text: "Je comprends mieux. Le business plan, c’est la boussole de notre activité.", 
      anchor: pirate2 
    },
    { 
      text: "Exactement. Construisez-le avec méthode, et il guidera chacune de vos décisions.", 
      anchor: pirate5 
    }
  ], startMiniGame2);
}

/* =====================================================
   🎨 MINI-JEU 2
===================================================== */
function startMiniGame2() {
  game2.classList.remove("hidden");
  visualChoices.innerHTML = "";
  document.getElementById("visualFeedback").textContent = "";

  const quiz = [
    {
      q: "Quels éléments sont indispensables dans un bon business plan ?",
      r: [
        { t: "Présenter clairement le projet et son objectif", ok: true },
        { t: "Décrire le modèle économique et le budget", ok: true },
        { t: "Choisir un logo avant toute chose", ok: false }
      ]
    },
    {
      q: "Quelle est une erreur fréquente chez les débutants lors de la création d’un business plan ?",
      r: [
        { t: "S’appuyer sur des données de marché vérifiées", ok: false },
        { t: "Faire des prévisions financières irréalistes", ok: true },
        { t: "Expliquer clairement la valeur du produit", ok: false }
      ]
    },
    {
      q: "Pourquoi définir précisément son modèle économique est essentiel ?",
      r: [
        { t: "Pour savoir comment l’activité va générer des revenus", ok: true },
        { t: "Pour comprendre les coûts et la rentabilité", ok: true },
        { t: "Pour impressionner uniquement les investisseurs", ok: false }
      ]
    },
    {
      q: "Lors de la présentation du produit ou service, que faut-il absolument éviter ?",
      r: [
        { t: "Mettre en avant ce qui le différencie des concurrents", ok: false },
        { t: "Rester vague sur la valeur apportée au client", ok: true },
        { t: "Relier le produit à un besoin réel du marché", ok: false }
      ]
    }
  ];

  let step = 0;
  let found = [];

  function renderStep() {
    visualChoices.innerHTML = "";
    found = [];

    const feedback = document.getElementById("visualFeedback");
    feedback.textContent = quiz[step].q;

    quiz[step].r.forEach((rep, idx) => {
      const btn = document.createElement("button");
      btn.textContent = rep.t;

      btn.onclick = () => {
        // ❌ mauvaise réponse
        if (!rep.ok) {
          screenShake(game2);
          return;
        }

        // ✅ bonne réponse (évite double clic)
        if (found.includes(idx)) return;

        found.push(idx);
        btn.classList.add("pressed");
        btn.disabled = true;

        const totalGood = quiz[step].r.filter(r => r.ok).length;

        // Quand toutes les bonnes réponses sont trouvées
        if (found.length === totalGood) {
          setTimeout(() => {
            step++;
            if (step < quiz.length) {
              renderStep();
            } else {
              game2.classList.add("hidden");
              showPirateLoader(700, spawnPirate3);
            }
          }, 600);
        }
      };

      visualChoices.appendChild(btn);
    });
  }

  renderStep();
}
   
/* =====================================================
   🏴‍☠️ PIRATE 3
===================================================== */
function spawnPirate3() {
  pirate3.classList.remove("hidden");
  pirate3.style.left = "1200px";

  requestAnimationFrame(() => {
    pirate3.style.transition = "left 1s ease";
    pirate3.style.left = "638px";
  });

  setTimeout(() => {
    pirate3.classList.add("glowStart");
    pirate3.onclick = () => {
      pirate3.classList.remove("glowStart");
      pirate3.onclick = null;
      startFinalDialogues();
    };
  }, 1200);
}

/* =====================================================
   💬 DIALOGUES FINAUX
===================================================== */
function startFinalDialogues() {
  playDialogues([
    { text: "Le marché est exigeant, mais tu es prêt.", anchor: pirate3 },
    { text: "À toi de défendre ton prix.", anchor: pirate5 }
  ], startMiniGame3);
}

/* =====================================================
   🎮 MINI-JEU 3
===================================================== */
function startMiniGame3() {
  game3.classList.remove("hidden");
  btnKeep.onclick = () => {
    vibrate(40);
    game3.classList.add("hidden");
    showPirateLoader(700, endQuest);
  };
}

/* =====================================================
   🏆 FIN
===================================================== */
function endQuest() {
  sessionStorage.setItem("unlock_pirate3", "true");
  sessionStorage.setItem("fromCommerce", "true");
  window.location.href = "menu.html";
}

});
