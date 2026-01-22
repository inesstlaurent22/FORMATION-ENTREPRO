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
  miniGame.onclick = null;
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
  p.innerHTML= bold ? `<strong>${t}</strong>` : t;
  miniGame.appendChild(p);
}

function infoBubble(html){
  const b=document.createElement("div");
  b.className="info-bubble hidden";
  b.innerHTML=html;
  return b;
}

/* =====================================================
   🔔 NOTIFICATIONS (MINI-JEU 1)
===================================================== */
function showNotification(text, next){
  const n=document.createElement("div");
  n.className="notification success";
  n.innerHTML=`
    <div class="glow-text">Clique sur la notification pour continuer</div>
    <div style="margin-top:6px"><strong>${text}</strong></div>
  `;
  n.onclick=()=>{
    n.remove();
    next && next();
  };
  document.body.appendChild(n);
}

function showError(){
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
   MINI-JEU 1 — COMMUNICATION
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

let qi=0, selected=[];

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
  addText("2 bonnes réponses",true);

  s.o.forEach((txt,i)=>{
    const b=document.createElement("button");
    b.style.display="block";
    b.style.margin="10px auto";
    b.textContent=txt;
    b.onclick=()=>{
      if(!selected.includes(i)) selected.push(i);
      if(check(s)){
        showNotification(s.txt,()=>{
          qi++;
          qi<quiz.length ? showQuestion() : afterMiniGame1();
        });
      }else if(selected.length>=2){
        showError();
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
    {speaker:"pirate3",text:"Créons ton identité visuelle."}
  ],startMiniGame2);
}

/* =====================================================
   MINI-JEU 2 — IDENTITÉ VISUELLE
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
  addText("👉 Si tu sais répondre à ces questions, ton identité visuelle sera plus simple, rapide à créer et facile à reconnaître.");

  const next=document.createElement("button");
  next.textContent="Continuer";
  next.onclick=()=>startLogo();
  miniGame.appendChild(next);
}

/* === IMAGES AVEC LOADER === */
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

/* LOGO → COULEURS → TYPO */
function startLogo(){
  showMiniGame();
  addTitle("Ton logo");
  addText("Le choix est libre",true);
  imageGroup(["images/Logo1.PNG","images/Logo2.PNG","images/Logo3.PNG"],logoExplanation);
}

function logoExplanation(){
  showMiniGame();
  addTitle("Logo – Explication");
  addText("Le logo, c’est le dessin principal qui permet de reconnaître ton projet.",true);
  const b=document.createElement("button");
  b.textContent="À retenir";
  const bubble=infoBubble(`
    • Simple<br>• Reconnaissable<br>• Lisible petit/grand<br>• Pas chargé
  `);
  b.onclick=e=>{e.stopPropagation();bubble.classList.toggle("hidden");};
  miniGame.append(b,bubble);
  addText("👉 Astuce : si tu peux le dessiner en 5 secondes, c’est validé.");
  miniGame.appendChild(Object.assign(document.createElement("button"),{textContent:"Continuer",onclick:startColors}));
}

function startColors(){
  showMiniGame();
  addTitle("Les couleurs");
  addText("Les couleurs doivent être en cohérence avec le logo de la marque",true);
  imageGroup(["images/Couleur1.PNG","images/Couleur2.PNG","images/Couleur3.PNG"],colorsExplanation);
}

function colorsExplanation(){
  showMiniGame();
  addTitle("Les couleurs – Explication");
  addText("Les couleurs doivent être en cohérence avec le logo de la marque",true);
  const b=document.createElement("button");
  b.textContent="À retenir";
  const bubble=infoBubble(`
    • 2 à 4 couleurs max<br>• 1 principale<br>• Harmonies
  `);
  b.onclick=e=>{e.stopPropagation();bubble.classList.toggle("hidden");};
  miniGame.append(b,bubble);
  addText("👉 Trop de couleurs = confusion.");
  miniGame.appendChild(Object.assign(document.createElement("button"),{textContent:"Continuer",onclick:startTypo}));
}

function startTypo(){
  showMiniGame();
  addTitle("La typographie");
  addText("La typographie doit rester en cohérence avec l’univers de ta marque",true);
  imageGroup(["images/Typo1.PNG","images/Typo2.PNG","images/Typo3.PNG"],typoExplanation);
}

function typoExplanation(){
  showMiniGame();
  addTitle("Typographie – Explication");
  addText("La typographie doit rester en cohérence avec l’univers de ta marque",true);
  const b=document.createElement("button");
  b.textContent="À retenir";
  const bubble=infoBubble(`
    • Lisible<br>• 1 ou 2 écritures max<br>• Cohérence
  `);
  b.onclick=e=>{e.stopPropagation();bubble.classList.toggle("hidden");};
  miniGame.append(b,bubble);
  addText("👉 Une bonne typo rend ton projet plus clair.");
  miniGame.appendChild(Object.assign(document.createElement("button"),{textContent:"Valider l’identité visuelle",onclick:showIdentity}));
}

/* =====================================================
   FIN MINI-JEU 2
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

function afterMiniGame2(){
  playDialog([
    {speaker:"pirate2",text:"Ton identité est prête."},
    {speaker:"pirate3",text:"Voyons comment la diffuser."}
  ],startMiniGame3);
}

/* =====================================================
   MINI-JEU 3 — CANAUX
===================================================== */
function startMiniGame3(){
  showMiniGame();
  miniGame.onclick=null;
  addTitle("Choisis les bons canaux");

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
    b.onclick=e=>{
      e.stopPropagation();
      selected={b:b,k:p[1]};
    };
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
    b.onclick=e=>{
      e.stopPropagation();
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
