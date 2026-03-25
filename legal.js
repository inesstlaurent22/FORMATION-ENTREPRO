document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   🌑 LOADER GLOBAL
===================================================== */

const fadeScreen = document.getElementById("fadeScreen");

function showLoader(duration = 1200, cb){
  if(!fadeScreen){
    cb && cb();
    return;
  }

  fadeScreen.classList.remove("hidden");

  setTimeout(() => {
    fadeScreen.classList.add("hidden");
    if(typeof cb === "function"){
      cb();
    }
  }, duration);
}

function shake(el){

  if(!el) return;

  const box = el.closest("#miniGame, #miniGame2, #miniGame3, #miniGame4");

  if(!box) return;

  box.classList.remove("screen-shake");
  void box.offsetWidth;
  box.classList.add("screen-shake");

  setTimeout(()=>{
    box.classList.remove("screen-shake");
  },400);

}

/* =====================================================
   💾 PROGRESSION (ANTI-RETOUR)
===================================================== */

const PROGRESS_KEY = "legal_progress_v1";

const stepsOrder = [
  "dialogue1",
  "game1",
  "dialogue2",
  "game2",
  "dialogue3",
  "game3",
  "dialogueFinal",
  "game4"
];

function getProgress(){
  return JSON.parse(sessionStorage.getItem(PROGRESS_KEY) || "{}");
}

function setStepDone(step){
  const progress = getProgress();
  progress[step] = true;
  sessionStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  updateProgressBar();
}

function isStepDone(step){
  return !!getProgress()[step];
}

/* Trouve la prochaine étape à jouer */
function getNextStep(){
  const progress = getProgress();
  return stepsOrder.find(step => !progress[step]);
}

function startProgressFlow(){

  const next = getNextStep();

  switch(next){
    case "dialogue1": startDialogues1(); break;
    case "game1": startMiniGame1(); break;
    case "dialogue2": startDialogues2(); break;
    case "game2": startMiniGame2(); break;
    case "dialogue3": startDialoguesTVA(); break;
    case "game3": startMiniGame3(); break;
    case "dialogueFinal": startDialoguesFinal(); break;
    case "game4": startMiniGame4(); break;
    default:
      showLegalWin();
  }
}

/* =====================================================
   📊 PROGRESS BAR UI
===================================================== */

function createProgressBar(){

  const bar = document.createElement("div");
  bar.id = "progressBar";

  stepsOrder.forEach(step=>{
    const item = document.createElement("div");
    item.className = "progress-step";

    item.dataset.step = step;

    item.textContent = step.includes("dialogue") ? "💬" : "🎮";

    bar.appendChild(item);
  });

  document.body.appendChild(bar);

  updateProgressBar();
}

function updateProgressBar(){

  const progress = getProgress();

  document.querySelectorAll(".progress-step").forEach(el=>{
    const step = el.dataset.step;

    if(progress[step]){
      el.classList.add("done");
    } else {
      el.classList.remove("done");
    }
  });
}

/* =====================================================
   🎬 VIDÉO
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const video = document.getElementById("questVideo");
const skipBtn = document.getElementById("closeVideo");
const soundBtn = document.getElementById("toggleSound");
const scene = document.getElementById("scene");
const pirateLegal = document.getElementById("pirateLegal");
   
let videoEnded = false;

/* Sécurité : vérifier que tout existe */
if(video && soundBtn && skipBtn){

  video.muted = true;

  soundBtn.addEventListener("click", (e)=>{
    e.stopPropagation();
    video.muted = !video.muted;
    soundBtn.textContent = video.muted ? "🔇" : "🔊";
  });

  skipBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    e.stopPropagation();
    endVideo();
  });

  video.addEventListener("ended", endVideo);
}

function endVideo(){

  if(videoEnded) return;
  videoEnded = true;

  /* Stop vidéo */
  if(video){
    video.pause();
    video.removeAttribute("src");
    video.load();
  }

  /* Cache le conteneur vidéo */
  if(videoContainer){
    videoContainer.classList.add("hidden");
  }

  /* Loader puis affichage de la scène */
  showLoader(1200, () => {

    if(scene){
      scene.style.display = "block";
    }

    if(pirateLegal){
  pirateLegal.style.pointerEvents = "auto";

  pirateLegal.onclick = startProgressFlow;
}

  });

}

/* =====================================================
   🔘 EFFETS BOUTONS MINI-JEUX
===================================================== */

