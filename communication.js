document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   🎬 VIDÉO INTRO
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const introVideo = document.getElementById("questVideo");
const toggleSound = document.getElementById("toggleSound");
const closeVideo = document.getElementById("closeVideo");
const scene = document.getElementById("scene");

introVideo.muted = true;
introVideo.playsInline = true;
introVideo.style.pointerEvents = "none";

introVideo.play().catch(()=>{});

toggleSound.onclick = e => {
  e.stopPropagation();
  introVideo.muted = !introVideo.muted;
  toggleSound.textContent = introVideo.muted ? "🔇" : "🔊";
};

closeVideo.onclick = () => endVideo();
introVideo.onended = endVideo;

function endVideo(){
  videoContainer.style.display = "none";
  scene.classList.remove("hidden");
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
    {speaker:"pirate3", text:"Capitaine, ton trésor est prêt."},
    {speaker:"pirate2", text:"Mais sans communication, personne ne viendra."},
    {speaker:"pirate3", text:"Voyons comment attirer le marché."}
  ], startMiniGame1);
};

/* =====================================================
   💬 DIALOGUES
===================================================== */
const dialogBox = document.getElementById("dialogBox");
const dialogText = document.getElementById("dialogText");
const skipDialog = document.getElementById("skipDialog");

let dialogs=[], dIndex=0, dCallback=null;

function playDialog(list, cb){
  dialogs=list; dIndex=0; dCallback=cb;
  dialogBox.classList.remove("hidden");
  skipDialog.classList.remove("hidden");
  showDialog();
}

function showDialog(){
  const d = dialogs[dIndex];
  dialogText.textContent = d.text;
}

dialogBox.onclick = () => {
  dIndex++;
  dIndex < dialogs.length ? showDialog() : endDialogs();
};

skipDialog.onclick = e => {
  e.stopPropagation();
  endDialogs();
};

