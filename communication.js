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
  dialogs = list;
  dialogIndex = 0;
  dialogCallback = callback;
  dialogBox.classList.remove("hidden");
  showDialog();
}

function showDialog(){
  const d = dialogs[dialogIndex];
  dialogText.textContent = d.text;

  const target = d.speaker === "pirate2" ? pirate2 : pirate3;
  const r = target.getBoundingClientRect();

  dialogBox.style.left =
    `${r.left + r.width/2 - dialogBox.offsetWidth/2}px`;
  dialogBox.style.top =
    `${r.top - dialogBox.offsetHeight - 20}px`;
}

dialogBox.onclick = () => {
  dialogIndex++;
  if(dialogIndex < dialogs.length){
    showDialog();
  } else {
    dialogBox.classList.add("hidden");
    dialogCallback && dialogCallback();
  }
};

/* =====================================================
   HELPERS
===================================================== */
function clearMiniGameClick(){
  miniGame.onclick = null;
}

function showMiniGame(){
  miniGame.innerHTML = "";
  miniGame.classList.remove("hidden");
  clearMiniGameClick();
}

function hideMiniGame(){
  miniGame.classList.add("hidden");
  clearMiniGameClick();
}

function addTitle(t){
  const h = document.createElement("h3");
  h.textContent = t;
  miniGame.appendChild(h);
}

function addText(t, bold=false){
  const p = document.createElement("p");
  p.innerHTML = bold ? `<strong>${t}</strong>` : t;
  miniGame.appendChild(p);
}

function infoBox(html){
  const d = document.createElement("div");
  d.className = "info-bubble";
  d.innerHTML = html;
  miniGame.appendChild(d);
}

/* =====================================================
   DÉMARRAGE
===================================================== */
pirate3.onclick = () => {
  playDialog([
    {speaker:"pirate3", text:"Capitaine, ton trésor est prêt."},
    {speaker:"pirate2", text:"Mais sans communication, personne ne viendra."},
    {speaker:"pirate3", text:"Voyons comment attirer le marché."}
  ], startMiniGame1);
};

/* =====================================================
   MINI-JEU 1 — COMMUNICATION
===================================================== */
const quiz = [
  {t:"⚓ Visite physique", q:"Rencontrer un client permet de :", o:["Rassurer","Créer une connexion","Ignorer ses attentes"], g:[0,1]},
  {t:"📞 Phoning", q:"Le contact direct sert à :", o:["Comprendre les besoins","Créer une relation","Parler uniquement de prix"], g:[0,1]},
  {t:"📣 Réseaux sociaux", q:"Ils servent surtout à :", o:["Se faire connaître","Montrer son univers","Vendre immédiatement"], g:[0,1]},
  {t:"📧 Newsletter", q:"Une newsletter permet de :", o:["Rester présent","Créer un lien","Envoyer du spam"], g:[0,1]}
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
  addText("<span class='glow-red'>2 choix possibles</span>");

  s.o.forEach((txt,i)=>{
    const b=document.createElement("button");
    b.style.display="block";
    b.style.margin="10px auto";
    b.textContent=txt;
    b.onclick=()=>{
      if(!selected.includes(i)) selected.push(i);
      if(checkAnswer(s)){
        qi++;
        qi<quiz.length ? showQuestion() : afterMiniGame1();
      } else if(selected.length>=2){
        selected=[];
      }
    };
    miniGame.appendChild(b);
  });
}

function checkAnswer(s){
  return s.g.every(i=>selected.includes(i)) &&
         selected.every(i=>s.g.includes(i));
}

function afterMiniGame1(){
  hideMiniGame();
  playDialog([
    {speaker:"pirate2",text:"Bien joué."},
    {speaker:"pirate3",text:"Créons ton identité visuelle."}
  ], startIdentityIntro);
}

