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
   💬 DIALOGUES
===================================================== */
let dialogs=[], dialogIndex=0, dialogCallback=null;

function playDialog(list, callback){
  dialogs=list;
  dialogIndex=0;
  dialogCallback=callback;
  dialogBox.classList.remove("hidden");
  showDialog();
}

function showDialog(){
  const d=dialogs[dialogIndex];
  dialogText.textContent=d.text;

  const target=d.speaker==="pirate2"?pirate2:pirate3;
  const r=target.getBoundingClientRect();

  dialogBox.style.left=`${r.left+r.width/2-dialogBox.offsetWidth/2}px`;
  dialogBox.style.top=`${r.top-dialogBox.offsetHeight-20}px`;
}

dialogBox.onclick=()=>{
  dialogIndex++;
  if(dialogIndex<dialogs.length){
    showDialog();
  }else{
    dialogBox.classList.add("hidden");
    dialogCallback && dialogCallback();
  }
};

/* =====================================================
   HELPERS
===================================================== */
function showMiniGame(){
  miniGame.innerHTML="";
  miniGame.classList.remove("hidden");
}

function hideMiniGame(){
  miniGame.classList.add("hidden");
}

function addTitle(t){
  const h=document.createElement("h3");
  h.textContent=t;
  miniGame.appendChild(h);
}

function addText(t, bold=false){
  const p=document.createElement("p");
  p.innerHTML=bold?`<strong>${t}</strong>`:t;
  miniGame.appendChild(p);
}

/* =====================================================
   DÉMARRAGE
===================================================== */
pirate3.onclick=()=>{
  playDialog([
    {speaker:"pirate3",text:"Capitaine, ton trésor est prêt."},
    {speaker:"pirate2",text:"Mais sans communication, personne ne viendra."},
    {speaker:"pirate3",text:"Commençons par comprendre comment communiquer."}
  ],startMiniGame1);
};

/* =====================================================
   🎯 MINI-JEU 1 — QUESTIONS
===================================================== */
const quiz=[
  {
    t:"⚓ Visite physique",
    q:"Rencontrer un client permet de :",
    o:["Rassurer","Créer une connexion","Ignorer ses attentes"],
    g:[0,1],
    txt:"La visite physique renforce la confiance."
  },
  {
    t:"🕊️ Phoning / Mailing",
    q:"Le contact direct sert à :",
    o:["Comprendre les besoins","Créer une relation","Parler uniquement de prix"],
    g:[0,1],
    txt:"Le contact humain est essentiel."
  },
  {
    t:"📣 Réseaux sociaux",
    q:"Ils servent surtout à :",
    o:["Se faire connaître","Montrer son univers","Vendre immédiatement"],
    g:[0,1],
    txt:"Les réseaux sociaux servent d’abord à être visible."
  },
  {
    t:"📜 Newsletters",
    q:"Une newsletter permet de :",
    o:["Rester présent","Créer un lien","Envoyer du spam"],
    g:[0,1],
    txt:"Une newsletter entretient la relation."
  }
];

let qi=0, selected=[];

function startMiniGame1(){
  qi=0;
  showQuestion();
}

function showQuestion(){
  showMiniGame();
  selected=[];
  const s=quiz[qi];

  addTitle(s.t);
  addText(s.q);
  addText("2 bonnes réponses",true);

  s.o.forEach((txt,i)=>{
    const b=document.createElement("button");
    b.style.display="block";
    b.style.margin="10px auto";
    b.textContent=txt;
    b.onclick=()=>{
      if(!selected.includes(i)) selected.push(i);

      if(checkAnswer(s)){
        showNotification(s.txt,()=>{
          qi++;
          qi<quiz.length?showQuestion():afterMiniGame1();
        });
      }else if(selected.length>=2){
        showError();
        selected=[];
      }
    };
    miniGame.appendChild(b);
  });
}

function checkAnswer(s){
  return s.g.every(i=>selected.includes(i)) &&
         selected.every(i=>s.g.includes(i));
}

function showNotification(text,cb){
  const n=document.createElement("div");
  n.className="notification success";
  n.innerHTML=`
    <div class="glow-text">Clique sur la notification pour continuer</div>
    <div><strong>${text}</strong></div>`;
  n.onclick=()=>{n.remove();cb&&cb();};
  document.body.appendChild(n);
}

function showError(){
  document.body.classList.add("shake");
  const n=document.createElement("div");
  n.className="notification error";
  n.textContent="Tu t’es trompé 💥";
  document.body.appendChild(n);
  setTimeout(()=>{document.body.classList.remove("shake");n.remove();},1200);
}

function afterMiniGame1(){
  hideMiniGame();
  playDialog([
    {speaker:"pirate2",text:"Bien joué."},
    {speaker:"pirate3",text:"Passons à ton identité visuelle."}
  ],startIdentityIntro);
}

/* =====================================================
   🎨 MINI-JEU 2 — IDENTITÉ VISUELLE
===================================================== */
function startIdentityIntro(){
  showMiniGame();
  addTitle("L’identité visuelle : Avant de commencer");
  addText("Avant de faire un logo, de choisir des couleurs ou une écriture, il faut d’abord savoir ce que tu veux montrer.",true);

  addText(`
    • À qui tu parles : enfants, ados, adultes<br>
    • Ton message principal<br>
    • L’émotion à transmettre<br>
    • Ton style visuel
  `);

  addText("👉 Si tu sais répondre à ces questions, ton identité visuelle sera plus simple, rapide à créer et facile à reconnaître.");

  miniGame.onclick=startLogo;
}

