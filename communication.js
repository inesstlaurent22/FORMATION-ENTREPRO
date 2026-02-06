document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   DOM
===================================================== */
const videoIntro  = document.getElementById("videoIntro");
const introVideo  = document.getElementById("introVideo");
const toggleSound = document.getElementById("toggleSound");
const closeVideo  = document.getElementById("closeVideo");

const scene   = document.getElementById("scene");
const pirate2 = document.getElementById("pirate2");
const pirate3 = document.getElementById("pirate3");

const dialogBox  = document.getElementById("dialogBox");
const dialogText = document.getElementById("dialogText");
const skipDialog = document.getElementById("skipDialog");

const miniGame = document.getElementById("miniGameContainer");

/* =====================================================
   VIDÉO INTRO
===================================================== */
introVideo.muted = true;
introVideo.play().catch(()=>{});

toggleSound.onclick = e => {
  e.stopPropagation();
  introVideo.muted = !introVideo.muted;
  toggleSound.textContent = introVideo.muted ? "🔇" : "🔊";
};

closeVideo.onclick = e => {
  e.stopPropagation();
  endVideo();
};

introVideo.onended = endVideo;

function endVideo(){
  introVideo.pause();
  videoIntro.classList.add("hidden");
  scene.classList.remove("hidden");
  showLoader();
}

/* =====================================================
   LOADER
===================================================== */
function showLoader(cb){
  const f = document.createElement("div");
  f.id = "fadeScreen";
  f.innerHTML = `<div class="loaderBox"></div>`;
  document.body.appendChild(f);

  setTimeout(()=>{
    f.remove();
    if (cb) cb();
  },1300);
}

/* =====================================================
   DIALOGUES
===================================================== */
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

dialogBox.onclick = () => {
  dialogIndex++;
  dialogIndex < dialogs.length ? showDialog() : endDialogs();
};

skipDialog.onclick = e => {
  e.stopPropagation();
  endDialogs();
};

function endDialogs(){
  dialogBox.classList.add("hidden");
  skipDialog.classList.add("hidden");
  if (dialogCallback) dialogCallback();
}

/* =====================================================
   HELPERS
===================================================== */
function clearMiniGame(){
  miniGame.innerHTML = "";
  miniGame.classList.remove("hidden");
}

function hideMiniGame(){
  miniGame.classList.add("hidden");
}

/* =====================================================
   SHAKE — SÉCURISÉ (UNIQUEMENT MINI-JEU)
===================================================== */
function shakeMiniGame(){
  miniGame.classList.add("screen-shake");
  setTimeout(() => miniGame.classList.remove("screen-shake"), 400);
}

/* =====================================================
   START — PIRATE 3 GLOW
===================================================== */
pirate3.classList.add("glow");

pirate3.onclick = () => {
  pirate3.classList.remove("glow");
  playDialog([
    { speaker:"pirate3", text:"Capitaine, ton trésor est prêt." },
    { speaker:"pirate2", text:"Mais sans communication, personne ne viendra." },
    { speaker:"pirate3", text:"Voyons comment attirer le marché." }
  ], startMG1);
};

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

function startMG1(){
  qIndex = 0;
  stepMG1();
}

function stepMG1(){
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

    b.onclick = () => {

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
          qIndex < quiz.length ? stepMG1() : afterMG1();
        }, 700);
      }
    };

    answers.appendChild(b);
  });

  box.append(title, question, answers);
  miniGame.appendChild(box);
}

function afterMG1(){
  hideMiniGame();
  playDialog(
    [
      { speaker:"pirate2", text:"Parfait." },
      { speaker:"pirate3", text:"Passons à ton identité visuelle." }
    ],
    startMG2Intro
  );
}

/* =====================================================
   🎨 MINI-JEU 2 — IDENTITÉ VISUELLE
===================================================== */
function startMG2Intro(){
  clearMiniGame();

  const box = document.createElement("div");
  box.className = "mg2-box";

  const question = document.createElement("div");
  question.className = "mg2-question";
  question.textContent = "Avant de créer ton univers visuel, tu dois :";

  const infoBtn = document.createElement("button");
  infoBtn.className = "primary";
  infoBtn.textContent = "En savoir plus";

  const info = document.createElement("div");
  info.className = "info-box hidden";
  info.innerHTML = "• À qui tu parles<br>• Ton message<br>• Ton style";

  infoBtn.onclick = () => info.classList.toggle("hidden");

  const next = document.createElement("button");
  next.className = "secondary";
  next.textContent = "Valider";
  next.onclick = startLogo;

  box.append(question, infoBtn, info, next);
  miniGame.appendChild(box);
}

function imageGroup(list, cb){
  const w = document.createElement("div");
  w.className = "visualChoices small horizontal";

  list.forEach(src=>{
    const img = new Image();
    img.src = src;
    img.onclick = cb;
    w.appendChild(img);
  });

  miniGame.appendChild(w);
}

function startLogo(){
  clearMiniGame();
  imageGroup(
    ["images/Logo1.PNG","images/Logo2.PNG","images/Logo3.PNG"],
    startColors
  );
}

function startColors(){
  clearMiniGame();
  imageGroup(
    ["images/Couleur1.PNG","images/Couleur2.PNG","images/Couleur3.PNG"],
    startTypo
  );
}

function startTypo(){
  clearMiniGame();
  imageGroup(
    ["images/Typo1.PNG","images/Typo2.PNG","images/Typo3.PNG"],
    afterMG2
  );
}

/* =====================================================
   🔗 MINI-JEU 3 — RÉSEAUX SOCIAUX
===================================================== */
function afterMG2(){
  hideMiniGame();
  playDialog(
    [
      { speaker:"pirate2", text:"Ton identité est prête." },
      { speaker:"pirate3", text:"Voyons comment la diffuser." }
    ],
    startMG3
  );
}

function startMG3(){
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

  [
    ["Instagram & TikTok","know"],
    ["Facebook & LinkedIn","btob"],
    ["Sites e-commerce","btoc"]
  ].forEach(p=>{
    const b = document.createElement("button");
    b.textContent = p[0];
    b.className = "mg3-left-btn";
    b.onclick = () => selected = { btn:b, key:p[1] };
    left.appendChild(b);
  });

  [
    ["Se faire connaître","know"],
    ["Vendre en BtoB","btob"],
    ["Vendre en BtoC","btoc"]
  ].forEach(t=>{
    const b = document.createElement("button");
    b.textContent = t[0];
    b.onclick = () => {
      if (!selected || selected.key !== t[1]) {
        shakeMiniGame();
        return;
      }
      selected.btn.remove();
      b.remove();
      selected = null;
      ok++;
      if (ok === 3) finish();
    };
    right.appendChild(b);
  });

  container.append(left, right);
  box.append(question, container);
  miniGame.appendChild(box);
}

/* =====================================================
   FIN
===================================================== */
function finish(){
  hideMiniGame();
  sessionStorage.setItem("unlock_pirate5","true");
  location.href = "menu.html";
}

});