document.addEventListener("click", function(e){

  const btn = e.target.closest("button");
  if(!btn) return;

  /* Exclure boutons vidéo et statut */
  if(
    btn.id === "solo" ||
    btn.id === "groupe" ||
    btn.id === "toggleSound" ||
    btn.id === "closeVideo" ||
    btn.id === "skipDialoguesBtn" ||
    btn.getAttribute("onclick")?.includes("statutQ2")
  ){
    return;
  }

  btn.classList.add("pressed");
  setTimeout(()=>btn.classList.remove("pressed"),120);

});

/* =====================================================
   ⏭ BOUTON SKIP DIALOGUES
===================================================== */
let currentDialogueCallback = null;
let skipBtnDialogues = null;

function createSkipDialoguesBtn(callback){
  removeSkipDialoguesBtn();

  currentDialogueCallback = callback;

  skipBtnDialogues = document.createElement("button");
  skipBtnDialogues.id = "skipDialoguesBtn";
  skipBtnDialogues.textContent = "Passer les dialogues";
   
  skipBtnDialogues.onclick = () => {
  dLegal.style.display = "none";
  dPirate.style.display = "none";
  removeSkipDialoguesBtn();

  // 🔥 marque comme terminé
  if(currentDialogueCallback){
    currentDialogueCallback();
  }
};

  document.body.appendChild(skipBtnDialogues);
}

function removeSkipDialoguesBtn(){
  if(skipBtnDialogues){
    skipBtnDialogues.remove();
    skipBtnDialogues = null;
  }
}
   
/* =====================================================
   🏴‍☠️ PIRATES & DIALOGUES
===================================================== */
const dLegal = document.getElementById("dialogueLegal");
const dPirate = document.getElementById("dialoguePirate");

if(!dLegal || !dPirate){
  console.error("Dialogues introuvables");
  return;
}
   
let dIndex = 0;

function runDialogues(list, callback){

  createSkipDialoguesBtn(callback);

  function next(){
    if(dIndex >= list.length){
      dLegal.style.display = "none";
      dPirate.style.display = "none";
      removeSkipDialoguesBtn();
      callback && callback();
      return;
    }

    const cur = list[dIndex];
    cur.el.innerHTML = `<p>${cur.text}</p>`;
    cur.el.style.display = "block";
    cur.el.onclick = () => {
      cur.el.style.display = "none";
      dIndex++;
      next();
    };
  }

  next();
}

/* =====================================================
   💬 DIALOGUES 1 — URSSAF
===================================================== */
const dialoguesStatutIntro = [
  { el:dLegal, text:"Avant de créer ton empire… il faut choisir ton <strong>statut juridique</strong>." },

  { el:dPirate, text:"<strong>Auto-entrepreneur</strong> ou <strong>société</strong>… ce choix peut changer tout ton trésor." },

  { el:dLegal, text:"L’<strong>auto-entrepreneur</strong> est <strong>simple</strong>, <strong>rapide</strong> et avec <strong>peu de gestion</strong>." },

  { el:dLegal, text:"Parfait pour <strong>démarrer</strong>, <strong>tester une idée</strong> ou générer ses <strong>premiers revenus</strong>." },

  { el:dPirate, text:"Mais attention… ton <strong>chiffre d’affaires est plafonné</strong> et tu es <strong>limité pour grandir</strong>." },

  { el:dLegal, text:"La <strong>société</strong>, elle, permet d’aller plus loin : <strong>plus de crédibilité</strong> et <strong>plus de possibilités</strong>." },

  { el:dLegal, text:"Tu peux <strong>embaucher</strong>, <strong>t’associer</strong> et <strong>protéger ton patrimoine</strong>." },

  { el:dPirate, text:"Mais elle demande <strong>plus de gestion</strong> et <strong>plus d’organisation</strong>." },

  { el:dLegal, text:"Alors comment choisir ?" },

  { el:dLegal, text:"👉 Tu <strong>débutes</strong> ? Tu veux <strong>tester</strong> ? Choisis l’<strong>auto-entreprise</strong>." },

  { el:dLegal, text:"👉 Tu veux <strong>développer</strong>, <strong>structurer</strong> ou <strong>t’associer</strong> ? Passe en <strong>société</strong>." },

  { el:dPirate, text:"<strong>SASU</strong>, <strong>EURL</strong>, <strong>SAS</strong>, <strong>SARL</strong>… chaque navire a ses propres règles." },

  { el:dLegal, text:"<strong>Seul</strong> ? <strong>SASU</strong> ou <strong>EURL</strong>." },

  { el:dLegal, text:"<strong>À plusieurs</strong> ? <strong>SAS</strong> ou <strong>SARL</strong>." },

  { el:dPirate, text:"Ton choix dépend de ton <strong>ambition</strong>… et de la <strong>taille de ton futur trésor</strong>." },

  { el:dLegal, text:"Voyons si tu es prêt à faire le bon choix." }
];

