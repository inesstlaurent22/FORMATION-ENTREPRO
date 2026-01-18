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
   💬 SYSTÈME DE DIALOGUES
===================================================== */
let dialogs = [];
let dialogIndex = 0;
let dialogCallback = null;

function playDialog(list, callback){
  dialogs = list;
  dialogIndex = 0;
  dialogCallback = callback;
  dialogBox.classList.remove("hidden");
  showDialog();
}

function showDialog(){
  const d = dialogs[dialogIndex];
  dialogText.textContent = d.text;

  const target = d.speaker === "pirate2" ? pirate2 : pirate3;
  const r = target.getBoundingClientRect();

  dialogBox.style.left =
    `${r.left + r.width/2 - dialogBox.offsetWidth/2}px`;
  dialogBox.style.top =
    `${r.top - dialogBox.offsetHeight - 20}px`;
}

dialogBox.onclick = () => {
  dialogIndex++;
  if(dialogIndex < dialogs.length){
    showDialog();
  } else {
    dialogBox.classList.add("hidden");
    dialogCallback && dialogCallback();
  }
};

/* =====================================================
   HELPERS MINI-JEUX
===================================================== */
function showMiniGame(){
  miniGame.innerHTML = "";
  miniGame.classList.remove("hidden");
}
function hideMiniGame(){
  miniGame.classList.add("hidden");
}
function addTitle(t){
  const h = document.createElement("h3");
  h.textContent = t;
  miniGame.appendChild(h);
}
function addText(t, bold=false){
  const p = document.createElement("p");
  p.textContent = t;
  if(bold) p.style.fontWeight = "bold";
  miniGame.appendChild(p);
}

/* =====================================================
   🔔 NOTIFICATION (HAUT ÉCRAN)
===================================================== */
function showNotification(text, success){
  const box = document.createElement("div");
  box.style.position = "fixed";
  box.style.top = "-140px";
  box.style.left = "50%";
  box.style.transform = "translateX(-50%)";
  box.style.width = "90%";
  box.style.maxWidth = "520px";
  box.style.padding = "18px";
  box.style.background = "rgba(0,0,0,.95)";
  box.style.border = `3px solid ${success ? "limegreen" : "red"}`;
  box.style.color = "#fff";
  box.style.fontSize = "17px";
  box.style.fontWeight = "bold";
  box.style.textAlign = "center";
  box.style.zIndex = "5000";
  box.style.transition = "top .4s ease";

  box.textContent = text;
  document.body.appendChild(box);

  setTimeout(()=> box.style.top = "20px", 20);
  setTimeout(()=> box.remove(), 1800);
}

/* =====================================================
   DÉBUT DE LA QUÊTE
===================================================== */
pirate3.onclick = () => {
  playDialog([
    { speaker:"pirate3", text:"Capitaine, ton trésor est prêt." },
    { speaker:"pirate2", text:"Mais sans communication, personne ne viendra." },
    { speaker:"pirate3", text:"Voyons comment attirer le marché." }
  ], startMiniGame1);
};

/* =====================================================
   🎮 MINI-JEU 1 — COMMUNICATION
===================================================== */
const quizSteps = [
  {
    title:"Visite physique",
    question:"Rencontrer un client permet de :",
    options:["Rassurer","Créer une connexion","Ignorer ses attentes"],
    good:[0,1],
    goodText:"La visite physique rassure et crée une relation humaine.",
    badText:"Ignorer un client détruit la confiance."
  },
  {
    title:"Phoning / Mailing",
    question:"Le contact direct sert à :",
    options:["Comprendre les besoins","Créer une relation","Parler uniquement de prix"],
    good:[0,1],
    goodText:"Le contact direct permet d’adapter son discours.",
    badText:"Parler uniquement de prix bloque la relation."
  },
  {
    title:"Réseaux sociaux",
    question:"Ils servent surtout à :",
    options:["Se faire connaître","Montrer son univers","Vendre immédiatement"],
    good:[0,1],
    goodText:"Les réseaux sociaux servent à créer de la visibilité.",
    badText:"Forcer la vente fait fuir les clients."
  },
  {
    title:"Newsletters",
    question:"Une newsletter permet de :",
    options:["Rester présent","Créer un lien","Envoyer du spam"],
    good:[0,1],
    goodText:"La newsletter entretient une relation dans le temps.",
    badText:"Le spam dégrade l’image de marque."
  }
];

let quizIndex = 0;
let selected = [];

function startMiniGame1(){
  quizIndex = 0;
  showQuestion();
}

function showQuestion(){
  showMiniGame();
  selected = [];

  const q = quizSteps[quizIndex];
  addTitle(q.title);
  addText(q.question);
  addText("2 bonnes réponses");

  q.options.forEach((txt,i)=>{
    const btn = document.createElement("button");
    btn.textContent = txt;

    btn.onclick = () => {
      if(!selected.includes(i)) selected.push(i);

      if(checkAnswer(q)){
        hideMiniGame();
        showNotification("Bravo ! " + q.goodText, true);
        setTimeout(()=>{
          quizIndex++;
          quizIndex < quizSteps.length
            ? showQuestion()
            : afterMiniGame1();
        }, 1400);
      } 
      else if(selected.length >= 2){
        showNotification(q.badText, false);
        selected = [];
      }
    };

    miniGame.appendChild(btn);
  });
}

