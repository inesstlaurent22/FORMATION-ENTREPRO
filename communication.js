document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   🎬 VIDÉO INTRO — VERSION CORRIGÉE & STABLE
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const introVideo     = document.getElementById("questVideo");
const toggleSound    = document.getElementById("toggleSound");
const closeVideo     = document.getElementById("closeVideo");
const scene          = document.getElementById("scene");

let videoClosed = false;

/* Sécurité iOS / Safari */
introVideo.muted = true;
introVideo.playsInline = true;
introVideo.autoplay = true;

/* La vidéo ne doit jamais bloquer les clics */
introVideo.style.pointerEvents = "none";

/* Lecture sécurisée */
const safePlay = () => {
  const p = introVideo.play();
  if (p !== undefined) p.catch(() => {});
};
safePlay();

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

/* ✅ TRANSITION VIDÉO → SCÈNE (CORRECTION DÉFINITIVE) */
function closeIntroVideo(){
  if (videoClosed) return;
  videoClosed = true;

  introVideo.pause();

  /* Retire complètement la vidéo */
  videoContainer.style.display = "none";

  /* Affiche la scène */
  scene.classList.remove("hidden");
  scene.style.display = "block";
}

/* =====================================================
   🏴‍☠️ PIRATES
===================================================== */
const pirate3 = document.getElementById("pirate3");
const pirate2 = document.getElementById("pirate2");

/* Glow au démarrage */
pirate3.classList.add("glow");