function startDialogues1(){
  if(isStepDone("dialogue1")) return startMiniGame1();

  dIndex = 0;
  pirateLegal.classList.add("noGlow");

  runDialogues(dialoguesStatutIntro, ()=>{
    setStepDone("dialogue1");
    startMiniGame1();
  });
}
   
/* =====================================================
   🎮 MINI-JEU 1 — AUTO-ENTREPRENEUR
===================================================== */
const miniGame1 = document.getElementById("miniGame");

const aeQuestions = [
  {
    q:"Quel est le principal avantage de l’auto-entrepreneur ?",
    good:[
      "Une création simple et rapide",
      "Peu de gestion administrative"
    ],
    bad:[
      "Aucun plafond de chiffre d’affaires",
      "Une structure idéale pour s’associer"
    ]
  },
  {
    q:"Pourquoi choisir l’auto-entrepreneur ?",
    good:[
      "Pour tester une idée",
      "Pour démarrer une activité",
      "Pour générer ses premiers revenus"
    ],
    bad:[
      "Pour embaucher une équipe rapidement"
    ]
  },
  {
    q:"Quelles sont les limites de l’auto-entrepreneur ?",
    good:[
      "Un chiffre d’affaires plafonné",
      "Des limites pour développer son activité"
    ],
    bad:[
      "Une gestion trop complexe",
      "Des obligations comptables lourdes"
    ]
  },
  {
    q:"Quels sont les avantages d’une société ?",
    good:[
      "Plus de crédibilité",
      "Possibilité d’embaucher",
      "Possibilité de s’associer"
    ],
    bad:[
      "Aucune formalité",
      "Aucune gestion"
    ]
  },
  {
    q:"Pourquoi choisir une société ?",
    good:[
      "Pour développer son activité",
      "Pour structurer son business",
      "Pour s’associer"
    ],
    bad:[
      "Pour éviter toute gestion"
    ]
  },
  {
    q:"Comment choisir entre auto-entrepreneur et société ?",
    good:[
      "Auto-entrepreneur pour démarrer ou tester",
      "Société pour développer et grandir"
    ],
    bad:[
      "Choisir au hasard",
      "Toujours choisir la société"
    ]
  }
];

let aeIndex = 0, aeGood = 0;

function startMiniGame1(){
  showLoader(1200, ()=>{

  scene.classList.add("sceneDim");
  miniGame1.style.display = "block";
  miniGame1.innerHTML = `
  <h3>📜 Devoirs de l’auto-entrepreneur</h3>
  <div id="qText" class="gameQuestion"></div>
  <div id="qChoices"></div>
  `;

  aeIndex = 0;
  showAEQuestion();

  });
}

function showAEQuestion(){

  /* Sécurité si index dépasse */
  if(aeIndex >= aeQuestions.length){
    endMiniGame1();
    return;
  }

  aeGood = 0;

  const questionData = aeQuestions[aeIndex];

  const qText = document.getElementById("qText");
  const box = document.getElementById("qChoices");

  qText.textContent = questionData.q;
  box.innerHTML = "";

  /* Fusion + shuffle propre */
  const answers = [
    ...questionData.good.map(t => ({ text:t, ok:true })),
    ...questionData.bad.map(t => ({ text:t, ok:false }))
  ].sort(() => Math.random() - 0.5);

  answers.forEach(answer => {

    const b = document.createElement("button");
    b.textContent = answer.text;

    b.onclick = () => {

      /* Bloque double clic */
      if(b.disabled) return;

      /* Effet bouton appuyé */
      b.classList.add("pressed");
      setTimeout(()=>b.classList.remove("pressed"),120);

      if(answer.ok){

        b.classList.add("correct-locked");
        b.disabled = true;

        aeGood++;

        /* Si toutes les bonnes réponses trouvées */
        if(aeGood === questionData.good.length){

          /* Désactive tous les boutons restants */
          box.querySelectorAll("button").forEach(btn=>{
            btn.disabled = true;
          });

          setTimeout(()=>{
            aeIndex++;
            showAEQuestion();
          }, 500);
        }

      } else {
        shake(b);
      }
    };

    box.appendChild(b);
  });
}

