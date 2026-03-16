document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   🎬 VIDÉO INTRO
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const introVideo     = document.getElementById("questVideo");
const toggleSound    = document.getElementById("toggleSound");
const closeVideo     = document.getElementById("closeVideo");
const scene          = document.getElementById("scene");
const fadeScreen     = document.getElementById("fadeScreen");

let videoClosed = false;

introVideo.muted = true;
introVideo.playsInline = true;
introVideo.autoplay = true;
introVideo.style.pointerEvents = "none";
introVideo.play().catch(()=>{});

toggleSound.onclick = e => {
  e.stopPropagation();
  introVideo.muted = !introVideo.muted;
  toggleSound.textContent = introVideo.muted ? "🔇" : "🔊";
};

closeVideo.onclick = e => {
  e.stopPropagation();
  closeIntro();
};

introVideo.onended = closeIntro;

function closeIntro(){
  if(videoClosed) return;
  videoClosed = true;

  introVideo.pause();
  videoContainer.style.display = "none";

  // Affiche la scène pendant le loader
  scene.classList.remove("hidden");

  // Lance la transition
  showLoader(800);
}

/* =====================================================
   🌑 LOADER
===================================================== */
function showLoader(duration = 1200, cb){
  if(!fadeScreen){ cb && cb(); return; }
  fadeScreen.classList.remove("hidden");
  setTimeout(() => {
    fadeScreen.classList.add("hidden");
    cb && cb();
  }, duration);
}

/* =====================================================
   🏴‍☠️ PIRATES
===================================================== */
const pirate3 = document.getElementById("pirate3");
const pirate2 = document.getElementById("pirate2");

pirate3.classList.add("glow");

pirate3.onclick = () => {
  pirate3.classList.remove("glow");
  playDialog([
    { speaker:"pirate3", text:"Capitaine, ton trésor est prêt." },
    { speaker:"pirate2", text:"Mais sans communication, personne ne viendra." },
    { speaker:"pirate3", text:"Voyons comment attirer le marché." }
  ], startMiniGame1);
};

/* =====================================================
   💬 DIALOGUES
===================================================== */
const dialogBox  = document.getElementById("dialogBox");
const dialogText = document.getElementById("dialogText");
const skipDialoguesBtn = document.getElementById("skipDialoguesBtn");

let dialogs=[], dIndex=0, dCallback=null;

function playDialog(list, cb){
  dialogs = list;
  dIndex = 0;
  dCallback = cb;

  dialogBox.classList.remove("hidden");
  skipDialoguesBtn.classList.remove("hidden"); // ✅ correction

  showDialog();
}

function showDialog(){

  const d = dialogs[dIndex];
  dialogText.textContent = d.text;

  // Force le navigateur à recalculer la taille
  dialogBox.style.visibility = "hidden";
  dialogBox.classList.remove("hidden");

  requestAnimationFrame(() => {

    const p = d.speaker === "pirate2" ? pirate2 : pirate3;
    const r = p.getBoundingClientRect();

    const boxWidth  = dialogBox.offsetWidth;
    const boxHeight = dialogBox.offsetHeight;

    let left = r.left + r.width/2 - boxWidth/2;
    let top  = r.top - boxHeight - 30;

    // Empêche sortie écran
    left = Math.max(10, Math.min(left, window.innerWidth - boxWidth - 10));
    top  = Math.max(20, top);

    dialogBox.style.left = left + "px";
    dialogBox.style.top  = top  + "px";

    dialogBox.style.visibility = "visible";
  });
}

dialogBox.onclick = () => {
  dIndex++;
  dIndex<dialogs.length ? showDialog() : endDialogs();
};

skipDialoguesBtn.onclick = e => {
  e.preventDefault();
  e.stopPropagation();
  endDialogs();
};

function endDialogs(){
  dialogBox.classList.add("hidden");
  skipDialoguesBtn.classList.add("hidden");
  if(dCallback){ const cb=dCallback; dCallback=null; cb(); }
}

