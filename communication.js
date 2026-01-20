document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   RÉFÉRENCES
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

  dialogBox.style.left =
    `${r.left + r.width/2 - dialogBox.offsetWidth/2}px`;
  dialogBox.style.top =
    `${r.top - dialogBox.offsetHeight - 20}px`;
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

/* =====================================================
   HELPERS
===================================================== */
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
function addText(t, marginTop = false){
  const p = document.createElement("p");
  p.textContent = t;
  if(marginTop) p.style.marginTop = "22px";
  miniGame.appendChild(p);
}

/* =====================================================
   NOTIFICATION
===================================================== */
function notify(text, success, onClick){
  const n = document.createElement("div");
  n.className = `notification ${success ? "success" : "error"}`;
  n.innerHTML = `<div style="font-size:18px">${text}</div>`;
  document.body.appendChild(n);

  if(onClick){
    n.onclick = () => {
      n.remove();
      onClick();
    };
  } else {
    setTimeout(()=>n.remove(),1500);
  }
}

/* =====================================================
   DÉBUT QUÊTE
===================================================== */
pirate3.onclick = () => {
  playDialog([
    {speaker:"pirate3", text:"Capitaine, ton trésor est prêt."},
    {speaker:"pirate2", text:"Mais sans communication, personne ne viendra."},
    {speaker:"pirate3", text:"Voyons comment attirer le marché."}
  ], startMiniGame1);
};

/* =====================================================
   MINI-JEU 1 – COMMUNICATION
===================================================== */
const quizSteps = [
  {
    title:"⚓ Visite physique",
    q:"Rencontrer un client permet de :",
    opts:["Rassurer","Créer une connexion","Ignorer ses attentes"],
    good:[0,1],
    goodTxt:"La visite physique renforce la confiance."
  },
  {
    title:"🕊️ Phoning / Mailing",
    q:"Le contact direct sert à :",
    opts:["Comprendre les besoins","Créer une relation","Parler uniquement de prix"],
    good:[0,1],
    goodTxt:"Le contact direct humanise l’échange."
  },
  {
    title:"📣 Réseaux sociaux",
    q:"Ils servent surtout à :",
    opts:["Se faire connaître","Montrer son univers","Vendre immédiatement"],
    good:[0,1],
    goodTxt:"Les réseaux sociaux créent de la visibilité."
  },
  {
    title:"📜 Newsletters",
    q:"Une newsletter permet de :",
    opts:["Rester présent","Créer un lien","Envoyer du spam"],
    good:[0,1],
    goodTxt:"La newsletter entretient la relation."
  }
];

let qi = 0;
let selected = [];

function startMiniGame1(){
  qi = 0;
  renderQuestion();
}

function renderQuestion(){
  showMiniGame();
  selected = [];

  const s = quizSteps[qi];
  addTitle(s.title);
  addText(s.q);
  addText("🔴 2 bonnes réponses", true); // espace ajouté

  s.opts.forEach((t,i)=>{
    const b = document.createElement("button");
    b.textContent = t;
    b.style.display = "block";
    b.style.margin = "12px auto";
    b.onclick = () => {
      if(!selected.includes(i)) selected.push(i);
      if(check(s)){
        notify(s.goodTxt, true, ()=>{
          qi++;
          qi < quizSteps.length ? renderQuestion() : afterMiniGame1();
        });
      }
    };
    miniGame.appendChild(b);
  });
}

function check(s){
  return s.good.every(i => selected.includes(i)) &&
         selected.every(i => s.good.includes(i));
}

function afterMiniGame1(){
  hideMiniGame();
  playDialog([
    {speaker:"pirate2", text:"Bien joué."},
    {speaker:"pirate3", text:"Créons ton identité visuelle."}
  ], startMiniGame2);
}

/* =====================================================
   MINI-JEU 2 – IDENTITÉ VISUELLE
===================================================== */
function startMiniGame2(){
  showMiniGame();
  addTitle("🎨 Identité visuelle");
  addText("Choisis ton logo (choix libre)");

  imageGroup(
    ["images/Logo1.PNG","images/Logo2.PNG","images/Logo3.PNG"],
    ()=>startColors()
  );
}

function imageGroup(images, cb){
  const wrap = document.createElement("div");
  wrap.className = "visualChoices";
  images.forEach((src,i)=>{
    const img = document.createElement("img");
    img.src = src;
    img.onclick = ()=>cb(i);
    wrap.appendChild(img);
  });
  miniGame.appendChild(wrap);
}