function endMiniGame1(){
  setStepDone("game1");

  miniGame1.style.display = "none";
  scene.classList.remove("sceneDim");
  startDialogues2();
}

/* =====================================================
   💬 DIALOGUES 2 — STATUT
===================================================== */
const dialogues2 = [
  { el:dLegal, text:"Tu veux passer en <strong>société</strong> ? Alors choisis le bon navire." },

  { el:dPirate, text:"<strong>SASU</strong>, <strong>EURL</strong>, <strong>SAS</strong>, <strong>SARL</strong>… chacun a ses règles." },

  { el:dLegal, text:"👉 <strong>Tu es seul</strong> ? Tu peux choisir entre <strong>SASU</strong> et <strong>EURL</strong>." },

  { el:dLegal, text:"La <strong>SASU</strong> offre <strong>flexibilité</strong> et <strong>protection sociale élevée</strong>." },

  { el:dLegal, text:"L’<strong>EURL</strong> permet de <strong>payer moins de charges</strong>, mais avec une <strong>protection plus faible</strong>." },

  { el:dPirate, text:"👉 <strong>Vous êtes plusieurs</strong> ? Direction <strong>SAS</strong> ou <strong>SARL</strong>." },

  { el:dLegal, text:"La <strong>SAS</strong> est idéale pour <strong>accueillir des investisseurs</strong> et évoluer facilement." },

  { el:dLegal, text:"La <strong>SARL</strong> est plus <strong>encadrée</strong>, souvent choisie pour des projets <strong>familiaux</strong>." },

  { el:dPirate, text:"Et les limites dans tout ça ?" },

  { el:dLegal, text:"Contrairement à l’auto-entrepreneur, une <strong>société n’a pas de plafond de chiffre d’affaires</strong>." },

  { el:dLegal, text:"Mais attention : plus tu gagnes, plus la <strong>gestion</strong> et les <strong>obligations comptables</strong> augmentent." },

  { el:dPirate, text:"Alors… quand passer en société ?" },

  { el:dLegal, text:"👉 Quand ton <strong>chiffre d’affaires dépasse les seuils de l’auto-entrepreneur</strong>." },

  { el:dLegal, text:"👉 Quand tu veux <strong>embaucher</strong>, <strong>t’associer</strong> ou <strong>développer ton activité</strong>." },

  { el:dPirate, text:"👉 Ou quand tu veux protéger ton <strong>patrimoine</strong> comme un vrai capitaine." },

  { el:dLegal, text:"Chaque statut a ses avantages… tout dépend de ton <strong>projet</strong> et de ton <strong>ambition</strong>." },

  { el:dLegal, text:"Voyons maintenant si tu sais choisir le bon statut." }
];

function startDialogues2(){
  if(isStepDone("dialogue2")) return startMiniGame2();

  dIndex = 0;

  runDialogues(dialogues2, ()=>{
    setStepDone("dialogue2");
    startMiniGame2();
  });
}

/* =====================================================
   🎮 MINI-JEU 2 — STATUT JURIDIQUE
===================================================== */
const miniGame2 = document.getElementById("miniGame2");
const game2Content = document.getElementById("game2Content");

let q1 = new Set(), q2 = new Set(), q3 = new Set();

function startMiniGame2(){
  showLoader(1200, ()=>{

  scene.classList.add("sceneDim");
  miniGame2.style.display = "block";
  q1.clear();
  showStatutQ1();

  });

}

function showStatutQ1(){
  game2Content.innerHTML = `
    <h3>📜 Choisir son statut</h3>
    <p>Crées-tu ta société seul ou en groupe ?</p>

    <div class="status-cards">

 <div class="status-card" onclick="statutQ1('solo', this)">
  <div class="status-card-inner">

    <div class="status-face status-front">
      Créer seul
    </div>

    <div class="status-face status-back">
      EI · EURL · SASU
    </div>

  </div>
</div>

      <div class="status-card" onclick="statutQ1('groupe', this)">
        <div class="status-card-inner">

          <div class="status-face status-front">
            Créer à plusieurs
          </div>

          <div class="status-face status-back">
            SARL · SAS
          </div>

        </div>
      </div>

    </div>

    <p style="color:gold;margin-top:12px;">Clique sur les deux options</p>
  `;
}