/* =====================================================
   🎮 MINI-JEUX BASE
===================================================== */
const miniGame = document.getElementById("miniGameContainer");

function clearMiniGame(){
  miniGame.innerHTML="";
  miniGame.classList.remove("hidden");
}
function hideMiniGame(){ miniGame.classList.add("hidden"); }
   
function shake(){
  const box = document.getElementById("miniGameContainer");

  box.classList.remove("screen-shake"); 
  void box.offsetWidth;                 // force le redémarrage de l'animation
  box.classList.add("screen-shake");

  setTimeout(()=>{
    box.classList.remove("screen-shake");
  },350);
}

/* =====================================================
   🎯 MINI-JEU 1
===================================================== */
const quiz=[
 {q:"À quoi sert principalement la communication ?",ok:[0,1],a:["Être comprise","Créer une relation","Parler uniquement de soi"]},
 {q:"La communication permet de :",ok:[0,1],a:["Attirer l’attention","Créer de l’émotion","Garantir des ventes"]},
 {q:"Une bonne communication sert à :",ok:[0,1,2],a:["Transmettre un message clair","Se différencier","Construire une image"]},
 {q:"La communication est essentielle pour :",ok:[0,1],a:["Guider le public","Créer du lien","Remplacer un produit"]}
];

let qi=0, found=[];

function startMiniGame1(){ qi=0; stepMG1(); }

function stepMG1(){

  clearMiniGame();
  found = [];

  const box = document.createElement("div");
  box.className = "mg1-box";

  box.innerHTML = `
    <div class="mg1-title">À quoi sert la communication ?</div>
    <div class="comm-info-text">
      Réponds à ces questions. Certaines ont plusieurs bonnes réponses.
    </div>
    <div class="gameQuestion">${quiz[qi].q}</div>
  `;

  const answers = document.createElement("div");
  answers.className = "mg1-answers";

  quiz[qi].a.forEach((txt, i)=>{

    const b = document.createElement("button");
    b.textContent = txt;

    b.onclick = ()=>{

      // ❌ Mauvaise réponse
      if(!quiz[qi].ok.includes(i)){
  shake();
  return;
}

      // Empêche double validation
      if(found.includes(i)) return;

      // ✅ Bonne réponse
      found.push(i);
      b.classList.add("correct-locked");
      b.disabled = true;

      // Si toutes les bonnes réponses trouvées
      if(found.length === quiz[qi].ok.length){

        // Désactive tous les boutons
        Array.from(answers.children).forEach(btn=>{
          btn.disabled = true;
        });

        setTimeout(()=>{
          qi++;
          qi < quiz.length ? stepMG1() : afterMG1();
        }, 800);
      }
    };

    answers.appendChild(b);
  });

  box.appendChild(answers);
  miniGame.appendChild(box);
}

function afterMG1(){
  hideMiniGame();
  showLoader(1200,()=>playDialog(
    [
      {speaker:"pirate2",text:"Parfait."},
      {speaker:"pirate3",text:"Passons à ton identité visuelle."}
    ],
    startMiniGame2
  ));
}

/* =====================================================
   🔎 ZOOM
===================================================== */
function openZoom(src){
  const overlay=document.createElement("div");
  overlay.id="zoomOverlay";

  const img=document.createElement("img");
  img.src=src;
  img.className="zoomed-image";

  const close=document.createElement("button");
  close.className="zoom-close";
  close.textContent="✖";

  close.onclick=()=>overlay.remove();
  overlay.onclick=e=>{ if(e.target===overlay) overlay.remove(); };

  overlay.append(img,close);
  document.body.appendChild(overlay);
}

/* =====================================================
   🎨 MINI-JEU 2 → IDENTITÉ VISUELLE
===================================================== */
function startMiniGame2(){
  clearMiniGame();

  const box=document.createElement("div");
  box.className="mg2-box identity-box";
  box.innerHTML=`
    <div class="mg1-title">Crée ton identité visuelle</div>
    <p class="identity-text">
      L’identité visuelle rend ta marque reconnaissable et mémorable.
    </p>
  `;

  const btn=document.createElement("button");
  btn.textContent="Commencer";
  btn.onclick=()=>showLogoInfo();

  box.appendChild(btn);
  miniGame.appendChild(box);
}

