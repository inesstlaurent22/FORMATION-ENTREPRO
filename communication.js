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

toggleSound.onclick = (e)=>{
  e.stopPropagation();
  introVideo.muted = !introVideo.muted;
  toggleSound.textContent = introVideo.muted ? "🔇" : "🔊";
};

closeVideo.onclick = (e)=>{
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
  const d = dialogs[dialogIndex];
  dialogText.textContent = d.text;

  const target = d.speaker==="pirate2"?pirate2:pirate3;
  const r = target.getBoundingClientRect();

  dialogBox.style.left =
    `${r.left + r.width/2 - dialogBox.offsetWidth/2}px`;
  dialogBox.style.top =
    `${r.top - dialogBox.offsetHeight - 20}px`;
}

dialogBox.onclick = ()=>{
  dialogIndex++;
  if(dialogIndex < dialogs.length){
    showDialog();
  } else {
    dialogBox.classList.add("hidden");
    dialogCallback && dialogCallback();
  }
};

/* =====================================================
   DÉBUT DE QUÊTE
===================================================== */
pirate3.onclick = ()=>{
  playDialog([
    {speaker:"pirate3",text:"Capitaine, ton trésor est prêt."},
    {speaker:"pirate2",text:"Mais sans communication, personne ne viendra."},
    {speaker:"pirate3",text:"Voyons comment attirer le marché."}
  ], startMiniGame1);
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
function addText(t,cls=""){
  const p=document.createElement("p");
  p.textContent=t;
  if(cls) p.className=cls;
  miniGame.appendChild(p);
}

/* =====================================================
   🔔 NOTIFICATION (MINI-JEU 1)
===================================================== */
function showNotification(text){
  const n=document.createElement("div");
  n.className="notification";
  n.textContent=text;
  document.body.appendChild(n);
  setTimeout(()=>n.remove(),2200);
}

/* =====================================================
   🎮 MINI-JEU 1 – COMMUNICATION (NOTIFICATIONS)
===================================================== */
const quizSteps = [
  {
    title:"⚓ Visite physique",
    question:"Rencontrer un client en vrai permet de :",
    answers:[
      {text:"Rassurer et écouter",correct:true},
      {text:"Créer une vraie connexion",correct:true},
      {text:"Ignorer ses attentes",correct:false}
    ],
    explanation:"La présence physique renforce fortement la crédibilité."
  },
  {
    title:"🕊️ Phoning / Mailing",
    question:"Le contact direct permet de :",
    answers:[
      {text:"Comprendre les besoins",correct:true},
      {text:"Créer une relation humaine",correct:true},
      {text:"Parler uniquement de prix",correct:false}
    ],
    explanation:"Le contact direct bien utilisé crée la confiance."
  },
  {
    title:"📣 Réseaux sociaux",
    question:"Les réseaux sociaux servent principalement à :",
    answers:[
      {text:"Te faire découvrir",correct:true},
      {text:"Montrer ton univers",correct:true},
      {text:"Forcer la vente immédiate",correct:false}
    ],
    explanation:"Ils servent à créer de la visibilité."
  },
  {
    title:"📜 Newsletters",
    question:"Une newsletter permet de :",
    answers:[
      {text:"Rester présent dans l’esprit du client",correct:true},
      {text:"Créer un lien dans le temps",correct:true},
      {text:"Envoyer des promotions tous les jours",correct:false}
    ],
    explanation:"Elle entretient une relation durable."
  }
];

let quizIndex=0, selected=[], locked=false;

function startMiniGame1(){
  quizIndex=0;
  showMiniGame();
  renderQuiz();
}

function renderQuiz(){
  miniGame.innerHTML="";
  selected=[];
  locked=false;

  const step=quizSteps[quizIndex];

  addTitle(step.title);
  addText(step.question);
  addText("🔴 2 bonnes réponses","hint");

  step.answers.forEach((a,i)=>{
    const b=document.createElement("button");
    b.textContent=a.text;
    b.onclick=()=>{
      if(locked) return;
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
  const correct=step.answers.map((a,i)=>a.correct?i:null).filter(i=>i!==null);
  const ok=correct.every(i=>selected.includes(i)) &&
           selected.every(i=>step.answers[i].correct);

  if(ok){
    locked=true;
    showNotification(step.explanation);

    setTimeout(()=>{
      quizIndex++;
      if(quizIndex<quizSteps.length){
        renderQuiz();
      } else {
        hideMiniGame();
        afterMiniGame1Dialog();
      }
    },1800);
  }
}

/* =====================================================
   💬 APRÈS MINI-JEU 1
===================================================== */
function afterMiniGame1Dialog(){
  playDialog([
    {speaker:"pirate2",text:"Parfait. Tu maîtrises la communication."},
    {speaker:"pirate3",text:"Créons maintenant ton identité visuelle."}
  ], startMiniGame2);
}

/* =====================================================
   🎨 MINI-JEU 2 – IMAGES + SABLIER BLOQUANT
===================================================== */
function startMiniGame2(){
  showMiniGame();
  addTitle("🎨 Identité visuelle");
  addText("Choisis ton logo.");
  loadImages(
    ["images/Logo1.PNG","images/Logo2.PNG","images/Logo3.PNG"],
    ()=>startColorsStep()
  );
}

function loadImages(images,callback){
  const overlay=document.createElement("div");
  overlay.className="imageLoader";
  overlay.innerHTML="⏳";
  miniGame.appendChild(overlay);

  let loaded=0;
  const wrap=document.createElement("div");
  wrap.className="visualChoices hidden";

  images.forEach((src,i)=>{
    const img=new Image();
    img.src=src;
    img.onload=()=>{
      loaded++;
      if(loaded===images.length){
        overlay.remove();
        wrap.classList.remove("hidden");
      }
    };
    img.onclick=()=>callback(i);
    wrap.appendChild(img);
  });

  miniGame.appendChild(wrap);
}

function startColorsStep(){
  showMiniGame();
  addTitle("🎨 Identité visuelle");
  addText("Choisis les bonnes couleurs");

  const hintBtn=document.createElement("button");
  hintBtn.textContent="Indice";
  hintBtn.onclick=()=>alert(
    "Les couleurs doivent avoir de la cohérence avec le logo."
  );
  miniGame.appendChild(hintBtn);

  loadImages(
    ["images/Couleur1.PNG","images/Couleur2.PNG","images/Couleur3.PNG"],
    (i)=>{
      if(i===1){
        setTimeout(startTypoStep,800);
      }
    }
  );
}

function startTypoStep(){
  showMiniGame();
  addTitle("🎨 Identité visuelle");
  addText("Choisis la typographie");

  loadImages(
    ["images/Typo1.PNG","images/Typo2.PNG","images/Typo3.PNG"],
    (i)=>{
      if(i===0){
        showIdentityResult();
      }
    }
  );
}

/* =====================================================
   🔎 ZOOM IMAGE IDENTITÉ
===================================================== */
function showIdentityResult(){
  const fade=document.createElement("div");
  fade.id="fadeScreen";

  const box=document.createElement("div");
  box.className="loaderBox";

  const zoomBtn=document.createElement("button");
  zoomBtn.textContent="🔎";

  const img=document.createElement("img");
  img.src="images/identiteevisuelle.JPG";
  img.style.width="220px";
  img.style.marginTop="10px";

  zoomBtn.onclick=()=>{
    const z=document.createElement("div");
    z.className="zoomOverlay";
    const zi=document.createElement("img");
    zi.src=img.src;
    z.appendChild(zi);
    z.onclick=()=>z.remove();
    document.body.appendChild(z);
  };

  img.onclick=()=>{
    fade.remove();
    hideMiniGame();
    afterMiniGame2Dialog();
  };

  box.appendChild(zoomBtn);
  box.appendChild(img);
  fade.appendChild(box);
  document.body.appendChild(fade);
}

/* =====================================================
   💬 APRÈS MINI-JEU 2
===================================================== */
function afterMiniGame2Dialog(){
  playDialog([
    {speaker:"pirate2",text:"Ton identité visuelle est prête."},
    {speaker:"pirate3",text:"Voyons maintenant les canaux de communication."}
  ], startMiniGame3);
}

/* =====================================================
   🎮 MINI-JEU 3 – LIGNES ENTRE BOUTONS
===================================================== */
function startMiniGame3(){
  showMiniGame();
  addTitle("Choisis le bon type de communication");

  const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.classList.add("linkLayer");
  miniGame.appendChild(svg);

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
    b.onclick=()=>selected=b;
    miniGame.appendChild(b);
  });

  miniGame.appendChild(document.createElement("hr"));

  Object.keys(targets).forEach(k=>{
    const b=document.createElement("button");
    b.className="btn-target";
    b.textContent=targets[k];
    b.onclick=()=>{
      if(selected){
        drawLine(svg,selected,b);
        selected=null;
        done++;
        if(done===3) showQuestWinLoader();
      }
    };
    miniGame.appendChild(b);
  });
}

/* =====================================================
   🖊️ DESSIN LIGNE
===================================================== */
function drawLine(svg,a,b){
  const ra=a.getBoundingClientRect();
  const rb=b.getBoundingClientRect();
  const rm=miniGame.getBoundingClientRect();

  const line=document.createElementNS("http://www.w3.org/2000/svg","line");
  line.setAttribute("x1",ra.left+ra.width/2-rm.left);
  line.setAttribute("y1",ra.top+ra.height/2-rm.top);
  line.setAttribute("x2",rb.left+rb.width/2-rm.left);
  line.setAttribute("y2",rb.top+rb.height/2-rm.top);
  line.setAttribute("stroke","gold");
  line.setAttribute("stroke-width","3");
  svg.appendChild(line);
}

/* =====================================================
   🏆 FIN
===================================================== */
function showQuestWinLoader(){
  hideMiniGame();
  const fade=document.createElement("div");
  fade.id="fadeScreen";
  fade.innerHTML="<div class='loaderBox'>🏆 Bravo, quête terminée</div>";
  document.body.appendChild(fade);
  setTimeout(()=>window.location.href="menu.html",2500);
}

});
