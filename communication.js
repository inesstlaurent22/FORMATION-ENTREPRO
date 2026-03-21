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

if(introVideo){
  introVideo.muted = true;
  introVideo.playsInline = true;
  introVideo.autoplay = true;
  introVideo.style.pointerEvents = "none";
  introVideo.play().catch(()=>{});
}

if(toggleSound){
  toggleSound.onclick = e => {
    e.stopPropagation();
    introVideo.muted = !introVideo.muted;
    toggleSound.textContent = introVideo.muted ? "🔇" : "🔊";
  };
}

if(closeVideo){
  closeVideo.onclick = e => {
    e.stopPropagation();
    closeIntro();
  };
}

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

// Sécurité si élément absent
if (pirate3) {

  pirate3.classList.add("glow");

  pirate3.onclick = () => {

    pirate3.classList.remove("glow");

    playDialog([
      {speaker:"pirate2",text:"On a déjà notre premier client, mais ce n'est pas assez"},
      {speaker:"pirate3",text:"Je vais maintenant te parler de la communication, aspect très important pour ta visibilité"},
      {speaker:"pirate2",text:"Super ! Nous t'écoutons ! "},
      {speaker:"pirate3",text:"La communication permet de faire connaître une marque, attirer des clients et se différencier de la concurrence."},
      {speaker:"pirate2",text:"C'est à dire ? "},
      {speaker:"pirate3",text:"En d'autres mots, c'est <strong> l’ensemble des actions mises en place pour transmettre un message à une cible </strong>"},
      {speaker:"pirate3",text:"Ses enjeux sont les suivants : "},
      {speaker:"pirate3",text:"<strong> 1 : Se faire connaître,</strong>"},
      {speaker:"pirate3",text:"<strong> 2 : Attirer et convaincre des clients,</strong>"},
      {speaker:"pirate3",text:"<strong> 3 : Créer une image de marque forte,</strong>"},
      {speaker:"pirate3",text:"<strong> 4 : Et fidéliser la clientèle.</strong>"},
      {speaker:"pirate2",text:" On comprend mieux, merci"},
      {speaker:"pirate2",text:" Et grâce à cela, on augmente notre visibilité, les clients nous reconnaissent"},
      {speaker:"pirate3",text:" Et viennent vous voir pour <strong> votre réputation </strong>!"},
      {speaker:"pirate2",text:" Mais comment faire s'il te plaît ? "},
      {speaker:"pirate3",text:" Je vais t'expliquer mais d'abord répondez à ce quizz !"}
    ], startMiniGame1);

  };
}

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
  dialogText.innerHTML = d.text;

  // Force le navigateur à recalculer la taille
  dialogBox.style.visibility = "hidden";
  dialogBox.classList.remove("hidden");

  requestAnimationFrame(() => {

    const p = d.speaker === "pirate2" ? pirate2 : pirate3;

if(!p) return;

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
 {q:"Quels sont des canaux de communication ?:",ok:[0,1,2,3],a:["Les réseaux sociaux","Le site internet","L’affichage publicitaire","Les emails"]},
 {q:"Qu’est-ce que la communication ?",ok:[1],a:["Parler uniquement avec ses clients"," Transmettre un message pour promouvoir un produit ou une marque","Vendre directement un produit","Créer un logo"]},
 {q:"Qu’est-ce que l’identité visuelle d’une entreprise ?",ok:[1],a:[" Le prix des produits","L’ensemble des éléments graphiques (logo, couleurs, typographie)"," Le nombre d’employés"," Les moyens de livraison"]},
 {q:"À quoi servent les canaux de communication ?",ok:[0],a:["À transmettre un message aux clients"," À décorer l’entreprise","À gérer les stocks","À recruter uniquement"]}
];

let qi=0, found=[];

function startMiniGame1(){ qi=0; stepMG1(); }

function stepMG1(){

  clearMiniGame();
  found = [];

  const box = document.createElement("div");
  box.className = "mg1-box";

  box.innerHTML = `
    <div class="mg1-title"> 📱 À quoi sert la communication ?</div>
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
      { speaker:"pirate2", text:"Parfait." },
      { speaker:"pirate3", text:"Passons à ton identité visuelle." },
      { speaker:"pirate3", text:"C'est <strong> l’image de l’entreprise. </strong>" },
      { speaker:"pirate3", text:"Elle regroupe tous les éléments graphiques qui permettent de reconnaître une marque." },
      { speaker:"pirate3", text:"Elle comprend :" },
      { speaker:"pirate3", text:"<strong> Le logo </strong> " },
      { speaker:"pirate3", text:"<strong> les couleurs </strong>" },
      { speaker:"pirate3", text:"<strong> la typographie </strong>" },
      { speaker:"pirate3", text:"et parfois <strong> des visuels ou un univers graphique. </strong>" },
      { speaker:"pirate2", text:"Ça a l'air facile." },
      { speaker:"pirate3", text:"Non, pas si simple. Une identité visuelle doit être <strong>cohérente,</strong>" },
      { speaker:"pirate3", text:"<strong>reconnaissable et professionnelle,</strong>" },
      { speaker:"pirate3", text:"car elle <strong>influence la perception</strong> des clients et <strong>renforce la crédibilité </strong> de l’entreprise." },
      { speaker:"pirate2", text:"Ça a l'air moins facile d'un coup." },
      { speaker:"pirate3", text:"Ne t'inquiète pas, je vais tout t'expliquer !" },
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
    <div class="mg1-title"> 🎨 Crée ton identité visuelle</div>
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
  showInfoStep(
    "<strong>Le Logo</strong>",
    "C'est un symbole graphique qui représente une marque et permet de l’identifier rapidement.<br><br><strong>TIPS 1 : La cohérence</strong><br>Utiliser toujours les mêmes couleurs, logo et typographie sur tous les supports (site, réseaux, documents).",
    () => showChoiceStep(
      "Choix du logo - <strong>Choix libre</strong>",
      ["images/Logo1.PNG", "images/Logo2.PNG", "images/Logo3.PNG"],
      showColorInfo
    )
  );
}

function showColorInfo(){
  showInfoStep(
    "<strong>Les Couleurs</strong>",
    "C'est la palette utilisée par la marque pour transmettre une émotion et être reconnaissable.<br><br><strong>TIPS 2 : La simplicité</strong><br>Un design clair, lisible et mémorable. Trop d’éléments = confusion.",
    () => showChoiceStep(
      "Choix des couleurs",
      ["images/Couleur1.PNG", "images/Couleur2.PNG", "images/Couleur3.PNG"],
      showTypoInfo,
      "images/Couleur1.PNG"
    )
  );
}

function showTypoInfo(){
  showInfoStep(
    "<strong>La Typographie</strong>",
    "C'est le style d’écriture utilisé (police) qui reflète l’image et la personnalité de la marque.<br><br><strong>TIPS 3 : La différenciation</strong><br>Se démarquer des concurrents avec un style unique (couleurs, univers, ton).",
    () => showChoiceStep(
      "Choix de la typographie",
      ["images/Typo1.PNG", "images/Typo2.png", "images/Typo3.PNG"],
      showTips4, 
      "images/Typo1.PNG"
    )
  );
}

function showTips4(){
  showInfoStep(
    "<strong>Adaptabilité</strong>",
    "Une identité qui fonctionne partout : téléphone, ordinateur, print, réseaux sociaux.<br><br><strong>TIPS 4 : L’adaptabilité</strong><br>Une identité visuelle doit rester efficace et lisible sur tous les supports.",
    showIdentityWin
  );
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
        { speaker:"pirate3", text:"Passons à la diffusion." },
        { speaker:"pirate3", text:" Un <strong> canal de diffusion </strong> est un moyen utilisé pour <strong> transmettre un message à une cible (clients, prospects).</strong>" },
        { speaker:"pirate2", text:"Les réseaux sociaux ou les mails en sont-ils ? " },
        { speaker:"pirate3", text:"Oui ainsi que ton site internet " },
        { speaker:"pirate2", text:"Mais avec tous ces canaux, comment avoir une communication 10/10 ? " },
        { speaker:"pirate3", text:"Il faut <strong> choisir </strong> les bons canaux selon la cible" }, 
        { speaker:"pirate3", text:"Par exemple, pour une communication <br><strong> BtoC → Instagram, TikTok </strong>" },
        { speaker:"pirate3", text:" L'objectif est <strong> d'être là où sont tes clients </strong> " },
        { speaker:"pirate3", text:" Et utiliser plusieurs canaux (réseaux + site + email) pour <strong> maximiser la visibilité.</strong>" },
        { speaker:"pirate3", text:" Tu dois aussi <strong> adapter le message à chaque canal </strong>" },
        { speaker:"pirate3", text:" Exemple, <br><strong> pour les réseaux sociaux → un contenu visuel et rapide </strong> " },
        { speaker:"pirate3", text:" <strong> Pour les emails → des message plus détaillé </strong> " },
        { speaker:"pirate3", text:" Pour ton <br><strong> site internet → privilégie une informations complètes et rassurantes </strong>" },
        { speaker:"pirate3", text:" Et pour finir, il faut être régulier :  " },
        { speaker:"pirate3", text:" Publier souvent pour rester visible et <strong> créer une relation </strong> avec l’audience  " },
        { speaker:"pirate2", text:" Ca fait beaucoup à comprendre ! " },
        { speaker:"pirate3", text:" Ne t'inquiète pas, le quizz est la pour t'aider. " }
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

  b.className="mg3-btn mg3-btn-right1";

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
