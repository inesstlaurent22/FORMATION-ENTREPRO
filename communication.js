document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   🎬 VIDÉO INTRO
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const introVideo     = document.getElementById("questVideo");
const toggleSound    = document.getElementById("toggleSound");
const closeVideo     = document.getElementById("closeVideo");
const scene          = document.getElementById("scene");

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
  closeIntroVideo();
};

introVideo.onended = closeIntroVideo;

function closeIntroVideo(){
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
const skipDialog = document.getElementById("skipDialog");

let dialogs=[], dIndex=0, dCallback=null;

function playDialog(list, cb){
  dialogs=list; dIndex=0; dCallback=cb;
  dialogBox.classList.remove("hidden");
  skipDialog.classList.remove("hidden");
  showDialog();
}

function showDialog(){
  const d=dialogs[dIndex];
  dialogText.textContent=d.text;
  const p=d.speaker==="pirate2"?pirate2:pirate3;
  const r=p.getBoundingClientRect();
  dialogBox.style.left=`${r.left+r.width/2-dialogBox.offsetWidth/2}px`;
  dialogBox.style.top=`${r.top-dialogBox.offsetHeight-20}px`;
}

dialogBox.onclick=()=>{
  dIndex++;
  dIndex<dialogs.length?showDialog():endDialogs();
};

skipDialog.onclick=e=>{
  e.stopPropagation();
  endDialogs();
};

function endDialogs(){
  dialogBox.classList.add("hidden");
  skipDialog.classList.add("hidden");
  dCallback && dCallback();
}

/* =====================================================
   🎮 MINI-JEUX BASE
===================================================== */
const miniGame=document.getElementById("miniGameContainer");

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
const quiz=[
  {q:"À quoi sert principalement la communication ?",ok:[0,1],a:["Être comprise","Créer une relation","Parler uniquement de soi"]},
  {q:"La communication permet de :",ok:[0,1],a:["Attirer l’attention","Créer de l’émotion","Garantir des ventes"]},
  {q:"Une bonne communication sert à :",ok:[0,1,2],a:["Transmettre un message clair","Se différencier","Construire une image"]},
  {q:"La communication est essentielle pour :",ok:[0,1],a:["Guider le public","Créer du lien","Remplacer un produit"]}
];

let qi=0,found=[];

function startMiniGame1(){ qi=0; stepMG1(); }

function stepMG1(){
  clearMiniGame(); found=[];
  const box=document.createElement("div");
  box.className="mg1-box";

  const title=document.createElement("div");
  title.className="mg1-title";
  title.textContent="À quoi sert la communication ?";

  const q=document.createElement("div");
  q.className="mg1-question";
  q.textContent=quiz[qi].q;

  const a=document.createElement("div");
  a.className="mg1-answers";

  quiz[qi].a.forEach((txt,i)=>{
    const b=document.createElement("button");
    b.textContent=txt;
    b.onclick=()=>{
      if(!quiz[qi].ok.includes(i)){ shake(); return; }
      if(found.includes(i))return;
      found.push(i);
      b.classList.add("pressed");
      b.disabled=true;
      if(found.length===quiz[qi].ok.length){
        setTimeout(()=>{ qi++; qi<quiz.length?stepMG1():afterMG1(); },700);
      }
    };
    a.appendChild(b);
  });

  box.append(title,q,a);
  miniGame.appendChild(box);
}

function afterMG1(){
  hideMiniGame();
  playDialog([
    {speaker:"pirate2",text:"Parfait."},
    {speaker:"pirate3",text:"Passons à ton identité visuelle."}
  ], startMiniGame2);
}

/* =====================================================
   🎨 MINI-JEU 2 — IDENTITÉ VISUELLE (COMPLET)
===================================================== */
function startMiniGame2(){
  clearMiniGame();

  const box=document.createElement("div");
  box.className="mg2-box";

  box.innerHTML=`
    <div class="mg1-title">Crée ton identité visuelle</div>
    <p>
      L’identité visuelle permet à ta marque d’être reconnue, mémorisée et crédible.
      Elle transmet ton univers, tes valeurs et ton message.
    </p>
    <button class="info-small">En savoir plus</button>
  `;

  miniGame.appendChild(box);

  const moreBtn=box.querySelector("button");

  const questBtn=document.createElement("button");
  questBtn.textContent="Continuer la quête";
  questBtn.className="skip-dialog";
  questBtn.style.display="none";
  document.body.appendChild(questBtn);

  moreBtn.onclick=()=>{
    moreBtn.disabled=true;

    const info=document.createElement("div");
    info.className="info-box";
    info.innerHTML=`
      <ul>
        <li>Connaître ton public</li>
        <li>Avoir un message clair</li>
        <li>Créer une cohérence visuelle</li>
        <li>Être reconnaissable rapidement</li>
      </ul>
    `;
    box.appendChild(info);
    questBtn.style.display="block";
  };

  questBtn.onclick=()=>{
    questBtn.remove();
    importanceLogo();
  };
}

/* ---------- ENCHAÎNEMENT IDENTITÉ VISUELLE ---------- */
function importanceLogo(){
  showInfoStep(
    "L’importance du logo",
    "Le logo est le symbole principal de ta marque. Il doit être simple, lisible et cohérent avec ton univers.",
    [
      "Privilégie la simplicité",
      "Assure une bonne lisibilité",
      "Teste-le sur plusieurs supports"
    ],
    ()=>showChoices("Choisis ton logo",["images/Logo1.PNG","images/Logo2.PNG","images/Logo3.PNG"],importanceColors)
  );
}

function importanceColors(){
  showInfoStep(
    "L’importance des couleurs",
    "Les couleurs véhiculent des émotions et influencent la perception de ta marque.",
    [
      "Choisis 2 à 3 couleurs principales",
      "Respecte les contrastes",
      "Sois cohérent sur tous les supports"
    ],
    ()=>showChoices("Choisis tes couleurs",["images/Couleur1.PNG","images/Couleur2.PNG","images/Couleur3.PNG"],importanceTypo)
  );
}

function importanceTypo(){
  showInfoStep(
    "L’importance de la typographie",
    "La typographie renforce le ton et la personnalité de ta marque.",
    [
      "Lisibilité avant tout",
      "Cohérence avec ton univers",
      "Limite le nombre de polices"
    ],
    ()=>showChoices("Choisis ta typographie",["images/Typo1.PNG","images/Typo2.PNG","images/Typo3.PNG"],identityWin)
  );
}

/* ---------- HELPERS MINI-JEU 2 ---------- */
function showInfoStep(title,txt,tips,next){
  clearMiniGame();
  const box=document.createElement("div");
  box.className="mg2-box";
  box.innerHTML=`
    <div class="mg1-title">${title}</div>
    <p>${txt}</p>
    <ul>${tips.map(t=>`<li>${t}</li>`).join("")}</ul>
  `;
  const b=document.createElement("button");
  b.textContent="Continuer";
  b.onclick=next;
  box.appendChild(b);
  miniGame.appendChild(box);
}

function showChoices(title,imgs,next){
  clearMiniGame();
  const box=document.createElement("div");
  box.className="mg2-box";
  box.innerHTML=`<div class="mg1-title">${title}</div>`;
  miniGame.appendChild(box);

  const w=document.createElement("div");
  w.className="visualChoices big";

  imgs.forEach(src=>{
    const wrap=document.createElement("div");
    wrap.className="imgWrap";

    const img=new Image();
    img.src=src;
    img.onclick=next;

    const zoom=document.createElement("button");
    zoom.textContent="🔎";
    zoom.onclick=e=>{
      e.stopPropagation();
      zoomImage(src);
    };

    wrap.append(img,zoom);
    w.appendChild(wrap);
  });

  miniGame.appendChild(w);
}

function zoomImage(src){
  const f=document.createElement("div");
  f.id="fadeScreen";
  f.innerHTML=`<img src="${src}" style="max-width:90%;max-height:90%">`;
  document.body.appendChild(f);
  f.onclick=()=>f.remove();
}

function identityWin(){
  clearMiniGame();
  miniGame.innerHTML=`
    <div class="mg2-box">
      <div class="mg1-title">Bravo !</div>
      <p>Tu as créé ton identité visuelle</p>
      <img src="images/Identiteevisuelle.JPG" style="width:100%;border-radius:14px">
    </div>
  `;
  miniGame.onclick=()=>{
    hideMiniGame();
    playDialog([
      {speaker:"pirate2",text:"Super travail."},
      {speaker:"pirate3",text:"Voyons maintenant comment la diffuser."}
    ], startMiniGame3);
  };
}

/* =====================================================
   🔗 MINI-JEU 3 — RÉSEAUX SOCIAUX
===================================================== */
function startMiniGame3(){
  clearMiniGame();
  // logique inchangée (comme avant)
}

/* =====================================================
   🏁 FIN
===================================================== */
});