function endDialogs(){
  dialogBox.classList.add("hidden");
  skipDialog.classList.add("hidden");
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

function hideMiniGame(){
  miniGame.classList.add("hidden");
}

function shake(){
  miniGame.classList.add("screen-shake");
  setTimeout(()=>miniGame.classList.remove("screen-shake"),400);
}

/* =====================================================
   🎯 MINI-JEU 1 — COMMUNICATION
===================================================== */
const quiz = [
  {q:"À quoi sert la communication ?", ok:[0,1], a:["Être comprise","Créer une relation","Parler uniquement de soi"]},
  {q:"Elle permet de :", ok:[0,1], a:["Attirer l’attention","Créer de l’émotion","Garantir des ventes"]},
  {q:"Une bonne communication sert à :", ok:[0,1,2], a:["Transmettre un message","Se différencier","Construire une image"]},
  {q:"Elle est essentielle pour :", ok:[0,1], a:["Guider le public","Créer du lien","Remplacer un produit"]}
];

let qi=0, found=[];

function startMiniGame1(){ qi=0; stepMG1(); }

function stepMG1(){
  clearMiniGame(); found=[];
  const box=document.createElement("div"); box.className="mg1-box";

  const q=document.createElement("div");
  q.className="mg1-question";
  q.textContent=quiz[qi].q;

  const answers=document.createElement("div");
  answers.className="mg1-answers";
  answers.style.flexDirection="column";

  quiz[qi].a.forEach((txt,i)=>{
    const b=document.createElement("button");
    b.textContent=txt;
    b.onclick=()=>{
      if(!quiz[qi].ok.includes(i)){ shake(); return; }
      if(found.includes(i)) return;
      found.push(i);
      b.classList.add("pressed");
      b.disabled=true;
      if(found.length===quiz[qi].ok.length){
        setTimeout(()=>{
          qi++; qi<quiz.length ? stepMG1() : afterMG1();
        },600);
      }
    };
    answers.appendChild(b);
  });

  box.append(q,answers);
  miniGame.appendChild(box);
}

function afterMG1(){
  hideMiniGame();
  playDialog([
    {speaker:"pirate2",text:"Parfait."},
    {speaker:"pirate3",text:"Créons maintenant ton identité visuelle."}
  ], startIdentityIntro);
}

/* =====================================================
   🎨 MINI-JEU 2 — IDENTITÉ VISUELLE
===================================================== */
function startIdentityIntro(){
  clearMiniGame();

  const box=document.createElement("div");
  box.className="mg2-box";

  box.innerHTML=`
    <div class="mg1-title">Crée ton identité visuelle</div>
    <p>Elle permet à ta marque d’être reconnue, mémorisée et différenciée.</p>
  `;

  const infoBtn=document.createElement("button");
  infoBtn.textContent="En savoir plus";

  const infoBox=document.createElement("div");
  infoBox.className="info-box hidden";
  infoBox.innerHTML=`
    • Ton message<br>
    • Ton public<br>
    • Tes valeurs<br>
    • Ton univers graphique
  `;

  const questBtn=document.createElement("button");
  questBtn.textContent="Continuer la quête";
  questBtn.className="skip-dialog";
  questBtn.style.display="none";

  infoBtn.onclick=()=>{
    infoBox.classList.remove("hidden");
    questBtn.style.display="block";
  };

  questBtn.onclick=()=>{ questBtn.remove(); showLogoInfo(); };

  box.append(infoBtn,infoBox);
  miniGame.append(box);
  document.body.appendChild(questBtn);
}

/* ---------- LOGO ---------- */
function showLogoInfo(){
  clearMiniGame();
  miniGame.innerHTML=`
    <div class="mg2-question">L’importance du logo</div>
    <p>Il rend ta marque reconnaissable. Choisis-le simple, lisible et cohérent.</p>
  `;
  const btn=document.createElement("button");
  btn.textContent="Continuer";
  btn.onclick=()=>showChoices(
    ["images/Logo1.PNG","images/Logo2.PNG","images/Logo3.PNG"],
    ()=>showColorInfo(),
    null
  );
  miniGame.appendChild(btn);
}

/* ---------- COULEURS ---------- */
function showColorInfo(){
  clearMiniGame();
  miniGame.innerHTML=`
    <div class="mg2-question">L’importance des couleurs</div>
    <p>Elles transmettent des émotions et renforcent ton message.</p>
  `;
  const btn=document.createElement("button");
  btn.textContent="Continuer";
  btn.onclick=()=>showChoices(
    ["images/Couleur1.PNG","images/Couleur2.PNG","images/Couleur3.PNG"],
    showTypoInfo,
    "images/Couleur1.PNG"
  );
  miniGame.appendChild(btn);
}

/* ---------- TYPO ---------- */
function showTypoInfo(){
  clearMiniGame();
  miniGame.innerHTML=`
    <div class="mg2-question">L’importance de la typographie</div>
    <p>Elle donne une personnalité à ta marque.</p>
  `;
  const btn=document.createElement("button");
  btn.textContent="Continuer";
  btn.onclick=()=>showChoices(
    ["images/Typo1.PNG","images/Typo2.png","images/Typo3.PNG"],
    showWinIdentity,
    "images/Typo1.PNG"
  );
  miniGame.appendChild(btn);
}

/* ---------- CHOIX IMAGES ---------- */
function showChoices(list, cb, correct){
  const wrap=document.createElement("div");
  wrap.className="visualChoices big";

  list.forEach(src=>{
    const w=document.createElement("div");
    w.className="imgWrap";

    const img=new Image();
    img.src=src;
    img.onclick=()=>{
      if(correct && src!==correct){ shake(); return; }
      cb();
    };

    const zoom=document.createElement("button");
    zoom.textContent="🔎";
    zoom.onclick=e=>{
      e.stopPropagation();
      zoomImage(src);
    };

    w.append(img,zoom);
    wrap.appendChild(w);
  });

  miniGame.appendChild(wrap);
}

function zoomImage(src){
  const f=document.createElement("div");
  f.id="fadeScreen";
  f.innerHTML=`<img src="${src}" style="max-width:90%;max-height:90%">`;
  f.onclick=()=>f.remove();
  document.body.appendChild(f);
}

/* ---------- FIN IDENTITÉ ---------- */
function showWinIdentity(){
  clearMiniGame();
  miniGame.innerHTML=`
    <h2>Bravo, tu as créé ton identité visuelle 🎉</h2>
    <img src="images/Identiteevisuelle.JPG" style="max-width:100%;margin-top:20px;">
  `;
  document.body.onclick=()=>{
    document.body.onclick=null;
    hideMiniGame();
    playDialog([
      {speaker:"pirate2",text:"Magnifique identité."},
      {speaker:"pirate3",text:"Passons à la diffusion."}
    ], startMiniGame3);
  };
}

/* =====================================================
   🔗 MINI-JEU 3
===================================================== */
function startMiniGame3(){
  clearMiniGame();
  miniGame.innerHTML="<div class='mg3-question'>Associe chaque canal à son objectif</div>";
}

/* =====================================================
   FIN
===================================================== */
});