function startColors(){
  showMiniGame();
  addTitle("Choisis les couleurs");
  imageGroup(
    ["images/Couleur1.PNG","images/Couleur2.PNG","images/Couleur3.PNG"],
    i => i === 1 && startTypo()
  );
}

function startTypo(){
  showMiniGame();
  addTitle("Choisis la typographie");
  imageGroup(
    ["images/Typo1.PNG","images/Typo2.PNG","images/Typo3.PNG"],
    i => i === 0 && showIdentity()
  );
}

function showIdentity(){
  hideMiniGame();
  const f = document.createElement("div");
  f.id = "fadeScreen";

  const box = document.createElement("div");
  box.className = "loaderBox";

  const title = document.createElement("div");
  title.textContent = "🎨 Identité visuelle créée";
  title.style.marginBottom = "12px";

  const img = document.createElement("img");
  img.src = "images/identiteevisuelle.JPG";
  img.style.width = "240px";
  img.style.cursor = "pointer";
  img.onclick = () => {
    f.remove();
    afterMiniGame2();
  };

  box.appendChild(title);
  box.appendChild(img);
  f.appendChild(box);
  document.body.appendChild(f);
}

function afterMiniGame2(){
  playDialog([
    {speaker:"pirate2", text:"Ta marque est reconnaissable."},
    {speaker:"pirate3", text:"Choisissons les bons canaux."}
  ], startMiniGame3);
}

/* =====================================================
   MINI-JEU 3 – CANAUX
===================================================== */
function startMiniGame3(){
  showMiniGame();
  addTitle("Choisis le bon type de communication");

  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.justifyContent = "space-between";

  const left = document.createElement("div");
  const right = document.createElement("div");

  left.style.display = right.style.display = "flex";
  left.style.flexDirection = right.style.flexDirection = "column";
  left.style.gap = right.style.gap = "16px";

  const svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.style.position = "absolute";
  svg.style.inset = "0";
  svg.style.pointerEvents = "none";
  miniGame.appendChild(svg);

  let selected = null;
  let valid = 0;

  const platforms = [
    {l:"Instagram & TikTok", k:"know"},
    {l:"Site de vente en ligne", k:"btoc"},
    {l:"Facebook & LinkedIn", k:"btob"}
  ];

  const targets = [
    {l:"Se faire connaître", k:"know"},
    {l:"Vendre en BtoC", k:"btoc"},
    {l:"Vendre en BtoB", k:"btob"}
  ];

  platforms.forEach(p=>{
    const b = document.createElement("button");
    b.textContent = p.l;
    b.className = "btn-platform";
    b.onclick = ()=>selected = {btn:b, key:p.k};
    left.appendChild(b);
  });

  targets.forEach(t=>{
    const b = document.createElement("button");
    b.textContent = t.l;
    b.style.background = "#e8d3a1"; // beige uniforme
    b.onclick = ()=>{
      if(selected && selected.key === t.k){
        draw(svg, selected.btn, b);
        valid++;
        selected = null;
        if(valid === 3) finish();
      }
    };
    right.appendChild(b);
  });

  container.appendChild(left);
  container.appendChild(right);
  miniGame.appendChild(container);
}

function draw(svg,a,b){
  const r1=a.getBoundingClientRect();
  const r2=b.getBoundingClientRect();
  const s=svg.getBoundingClientRect();
  const l=document.createElementNS("http://www.w3.org/2000/svg","line");
  l.setAttribute("x1",r1.left+r1.width/2-s.left);
  l.setAttribute("y1",r1.top+r1.height/2-s.top);
  l.setAttribute("x2",r2.left+r2.width/2-s.left);
  l.setAttribute("y2",r2.top+r2.height/2-s.top);
  l.setAttribute("stroke","gold");
  l.setAttribute("stroke-width","4");
  svg.appendChild(l);
}

/* =====================================================
   FIN
===================================================== */
function finish(){
  hideMiniGame();
  const f=document.createElement("div");
  f.id="fadeScreen";
  const b=document.createElement("div");
  b.className="loaderBox";
  b.textContent="Bravo, tu as gagné cette quête";
  f.appendChild(b);
  document.body.appendChild(f);

  setTimeout(()=>{
    sessionStorage.setItem("unlock_pirate5","true");
    location.href="menu.html";
  },2500);
}

});
