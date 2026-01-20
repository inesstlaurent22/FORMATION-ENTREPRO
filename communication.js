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
function addText(t){
  const p=document.createElement("p");
  p.innerHTML=t;
  miniGame.appendChild(p);
}

/* =====================================================
   🔔 NOTIFICATION CLIQUABLE
===================================================== */
function showNotification(text, onNext){
  const n=document.createElement("div");
  n.className="notification success";
  n.innerHTML=`
    <div class="notif-hint">Clique sur la notification pour continuer</div>
    <div class="notif-text">${text}</div>
  `;
  n.onclick=()=>{
    n.remove();
    onNext && onNext();
  };
  document.body.appendChild(n);
}

/* =====================================================
   DÉMARRAGE
===================================================== */
pirate3.onclick=()=>{
  playDialog([
    {speaker:"pirate3",text:"Capitaine, ton trésor est prêt."},
    {speaker:"pirate2",text:"Mais sans communication, personne ne viendra."},
    {speaker:"pirate3",text:"Voyons comment attirer le marché."}
  ],startMiniGame1);
};

/* =====================================================
   🎮 MINI-JEU 1 – COMMUNICATION
===================================================== */
const quiz=[
  {
    t:"⚓ Visite physique",
    q:"Rencontrer un client permet de :",
    o:["Rassurer","Créer une connexion","Ignorer ses attentes"],
    g:[0,1],
    txt:"La visite physique crée une relation de confiance."
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
    txt:"Les réseaux sociaux créent de la visibilité."
  },
  {
    t:"📜 Newsletters",
    q:"Une newsletter permet de :",
    o:["Rester présent","Créer un lien","Envoyer du spam"],
    g:[0,1],
    txt:"La newsletter entretient la relation."
  }
];

let qi=0, sel=[];

function startMiniGame1(){
  qi=0;
  showQuestion();
}

function showQuestion(){
  showMiniGame();
  sel=[];
  const s=quiz[qi];
  addTitle(s.t);
  addText(s.q);
  addText("<span class='two-good'>2 bonnes réponses</span>");

  s.o.forEach((txt,i)=>{
    const b=document.createElement("button");
    b.textContent=txt;
    b.onclick=()=>{
      if(!sel.includes(i)) sel.push(i);
      if(check(s)){
        showNotification(s.txt,()=>{
          qi++;
          qi<quiz.length ? showQuestion() : afterMiniGame1();
        });
      }
    };
    miniGame.appendChild(b);
  });
}

function check(s){
  return s.g.every(i=>sel.includes(i)) && sel.every(i=>s.g.includes(i));
}

function afterMiniGame1(){
  hideMiniGame();
  playDialog([
    {speaker:"pirate2",text:"Parfait."},
    {speaker:"pirate3",text:"Créons ton identité visuelle."}
  ],startMiniGame2);
}

/* =====================================================
   🎨 MINI-JEU 2 – IDENTITÉ VISUELLE
===================================================== */
function startMiniGame2(){
  showMiniGame();
  addTitle("L’identité visuelle : Avant de commencer");
  addText("Avant de faire un logo, de choisir des couleurs ou une écriture, il faut d’abord savoir ce que tu veux montrer.");

  const box=document.createElement("div");
  box.className="infoBox";
  box.innerHTML="Clique ici pour continuer";
  box.onclick=startLogo;
  miniGame.appendChild(box);
}

/* ===== Loader images ===== */
function imageGroup(images, cb){
  const loader=document.createElement("div");
  loader.className="imgLoader";
  loader.textContent="⏳";
  miniGame.appendChild(loader);

  let loaded=0;
  const wrap=document.createElement("div");
  wrap.className="visualChoices";

  images.forEach(src=>{
    const box=document.createElement("div");
    const img=new Image();
    img.src=src;
    img.onload=()=>{
      loaded++;
      if(loaded===images.length){
        loader.remove();
        miniGame.appendChild(wrap);
      }
    };
    img.onclick=()=>cb();

    const zoom=document.createElement("button");
    zoom.textContent="🔎";
    zoom.onclick=e=>{
      e.stopPropagation();
      zoomImg(src);
    };

    box.append(img,zoom);
    wrap.appendChild(box);
  });
}

function zoomImg(src){
  const f=document.createElement("div");
  f.id="fadeScreen";
  const box=document.createElement("div");
  box.className="loaderBox";
  const img=document.createElement("img");
  img.src=src;
  img.style.width="300px";
  img.onclick=()=>f.remove();
  box.appendChild(img);
  f.appendChild(box);
  document.body.appendChild(f);
}

