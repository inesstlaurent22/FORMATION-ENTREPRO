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

function addText(t,bold=false){
  const p=document.createElement("p");
  p.innerHTML=bold?`<strong>${t}</strong>`:t;
  miniGame.appendChild(p);
}

function infoBubble(html){
  const b=document.createElement("div");
  b.className="info-bubble hidden";
  b.innerHTML=html;
  return b;
}

/* =====================================================
   🔔 NOTIFICATIONS MINI JEU 1
===================================================== */
function successNotif(text, next){
  const n=document.createElement("div");
  n.className="notification success";
  n.innerHTML=`
    <div class="glow-text">Clique sur la notification pour continuer</div>
    <div><strong>${text}</strong></div>
  `;
  n.onclick=()=>{
    n.remove();
    next();
  };
  document.body.appendChild(n);
}

function errorNotif(){
  document.body.classList.add("shake");
  const n=document.createElement("div");
  n.className="notification error";
  n.textContent="Tu t’es trompé 💥";
  document.body.appendChild(n);
  setTimeout(()=>{
    n.remove();
    document.body.classList.remove("shake");
  },1200);
}

/* =====================================================
   DÉBUT
===================================================== */
pirate3.onclick=()=>{
  playDialog([
    {speaker:"pirate3",text:"Capitaine, ton trésor est prêt."},
    {speaker:"pirate2",text:"Mais sans communication, personne ne viendra."},
    {speaker:"pirate3",text:"Commençons par attirer l’attention."}
  ],startMiniGame1);
};

/* =====================================================
   MINI-JEU 1 — COMMUNICATION
===================================================== */
const quiz=[
  {t:"Visite physique",q:"Rencontrer un client permet de :",o:["Rassurer","Créer une connexion","Ignorer"],g:[0,1],txt:"La relation humaine crée la confiance."},
  {t:"Phoning / Mailing",q:"Le contact direct sert à :",o:["Comprendre","Créer une relation","Parler prix"],g:[0,1],txt:"Le dialogue est essentiel."},
  {t:"Réseaux sociaux",q:"Ils servent surtout à :",o:["Se faire connaître","Montrer son univers","Vendre"],g:[0,1],txt:"Ils développent la visibilité."},
  {t:"Newsletter",q:"Elle permet de :",o:["Rester présent","Créer un lien","Spammer"],g:[0,1],txt:"Elle entretient la relation."}
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
  addText("<span class='glow-red'>2 bonnes réponses</span>");

  s.o.forEach((txt,i)=>{
    const b=document.createElement("button");
    b.style.display="block";
    b.style.margin="10px auto";
    b.textContent=txt;
    b.onclick=()=>{
      if(!sel.includes(i)) sel.push(i);
      if(check(s)){
        successNotif(s.txt,()=>{
          qi++;
          qi<quiz.length ? showQuestion() : afterMiniGame1();
        });
      }else if(sel.length>=2){
        errorNotif();
        sel=[];
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
    {speaker:"pirate3",text:"Passons à ton identité visuelle."}
  ],startMiniGame2);
}

/* =====================================================
   MINI-JEU 2 — IDENTITÉ VISUELLE
===================================================== */
function startMiniGame2(){
  showMiniGame();

  addTitle("L’identité visuelle : Avant de commencer");
  addText("Avant de créer un logo, des couleurs ou une typographie, il faut savoir ce que tu veux montrer.",true);

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
  addText("👉 Si tu sais répondre à ces questions, ton identité visuelle sera plus simple et plus forte.");

  miniGame.onclick=startLogo;
}

/* === IMAGE GROUP AVEC LOADER === */
function imageGroup(list,cb){
  miniGame.innerHTML+="<div class='loader'>⏳</div>";
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
        miniGame.querySelector(".loader").remove();
        miniGame.appendChild(wrap);
      }
    };
    img.onclick=cb;

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
  img.style.width="320px";
  b.appendChild(img);
  f.appendChild(b);
  document.body.appendChild(f);
  f.onclick=()=>f.remove();
}

/* LOGO */
function startLogo(){
  showMiniGame();
  addTitle("Ton logo");
  addText("Le choix est libre",true);
  imageGroup(["images/Logo1.PNG","images/Logo2.PNG","images/Logo3.PNG"],logoExplanation);
}

