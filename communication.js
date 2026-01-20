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
   🎬 VIDÉO INTRO (FIXÉE)
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
function addText(t, cls){
  const p=document.createElement("p");
  p.textContent=t;
  if(cls) p.className=cls;
  miniGame.appendChild(p);
}

/* =====================================================
   🔔 NOTIFICATION CLIQUABLE
===================================================== */
function clickableNotification(text, onClick, isFirst=false){
  if(isFirst){
    const hint=document.createElement("div");
    hint.className="notifHint";
    hint.textContent="⬇ Clique sur la notification pour continuer ⬇";
    document.body.appendChild(hint);
    setTimeout(()=>hint.remove(),2000);
  }

  const n=document.createElement("div");
  n.className="notification success";
  n.innerHTML=`<div style="color:gold">Bravo</div><div style="margin-top:8px;font-size:18px;font-weight:bold">${text}</div>`;
  document.body.appendChild(n);

  n.onclick=()=>{
    n.remove();
    onClick();
  };
}

/* =====================================================
   DÉBUT
===================================================== */
pirate3.onclick=()=>{
  playDialog([
    {speaker:"pirate3",text:"Capitaine, ton trésor est prêt."},
    {speaker:"pirate2",text:"Mais sans communication, personne ne viendra."},
    {speaker:"pirate3",text:"Voyons comment attirer le marché."}
  ], startMiniGame1);
};

/* =====================================================
   🎮 MINI-JEU 1
===================================================== */
const quizSteps=[
  {
    title:"⚓ Visite physique",
    q:"Rencontrer un client permet de :",
    opts:["Rassurer","Créer une connexion","Ignorer ses attentes"],
    good:[0,1],
    exp:"La visite physique renforce la confiance."
  },
  {
    title:"🕊️ Phoning / Mailing",
    q:"Le contact direct sert à :",
    opts:["Comprendre les besoins","Créer une relation","Parler uniquement de prix"],
    good:[0,1],
    exp:"Le contact direct humanise l’échange."
  },
  {
    title:"📣 Réseaux sociaux",
    q:"Ils servent surtout à :",
    opts:["Se faire connaître","Montrer son univers","Vendre immédiatement"],
    good:[0,1],
    exp:"Les réseaux sociaux créent de la visibilité."
  },
  {
    title:"📜 Newsletters",
    q:"Une newsletter permet de :",
    opts:["Rester présent","Créer un lien","Envoyer du spam"],
    good:[0,1],
    exp:"La newsletter entretient la relation."
  }
];

let qi=0, selected=[];

function startMiniGame1(){
  qi=0;
  renderQuestion();
}

function renderQuestion(){
  showMiniGame();
  selected=[];
  const s=quizSteps[qi];

  addTitle(s.title);
  addText(s.q);
  addText("🔴 2 bonnes réponses","pulse");

  s.opts.forEach((txt,i)=>{
    const b=document.createElement("button");
    b.textContent=txt;
    b.style.display="block";
    b.onclick=()=>{
      if(!selected.includes(i)) selected.push(i);
      if(check(s)){
        clickableNotification(
          s.exp,
          ()=>{
            qi++;
            qi<quizSteps.length ? renderQuestion() : endMiniGame1();
          },
          qi===0
        );
      }
    };
    miniGame.appendChild(b);
  });
}

function check(s){
  return s.good.every(i=>selected.includes(i)) &&
         selected.every(i=>s.good.includes(i));
}

function endMiniGame1(){
  hideMiniGame();
  playDialog([
    {speaker:"pirate2",text:"Parfait. Tu maîtrises les bases."},
    {speaker:"pirate3",text:"Créons maintenant ton identité visuelle."}
  ], startMiniGame2);
}

/* =====================================================
   🎨 MINI-JEU 2
===================================================== */
function startMiniGame2(){
  showMiniGame();
  addTitle("🎨 Choisis ton logo");
  addText("Le choix est libre");

  showImages(
    ["images/Logo1.PNG","images/Logo2.PNG","images/Logo3.PNG"],
    ()=>startColors()
  );
}