function checkAnswer(q){
  return q.good.every(i=>selected.includes(i)) &&
         selected.every(i=>q.good.includes(i));
}

function afterMiniGame1(){
  playDialog([
    { speaker:"pirate2", text:"Parfait. Tu sais maintenant attirer l’attention." },
    { speaker:"pirate3", text:"Passons à ton identité visuelle." }
  ], startMiniGame2);
}

/* =====================================================
   🎨 MINI-JEU 2 — IDENTITÉ VISUELLE
===================================================== */
let identityStep = 0;

function startMiniGame2(){
  showMiniGame();
  addTitle("Identité visuelle");
  addText("Logo, couleurs et typographie doivent être cohérents.");
  addText("Clique pour commencer");

  miniGame.onclick = () => {
    miniGame.onclick = null;
    startLogoStep();
  };
}

function startLogoStep(){
  showMiniGame();
  addTitle("Choisis ton logo");
  showImages(["images/Logo1.PNG","images/Logo2.PNG","images/Logo3.PNG"], () => {
    startColorStep();
  });
}

function startColorStep(){
  showMiniGame();
  addTitle("Choisis les bonnes couleurs");

  const hintBtn = document.createElement("button");
  hintBtn.textContent = "Indices";
  hintBtn.onclick = ()=> {
    showNotification(
      "Les couleurs doivent être cohérentes avec le logo.",
      true
    );
  };
  miniGame.appendChild(hintBtn);

  showImages(
    ["images/Couleur1.PNG","images/Couleur2.PNG","images/Couleur3.PNG"],
    (i)=>{
      if(i===1){
        startTypoStep();
      }
    }
  );
}

function startTypoStep(){
  showMiniGame();
  addTitle("Choisis la typographie");

  showImages(
    ["images/Typo1.PNG","images/Typo2.PNG","images/Typo3.PNG"],
    (i)=>{
      if(i===0){
        showIdentityImage();
      }
    }
  );
}

function showImages(images, cb){
  const wrap = document.createElement("div");
  wrap.className = "visualChoices";

  images.forEach((src,i)=>{
    const img = document.createElement("img");
    img.src = src;
    img.onclick = ()=> cb(i);
    wrap.appendChild(img);
  });

  miniGame.appendChild(wrap);
}

function showIdentityImage(){
  hideMiniGame();

  const fade = document.createElement("div");
  fade.id = "fadeScreen";

  const box = document.createElement("div");
  box.className = "loaderBox";

  const title = document.createElement("div");
  title.className = "winBravo";
  title.textContent = "L’identité visuelle est prête";

  const img = document.createElement("img");
  img.src = "images/Identiteevisuelle.JPG";
  img.style.width = "260px";
  img.style.marginTop = "20px";
  img.style.cursor = "pointer";

  box.appendChild(title);
  box.appendChild(img);
  fade.appendChild(box);
  document.body.appendChild(fade);

  img.onclick = () => {
    fade.remove();
    afterMiniGame2();
  };
}

function afterMiniGame2(){
  playDialog([
    { speaker:"pirate2", text:"Ta marque est maintenant reconnaissable." },
    { speaker:"pirate3", text:"Voyons où communiquer efficacement." }
  ], prepareMiniGame3);
}

/* =====================================================
   🎮 MINI-JEU 3 — CANAUX
===================================================== */
function prepareMiniGame3(){
  showMiniGame();

  const btn = document.createElement("button");
  btn.textContent = "Continuer la quête";
  btn.style.position = "absolute";
  btn.style.top = "12px";
  btn.style.right = "12px";

  btn.onclick = () => {
    hideMiniGame();
    startMiniGame3();
  };

  miniGame.appendChild(btn);
}

function startMiniGame3(){
  showMiniGame();
  addTitle("Choisis le bon type de communication");

  addText(
    "BtoB : entreprise → entreprise | BtoC : entreprise → particulier",
    true
  );

  const svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.style.position="absolute";
  svg.style.inset="0";
  svg.style.pointerEvents="none";
  miniGame.appendChild(svg);

  let selectedBtn = null;
  let success = 0;

  const platforms = [
    { label:"Instagram & TikTok", target:"know" },
    { label:"Shopify", target:"btoc" },
    { label:"LinkedIn & Facebook", target:"btob" }
  ];

  const targets = {
    know:"Se faire connaître",
    btoc:"Vendre en BtoC",
    btob:"Vendre en BtoB"
  };

  platforms.forEach(p=>{
    const b=document.createElement("button");
    b.className="btn-platform";
    b.textContent=p.label;
    b.onclick=()=> selectedBtn={btn:b,target:p.target};
    miniGame.appendChild(b);
  });

  miniGame.appendChild(document.createElement("hr"));

  Object.keys(targets).forEach(k=>{
    const b=document.createElement("button");
    b.className="btn-target";
    b.textContent=targets[k];
    b.onclick=()=>{
      if(selectedBtn && selectedBtn.target===k){
        drawLine(svg, selectedBtn.btn, b);
        success++;
        selectedBtn=null;
        if(success===3) finishQuest();
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
  l.setAttribute("stroke-width","3");
  svg.appendChild(l);
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
