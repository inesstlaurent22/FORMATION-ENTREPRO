document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   🎬 VIDÉO INTRO — VERSION STABLE
===================================================== */
const videoIntro  = document.getElementById("videoIntro");
const introVideo  = document.getElementById("introVideo");
const toggleSound = document.getElementById("toggleSound");
const closeVideo  = document.getElementById("closeVideo");
const scene       = document.getElementById("scene");

let videoClosed = false;

/* IMPORTANT : la vidéo ne doit JAMAIS capter les clics */
introVideo.style.pointerEvents = "none";

/* iOS / Safari friendly */
introVideo.muted = true;
introVideo.playsInline = true;

/* Lecture sécurisée */
const playPromise = introVideo.play();
if (playPromise !== undefined) {
  playPromise.catch(() => {
    /* autoplay bloqué → normal sur mobile */
  });
}

/* 🔊 TOGGLE SON */
toggleSound.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();

  introVideo.muted = !introVideo.muted;
  toggleSound.textContent = introVideo.muted ? "🔇" : "🔊";
});

/* ⏭️ PASSER LA VIDÉO */
closeVideo.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  closeIntroVideo();
});

/* Fin naturelle */
introVideo.addEventListener("ended", closeIntroVideo);

function closeIntroVideo(){
  if (videoClosed) return;
  videoClosed = true;

  introVideo.pause();
  videoIntro.classList.add("hidden");
  scene.classList.remove("hidden");
}

/* =====================================================
   🏴‍☠️ PIRATE 3 — LANCEMENT DU JEU
===================================================== */
const pirate3 = document.getElementById("pirate3");
const pirate2 = document.getElementById("pirate2");

pirate3.classList.add("glow");

pirate3.addEventListener("click", () => {
  pirate3.classList.remove("glow");
  playDialog([
    { speaker: "pirate3", text: "Capitaine, ton trésor est prêt." },
    { speaker: "pirate2", text: "Mais sans communication, personne ne viendra." },
    { speaker: "pirate3", text: "Voyons comment attirer le marché." }
  ], startMiniGame1);
});

/* =====================================================
   💬 DIALOGUES
===================================================== */
const dialogBox  = document.getElementById("dialogBox");
const dialogText = document.getElementById("dialogText");
const skipDialog = document.getElementById("skipDialog");

let dialogs = [];
let dialogIndex = 0;
let dialogCallback = null;

function playDialog(list, cb){
  dialogs = list;
  dialogIndex = 0;
  dialogCallback = cb;
  dialogBox.classList.remove("hidden");
  skipDialog.classList.remove("hidden");
  showDialog();
}

function showDialog(){
  const d = dialogs[dialogIndex];
  dialogText.textContent = d.text;

  const p = d.speaker === "pirate2" ? pirate2 : pirate3;
  const r = p.getBoundingClientRect();

  dialogBox.style.left =
    `${r.left + r.width / 2 - dialogBox.offsetWidth / 2}px`;
  dialogBox.style.top =
    `${r.top - dialogBox.offsetHeight - 20}px`;
}

dialogBox.addEventListener("click", () => {
  dialogIndex++;
  dialogIndex < dialogs.length ? showDialog() : endDialogs();
});

skipDialog.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  dialogIndex = dialogs.length;
  endDialogs();
});

function endDialogs(){
  dialogBox.classList.add("hidden");
  skipDialog.classList.add("hidden");

  if (dialogCallback) {
    const cb = dialogCallback;
    dialogCallback = null;
    cb();
  }
}

/* =====================================================
   🎮 MINI-JEUX — BASE
===================================================== */
const miniGame = document.getElementById("miniGameContainer");

function clearMiniGame(){
  miniGame.innerHTML = "";
  miniGame.classList.remove("hidden");
}

function hideMiniGame(){
  miniGame.classList.add("hidden");
}

/* Shake sécurisé */
function shakeMiniGame(){
  miniGame.classList.add("screen-shake");
  setTimeout(() => miniGame.classList.remove("screen-shake"), 400);
}

/* =====================================================
   🎯 MINI-JEU 1 — COMMUNICATION
===================================================== */
const quiz = [
  {
    q: "À quoi sert principalement la communication ?",
    ok: [0,1],
    a: [
      "Être comprise par son public",
      "Créer une relation de confiance",
      "Parler uniquement de ses produits"
    ]
  },
  {
    q: "La communication permet de :",
    ok: [0,1],
    a: [
      "Attirer l’attention",
      "Créer de l’émotion",
      "Garantir des ventes immédiates"
    ]
  },
  {
    q: "Une bonne communication sert à :",
    ok: [0,1,2],
    a: [
      "Transmettre un message clair",
      "Se différencier des concurrents",
      "Construire une image de marque"
    ]
  },
  {
    q: "La communication est essentielle pour :",
    ok: [0,1],
    a: [
      "Guider le public",
      "Créer du lien sur le long terme",
      "Remplacer la qualité d’un produit"
    ]
  }
];

let qIndex = 0;
let found = [];

function startMiniGame1(){
  qIndex = 0;
  stepMiniGame1();
}

