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
   🎬 VIDÉO INTRO — VERSION SÛRE
===================================================== */

// état interne
let videoEnded = false;

// autoplay silencieux (autorisé)
introVideo.muted = true;
introVideo.playsInline = true;
introVideo.play().catch(() => {
  // normal sur mobile : la vidéo attend une interaction
});

// 🔊 Bouton son
toggleSound.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();

  introVideo.muted = !introVideo.muted;
  toggleSound.textContent = introVideo.muted ? "🔇" : "🔊";

  // iOS / Safari : relance si nécessaire
  introVideo.play().catch(() => {});
});

// ✖ Bouton fermer
closeVideo.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (!videoEnded) endVideo();
});

// fin naturelle de la vidéo
introVideo.addEventListener("ended", () => {
  if (!videoEnded) endVideo();
});

function endVideo(){
  videoEnded = true;

  introVideo.pause();
  introVideo.currentTime = 0;

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
  showDialogLine();
}

function showDialogLine(){
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
    showDialogLine();
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

function addText(t){
  const p = document.createElement("p");
  p.textContent = t;
  miniGame.appendChild(p);
}

/* =====================================================
   NOTIFICATIONS
===================================================== */
function notify(text, success){
  const n = document.createElement("div");
  n.className = `notification ${success ? "success" : "error"}`;
  n.style.top = "80px";
  n.innerHTML = success
    ? `<div style="color:gold">Bravo</div><div style="margin-top:8px;font-size:18px;font-weight:bold">${text}</div>`
    : `<div>${text}</div>`;
  document.body.appendChild(n);

  if(!success){
    document.body.classList.add("shake");
    setTimeout(()=>document.body.classList.remove("shake"),300);
  }

  setTimeout(()=>n.remove(),1800);
}

/* =====================================================
   DÉBUT DE QUÊTE
===================================================== */
pirate3.onclick = () => {
  playDialog([
    { speaker:"pirate3", text:"Capitaine, ton trésor est prêt." },
    { speaker:"pirate2", text:"Mais sans communication, personne ne viendra." },
    { speaker:"pirate3", text:"Voyons comment attirer le marché." }
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
  showQuestion();
}

function showQuestion(){
  showMiniGame();
  selected = [];

  const s = quizSteps[qi];
  addTitle(s.title);
  addText(s.q);
  addText("🔴 2 bonnes réponses");

  s.opts.forEach((t,i)=>{
    const b = document.createElement("button");
    b.textContent = t;
    b.onclick = () => {
      if(!selected.includes(i)) selected.push(i);

      if(check(s)){
        notify(s.goodTxt,true);
        setTimeout(()=>{
          qi++;
          qi < quizSteps.length ? showQuestion() : afterMiniGame1();
        },1200);
      } else if(selected.length >= 2){
        notify(s.badTxt,false);
        selected = [];
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
    { speaker:"pirate2", text:"Parfait. Tu sais maintenant attirer l’attention." },
    { speaker:"pirate3", text:"Mais pour être reconnu, il faut une identité forte." }
  ], startMiniGame2);
}

/* =====================================================
   MINI-JEU 2 – IDENTITÉ VISUELLE
===================================================== */
function startMiniGame2(){
  showMiniGame();
  addTitle("🎨 Identité visuelle");
  addText("Logo, couleurs et typographie doivent être cohérents.");

  const b = document.createElement("button");
  b.textContent = "Commencer";
  b.onclick = startLogo;
  miniGame.appendChild(b);
}

function imageGroup(images, cb){
  const loader = document.createElement("div");
  loader.textContent = "⏳";
  loader.style.fontSize = "32px";
  miniGame.appendChild(loader);

  let loaded = 0;
  const wrap = document.createElement("div");
  wrap.className = "visualChoices";

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
  img.style.width = "80%";
  img.onclick = ()=>f.remove();
  f.appendChild(img);
  document.body.appendChild(f);
}

function startLogo(){
  showMiniGame();
  addTitle("Choisis ton logo");
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
  hint.onclick = ()=>txt.textContent =
    "Les couleurs doivent avoir de la cohérence avec le logo.";

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
  const b = document.createElement("div");
  b.className = "loaderBox";
  b.innerHTML = "<div>L’identité visuelle est prête</div>";

  const img = document.createElement("img");
  img.src = "images/identiteevisuelle.JPG";
  img.style.width = "260px";
  img.style.cursor = "pointer";
  img.onclick = ()=>{
    f.remove();
    afterMiniGame2();
  };

  b.appendChild(img);
  f.appendChild(b);
  document.body.appendChild(f);
}

function afterMiniGame2(){
  playDialog([
    { speaker:"pirate2", text:"Ta marque est désormais reconnaissable." },
    { speaker:"pirate3", text:"Voyons maintenant comment diffuser ton message." }
  ], startMiniGame3);
}

/* =====================================================
   MINI-JEU 3 – CANAUX DE COMMUNICATION
===================================================== */
function startMiniGame3(){
  showMiniGame();
  addTitle("Choisis le bon type de communication");

  const hint = document.createElement("button");
  hint.textContent = "Indice";
  const txt = document.createElement("p");

  hint.onclick = ()=>{
    txt.textContent =
      "BtoB : Business to Business = entreprise à entreprise / " +
      "BtoC : Business to Consumer = entreprise à particulier (clients comme toi et moi)";
  };

  miniGame.appendChild(hint);
  miniGame.appendChild(txt);

  const left = document.createElement("div");
  const right = document.createElement("div");
  left.className = "visualChoices";
  right.className = "visualChoices";

  const svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.style.position = "absolute";
  svg.style.inset = "0";
  svg.style.pointerEvents = "none";
  miniGame.appendChild(svg);

  let sel = null;
  let ok = 0;

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
        draw(svg, sel.b, b);
        ok++;
        sel = null;
        if(ok === 3) finish();
      }
    };
    left.appendChild(b);
  });

  [
    { l:"Instagram & TikTok", k:"know" },
    { l:"Shopify", k:"btoc" },
    { l:"LinkedIn & Facebook", k:"btob" }
  ].forEach(p=>{
    const b = document.createElement("button");
    b.className = "btn-platform";
    b.textContent = p.l;
    b.onclick = ()=>sel = { b:b, k:p.k };
    right.appendChild(b);
  });

  miniGame.appendChild(left);
  miniGame.appendChild(right);
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
   FIN DE QUÊTE
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
  setTimeout(()=>location.href="menu.html",2500);
}

});
