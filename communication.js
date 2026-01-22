document.addEventListener("DOMContentLoaded", () => {

/* =========================
   RÉFÉRENCES
========================= */
const videoIntro  = document.getElementById("videoIntro");
const introVideo  = document.getElementById("introVideo");
const toggleSound = document.getElementById("toggleSound");
const closeVideo  = document.getElementById("closeVideo");

const scene   = document.getElementById("scene");
const pirate2 = document.getElementById("pirate2");
const pirate3 = document.getElementById("pirate3");

const dialogBox  = document.getElementById("dialogBox");
const dialogText = document.getElementById("dialogText");
const miniGame   = document.getElementById("miniGameContainer");

/* =========================
   VIDÉO INTRO
========================= */
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

/* =========================
   DIALOGUES
========================= */
let dialogs=[], dialogIndex=0, dialogCallback=null;

function playDialog(list, callback){
  dialogs = list;
  dialogIndex = 0;
  dialogCallback = callback;
  dialogBox.classList.remove("hidden");
  showDialog();
}

function showDialog(){
  const d = dialogs[dialogIndex];
  dialogText.textContent = d.text;

  const target = d.speaker === "pirate2" ? pirate2 : pirate3;
  const r = target.getBoundingClientRect();

  dialogBox.style.left = `${r.left + r.width/2 - dialogBox.offsetWidth/2}px`;
  dialogBox.style.top  = `${r.top - dialogBox.offsetHeight - 20}px`;
}

dialogBox.onclick = () => {
  dialogIndex++;
  if(dialogIndex < dialogs.length){
    showDialog();
  } else {
    dialogBox.classList.add("hidden");
    dialogCallback && dialogCallback();
  }
};

/* =========================
   HELPERS
========================= */
function showMiniGame(){
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

function addText(t, bold=false){
  const p = document.createElement("p");
  p.innerHTML = bold ? `<strong>${t}</strong>` : t;
  miniGame.appendChild(p);
}

function addContinue(label, cb){
  const b = document.createElement("button");
  b.textContent = label;
  b.style.marginTop = "20px";
  b.onclick = e => {
    e.stopPropagation();
    cb();
  };
  miniGame.appendChild(b);
}

function infoBubble(html){
  const d = document.createElement("div");
  d.className = "info-bubble hidden";
  d.innerHTML = html;
  return d;
}

/* =========================
   DÉBUT
========================= */
pirate3.onclick = () => {
  playDialog([
    {speaker:"pirate3",text:"Capitaine, ton trésor est prêt."},
    {speaker:"pirate2",text:"Mais sans communication, personne ne viendra."},
    {speaker:"pirate3",text:"Commençons par ton identité visuelle."}
  ], startMiniGame2);
};

/* =========================
   MINI-JEU 2 – IDENTITÉ VISUELLE
========================= */
function startMiniGame2(){
  showMiniGame();

  addTitle("L’identité visuelle : Avant de commencer");
  addText(
    "Avant de faire un logo, de choisir des couleurs ou une écriture, il faut d’abord savoir ce que tu veux montrer.",
    true
  );

  const btn = document.createElement("button");
  btn.textContent = "Voici les points importants à décider";
  btn.style.margin = "20px 0";

  const bubble = infoBubble(`
    • À qui tu parles<br>
    • Ton message principal<br>
    • L’émotion à transmettre<br>
    • Ton style visuel
  `);

  btn.onclick = e => {
    e.stopPropagation();
    bubble.classList.toggle("hidden");
  };

  miniGame.append(btn, bubble);

  addText(
    "👉 Si tu sais répondre à ces questions, ton identité visuelle sera plus simple, rapide à créer et facile à reconnaître."
  );

  addContinue("Continuer", startLogo);
}

/* =========================
   LOGO
========================= */
function startLogo(){
  showMiniGame();
  addTitle("Partie 1 : Ton logo");
  addText("Le choix est libre", true);

  imageGroup(
    ["images/Logo1.PNG","images/Logo2.PNG","images/Logo3.PNG"],
    logoExplanation
  );
}

function logoExplanation(){
  showMiniGame();
  addTitle("Logo – Explication");
  addText("Le logo, c’est le dessin principal qui permet de reconnaître ton projet.", true);

  const btn = document.createElement("button");
  btn.textContent = "À retenir";

  const bubble = infoBubble(`
    • Un logo doit être simple<br>
    • On doit le reconnaître rapidement<br>
    • Il doit fonctionner en petit et en grand<br>
    • Il ne doit pas être trop chargé
  `);

  btn.onclick = e => {
    e.stopPropagation();
    bubble.classList.toggle("hidden");
  };

  miniGame.append(btn, bubble);
  addText("👉 Astuce : si tu peux dessiner ton logo en 5 secondes, c’est validé.");

  addContinue("Continuer", startColors);
}

/* =========================
   COULEURS
========================= */
function startColors(){
  showMiniGame();
  addTitle("Partie 2 : Les couleurs");
  addText(
    "Les couleurs doivent être en cohérence avec le logo de la marque",
    true
  );

  imageGroup(
    ["images/Couleur1.PNG","images/Couleur2.PNG","images/Couleur3.PNG"],
    colorsExplanation
  );
}

function colorsExplanation(){
  showMiniGame();
  addTitle("Les couleurs – Explication");
  addText(
    "Les couleurs doivent être en cohérence avec le logo de la marque",
    true
  );

  const btn = document.createElement("button");
  btn.textContent = "À retenir";

  const bubble = infoBubble(`
    • Choisis 2 à 4 couleurs maximum<br>
    • Une couleur principale<br>
    • Une ou deux couleurs pour compléter<br>
    • Les couleurs doivent aller bien ensemble
  `);

  btn.onclick = e => {
    e.stopPropagation();
    bubble.classList.toggle("hidden");
  };

  miniGame.append(btn, bubble);
  addText("👉 Trop de couleurs = on ne comprend plus. Peu de couleurs = plus clair et plus fort.");

  addContinue("Continuer", startTypo);
}

/* =========================
   TYPOGRAPHIE
========================= */
function startTypo(){
  showMiniGame();
  addTitle("Partie 3 : La typographie");
  addText(
    "La typographie doit rester en cohérence avec l’univers de ta marque",
    true
  );

  imageGroup(
    ["images/Typo1.PNG","images/Typo2.PNG","images/Typo3.PNG"],
    showIdentity
  );
}

/* =========================
   IDENTITÉ VISUELLE – FIN MJ2
========================= */
function showIdentity(){
  hideMiniGame();

  const f = document.createElement("div");
  f.id = "fadeScreen";

  const b = document.createElement("div");
  b.className = "loaderBox";
  b.innerHTML = "<strong>Bravo tu as gagné ton identité visuelle</strong><br>";

  const img = document.createElement("img");
  img.src = "images/Identiteevisuelle.PNG";
  img.style.width = "260px";
  b.appendChild(img);

  f.appendChild(b);
  document.body.appendChild(f);

  f.onclick = () => {
    f.remove();
    afterMiniGame2();
  };
}

/* =========================
   DIALOGUES → MINI-JEU 3
========================= */
function afterMiniGame2(){
  playDialog([
    {speaker:"pirate2",text:"Ton identité est prête."},
    {speaker:"pirate3",text:"Voyons maintenant comment la diffuser."}
  ], startMiniGame3);
}

/* =========================
   MINI-JEU 3 + FIN
========================= */
/* (inchangé, conservé tel quel) */

});