/* ================= LOGO → COULEURS → TYPO ================= */

function showLogoInfo(){
  showInfoStep("L’importance du logo","Le logo est central.",()=>showChoiceStep(
    "Choix du logo - Choix libre",
    ["images/Logo1.PNG","images/Logo2.PNG","images/Logo3.PNG"],
    showColorInfo
  ));
}

function showColorInfo(){
  showInfoStep("Les couleurs","Les couleurs transmettent des émotions.",()=>showChoiceStep(
    "Choix des couleurs",
    ["images/Couleur1.PNG","images/Couleur2.PNG","images/Couleur3.PNG"],
    showTypoInfo,
    "images/Couleur1.PNG"
  ));
}

function showTypoInfo(){
  showInfoStep("La typographie","La typographie donne le ton.",()=>showChoiceStep(
    "Choix de la typographie",
    ["images/Typo1.PNG","images/Typo2.png","images/Typo3.PNG"],
    showIdentityWin,
    "images/Typo1.PNG"
  ));
}

function showInfoStep(title,text,next){
  clearMiniGame();
  const box=document.createElement("div");
  box.className="mg2-box";
  box.innerHTML=`
<div class="mg1-title">${title}</div>
<p class="info-text">${text}</p>
`;
  const btn=document.createElement("button");
  btn.textContent="Continuer";
  btn.onclick=next;
  box.appendChild(btn);
  miniGame.appendChild(box);
}

function showChoiceStep(title,images,next,correct){
  clearMiniGame();
  const box=document.createElement("div");
  box.className="mg2-box";
  box.innerHTML=`<div class="mg1-title">${title}</div>`;
  miniGame.appendChild(box);

  const wrap=document.createElement("div");
  wrap.className="visualChoices big";

  images.forEach(src=>{
    const w=document.createElement("div");
    w.className="imgWrap";

    const img=new Image();
    img.src=src;
    img.onclick = ()=>{
  if(correct && src!==correct){
    shake();
    return;
  }
  next();
};

    const zoom=document.createElement("button");
    zoom.textContent="🔎";
    zoom.onclick=e=>{ e.stopPropagation(); openZoom(src); };

    w.append(img,zoom);
    wrap.appendChild(w);
  });

  miniGame.appendChild(wrap);
}

