document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   🎬 VIDÉO INTRO — STABLE
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const introVideo     = document.getElementById("questVideo");
const toggleSound    = document.getElementById("toggleSound");
const closeVideo     = document.getElementById("closeVideo");
const scene          = document.getElementById("scene");

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
  closeIntroVideo();
};

introVideo.onended = closeIntroVideo;

function closeIntroVideo(){
  if(videoClosed) return;
  videoClosed = true;
  introVideo.pause();
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
    {speaker:"pirate3",text:"Capitaine, ton trésor est prêt."},
    {speaker:"pirate2",text:"Mais sans communication, personne ne viendra."},
    {speaker:"pirate3",text:"Voyons comment attirer le marché."}
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

dialogBox.onclick=()=>{ ++dIndex<dialogs.length?showDialog():endDialogs(); };
skipDialog.onclick=e=>{e.stopPropagation();endDialogs();};

function endDialogs(){
  dialogBox.classList.add("hidden");
  skipDialog.classList.add("hidden");
  dCallback && dCallback();
}

/* =====================================================
   🎮 MINI-JEUX BASE
===================================================== */
const miniGame=document.getElementById("miniGameContainer");

function clearMiniGame(){ miniGame.innerHTML=""; miniGame.classList.remove("hidden"); }
function hideMiniGame(){ miniGame.classList.add("hidden"); }

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

function startMiniGame1(){qi=0;stepMG1();}

function stepMG1(){
  clearMiniGame(); found=[];
  const box=document.createElement("div"); box.className="mg1-box";

  const title=document.createElement("div");
  title.className="mg1-title";
  title.textContent="À quoi sert la communication ?";

  const q=document.createElement("div");
  q.className="mg1-question";
  q.textContent=quiz[qi].q;

  const ans=document.createElement("div");
  ans.className="mg1-answers";

  quiz[qi].a.forEach((t,i)=>{
    const b=document.createElement("button");
    b.textContent=t;
    b.onclick=()=>{
      if(!quiz[qi].ok.includes(i)){shake();return;}
      if(found.includes(i))return;
      found.push(i); b.classList.add("pressed"); b.disabled=true;
      if(found.length===quiz[qi].ok.length){
        setTimeout(()=>{++qi<quiz.length?stepMG1():afterMG1();},700);
      }
    };
    ans.appendChild(b);
  });

  box.append(title,q,ans);
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
  identityStep(
    "Choisis ton logo",
    "Le choix est libre",
    ["images/Logo1.PNG","images/Logo2.PNG","images/Logo3.PNG"],
    startColors
  );
}

function startColors(){
  identityStep(
    "Choisis tes couleurs",
    "Elles donnent une émotion à ta marque",
    ["images/Couleur1.PNG","images/Couleur2.PNG","images/Couleur3.PNG"],
    startTypo
  );
}

function startTypo(){
  identityStep(
    "Choisis ta typographie",
    "Elle donne le ton de ta communication",
    ["images/Typo1.PNG","images/Typo2.PNG","images/Typo3.PNG"],
    identityWin
  );
}

function identityStep(titleTxt, subTxt, images, next){
  clearMiniGame();

  const box=document.createElement("div");
  box.className="mg2-box";

  const title=document.createElement("div");
  title.className="mg1-title";
  title.textContent=titleTxt;

  const sub=document.createElement("p");
  sub.textContent=subTxt;

  box.append(title,sub);
  miniGame.appendChild(box);

  const w=document.createElement("div");
  w.className="visualChoices big";

  images.forEach(src=>{
    const wrap=document.createElement("div");
    wrap.className="imgWrap";

    const img=new Image();
    img.src=src;
    img.onclick=()=>next();

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
  f.style.position="fixed";
  f.style.inset="0";
  f.style.background="rgba(0,0,0,.9)";
  f.style.display="flex";
  f.style.alignItems="center";
  f.style.justifyContent="center";
  f.style.zIndex="9999";
  f.innerHTML=`<img src="${src}" style="max-width:90%;max-height:90%">`;
  f.onclick=()=>f.remove();
  document.body.appendChild(f);
}

function identityWin(){
  clearMiniGame();

  const box=document.createElement("div");
  box.className="mg2-box";

  box.innerHTML=`
    <div class="mg1-title">Tu as gagné ton identité visuelle</div>
    <img src="images/Identiteevisuelle.PNG" style="max-width:100%;margin-top:16px;border:3px solid gold;border-radius:14px">
    <p>Clique n’importe où pour continuer</p>
  `;

  miniGame.appendChild(box);

  document.body.onclick=()=>{
    document.body.onclick=null;
    hideMiniGame();
    playDialog([
      {speaker:"pirate2",text:"Ton identité est prête."},
      {speaker:"pirate3",text:"Voyons comment la diffuser."}
    ], startMiniGame3);
  };
}

/* =====================================================
   🔗 MINI-JEU 3
===================================================== */
function startMiniGame3(){
  hideMiniGame();
  playDialog([
    {speaker:"pirate2",text:"Choisis les bons canaux."}
  ], ()=>{});
}

});
