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
  showLoader(1200, () => scene.classList.remove("hidden"));
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
  const p = d.speaker==="pirate2"?pirate2:pirate3;
  const r = p.getBoundingClientRect();
  dialogBox.style.left = `${r.left+r.width/2-dialogBox.offsetWidth/2}px`;
  dialogBox.style.top  = `${Math.max(20, r.top-dialogBox.offsetHeight-30)}px`;
}

dialogBox.onclick = () => {
  dIndex++;
  dIndex<dialogs.length ? showDialog() : endDialogs();
};

skipDialog.onclick = e => {
  e.preventDefault(); e.stopPropagation(); endDialogs();
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

let qi=0, found=[];

function startMiniGame1(){ qi=0; stepMG1(); }

function stepMG1(){
  clearMiniGame(); found=[];
  const box=document.createElement("div"); box.className="mg1-box";

  const title=document.createElement("div");
  title.className="mg1-title";
  title.textContent="À quoi sert la communication ?";

  const info=document.createElement("div");
  info.className="comm-info-text";
  info.textContent="Réponds à ces questions pour connaître un peu plus la communication. Les questions peuvent avoir 1, 2 ou 3 bonnes réponses.";

  const q=document.createElement("div");
  q.className="gameQuestion";
  q.textContent=quiz[qi].q;

  const a=document.createElement("div");
  a.className="mg1-answers";

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
        setTimeout(()=>{ qi++; qi<quiz.length?stepMG1():afterMG1(); },700);
      }
    };
    a.appendChild(b);
  });

  box.append(title,info,q,a);
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
   🎨 MINI-JEU 2 — IDENTITÉ VISUELLE
===================================================== */
function startMiniGame2(){
  clearMiniGame();

  const box=document.createElement("div");
  box.className="mg2-box identity-box";
  box.innerHTML=`
    <div class="mg1-title">Crée ton identité visuelle</div>
    <p class="identity-text">
      L’identité visuelle permet à ta marque d’être reconnue,
      mémorisée et différenciée.
    </p>
  `;

  const infoBtn=document.createElement("button");
  infoBtn.textContent="En savoir plus";

  const infoBox=document.createElement("div");
  infoBox.className="info-box hidden";
  infoBox.innerHTML=`
    <ul>
      <li>Ton message</li>
      <li>Ton public</li>
      <li>Tes valeurs</li>
      <li>Ton univers graphique</li>
    </ul>
  `;

  const questBtn=document.createElement("button");
  questBtn.className="skip-dialog";
  questBtn.textContent="Continuer la quête";
  questBtn.style.display="none";

  infoBtn.onclick=()=>{
    infoBox.classList.remove("hidden");
    questBtn.style.display="block";
  };

  questBtn.onclick=()=>{
    questBtn.remove();
    showLoader(1000, showLogoInfo);
  };

  box.append(infoBtn,infoBox);
  miniGame.appendChild(box);
  document.body.appendChild(questBtn);
}

/* ================= LOGO → COULEURS → TYPO ================= */

function showLogoInfo(){
  showInfoStep(
    "L’importance du logo",
    "Le logo est l’élément central de ton identité visuelle.",
    ()=>showChoiceStep(
      "Choix du logo",
      ["images/Logo1.PNG","images/Logo2.PNG","images/Logo3.PNG"],
      showColorInfo,
      null
    )
  );
}

function showColorInfo(){
  showInfoStep(
    "L’importance des couleurs",
    "Les couleurs transmettent des émotions.",
    ()=>showChoiceStep(
      "Choix des couleurs",
      ["images/Couleur1.PNG","images/Couleur2.PNG","images/Couleur3.PNG"],
      showTypoInfo,
      "images/Couleur1.PNG"
    )
  );
}

function showTypoInfo(){
  showInfoStep(
    "L’importance de la typographie",
    "La typographie donne le ton de ta marque.",
    ()=>showChoiceStep(
      "Choix de la typographie",
      ["images/Typo1.PNG","images/Typo2.png","images/Typo3.PNG"],
      showIdentityWin,
      "images/Typo1.PNG"
    )
  );
}

function showInfoStep(title,text,next){
  clearMiniGame();
  const box=document.createElement("div");
  box.className="mg2-box";
  box.innerHTML=`<div class="mg1-title">${title}</div><p class="info-text">${text}</p>`;
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
    img.onclick=()=>{
      if(correct && src!==correct){ shake(); return; }
      next();
    };
    w.appendChild(img);
    wrap.appendChild(w);
  });

  miniGame.appendChild(wrap);
}

function showIdentityWin(){
  clearMiniGame();
  const box=document.createElement("div");
  box.className="identity-win";
  box.innerHTML="<h2>Bravo 🎉 Tu as créé ton identité visuelle</h2>";
  miniGame.appendChild(box);

  const questBtn=document.createElement("button");
  questBtn.className="skip-dialog";
  questBtn.textContent="Continuer la quête";
  document.body.appendChild(questBtn);

  questBtn.onclick=()=>{
    questBtn.remove();
    hideMiniGame();
    playDialog(
      [
        {speaker:"pirate2",text:"Magnifique identité."},
        {speaker:"pirate3",text:"Passons à la diffusion."}
      ],
      startMiniGame3
    );
  };
}

/* =====================================================
   🔗 MINI-JEU 3 — RÉSEAUX SOCIAUX
===================================================== */
function startMiniGame3(){
  clearMiniGame();

  const box=document.createElement("div");
  box.className="mg3-box";

  const q=document.createElement("div");
  q.textContent="Associe chaque canal à son objectif";

  const c=document.createElement("div");
  c.className="mg3-container";

  const l=document.createElement("div");
  l.className="mg3-column";

  const r=document.createElement("div");
  r.className="mg3-column";

  let sel=null, ok=0;

  [["Instagram & TikTok","know"],["Facebook & LinkedIn","btob"],["Sites e-commerce","btoc"]]
  .forEach(p=>{
    const b=document.createElement("button");
    b.className="mg3-left-btn";
    b.textContent=p[0];
    b.onclick=()=>sel={btn:b,key:p[1]};
    l.appendChild(b);
  });

  [["Se faire connaître","know"],["Vendre en BtoB","btob"],["Vendre en BtoC","btoc"]]
  .forEach(t=>{
    const b=document.createElement("button");
    b.textContent=t[0];
    b.onclick=()=>{
      if(!sel||sel.key!==t[1]){ shake(); return; }
      sel.btn.remove(); b.remove(); sel=null; ok++;
      if(ok===3) showCommunicationWin();
    };
    r.appendChild(b);
  });

  c.append(l,r);
  box.append(q,c);
  miniGame.appendChild(box);
}

/* =====================================================
   🏆 FIN COMMUNICATION
===================================================== */
function showCommunicationWin(){
  hideMiniGame();
  showLoader(1400,()=>{
    sessionStorage.setItem("unlock_pirate5","true");
    location.href="menu.html";
  });
}

});