/* =====================================================
   MINI-JEU 2 — IDENTITÉ VISUELLE
===================================================== */
function startIdentityIntro(){
  showMiniGame();
  addTitle("L’identité visuelle");
  infoBox(`
    Avant de créer un logo, des couleurs ou une typographie, tu dois savoir :<br><br>
    • À qui tu parles<br>
    • Ton message principal<br>
    • L’émotion à transmettre<br>
    • Ton style visuel<br><br>
    👉 Si tu sais répondre à ces questions, ton identité visuelle sera plus simple et plus forte.
  `);
  miniGame.onclick=startLogo;
}

/* === IMAGES AVEC LOADER === */
function imageGroup(list, cb){
  const loader=document.createElement("div");
  loader.textContent="⏳";
  loader.style.fontSize="32px";
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

/* LOGO */
function startLogo(){
  showMiniGame();
  addTitle("Ton logo");
  addText("Choisis un logo",true);
  imageGroup(
    ["images/Logo1.PNG","images/Logo2.PNG","images/Logo3.PNG"],
    logoExplanation
  );
}

function logoExplanation(){
  showMiniGame();
  addTitle("Logo – Explication");
  infoBox(`
    Le logo permet de reconnaître ton projet.<br><br>
    • Simple<br>
    • Reconnaissable rapidement<br>
    • Lisible en petit et en grand<br><br>
    👉 Astuce : si tu peux le dessiner en 5 secondes, c’est validé.
  `);
  miniGame.onclick=startColors;
}

/* COULEURS */
function startColors(){
  showMiniGame();
  addTitle("Les couleurs");
  addText("Choisis des couleurs",true);
  imageGroup(
    ["images/Couleur1.PNG","images/Couleur2.PNG","images/Couleur3.PNG"],
    colorsExplanation
  );
}

function colorsExplanation(){
  showMiniGame();
  addTitle("Couleurs – Explication");
  infoBox(`
    Les couleurs doivent être en cohérence avec le logo.<br><br>
    • 2 à 4 maximum<br>
    • Une couleur principale<br>
    • Une harmonie claire
  `);
  miniGame.onclick=startTypo;
}

/* TYPO */
function startTypo(){
  showMiniGame();
  addTitle("La typographie");
  addText("Choisis une écriture",true);
  imageGroup(
    ["images/Typo1.PNG","images/Typo2.PNG","images/Typo3.PNG"],
    typoExplanation
  );
}

function typoExplanation(){
  showMiniGame();
  addTitle("Typographie – Explication");
  infoBox(`
    La typographie doit rester cohérente avec ta marque.<br><br>
    • Lisible<br>
    • 1 ou 2 maximum<br>
    • Même style partout
  `);
  miniGame.onclick=showIdentity;
}

/* IDENTITÉ VISUELLE FINALE */
function showIdentity(){
  hideMiniGame();
  const f=document.createElement("div");
  f.id="fadeScreen";
  f.innerHTML=`
    <div class="loaderBox">
      <strong>Bravo, tu as créé ton identité visuelle</strong><br><br>
      <img src="images/Identiteevisuelle.PNG" width="260">
    </div>
  `;
  document.body.appendChild(f);
  f.onclick=()=>{
    f.remove();
    afterMiniGame2();
  };
}

/* =====================================================
   MINI-JEU 3 — RÉSEAUX SOCIAUX
===================================================== */
function startMiniGame3(){
  showMiniGame();
  addTitle("Les réseaux sociaux");
  addText("Trouve les bons enjeux de ces réseaux sociaux.");

  const left=document.createElement("div");
  left.className="leftCol";
  const right=document.createElement("div");
  right.className="rightCol";

  let selected=null, ok=0;

  const platforms=[
    ["Instagram & TikTok","know"],
    ["Facebook & LinkedIn","btob"],
    ["Les sites de vente en ligne","btoc"]
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
    b.onclick=e=>{
      e.stopPropagation();
      selected={btn:b,key:p[1]};
    };
    left.appendChild(b);
  });

  targets.forEach(t=>{
    const b=document.createElement("button");
    b.className="btn-target";
    b.textContent=t[0];
    b.onclick=e=>{
      e.stopPropagation();
      if(selected && selected.key===t[1]){
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
  setTimeout(()=>location.href="menu.html",2800);
}

});
