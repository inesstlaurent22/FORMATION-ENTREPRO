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

function addText(t, bold=false){
  const p=document.createElement("p");
  p.innerHTML=bold?`<strong>${t}</strong>`:t;
  miniGame.appendChild(p);
}

function infoBubble(html){
  const d=document.createElement("div");
  d.className="info-bubble hidden";
  d.innerHTML=html;
  return d;
}

/* =====================================================
   DÉBUT
===================================================== */
pirate3.onclick=()=>{
  playDialog([
    {speaker:"pirate3",text:"Capitaine, ton trésor est prêt."},
    {speaker:"pirate2",text:"Mais sans communication, personne ne viendra."},
    {speaker:"pirate3",text:"Commençons par ton identité visuelle."}
  ],startMiniGame2);
};

/* =====================================================
   MINI-JEU 2 – IDENTITÉ VISUELLE
===================================================== */
function startMiniGame2(){
  showMiniGame();

  addTitle("L’identité visuelle : Avant de commencer");
  addText(
    "Avant de faire un logo, de choisir des couleurs ou une écriture, il faut d’abord savoir ce que tu veux montrer.",
    true
  );

  const btn=document.createElement("button");
  btn.textContent="Voici les points importants à décider";
  btn.style.margin="20px auto";

  const bubble=infoBubble(`
    • À qui tu parles<br>
    • Ton message principal<br>
    • L’émotion à transmettre<br>
    • Ton style visuel
  `);

  btn.onclick=e=>{
    e.stopPropagation();
    bubble.classList.toggle("hidden");
  };

  miniGame.append(btn,bubble);

  addText(
    "👉 Si tu sais répondre à ces questions, ton identité visuelle sera plus simple, rapide à créer et facile à reconnaître."
  );

  miniGame.onclick=()=>startLogo();
}

/* =====================================================
   IMAGES + LOADER
===================================================== */
function imageGroup(list,cb){
  const loader=document.createElement("div");
  loader.textContent="⏳";
  loader.style.fontSize="32px";
  miniGame.appendChild(loader);

  let loaded=0;
  const wrap=document.createElement("div");
  wrap.className="visualChoices";

  list.forEach(src=>{
    const box=document.createElement("div");
    const img=new Image();
    img.src=src;
    img.onload=()=>{
      loaded++;
      if(loaded===list.length){
        loader.remove();
        miniGame.appendChild(wrap);
      }
    };
    img.onclick=()=>cb();

    const z=document.createElement("button");
    z.textContent="🔎";
    z.onclick=e=>{
      e.stopPropagation();
      zoom(src);
    };

    box.append(img,z);
    wrap.appendChild(box);
  });
}

function zoom(src){
  const f=document.createElement("div");
  f.id="fadeScreen";
  const b=document.createElement("div");
  b.className="loaderBox";
  const img=document.createElement("img");
  img.src=src;
  img.style.width="300px";
  b.appendChild(img);
  f.appendChild(b);
  document.body.appendChild(f);
  f.onclick=()=>f.remove();
}

/* =====================================================
   LOGO
===================================================== */
function startLogo(){
  showMiniGame();
  addTitle("Ton logo");
  addText("Le choix est libre",true);

  imageGroup(
    ["images/Logo1.PNG","images/Logo2.PNG","images/Logo3.PNG"],
    logoExplanation
  );
}

function logoExplanation(){
  showMiniGame();
  addTitle("Logo – Explication");
  addText("Le logo, c’est le dessin principal qui permet de reconnaître ton projet.",true);

  const btn=document.createElement("button");
  btn.textContent="À retenir";

  const bubble=infoBubble(`
    • Un logo doit être simple<br>
    • Reconnaissable rapidement<br>
    • Fonctionne petit et grand<br>
    • Pas trop chargé
  `);

  btn.onclick=e=>{
    e.stopPropagation();
    bubble.classList.toggle("hidden");
  };

  miniGame.append(btn,bubble);
  addText("👉 Astuce : si tu peux dessiner ton logo en 5 secondes, c’est validé.");

  miniGame.onclick=()=>startColors();
}

/* =====================================================
   COULEURS
===================================================== */
function startColors(){
  showMiniGame();
  addTitle("Les couleurs");
  addText("Les couleurs doivent être en cohérence avec le logo de la marque",true);

  imageGroup(
    ["images/Couleur1.PNG","images/Couleur2.PNG","images/Couleur3.PNG"],
    colorsExplanation
  );
}

