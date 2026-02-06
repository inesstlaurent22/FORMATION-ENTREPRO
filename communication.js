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
  if (videoClosed) return;
  videoClosed = true;
  introVideo.pause();
  videoContainer.style.display = "none";
  scene.classList.remove("hidden");
}

/* =====================================================
   🏴‍☠️ PIRATES & DIALOGUES
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

const dialogBox  = document.getElementById("dialogBox");
const dialogText = document.getElementById("dialogText");
const skipDialog = document.getElementById("skipDialog");

let dialogs=[], dialogIndex=0, dialogCallback=null;

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
  const p = d.speaker==="pirate2"?pirate2:pirate3;
  const r = p.getBoundingClientRect();
  dialogBox.style.left = `${r.left+r.width/2-dialogBox.offsetWidth/2}px`;
  dialogBox.style.top  = `${r.top-dialogBox.offsetHeight-20}px`;
}

dialogBox.onclick = () => {
  dialogIndex++;
  dialogIndex < dialogs.length ? showDialog() : endDialogs();
};

skipDialog.onclick = e => {
  e.stopPropagation();
  endDialogs();
};

function endDialogs(){
  dialogBox.classList.add("hidden");
  skipDialog.classList.add("hidden");
  if(dialogCallback){ dialogCallback(); dialogCallback=null; }
}

/* =====================================================
   🎮 MINI-JEUX — BASE
===================================================== */
const miniGame = document.getElementById("miniGameContainer");

function clearMiniGame(){
  miniGame.innerHTML = "";
  miniGame.classList.remove("hidden");
}
function hideMiniGame(){ miniGame.classList.add("hidden"); }
function shake(){
  miniGame.classList.add("screen-shake");
  setTimeout(()=>miniGame.classList.remove("screen-shake"),400);
}

/* =====================================================
   🎯 MINI-JEU 1 — COMMUNICATION (STYLE AVANT)
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
  ], startIdentityIntro);
}

/* =====================================================
   🎨 MINI-JEU 2 — IDENTITÉ VISUELLE (PROCESSUS COMPLET)
===================================================== */

/* INTRO */
function startIdentityIntro(){
  showInfoBox(
    "Crée ton identité visuelle",
    "Ton identité visuelle permet à ta marque d’être reconnue, mémorisée et différenciée.",
    startLogoInfo
  );
}

/* LOGO */
function startLogoInfo(){
  showInfoBox(
    "L’importance du logo",
    "Le logo est le symbole central de ta marque. Il doit être simple, reconnaissable et cohérent.",
    ()=>showChoice(
      "Choisis ton logo",
      ["images/Logo1.PNG","images/Logo2.PNG","images/Logo3.PNG"],
      startColorInfo
    )
  );
}

/* COULEURS */
function startColorInfo(){
  showInfoBox(
    "L’importance des couleurs",
    "Les couleurs transmettent des émotions et renforcent ton message.",
    ()=>showChoice(
      "Choisis tes couleurs",
      ["images/Couleur1.PNG","images/Couleur2.PNG","images/Couleur3.PNG"],
      startTypoInfo
    )
  );
}

/* TYPO */
function startTypoInfo(){
  showInfoBox(
    "L’importance de la typographie",
    "La typographie donne une voix à ta marque et influence la crédibilité.",
    ()=>showChoice(
      "Choisis ta typographie",
      ["images/Typo1.PNG","images/Typo2.PNG","images/Typo3.PNG"],
      finishIdentity
    )
  );
}

/* HELPERS MINI-JEU 2 */
function showInfoBox(titleTxt, textTxt, next){
  clearMiniGame();
  const box=document.createElement("div"); box.className="mg2-box";

  const t=document.createElement("div");
  t.className="mg1-title";
  t.textContent=titleTxt;

  const p=document.createElement("p");
  p.textContent=textTxt;

  const b=document.createElement("button");
  b.textContent="Continuer";
  b.onclick=next;

  box.append(t,p,b);
  miniGame.appendChild(box);
}

function showChoice(titleTxt, imgs, next){
  clearMiniGame();
  const box=document.createElement("div"); box.className="mg2-box";

  const t=document.createElement("div");
  t.className="mg1-title";
  t.textContent=titleTxt;

  box.appendChild(t);
  miniGame.appendChild(box);

  const w=document.createElement("div");
  w.className="visualChoices big";

  imgs.forEach(src=>{
    const wrap=document.createElement("div"); wrap.className="imgWrap";
    const img=new Image(); img.src=src; img.onclick=next;
    const z=document.createElement("button"); z.textContent="🔎";
    z.onclick=e=>{e.stopPropagation(); zoomImage(src);};
    wrap.append(img,z); w.appendChild(wrap);
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

/* FIN IDENTITÉ VISUELLE */
function finishIdentity(){
  clearMiniGame();

  const box=document.createElement("div");
  box.className="mg2-box";
  box.innerHTML=`
    <h2>🎉 Bravo, tu as créé ton identité visuelle</h2>
    <img src="images/Identiteevisuelle.PNG" style="width:80%;margin-top:12px;">
  `;
  miniGame.appendChild(box);

  const next=document.createElement("button");
  next.className="skip-dialog";
  next.textContent="Poursuivre ta quête";
  document.body.appendChild(next);

  next.onclick=()=>{
    next.remove();
    hideMiniGame();
    startMiniGame3();
  };
}

/* =====================================================
   🔗 MINI-JEU 3 — COMME AVANT
===================================================== */
function startMiniGame3(){
  playDialog([
    {speaker:"pirate2",text:"Ton identité est prête."},
    {speaker:"pirate3",text:"Voyons comment la diffuser."}
  ], launchMiniGame3);
}

function launchMiniGame3(){
  clearMiniGame();
  const box=document.createElement("div"); box.className="mg3-box";

  const q=document.createElement("div");
  q.className="mg3-question";
  q.textContent="Associe chaque canal à son objectif";

  const c=document.createElement("div"); c.className="mg3-container";
  const l=document.createElement("div"); l.className="mg3-column";
  const r=document.createElement("div"); r.className="mg3-column";

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
  .sort(()=>Math.random()-0.5)
  .forEach(t=>{
    const b=document.createElement("button");
    b.textContent=t[0];
    b.onclick=()=>{
      if(!sel||sel.key!==t[1]){ shake(); return; }
      sel.btn.remove(); b.remove(); sel=null; ok++;
      if(ok===3) finish();
    };
    r.appendChild(b);
  });

  c.append(l,r);
  box.append(q,c);
  miniGame.appendChild(box);
}

function finish(){
  sessionStorage.setItem("unlock_pirate5","true");
  location.href="menu.html";
}

});
