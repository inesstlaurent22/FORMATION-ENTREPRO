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
   NOTIFICATIONS MINI-JEU 1
===================================================== */
function notification(text, onClick){
  const n=document.createElement("div");
  n.className="notification success";
  n.innerHTML=`
    <div class="glow-text">Clique sur la notification pour continuer</div>
    <div style="margin-top:8px">${text}</div>
  `;
  n.onclick=()=>{
    n.remove();
    onClick && onClick();
  };
  document.body.appendChild(n);
}

function errorNotif(){
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
    showQuestion();
  },1200);
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
    t:"📣 Réseaux sociaux",
    q:"Ils servent surtout à :",
    o:["Se faire connaître","Montrer son univers","Vendre immédiatement"],
    g:[0,1],
    txt:"Les réseaux sociaux créent de la visibilité."
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
  addText("<span class='glow-red'>2 bonnes réponses</span>");

  const col=document.createElement("div");
  col.style.display="flex";
  col.style.flexDirection="column";
  col.style.gap="12px";
  col.style.marginTop="16px";

  s.o.forEach((txt,i)=>{
    const b=document.createElement("button");
    b.textContent=txt;
    b.onclick=()=>{
      if(!sel.includes(i)) sel.push(i);
      if(check(s)){
        notification(s.txt,()=>{
          qi++;
          qi<quiz.length ? showQuestion() : afterMiniGame1();
        });
      }else if(sel.length>=2){
        errorNotif();
      }
    };
    col.appendChild(b);
  });

  miniGame.appendChild(col);
}

function check(s){
  return s.g.every(i=>sel.includes(i)) && sel.every(i=>s.g.includes(i));
}

function afterMiniGame1(){
  hideMiniGame();
  playDialog([
    {speaker:"pirate2",text:"Parfait."},
    {speaker:"pirate3",text:"Créons maintenant ton identité visuelle."}
  ],startMiniGame2);
}

/* =====================================================
   🎨 MINI-JEU 2 — IDENTITÉ VISUELLE (AVEC CADRANS)
===================================================== */

function startMiniGame2(){
  showMiniGame();

  addTitle("L’identité visuelle : Avant de commencer");
  addText(
    "Avant de faire un logo, de choisir des couleurs ou une écriture, " +
    "il faut d’abord savoir ce que tu veux montrer."
  );

  const btn = document.createElement("button");
  btn.textContent = "Voici les points importants à décider";

  const bubble = document.createElement("div");
  bubble.className = "info-bubble hidden";
  bubble.innerHTML = `
    • À qui tu parles : des enfants, des ados, des adultes<br>
    • Ce que tu veux dire : ton idée principale<br>
    • Ce que tu veux faire ressentir : joie, confiance, énergie, calme<br>
    • Ton style : plutôt fun, sérieux, moderne ou créatif
  `;

  btn.onclick = (e) => {
    e.stopPropagation();
    bubble.classList.toggle("hidden");
  };

  miniGame.append(btn, bubble);

  addText(
    "👉 Si tu sais répondre à ces questions, ton identité visuelle sera " +
    "plus simple, rapide à créer et facile à reconnaître."
  );

  // clic sur l’encart = suite
  miniGame.onclick = () => startLogo();
}

/* =====================================================
   🖼️ OUTIL IMAGES + LOADER
===================================================== */
function imageGroup(list, cb){
  const loader = document.createElement("div");
  loader.className = "loader";
  loader.textContent = "⏳";
  miniGame.appendChild(loader);

  let loaded = 0;
  const wrap = document.createElement("div");
  wrap.className = "visualChoices";

  list.forEach(src=>{
    const box = document.createElement("div");

    const img = new Image();
    img.src = src;
    img.onload = () => {
      loaded++;
      if(loaded === list.length){
        loader.remove();
        miniGame.appendChild(wrap);
      }
    };
    img.onclick = () => cb();

    const zoom = document.createElement("button");
    zoom.textContent = "🔎";
    zoom.onclick = e => {
      e.stopPropagation();
      zoomImg(src);
    };

    box.append(img, zoom);
    wrap.appendChild(box);
  });
}

function zoomImg(src){
  const f = document.createElement("div");
  f.id = "fadeScreen";

  const b = document.createElement("div");
  b.className = "loaderBox";

  const img = document.createElement("img");
  img.src = src;
  img.style.width = "320px";

  b.appendChild(img);
  f.appendChild(b);
  document.body.appendChild(f);

  f.onclick = () => f.remove();
}

/* =====================================================
   🧩 LOGO
===================================================== */
function startLogo(){
  showMiniGame();
  addTitle("Ton logo");
  addText("Le choix est libre");

  imageGroup(
    ["images/Logo1.PNG","images/Logo2.PNG","images/Logo3.PNG"],
    afterLogo
  );
}