window.statutQ1 = function(type, card){

  if(q1.has(type)) return;

  q1.add(type);

  card.classList.add("flipped");

  if(q1.size === 2){
    setTimeout(showStatutQ2,1200);
  }
}

   function showStatutQ2(){
  q2.clear();

  game2Content.innerHTML = `
    <h3>📜 Les avantages des statuts</h3>
    <div class="status-cards">

    <div class="status-card" onclick="statutQ2(this,'EURL')">
      <div class="status-card-inner">

        <div class="status-face status-front">
          💰 Charges réduites
        </div>

        <div class="status-face status-back">
          L’<strong>EURL</strong> permet de payer <strong>moins de cotisations sociales</strong> qu’une SASU.
        </div>

      </div>
    </div>

    <div class="status-card" onclick="statutQ2(this,'SASU')">
      <div class="status-card-inner">

        <div class="status-face status-front">
          🛡️ Protection sociale
        </div>

        <div class="status-face status-back">
          La <strong>SASU</strong> offre une <strong>meilleure protection sociale</strong> (assimilé salarié).
        </div>

      </div>
    </div>

    <div class="status-card" onclick="statutQ2(this,'SAS')">
      <div class="status-card-inner">

        <div class="status-face status-front">
          🚀 Évolution rapide
        </div>

        <div class="status-face status-back">
          La <strong>SAS</strong> est idéale pour <strong>faire entrer des investisseurs</strong> et évoluer.
        </div>

      </div>
    </div>

    <div class="status-card" onclick="statutQ2(this,'SARL')">
      <div class="status-card-inner">

        <div class="status-face status-front">
          👨‍👩‍👧‍👦 Cadre sécurisé
        </div>

        <div class="status-face status-back">
          La <strong>SARL</strong> est plus <strong>encadrée juridiquement</strong>, souvent utilisée en famille.
        </div>

      </div>
    </div>

    <div class="status-card" onclick="statutQ2(this,'GLOBAL')">
      <div class="status-card-inner">

        <div class="status-face status-front">
          📈 Sans limite
        </div>

        <div class="status-face status-back">
          En <strong>société</strong>, il n’y a <strong>aucun plafond de chiffre d’affaires</strong>.
        </div>

      </div>
    </div>

  </div>
  `;
} // ✅ ICI tu fermes la fonction


window.statutQ2 = function(card, statut){

  if(q2.has(statut)) return;

  q2.add(statut);

  card.classList.add("flipped");

  if(q2.size === 5){
    setTimeout(showStatutQ3,1200);
  }
}

function showStatutQ3(){
  q3.clear();
  game2Content.innerHTML = `
  <div class="gameQuestion">
    Quand quitter l'auto-entreprenariat pour un statut de société :
  </div>

  <div id="qChoices">
    <button onclick="statutQ3(this,1)">CA élevé</button>
    <button onclick="statutQ3(this,2)">Embauche</button>
    <button onclick="statutQ3(this,3)">Peu de charges</button>
    <button onclick="statutQ3(this,0)">Jamais</button>
  </div>
`;
}

window.statutQ3 = function(btn,val){

  if(!btn) return;

  /* effet bouton appuyé */
  btn.classList.add("pressed");
  setTimeout(()=>btn.classList.remove("pressed"),120);

  /* mauvaise réponse */
  if(val === 0){
    shake(btn);
    return;
  }

  /* éviter double clic */
  if(q3.has(val)) return;

  q3.add(val);

  /* verrouille le bouton */
  btn.disabled = true;
  btn.classList.add("correct-locked");

  /* fin du mini jeu */
  if(q3.size === 3){

  setTimeout(()=>{
    setStepDone("game2");

    miniGame2.style.display = "none";
    scene.classList.remove("sceneDim");
    startDialoguesTVA();
  },400);

}
};

