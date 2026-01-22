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
   VIDÉO INTRO
===================================================== */
introVideo.muted = true;
introVideo.play().catch(()=>{});

toggleSound.onclick = e => {
  e.stopPropagation();
  introVideo.muted = !introVideo.muted;
};

closeVideo.onclick = e => {
  e.stopPropagation();
  endVideo();
};

introVideo.onended = endVideo;

function endVideo(){
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

function addTitle(t){
  const h=document.createElement("h3");
  h.textContent=t;
  miniGame.appendChild(h);
}

function addText(t,bold=false){
  const p=document.createElement("p");
  p.innerHTML=bold?`<strong>${t}</strong>`:t;
  miniGame.appendChild(p);
}

function infoBubble(text){
  const b=document.createElement("div");
  b.className="info-bubble";
  b.innerHTML=text;
  return b;
}

/* =====================================================
   DÉMARRAGE
===================================================== */
pirate3.onclick=()=>{
  playDialog([
    {speaker:"pirate3",text:"Capitaine, ton trésor est prêt."},
    {speaker:"pirate2",text:"Mais sans communication, personne ne viendra."},
    {speaker:"pirate3",text:"Commençons par comprendre comment communiquer."}
  ],startMiniGame1);
};

/* =====================================================
   MINI-JEU 1
===================================================== */
const quiz=[
  {
    t:"⚓ Visite physique",
    q:"Rencontrer un client permet de :",
    o:["Rassurer","Créer une connexion","Ignorer ses attentes"],
    g:[0,1],
    txt:"La visite physique renforce la confiance."
  },
  {
    t:"📣 Réseaux sociaux",
    q:"Ils servent surtout à :",
    o:["Se faire connaître","Montrer son univers","Vendre immédiatement"],
    g:[0,1],
    txt:"Les réseaux sociaux servent à la visibilité."
  }
];

let qi=0,selected=[];

function startMiniGame1(){
  qi=0;
  showQuestion();
}

function showQuestion(){
  showMiniGame();
  selected=[];
  const s=quiz[qi];

  addTitle(s.t);
  addText(s.q);
  addText("<span class='glow-red'>2 choix possibles</span>");

  s.o.forEach((txt,i)=>{
    const b=document.createElement("button");
    b.style.display="block";
    b.style.margin="10px auto";
    b.textContent=txt;
    b.onclick=()=>{
      if(!selected.includes(i)) selected.push(i);
      if(check(s)){
        qi++;
        qi<quiz.length?showQuestion():afterMiniGame1();
      }else if(selected.length>=2){
        selected=[];
      }
    };
    miniGame.appendChild(b);
  });
}

function check(s){
  return s.g.every(i=>selected.includes(i)) &&
         selected.every(i=>s.g.includes(i));
}

function afterMiniGame1(){
  hideMiniGame();
  playDialog([
    {speaker:"pirate2",text:"Bien joué."},
    {speaker:"pirate3",text:"Passons à ton identité visuelle."}
  ],startIdentityIntro);
}

/* =====================================================
   MINI-JEU 2 — IDENTITÉ VISUELLE
===================================================== */
function startIdentityIntro(){
  showMiniGame();
  addTitle("L’identité visuelle");
  addText("Avant de créer, il faut savoir ce que tu veux montrer.",true);
  miniGame.onclick=startLogo;
}

/* === LOGO === */
function startLogo(){
  showMiniGame();
  addTitle("Ton logo");
  addText("Choisis un logo",true);

  ["Logo1","Logo2","Logo3"].forEach(()=>{
    const b=document.createElement("button");
    b.textContent="Logo";
    b.onclick=logoExplanation;
    miniGame.appendChild(b);
  });
}

function logoExplanation(){
  showMiniGame();
  addTitle("Logo – Explication");
  miniGame.appendChild(infoBubble(`
    Le logo permet de reconnaître ton projet.<br><br>
    • Simple<br>
    • Rapide à reconnaître<br>
    • Lisible partout
  `));
  miniGame.onclick=startColors;
}

/* === COULEURS === */
function startColors(){
  showMiniGame();
  addTitle("Les couleurs");
  addText("Choisis des couleurs",true);

  ["Couleur 1","Couleur 2","Couleur 3"].forEach(()=>{
    const b=document.createElement("button");
    b.textContent="Couleur";
    b.onclick=colorsExplanation;
    miniGame.appendChild(b);
  });
}

function colorsExplanation(){
  showMiniGame();
  addTitle("Couleurs – Explication");
  miniGame.appendChild(infoBubble(`
    Les couleurs transmettent une émotion.<br><br>
    • 2 à 4 max<br>
    • Harmonie<br>
    • Cohérence avec le logo
  `));
  miniGame.onclick=startTypo;
}

/* === TYPO === */
function startTypo(){
  showMiniGame();
  addTitle("La typographie");
  addText("Choisis une typographie",true);

  ["Typo 1","Typo 2","Typo 3"].forEach(()=>{
    const b=document.createElement("button");
    b.textContent="Typo";
    b.onclick=typoExplanation;
    miniGame.appendChild(b);
  });
}

function typoExplanation(){
  showMiniGame();
  addTitle("Typographie – Explication");
  miniGame.appendChild(infoBubble(`
    La typographie donne le ton.<br><br>
    • Lisible<br>
    • 1 ou 2 max<br>
    • Même partout
  `));
  miniGame.onclick=afterMiniGame2;
}

/* =====================================================
   MINI-JEU 3 — RÉSEAUX SOCIAUX
===================================================== */
function startMiniGame3(){
  showMiniGame();
  addTitle("Les réseaux sociaux");

  const left=document.createElement("div");
  left.className="leftCol";
  const right=document.createElement("div");
  right.className="rightCol";

  let selected=null, ok=0;

  const pairs={
    know:"Se faire connaître",
    btob:"Vendre en BtoB",
    btoc:"Vendre en BtoC"
  };

  [
    ["Instagram & TikTok","know"],
    ["Facebook & LinkedIn","btob"],
    ["Site de vente en ligne","btoc"]
  ].forEach(p=>{
    const b=document.createElement("button");
    b.className="btn-platform";
    b.textContent=p[0];
    b.onclick=()=>selected={btn:b,key:p[1]};
    left.appendChild(b);
  });

  Object.entries(pairs).forEach(([k,v])=>{
    const b=document.createElement("button");
    b.className="btn-target";
    b.textContent=v;
    b.onclick=()=>{
      if(selected && selected.key===k){
        selected.btn.remove();
        b.remove();
        selected=null;
        ok++;
        if(ok===3) finish();
      }
    };
    right.appendChild(b);
  });

  miniGame.append(left,right);
}

/* =====================================================
   FIN
===================================================== */
function finish(){
  hideMiniGame();
  const f=document.createElement("div");
  f.id="fadeScreen";
  f.innerHTML="<div class='loaderBox'>Bravo, tu as gagné cette quête</div>";
  document.body.appendChild(f);
  setTimeout(()=>location.href="menu.html",2500);
}

});
