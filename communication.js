document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   RÉFÉRENCES DOM
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
const skipDialog = document.getElementById("skipDialog");

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
  showPirateLoader(()=>{
    scene.classList.remove("hidden");
  });
}

/* =====================================================
   💬 DIALOGUES + SKIP
===================================================== */
let dialogs = [];
let dialogIndex = 0;
let dialogCallback = null;

function playDialog(list, callback){
  dialogs = list;
  dialogIndex = 0;
  dialogCallback = callback;

  dialogBox.classList.remove("hidden");
  skipDialog.classList.remove("hidden");
  showDialog();
}

function showDialog(){
  const d = dialogs[dialogIndex];
  dialogText.textContent = d.text;

  const target = d.speaker === "pirate2" ? pirate2 : pirate3;
  const r = target.getBoundingClientRect();

  dialogBox.style.left = `${r.left + r.width/2 - dialogBox.offsetWidth/2}px`;
  dialogBox.style.top  = `${r.top - dialogBox.offsetHeight - 20}px`;
}

function endDialogs(){
  dialogBox.classList.add("hidden");
  skipDialog.classList.add("hidden");
  dialogCallback && dialogCallback();
}

dialogBox.onclick = ()=>{
  dialogIndex++;
  dialogIndex < dialogs.length ? showDialog() : endDialogs();
};

skipDialog.onclick = e=>{
  e.stopPropagation();
  endDialogs();
};

/* =====================================================
   🧰 HELPERS MINI-JEUX
===================================================== */
function clearMiniGame(){
  miniGame.innerHTML = "";
  miniGame.classList.remove("hidden");
}

