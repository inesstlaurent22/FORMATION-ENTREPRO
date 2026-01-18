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
   VIDÉO INTRO – SON
===================================================== */
introVideo.muted = true;
introVideo.play().catch(()=>{});

toggleSound.onclick = () => {
  introVideo.muted = !introVideo.muted;
  toggleSound.textContent = introVideo.muted ? "🔇" : "🔊";
  introVideo.play().catch(()=>{});
};

closeVideo.onclick = endVideo;
introVideo.onended = endVideo;

function endVideo(){
  videoIntro.classList.add("hidden");
  scene.classList.remove("hidden");
}

/* =====================================================
   DIALOGUES
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
   DÉBUT DE QUÊTE
===================================================== */
pirate3.onclick=()=>{
  playDialog([
    {speaker:"pirate3",text:"Capitaine, ton trésor est prêt."},
    {speaker:"pirate2",text:"Mais personne ne sait qu’il existe."},
    {speaker:"pirate3",text:"Commençons par apprendre à communiquer."}
  ], startMiniGame1);
};

/* =====================================================
   🎮 MINI-JEU 1 – QCM COMMUNICATION
===================================================== */
const quizSteps = [
  {
    title:"📣 Réseaux sociaux",
    question:"Les réseaux sociaux servent principalement à :",
    answers:[
      {text:"Te faire découvrir",correct:true},
      {text:"Montrer ton univers",correct:true},
      {text:"Forcer la vente immédiate",correct:false}
    ],
    explanation:"Ils servent à créer de la visibilité et donner envie de découvrir ta marque."
  },
  {
    title:"📜 Newsletter",
    question:"Une newsletter permet de :",
    answers:[
      {text:"Rester présent dans l’esprit du client",correct:true},
      {text:"Créer un lien dans le temps",correct:true},
      {text:"Envoyer des promotions tous les jours",correct:false}
    ],
    explanation:"La newsletter entretient la relation sans pression commerciale."
  },
  {
    title:"🕊️ Phoning / Mailing",
    question:"Le contact direct permet de :",
    answers:[
      {text:"Comprendre les besoins",correct:true},
      {text:"Créer une relation humaine",correct:true},
      {text:"Parler uniquement de prix",correct:false}
    ],
    explanation:"Le contact direct bien utilisé crée de la confiance."
  },
  {
    title:"⚓ Visite physique",
    question:"Rencontrer un client en vrai permet de :",
    answers:[
      {text:"Rassurer et écouter",correct:true},
      {text:"Créer une vraie connexion",correct:true},
      {text:"Ignorer ses attentes",correct:false}
    ],
    explanation:"La présence physique renforce fortement la crédibilité."
  }
];

let quizIndex = 0;
let selected = [];

function startMiniGame1(){
  quizIndex = 0;
  showMiniGame();
  renderQuiz();
}

function renderQuiz(){
  miniGame.innerHTML="";
  selected=[];

  const step=quizSteps[quizIndex];
  addTitle(step.title);
  addText(step.question);
  addText("🔴 2 bonnes réponses", true);

  step.answers.forEach((a,i)=>{
    const b=document.createElement("button");
    b.textContent=a.text;
    b.onclick=()=>{
      if(!selected.includes(i)){
        selected.push(i);
        b.classList.add("selected");
      }
      checkQuiz(step);
    };
    miniGame.appendChild(b);
  });
}

function checkQuiz(step){
  const correct=step.answers
    .map((a,i)=>a.correct?i:null)
    .filter(i=>i!==null);

  const ok =
    correct.every(i=>selected.includes(i)) &&
    selected.every(i=>step.answers[i].correct);

  if(ok){
    addText("✅ Bonne réponse");
    addText(step.explanation);
    addButton("Continuer",()=>{
      quizIndex++;
      if(quizIndex<quizSteps.length){
        renderQuiz();
      } else {
        hideMiniGame();
        afterMiniGame1Dialog();
      }
    });
  }
}

function afterMiniGame1Dialog(){
  playDialog([
    {speaker:"pirate2",text:"Tu sais maintenant comment attirer l’attention."},
    {speaker:"pirate3",text:"Passons à l’identité visuelle."}
  ], startMiniGame2);
}

/* =====================================================
   🎨 MINI-JEU 2 – IDENTITÉ VISUELLE (HORIZONTAL)
===================================================== */
let identityDone=false;

function startMiniGame2(){
  showMiniGame();
  addTitle("🎨 Identité visuelle");
  addText("Logo, couleurs et typographie doivent être cohérents.");

  const row=document.createElement("div");
  row.className="visualChoices";

  addImageGroup(["images/logo1.png","images/logo2.png","images/logo3.png"],row,()=>{});
  addImageGroup(["images/colors1.png","images/colors2.png","images/colors3.png"],row,(i)=>{if(i===1)validateIdentity();});
  addImageGroup(["images/typo1.png","images/typo2.png","images/typo3.png"],row,(i)=>{if(i===0)validateIdentity();});

  miniGame.appendChild(row);
}

