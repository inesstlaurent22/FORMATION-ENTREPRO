document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   RÉFÉRENCES DOM
===================================================== */
const videoIntro  = document.getElementById("videoIntro");
const introVideo  = document.getElementById("introVideo");
const toggleSound = document.getElementById("toggleSound");
const closeVideo  = document.getElementById("closeVideo");

const scene     = document.getElementById("scene");
const pirate2   = document.getElementById("pirate2");
const pirate3   = document.getElementById("pirate3");

const dialogBox  = document.getElementById("dialogBox");
const dialogText = document.getElementById("dialogText");
const skipDialog = document.getElementById("skipDialog");

const miniGame = document.getElementById("miniGameContainer");

/* =====================================================
   🎬 VIDÉO INTRO
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
}

/* =====================================================
   💬 DIALOGUES
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
  const t = d.speaker === "pirate2" ? pirate2 : pirate3;
  const r = t.getBoundingClientRect();

  dialogBox.style.left =
    `${r.left + r.width/2 - dialogBox.offsetWidth/2}px`;
  dialogBox.style.top =
    `${r.top - dialogBox.offsetHeight - 20}px`;
}

function endDialogs(){
  dialogBox.classList.add("hidden");
  skipDialog.classList.add("hidden");
  dialogCallback && dialogCallback();
}

dialogBox.onclick = () => {
  dialogIndex++;
  dialogIndex < dialogs.length ? showDialog() : endDialogs();
};

skipDialog.onclick = e => {
  e.stopPropagation();
  endDialogs();
};

/* =====================================================
   🧰 HELPERS
===================================================== */
function clearMiniGame(){
  miniGame.innerHTML = "";
  miniGame.classList.remove("hidden");
}
function hideMiniGame(){
  miniGame.classList.add("hidden");
}
function addTitle(t){
  const h = document.createElement("h3");
  h.textContent = t;
  miniGame.appendChild(h);
}
function addText(t){
  const p = document.createElement("p");
  p.innerHTML = t;
  miniGame.appendChild(p);
}

/* =====================================================
   🔔 NOTIFICATION
===================================================== */
function showNotification(txt){
  const n = document.createElement("div");
  n.className = "notification";
  n.innerHTML = `<strong>Bonne réponse</strong><br>${txt}`;
  document.body.appendChild(n);
  setTimeout(()=>n.remove(), 900);
}

/* =====================================================
   🚀 DÉMARRAGE
===================================================== */
pirate3.onclick = () => playDialog([
  {speaker:"pirate3", text:"Capitaine, ton trésor est prêt."},
  {speaker:"pirate2", text:"Mais sans communication, personne ne viendra."},
  {speaker:"pirate3", text:"Voyons comment attirer le marché."}
], startMiniGame1);