function hideMiniGame(){
  miniGame.classList.add("hidden");
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

function infoBubble(html){
  const d = document.createElement("div");
  d.className = "info-bubble hidden";
  d.innerHTML = html;
  return d;
}

/* =====================================================
   🔔 NOTIFICATIONS
===================================================== */
function showNotification(text){
  const n = document.createElement("div");
  n.className = "notification success";
  n.innerHTML = `
    <div class="glow-text">Bonne réponse</div>
    <div style="margin-top:6px">${text}</div>
  `;
  document.body.appendChild(n);
  setTimeout(()=>n.remove(),1200);
}

/* =====================================================
   🏴‍☠️ LOADER GLOBAL
===================================================== */
function showPirateLoader(callback){
  const f = document.createElement("div");
  f.id = "fadeScreen";
  f.innerHTML = `
    <div class="loaderBox">
      <div style="font-size:48px">🏴‍☠️</div>
      <p>Chargement...</p>
    </div>
  `;
  document.body.appendChild(f);

  setTimeout(()=>{
    f.remove();
    callback && callback();
  }, 1400);
}

/* =====================================================
   🚀 DÉMARRAGE
===================================================== */
pirate3.onclick = ()=>{
  playDialog([
    {speaker:"pirate3", text:"Capitaine, ton trésor est prêt."},
    {speaker:"pirate2", text:"Mais sans communication, personne ne viendra."},
    {speaker:"pirate3", text:"Voyons comment attirer le marché."}
  ], startMiniGame1);
};

/* =====================================================
   🎯 MINI-JEU 1 — COMMUNICATION
===================================================== */
const quiz = [
  {t:"⚓ Visite physique",q:"Rencontrer un client permet de :",o:["Rassurer","Créer une connexion","Ignorer ses attentes"],g:[0,1]},
  {t:"📞 Phoning",q:"Le contact direct sert à :",o:["Comprendre les besoins","Créer une relation","Parler uniquement de prix"],g:[0,1]},
  {t:"📣 Réseaux sociaux",q:"Ils servent surtout à :",o:["Se faire connaître","Montrer son univers","Vendre immédiatement"],g:[0,1]},
  {t:"📧 Newsletter",q:"Une newsletter permet de :",o:["Rester présent","Créer un lien","Envoyer du spam"],g:[0,1]}
];

let qi = 0;
let selected = [];

function startMiniGame1(){
  qi = 0;
  showQuestion();
}

function showQuestion(){
  clearMiniGame();
  selected = [];

  const s = quiz[qi];
  addTitle(s.t);
  addText(s.q);
  addText("<span class='glow-red'>2 choix possibles</span>");

  s.o.forEach((txt,i)=>{
    const b = document.createElement("button");
    b.textContent = txt;
    b.style.display = "block";
    b.style.margin = "10px auto";

    b.onclick = ()=>{
      if(!selected.includes(i)) selected.push(i);
      if(check(s)){
        showNotification("Bien joué !");
        qi++;
        qi < quiz.length
          ? setTimeout(showQuestion,700)
          : showPirateLoader(afterMiniGame1);
      }else if(selected.length >= 2){
        selected = [];
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
   🎨 MINI-JEU 2 — IDENTITÉ VISUELLE
===================================================== */
function startIdentityIntro(){
  clearMiniGame();
  addTitle("L’identité visuelle");
  addText("Avant de créer un logo, des couleurs ou une typographie, tu dois savoir :",true);

  const btn = document.createElement("button");
  btn.textContent = "Les points importants de l'identité visuelle";

  const bubble = infoBubble(`
    • À qui tu parles<br>
    • Ce que tu veux dire<br>
    • Ce que tu veux faire ressentir<br>
    • Ton style
  `);

  btn.onclick = ()=>bubble.classList.toggle("hidden");
  miniGame.append(btn,bubble);

  const next = document.createElement("button");
  next.textContent = "Continuer";
  next.onclick = logoExplanation;
  miniGame.appendChild(next);
}

function logoExplanation(){
  clearMiniGame();
  addTitle("Le logo");
  addText("Le logo est le symbole principal de ton projet.",true);

  const btn = document.createElement("button");
  btn.textContent = "En savoir plus";

  const bubble = infoBubble(`
    • Simple<br>
    • Reconnaissable<br>
    • Lisible partout<br>
    • Pas trop chargé
  `);

  btn.onclick = ()=>bubble.classList.toggle("hidden");
  miniGame.append(btn,bubble);

  const next = document.createElement("button");
  next.textContent = "Choisir un logo";
  next.onclick = startLogo;
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

function colorsExplanation(){
  clearMiniGame();
  addTitle("La palette de couleur");
  addText("Choisis peu de couleurs cohérentes.",true);

  const next = document.createElement("button");
  next.textContent = "Choisir les couleurs";
  next.onclick = startColors;
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

function typoExplanation(){
  clearMiniGame();
  addTitle("La typographie");
  addText("Elle reflète l'univers de ta marque.",true);

  const next = document.createElement("button");
  next.textContent = "Choisir la typographie";
  next.onclick = startTypo;
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

function showIdentity(){
  hideMiniGame();
  showPirateLoader(afterMiniGame2);
}

function imageGroup(list, cb){
  const wrap = document.createElement("div");
  wrap.className = "visualChoices";
  list.forEach(src=>{
    const img = new Image();
    img.src = src;
    img.onclick = cb;
    wrap.appendChild(img);
  });
  miniGame.appendChild(wrap);
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
   🔗 MINI-JEU 3 — RÉSEAUX
===================================================== */
function startMiniGame3(){
  clearMiniGame();
  addTitle("Les réseaux sociaux");
  addText("Associe chaque réseau à son objectif.");

  const left = document.createElement("div");
  const right = document.createElement("div");

  let selected = null;
  let ok = 0;

  const platforms = [
    ["Instagram & TikTok","know"],
    ["Facebook & LinkedIn","btob"],
    ["Sites e-commerce","btoc"]
  ];

  const targets = [
    ["Se faire connaître","know"],
    ["Vendre en BtoB","btob"],
    ["Vendre en BtoC","btoc"]
  ];

  platforms.forEach(p=>{
    const b = document.createElement("button");
    b.textContent = p[0];
    b.onclick = ()=>selected = {btn:b,key:p[1]};
    left.appendChild(b);
  });

  targets.forEach(t=>{
    const b = document.createElement("button");
    b.textContent = t[0];
    b.onclick = ()=>{
      if(selected && selected.key === t[1]){
        showNotification("Bonne réponse");
        selected.btn.remove();
        b.remove();
        selected = null;
        ok++;
        if(ok === 3) showPirateLoader(finish);
      }
    };
    right.appendChild(b);
  });

  miniGame.append(left,right);
}

/* =====================================================
   🏁 FIN
===================================================== */
function finish(){
  hideMiniGame();
  sessionStorage.setItem("unlock_pirate5","true");
  location.href = "menu.html";
}

});
