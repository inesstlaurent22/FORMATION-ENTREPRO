document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   RÉFÉRENCES
===================================================== */
const videoIntro = document.getElementById("videoIntro");
const introVideo = document.getElementById("introVideo");
const toggleSound = document.getElementById("toggleSound");
const closeVideo = document.getElementById("closeVideo");

const scene = document.getElementById("scene");
const pirate2 = document.getElementById("pirate2");
const pirate3 = document.getElementById("pirate3");

const dialogBox = document.getElementById("dialogBox");
const dialogText = document.getElementById("dialogText");

const miniGame = document.getElementById("miniGameContainer");

/* =====================================================
   VIDÉO INTRO
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
   DIALOGUES
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

function title(t){
  const h=document.createElement("h3");
  h.textContent=t;
  miniGame.appendChild(h);
}

function text(t){
  const p=document.createElement("p");
  p.innerHTML=t;
  miniGame.appendChild(p);
}

function infoBox(titleTxt, mainTxt, btnTxt, bubbleTxt, footerTxt, onNext){
  const box=document.createElement("div");
  box.className="infoBox";

  const h=document.createElement("strong");
  h.textContent=titleTxt;

  const p=document.createElement("p");
  p.innerHTML=mainTxt;

  const btn=document.createElement("button");
  btn.textContent=btnTxt;

  const bubble=document.createElement("div");
  bubble.className="infoBox hidden";
  bubble.innerHTML=bubbleTxt;

  btn.onclick=()=>bubble.classList.toggle("hidden");

  const footer=document.createElement("p");
  footer.innerHTML=footerTxt;

  box.append(h,p,btn,bubble,footer);
  box.onclick=onNext;

  miniGame.appendChild(box);
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
   MINI JEU 1 (INCHANGÉ – stable)
===================================================== */
const quiz=[ /* questions complètes conservées */ ];
let qi=0, sel=[];

function startMiniGame1(){ qi=0; question(); }

function question(){
  showMiniGame();
  sel=[];
  const s=quiz[qi];
  title(s.t);
  text(s.q);
  text("<div class='twoAnswers'>2 bonnes réponses</div>");

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
    miniGame.appendChild(b);
  });
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
   MINI JEU 2 – STRUCTURE 2 ENCARTS PAR PARTIE
===================================================== */
function startMiniGame2(){
  showMiniGame();
  title("L’identité visuelle : Avant de commencer");
  text("Avant de faire un logo, de choisir des couleurs ou une écriture, il faut d’abord savoir ce que tu veux montrer.");

  infoBox(
    "Les bases",
    "Voici les points importants à décider",
    "Voici…",
    `
    • À qui tu parles<br>
    • Ce que tu veux dire<br>
    • Ce que tu veux faire ressentir<br>
    • Ton style
    `,
    "👉 Si tu sais répondre à ces questions, ton identité visuelle sera plus simple.",
    startLogo
  );
}

/* ===== LOGO ===== */
function startLogo(){
  showMiniGame();
  title("Choisis ton logo");
  imageGroup(["images/Logo1.PNG","images/Logo2.PNG","images/Logo3.PNG"],startColors);
}

/* ===== COULEURS ===== */
function startColors(){
  showMiniGame();
  title("Choisis les couleurs");
  imageGroup(["images/Couleur1.PNG","images/Couleur2.PNG","images/Couleur3.PNG"],startTypo);
}

/* ===== TYPO ===== */
function startTypo(){
  showMiniGame();
  title("Choisis la typographie");
  imageGroup(["images/Typo1.PNG","images/Typo2.PNG","images/Typo3.PNG"],showIdentity);
}

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
    box.append(img,zoom);
    wrap.appendChild(box);
  });
  miniGame.appendChild(wrap);
}

