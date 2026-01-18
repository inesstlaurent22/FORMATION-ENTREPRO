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
  dialogIndex<dialogs.length ? showDialog() : (
    dialogBox.classList.add("hidden"),
    dialogCallback && dialogCallback()
  );
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
function addText(t){
  const p=document.createElement("p");
  p.textContent=t;
  miniGame.appendChild(p);
}

/* =====================================================
   🔔 NOTIFICATIONS (HAUT DE L’ÉCRAN)
===================================================== */
function showTopNotification(text){
  const n=document.createElement("div");
  n.className="notification";
  n.style.top="20px";
  n.style.bottom="auto";
  n.style.border="3px solid red";
  n.textContent=text;
  document.body.appendChild(n);
  setTimeout(()=>n.remove(),2000);
}

/* =====================================================
   DÉBUT QUÊTE
===================================================== */
pirate3.onclick=()=>{
  playDialog([
    {speaker:"pirate3",text:"Capitaine, ton trésor est prêt."},
    {speaker:"pirate2",text:"Mais sans communication, personne ne viendra."},
    {speaker:"pirate3",text:"Voyons comment attirer le marché."}
  ], startMiniGame1);
};

/* =====================================================
   🎮 MINI-JEU 1 – COMMUNICATION
===================================================== */
const quizSteps=[
  {
    title:"Visite physique",
    question:"Rencontrer un client permet de :",
    good:[0,1],
    answers:[
      "Rassurer",
      "Créer une connexion",
      "Ignorer ses attentes"
    ],
    explanation:"La présence physique rassure et crée une vraie relation."
  },
  {
    title:"Phoning / Mailing",
    question:"Le contact direct sert à :",
    good:[0,1],
    answers:[
      "Comprendre les besoins",
      "Créer une relation humaine",
      "Parler uniquement de prix"
    ],
    explanation:"Le contact direct permet d’adapter son discours."
  },
  {
    title:"Réseaux sociaux",
    question:"Ils servent surtout à :",
    good:[0,1],
    answers:[
      "Se faire connaître",
      "Montrer son univers",
      "Vendre immédiatement"
    ],
    explanation:"Les réseaux servent d’abord à créer de la visibilité."
  },
  {
    title:"Newsletters",
    question:"Une newsletter permet de :",
    good:[0,1],
    answers:[
      "Rester présent",
      "Créer un lien",
      "Envoyer du spam"
    ],
    explanation:"La newsletter entretient la relation dans le temps."
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
  const q=quizSteps[qi];

  addTitle(q.title);
  addText(q.question);
  addText("🔴 2 bonnes réponses");

  q.answers.forEach((txt,i)=>{
    const b=document.createElement("button");
    b.textContent=txt;
    b.onclick=()=>{
      if(!selected.includes(i)) selected.push(i);
      if(check(q)){
        hideMiniGame();
        showTopNotification("Bonne réponse");
        setTimeout(()=>{
          showTopNotification(q.explanation);
          qi++;
          qi<quizSteps.length ? showQuestion() : afterMiniGame1();
        },800);
      } else if(selected.length>=2){
        showTopNotification("❌ Mauvaise réponse : ce choix ne permet pas d’atteindre l’objectif");
        selected=[];
      }
    };
    miniGame.appendChild(b);
  });
}

function check(q){
  return q.good.every(i=>selected.includes(i)) &&
         selected.every(i=>q.good.includes(i));
}

function afterMiniGame1(){
  playDialog([
    {speaker:"pirate2",text:"Bien vu."},
    {speaker:"pirate3",text:"Créons maintenant ton identité visuelle."}
  ], startMiniGame2);
}

/* =====================================================
   🎨 MINI-JEU 2 – IDENTITÉ VISUELLE
===================================================== */
function startMiniGame2(){
  showMiniGame();
  addTitle("Identité visuelle");
  addText("Choisis ton logo");
  loadImages(
    ["images/Logo1.PNG","images/Logo2.PNG","images/Logo3.PNG"],
    ()=>startColors()
  );
}

function startColors(){
  showMiniGame();
  addTitle("Couleurs");
  loadImages(
    ["images/Couleur1.PNG","images/Couleur2.PNG","images/Couleur3.PNG"],
    i=> i===1 && startTypo()
  );
}

function startTypo(){
  showMiniGame();
  addTitle("Typographie");
  loadImages(
    ["images/Typo1.PNG","images/Typo2.PNG","images/Typo3.PNG"],
    i=> i===0 && showIdentity()
  );
}

/* Loader + images + loupe */
function loadImages(images,callback){
  const loader=document.createElement("div");
  loader.className="imageLoader";
  loader.textContent="⏳";
  miniGame.appendChild(loader);

  let loaded=0;
  const wrap=document.createElement("div");
  wrap.className="visualChoices";

  images.forEach((src,i)=>{
    const box=document.createElement("div");
    box.style.textAlign="center";

    const img=new Image();
    img.src=src;
    img.onload=()=>{
      loaded++;
      if(loaded===images.length) loader.remove();
    };
    img.onclick=()=>callback(i);

    const zoom=document.createElement("button");
    zoom.textContent="🔎";
    zoom.onclick=e=>{
      e.stopPropagation();
      openZoom(src);
    };

    box.appendChild(img);
    box.appendChild(zoom);
    wrap.appendChild(box);
  });

  miniGame.appendChild(wrap);
}

/* =====================================================
   🖼️ IDENTITÉ VISUELLE
===================================================== */
function showIdentity(){
  showMiniGame();
  addTitle("Identité visuelle créée");

  const img=document.createElement("img");
  img.src="images/identiteevisuelle.JPG";
  img.style.width="220px";
  img.style.cursor="pointer";
  miniGame.appendChild(img);

  img.onclick=()=>{
    hideMiniGame();
    playDialog([
      {speaker:"pirate2",text:"Ta marque est reconnaissable."},
      {speaker:"pirate3",text:"Voyons où communiquer."}
    ], startMiniGame3);
  };
}

function openZoom(src){
  const z=document.createElement("div");
  z.className="zoomOverlay";
  const i=document.createElement("img");
  i.src=src;
  z.appendChild(i);
  z.onclick=()=>z.remove();
  document.body.appendChild(z);
}

/* =====================================================
   🎮 MINI-JEU 3 – RELIER
===================================================== */
function startMiniGame3(){
  showMiniGame();
  addTitle("Choisis le bon type de communication");

  const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.classList.add("linkLayer");
  miniGame.appendChild(svg);

  let selectedBtn=null, done=0;

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
    b.onclick=()=>selectedBtn={btn:b,target:p.target};
    miniGame.appendChild(b);
  });

  miniGame.appendChild(document.createElement("hr"));

  Object.keys(targets).forEach(k=>{
    const b=document.createElement("button");
    b.className="btn-target";
    b.textContent=targets[k];
    b.onclick=()=>{
      if(selectedBtn && selectedBtn.target===k){
        drawLine(svg,selectedBtn.btn,b);
        done++;
        selectedBtn=null;
        if(done===3) finishQuest();
      }
    };
    miniGame.appendChild(b);
  });
}

function drawLine(svg,a,b){
  const r1=a.getBoundingClientRect();
  const r2=b.getBoundingClientRect();
  const line=document.createElementNS("http://www.w3.org/2000/svg","line");
  line.setAttribute("x1",r1.left+r1.width/2);
  line.setAttribute("y1",r1.top+r1.height/2);
  line.setAttribute("x2",r2.left+r2.width/2);
  line.setAttribute("y2",r2.top+r2.height/2);
  line.setAttribute("stroke","gold");
  line.setAttribute("stroke-width","3");
  svg.appendChild(line);
}

/* =====================================================
   🏆 FIN
===================================================== */
function finishQuest(){
  hideMiniGame();
  const f=document.createElement("div");
  f.id="fadeScreen";
  f.innerHTML='<div class="loaderBox">Bravo, tu as terminé cette quête</div>';
  document.body.appendChild(f);
  setTimeout(()=>location.href="menu.html",2500);
}

});