function colorsExplanation(){
  showMiniGame();
  addTitle("Les couleurs – Explication");
  addText("Les couleurs servent à montrer une émotion.",true);

  const btn=document.createElement("button");
  btn.textContent="À retenir";

  const bubble=infoBubble(`
    • 2 à 4 couleurs maximum<br>
    • Une couleur principale<br>
    • Une ou deux couleurs complémentaires<br>
    • Une bonne harmonie
  `);

  btn.onclick=e=>{
    e.stopPropagation();
    bubble.classList.toggle("hidden");
  };

  miniGame.append(btn,bubble);
  addText("👉 Trop de couleurs = confusion. Peu = impact.");

  miniGame.onclick=()=>startTypo();
}

/* =====================================================
   TYPOGRAPHIE
===================================================== */
function startTypo(){
  showMiniGame();
  addTitle("La typographie");
  addText(
    "La typographie doit rester en cohérence avec l’univers de ta marque",
    true
  );

  imageGroup(
    ["images/Typo1.PNG","images/Typo2.PNG","images/Typo3.PNG"],
    typoExplanation
  );
}

function typoExplanation(){
  showMiniGame();
  addTitle("La typographie – Explication");
  addText("La typographie, c’est la forme des lettres que tu utilises.",true);

  const btn=document.createElement("button");
  btn.textContent="À retenir";

  const bubble=infoBubble(`
    • Facile à lire<br>
    • Correspond au style<br>
    • 1 ou 2 écritures max<br>
    • Toujours les mêmes
  `);

  btn.onclick=e=>{
    e.stopPropagation();
    bubble.classList.toggle("hidden");
  };

  miniGame.append(btn,bubble);

  const validate=document.createElement("button");
  validate.textContent="Valider l’identité visuelle";
  validate.style.marginTop="20px";
  validate.onclick=showIdentity;

  miniGame.append(validate);
}

/* =====================================================
   IDENTITÉ VISUELLE
===================================================== */
function showIdentity(){
  hideMiniGame();

  const f=document.createElement("div");
  f.id="fadeScreen";
  const b=document.createElement("div");
  b.className="loaderBox";
  b.innerHTML="<strong>Bravo tu as gagné ton identité visuelle</strong><br>";

  const img=document.createElement("img");
  img.src="images/Identiteevisuelle.PNG";
  img.style.width="260px";
  b.appendChild(img);

  f.appendChild(b);
  document.body.appendChild(f);

  f.onclick=()=>{
    f.remove();
    afterMiniGame2();
  };
}

/* =====================================================
   MINI-JEU 3
===================================================== */
function startMiniGame3(){
  showMiniGame();
  addTitle("Choisis les bons canaux de communication");

  const left=document.createElement("div");
  left.className="leftCol";
  const right=document.createElement("div");
  right.className="rightCol";

  const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.style.position="absolute";
  svg.style.inset="0";
  svg.style.pointerEvents="none";
  miniGame.appendChild(svg);

  let selected=null, count=0;

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
    b.onclick=()=>selected={b,k:p[1]};
    left.appendChild(b);
  });

  targets.forEach(t=>{
    const b=document.createElement("button");
    b.className="btn-target";
    b.textContent=t[0];
    b.onclick=()=>{
      if(selected && selected.k===t[1]){
        drawLine(svg,selected.b,b);
        count++;
        if(count===3) finish();
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
   FIN
===================================================== */
function finish(){
  hideMiniGame();

  const f=document.createElement("div");
  f.id="fadeScreen";
  const b=document.createElement("div");
  b.className="loaderBox";
  b.textContent="Bravo tu as gagné cette quête";
  f.appendChild(b);

  for(let i=0;i<40;i++){
    const g=document.createElement("div");
    g.className="gem";
    g.style.background=`hsl(${Math.random()*360},80%,60%)`;
    g.style.setProperty("--x",`${Math.random()*300-150}px`);
    g.style.setProperty("--y",`${Math.random()*300-150}px`);
    f.appendChild(g);
  }

  document.body.appendChild(f);
  setTimeout(()=>location.href="menu.html",2800);
}

function afterMiniGame2(){
  playDialog([
    {speaker:"pirate2",text:"Ton identité est prête."},
    {speaker:"pirate3",text:"Diffusons-la correctement."}
  ],startMiniGame3);
}

});
