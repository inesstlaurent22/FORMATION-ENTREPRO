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

toggleSound.onclick = e=>{
  e.stopPropagation();
  introVideo.muted = !introVideo.muted;
  toggleSound.textContent = introVideo.muted ? "🔇" : "🔊";
};

closeVideo.onclick = e=>{
  e.stopPropagation();
  endVideo();
};

introVideo.onended = endVideo;

function endVideo(){
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

  dialogBox.style.left =
    `${r.left+r.width/2-dialogBox.offsetWidth/2}px`;
  dialogBox.style.top =
    `${r.top-dialogBox.offsetHeight-20}px`;
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
   🧰 HELPERS
===================================================== */
function clearMiniGame(){
  miniGame.innerHTML="";
  miniGame.onclick=null;
  miniGame.classList.remove("hidden");
}

function hideMiniGame(){
  miniGame.classList.add("hidden");
  miniGame.onclick=null;
}

function addTitle(t){
  const h=document.createElement("h3");
  h.textContent=t;
  miniGame.appendChild(h);
}

function addText(t, bold=false){
  const p=document.createElement("p");
  p.innerHTML = bold ? `<strong>${t}</strong>` : t;
  miniGame.appendChild(p);
}

function infoBubble(html){
  const d=document.createElement("div");
  d.className="info-bubble hidden";
  d.innerHTML=html;
  return d;
}

/* =====================================================
   🔔 NOTIFICATIONS
===================================================== */
function showNotification(text){
  const n=document.createElement("div");
  n.className="notification success";
  n.innerHTML=`
    <div class="glow-text">Bonne réponse</div>
    <div style="margin-top:6px">${text}</div>
  `;
  document.body.appendChild(n);
  setTimeout(()=>n.remove(),1200);
}

/* =====================================================
   🚀 DÉMARRAGE
===================================================== */
pirate3.onclick=()=>{
  playDialog([
    {speaker:"pirate3",text:"Capitaine, ton trésor est prêt."},
    {speaker:"pirate2",text:"Mais sans communication, personne ne viendra."},
    {speaker:"pirate3",text:"Voyons comment attirer le marché."}
  ], startMiniGame1);
};

/* =====================================================
   🎯 MINI-JEU 1 — COMMUNICATION
===================================================== */
const quiz=[
  {t:"⚓ Visite physique",q:"Rencontrer un client permet de :",o:["Rassurer","Créer une connexion","Ignorer ses attentes"],g:[0,1]},
  {t:"📞 Phoning",q:"Le contact direct sert à :",o:["Comprendre les besoins","Créer une relation","Parler uniquement de prix"],g:[0,1]},
  {t:"📣 Réseaux sociaux",q:"Ils servent surtout à :",o:["Se faire connaître","Montrer son univers","Vendre immédiatement"],g:[0,1]},
  {t:"📧 Newsletter",q:"Une newsletter permet de :",o:["Rester présent","Créer un lien","Envoyer du spam"],g:[0,1]}
];

let qi=0, selected=[];

function startMiniGame1(){
  qi=0;
  showQuestion();
}

function showQuestion(){
  clearMiniGame();
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
        showNotification("Bien joué !");
        qi++;
        qi<quiz.length ? setTimeout(showQuestion,700) : afterMiniGame1();
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
    {speaker:"pirate2",text:"Parfait."},
    {speaker:"pirate3",text:"Passons à ton identité visuelle."}
  ], startIdentityIntro);
}

/* =====================================================
   🎨 MINI-JEU 2 — IDENTITÉ VISUELLE (INVERSION OK)
===================================================== */

/* INTRO */
function startIdentityIntro(){
  clearMiniGame();

  addTitle("L’identité visuelle");
  addText("Avant de créer un logo, des couleurs ou une typographie, tu dois savoir :",true);

  const btn=document.createElement("button");
  btn.textContent="Les points importants de l'identité visuelle";
  btn.style.margin="16px auto";

  const bubble=infoBubble(`
   • À qui tu parles : des enfants, des ados, des adultes<br>
	• Ce que tu veux dire : ton idée principale<br>
	• Ce que tu veux faire ressentir : joie, confiance, énergie, calme<br>
   • Ton style : plutôt fun, sérieux, moderne ou créatif 
  `);

  btn.onclick=e=>{
    e.stopPropagation();
    bubble.classList.toggle("hidden");
  };

  miniGame.append(btn,bubble);

  addText("👉 Une bonne identité visuelle rend ta marque reconnaissable.");

  const next=document.createElement("button");
  next.onclick=logoExplanation;
  miniGame.appendChild(next);
}

/* LOGO */
function logoExplanation(){
  clearMiniGame();
  addTitle("Le logo");
  addText("Le logo est le symbole principal de ton projet.",true);

  const btn=document.createElement("button");
  btn.textContent="En savoir plus";

  const bubble=infoBubble(`
  Il faut qu'il soit<br><br>
   • Un logo doit être simple<br>
	• On doit le reconnaître rapidement<br>
	• Il doit fonctionner en petit et en grand<br>
   • Il ne doit pas être trop chargé<br>
  `);

  btn.onclick=()=>bubble.classList.toggle("hidden");
  miniGame.append(btn,bubble);

  addText("👉 Astuce : si tu peux dessiner ton logo en 5 secondes, c’est validé.");

  const next=document.createElement("button");
  next.onclick=startLogo;
  miniGame.appendChild(next);
}

