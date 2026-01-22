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
  b.className="info-bubble hidden";
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
   MINI-JEU 1 — COMMUNICATION
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
    txt:"Les réseaux sociaux servent d’abord à être visible."
  },
  {
    t:"📜 Newsletters",
    q:"Une newsletter permet de :",
    o:["Rester présent","Créer un lien","Envoyer du spam"],
    g:[0,1],
    txt:"La newsletter entretient la relation."
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
        showNotification(s.txt,()=>{
          qi++;
          qi<quiz.length?showQuestion():afterMiniGame1();
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

function showNotification(text,cb){
  const n=document.createElement("div");
  n.className="notification success";
  n.innerHTML=`
    <div class="glow-text">Clique sur la notification pour continuer</div>
    <div><strong>${text}</strong></div>
  `;
  n.onclick=()=>{n.remove();cb&&cb();};
  document.body.appendChild(n);
}

function showError(){
  document.body.classList.add("shake");
  const n=document.createElement("div");
  n.className="notification error";
  n.textContent="Tu t’es trompé 💥";
  document.body.appendChild(n);
  setTimeout(()=>{
    document.body.classList.remove("shake");
    n.remove();
  },1200);
}

function afterMiniGame1(){
  hideMiniGame();
  playDialog([
    {speaker:"pirate2",text:"Parfait."},
    {speaker:"pirate3",text:"Passons maintenant à ton identité visuelle."}
  ],startIdentityIntro);
}

/* =====================================================
   MINI-JEU 2 — IDENTITÉ VISUELLE
===================================================== */
function startIdentityIntro(){
  showMiniGame();
  addTitle("L’identité visuelle : Avant de commencer");
  addText("Avant de faire un logo, de choisir des couleurs ou une écriture, il faut d’abord savoir ce que tu veux montrer.",true);

  const btn=document.createElement("button");
  btn.textContent="Voici les points importants à décider";
  btn.style.margin="20px auto";

  const bubble=infoBubble(`
    • À qui tu parles : enfants, ados, adultes<br>
    • Ton message principal<br>
    • L’émotion à transmettre<br>
    • Ton style visuel
  `);

  btn.onclick=e=>{e.stopPropagation();bubble.classList.toggle("hidden");};

  miniGame.append(btn,bubble);

  addText("👉 Si tu sais répondre à ces questions, ton identité visuelle sera plus simple, rapide à créer et facile à reconnaître.");

  miniGame.onclick=startLogo;
}

/* === IMAGES + LOADER === */
function imageGroup(list,cb){
  const loader=document.createElement("div");
  loader.textContent="⏳";
  loader.style.fontSize="32px";
  loader.style.marginTop="20px";
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
  f.innerHTML=`<div class="loaderBox"><img src="${src}" width="300"></div>`;
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
  addText("Le logo, c’est le dessin principal qui permet de reconnaître ton projet.",true);

  const btn=document.createElement("button");
  btn.textContent="À retenir";
  btn.style.margin="20px auto";

  const bubble=infoBubble(`
    • Un logo doit être simple<br>
    • Reconnaissable rapidement<br>
    • Fonctionne petit et grand<br>
    • Pas trop chargé
  `);

  btn.onclick=e=>{e.stopPropagation();bubble.classList.toggle("hidden");};
  miniGame.append(btn,bubble);

  addText("👉 Astuce : si tu peux dessiner ton logo en 5 secondes, c’est validé.");

  miniGame.onclick=startColors;
}

/* COULEURS */
function startColors(){
  showMiniGame();
  addTitle("Les couleurs");
  addText("Les couleurs doivent être en cohérence avec le logo de la marque.",true);
  imageGroup(["images/Couleur1.PNG","images/Couleur2.PNG","images/Couleur3.PNG"],colorsExplanation);
}

function colorsExplanation(){
  showMiniGame();
  addTitle("Les couleurs – Explication");

  const btn=document.createElement("button");
  btn.textContent="À retenir";
  btn.style.margin="20px auto";

  const bubble=infoBubble(`
    • Choisis 2 à 4 couleurs maximum<br>
    • Une couleur principale<br>
    • Une ou deux couleurs pour compléter<br>
    • Les couleurs doivent aller bien ensemble
  `);

  btn.onclick=e=>{e.stopPropagation();bubble.classList.toggle("hidden");};
  miniGame.append(btn,bubble);

  addText("👉 Trop de couleurs = on ne comprend plus. Peu = plus clair et plus fort.");

  miniGame.onclick=startTypo;
}

/* TYPOGRAPHIE */
function startTypo(){
  showMiniGame();
  addTitle("La typographie");
  addText("La typographie doit rester en cohérence avec l’univers de ta marque.",true);
  imageGroup(["images/Typo1.PNG","images/Typo2.PNG","images/Typo3.PNG"],typoExplanation);
}

function typoExplanation(){
  showMiniGame();
  addTitle("La typographie – Explication");

  const btn=document.createElement("button");
  btn.textContent="À retenir";
  btn.style.margin="20px auto";

  const bubble=infoBubble(`
    • Elle doit être facile à lire<br>
    • Elle doit correspondre à ton style<br>
    • Utilise 1 ou 2 écritures maximum<br>
    • La même écriture partout
  `);

  btn.onclick=e=>{e.stopPropagation();bubble.classList.toggle("hidden");};
  miniGame.append(btn,bubble);

  addText("👉 Une bonne écriture rend ton projet plus sérieux et plus facile à comprendre.");

  miniGame.onclick=showIdentity;
}

/* IDENTITÉ VISUELLE */
function showIdentity(){
  hideMiniGame();
  const f=document.createElement("div");
  f.id="fadeScreen";
  f.innerHTML=`
    <div class="loaderBox">
      <strong>Bravo, tu as gagné ton identité visuelle</strong><br>
      <img src="images/Identiteevisuelle.PNG" width="260">
    </div>
  `;
  document.body.appendChild(f);
  f.onclick=()=>{f.remove();afterMiniGame2();};
}

/* =====================================================
   DIALOGUES + MINI-JEU 3
===================================================== */
function afterMiniGame2(){
  playDialog([
    {speaker:"pirate2",text:"Ton identité est prête."},
    {speaker:"pirate3",text:"Voyons maintenant comment la diffuser."}
  ],startMiniGame3);
}

function startMiniGame3(){
  showMiniGame();
  addTitle("Les réseaux sociaux");
  addText("Trouve les bons enjeux de ces réseaux sociaux pour gagner le mini-jeu.");

  const left=document.createElement("div");
  left.className="leftCol";
  const right=document.createElement("div");
  right.className="rightCol";

  let selected=null,ok=0;

  const pairs={
    know:"Se faire connaître",
    btob:"Vendre en BtoB",
    btoc:"Vendre en BtoC"
  };

  [
    ["Instagram & TikTok","know"],
    ["Facebook & LinkedIn","btob"],
    ["Les sites de vente en ligne","btoc"]
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
