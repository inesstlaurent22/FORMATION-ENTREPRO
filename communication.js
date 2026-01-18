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
   🎮 MINI-JEU 1 – COMMUNICATION
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

let quizIndex=0;
let selected=[];
let locked=false;

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
  const correct=step.answers
    .map((a,i)=>a.correct?i:null)
    .filter(i=>i!==null);

  const ok=
    correct.every(i=>selected.includes(i)) &&
    selected.every(i=>step.answers[i].correct);

  if(ok){
    locked=true;
    miniGame.innerHTML="";

    addText("Bravo !","bravoText");
    addText(step.explanation,"explainText");

    setTimeout(()=>{
      quizIndex++;
      if(quizIndex<quizSteps.length){
        renderQuiz();
      } else {
        hideMiniGame();
        afterMiniGame1Dialog();
      }
    },1600);
  }
}

/* =====================================================
   💬 APRÈS MINI-JEU 1
===================================================== */
function afterMiniGame1Dialog(){
  playDialog([
    {speaker:"pirate2",text:"Tu sais maintenant comment attirer l’attention."},
    {speaker:"pirate3",text:"Passons à l’identité visuelle."}
  ], startMiniGame2);
}

/* =====================================================
   🎨 MINI-JEU 2 – IDENTITÉ VISUELLE
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
  const hourglass=document.createElement("div");
  hourglass.className="hourglass";
  hourglass.textContent="⏳";
  miniGame.appendChild(hourglass);

  let loaded=0;
  const wrap=document.createElement("div");
  wrap.className="visualChoices";

  images.forEach((src,i)=>{
    const img=new Image();
    img.src=src;
    img.onload=()=>{
      loaded++;
      if(loaded===images.length){
        hourglass.remove();
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
        addText("Bravo !","bravoText");
        setTimeout(startTypoStep,1200);
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

function showIdentityResult(){
  const fade=document.createElement("div");
  fade.id="fadeScreen";

  const box=document.createElement("div");
  box.className="loaderBox";

  const title=document.createElement("div");
  title.className="winBravo softGlow";
  title.textContent="L’identité visuelle est prête";

  const img=document.createElement("img");
  img.src="images/Identiteevisuelle.JPG";
  img.style.width="220px";
  img.style.marginTop="20px";
  img.style.cursor="pointer";

  img.onclick=()=>{
    fade.remove();
    hideMiniGame();
    afterMiniGame2Dialog();
  };

  box.appendChild(title);
  box.appendChild(img);
  fade.appendChild(box);
  document.body.appendChild(fade);
}

/* =====================================================
   💬 APRÈS MINI-JEU 2
===================================================== */
function afterMiniGame2Dialog(){
  playDialog([
    {speaker:"pirate2",text:"Ta marque est maintenant reconnaissable."},
    {speaker:"pirate3",text:"Voyons quel type de communication utiliser."}
  ], startMiniGame3);
}

/* =====================================================
   🎮 MINI-JEU 3
===================================================== */
function startMiniGame3(){
  showMiniGame();
  addTitle("Choisis le bon type de communication");

  addText(
    "Indice : BtoB = entreprise à entreprise / BtoC = entreprise à particulier"
  );

  let selected=null;
  let done=0;

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
    b.onclick=()=>selected=p;
    miniGame.appendChild(b);
  });

  const sep=document.createElement("div");
  sep.className="separator";
  miniGame.appendChild(sep);

  Object.keys(targets).forEach(k=>{
    const b=document.createElement("button");
    b.className="btn-target";
    b.textContent=targets[k];
    b.onclick=()=>{
      if(selected && selected.target===k){
        done++;
        selected=null;
        if(done===3) showQuestWinLoader();
      }
    };
    miniGame.appendChild(b);
  });
}

/* =====================================================
   🏆 FIN
===================================================== */
function showQuestWinLoader(){
  hideMiniGame();

  const fade=document.createElement("div");
  fade.id="fadeScreen";

  const box=document.createElement("div");
  box.className="loaderBox";

  const t=document.createElement("div");
  t.className="winBravo softGlow";
  t.textContent="Bravo, tu as terminé cette quête";

  box.appendChild(t);
  fade.appendChild(box);
  document.body.appendChild(fade);

  setTimeout(()=>{
    window.location.href="menu.html";
  },2500);
}

});