/* =====================================================
   💬 DIALOGUES 3 — TVA
===================================================== */
const dialoguesTVA = [
  { el:dLegal, text:"Parlons maintenant de la <strong>TVA</strong>… un passage obligé pour tout entrepreneur." },

  { el:dPirate, text:"Que tu sois en <strong>auto-entrepreneur</strong> ou en <strong>société</strong>… tu peux être concerné." },

  { el:dLegal, text:"En <strong>société</strong>, la règle est simple : tu es <strong>presque toujours soumis à la TVA</strong>." },

  { el:dLegal, text:"Tu <strong>collectes la TVA</strong> sur tes ventes… puis tu la <strong>reverses à l’État</strong>." },

  { el:dPirate, text:"Mais bonne nouvelle… tu peux aussi récupérer de l’or." },

  { el:dLegal, text:"👉 Tu peux <strong>déduire la TVA</strong> sur tes <strong>dépenses professionnelles</strong>." },

  { el:dLegal, text:"C’est ce qu’on appelle la <strong>TVA déductible</strong>." },

  { el:dLegal, text:"👉 Tu fais : <strong>TVA collectée - TVA déductible = TVA à payer</strong>." },

  { el:dPirate, text:"Et pour l’auto-entrepreneur ?" },

  { el:dLegal, text:"Il existe <strong>deux situations</strong>." },

  { el:dLegal, text:"👉 Le régime <strong>micro (franchise en base)</strong> : tu ne factures <strong>pas de TVA</strong>." },

  { el:dLegal, text:"Mais tu ne peux pas non plus <strong>récupérer la TVA</strong> sur tes dépenses." },

  { el:dLegal, text:"👉 Si tu dépasses certains <strong>seuils de chiffre d’affaires</strong>, tu deviens <strong>assujetti à la TVA</strong>." },

  { el:dPirate, text:"Et là… tu joues dans la cour des grands." },

  { el:dLegal, text:"Tu dois <strong>facturer la TVA</strong>, la <strong>déclarer</strong>… et tu peux enfin <strong>déduire tes charges</strong>." },

  { el:dLegal, text:"👉 Exemple : tu achètes un outil avec TVA… tu peux <strong>récupérer cette TVA</strong>." },

  { el:dPirate, text:"Moins tu payes de TVA… plus tu gardes de trésor." },

  { el:dLegal, text:"Maîtriser la <strong>TVA</strong>, c’est <strong>protéger ta rentabilité</strong>." },

  { el:dLegal, text:"Voyons maintenant si tu sais la calculer correctement." }
];

function startDialoguesTVA(){
  if(isStepDone("dialogue3")) return startMiniGame3();

  dIndex = 0;

  runDialogues(dialoguesTVA, ()=>{
    setStepDone("dialogue3");
    startMiniGame3();
  });
}

/* =====================================================
   🎮 MINI-JEU 3 — TVA QCM
===================================================== */
const miniGame3 = document.getElementById("miniGame3");

const tvaQ = [
  {
    q:"En société, suis-je soumis à la TVA ?",
    good:[
      "Oui, dans la majorité des cas"
    ],
    bad:[
      "Non, jamais",
      "Seulement la première année",
      "Uniquement si je dépasse un seuil"
    ]
  },
  {
    q:"La TVA collectée correspond à :",
    good:[
      "La TVA que je facture à mes clients"
    ],
    bad:[
      "La TVA que je garde",
      "Une taxe optionnelle",
      "La TVA sur mes achats"
    ]
  },
  {
    q:"La TVA déductible correspond à :",
    good:[
      "La TVA sur mes dépenses professionnelles"
    ],
    bad:[
      "La TVA que je donne à l’État",
      "Une taxe fixe",
      "Une pénalité"
    ]
  },
  {
    q:"Comment calcule-t-on la TVA à payer ?",
    good:[
      "TVA collectée - TVA déductible"
    ],
    bad:[
      "TVA collectée + TVA déductible",
      "Chiffre d’affaires - TVA",
      "TVA × 2"
    ]
  },
  {
    q:"Auto-entrepreneur en franchise de TVA :",
    good:[
      "Je ne facture pas de TVA",
      "Je ne récupère pas la TVA"
    ],
    bad:[
      "Je récupère la TVA",
      "Je dois reverser la TVA"
    ]
  },
  {
    q:"Tu encaisses 200€ de TVA et tu as 50€ de TVA sur tes dépenses. Combien dois-tu reverser ?",
    good:[
      "150 €"
    ],
    bad:[
      "200 €",
      "50 €",
      "250 €"
    ]
  },
  {
    q:"Tu factures 120€ TTC avec 20€ de TVA. Le prix HT est :",
    good:[
      "100 €"
    ],
    bad:[
      "120 €",
      "140 €",
      "80 €"
    ]
  },
  {
    q:"Pourquoi récupérer la TVA est important ?",
    good:[
      "Réduire ses coûts",
      "Améliorer sa rentabilité"
    ],
    bad:[
      "Augmenter ses taxes",
      "Payer plus à l’État"
    ]
  }
];