function afterLogo(){
  showMiniGame();

  addTitle("Logo – Explication");
  addText(
    "Le logo, c’est le dessin principal qui permet de reconnaître ton projet."
  );

  const btn = document.createElement("button");
  btn.textContent = "À retenir";

  const bubble = document.createElement("div");
  bubble.className = "info-bubble hidden";
  bubble.innerHTML = `
    • Un logo doit être simple<br>
    • On doit le reconnaître rapidement<br>
    • Il doit fonctionner en petit et en grand<br>
    • Il ne doit pas être trop chargé
  `;

  btn.onclick = e => {
    e.stopPropagation();
    bubble.classList.toggle("hidden");
  };

  miniGame.append(btn, bubble);

  addText(
    "👉 Astuce : si tu peux dessiner ton logo en 5 secondes, c’est validé."
  );

  miniGame.onclick = () => startColors();
}

/* =====================================================
   🎨 COULEURS
===================================================== */
function startColors(){
  showMiniGame();
  addTitle("Les couleurs");

  const hint = document.createElement("button");
  hint.textContent = "Indice";

  const hintTxt = document.createElement("div");
  hintTxt.className = "info-bubble hidden";
  hintTxt.textContent = "Les couleurs doivent être en cohérence avec le logo";

  hint.onclick = e => {
    e.stopPropagation();
    hintTxt.classList.toggle("hidden");
  };

  miniGame.append(hint, hintTxt);

  imageGroup(
    ["images/Couleur1.PNG","images/Couleur2.PNG","images/Couleur3.PNG"],
    afterColors
  );
}

function afterColors(){
  showMiniGame();

  addTitle("Les couleurs – Explication");
  addText("Les couleurs servent à montrer une émotion.");

  const btn = document.createElement("button");
  btn.textContent = "À retenir";

  const bubble = document.createElement("div");
  bubble.className = "info-bubble hidden";
  bubble.innerHTML = `
    • Choisis 2 à 4 couleurs maximum<br>
    • Une couleur principale (la plus importante)<br>
    • Une ou deux couleurs pour compléter<br>
    • Les couleurs doivent aller bien ensemble
  `;

  btn.onclick = e => {
    e.stopPropagation();
    bubble.classList.toggle("hidden");
  };

  miniGame.append(btn, bubble);

  addText(
    "👉 Trop de couleurs = on ne comprend plus.<br>" +
    "Peu de couleurs = c’est plus clair et plus fort."
  );

  miniGame.onclick = () => startTypo();
}

/* =====================================================
   ✒️ TYPOGRAPHIE
===================================================== */
function startTypo(){
  showMiniGame();
  addTitle("La typographie");

  const hint = document.createElement("button");
  hint.textContent = "Indice";

  const hintTxt = document.createElement("div");
  hintTxt.className = "info-bubble hidden";
  hintTxt.textContent =
    "La typographie doit être en cohérence avec le thème de ton activité";

  hint.onclick = e => {
    e.stopPropagation();
    hintTxt.classList.toggle("hidden");
  };

  miniGame.append(hint, hintTxt);

  imageGroup(
    ["images/Typo1.PNG","images/Typo2.PNG","images/Typo3.PNG"],
    afterTypo
  );
}

function afterTypo(){
  showMiniGame();

  addTitle("La typographie – Explication");
  addText(
    "La typographie, c’est la forme des lettres que tu utilises."
  );

  const btn = document.createElement("button");
  btn.textContent = "À retenir";

  const bubble = document.createElement("div");
  bubble.className = "info-bubble hidden";
  bubble.innerHTML = `
    • Elle doit être facile à lire<br>
    • Elle doit correspondre à ton style<br>
    • Utilise 1 ou 2 écritures maximum<br>
    • La même écriture partout
  `;

  btn.onclick = e => {
    e.stopPropagation();
    bubble.classList.toggle("hidden");
  };

  miniGame.append(btn, bubble);

  addText(
    "👉 Une bonne écriture rend ton projet plus sérieux et plus facile à comprendre."
  );

  miniGame.onclick = () => showIdentity();
}

/* =====================================================
   🖼️ IDENTITÉ VISUELLE FINALE
===================================================== */
function showIdentity(){
  const f = document.createElement("div");
  f.id = "fadeScreen";

  const b = document.createElement("div");
  b.className = "loaderBox";
  b.innerHTML = "<strong>L’identité visuelle est prête</strong>";

  const img = document.createElement("img");
  img.src = "images/Identiteevisuelle.PNG";
  img.style.width = "260px";

  b.appendChild(img);
  f.appendChild(b);
  document.body.appendChild(f);

  f.onclick = () => {
    f.remove();
    afterMiniGame2();
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

  let sel=null, ok=0;

  const platforms=[
    ["Instagram & Tik Tok","know"],
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
    b.onclick=()=>sel={b:b,k:p[1]};
    left.appendChild(b);
  });

  targets.forEach(t=>{
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
    g.style.setProperty("--x",`${Math.random()*400-200}px`);
    g.style.setProperty("--y",`${Math.random()*400-200}px`);
    f.appendChild(g);
  }

  document.body.appendChild(f);

  setTimeout(()=>{
    sessionStorage.setItem("unlock_pirate5","true");
    location.href="menu.html";
  },2600);
}

});