/* =====================================================
   🏆 LOADER IDENTITÉ VISUELLE
===================================================== */
function showIdentityWin(){
  hideMiniGame();

  const overlay = document.createElement("div");
  overlay.id = "identity-loader";

  overlay.innerHTML = `
    <div class="identity-center">
      <h2>Bravo 🎉<br>Tu as créé ton identité visuelle</h2>

      <div class="identity-preview-wrap">
        <img
          src="images/Identitevisuelle.JPG"
          class="identity-preview"
          alt="Identité visuelle"
        >

        <button id="zoomIdentityBtn" type="button">🔎</button>

        <button
          id="continueQuestBtn"
          class="hidden"
          type="button"
        >
          Continuer la quête
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const zoomBtn = overlay.querySelector("#zoomIdentityBtn");
  const continueBtn = overlay.querySelector("#continueQuestBtn");

  /* =====================================================
     🔎 ZOOM IMAGE
  ===================================================== */
zoomBtn.onclick = () => {

  const wrap = overlay.querySelector(".identity-preview-wrap");

  const zoomOverlay = document.createElement("div");
  zoomOverlay.id = "zoomOverlay";

  const img = document.createElement("img");
  img.src = "images/Identitevisuelle.JPG";
  img.className = "zoomed-image";

  const close = document.createElement("button");
  close.className = "zoom-close";
  close.textContent = "✖";

  close.onclick = () => {
    zoomOverlay.remove();
    continueBtn.classList.remove("hidden");
  };

  zoomOverlay.append(img, close);

  wrap.prepend(zoomOverlay);
};

  /* =====================================================
     ➜ SUITE DE LA QUÊTE
  ===================================================== */

  continueBtn.onclick = () => {
    overlay.remove();

    playDialog(
      [
        { speaker:"pirate2", text:"Magnifique identité." },
        { speaker:"pirate3", text:"Passons à la diffusion." }
      ],
      startMiniGame3
    );
  };
}

/* =====================================================
   🔗 MINI-JEU 3
===================================================== */
function startMiniGame3(){
  clearMiniGame();

  const box=document.createElement("div");
  box.className="mg3-box";
  box.innerHTML=`
  <div class="mg1-title">
    Associe les canaux à leurs objectifs
  </div>
  <div class="gameQuestion">
    Relie chaque réseau à son objectif stratégique.
  </div>
`;

  const c=document.createElement("div");
  c.className="mg3-container";

const l = document.createElement("div");
l.className = "mg3-column mg3-left";

const r = document.createElement("div");
r.className = "mg3-column mg3-right";

  let sel=null, ok=0;

[
 ["Instagram & TikTok","know"],
 ["Facebook & LinkedIn","btob"],
 ["Sites e-commerce","btoc"]
].forEach(p=>{
  const b=document.createElement("button");
  b.className="mg3-btn mg3-btn-left";
  b.textContent=p[0];
  b.onclick=()=>sel={btn:b,key:p[1]};
  l.appendChild(b);
});

[
 ["Se faire connaître","know"],
 ["Vendre en BtoB","btob"],
 ["Vendre en BtoC","btoc"]
].forEach(t=>{

  const b=document.createElement("button");
  b.className="mg3-btn-right";
  b.textContent=t[0];

  b.onclick=()=>{
    if(!sel){
      shake();
      return;
    }

    if(sel.key!==t[1]){
      shake();
      sel=null;
      return;
    }

    sel.btn.remove();
    b.remove();
    sel=null;
    ok++;

    if(ok===3) showCommunicationWin();
  };

  r.appendChild(b);
});

  c.append(l,r);
  box.appendChild(c);
  miniGame.appendChild(box);
}

/* =====================================================
   🏆 VICTOIRE + EXPLOSION
===================================================== */
function showCommunicationWin(){
  showLoader(1000, ()=>{
    const overlay = document.createElement("div");
    overlay.id = "communication-win";
    overlay.innerHTML = `
      <div class="win-box">
        <h2>🏴‍☠️ Bravo !</h2>
        <p>Tu as terminé la quête Communication</p>
        <div class="gems-container"></div>
      </div>
    `;
    document.body.appendChild(overlay);

    requestAnimationFrame(()=>{
      launchGemsExplosion(overlay.querySelector(".gems-container"));
    });

    /* =====================================================
       ✅ FLAGS MENU (CRUCIAL)
    ===================================================== */
    sessionStorage.setItem("unlock_pirate5", "true");     // ➜ débloque pirate 3

    setTimeout(()=>{
      window.location.href = "menu.html";
    },4200);
  });
}

/* =====================================================
   💎 GEMS
===================================================== */
function launchGemsExplosion(container){
  const colors = ["#ffd700","#00f2ff","#ff4fd8","#7cff00","#ff8c00"];

  for(let i=0;i<50;i++){
    const gem = document.createElement("div");
    gem.className = "gem";
    const size = Math.random()*10 + 8;
    gem.style.width = size+"px";
    gem.style.height = size+"px";
    gem.style.background = colors[Math.floor(Math.random()*colors.length)];
    gem.style.left = "50%";
    gem.style.top = "50%";

    const angle = Math.random()*Math.PI*2;
    const distance = Math.random()*260 + 80;
    gem.style.setProperty("--x", Math.cos(angle)*distance+"px");
    gem.style.setProperty("--y", Math.sin(angle)*distance+"px");

    container.appendChild(gem);
  }
}
});
