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

function addText(html){
  const p=document.createElement("p");
  p.innerHTML=html;
  miniGame.appendChild(p);
}

function infoBox(title, html, clickable=false, next=null){
  const box=document.createElement("div");
  box.style.margin="18px 0";
  box.style.padding="18px";
  box.style.border="3px solid gold";
  box.style.borderRadius="16px";
  box.style.background="rgba(0,0,0,.35)";
  box.innerHTML=`<strong>${title}</strong><br><br>${html}`;
  if(clickable){
    box.style.cursor="pointer";
    box.onclick=()=>next && next();
  }
  miniGame.appendChild(box);
}

function toggleBubble(button, text){
  let bubble=null;
  button.onclick=()=>{
    if(bubble){
      bubble.remove();
      bubble=null;
    }else{
      bubble=document.createElement("div");
      bubble.style.marginTop="12px";
      bubble.style.padding="12px";
      bubble.style.border="2px solid gold";
      bubble.style.borderRadius="12px";
      bubble.style.background="rgba(0,0,0,.6)";
      bubble.innerHTML=text;
      button.after(bubble);
    }
  };
}

function imageGroup(images, cb){
  const wrap=document.createElement("div");
  wrap.className="visualChoices";
  images.forEach(src=>{
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

/* =====================================================
   DÉBUT QUÊTE
===================================================== */
pirate3.onclick=()=>{
  playDialog([
    {speaker:"pirate3",text:"Capitaine, ton trésor est prêt."},
    {speaker:"pirate2",text:"Mais sans communication, personne ne viendra."},
    {speaker:"pirate3",text:"Voyons comment attirer le marché."}
  ], startMiniGame1);
};

/* =====================================================
   MINI-JEU 1 – COMMUNICATION (RÉTABLI)
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
  addText("<span class='glowText'>2 bonnes réponses</span>");

  s.o.forEach((txt,i)=>{
    const b=document.createElement("button");
    b.textContent=txt;
    b.onclick=()=>{
      if(!sel.includes(i)) sel.push(i);
      if(check(s)){
        qi++;
        qi<quiz.length ? showQuestion() : afterMiniGame1();
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
    {speaker:"pirate3",text:"Créons ton identité visuelle."}
  ], startMiniGame2);
}

/* =====================================================
   MINI-JEU 2 – IDENTITÉ VISUELLE (7 ENCARTS)
===================================================== */
function startMiniGame2(){
  showMiniGame();

  infoBox(
    "L’identité visuelle : Avant de commencer",
    "Avant de faire un logo, de choisir des couleurs ou une écriture, il faut d’abord savoir ce que tu veux montrer.",
    false
  );

  const btn=document.createElement("button");
  btn.textContent="Voici les points importants à décider";
  miniGame.appendChild(btn);

  toggleBubble(btn,`
    • À qui tu parles : enfants, ados, adultes<br>
    • Ce que tu veux dire : ton idée principale<br>
    • Ce que tu veux faire ressentir : joie, confiance, énergie, calme<br>
    • Ton style : fun, sérieux, moderne ou créatif
  `);

  addText("👉 Si tu sais répondre à ces questions, ton identité visuelle sera plus simple, rapide à créer et facile à reconnaître.");

  infoBox("Clique pour continuer","",true,startLogo);
}

/* ---- LOGO ---- */
function startLogo(){
  showMiniGame();
  addTitle("Ton logo");
  addText("Le choix est libre");

  imageGroup(
    ["images/Logo1.PNG","images/Logo2.PNG","images/Logo3.PNG"],
    showLogoExplanation
  );
}

function showLogoExplanation(){
  showMiniGame();
  infoBox(
    "Logo – Explication",
    "Le logo, c’est le dessin principal qui permet de reconnaître ton projet."
  );

  const btn=document.createElement("button");
  btn.textContent="À retenir";
  miniGame.appendChild(btn);

  toggleBubble(btn,`
    • Un logo doit être simple<br>
    • Reconnaissable rapidement<br>
    • Fonctionne en petit et en grand<br>
    • Pas trop chargé
  `);

  addText("👉 Astuce : si tu peux dessiner ton logo en 5 secondes, c’est validé.");
  infoBox("Clique pour continuer","",true,startColors);
}

/* ---- COULEURS ---- */
function startColors(){
  showMiniGame();
  addTitle("Les couleurs");

  imageGroup(
    ["images/Couleur1.PNG","images/Couleur2.PNG","images/Couleur3.PNG"],
    showColorsExplanation
  );
}

function showColorsExplanation(){
  showMiniGame();
  infoBox(
    "Les couleurs – Explication",
    "Les couleurs servent à montrer une émotion."
  );

  const btn=document.createElement("button");
  btn.textContent="À retenir";
  miniGame.appendChild(btn);

  toggleBubble(btn,`
    • 2 à 4 couleurs maximum<br>
    • Une couleur principale<br>
    • Une ou deux secondaires<br>
    • Doivent aller ensemble
  `);

  addText("👉 Trop de couleurs = confusion. Peu = plus fort.");
  infoBox("Clique pour continuer","",true,startTypo);
}

/* ---- TYPO ---- */
function startTypo(){
  showMiniGame();
  addTitle("La typographie");

  imageGroup(
    ["images/Typo1.PNG","images/Typo2.PNG","images/Typo3.PNG"],
    showTypoExplanation
  );
}

function showTypoExplanation(){
  showMiniGame();
  infoBox(
    "La typographie – Explication",
    "La typographie, c’est la forme des lettres que tu utilises."
  );

  const btn=document.createElement("button");
  btn.textContent="À retenir";
  miniGame.appendChild(btn);

  toggleBubble(btn,`
    • Facile à lire<br>
    • Correspond au style<br>
    • 1 ou 2 max<br>
    • La même partout
  `);

  addText("👉 Une bonne écriture rend ton projet plus sérieux.");
  infoBox("Clique pour finaliser","",true,showIdentity);
}

/* ---- FINAL IDENTITÉ ---- */
function showIdentity(){
  hideMiniGame();
  const f=document.createElement("div");
  f.id="fadeScreen";
  const b=document.createElement("div");
  b.className="loaderBox";

  b.innerHTML="<strong>Identité visuelle finalisée</strong>";

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
    {speaker:"pirate3",text:"Voyons les canaux."}
  ], startMiniGame3);
}

});
