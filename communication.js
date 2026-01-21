document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   🎬 VIDÉO INTRO – AUTOPLAY
===================================================== */
const videoIntro  = document.getElementById("videoIntro");
const introVideo  = document.getElementById("introVideo");
const toggleSound = document.getElementById("toggleSound");
const closeVideo  = document.getElementById("closeVideo");
const scene       = document.getElementById("scene");

introVideo.muted = true;
introVideo.playsInline = true;
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
const pirate2 = document.getElementById("pirate2");
const pirate3 = document.getElementById("pirate3");
const dialogBox  = document.getElementById("dialogBox");
const dialogText = document.getElementById("dialogText");

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
  const p=d.speaker==="pirate2"?pirate2:pirate3;
  const r=p.getBoundingClientRect();
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
   🧩 HELPERS
===================================================== */
const miniGame = document.getElementById("miniGameContainer");

function showMiniGame(){
  miniGame.innerHTML="";
  miniGame.classList.remove("hidden");
}
function hideMiniGame(){ miniGame.classList.add("hidden"); }

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
function infoBubble(txt){
  const b=document.createElement("div");
  b.className="info-bubble hidden";
  b.innerHTML=txt;
  return b;
}

/* =====================================================
   🖼️ IMAGES + LOADER + 🔎
===================================================== */
function imageGroup(list, onDone){
  const loader=document.createElement("div");
  loader.textContent="⏳";
  loader.style.fontSize="32px";
  loader.style.margin="20px";
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

    const zoom=document.createElement("button");
    zoom.textContent="🔎";
    zoom.onclick=e=>{
      e.stopPropagation();
      showZoom(src);
    };

    img.onclick=()=>onDone();

    box.append(img,zoom);
    wrap.appendChild(box);
  });
}

function showZoom(src){
  const f=document.createElement("div");
  f.id="fadeScreen";
  const b=document.createElement("div");
  b.className="loaderBox";
  const img=document.createElement("img");
  img.src=src;
  img.style.width="320px";
  b.appendChild(img);
  f.appendChild(b);
  document.body.appendChild(f);
  f.onclick=()=>f.remove();
}

/* =====================================================
   ▶ DÉBUT MINI-JEU 2
===================================================== */
pirate3.onclick=()=>{
  playDialog([
    {speaker:"pirate3",text:"Capitaine, ton projet a besoin d’une identité."},
    {speaker:"pirate2",text:"Construisons-la étape par étape."}
  ], startMiniGame2);
};

/* =====================================================
   🎨 MINI-JEU 2 – IDENTITÉ VISUELLE
===================================================== */
function startMiniGame2(){
  showMiniGame();
  identityIntro();
}

/* === 1. INTRO IDENTITÉ === */
function identityIntro(){
  showMiniGame();
  addTitle("L’identité visuelle : Avant de commencer");
  addText("Avant de faire un logo, des couleurs ou une écriture, il faut savoir ce que tu veux montrer.");

  const btn=document.createElement("button");
  btn.textContent="Voici les points importants à décider";
  btn.style.margin="20px 0";

  const bubble=infoBubble(`
    • À qui tu parles : ta cible <br>
    • Ton message principal - en relation avec ton prduit<br>
    • L’émotion à transmettre (la joie, le luxe, le moderne)<br>
    • Ton style visuel (futuriste avant-gardiste, traditionnel)
  `);

  btn.onclick=()=>bubble.classList.toggle("hidden");
  miniGame.append(btn,bubble);

  addText("👉 Si tu réponds à ces questions, ton identité sera plus claire.");

  miniGame.onclick=()=>logoExplanation();
}

