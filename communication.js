document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   RÉFÉRENCES DOM
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
  if(dialogIndex<dialogs.length) showDialog();
  else{
    dialogBox.classList.add("hidden");
    dialogCallback && dialogCallback();
  }
};

/* =====================================================
   🔔 NOTIFICATION + VIBRATION
===================================================== */
function notify(text, success){
  const box=document.createElement("div");
  box.className="notification "+(success?"success":"error");
  box.innerHTML=success
    ? `<div style="color:gold">Bravo !</div><div>${text}</div>`
    : text;

  document.body.appendChild(box);

  if(!success){
    document.body.classList.add("shake");
    setTimeout(()=>document.body.classList.remove("shake"),350);
  }

  setTimeout(()=>box.remove(),1800);
}

/* =====================================================
   HELPERS MINI-JEUX
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
function addText(t){
  const p=document.createElement("p");
  p.textContent=t;
  miniGame.appendChild(p);
}
function addImages(images,cb){
  const wrap=document.createElement("div");
  wrap.className="visualChoices";
  images.forEach((src,i)=>{
    const img=document.createElement("img");
    img.src=src;
    img.onclick=()=>cb(i);
    wrap.appendChild(img);
  });
  miniGame.appendChild(wrap);
}

/* =====================================================
   DÉBUT DE QUÊTE
===================================================== */
pirate3.onclick=()=>{
  playDialog([
    {speaker:"pirate3",text:"Capitaine, ton trésor est prêt."},
    {speaker:"pirate2",text:"Mais sans communication, personne ne viendra."},
    {speaker:"pirate3",text:"Voyons comment attirer le marché."}
  ], startMiniGame1);
};

/* =====================================================
   🎮 MINI-JEU 1 – COMMUNICATION (COMPLET)
===================================================== */
const quizSteps=[
  {
    title:"⚓ Visite physique",
    question:"Rencontrer un client permet de :",
    options:["Rassurer","Créer une connexion","Ignorer ses attentes"],
    good:[0,1],
    goodText:"La visite physique renforce la confiance.",
    badText:"Ignorer un client détruit la relation."
  },
  {
    title:"🕊️ Phoning / Mailing",
    question:"Le contact direct sert à :",
    options:["Comprendre les besoins","Créer une relation","Parler uniquement de prix"],
    good:[0,1],
    goodText:"Le contact direct humanise la relation.",
    badText:"Parler uniquement de prix bloque l’échange."
  },
  {
    title:"📣 Réseaux sociaux",
    question:"Ils servent surtout à :",
    options:["Se faire connaître","Montrer son univers","Vendre immédiatement"],
    good:[0,1],
    goodText:"Les réseaux sociaux créent de la visibilité.",
    badText:"Forcer la vente fait fuir les clients."
  },
  {
    title:"📜 Newsletters",
    question:"Une newsletter permet de :",
    options:["Rester présent","Créer un lien","Envoyer du spam"],
    good:[0,1],
    goodText:"La newsletter entretient la relation.",
    badText:"Le spam dégrade l’image de marque."
  }
];

let quizIndex=0, selected=[];

function startMiniGame1(){
  quizIndex=0;
  showQuestion();
}

function showQuestion(){
  showMiniGame();
  selected=[];
  const q=quizSteps[quizIndex];

  addTitle(q.title);
  addText(q.question);
  addText("🔴 2 bonnes réponses");

  q.options.forEach((txt,i)=>{
    const b=document.createElement("button");
    b.textContent=txt;
    b.onclick=()=>{
      if(!selected.includes(i)) selected.push(i);

      if(checkAnswer(q)){
        hideMiniGame();
        notify(q.goodText,true);
        setTimeout(()=>{
          quizIndex++;
          quizIndex<quizSteps.length
            ? showQuestion()
            : afterMiniGame1();
        },1200);
      } else if(selected.length>=2){
        notify(q.badText,false);
        selected=[];
      }
    };
    miniGame.appendChild(b);
  });
}

function checkAnswer(q){
  return q.good.every(i=>selected.includes(i)) &&
         selected.every(i=>q.good.includes(i));
}

function afterMiniGame1(){
  playDialog([
    {speaker:"pirate2",text:"Parfait. Tu sais attirer l’attention."},
    {speaker:"pirate3",text:"Créons maintenant ton identité visuelle."}
  ], startMiniGame2);
}

/* =====================================================
   🎨 MINI-JEU 2 – IDENTITÉ VISUELLE (COMPLET)
===================================================== */
function startMiniGame2(){
  showMiniGame();
  addTitle("🎨 Identité visuelle");
  addText("Logo, couleurs et typographie doivent être cohérents.");
  addText("Clique pour commencer.");
  miniGame.onclick=()=>{
    miniGame.onclick=null;
    startLogoStep();
  };
}

