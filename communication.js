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
   🎨 MINI-JEU 2 — IDENTITÉ VISUELLE (COMPLET & STABLE)
===================================================== */

/* ===============================
   INTRO IDENTITÉ VISUELLE
================================ */
function startIdentityIntro(){
  showMiniGame();

  addTitle("L’identité visuelle");

  addText(
    "Avant de créer un logo, des couleurs ou une typographie, tu dois d’abord savoir ce que tu veux montrer.",
    true
  );

  const btn = document.createElement("button");
  btn.textContent = "Voici les points importants à décider";
  btn.style.margin = "18px auto";

  const bubble = document.createElement("div");
  bubble.className = "info-bubble hidden";
  bubble.innerHTML = `
    • À qui tu parles<br>
    • Ton message principal<br>
    • L’émotion à transmettre<br>
    • Ton style visuel
  `;

  btn.onclick = e => {
    e.stopPropagation();
    bubble.classList.toggle("hidden");
  };

  miniGame.append(btn, bubble);

  addText(
    "👉 Si tu sais répondre à ces questions, ton identité visuelle sera plus simple, rapide à créer et facile à reconnaître."
  );

  miniGame.onclick = startLogo;
}

/* ===============================
   HELPER — IMAGES + LOADER
================================ */
function imageGroup(list, cb){
  const loader = document.createElement("div");
  loader.textContent = "⏳";
  loader.style.fontSize = "32px";
  loader.style.marginTop = "18px";
  miniGame.appendChild(loader);

  let loaded = 0;
  const wrap = document.createElement("div");
  wrap.className = "visualChoices";

  list.forEach(src=>{
    const box = document.createElement("div");

    const img = new Image();
    img.src = src;

    img.onload = ()=>{
      loaded++;
      if(loaded === list.length){
        loader.remove();
        miniGame.appendChild(wrap);
      }
    };

    img.onclick = cb;

    const zoom = document.createElement("button");
    zoom.textContent = "🔎";
    zoom.onclick = e=>{
      e.stopPropagation();
      zoomImage(src);
    };

    box.append(img, zoom);
    wrap.appendChild(box);
  });
}

function zoomImage(src){
  const f = document.createElement("div");
  f.id = "fadeScreen";

  const b = document.createElement("div");
  b.className = "loaderBox";

  const img = document.createElement("img");
  img.src = src;
  img.style.width = "300px";

  b.appendChild(img);
  f.appendChild(b);
  document.body.appendChild(f);

  f.onclick = ()=>f.remove();
}

/* ===============================
   LOGO
================================ */
function startLogo(){
  showMiniGame();

  addTitle("Ton logo");
  addText("Le choix est libre", true);

  imageGroup(
    ["images/Logo1.PNG","images/Logo2.PNG","images/Logo3.PNG"],
    logoExplanation
  );
}

function logoExplanation(){
  showMiniGame();

  addTitle("Logo — Explication");
  addText(
    "Le logo est le symbole principal qui permet de reconnaître ton projet.",
    true
  );

  const btn = document.createElement("button");
  btn.textContent = "En savoir plus";

  const bubble = document.createElement("div");
  bubble.className = "info-bubble hidden";
  bubble.innerHTML = `
    • Un logo doit être simple<br>
    • On doit le reconnaître rapidement<br>
    • Il doit fonctionner en petit et en grand<br>
    • Il ne doit pas être trop chargé
  `;

  btn.onclick = e=>{
    e.stopPropagation();
    bubble.classList.toggle("hidden");
  };

  miniGame.append(btn, bubble);

  addText("👉 Astuce : si tu peux dessiner ton logo en 5 secondes, c’est validé.");

  miniGame.onclick = startColors;
}

/* ===============================
   COULEURS
================================ */
function startColors(){
  showMiniGame();

  addTitle("Les couleurs");
  addText(
    "Les couleurs doivent être en cohérence avec le logo de la marque.",
    true
  );

  imageGroup(
    ["images/Couleur1.PNG","images/Couleur2.PNG","images/Couleur3.PNG"],
    colorsExplanation
  );
}

function colorsExplanation(){
  showMiniGame();

  addTitle("Les couleurs — Explication");

  const btn = document.createElement("button");
  btn.textContent = "En savoir plus";

  const bubble = document.createElement("div");
  bubble.className = "info-bubble hidden";
  bubble.innerHTML = `
    • Choisis 2 à 4 couleurs maximum<br>
    • Une couleur principale<br>
    • Une ou deux couleurs pour compléter<br>
    • Les couleurs doivent aller bien ensemble
  `;

  btn.onclick = e=>{
    e.stopPropagation();
    bubble.classList.toggle("hidden");
  };

  miniGame.append(btn, bubble);

  addText(
    "👉 Trop de couleurs = on ne comprend plus. Peu de couleurs = plus clair et plus fort."
  );

  miniGame.onclick = startTypo;
}

/* ===============================
   TYPOGRAPHIE
================================ */
function startTypo(){
  showMiniGame();

  addTitle("La typographie");
  addText(
    "La typographie doit rester en cohérence avec l’univers de ta marque.",
    true
  );

  imageGroup(
    ["images/Typo1.PNG","images/Typo2.PNG","images/Typo3.PNG"],
    typoExplanation
  );
}

