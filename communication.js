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

function clickableInfoBox(title, text, onClick){
  const box=document.createElement("div");
  box.className="infoBox";
  box.innerHTML=`<strong>${title}</strong><br><br>${text}`;
  box.onclick=onClick;
  miniGame.appendChild(box);
}

/* =====================================================
   🔔 NOTIFICATION CLIQUABLE
===================================================== */
function notification(text, onClick){
  const wrap=document.createElement("div");
  wrap.className="notification success";
  wrap.innerHTML=`
    <div class="notifHint">Clique sur la notification pour continuer</div>
    <div><strong>${text}</strong></div>
  `;
  wrap.onclick=()=>{
    wrap.remove();
    onClick && onClick();
  };
  document.body.appendChild(wrap);
}

/* =====================================================
   DÉBUT
===================================================== */
pirate3.onclick=()=>{
  playDialog([
    {speaker:"pirate3",text:"Capitaine, ton trésor est prêt."},
    {speaker:"pirate2",text:"Mais sans communication, personne ne viendra."},
    {speaker:"pirate3",text:"Voyons comment attirer le marché."}
  ],startMiniGame1);
};

/* =====================================================
   MINI-JEU 1 – COMMUNICATION
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
  }
];

let qi=0, sel=[];

function startMiniGame1(){
  qi=0;
  question();
}

function question(){
  showMiniGame();
  sel=[];
  const s=quiz[qi];
  addTitle(s.t);
  addText(s.q);
  addText(`<div class="twoAnswers">2 bonnes réponses</div>`);

  const wrap=document.createElement("div");
  wrap.style.display="flex";
  wrap.style.flexDirection="column";
  wrap.style.gap="12px";

  s.o.forEach((txt,i)=>{
    const b=document.createElement("button");
    b.textContent=txt;
    b.onclick=()=>{
      if(!sel.includes(i)) sel.push(i);
      if(check(s)){
        notification(s.txt,()=>{
          qi++;
          qi<quiz.length ? question() : afterMiniGame1();
        });
      }
    };
    wrap.appendChild(b);
  });

  miniGame.appendChild(wrap);
}

function check(s){
  return s.g.every(i=>sel.includes(i)) && sel.every(i=>s.g.includes(i));
}

function afterMiniGame1(){
  hideMiniGame();
  playDialog([
    {speaker:"pirate2",text:"Bien joué."},
    {speaker:"pirate3",text:"Créons ton identité visuelle."}
  ],startMiniGame2);
}

/* =====================================================
   MINI-JEU 2 – IDENTITÉ VISUELLE
===================================================== */
function startMiniGame2(){
  showMiniGame();
  addTitle("🎨 L’identité visuelle");

  const btn=document.createElement("button");
  btn.textContent="Voici les points importants à décider";

  const bubble=document.createElement("div");
  bubble.className="infoBox";
  bubble.style.display="none";
  bubble.innerHTML=`
    À qui tu parles : enfants, ados, adultes<br>
    Ce que tu veux dire : ton idée principale<br>
    Ce que tu veux faire ressentir : joie, confiance, énergie, calme<br>
    Ton style : fun, sérieux, moderne ou créatif
  `;

  btn.onclick=()=>{
    bubble.style.display=bubble.style.display==="none"?"block":"none";
  };

  miniGame.appendChild(btn);
  miniGame.appendChild(bubble);

  clickableInfoBox(
    "Clique ici pour continuer",
    "Si tu sais répondre à ces questions, ton identité visuelle sera plus claire.",
    startLogo
  );
}

/* =====================================================
   LOGO / COULEURS / TYPO
===================================================== */
function imageGroup(list, cb){
  const wrap=document.createElement("div");
  wrap.className="visualChoices";

  list.forEach(src=>{
    const box=document.createElement("div");
    const img=document.createElement("img");
    img.src=src;
    img.onclick=()=>cb();

    const zoom=document.createElement("button");
    zoom.textContent="🔎";
    zoom.onclick=e=>{
      e.stopPropagation();
      zoomImg(src);
    };

    box.appendChild(img);
    box.appendChild(zoom);
    wrap.appendChild(box);
  });

  miniGame.appendChild(wrap);
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
  imageGroup(["images/Logo1.PNG","images/Logo2.PNG","images/Logo3.PNG"],startColors);
}

function startColors(){
  showMiniGame();
  addTitle("Choisis les couleurs");
  imageGroup(["images/Couleur1.PNG","images/Couleur2.PNG","images/Couleur3.PNG"],startTypo);
}

function startTypo(){
  showMiniGame();
  addTitle("Choisis la typographie");
  imageGroup(["images/Typo1.PNG","images/Typo2.PNG","images/Typo3.PNG"],showIdentity);
}

/* =====================================================
   IDENTITÉ VISUELLE FINALE
===================================================== */
function showIdentity(){
  hideMiniGame();
  const f=document.createElement("div");
  f.id="fadeScreen";

  const b=document.createElement("div");
  b.className="loaderBox";
  b.innerHTML="<strong>L’identité visuelle est prête</strong>";

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
    {speaker:"pirate3",text:"Choisissons les bons canaux."}
  ],startMiniGame3);
}

/* =====================================================
   MINI-JEU 3 – CANAUX
===================================================== */
function startMiniGame3(){
  showMiniGame();
  addTitle("Associe les bons canaux");

  const left=document.createElement("div");
  const right=document.createElement("div");
  left.className="leftCol";
  right.className="rightCol";

  const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.style.position="absolute";
  svg.style.inset="0";
  svg.style.pointerEvents="none";
  miniGame.appendChild(svg);

  let sel=null, ok=0;

  [
    ["Instagram & Tik Tok","know"],
    ["Site de vente en ligne","btoc"],
    ["Facebook & LinkedIn","btob"]
  ].forEach(p=>{
    const b=document.createElement("button");
    b.className="btn-platform";
    b.textContent=p[0];
    b.onclick=()=>sel={b:b,k:p[1]};
    left.appendChild(b);
  });

  [
    ["Se faire connaître","know"],
    ["Vendre en BtoC","btoc"],
    ["Vendre en BtoB","btob"]
  ].forEach(t=>{
    const b=document.createElement("button");
    b.className="btn-target";
    b.textContent=t[0];
    b.onclick=()=>{
      if(sel && sel.k===t[1]){
        drawLine(svg,sel.b,b);
        ok++;
        if(ok===3) finish();
      }
    };
    right.appendChild(b);
  });

  miniGame.appendChild(left);
  miniGame.appendChild(right);
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
   FIN – GEMS DERRIÈRE TEXTE
===================================================== */
function finish(){
  hideMiniGame();
  const f=document.createElement("div");
  f.id="fadeScreen";

  for(let i=0;i<50;i++){
    const g=document.createElement("div");
    g.className="gem";
    g.style.background=`hsl(${Math.random()*360},80%,60%)`;
    g.style.left="50%";
    g.style.top="50%";
    g.style.transform=`translate(${Math.random()*400-200}px,${Math.random()*400-200}px)`;
    f.appendChild(g);
  }

  const b=document.createElement("div");
  b.className="loaderBox";
  b.textContent="Bravo tu as gagné cette quête";

  f.appendChild(b);
  document.body.appendChild(f);

  setTimeout(()=>{
    sessionStorage.setItem("unlock_pirate5","true");
    location.href="menu.html";
  },2600);
}

});
