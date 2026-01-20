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
   💬 SYSTÈME DE DIALOGUES
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
    `${r.left + r.width / 2 - dialogBox.offsetWidth / 2}px`;
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
   HELPERS UI
===================================================== */
function showMiniGame(noScroll=false){
  miniGame.innerHTML = "";
  miniGame.classList.remove("hidden");
  miniGame.style.overflow = noScroll ? "hidden" : "auto";
}

function hideMiniGame(){
  miniGame.classList.add("hidden");
}

function addTitle(text){
  const h = document.createElement("h3");
  h.textContent = text;
  miniGame.appendChild(h);
}

function addText(text, cls=""){
  const p = document.createElement("p");
  p.textContent = text;
  if(cls) p.className = cls;
  miniGame.appendChild(p);
}

/* =====================================================
   🔔 NOTIFICATION CLIQUABLE
===================================================== */
function showNotification(text, success, onClick, showHint=false){
  if(showHint){
    const hint = document.createElement("div");
    hint.className = "notifHint";
    hint.textContent = "Clique sur la notification pour continuer";
    document.body.appendChild(hint);

    setTimeout(()=>hint.remove(),2000);
  }

  const n = document.createElement("div");
  n.className = `notification ${success ? "success" : "error"}`;
  n.innerHTML = success
    ? `<div style="color:gold">Bravo</div><div style="margin-top:10px;font-size:18px;font-weight:bold">${text}</div>`
    : `<div>${text}</div>`;

  n.onclick = () => {
    n.remove();
    onClick && onClick();
  };

  document.body.appendChild(n);
}

/* =====================================================
   DÉBUT DE LA QUÊTE
===================================================== */
pirate3.onclick = () => {
  playDialog([
    { speaker:"pirate3", text:"Capitaine, ton trésor est prêt." },
    { speaker:"pirate2", text:"Mais sans communication, personne ne viendra." },
    { speaker:"pirate3", text:"Voyons comment attirer le marché." }
  ], startMiniGame1);
};