function startLogoStep(){
  showMiniGame();
  addTitle("Choisis ton logo (choix libre)");
  addImages(
    ["images/Logo1.PNG","images/Logo2.PNG","images/Logo3.PNG"],
    ()=>startColorStep()
  );
}

function startColorStep(){
  showMiniGame();
  addTitle("Choisis les bonnes couleurs");

  const hint=document.createElement("button");
  hint.textContent="Indice";
  hint.onclick=()=>notify(
    "Les couleurs doivent être cohérentes avec le logo.",
    true
  );
  miniGame.appendChild(hint);

  addImages(
    ["images/Couleur1.PNG","images/Couleur2.PNG","images/Couleur3.PNG"],
    i=>{ if(i===1) startTypoStep(); }
  );
}

function startTypoStep(){
  showMiniGame();
  addTitle("Choisis la typographie");
  addImages(
    ["images/Typo1.PNG","images/Typo2.PNG","images/Typo3.PNG"],
    i=>{ if(i===0) showIdentity(); }
  );
}

function showIdentity(){
  const fade=document.createElement("div");
  fade.id="fadeScreen";

  const box=document.createElement("div");
  box.className="loaderBox";

  const title=document.createElement("div");
  title.textContent="L’identité visuelle est prête";

  const img=document.createElement("img");
  img.src="images/identiteevisuelle.JPG";
  img.style.width="260px";
  img.style.marginTop="16px";
  img.style.cursor="pointer";

  box.appendChild(title);
  box.appendChild(img);
  fade.appendChild(box);
  document.body.appendChild(fade);

  img.onclick=()=>{
    fade.remove();
    afterMiniGame2();
  };
}

function afterMiniGame2(){
  playDialog([
    {speaker:"pirate2",text:"Ta marque est désormais reconnaissable."},
    {speaker:"pirate3",text:"Voyons où communiquer."}
  ], startMiniGame3);
}

/* =====================================================
   🎮 MINI-JEU 3 – CANAUX DE COMMUNICATION
===================================================== */
function startMiniGame3(){
  showMiniGame();
  addTitle("Choisis le bon type de communication");
  addText(
    "BtoB : entreprise → entreprise | BtoC : entreprise → particulier"
  );

  const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.style.position="fixed";
  svg.style.inset="0";
  svg.style.pointerEvents="none";
  svg.style.zIndex="3000";
  document.body.appendChild(svg);

  let selected=null, done=0;

  const platforms=[
    {label:"Instagram & TikTok",target:"know"},
    {label:"Shopify",target:"btoc"},
    {label:"LinkedIn & Facebook",target:"btob"}
  ];
  const targets={
    know:"Se faire connaître",
    btoc:"Vendre en BtoC",
    btob:"Vendre en BtoB"
  };

  platforms.forEach(p=>{
    const b=document.createElement("button");
    b.className="btn-platform";
    b.textContent=p.label;
    b.onclick=()=>selected={btn:b,target:p.target};
    miniGame.appendChild(b);
  });

  miniGame.appendChild(document.createElement("hr"));

  Object.keys(targets).forEach(k=>{
    const b=document.createElement("button");
    b.className="btn-target";
    b.textContent=targets[k];
    b.onclick=()=>{
      if(selected && selected.target===k){
        drawLine(svg,selected.btn,b);
        selected=null;
        done++;
        if(done===3) finishQuest(svg);
      }
    };
    miniGame.appendChild(b);
  });
}

function drawLine(svg,a,b){
  const r1=a.getBoundingClientRect();
  const r2=b.getBoundingClientRect();
  const l=document.createElementNS("http://www.w3.org/2000/svg","line");
  l.setAttribute("x1",r1.left+r1.width/2);
  l.setAttribute("y1",r1.top+r1.height/2);
  l.setAttribute("x2",r2.left+r2.width/2);
  l.setAttribute("y2",r2.top+r2.height/2);
  l.setAttribute("stroke","gold");
  l.setAttribute("stroke-width","4");
  svg.appendChild(l);
}

/* =====================================================
   🏆 FIN DE QUÊTE
===================================================== */
function finishQuest(svg){
  svg.remove();
  hideMiniGame();

  const fade=document.createElement("div");
  fade.id="fadeScreen";
  fade.innerHTML='<div class="loaderBox">Bravo, tu as terminé cette quête</div>';
  document.body.appendChild(fade);

  setTimeout(()=>window.location.href="menu.html",2500);
}

});