let tvaI = 0, tvaGood = 0;

function startMiniGame3(){
  showLoader(1200, ()=>{

  scene.classList.add("sceneDim");
  miniGame3.style.display = "block";
  miniGame3.innerHTML = `
  <h3>💰 TVA</h3>
  <div id="tvaQ" class="gameQuestion"></div>
  <div id="tvaChoices"></div>
  `;

  tvaI = 0;
  showTVAQ();

  });

}

function showTVAQ(){
  tvaGood = 0;
  document.getElementById("tvaQ").textContent = tvaQ[tvaI].q;
  const box = document.getElementById("tvaChoices");
  box.innerHTML = "";

  [...tvaQ[tvaI].good.map(t=>({t,ok:true})),...tvaQ[tvaI].bad.map(t=>({t,ok:false}))]
  .sort(()=>Math.random()-0.5)
  .forEach(a=>{
    const b = document.createElement("button");
    b.textContent = a.t;
b.onclick = ()=>{

  b.classList.add("pressed");
  setTimeout(()=>b.classList.remove("pressed"),120);

  if(a.ok){
    b.classList.add("correct-locked");
    b.disabled = true;
        tvaGood++;
        if(tvaGood === tvaQ[tvaI].good.length){
          tvaI++;
          tvaI < tvaQ.length ? showTVAQ() : endMiniGame3();
        }
      } else shake(b);
    };
    box.appendChild(b);
  });
}

function endMiniGame3(){
  setStepDone("game3");

  miniGame3.style.display = "none";
  scene.classList.remove("sceneDim");
  startDialoguesFinal();
}

/* =====================================================
   💬 DIALOGUES FINALS
===================================================== */
const dialoguesFinal = [
  { el:dLegal, text:"Très bon travail… tu maîtrises désormais les bases de la <strong>TVA</strong>." },

  { el:dPirate, text:"Collecter, déduire, calculer… rien ne t’échappe." },

  { el:dLegal, text:"Tu sais maintenant faire : <strong>TVA collectée - TVA déductible</strong>." },

  { el:dLegal, text:"Et surtout… tu comprends <strong>quand tu dois la payer</strong> et <strong>comment l’optimiser</strong>." },

  { el:dPirate, text:"Même les coffres fiscaux ne te résistent plus." },

  { el:dLegal, text:"Tes compétences sont désormais <strong>validées</strong>." },

  { el:dLegal, text:"Tu es prêt à gérer ton activité en toute <strong>légalité</strong>." },

  { el:dPirate, text:"Un vrai capitaine… prêt à naviguer sans risque." },

  { el:dLegal, text:"Félicitations. La quête <strong>Legal</strong> est terminée." }
];

function startDialoguesFinal(){
  if(isStepDone("dialogueFinal")) return startMiniGame4();

  dIndex = 0;

  runDialogues(dialoguesFinal, ()=>{
    setStepDone("dialogueFinal");
    startMiniGame4();
  });
}

/* =====================================================
   🎮 MINI-JEU 4 — COFFRE TVA
===================================================== */
const miniGame4 = document.getElementById("miniGame4");
let step4 = 0;

function startMiniGame4(){
  showLoader(1200, ()=>{

  scene.classList.add("sceneDim");
  miniGame4.style.display = "block";
  step4 = 0;
  showCoffreTVA();

  });

}

