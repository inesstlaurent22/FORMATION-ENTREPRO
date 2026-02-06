document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   🎬 VIDÉO INTRO
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
  closeIntro();
};

introVideo.onended = closeIntro;

function closeIntro(){
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
    {speaker:"pirate3", text:"Capitaine, ton trésor est prêt."},
    {speaker:"pirate2", text:"Mais sans communication, personne ne viendra."},
    {speaker:"pirate3", text:"Voyons comment attirer le marché."}
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
  e.preventDefault();
  e.stopPropagation();
  endDialogs();
};

function endDialogs(){
  dialogBox.classList.add("hidden");
  skipDialog.classList.add("hidden");

  if (dCallback){
    const cb = dCallback;
    dCallback = null;
    cb();
  }
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
   🎨 MINI-JEU 2 — IDENTITÉ VISUELLE (FINAL PROPRE)
===================================================== */

function startMiniGame2(){
  clearMiniGame();

  const box = document.createElement("div");
  box.className = "mg2-box identity-box";

  box.innerHTML = `
    <div class="mg1-title">Crée ton identité visuelle</div>
    <p class="identity-text">
      L’identité visuelle permet à ta marque d’être reconnue,
      mémorisée et différenciée.
    </p>
  `;

  const infoBtn = document.createElement("button");
  infoBtn.textContent = "En savoir plus";

  const infoBox = document.createElement("div");
  infoBox.className = "info-box hidden info-list";
  infoBox.innerHTML = `
    <ul>
      <li>Ton message</li>
      <li>Ton public</li>
      <li>Tes valeurs</li>
      <li>Ton univers graphique</li>
    </ul>
  `;

  box.append(infoBtn, infoBox);
  miniGame.appendChild(box);

  const questBtn = document.createElement("button");
  questBtn.className = "skip-dialog";
  questBtn.textContent = "Continuer la quête";
  questBtn.style.display = "none";
  document.body.appendChild(questBtn);

  infoBtn.onclick = () => {
    infoBox.classList.remove("hidden");
    questBtn.style.display = "block";
  };

  questBtn.onclick = () => {
    questBtn.remove();
    showLogoInfo();
  };
}

/* ================= LOGO ================= */

function showLogoInfo(){
  showInfoStep(
    "L’importance du logo",
    `
      Le logo est l’élément central de ton identité visuelle.<br><br>
      ✔ Il doit être simple<br>
      ✔ Lisible à toutes tailles<br>
      ✔ Cohérent avec ton univers
    `,
    () => showChoiceStep(
      "Choix du logo",
      ["images/Logo1.PNG","images/Logo2.PNG","images/Logo3.PNG"],
      showColorInfo,
      null
    )
  );
}

/* ================= COULEURS ================= */

function showColorInfo(){
  showInfoStep(
    "L’importance des couleurs",
    `
      Les couleurs transmettent des émotions.<br><br>
      ✔ Limite-toi à 2–3 couleurs<br>
      ✔ Reste cohérent émotionnellement
    `,
    () => showChoiceStep(
      "Choix des couleurs",
      ["images/Couleur1.PNG","images/Couleur2.PNG","images/Couleur3.PNG"],
      showTypoInfo,
      "images/Couleur1.PNG"
    )
  );
}

/* ================= TYPO ================= */

function showTypoInfo(){
  showInfoStep(
    "L’importance de la typographie",
    `
      La typographie donne le ton de ta marque.<br><br>
      ✔ Lisibilité avant tout<br>
      ✔ Pas trop de polices
    `,
    () => showChoiceStep(
      "Choix de la typographie",
      ["images/Typo1.PNG","images/Typo2.png","images/Typo3.PNG"],
      showIdentityWin,
      "images/Typo1.PNG"
    )
  );
}

/* ================= INFO STEP ================= */

function showInfoStep(title, text, next){
  clearMiniGame();

  const box = document.createElement("div");
  box.className = "mg2-box";

  box.innerHTML = `
    <div class="mg1-title">${title}</div>
    <p class="info-text">${text}</p>
  `;

  const btn = document.createElement("button");
  btn.textContent = "Continuer";
  btn.onclick = next;

  box.appendChild(btn);
  miniGame.appendChild(box);
}

/* ================= CHOIX STEP ================= */

function showChoiceStep(title, images, next, correct){
  clearMiniGame();

  const box = document.createElement("div");
  box.className = "mg2-box";

  box.innerHTML = `<div class="mg1-title">${title}</div>`;
  miniGame.appendChild(box);

  const wrap = document.createElement("div");
  wrap.className = "visualChoices big";

  images.forEach(src=>{
    const w = document.createElement("div");
    w.className = "imgWrap";

    const img = new Image();
    img.src = src;
    img.onclick = () => {
      if (correct && src !== correct){
        shake();
        return;
      }
      next();
    };

    const zoom = document.createElement("button");
    zoom.textContent = "🔎";
    zoom.onclick = e => {
      e.stopPropagation();
      zoomImage(src);
    };

    w.append(img, zoom);
    wrap.appendChild(w);
  });

  miniGame.appendChild(wrap);
}

/* ================= ZOOM ================= */

function zoomImage(src){
  const overlay = document.createElement("div");
  overlay.id = "fadeScreen";
  overlay.innerHTML = `
    <img src="${src}" class="zoomed-image">
    <button class="zoom-close">✕</button>
  `;
  overlay.onclick = () => overlay.remove();
  document.body.appendChild(overlay);
}

/* ================= FIN IDENTITÉ ================= */

function showIdentityWin(){
  clearMiniGame();

  const box = document.createElement("div");
  box.className = "identity-win";

  const title = document.createElement("h2");
  title.textContent = "Bravo 🎉 Tu as créé ton identité visuelle";

  const imgWrap = document.createElement("div");
  imgWrap.className = "identity-img-wrap";

  const img = document.createElement("img");
  img.src = "images/Identiteevisuelle.JPG";
  img.className = "identity-img";

  const zoomBtn = document.createElement("button");
  zoomBtn.textContent = "🔎";
  zoomBtn.className = "zoom-btn";
  zoomBtn.onclick = () => zoomImage(img.src);

  imgWrap.append(img, zoomBtn);
  box.append(title, imgWrap);
  miniGame.appendChild(box);

  const questBtn = document.createElement("button");
  questBtn.className = "skip-dialog";
  questBtn.textContent = "Continuer la quête";

  document.body.appendChild(questBtn);

  questBtn.onclick = () => {
    questBtn.remove();
    hideMiniGame();
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
   🔗 MINI-JEU 3 — RÉSEAUX SOCIAUX
===================================================== */
function startMiniGame3(){
  clearMiniGame();

  const box=document.createElement("div");
  box.className="mg3-box";

  const q=document.createElement("div");
  q.className="mg3-question";
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
  .sort(()=>Math.random()-0.5)
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
   LOADER DE FIN
===================================================== */
function showCommunicationWin(){
  hideMiniGame();

  const overlay = document.createElement("div");
  overlay.id = "communication-win";

  overlay.innerHTML = `
    <div class="win-box">
      <h2>🏴‍☠️ Bravo !</h2>
      <p>Tu as gagné la quête Communication</p>
      <div class="gems-container"></div>
    </div>
  `;

  document.body.appendChild(overlay);

  launchGemsExplosion(
    overlay.querySelector(".gems-container")
  );

  setTimeout(() => {
    location.href = "menu.html";
  }, 4200);
}

function launchGemsExplosion(container){
  const colors = ["#ffd700","#00f2ff","#ff4fd8","#7cff00","#ff8c00"];

  for(let i=0;i<42;i++){
    const gem = document.createElement("div");
    gem.className = "gem";

    const size = Math.random()*10+6;
    gem.style.width = size+"px";
    gem.style.height = size+"px";
    gem.style.background = colors[Math.floor(Math.random()*colors.length)];
    gem.style.left = "50%";
    gem.style.top = "50%";

    const angle = Math.random()*Math.PI*2;
    const distance = Math.random()*220+60;

    gem.style.setProperty("--x", Math.cos(angle)*distance+"px");
    gem.style.setProperty("--y", Math.sin(angle)*distance+"px");

    container.appendChild(gem);
  }
}

/* =====================================================
   🏁 FIN
===================================================== */
function finish(){
  sessionStorage.setItem("unlock_pirate5","true");
  location.href="menu.html";
}

});