function validateIdentity(){
  if(identityDone) return;
  identityDone=true;

  miniGame.innerHTML="";
  const img=document.createElement("img");
  img.src="images/identity-final.png";
  img.style.width="220px";
  img.style.margin="20px auto";
  img.style.display="block";
  miniGame.appendChild(img);

  addText("✅ Identité visuelle créée !");
  addText("Les clients reconnaîtront immédiatement ta marque.");

  setTimeout(()=>{
    hideMiniGame();
    afterIdentityDialog();
  },1500);
}

function afterIdentityDialog(){
  playDialog([
    {speaker:"pirate2",text:"On te reconnaît désormais au premier regard."},
    {speaker:"pirate3",text:"Voyons maintenant où communiquer."}
  ], startMiniGame3);
}

/* =====================================================
   🎮 MINI-JEU 3 – LIER PLATEFORMES
===================================================== */
function startMiniGame3(){
  showMiniGame();
  addTitle("📲 Canaux de communication");
  addText("Relie chaque plateforme à son objectif.");

  let selected=null, done=0;

  const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.style.position="absolute";
  svg.style.inset="0";
  svg.style.pointerEvents="none";
  miniGame.appendChild(svg);

  const platforms=[
    {label:"Instagram & TikTok",target:"know"},
    {label:"Shopify",target:"btoc"},
    {label:"LinkedIn & Facebook",target:"btob"}
  ];

  const targets={
    know:"Se faire connaître",
    btoc:"Vendre en BtoC",
    btob:"Vendre en BtoB (et se faire connaître)"
  };

  const top=document.createElement("div");
  top.className="visualChoices";
  platforms.forEach(p=>{
    const b=document.createElement("button");
    b.className="btn-platform";
    b.textContent=p.label;
    b.onclick=()=>selected={btn:b,...p};
    top.appendChild(b);
  });

  const bottom=document.createElement("div");
  bottom.className="visualChoices";
  Object.keys(targets).forEach(k=>{
    const b=document.createElement("button");
    b.className="btn-target";
    b.textContent=targets[k];
    b.onclick=()=>{
      if(selected && selected.target===k){
        drawLine(svg,selected.btn,b);
        selected=null;
        done++;
        if(done===3) endQuest();
      }
    };
    bottom.appendChild(b);
  });

  miniGame.appendChild(top);
  miniGame.appendChild(bottom);
}

/* =====================================================
   FIN
===================================================== */
function endQuest(){
  hideMiniGame();
  showWinLoader();
  explodeGems();
  setTimeout(()=>window.location.href="menu.html",2500);
}

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

function addText(t,red=false){
  const p=document.createElement("p");
  p.textContent=t;
  if(red) p.style.color="red";
  miniGame.appendChild(p);
}

function addButton(label,action){
  const b=document.createElement("button");
  b.textContent=label;
  b.onclick=action;
  miniGame.appendChild(b);
}

function addImageGroup(images,container,callback){
  const block=document.createElement("div");
  block.style.display="flex";
  block.style.gap="10px";
  images.forEach((src,i)=>{
    const img=document.createElement("img");
    img.src=src;
    img.onclick=()=>callback(i);
    block.appendChild(img);
  });
  container.appendChild(block);
}

function drawLine(svg,from,to){
  const r1=from.getBoundingClientRect();
  const r2=to.getBoundingClientRect();
  const r=svg.getBoundingClientRect();
  const line=document.createElementNS("http://www.w3.org/2000/svg","line");
  line.setAttribute("x1",r1.left+r1.width/2-r.left);
  line.setAttribute("y1",r1.bottom-r.top);
  line.setAttribute("x2",r2.left+r2.width/2-r.left);
  line.setAttribute("y2",r2.top-r.top);
  line.setAttribute("stroke","gold");
  line.setAttribute("stroke-width","3");
  svg.appendChild(line);
}

function showWinLoader(){
  const fade=document.createElement("div");
  fade.id="fadeScreen";
  const box=document.createElement("div");
  box.className="loaderBox";
  const t=document.createElement("div");
  t.className="winBravo";
  t.textContent="Bravo, tu as gagné la quête";
  box.appendChild(t);
  fade.appendChild(box);
  document.body.appendChild(fade);
}

function explodeGems(){
  for(let i=0;i<20;i++){
    const g=document.createElement("div");
    g.className="gem";
    g.style.left="50%";
    g.style.top="50%";
    g.style.setProperty("--x",`${Math.random()*300-150}px`);
    g.style.setProperty("--y",`${Math.random()*300-150}px`);
    document.body.appendChild(g);
    setTimeout(()=>g.remove(),1200);
  }
}

});
