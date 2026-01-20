document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   🔗 RÉFÉRENCES
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
  p.innerHTML=t;
  miniGame.appendChild(p);
}

/* =====================================================
   🔔 NOTIFICATION CLIQUABLE
===================================================== */
function notification(text, cb){
  const n=document.createElement("div");
  n.className="notification success";
  n.innerHTML=`
    <div class="glow-text">Clique sur la notification pour continuer</div>
    <div style="margin-top:8px;font-size:18px">${text}</div>
  `;
  n.onclick=()=>{
    n.remove();
    cb && cb();
  };
  document.body.appendChild(n);
}

/* =====================================================
   💥 ERREUR
===================================================== */
function errorShake(){
  const f=document.createElement("div");
  f.id="fadeScreen";
  const b=document.createElement("div");
  b.className="loaderBox";
  b.textContent="Tu t’es trompé 💥";
  f.appendChild(b);
  document.body.appendChild(f);

  document.body.classList.add("shake");
  setTimeout(()=>{
    document.body.classList.remove("shake");
    f.remove();
  },900);
}

/* =====================================================
   🚀 DÉPART
===================================================== */
pirate3.onclick=()=>{
  playDialog([
    {speaker:"pirate3",text:"Capitaine, ton trésor est prêt."},
    {speaker:"pirate2",text:"Mais sans communication, personne ne viendra."},
    {speaker:"pirate3",text:"Voyons comment attirer le marché."}
  ],startMiniGame1);
};

/* =====================================================
   🎮 MINI-JEU 1 — COMMUNICATION
===================================================== */
const quiz=[
  {t:"⚓ Visite physique",q:"Rencontrer un client permet de :",o:["Rassurer","Créer une connexion","Ignorer ses attentes"],g:[0,1],txt:"La visite physique crée une relation de confiance."},
  {t:"🕊️ Phoning / Mailing",q:"Le contact direct sert à :",o:["Comprendre les besoins","Créer une relation","Parler uniquement de prix"],g:[0,1],txt:"Le contact humain est essentiel."},
  {t:"📣 Réseaux sociaux",q:"Ils servent surtout à :",o:["Se faire connaître","Montrer son univers","Vendre immédiatement"],g:[0,1],txt:"Les réseaux sociaux créent de la visibilité."},
  {t:"📜 Newsletters",q:"Une newsletter permet de :",o:["Rester présent","Créer un lien","Envoyer du spam"],g:[0,1],txt:"La newsletter entretient la relation."}
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
  addText(`<span class="glow-red">2 bonnes réponses</span>`);

  s.o.forEach((txt,i)=>{
    const b=document.createElement("button");
    b.textContent=txt;
    b.onclick=()=>{
      if(!sel.includes(i)) sel.push(i);
      if(check(s)){
        notification(s.txt,()=>{
          qi++;
          qi<quiz.length?showQuestion():afterMiniGame1();
        });
      }else if(sel.length>=2){
        errorShake();
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
    {speaker:"pirate2",text:"Bien joué."},
    {speaker:"pirate3",text:"Créons ton identité visuelle."}
  ],startMiniGame2);
}

/* =====================================================
   🎨 MINI-JEU 2 — IDENTITÉ VISUELLE (ENCARTS COMPLETS)
===================================================== */
function startMiniGame2(){
  showMiniGame();
  addTitle("L’identité visuelle : Avant de commencer");
  addText("Avant de faire un logo, de choisir des couleurs ou une écriture, il faut d’abord savoir ce que tu veux montrer.");

  const btn=document.createElement("button");
  btn.textContent="Voici les points importants à décider";
  const bubble=document.createElement("div");
  bubble.className="info-bubble hidden";
  bubble.innerHTML=`
  • À qui tu parles : enfants, ados, adultes<br>
  • Ce que tu veux dire : ton idée principale<br>
  • Ce que tu veux faire ressentir : joie, confiance, énergie, calme<br>
  • Ton style : fun, sérieux, moderne ou créatif
  `;
  btn.onclick=()=>bubble.classList.toggle("hidden");

  miniGame.append(btn,bubble);
  addText("👉 Si tu sais répondre à ces questions, ton identité visuelle sera plus simple, rapide à créer et facile à reconnaître.");

  miniGame.onclick=()=>startLogo();
}

/* === GROUP IMAGES AVEC LOADER === */
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
        miniGame.querySelector(".loader")?.remove();
        miniGame.appendChild(wrap);
      }
    };
    img.onclick=()=>cb();
    const z=document.createElement("button");
    z.textContent="🔎";
    z.onclick=e=>{e.stopPropagation();zoom(src);};
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
  img.onclick=()=>f.remove();
  b.appendChild(img);
  f.appendChild(b);
  document.body.appendChild(f);
}

