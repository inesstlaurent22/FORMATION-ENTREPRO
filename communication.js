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
   VIDÉO INTRO
===================================================== */
introVideo.muted = true;
introVideo.play().catch(()=>{});

toggleSound.onclick = () => {
  introVideo.muted = !introVideo.muted;
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
  showLine();
}

function showLine(){
  const d=dialogs[dialogIndex];
  dialogText.textContent=d.text;

  const target=d.speaker==="pirate2"?pirate2:pirate3;
  const r=target.getBoundingClientRect();

  dialogBox.style.left=`${r.left+r.width/2-dialogBox.offsetWidth/2}px`;
  dialogBox.style.top=`${r.top-dialogBox.offsetHeight-20}px`;
}

dialogBox.onclick=()=>{
  dialogIndex++;
  if(dialogIndex<dialogs.length) showLine();
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
    {speaker:"pirate2",text:"Mais personne ne le connaît."},
    {speaker:"pirate3",text:"Commençons par communiquer."}
  ], startMiniGame1);
};

/* =====================================================
   MINI-JEU 1
===================================================== */
function startMiniGame1(){
  showMiniGame();
  addText("📣 La communication sert à se faire connaître.");
  addText("Sans visibilité, même le meilleur trésor reste invisible.");
  addButton("Continuer", ()=>{
    hideMiniGame();
    startMiniGame2();
  });
}

/* =====================================================
   MINI-JEU 2
===================================================== */
function startMiniGame2(){
  showMiniGame();
  addText("🎨 L’identité visuelle permet de reconnaître ta marque.");
  addText("Logo, couleurs et typographie doivent être cohérents.");
  addButton("Continuer", ()=>{
    hideMiniGame();
    startMiniGame3();
  });
}

/* =====================================================
   MINI-JEU 3 — RELIER
===================================================== */
function startMiniGame3(){
  showMiniGame();
  addText("📲 Relie chaque plateforme à son objectif");

  let selectedPlatform=null;
  let completed=0;

  const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.style.position="absolute";
  svg.style.top="0";
  svg.style.left="0";
  svg.style.width="100%";
  svg.style.height="100%";
  svg.style.pointerEvents="none";
  miniGame.appendChild(svg);

  const platforms=[
    {label:"Instagram & TikTok", target:"know"},
    {label:"Shopify", target:"btoc"},
    {label:"LinkedIn & Facebook", target:"btob"}
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
    b.onclick=()=>{
      selectedPlatform={btn:b,...p};
    };
    top.appendChild(b);
  });

  const bottom=document.createElement("div");
  bottom.className="visualChoices";

  Object.keys(targets).forEach(key=>{
    const b=document.createElement("button");
    b.className="btn-target";
    b.textContent=targets[key];
    b.onclick=()=>{
      if(selectedPlatform && selectedPlatform.target===key){
        drawLine(svg,selectedPlatform.btn,b);
        completed++;
        selectedPlatform=null;
        if(completed===3) endQuest();
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
  alert("Bravo, tu as terminé la quête !");
}

/* =====================================================
   SVG LINE
===================================================== */
function drawLine(svg, from, to){
  const r1=from.getBoundingClientRect();
  const r2=to.getBoundingClientRect();
  const r=svg.getBoundingClientRect();

  const line=document.createElementNS("http://www.w3.org/2000/svg","line");
  line.setAttribute("x1",r1.left+r1.width/2-r.left);
  line.setAttribute("y1",r1.bottom-r.top);
  line.setAttribute("x2",r2.left+r2.width/2-r.left);
  line.setAttribute("y2",r2.top-r.top);
  line.setAttribute("stroke","gold");
  line.setAttribute("stroke-width","4");

  svg.appendChild(line);
}

/* =====================================================
   HELPERS
===================================================== */
function showMiniGame(){
  miniGame.innerHTML="";
  miniGame.classList.remove("hidden");
  miniGame.scrollTop=0;
}

function hideMiniGame(){
  miniGame.classList.add("hidden");
}

function addText(t){
  const p=document.createElement("p");
  p.textContent=t;
  miniGame.appendChild(p);
}

function addButton(label,action){
  const b=document.createElement("button");
  b.textContent=label;
  b.onclick=action;
  miniGame.appendChild(b);
}

});