function startLogo(){
  showMiniGame();
  addTitle("Choisis ton logo");
  addText("Le choix est libre");
  imageGroup(
    ["images/Logo1.PNG","images/Logo2.PNG","images/Logo3.PNG"],
    startColors
  );
}

function startColors(){
  showMiniGame();
  addTitle("Choisis les couleurs");
  imageGroup(
    ["images/Couleur1.PNG","images/Couleur2.PNG","images/Couleur3.PNG"],
    startTypo
  );
}

function startTypo(){
  showMiniGame();
  addTitle("Choisis la typographie");
  imageGroup(
    ["images/Typo1.PNG","images/Typo2.PNG","images/Typo3.PNG"],
    showIdentity
  );
}

function showIdentity(){
  hideMiniGame();
  const f=document.createElement("div");
  f.id="fadeScreen";
  const b=document.createElement("div");
  b.className="loaderBox";
  b.innerHTML="<h3>L’identité visuelle est prête</h3>";

  const img=document.createElement("img");
  img.src="images/Identiteevisuelle.PNG";
  img.style.width="260px";
  img.onclick=()=>{
    f.remove();
    afterMiniGame2();
  };

  b.appendChild(img);
  f.appendChild(b);
  document.body.appendChild(f);
}

function afterMiniGame2(){
  playDialog([
    {speaker:"pirate2",text:"Ta marque est prête."},
    {speaker:"pirate3",text:"Voyons les canaux de communication."}
  ],startMiniGame3);
}

/* =====================================================
   🎮 MINI-JEU 3 – CANAUX
===================================================== */
function startMiniGame3(){
  showMiniGame();
  addTitle("Choisis le bon type de communication");

  const left=document.createElement("div");
  const right=document.createElement("div");
  left.className="leftCol";
  right.className="rightCol";

  const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.style.position="absolute";
  svg.style.inset="0";
  svg.style.pointerEvents="none";
  miniGame.appendChild(svg);

  let selected=null, ok=0;

  const platforms=[
    ["Instagram & TikTok","know"],
    ["Site de vente en ligne","btoc"],
    ["Facebook & LinkedIn","btob"]
  ];
  const targets=[
    ["Se faire connaître","know"],
    ["Vendre en BtoC","btoc"],
    ["Vendre en BtoB","btob"]
  ];

  platforms.forEach(p=>{
    const b=document.createElement("button");
    b.className="btn-platform";
    b.textContent=p[0];
    b.onclick=()=>selected={b:b,k:p[1]};
    left.appendChild(b);
  });

  targets.forEach(t=>{
    const b=document.createElement("button");
    b.className="btn-target";
    b.textContent=t[0];
    b.onclick=()=>{
      if(selected && selected.k===t[1]){
        drawLine(svg,selected.b,b);
        ok++;
        if(ok===3) finish();
      }
    };
    right.appendChild(b);
  });

  miniGame.append(left,right);
}

function drawLine(svg,a,b){
  const r1=a.getBoundingClientRect();
  const r2=b.getBoundingClientRect();
  const s=svg.getBoundingClientRect();
  const l=document.createElementNS("http://www.w3.org/2000/svg","line");
  l.setAttribute("x1",r1.left+r1.width/2-s.left);
  l.setAttribute("y1",r1.top+r1.height/2-s.top);
  l.setAttribute("x2",r2.left+r2.width/2-s.left);
  l.setAttribute("y2",r2.top+r2.height/2-s.top);
  l.setAttribute("stroke","gold");
  l.setAttribute("stroke-width","4");
  svg.appendChild(l);
}

/* =====================================================
   💎 FIN – EXPLOSION GEMS
===================================================== */
function finish(){
  hideMiniGame();
  const f=document.createElement("div");
  f.id="fadeScreen";
  const b=document.createElement("div");
  b.className="loaderBox";
  b.textContent="Bravo, tu as gagné cette quête";

  for(let i=0;i<50;i++){
    const g=document.createElement("div");
    g.className="gem";
    g.style.background=`hsl(${Math.random()*360},80%,60%)`;
    g.style.left="50%";
    g.style.top="50%";
    g.style.transform=`translate(${Math.random()*400-200}px,${Math.random()*400-200}px)`;
    f.appendChild(g);
  }

  f.appendChild(b);
  document.body.appendChild(f);

  setTimeout(()=>{
    sessionStorage.setItem("unlock_pirate5","true");
    location.href="menu.html";
  },2600);
}

});