function showCoffreTVA(){

  const steps = [

  /* Étape 1 */
  `
  <h3>💰 Coffre de la TVA</h3>
  <p>Tu encaisses <strong>200 € de TVA</strong> auprès de tes clients.</p>

  <div class="gameQuestion">Que représente cette somme ?</div>

  <div id="qChoices">
    <button onclick="coffreAnswer(false,this)">Mon bénéfice</button>
    <button onclick="coffreAnswer(true,this)">De l'argent pour l’État</button>
    <button onclick="coffreAnswer(false,this)">Un bonus</button>
  </div>
  `,

  /* Étape 2 */
  `
  <h3>🧾 Dépense professionnelle</h3>
  <p>Tu achètes un logiciel : <strong>120 € TTC</strong> dont <strong>20 € de TVA</strong>.</p>

  <div class="gameQuestion">Que peux-tu faire de cette TVA ?</div>

  <div id="qChoices">
    <button onclick="coffreAnswer(true,this)">La récupérer</button>
    <button onclick="coffreAnswer(false,this)">La perdre définitivement</button>
    <button onclick="coffreAnswer(false,this)">La donner à un client</button>
  </div>
  `,

  /* Étape 3 */
  `
  <h3>⚖️ Calcul de la TVA</h3>
  <p><strong>TVA collectée : 200 €</strong></p>
  <p><strong>TVA déductible : 20 €</strong></p>

  <div class="gameQuestion">Combien dois-tu reverser à l’État ?</div>

  <div id="qChoices">
    <button onclick="coffreAnswer(false,this)">200 €</button>
    <button onclick="coffreAnswer(true,this)">180 €</button>
    <button onclick="coffreAnswer(false,this)">20 €</button>
  </div>
  `,

  /* Étape 4 */
  `
  <h3>🧠 Logique TVA</h3>

  <div class="gameQuestion">La bonne formule est :</div>

  <div id="qChoices">
    <button onclick="coffreAnswer(true,this)">TVA collectée - TVA déductible</button>
    <button onclick="coffreAnswer(false,this)">TVA collectée + TVA déductible</button>
    <button onclick="coffreAnswer(false,this)">Chiffre d’affaires - TVA</button>
  </div>
  `,

  /* Étape 5 — Résumé */
  `
  <h3>📜 Résumé</h3>
  <p>Tu as compris le mécanisme :</p>

  <p>💰 <strong>200 € collectés</strong></p>
  <p>🧾 <strong>20 € récupérés</strong></p>
  <p>🏛️ <strong>180 € reversés</strong></p>

  <div id="qChoices">
    <button onclick="endMiniGame4()">Valider</button>
  </div>
  `
];

  miniGame4.innerHTML = steps[step4];
}

window.endMiniGame4 = function(){

  setStepDone("game4");

  miniGame4.style.display = "none";
  scene.classList.remove("sceneDim");
  showLegalWin();
};


/* =====================================================
   ▶️ AVANCEMENT ÉTAPES
===================================================== */
window.coffreAnswer = function(good,btn){

  if(btn){
    btn.classList.add("pressed");
    setTimeout(()=>btn.classList.remove("pressed"),120);
  }

  if(!good){
    shake(btn);
    return;
  }

  step4++;

  if(step4 < 4){
  showCoffreTVA();
} else {
  showCoffreTVA();
}
};
   
/* =====================================================
   🏆 VICTOIRE LEGAL
===================================================== */
window.showLegalWin = function(){

  const overlay = document.createElement("div");
  overlay.id = "communication-win";

  overlay.innerHTML = `
    <div class="win-box">
      <h2>🏴‍☠️ Bravo !</h2>
      <p>Tu as gagné la quête Legal !</p>
      <div class="gems-container"></div>
    </div>
  `;

  document.body.appendChild(overlay);

  const gemsContainer = overlay.querySelector(".gems-container");

  requestAnimationFrame(()=>{
    launchGemsExplosion(gemsContainer);
  });

  /* 🔓 Déblocage pirate suivant */
  sessionStorage.setItem("unlock_pirate4","true");

  /* ⏳ Redirection */
  setTimeout(()=>{
    sessionStorage.setItem("questCompleted","true");
    window.location.href = "menu.html";
  },2500);
}
   
/* =====================================================
   💎 GEMS EXPLOSION
===================================================== */
function launchGemsExplosion(container){

  const colors = ["#ffd700","#00f2ff","#ff4fd8","#7cff00","#ff8c00"];

  for(let i = 0; i < 50; i++){

    const g = document.createElement("div");
    g.className = "gem";

    const size = Math.random() * 10 + 8;

    g.style.width = size + "px";
    g.style.height = size + "px";

    g.style.background = colors[Math.floor(Math.random() * colors.length)];

    g.style.left = "50%";
    g.style.top = "50%";

    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * 260 + 80;

    g.style.setProperty("--x", Math.cos(angle) * dist + "px");
    g.style.setProperty("--y", Math.sin(angle) * dist + "px");

    container.appendChild(g);
  }
}

/* =====================================================
   🚀 INIT GLOBAL (À NE PAS OUBLIER)
===================================================== */
createProgressBar();

});
