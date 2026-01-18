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
  if(dialogIndex<dialogs.length) showDialog();
  else{
    dialogBox.classList.add("hidden");
    dialogCallback && dialogCallback();
  }
};

/* =====================================================
   🔔 NOTIFICATION + VIBRATION
===================================================== */
function showNotification(text, success){
  const box=document.createElement("div");
  box.style.position="fixed";
  box.style.top="-140px";
  box.style.left="50%";
  box.style.transform="translateX(-50%)";
  box.style.width="90%";
  box.style.maxWidth="520px";
  box.style.padding="18px";
  box.style.background="rgba(0,0,0,.95)";
  box.style.border=`3px solid ${success?"limegreen":"red"}`;
  box.style.color="#fff";
  box.style.textAlign="center";
  box.style.zIndex="5000";
  box.style.transition="top .4s ease";
  box.innerHTML=success
    ? `<div style="color:gold">Bravo !</div><div>${text}</div>`
    : text;

  document.body.appendChild(box);
  setTimeout(()=>box.style.top="20px",20);

  if(!success){
    document.body.classList.add("shake");
    setTimeout(()=>document.body.classList.remove("shake"),400);
  }

  setTimeout(()=>box.remove(),1800);
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
   🎮 MINI-JEU 1 — COMMUNICATION
===================================================== */
const quizSteps=[
  {
    title:"Visite physique",
    question:"Rencontrer un client permet de :",
    options:["Rassurer","Créer une connexion","Ignorer ses attentes"],
    good:[0,1],
    goodText:"La visite physique crée confiance et relation.",
    badText:"Ignorer un client détruit la relation."
  },
  {
    title:"Phoning / Mailing",
    question:"Le contact direct sert à :",
    options:["Comprendre les besoins","Créer un lien","Parler uniquement de prix"],
    good:[0,1],
    goodText:"Le contact direct humanise la relation.",
    badText:"Parler uniquement de prix bloque l’échange."
  }
];

let quizIndex=0, selected=[];

function startMiniGame1(){
  quizIndex=0;
  showQuestion();
}

function showQuestion(){
  miniGame.innerHTML="";
  miniGame.classList.remove("hidden");
  selected=[];

  const q=quizSteps[quizIndex];
  miniGame.innerHTML=`<h3>${q.title}</h3><p>${q.question}</p><p>2 bonnes réponses</p>`;

  q.options.forEach((txt,i)=>{
    const b=document.createElement("button");
    b.textContent=txt;
    b.onclick=()=>{
      selected.push(i);

      if(checkAnswer(q)){
        showNotification(q.goodText,true);
        setTimeout(()=>{
          quizIndex++;
          quizIndex<quizSteps.length?showQuestion():afterMiniGame1();
        },1200);
      }else if(selected.length>=2){
        showNotification(q.badText,false);
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
  miniGame.classList.add("hidden");
  playDialog([
    {speaker:"pirate2",text:"Bien joué."},
    {speaker:"pirate3",text:"Passons à l’identité visuelle."}
  ], startMiniGame3);
}

/* =====================================================
   🎮 MINI-JEU 3 — LIENS VISIBLES
===================================================== */
function startMiniGame3(){
  miniGame.innerHTML="";
  miniGame.classList.remove("hidden");

  const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.setAttribute("width","100%");
  svg.setAttribute("height","100%");
  svg.style.position="fixed";
  svg.style.top="0";
  svg.style.left="0";
  svg.style.pointerEvents="none";
  svg.style.zIndex="3000";
  document.body.appendChild(svg);

  let selected=null,done=0;

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
    b.textContent=p.label;
    b.onclick=()=>selected={btn:b,target:p.target};
    miniGame.appendChild(b);
  });

  Object.keys(targets).forEach(k=>{
    const b=document.createElement("button");
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

function finishQuest(svg){
  svg.remove();
  miniGame.classList.add("hidden");
  const fade=document.createElement("div");
  fade.id="fadeScreen";
  fade.innerHTML='<div class="loaderBox">Bravo, quête terminée</div>';
  document.body.appendChild(fade);
  setTimeout(()=>location.href="menu.html",2500);
}

/* =====================================================
   🏆 FIN DE QUÊTE
===================================================== */
function finishQuest(){
  hideMiniGame();

  const fade=document.createElement("div");
  fade.id="fadeScreen";
  fade.innerHTML='<div class="loaderBox">Bravo, tu as terminé cette quête</div>';
  document.body.appendChild(fade);

  setTimeout(()=> window.location.href="menu.html", 2500);
}

});