/* =====================================================
   🎮 MINI-JEU 1 – COMMUNICATION
===================================================== */
const quizSteps = [
  {
    title:"⚓ Visite physique",
    q:"Rencontrer un client permet de :",
    opts:["Rassurer","Créer une connexion","Ignorer ses attentes"],
    good:[0,1],
    goodTxt:"La visite physique renforce la confiance.",
    badTxt:"Ignorer un client détruit la relation."
  },
  {
    title:"🕊️ Phoning / Mailing",
    q:"Le contact direct sert à :",
    opts:["Comprendre les besoins","Créer une relation","Parler uniquement de prix"],
    good:[0,1],
    goodTxt:"Le contact direct humanise l’échange.",
    badTxt:"Parler uniquement de prix bloque le dialogue."
  },
  {
    title:"📣 Réseaux sociaux",
    q:"Ils servent surtout à :",
    opts:["Se faire connaître","Montrer son univers","Vendre immédiatement"],
    good:[0,1],
    goodTxt:"Les réseaux sociaux créent de la visibilité.",
    badTxt:"Forcer la vente fait fuir."
  },
  {
    title:"📜 Newsletters",
    q:"Une newsletter permet de :",
    opts:["Rester présent","Créer un lien","Envoyer du spam"],
    good:[0,1],
    goodTxt:"La newsletter entretient la relation.",
    badTxt:"Le spam détruit la confiance."
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
  addText("🔴 2 bonnes réponses", "pulse");

  const wrap = document.createElement("div");
  wrap.style.display = "flex";
  wrap.style.flexDirection = "column";
  wrap.style.alignItems = "center";
  wrap.style.gap = "14px";

  s.opts.forEach((t,i)=>{
    const b = document.createElement("button");
    b.textContent = t;
    b.onclick = () => {
      if(!selected.includes(i)) selected.push(i);

      if(check(s)){
        showNotification(
          s.goodTxt,
          true,
          ()=>{
            qi++;
            qi < quizSteps.length ? renderQuestion() : afterMiniGame1();
          },
          qi === 0
        );
      } else if(selected.length >= 2){
        showNotification(s.badTxt,false,()=>{ selected = []; });
      }
    };
    wrap.appendChild(b);
  });

  miniGame.appendChild(wrap);
}

function check(s){
  return s.good.every(i => selected.includes(i)) &&
         selected.every(i => s.good.includes(i));
}

function afterMiniGame1(){
  hideMiniGame();
  playDialog([
    { speaker:"pirate2", text:"Parfait. Tu sais maintenant attirer l’attention." },
    { speaker:"pirate3", text:"Passons à ton identité visuelle." }
  ], startMiniGame2);
}

/* =====================================================
   🎮 MINI-JEU 2 – IDENTITÉ VISUELLE
===================================================== */
function startMiniGame2(){
  showMiniGame();
  addTitle("🎨 Identité visuelle");
  addText("Choisis ton logo, tes couleurs et ta typographie.");

  const btn = document.createElement("button");
  btn.textContent = "Commencer";
  btn.onclick = startLogo;
  miniGame.appendChild(btn);
}

function imageGroup(images, cb){
  const loader = document.createElement("div");
  loader.textContent = "⏳";
  loader.style.fontSize = "30px";
  miniGame.appendChild(loader);

  const wrap = document.createElement("div");
  wrap.className = "visualChoices";

  let loaded = 0;

  images.forEach((src,i)=>{
    const img = new Image();
    img.src = src;
    img.onload = ()=>{
      loaded++;
      if(loaded === images.length){
        loader.remove();
        miniGame.appendChild(wrap);
      }
    };

    const box = document.createElement("div");
    const im = document.createElement("img");
    im.src = src;
    im.onclick = ()=>cb(i);

    const zoom = document.createElement("button");
    zoom.textContent = "🔎";
    zoom.onclick = e => {
      e.stopPropagation();
      showZoom(src);
    };

    box.appendChild(im);
    box.appendChild(zoom);
    wrap.appendChild(box);
  });
}

function showZoom(src){
  const f = document.createElement("div");
  f.id = "fadeScreen";

  const img = document.createElement("img");
  img.src = src;
  img.style.width = "260px";
  img.style.border = "4px solid gold";
  img.style.borderRadius = "16px";
  img.onclick = ()=>f.remove();

  f.appendChild(img);
  document.body.appendChild(f);
}

function startLogo(){
  showMiniGame();
  addTitle("Choisis ton logo");
  addText("Le choix est libre");
  imageGroup(
    ["images/Logo1.PNG","images/Logo2.PNG","images/Logo3.PNG"],
    ()=>startColors()
  );
}

function startColors(){
  showMiniGame();
  addTitle("Choisis les couleurs");

  const hint = document.createElement("button");
  hint.textContent = "Indice";
  const txt = document.createElement("p");

  hint.onclick = ()=>{
    txt.textContent = "Les couleurs doivent être cohérentes avec le logo.";
  };

  miniGame.appendChild(hint);
  miniGame.appendChild(txt);

  imageGroup(
    ["images/Couleur1.PNG","images/Couleur2.PNG","images/Couleur3.PNG"],
    i => { if(i === 1) startTypo(); }
  );
}

function startTypo(){
  showMiniGame();
  addTitle("Choisis la typographie");

  imageGroup(
    ["images/Typo1.PNG","images/Typo2.PNG","images/Typo3.PNG"],
    i => { if(i === 0) showIdentity(); }
  );
}

function showIdentity(){
  hideMiniGame();

  const f = document.createElement("div");
  f.id = "fadeScreen";

  const box = document.createElement("div");
  box.className = "loaderBox";
  box.textContent = "L’identité visuelle est prête";

  const img = document.createElement("img");
  img.src = "images/identiteevisuelle.JPG";
  img.style.width = "260px";
  img.style.cursor = "pointer";
  img.onclick = ()=>{
    f.remove();
    afterMiniGame2();
  };

  box.appendChild(img);
  f.appendChild(box);
  document.body.appendChild(f);
}

function afterMiniGame2(){
  playDialog([
    { speaker:"pirate2", text:"Ta marque est désormais reconnaissable." },
    { speaker:"pirate3", text:"Voyons comment la diffuser." }
  ], startMiniGame3);
}

/* =====================================================
   🎮 MINI-JEU 3 – CANAUX
===================================================== */
function startMiniGame3(){
  showMiniGame(true);
  addTitle("Choisis le bon type de communication");

  const hint = document.createElement("button");
  hint.textContent = "Indice";

  hint.onclick = ()=>{
    showNotification(
      "BtoC : entreprise → particulier / BtoB : entreprise → entreprise",
      true
    );
  };

  miniGame.appendChild(hint);

  const left = document.createElement("div");
  const right = document.createElement("div");
  left.className = "visualChoices";
  right.className = "visualChoices";

  left.style.flexDirection = "column";
  right.style.flexDirection = "column";

  const svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.style.position = "absolute";
  svg.style.inset = "0";
  svg.style.pointerEvents = "none";
  miniGame.appendChild(svg);

  let sel = null;
  let ok = 0;

  [
    { l:"Instagram & Tik Tok", k:"know" },
    { l:"Site de vente en ligne", k:"btoc" },
    { l:"Facebook & LinkedIn", k:"btob" }
  ].forEach(p=>{
    const b = document.createElement("button");
    b.className = "btn-platform";
    b.textContent = p.l;
    b.onclick = ()=>sel = { b:b, k:p.k };
    left.appendChild(b);
  });

  [
    { l:"Se faire connaître", k:"know" },
    { l:"Vendre en BtoC", k:"btoc" },
    { l:"Vendre en BtoB", k:"btob" }
  ].forEach(t=>{
    const b = document.createElement("button");
    b.className = "btn-target";
    b.textContent = t.l;
    b.onclick = ()=>{
      if(sel && sel.k === t.k){
        drawLine(svg, sel.b, b);
        ok++;
        sel = null;
        if(ok === 3) finish();
      }
    };
    right.appendChild(b);
  });

  miniGame.appendChild(left);
  miniGame.appendChild(right);
}

function drawLine(svg,a,b){
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
   🏆 FIN + GEMS
===================================================== */
function finish(){
  hideMiniGame();

  const f = document.createElement("div");
  f.id = "fadeScreen";

  const box = document.createElement("div");
  box.className = "loaderBox";
  box.textContent = "Bravo tu as gagné cette quête";

  f.appendChild(box);
  document.body.appendChild(f);

  explodeGems(f);

  setTimeout(()=>{
    sessionStorage.setItem("unlock_pirate5","true");
    window.location.href="menu.html";
  },3000);
}

function explodeGems(container){
  const colors = ["#ffd700","#00ffcc","#ff4dd2","#4da6ff","#9cff4d","#ff9f4d"];

  for(let i=0;i<40;i++){
    const g = document.createElement("div");
    g.className = "gem";

    g.style.background = colors[Math.floor(Math.random()*colors.length)];
    g.style.width = "10px";
    g.style.height = "10px";
    g.style.clipPath = "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)";
    g.style.position = "absolute";
    g.style.left = "50%";
    g.style.top = "50%";

    container.appendChild(g);

    g.animate([
      { transform:"translate(0,0)", opacity:1 },
      { transform:`translate(${(Math.random()-0.5)*600}px, ${(Math.random()-0.5)*600}px)`, opacity:0 }
    ],{ duration:1200, easing:"ease-out" });

    setTimeout(()=>g.remove(),1200);
  }
}

});