function showImages(images,cb){
  const wrap=document.createElement("div");
  wrap.className="visualChoices";
  images.forEach(src=>{
    const box=document.createElement("div");
    const img=document.createElement("img");
    img.src=src;
    img.onclick=cb;

    const zoom=document.createElement("button");
    zoom.textContent="🔎";
    zoom.onclick=e=>{
      e.stopPropagation();
      showZoom(src);
    };

    box.appendChild(img);
    box.appendChild(zoom);
    wrap.appendChild(box);
  });
  miniGame.appendChild(wrap);
}

function showZoom(src){
  const f=document.createElement("div");
  f.id="fadeScreen";
  const box=document.createElement("div");
  box.className="loaderBox";
  const img=document.createElement("img");
  img.src=src;
  img.style.width="220px";
  box.appendChild(img);
  f.appendChild(box);
  f.onclick=()=>f.remove();
  document.body.appendChild(f);
}

function startColors(){
  showMiniGame();
  addTitle("🎨 Couleurs");
  showImages(
    ["images/Couleur1.PNG","images/Couleur2.PNG","images/Couleur3.PNG"],
    startTypo
  );
}

function startTypo(){
  showMiniGame();
  addTitle("✒️ Typographie");
  showImages(
    ["images/Typo1.PNG","images/Typo2.PNG","images/Typo3.PNG"],
    showIdentity
  );
}

function showIdentity(){
  hideMiniGame();
  const f=document.createElement("div");
  f.id="fadeScreen";
  const box=document.createElement("div");
  box.className="loaderBox";
  box.innerHTML="<div>L’identité visuelle est prête</div>";
  const img=document.createElement("img");
  img.src="images/identiteevisuelle.JPG";
  img.style.width="240px";
  img.onclick=()=>{
    f.remove();
    afterMiniGame2();
  };
  box.appendChild(img);
  f.appendChild(box);
  document.body.appendChild(f);
}

function afterMiniGame2(){
  playDialog([
    {speaker:"pirate2",text:"Ta marque est reconnaissable."},
    {speaker:"pirate3",text:"Choisissons les bons canaux."}
  ], startMiniGame3);
}

/* =====================================================
   🎮 MINI-JEU 3
===================================================== */
function startMiniGame3(){
  showMiniGame();
  addTitle("Choisis le bon type de communication");

  const hint=document.createElement("button");
  hint.textContent="Indice";
  hint.onclick=()=>{
    clickableNotification(
      "BtoC : Entreprise à particulier / BtoB : Entreprise à entreprise / Particulier : client comme toi ou moi",
      ()=>{}
    );
  };
  miniGame.appendChild(hint);

  const left=document.createElement("div");
  const right=document.createElement("div");
  left.className="column left";
  right.className="column right";

  const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.style.position="absolute";
  svg.style.inset="0";
  svg.style.pointerEvents="none";
  miniGame.appendChild(svg);

  let selected=null, done=0;

  const platforms=[
    {l:"Instagram & Tik Tok",k:"know"},
    {l:"Site de vente en ligne",k:"btoc"},
    {l:"Facebook & LinkedIn",k:"btob"}
  ];

  const targets=[
    {l:"Se faire connaître",k:"know"},
    {l:"Vendre en BtoC",k:"btoc"},
    {l:"Vendre en BtoB",k:"btob"}
  ];

  platforms.forEach(p=>{
    const b=document.createElement("button");
    b.className="btn-platform";
    b.textContent=p.l;
    b.onclick=()=>selected={b:b,k:p.k};
    left.appendChild(b);
  });

  targets.forEach(t=>{
    const b=document.createElement("button");
    b.className="btn-target";
    b.textContent=t.l;
    b.onclick=()=>{
      if(selected && selected.k===t.k){
        draw(svg,selected.b,b);
        done++;
        selected=null;
        if(done===3) finish();
      }
    };
    right.appendChild(b);
  });

  miniGame.appendChild(left);
  miniGame.appendChild(right);
}

function draw(svg,a,b){
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
   FIN
===================================================== */
function finish(){
  hideMiniGame();
  const f=document.createElement("div");
  f.id="fadeScreen";
  const b=document.createElement("div");
  b.className="loaderBox";
  b.textContent="Bravo, tu as terminé cette quête";
  f.appendChild(b);
  document.body.appendChild(f);

  setTimeout(()=>{
    sessionStorage.setItem("unlock_pirate5","true");
    window.location.href="menu.html";
  },2500);
}

});