/* === IMAGES AVEC LOADER === */
function imageGroup(list,cb){
  const loader=document.createElement("div");
  loader.textContent="⏳";
  loader.style.fontSize="32px";
  miniGame.appendChild(loader);

  let loaded=0;
  const wrap=document.createElement("div");
  wrap.className="visualChoices";

  list.forEach(src=>{
    const img=new Image();
    img.src=src;
    img.onload=()=>{
      loaded++;
      if(loaded===list.length){
        loader.remove();
        miniGame.appendChild(wrap);
      }
    };
    img.onclick=cb;
    wrap.appendChild(img);
  });
}

/* LOGO */
function startLogo(){
  showMiniGame();
  addTitle("Ton logo");
  addText("Le choix est libre",true);
  imageGroup(["images/Logo1.PNG","images/Logo2.PNG","images/Logo3.PNG"],logoExplanation);
}

function logoExplanation(){
  showMiniGame();
  addTitle("Logo – Explication");
  addText("Le logo, c’est le dessin principal qui permet de reconnaître ton projet.",true);
  addText(`
    • Simple<br>
    • Reconnaissable rapidement<br>
    • Lisible petit et grand<br>
    • Pas trop chargé
  `);
  addText("👉 Si tu peux le dessiner en 5 secondes, c’est validé.");
  miniGame.onclick=startColors;
}

/* COULEURS */
function startColors(){
  showMiniGame();
  addTitle("Les couleurs");
  imageGroup(["images/Couleur1.PNG","images/Couleur2.PNG","images/Couleur3.PNG"],colorsExplanation);
}

function colorsExplanation(){
  showMiniGame();
  addTitle("Les couleurs – Explication");
  addText("Les couleurs doivent être en cohérence avec le logo de la marque.",true);
  addText(`
    • 2 à 4 couleurs maximum<br>
    • 1 couleur principale<br>
    • Couleurs complémentaires<br>
    • Bonne harmonie
  `);
  addText("👉 Trop de couleurs = confusion.");
  miniGame.onclick=startTypo;
}

/* TYPO */
function startTypo(){
  showMiniGame();
  addTitle("La typographie");
  imageGroup(["images/Typo1.PNG","images/Typo2.PNG","images/Typo3.PNG"],typoExplanation);
}

function typoExplanation(){
  showMiniGame();
  addTitle("La typographie – Explication");
  addText("La typographie doit rester en cohérence avec l’univers de ta marque.",true);
  addText(`
    • Facile à lire<br>
    • Cohérente<br>
    • 1 ou 2 écritures max<br>
    • La même partout
  `);
  addText("👉 Une bonne typo rend ton projet plus sérieux.");
  miniGame.onclick=showIdentity;
}

/* IDENTITÉ VISUELLE FINALE */
function showIdentity(){
  hideMiniGame();
  const f=document.createElement("div");
  f.id="fadeScreen";
  f.innerHTML=`
    <div class="loaderBox">
      <strong>Bravo tu as gagné ton identité visuelle</strong><br>
      <img src="images/Identiteevisuelle.PNG" width="260">
    </div>`;
  document.body.appendChild(f);
  f.onclick=()=>{f.remove();afterMiniGame2();};
}

/* =====================================================
   DIALOGUES AVANT MINI-JEU 3
===================================================== */
function afterMiniGame2(){
  playDialog([
    {speaker:"pirate2",text:"Ton identité est prête."},
    {speaker:"pirate3",text:"Voyons comment la diffuser."}
  ],startMiniGame3);
}

/* =====================================================
   🔗 MINI-JEU 3 — RÉSEAUX SOCIAUX
===================================================== */
function startMiniGame3(){
  showMiniGame();
  addTitle("Les réseaux sociaux");
  addText("Trouve les bons enjeux pour gagner le mini jeu");

  const container=document.createElement("div");
  container.style.display="flex";
  container.style.justifyContent="space-between";
  container.style.marginTop="24px";

  const left=document.createElement("div");
  left.style.display="flex";
  left.style.flexDirection="column";
  left.style.gap="14px";

  const right=document.createElement("div");
  right.style.display="flex";
  right.style.flexDirection="column";
  right.style.gap="14px";

  let selected=null, valid=0;

  const networks=[
    ["Instagram & Tik Tok","know"],
    ["Facebook & LinkedIn","btob"],
    ["Les sites de vente en ligne","btoc"]
  ];

  const goals=[
    ["Se faire connaître","know"],
    ["Vendre en BtoC","btoc"],
    ["Vendre en BtoB","btob"]
  ];

  networks.forEach(n=>{
    const b=document.createElement("button");
    b.className="btn-platform";
    b.textContent=n[0];
    b.onclick=()=>selected={btn:b,key:n[1]};
    left.appendChild(b);
  });

  goals.forEach(g=>{
    const b=document.createElement("button");
    b.className="btn-target";
    b.textContent=g[0];
    b.onclick=()=>{
      if(selected && selected.key===g[1]){
        selected.btn.remove();
        b.remove();
        selected=null;
        valid++;
        if(valid===3) finish();
      }
    };
    right.appendChild(b);
  });

  container.append(left,right);
  miniGame.appendChild(container);
}

/* =====================================================
   🏁 FIN — GEMS
===================================================== */
function finish(){
  hideMiniGame();
  const f=document.createElement("div");
  f.id="fadeScreen";
  const b=document.createElement("div");
  b.className="loaderBox";
  b.textContent="Bravo, tu as gagné cette quête";
  f.appendChild(b);

  for(let i=0;i<40;i++){
    const g=document.createElement("div");
    g.className="gem";
    g.style.background=`hsl(${Math.random()*360},80%,60%)`;
    g.style.setProperty("--x",`${Math.random()*300-150}px`);
    g.style.setProperty("--y",`${Math.random()*300-150}px`);
    f.appendChild(g);
  }

  document.body.appendChild(f);
  setTimeout(()=>location.href="menu.html",2800);
}

});