function typoExplanation(){
  showMiniGame();

  addTitle("La typographie — Explication");

  const btn = document.createElement("button");
  btn.textContent = "En savoir plus";

  const bubble = document.createElement("div");
  bubble.className = "info-bubble hidden";
  bubble.innerHTML = `
    • Elle doit être facile à lire<br>
    • Elle doit correspondre à ton style<br>
    • Utilise 1 ou 2 écritures maximum<br>
    • La même écriture partout
  `;

  btn.onclick = e=>{
    e.stopPropagation();
    bubble.classList.toggle("hidden");
  };

  miniGame.append(btn, bubble);

  addText(
    "👉 Une bonne écriture rend ton projet plus sérieux et plus facile à comprendre."
  );

  miniGame.onclick = showIdentity;
}

/* ===============================
   IDENTITÉ VISUELLE FINALE
================================ */
function showIdentity(){
  hideMiniGame();

  const overlay = document.createElement("div");
  overlay.id = "fadeScreen";

  const box = document.createElement("div");
  box.className = "loaderBox";

  box.innerHTML = `
    <strong>Bravo, tu as créé ton identité visuelle</strong><br><br>
    <img 
      src="images/Identiteevisuelle.jpg"
      style="
        width:260px;
        border-radius:14px;
        box-shadow:0 0 25px rgba(255,215,100,.7);
        margin-bottom:14px;
      "
    >
    <p style="font-size:14px;opacity:.8;">
      Clique n’importe où pour continuer
    </p>
  `;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  overlay.onclick = ()=>{
    overlay.remove();
    afterMiniGame2(); // ➜ dialogues puis mini-jeu 3
  };
}

/* =====================================================
   💬 DIALOGUES — APRÈS IDENTITÉ VISUELLE
===================================================== */

function afterMiniGame2(){
  playDialog([
    {
      speaker: "pirate2",
      text: "Parfait. Ton identité visuelle est maintenant claire et reconnaissable."
    },
    {
      speaker: "pirate3",
      text: "Mais une identité seule ne suffit pas, capitaine."
    },
    {
      speaker: "pirate2",
      text: "Il faut maintenant la diffuser aux bonnes personnes."
    },
    {
      speaker: "pirate3",
      text: "Voyons quels réseaux utiliser selon l’objectif."
    }
  ], startMiniGame3);
}

/* =====================================================
   MINI-JEU 3 — RÉSEAUX SOCIAUX (VERSION FINALE)
===================================================== */
function startMiniGame3(){
  showMiniGame();
  addTitle("Les réseaux sociaux");
  addText("Trouve les bons enjeux pour chaque réseau social.");

  const left = document.createElement("div");
  left.className = "leftCol";

  const right = document.createElement("div");
  right.className = "rightCol";

  // SVG POUR LES TRAITS + FLÈCHES
  const svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.style.position = "absolute";
  svg.style.inset = "0";
  svg.style.pointerEvents = "none";
  miniGame.appendChild(svg);

  let selectedPlatform = null;
  let success = 0;

  const platforms = [
    { label:"Instagram & TikTok", key:"know" },
    { label:"Facebook & LinkedIn", key:"btob" },
    { label:"Les sites de vente en ligne", key:"btoc" }
  ];

  const targets = [
    { label:"Se faire connaître", key:"know" },
    { label:"Vendre en BtoB", key:"btob" },
    { label:"Vendre en BtoC", key:"btoc" }
  ];

  platforms.forEach(p=>{
    const btn = document.createElement("button");
    btn.className = "btn-platform";
    btn.textContent = p.label;
    btn.onclick = e=>{
      e.stopPropagation();
      selectedPlatform = { btn, key:p.key };
    };
    left.appendChild(btn);
  });

  targets.forEach(t=>{
    const btn = document.createElement("button");
    btn.className = "btn-target";
    btn.textContent = t.label;
    btn.onclick = e=>{
      e.stopPropagation();

      if(!selectedPlatform) return;

      if(selectedPlatform.key === t.key){
        drawArrow(svg, selectedPlatform.btn, btn);
        selectedPlatform.btn.remove();
        btn.remove();
        selectedPlatform = null;
        success++;

        if(success === 3){
          setTimeout(finish, 800);
        }
      } else {
        selectedPlatform = null;
        showWrong();
      }
    };
    right.appendChild(btn);
  });

  miniGame.append(left, right);
}

/* =====================================================
   DESSIN FLÈCHE + TRAIT
===================================================== */
function drawArrow(svg, fromBtn, toBtn){
  const r1 = fromBtn.getBoundingClientRect();
  const r2 = toBtn.getBoundingClientRect();
  const s  = svg.getBoundingClientRect();

  const x1 = r1.right - s.left;
  const y1 = r1.top + r1.height/2 - s.top;
  const x2 = r2.left - s.left;
  const y2 = r2.top + r2.height/2 - s.top;

  const line = document.createElementNS("http://www.w3.org/2000/svg","line");
  line.setAttribute("x1",x1);
  line.setAttribute("y1",y1);
  line.setAttribute("x2",x2);
  line.setAttribute("y2",y2);
  line.setAttribute("stroke","gold");
  line.setAttribute("stroke-width","4");

  const arrow = document.createElementNS("http://www.w3.org/2000/svg","polygon");
  arrow.setAttribute("points",`
    ${x2},${y2}
    ${x2-12},${y2-6}
    ${x2-12},${y2+6}
  `);
  arrow.setAttribute("fill","gold");

  svg.appendChild(line);
  svg.appendChild(arrow);
}

/* =====================================================
   ERREUR — SHAKE + LOADER
===================================================== */
function showWrong(){
  document.body.classList.add("shake");

  const f = document.createElement("div");
  f.id = "fadeScreen";
  f.innerHTML = `
    <div class="loaderBox">
      ❌ Non, tu t’es trompé 💥
    </div>
  `;
  document.body.appendChild(f);

  setTimeout(()=>{
    document.body.classList.remove("shake");
    f.remove();
  },1200);
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