function startLogo(){
  clearMiniGame();
  addTitle("Choisis ton logo");
  imageGroup(
    ["images/Logo1.PNG","images/Logo2.PNG","images/Logo3.PNG"],
    colorsExplanation
  );
}

/* COULEURS */
function colorsExplanation(){
  clearMiniGame();
  addTitle("La palette de couleur");
  addText("Les couleurs doivent être en cohérene avec le logo.",true);

  const btn=document.createElement("button");
  btn.textContent="En savoir plus";

  const bubble=infoBubble(`
  Il faut qu'il soit<br><br>
   • Choisis 2 à 4 couleurs maximum
	• Une couleur principale (la plus importante)
	• Une ou deux couleurs pour compléter
   • Les couleurs doivent aller bien ensemble 
  `);

  btn.onclick=()=>bubble.classList.toggle("hidden");
  miniGame.append(btn,bubble);

addText("👉 Trop de couleurs = on ne comprend plus.<br>Peu de couleurs = c’est plus clair et plus fort.");
   
  const next=document.createElement("button");
  next.onclick=startColors;
  miniGame.appendChild(next);
}

function startColors(){
  clearMiniGame();
  addTitle("Choisis ta palette");
  imageGroup(
    ["images/Couleur1.PNG","images/Couleur2.PNG","images/Couleur3.PNG"],
    typoExplanation
  );
}

/* TYPO */
function typoExplanation(){
  clearMiniGame();
  addTitle("La typographue");
  addText("La typographie reflète l'univers de ta marque.",true);

  const btn=document.createElement("button");
  btn.textContent="En savoir plus";

  const bubble=infoBubble(`
  Il faut qu'il soit<br><br>
   • La même écriture partout 
   • Elle doit être facile à lire
	• Elle doit correspondre à ton style
	• Utilise 1 ou 2 écritures maximum 
  `);

  btn.onclick=()=>bubble.classList.toggle("hidden");
  miniGame.append(btn,bubble);

addText("👉 Une bonne écriture rend ton projet plus sérieux et plus facile à comprendre.");

  const next=document.createElement("button");
  next.onclick=startTypo;
  miniGame.appendChild(next);
}

function startTypo(){
  clearMiniGame();
  addTitle("Choisis ta typographie");
  imageGroup(
    ["images/Typo1.PNG","images/Typo2.PNG","images/Typo3.PNG"],
    showIdentity
  );
}

/* IDENTITÉ FINALE */
function showIdentity(){
  hideMiniGame();
  const f=document.createElement("div");
  f.id="fadeScreen";
  f.innerHTML=`
    <div class="loaderBox">
      <strong>Bravo, tu as créé ton identité visuelle</strong><br><br>
      <img src="images/Identiteevisuelle.jpg" width="260">
    </div>
  `;
  document.body.appendChild(f);
  f.onclick=()=>{
    f.remove();
    afterMiniGame2();
  };
}

/* HELPER IMAGES + LOADER */
function imageGroup(list, cb){
  const loader=document.createElement("div");
  loader.textContent="⏳";
  loader.style.fontSize="32px";
  loader.style.margin="18px 0";
  miniGame.appendChild(loader);

  let loaded=0;
  const wrap=document.createElement("div");
  wrap.className="visualChoices";

  list.forEach(src=>{
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
    wrap.appendChild(img);
  });
}

/* =====================================================
   💬 DIALOGUES → MINI-JEU 3
===================================================== */
function afterMiniGame2(){
  playDialog([
    {speaker:"pirate2",text:"Ton identité est prête."},
    {speaker:"pirate3",text:"Voyons maintenant comment la diffuser."}
  ], startMiniGame3);
}

/* =====================================================
   🔗 MINI-JEU 3 — RÉSEAUX (SIMPLIFIÉ)
===================================================== */
function startMiniGame3(){
  clearMiniGame();
  addTitle("Les réseaux sociaux");
  addText("Trouve les bons enjeux pour chaque réseau.");

  const left=document.createElement("div");
  left.className="leftCol";
  const right=document.createElement("div");
  right.className="rightCol";

  let selected=null, ok=0;

  const platforms=[
    ["Instagram & TikTok","know"],
    ["Facebook & LinkedIn","btob"],
    ["Sites de vente en ligne","btoc"]
  ];

  const targets=[
    ["Se faire connaître","know"],
    ["Vendre en BtoB","btob"],
    ["Vendre en BtoC","btoc"]
  ];

  platforms.forEach(p=>{
    const b=document.createElement("button");
    b.className="btn-platform";
    b.textContent=p[0];
    b.onclick=()=>selected={btn:b,key:p[1]};
    left.appendChild(b);
  });

  targets.forEach(t=>{
    const b=document.createElement("button");
    b.className="btn-target";
    b.textContent=t[0];
    b.onclick=()=>{
      if(selected && selected.key===t[1]){
        showNotification("Bonne réponse");
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
   🏁 FIN
===================================================== */
function finish() {
  hideMiniGame();

  // 🔓 Débloque pirate5 AVANT retour menu
  sessionStorage.setItem("unlock_pirate5", "true");

  const f = document.createElement("div");
  f.id = "fadeScreen";
  f.innerHTML = "<div class='loaderBox'>Bravo, tu as gagné cette quête</div>";
  document.body.appendChild(f);

  setTimeout(() => {
    location.href = "menu.html";
  }, 2800);
}

});