/* LOGO */
function startLogo(){
  showMiniGame();
  addTitle("Ton logo");
  addText("Le choix est libre");
  imageGroup(["images/Logo1.PNG","images/Logo2.PNG","images/Logo3.PNG"],afterLogo);
}

function afterLogo(){
  showMiniGame();
  addTitle("Logo - Explication");
  addText("Le logo, c’est le dessin principal qui permet de reconnaître ton projet.");
  const b=document.createElement("button");
  b.textContent="À retenir";
  const bubble=document.createElement("div");
  bubble.className="info-bubble hidden";
  bubble.innerHTML=`
  • Simple<br>• Reconnaissable<br>• Lisible petit/grand<br>• Pas chargé
  `;
  b.onclick=()=>bubble.classList.toggle("hidden");
  miniGame.append(b,bubble);
  addText("👉 Astuce : si tu peux dessiner ton logo en 5 secondes, c’est validé.");
  miniGame.onclick=()=>startColors();
}

/* COULEURS */
function startColors(){
  showMiniGame();
  addTitle("Les couleurs");
  addText("Indice : les couleurs doivent être en cohérence avec ton logo");
  imageGroup(["images/Couleur1.PNG","images/Couleur2.PNG","images/Couleur3.PNG"],afterColors);
}

function afterColors(){
  showMiniGame();
  addTitle("Les couleurs - Explication");
  addText("Les couleurs servent à montrer une émotion.");
  const b=document.createElement("button");
  b.textContent="À retenir";
  const bubble=document.createElement("div");
  bubble.className="info-bubble hidden";
  bubble.innerHTML=`
  • 2 à 4 couleurs max<br>• 1 principale<br>• Complémentaires<br>• Harmonie
  `;
  b.onclick=()=>bubble.classList.toggle("hidden");
  miniGame.append(b,bubble);
  addText("👉 Trop de couleurs = confusion. Peu = impact.");
  miniGame.onclick=()=>startTypo();
}

/* TYPO */
function startTypo(){
  showMiniGame();
  addTitle("La typographie");
  addText("Indice : elle doit refléter le style de ton produit");
  imageGroup(["images/Typo1.PNG","images/Typo2.PNG","images/Typo3.PNG"],showIdentity);
}

function showIdentity(){
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
  f.onclick=()=>{f.remove();afterMiniGame2();};
}

/* =====================================================
   🎮 MINI-JEU 3 — CANAUX AVEC TRAITS
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

  let selected=null,ok=0;

  [["Instagram & Tik Tok","know"],["Site de vente en ligne","btoc"],["Facebook & LinkedIn","btob"]]
  .forEach(p=>{
    const b=document.createElement("button");
    b.className="btn-platform";
    b.textContent=p[0];
    b.onclick=()=>selected={b:b,k:p[1]};
    left.appendChild(b);
  });

  [["Se faire connaître","know"],["Vendre en BtoC","btoc"],["Vendre en BtoB","btob"]]
  .forEach(t=>{
    const b=document.createElement("button");
    b.className="btn-target";
    b.textContent=t[0];
    b.onclick=()=>{
      if(selected && selected.k===t[1]){
        draw(svg,selected.b,b);
        ok++;
        if(ok===3)finish();
      }
    };
    right.appendChild(b);
  });

  miniGame.append(left,right);
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
   🏆 FIN + GEMS
===================================================== */
function finish(){
  hideMiniGame();
  const f=document.createElement("div");
  f.id="fadeScreen";
  const b=document.createElement("div");
  b.className="loaderBox";
  b.textContent="Bravo tu as gagné cette quête";

  for(let i=0;i<40;i++){
    const g=document.createElement("div");
    g.className="gem";
    g.style.background=`hsl(${Math.random()*360},80%,60%)`;
    g.style.left="50%";
    g.style.top="50%";
    g.style.transform=`translate(${Math.random()*300-150}px,${Math.random()*300-150}px)`;
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