pirate3.addEventListener("click", () => {
  pirate3.classList.remove("glow");
  playDialog([
    { speaker:"pirate3", text:"Capitaine, ton trésor est prêt." },
    { speaker:"pirate2", text:"Mais sans communication, personne ne viendra." },
    { speaker:"pirate3", text:"Voyons comment attirer le marché." }
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
    `${r.left + r.width/2 - dialogBox.offsetWidth/2}px`;
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
  endDialogs();
});

function endDialogs(){
  dialogBox.classList.add("hidden");
  skipDialog.classList.add("hidden");
  if (dialogCallback){
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

function shake(){
  miniGame.classList.add("screen-shake");
  setTimeout(() => miniGame.classList.remove("screen-shake"), 400);
}

/* =====================================================
   🎯 MINI-JEU 1 — COMMUNICATION
===================================================== */
const quiz = [
  {
    q:"À quoi sert principalement la communication ?",
    ok:[0,1],
    a:["Être comprise","Créer une relation","Parler uniquement de soi"]
  },
  {
    q:"La communication permet de :",
    ok:[0,1],
    a:["Attirer l’attention","Créer de l’émotion","Garantir des ventes"]
  },
  {
    q:"Une bonne communication sert à :",
    ok:[0,1,2],
    a:["Transmettre un message clair","Se différencier","Construire une image"]
  },
  {
    q:"La communication est essentielle pour :",
    ok:[0,1],
    a:["Guider le public","Créer du lien","Remplacer un produit"]
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

  quiz[qIndex].a.forEach((txt,i)=>{
    const b = document.createElement("button");
    b.textContent = txt;

    b.addEventListener("click",()=>{
      if (!quiz[qIndex].ok.includes(i)){
        shake();
        return;
      }
      if (found.includes(i)) return;

      found.push(i);
      b.classList.add("pressed");
      b.disabled = true;

      if (found.length === quiz[qIndex].ok.length){
        setTimeout(()=>{
          qIndex++;
          qIndex < quiz.length ? stepMiniGame1() : afterMiniGame1();
        },700);
      }
    });

    answers.appendChild(b);
  });

  box.append(title,question,answers);
  miniGame.appendChild(box);
}

function afterMiniGame1(){
  hideMiniGame();
  playDialog([
    { speaker:"pirate2", text:"Parfait." },
    { speaker:"pirate3", text:"Passons à ton identité visuelle." }
  ], startMiniGame2);
}

/* =====================================================
   🎨 MINI-JEU 2 — IDENTITÉ VISUELLE (NOUVELLE VERSION)
===================================================== */
function startMiniGame2(){
  clearMiniGame();

  /* ---------- ÉTAPE 1 : INTRO IDENTITÉ VISUELLE ---------- */
  const box = document.createElement("div");
  box.className = "mg2-box";

  const title = document.createElement("div");
  title.className = "mg2-question";
  title.textContent = "Crée ton identité visuelle";

  const text = document.createElement("p");
  text.innerHTML =
    "Ton identité visuelle est ce qui permet à ta marque d’être reconnue, mémorisée et différenciée. " +
    "Elle transmet tes valeurs, ton univers et la promesse que tu fais à ton public.";

  const infoBtn = document.createElement("button");
  infoBtn.className = "info-small";
  infoBtn.textContent = "En savoir plus";

  box.append(title, text, infoBtn);
  miniGame.appendChild(box);

  /* ---------- BOUTON CONTINUER LA QUÊTE (CACHÉ AU DÉPART) ---------- */
  const continueQuest = document.createElement("button");
  continueQuest.textContent = "Continuer la quête";
  continueQuest.className = "skip-dialog";
  continueQuest.style.top = "18px";
  continueQuest.style.right = "20px";
  continueQuest.style.display = "none";

  document.body.appendChild(continueQuest);

  /* ---------- ÉTAPE 2 : IMPORTANCE DU LOGO ---------- */
  infoBtn.addEventListener("click", () => {
    infoBtn.disabled = true;
    continueQuest.style.display = "block";

    const logoBox = document.createElement("div");
    logoBox.className = "info-box";

    logoBox.innerHTML = `
      <h3>L’importance du logo</h3>
      <p>
        Le logo est le symbole central de ton identité visuelle.  
        Il permet à ta marque d’être immédiatement reconnaissable et mémorable.
        <br><br>
        Un bon logo doit être simple, lisible, cohérent avec ton univers
        et fonctionner sur tous les supports (réseaux sociaux, site, print).
      </p>
    `;

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Continuer";

    logoBox.appendChild(nextBtn);
    box.appendChild(logoBox);

    nextBtn.addEventListener("click", () => {
      continueQuest.remove();
      showLogoChoice();
    });
  });

  /* ---------- SÉCURITÉ : CONTINUER LA QUÊTE ---------- */
  continueQuest.addEventListener("click", () => {
    continueQuest.remove();
    showLogoChoice();
  });
}

/* =====================================================
   🖼️ CHOIX DU LOGO
===================================================== */
function showLogoChoice(){
  clearMiniGame();

  const box = document.createElement("div");
  box.className = "mg2-box";

  const title = document.createElement("div");
  title.className = "mg2-question";
  title.textContent = "Choisis ton logo";

  const subtitle = document.createElement("p");
  subtitle.textContent = "Le choix est libre";

  box.append(title, subtitle);
  miniGame.appendChild(box);

  showImages(
    ["images/Logo1.PNG","images/Logo2.PNG","images/Logo3.PNG"],
    startMiniGame3
  );
}
   
/* =====================================================
   🔗 MINI-JEU 3 — RÉSEAUX SOCIAUX
===================================================== */
function startMiniGame3(){
  hideMiniGame();
  playDialog([
    { speaker:"pirate2", text:"Ton identité est prête." },
    { speaker:"pirate3", text:"Voyons comment la diffuser." }
  ], launchMiniGame3);
}

function launchMiniGame3(){
  clearMiniGame();

  const box = document.createElement("div");
  box.className = "mg3-box";

  const q = document.createElement("div");
  q.className = "mg3-question";
  q.textContent = "Associe chaque canal à son objectif";

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

  leftData.forEach(p=>{
    const b = document.createElement("button");
    b.className = "mg3-left-btn";
    b.textContent = p[0];
    b.addEventListener("click",()=>selected={btn:b,key:p[1]});
    left.appendChild(b);
  });

  rightData.forEach(t=>{
    const b = document.createElement("button");
    b.textContent = t[0];
    b.addEventListener("click",()=>{
      if (!selected || selected.key !== t[1]){
        shake();
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

  container.append(left,right);
  box.append(q,container);
  miniGame.appendChild(box);
}

function shuffle(arr){
  return arr.sort(()=>Math.random()-0.5);
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