function stepMiniGame1(){
  clearMiniGame();
  found = [];

  const box = document.createElement("div");
  box.className = "mg1-box";

  const title = document.createElement("div");
  title.className = "mg1-title";
  title.textContent = "À quoi sert la communication ?";

  const question = document.createElement("div");
  question.className = "mg1-question";
  question.textContent = quiz[qIndex].q;

  const answers = document.createElement("div");
  answers.className = "mg1-answers";

  quiz[qIndex].a.forEach((txt, idx) => {
    const b = document.createElement("button");
    b.textContent = txt;

    b.addEventListener("click", () => {
      if (!quiz[qIndex].ok.includes(idx)) {
        shakeMiniGame();
        return;
      }
      if (found.includes(idx)) return;

      found.push(idx);
      b.classList.add("pressed");
      b.disabled = true;

      if (found.length === quiz[qIndex].ok.length) {
        setTimeout(() => {
          qIndex++;
          qIndex < quiz.length ? stepMiniGame1() : afterMiniGame1();
        }, 700);
      }
    });

    answers.appendChild(b);
  });

  box.append(title, question, answers);
  miniGame.appendChild(box);
}

function afterMiniGame1(){
  hideMiniGame();
  playDialog(
    [
      { speaker: "pirate2", text: "Parfait." },
      { speaker: "pirate3", text: "Passons à ton identité visuelle." }
    ],
    startMiniGame2
  );
}

/* =====================================================
   🎨 MINI-JEU 2 — IDENTITÉ VISUELLE
===================================================== */
function startMiniGame2(){
  clearMiniGame();

  const box = document.createElement("div");
  box.className = "mg2-box";

  const question = document.createElement("div");
  question.className = "mg2-question";
  question.textContent = "Avant de créer ton univers visuel :";

  const infoBtn = document.createElement("button");
  infoBtn.className = "info-small";
  infoBtn.textContent = "En savoir plus";

  const info = document.createElement("div");
  info.className = "info-box hidden";
  info.innerHTML = "• Ton message<br>• Ton public<br>• Ton style";

  infoBtn.addEventListener("click", () => {
    info.classList.toggle("hidden");
  });

  box.append(question, infoBtn, info);
  miniGame.appendChild(box);

  showImages(
    ["images/Logo1.PNG","images/Logo2.PNG","images/Logo3.PNG"],
    startMiniGame3
  );
}

function showImages(list, cb){
  const w = document.createElement("div");
  w.className = "visualChoices big";

  list.forEach(src => {
    const wrap = document.createElement("div");
    wrap.className = "imgWrap";

    const img = new Image();
    img.src = src;
    img.addEventListener("click", cb);

    const zoom = document.createElement("button");
    zoom.textContent = "🔎";
    zoom.addEventListener("click", (e) => {
      e.stopPropagation();
      zoomImage(src);
    });

    wrap.append(img, zoom);
    w.appendChild(wrap);
  });

  miniGame.appendChild(w);
}

function zoomImage(src){
  const f = document.createElement("div");
  f.id = "fadeScreen";
  f.innerHTML = `<img src="${src}" style="max-width:90%;max-height:90%">`;
  document.body.appendChild(f);
  f.addEventListener("click", () => f.remove());
}

/* =====================================================
   🔗 MINI-JEU 3 — RÉSEAUX SOCIAUX
===================================================== */
function startMiniGame3(){
  hideMiniGame();
  playDialog(
    [
      { speaker: "pirate2", text: "Ton identité est prête." },
      { speaker: "pirate3", text: "Voyons comment la diffuser." }
    ],
    launchMiniGame3
  );
}

function launchMiniGame3(){
  clearMiniGame();

  const box = document.createElement("div");
  box.className = "mg3-box";

  const question = document.createElement("div");
  question.className = "mg3-question";
  question.textContent = "Associe chaque canal à son objectif";

  const container = document.createElement("div");
  container.className = "mg3-container";

  const left = document.createElement("div");
  left.className = "mg3-column";

  const right = document.createElement("div");
  right.className = "mg3-column";

  let selected = null;
  let ok = 0;

  const leftData = [
    ["Instagram & TikTok","know"],
    ["Facebook & LinkedIn","btob"],
    ["Sites e-commerce","btoc"]
  ];

  const rightData = shuffle([
    ["Se faire connaître","know"],
    ["Vendre en BtoB","btob"],
    ["Vendre en BtoC","btoc"]
  ]);

  leftData.forEach(p => {
    const b = document.createElement("button");
    b.className = "mg3-left-btn";
    b.textContent = p[0];
    b.addEventListener("click", () => {
      selected = { btn: b, key: p[1] };
    });
    left.appendChild(b);
  });

  rightData.forEach(t => {
    const b = document.createElement("button");
    b.textContent = t[0];
    b.addEventListener("click", () => {
      if (!selected || selected.key !== t[1]) {
        shakeMiniGame();
        return;
      }
      selected.btn.remove();
      b.remove();
      selected = null;
      ok++;
      if (ok === 3) finish();
    });
    right.appendChild(b);
  });

  container.append(left, right);
  box.append(question, container);
  miniGame.appendChild(box);
}

function shuffle(arr){
  return arr.sort(() => Math.random() - 0.5);
}

/* =====================================================
   🏁 FIN
===================================================== */
function finish(){
  hideMiniGame();
  sessionStorage.setItem("unlock_pirate5","true");
  location.href = "menu.html";
}

});