/* === 2. TEXTE LOGO === */
function logoExplanation(){
  showMiniGame();
  addTitle("Le logo");
  addText("Le logo permet de reconnaître ton projet.");

const btn=document.createElement("button");
btn.textContent="Voici les points importants à décider";
btn.style.margin="20px 0";

const bubble=document.createElement("div");
bubble.className="info-bubble hidden";
bubble.innerHTML = `
  <ul style="text-align:left; padding-left:18px; line-height:1.6;">
    <li>À qui tu parles</li>
    <li>Ton message principal</li>
    <li>L’émotion à transmettre</li>
    <li>Ton style visuel</li>
  </ul>
`;

btn.onclick = (e) => {
  e.stopPropagation();          // empêche le passage à l’étape suivante
  bubble.classList.toggle("hidden");
};

miniGame.append(btn, bubble);

/* === 3. CHOIX LOGO === */
function logoChoice(){
  showMiniGame();
  addTitle("Choisis ton logo");
  imageGroup(
    ["images/Logo1.PNG","images/Logo2.PNG","images/Logo3.PNG"],
    colorsExplanation
  );
}

/* === 4. TEXTE COULEURS === */
function colorsExplanation(){
  showMiniGame();
  addTitle("Les couleurs");
  addText("Les couleurs transmettent une émotion.");

  const btn=document.createElement("button");
  btn.textContent="À retenir";
  const bubble=infoBubble(`
    • 2 à 4 couleurs max<br>
    • Une principale<br>
    • Harmonies cohérentes
  `);
  btn.onclick=()=>bubble.classList.toggle("hidden");

  miniGame.append(btn,bubble);
  addText("👉 Trop de couleurs = confusion.");

  miniGame.onclick=()=>colorChoice();
}

/* === 5. CHOIX COULEURS === */
function colorChoice(){
  showMiniGame();
  addTitle("Choisis les couleurs");
  imageGroup(
    ["images/Couleur1.PNG","images/Couleur2.PNG","images/Couleur3.PNG"],
    typoExplanation
  );
}

/* === 6. TEXTE TYPO === */
function typoExplanation(){
  showMiniGame();
  addTitle("La typographie");
  addText("La typographie est la forme des lettres.");

  const btn=document.createElement("button");
  btn.textContent="À retenir";
  const bubble=infoBubble(`
    • Facile à lire<br>
    • Cohérente avec ton style<br>
    • 1 ou 2 écritures max
  `);
  btn.onclick=()=>bubble.classList.toggle("hidden");

  miniGame.append(btn,bubble);
  addText("👉 Une bonne typo rend ton projet crédible.");

  miniGame.onclick=()=>typoChoice();
}

/* === 7. CHOIX TYPO === */
function typoChoice(){
  showMiniGame();
  addTitle("Choisis la typographie");
  imageGroup(
    ["images/Typo1.PNG","images/Typo2.PNG","images/Typo3.PNG"],
    showFinalIdentity
  );
}

/* === 8. FINAL IDENTITÉ === */
function showFinalIdentity(){
  hideMiniGame();
  const f=document.createElement("div");
  f.id="fadeScreen";
  const b=document.createElement("div");
  b.className="loaderBox";
  b.innerHTML="<strong>L’identité visuelle est prête</strong><br>";
  const img=document.createElement("img");
  img.src="images/Identiteevisuelle.PNG";
  img.style.width="260px";
  b.appendChild(img);
  f.appendChild(b);
  document.body.appendChild(f);

  f.onclick=()=>{
    f.remove();
    playDialog(
      [
        {speaker:"pirate2",text:"Ta marque est prête."},
        {speaker:"pirate3",text:"Passons aux bons canaux."}
      ],
      startMiniGame3
    );
  };
}
   
/* =====================================================
   MINI-JEU 3 – CANAUX
===================================================== */
function startMiniGame3(){
  showMiniGame();
  addTitle("Choisis le bon type de communication");

  const left=document.createElement("div");
  left.className="leftCol";
  const right=document.createElement("div");
  right.className="rightCol";

  const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.style.position="absolute";
  svg.style.inset="0";
  svg.style.pointerEvents="none";
  miniGame.appendChild(svg);

  let selected=null, ok=0;

  [
    ["Instagram & TikTok","know"],
    ["Site de vente en ligne","btoc"],
    ["Facebook & LinkedIn","btob"]
  ].forEach(p=>{
    const b=document.createElement("button");
    b.className="btn-platform";
    b.textContent=p[0];
    b.onclick=()=>selected={b:b,k:p[1]};
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
   FIN + GEMS
===================================================== */
function finish(){
  hideMiniGame();
  const f=document.createElement("div");
  f.id="fadeScreen";
  const b=document.createElement("div");
  b.className="loaderBox";
  b.textContent="Bravo, tu as gagné cette quête";
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

});
