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

toggleSound.addEventListener("click", (e)=>{
  e.stopPropagation();
  introVideo.muted = !introVideo.muted;
  toggleSound.textContent = introVideo.muted ? "🔇" : "🔊";
});

closeVideo.addEventListener("click", (e)=>{
  e.stopPropagation();
  endVideo();
});

introVideo.addEventListener("ended", endVideo);

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

dialogBox.onclick = (e)=>{
  e.stopPropagation();
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
pirate3.onclick = (e)=>{
  e.stopPropagation();
  playDialog([
    {speaker:"pirate3",text:"Capitaine, ton trésor est prêt."},
    {speaker:"pirate2",text:"Mais sans communication, personne ne viendra."},
    {speaker:"pirate3",text:"Voyons comment attirer le marché."}
  ], startMiniGame1);
};

/* =====================================================
   🧠 HELPERS
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

let quizIndex=0, selected=[];

function startMiniGame1(){
  quizIndex=0;
  showMiniGame();
  renderQuiz();
}

function renderQuiz(){
  miniGame.innerHTML="";
  selected=[];

  const step = quizSteps[quizIndex];
  const box = document.createElement("div");
  box.className="questionBox";

  addTitle(step.title);
  addText(step.question);
  addText("🔴 2 bonnes réponses");

  step.answers.forEach((a,i)=>{
    const b=document.createElement("button");
    b.textContent=a.text;
    b.onclick=(e)=>{
      e.stopPropagation();
      if(!selected.includes(i)){
        selected.push(i);
        b.classList.add("selected");
      }
      checkQuiz(step, box);
    };
    box.appendChild(b);
  });

  miniGame.appendChild(box);
}

function checkQuiz(step, box){
  const correct = step.answers
    .map((a,i)=>a.correct?i:null)
    .filter(i=>i!==null);

  const ok =
    correct.every(i=>selected.includes(i)) &&
    selected.every(i=>step.answers[i].correct);

  if(ok){
    miniGame.innerHTML="";
    const exp=document.createElement("div");
    exp.className="explainBox";
    exp.innerHTML=`<strong>✅ Bonne réponse</strong><br>${step.explanation}`;
    miniGame.appendChild(exp);

    setTimeout(()=>{
      quizIndex++;
      if(quizIndex < quizSteps.length){
        renderQuiz();
      } else {
        hideMiniGame();
        afterMiniGame1Dialog();
      }
    },1600);
  }
}

/* =====================================================
   💬 DIALOGUES APRÈS MINI-JEU 1
===================================================== */
function afterMiniGame1Dialog(){
  playDialog([
    {speaker:"pirate2",text:"Tu sais maintenant comment attirer les clients."},
    {speaker:"pirate3",text:"Mais pour être reconnu, il faut une identité forte."}
  ], startMiniGame2);
}

/* =====================================================
   🎨 MINI-JEU 2 – IDENTITÉ VISUELLE
===================================================== */
let identityDone=false;

function startMiniGame2(){
  identityDone=false;
  showMiniGame();
  addTitle("🎨 Identité visuelle");
  addText("Clique pour commencer");
  miniGame.onclick=()=>{
    miniGame.onclick=null;
    startLogoStep();
  };
}

function loadImages(images, cb){
  miniGame.innerHTML="<div class='hourglass'>⏳</div>";
  let loaded=0;
  images.forEach(src=>{
    const img=new Image();
    img.src=src;
    img.onload=()=>{
      loaded++;
      if(loaded===images.length) cb();
    };
  });
}

function startLogoStep(){
  showMiniGame();
  addText("Choisis ton logo");
  loadImages(
    ["images/Logo1.PNG","images/Logo2.PNG","images/Logo3.PNG"],
    ()=>addImages(["images/Logo1.PNG","images/Logo2.PNG","images/Logo3.PNG"],()=>startColorsStep())
  );
}

function startColorsStep(){
  showMiniGame();
  addText("Choisis les bonnes couleurs");

  const hint=document.createElement("button");
  hint.textContent="Indice";
  hint.onclick=()=>alert("Les couleurs doivent avoir de la cohérence avec le logo");
  miniGame.appendChild(hint);

  loadImages(
    ["images/Couleur1.PNG","images/Couleur2.PNG","images/Couleur3.PNG"],
    ()=>addImages(["images/Couleur1.PNG","images/Couleur2.PNG","images/Couleur3.PNG"],i=>{
      if(i===1) setTimeout(startTypoStep,700);
    })
  );
}

function startTypoStep(){
  showMiniGame();
  addText("Choisis la typographie");

  loadImages(
    ["images/Typo1.PNG","images/Typo2.PNG","images/Typo3.PNG"],
    ()=>addImages(["images/Typo1.PNG","images/Typo2.PNG","images/Typo3.PNG"],i=>{
      if(i===0) setTimeout(showIdentityLoader,700);
    })
  );
}

function showIdentityLoader(){
  if(identityDone) return;
  identityDone=true;

  const fade=document.createElement("div");
  fade.id="fadeScreen";
  fade.innerHTML=`
    <div class="loaderBox">
      <div class="winBravo">Identité visuelle créée</div>
      <img src="images/identiteevisuelle.JPG" style="width:240px;cursor:pointer">
      <p>Clique sur l’image pour continuer</p>
    </div>`;
  document.body.appendChild(fade);

  fade.querySelector("img").onclick=()=>{
    fade.remove();
    hideMiniGame();
    afterMiniGame2Dialog();
  };
}

/* =====================================================
   💬 DIALOGUES APRÈS MINI-JEU 2
===================================================== */
function afterMiniGame2Dialog(){
  playDialog([
    {speaker:"pirate2",text:"Ta marque est maintenant reconnaissable."},
    {speaker:"pirate3",text:"Voyons comment la faire connaître et vendre."}
  ], startMiniGame3);
}

/* =====================================================
   🎮 MINI-JEU 3 – CANAUX
===================================================== */
function startMiniGame3(){
  showMiniGame();
  addTitle("Choisis le bon type de communication");

  const infoBtn=document.createElement("button");
  infoBtn.textContent="Indice";
  infoBtn.onclick=()=>{
    alert(
      "BtoB : Business to Business (entreprise à entreprise)\n" +
      "BtoC : Business to Consumer (entreprise à particulier)\n" +
      "Particulier : client comme toi"
    );
  };
  miniGame.appendChild(infoBtn);

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
    b.onclick=()=>selected=p;
    miniGame.appendChild(b);
  });

  miniGame.appendChild(document.createElement("hr"));

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
  fade.innerHTML=`
    <div class="loaderBox">
      <div class="winBravo">Bravo, tu as terminé cette quête</div>
    </div>`;
  document.body.appendChild(fade);

  setTimeout(()=>window.location.href="menu.html",2500);
}

});