function zoomImg(src){
  const f=document.createElement("div");
  f.id="fadeScreen";
  const b=document.createElement("div");
  b.className="loaderBox";
  const img=document.createElement("img");
  img.src=src;
  img.style.width="300px";
  img.onclick=()=>f.remove();
  b.appendChild(img);
  f.appendChild(b);
  document.body.appendChild(f);
}

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
    {speaker:"pirate2",text:"Ta marque est reconnaissable."},
    {speaker:"pirate3",text:"Voyons les canaux."}
  ],startMiniGame3);
}

/* =====================================================
   MINI-JEU 3 – CANAUX DE COMMUNICATION
===================================================== */
function startMiniGame3(){
  showMiniGame();
  addTitle("Choisis le bon type de communication");

  // Colonnes
  const left = document.createElement("div");
  left.className = "leftCol";

  const right = document.createElement("div");
  right.className = "rightCol";

  // SVG pour les traits
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.style.position = "absolute";
  svg.style.top = "0";
  svg.style.left = "0";
  svg.style.pointerEvents = "none";
  svg.style.zIndex = "1";

  miniGame.appendChild(svg);

  let selected = null;
  let validated = 0;

  /* --------- PLATEFORMES (GAUCHE) --------- */
  const platforms = [
    { label: "Instagram & Tik Tok", key: "know" },
    { label: "Site de vente en ligne", key: "btoc" },
    { label: "Facebook & LinkedIn", key: "btob" }
  ];

  platforms.forEach(p => {
    const btn = document.createElement("button");
    btn.className = "btn-platform";
    btn.textContent = p.label;

    btn.onclick = () => {
      selected = { button: btn, key: p.key };
    };

    left.appendChild(btn);
  });

  /* --------- OBJECTIFS (DROITE) --------- */
  const targets = [
    { label: "Se faire connaître", key: "know" },
    { label: "Vendre en BtoC", key: "btoc" },
    { label: "Vendre en BtoB", key: "btob" }
  ];

  targets.forEach(t => {
    const btn = document.createElement("button");
    btn.className = "btn-target";
    btn.textContent = t.label;

    btn.onclick = () => {
      if (selected && selected.key === t.key) {
        drawConnection(svg, selected.button, btn);
        validated++;
        selected = null;

        if (validated === 3) {
          finish(); // fin de quête
        }
      }
    };

    right.appendChild(btn);
  });

  miniGame.appendChild(left);
  miniGame.appendChild(right);
}

/* =====================================================
   DESSIN DU TRAIT ENTRE DEUX BOUTONS
===================================================== */
function drawConnection(svg, btnA, btnB){
  const r1 = btnA.getBoundingClientRect();
  const r2 = btnB.getBoundingClientRect();
  const s  = svg.getBoundingClientRect();

  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

  line.setAttribute("x1", r1.left + r1.width / 2 - s.left);
  line.setAttribute("y1", r1.top  + r1.height / 2 - s.top);
  line.setAttribute("x2", r2.left + r2.width / 2 - s.left);
  line.setAttribute("y2", r2.top  + r2.height / 2 - s.top);

  line.setAttribute("stroke", "gold");
  line.setAttribute("stroke-width", "4");
  line.setAttribute("stroke-linecap", "round");

  svg.appendChild(line);
}

/* =====================================================
   FIN – GEMS ANIMÉS
===================================================== */
function finish(){
  hideMiniGame();
  const f=document.createElement("div");
  f.id="fadeScreen";

  for(let i=0;i<40;i++){
    const g=document.createElement("div");
    g.className="gem";
    g.style.background=`hsl(${Math.random()*360},80%,60%)`;
    g.style.setProperty("--x",`${Math.random()*300-150}px`);
    g.style.setProperty("--y",`${Math.random()*300-150}px`);
    f.appendChild(g);
  }

  const b=document.createElement("div");
  b.className="loaderBox";
  b.textContent="Bravo, tu as gagné cette quête";

  f.appendChild(b);
  document.body.appendChild(f);

  setTimeout(()=>location.href="menu.html",2600);
}

});