function logoExplanation(){
  showMiniGame();
  addTitle("Logo – Explication");
  addText("Le logo permet de reconnaître ton projet.",true);

  const b=document.createElement("button");
  b.textContent="À retenir";
  const bubble=infoBubble(`
    • Simple<br>
    • Reconnaissable<br>
    • Lisible petit/grand<br>
    • Pas chargé
  `);
  b.onclick=e=>{e.stopPropagation();bubble.classList.toggle("hidden");};

  miniGame.append(b,bubble);
  addText("👉 Si tu peux le dessiner en 5 secondes, c’est validé.");
  miniGame.onclick=startColors;
}

/* COULEURS */
function startColors(){
  showMiniGame();
  addTitle("Les couleurs");
  addText("Les couleurs doivent être en cohérence avec le logo.",true);
  imageGroup(["images/Couleur1.PNG","images/Couleur2.PNG","images/Couleur3.PNG"],colorsExplanation);
}

function colorsExplanation(){
  showMiniGame();
  addTitle("Couleurs – Explication");
  addText("Les couleurs transmettent une émotion.",true);

  const b=document.createElement("button");
  b.textContent="À retenir";
  const bubble=infoBubble(`
    • 2 à 4 couleurs max<br>
    • Une principale<br>
    • Harmonies cohérentes
  `);
  b.onclick=e=>{e.stopPropagation();bubble.classList.toggle("hidden");};

  miniGame.append(b,bubble);
  addText("👉 Trop de couleurs brouillent le message.");
  miniGame.onclick=startTypo;
}

/* TYPOGRAPHIE */
function startTypo(){
  showMiniGame();
  addTitle("La typographie");
  addText("Elle doit rester cohérente avec l’univers de la marque.",true);
  imageGroup(["images/Typo1.PNG","images/Typo2.PNG","images/Typo3.PNG"],typoExplanation);
}

function typoExplanation(){
  showMiniGame();
  addTitle("Typographie – Explication");
  addText("La forme des lettres influence la perception.",true);

  const b=document.createElement("button");
  b.textContent="À retenir";
  const bubble=infoBubble(`
    • Facile à lire<br>
    • 1 ou 2 écritures max<br>
    • La même partout
  `);
  b.onclick=e=>{e.stopPropagation();bubble.classList.toggle("hidden");};

  miniGame.append(b,bubble);
  addText("👉 Une bonne typo rend ton projet crédible.");
  miniGame.onclick=showIdentity;
}

/* IDENTITÉ VISUELLE */
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
   DIALOGUES RÉSEAUX
===================================================== */
function afterMiniGame2(){
  playDialog([
    {speaker:"pirate2",text:"Ton identité est prête."},
    {speaker:"pirate3",text:"Relions-la aux bons canaux."}
  ],startMiniGame3);
}

/* =====================================================
   MINI-JEU 3 — LIAISONS
===================================================== */
function startMiniGame3(){
  showMiniGame();
  addTitle("Relie chaque plateforme à son objectif");

  const left=document.createElement("div");
  left.className="leftCol";
  const right=document.createElement("div");
  right.className="rightCol";

  const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.style.position="absolute";
  svg.style.inset="0";
  svg.style.pointerEvents="none";
  miniGame.appendChild(svg);

  let selected=null, solved=0;

  const map={
    know:"know",
    btoc:"btoc",
    btob:"btob"
  };

  [["Instagram & TikTok","know"],["Site de vente en ligne","btoc"],["Facebook & LinkedIn","btob"]]
  .forEach(p=>{
    const b=document.createElement("button");
    b.className="btn-platform";
    b.textContent=p[0];
    b.dataset.key=p[1];
    b.onclick=()=>selected=b;
    left.appendChild(b);
  });

  [["Se faire connaître","know"],["Vendre en BtoC","btoc"],["Vendre en BtoB","btob"]]
  .forEach(t=>{
    const b=document.createElement("button");
    b.className="btn-target";
    b.textContent=t[0];
    b.dataset.key=t[1];
    b.onclick=()=>{
      if(selected && selected.dataset.key===b.dataset.key){
        drawLine(svg,selected,b);
        selected.remove();
        b.remove();
        selected=null;
        solved++;
        if(solved===3) finish();
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

});