/* =====================================================
   🎯 MINI-JEU 1 — MULTI BONNES RÉPONSES
   (QUESTIONS IDENTIQUES)
===================================================== */
const quiz = [
  {
    q: "Rencontrer un client permet de :",
    ok: [0,1],
    a: ["Rassurer","Créer une connexion","Ignorer ses attentes"]
  },
  {
    q: "Le contact direct sert à :",
    ok: [0,1],
    a: ["Comprendre les besoins","Créer une relation","Parler uniquement de prix"]
  },
  {
    q: "Ils servent surtout à :",
    ok: [0,1],
    a: ["Se faire connaître","Montrer son univers","Vendre immédiatement"]
  },
  {
    q: "Une newsletter permet de :",
    ok: [0,1],
    a: ["Rester présent","Créer un lien","Envoyer du spam"]
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

  const question = document.createElement("div");
  question.className = "mg1-question";
  question.textContent = quiz[qIndex].q;

  const answers = document.createElement("div");
  answers.className = "mg1-answers";

  quiz[qIndex].a.forEach((txt, idx) => {
    const b = document.createElement("button");
    b.textContent = txt;

    b.onclick = () => {
      if (!quiz[qIndex].ok.includes(idx)) return;
      if (found.includes(idx)) return;

      found.push(idx);
      b.classList.add("pressed");
      b.disabled = true;

      if (found.length === quiz[qIndex].ok.length) {
        setTimeout(() => {
          qIndex++;
          if (qIndex < quiz.length) {
            stepMiniGame1();
          } else {
            hideMiniGame();
            playDialog(
              [
                { speaker: "pirate2", text: "Parfait." },
                { speaker: "pirate3", text: "Passons à ton identité visuelle." }
              ],
              startIdentityIntro
            );
          }
        }, 600);
      }
    };

    answers.appendChild(b);
  });

  box.append(question, answers);
  miniGame.appendChild(box);
}

/* =====================================================
   🎨 MINI-JEU 2 — IDENTITÉ VISUELLE
   (TEXTES IDENTIQUES)
===================================================== */
function startIdentityIntro(){
  clearMiniGame();
  addTitle("L’identité visuelle");
  addText("Avant de créer ton univers :");

  const info = document.createElement("button");
  info.textContent = "En savoir plus";

  const box = document.createElement("div");
  box.className = "info-box hidden";
  box.innerHTML = "• À qui tu parles<br>• Ton message<br>• Ce que tu fais ressentir<br>• Ton style";

  info.onclick = () => box.classList.toggle("hidden");

  const next = document.createElement("button");
  next.textContent = "Continuer";
  next.onclick = startLogo;

  miniGame.append(info, box, next);
}

function startLogo(){
  clearMiniGame();
  addTitle("Choisis ton logo");
  imageGroup(
    ["images/Logo1.PNG","images/Logo2.PNG","images/Logo3.PNG"],
    startColors
  );
}

function startColors(){
  clearMiniGame();
  addTitle("Choisis ta palette");
  imageGroup(
    ["images/Couleur1.PNG","images/Couleur2.PNG","images/Couleur3.PNG"],
    startTypo
  );
}

function startTypo(){
  clearMiniGame();
  addTitle("Choisis ta typographie");
  imageGroup(
    ["images/Typo1.PNG","images/Typo2.PNG","images/Typo3.PNG"],
    showIdentity
  );
}

function showIdentity(){
  hideMiniGame();
  playDialog(
    [
      {speaker:"pirate2", text:"Ton identité est prête."},
      {speaker:"pirate3", text:"Voyons comment la diffuser."}
    ],
    startMiniGame3
  );
}

function imageGroup(list, cb){
  const w = document.createElement("div");
  w.className = "visualChoices";

  list.forEach(src => {
    const c = document.createElement("div");
    const img = new Image();
    img.src = src;
    img.onclick = () => cb();

    const z = document.createElement("button");
    z.textContent = "🔎";
    z.onclick = e => {
      e.stopPropagation();
      showZoom(src);
    };

    c.append(img, z);
    w.appendChild(c);
  });

  miniGame.appendChild(w);
}

function showZoom(src){
  const f = document.createElement("div");
  f.id = "fadeScreen";
  f.innerHTML = `<img src="${src}" style="max-width:90%;max-height:90%">`;
  document.body.appendChild(f);
  f.onclick = () => f.remove();
}

/* =====================================================
   🔗 MINI-JEU 3 — RÉSEAUX / ENJEUX
   (BOUTONS IDENTIQUES)
===================================================== */
function startMiniGame3(){
  clearMiniGame();
  addTitle("Les réseaux sociaux");

  const container = document.createElement("div");
  container.className = "mg3-container";

  const leftCol = document.createElement("div");
  leftCol.className = "mg3-column";

  const rightCol = document.createElement("div");
  rightCol.className = "mg3-column";

  let selected = null;
  let ok = 0;

  [
    ["Instagram & TikTok","know"],
    ["Facebook & LinkedIn","btob"],
    ["Sites e-commerce","btoc"]
  ].forEach(p => {
    const b = document.createElement("button");
    b.textContent = p[0];
    b.onclick = () => selected = { btn: b, key: p[1] };
    leftCol.appendChild(b);
  });

  [
    ["Se faire connaître","know"],
    ["Vendre en BtoB","btob"],
    ["Vendre en BtoC","btoc"]
  ].forEach(t => {
    const b = document.createElement("button");
    b.textContent = t[0];
    b.onclick = () => {
      if (selected && selected.key === t[1]) {
        showNotification("Bonne réponse");
        selected.btn.remove();
        b.remove();
        selected = null;
        ok++;
        if (ok === 3) {
          hideMiniGame();
          location.href = "menu.html";
        }
      }
    };
    rightCol.appendChild(b);
  });

  container.append(leftCol, rightCol);
  miniGame.appendChild(container);
}

});
