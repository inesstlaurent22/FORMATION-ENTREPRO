document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   🎬 VIDEO INTRO
===================================================== */
const videoIntro  = document.getElementById("videoIntro");
const introVideo  = document.getElementById("introVideo");
const toggleSound = document.getElementById("toggleSound");
const closeVideo  = document.getElementById("closeVideo");

const scene       = document.getElementById("scene");
const pirate2     = document.getElementById("pirate2");
const pirate3     = document.getElementById("pirate3");

const dialogBox   = document.getElementById("dialogBox");
const dialogText  = document.getElementById("dialogText");

const miniGame    = document.getElementById("miniGameContainer");

let hudElement = null;

/* =====================================================
   🎬 VIDEO (iOS SAFE)
===================================================== */
introVideo.muted = true;
introVideo.play().catch(()=>{});

toggleSound.onclick = () => {
  introVideo.muted = !introVideo.muted;
  introVideo.play().catch(()=>{});
};

closeVideo.onclick = endVideo;
introVideo.onended = endVideo;

function endVideo(){
  videoIntro.classList.add("hidden");
  showFadeLoader("Chargement…");

  setTimeout(()=>{
    hideFadeLoader();
    scene.classList.remove("hidden");
  },1500);
}

/* =====================================================
   🌑 FADE LOADER (STYLE PIRATE)
===================================================== */
let fadeScreen = null;

function showFadeLoader(text, isWin=false){
  hideFadeLoader();

  fadeScreen = document.createElement("div");
  fadeScreen.id = "fadeScreen";

  const box = document.createElement("div");
  box.className = "loaderBox";

  const span = document.createElement("div");
  span.innerHTML = isWin
    ? `<div class="winBravo">${text}</div>`
    : text;

  box.appendChild(span);
  fadeScreen.appendChild(box);
  document.body.appendChild(fadeScreen);
}

function hideFadeLoader(){
  if(fadeScreen){
    fadeScreen.remove();
    fadeScreen = null;
  }
}

/* =====================================================
   🧭 HUD MANAGEMENT
===================================================== */
function hideHUD(){
  if(hudElement){
    hudElement.remove();
    hudElement = null;
  }
}

function showHUD(el){
  hideHUD();
  hudElement = el;
  document.body.appendChild(el);
}

/* =====================================================
   💬 DIALOGUES
===================================================== */
let dialogs = [];
let dialogIndex = 0;
let dialogCallback = null;

function playDialog(list, callback){
  hideHUD();
  dialogs = list;
  dialogIndex = 0;
  dialogCallback = callback;
  dialogBox.classList.remove("hidden");
  showDialogLine();
}

function showDialogLine(){
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
    showDialogLine();
  } else {
    dialogBox.classList.add("hidden");
    dialogCallback && dialogCallback();
  }
};

/* =====================================================
   🏴‍☠️ DÉBUT DE QUÊTE
===================================================== */
pirate3.onclick = () => {
  playDialog([
    { speaker:"pirate3", text:"Capitaine, ton trésor est prêt." },
    { speaker:"pirate2", text:"Mais personne ne sait qu’il existe." },
    { speaker:"pirate3", text:"La communication est la clé." }
  ], startMiniGame1);
};

/* =====================================================
   🎮 MINI-JEU 1
===================================================== */
function startMiniGame1(){
  showMiniGame();
  addText("📣 La communication sert à se faire connaître.");
  addButton("Continuer", () => {
    hideMiniGame();
    startClientsGauge();
  });
}

/* =====================================================
   🧭 JAUGE CLIENTS
===================================================== */
function startClientsGauge(){
  const panel = document.createElement("div");
  panel.className = "piratePanel";
  panel.style.left = "50%";
  panel.style.top = "50%";
  panel.style.transform = "translate(-50%, -50%)";

  panel.innerHTML = `
    <h4>Clients attirés par ta communication</h4>
    <div class="pirateProgressBar">
      <div class="pirateProgressFill"></div>
    </div>
    <div class="pirateProgressText">0 / 10</div>
  `;

  showHUD(panel);

  const fill = panel.querySelector(".pirateProgressFill");
  const txt  = panel.querySelector(".pirateProgressText");

  let v = 0;
  const interval = setInterval(()=>{
    v++;
    fill.style.width = `${v * 10}%`;
    txt.textContent = `${v} / 10`;

    if(v === 3){
      clearInterval(interval);
      setTimeout(()=>{
        hideHUD();
        betweenMiniGamesDialog();
      },800);
    }
  },400);
}

/* =====================================================
   💬 ENTRE MINI-JEUX
===================================================== */
function betweenMiniGamesDialog(){
  playDialog([
    { speaker:"pirate3", text:"Les clients commencent à venir." },
    { speaker:"pirate2", text:"Mais pour rester visibles, il faut une stratégie." }
  ], startMiniGame2);
}

/* =====================================================
   🎨 MINI-JEU 2
===================================================== */
function startMiniGame2(){
  showMiniGame();
  addText("🎨 Identité visuelle = reconnaissance immédiate");
  addButton("Continuer", () => {
    hideMiniGame();
    afterIdentityDialog();
  });
}

function afterIdentityDialog(){
  playDialog([
    { speaker:"pirate3", text:"Avec une identité forte, on te reconnaît." },
    { speaker:"pirate2", text:"Mais encore faut-il utiliser les bons canaux." }
  ], startMiniGame3);
}

/* =====================================================
   🎮 MINI-JEU 3 — LIAISONS VISUELLES
===================================================== */
function startMiniGame3(){
  showMiniGame();

  addText("📲 Relie chaque plateforme à son objectif");

  let selectedPlatform = null;
  let completed = 0;

  const svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.setAttribute("width","100%");
  svg.setAttribute("height","200");
  svg.style.position = "absolute";
  svg.style.top = "120px";
  svg.style.left = "0";
  miniGame.appendChild(svg);

  const platforms = [
    { label:"Instagram & TikTok", target:"know" },
    { label:"Shopify", target:"btoc" },
    { label:"LinkedIn & Facebook", target:"btob" }
  ];

  const targets = {
    know: "Se faire connaître",
    btoc: "Vendre en BtoC",
    btob: "Vendre en BtoB (et se faire connaître)"
  };

  const top = document.createElement("div");
  top.className = "visualChoices";

  platforms.forEach(p=>{
    const b = document.createElement("button");
    b.className = "btn-platform";
    b.textContent = p.label;
    b.onclick = () => selectedPlatform = {btn:b, ...p};
    top.appendChild(b);
  });

  const bottom = document.createElement("div");
  bottom.className = "visualChoices";

  Object.keys(targets).forEach(key=>{
    const b = document.createElement("button");
    b.className = "btn-target";
    b.textContent = targets[key];
    b.onclick = () => {
      if(selectedPlatform && selectedPlatform.target === key){
        drawLine(svg, selectedPlatform.btn, b);
        completed++;
        selectedPlatform = null;
        if(completed === 3) endQuest();
      }
    };
    bottom.appendChild(b);
  });

  miniGame.appendChild(top);
  miniGame.appendChild(bottom);
}

/* =====================================================
   💎 FIN DE QUÊTE
===================================================== */
function endQuest(){
  hideMiniGame();
  showFadeLoader("BRAVO", true);
  localStorage.setItem("pirate5Unlocked","true");
  setTimeout(()=>{
    window.location.href = "menu.html";
  },2500);
}

/* =====================================================
   🔗 SVG LINE
===================================================== */
function drawLine(svg, fromBtn, toBtn){
  const r1 = fromBtn.getBoundingClientRect();
  const r2 = toBtn.getBoundingClientRect();
  const s  = svg.getBoundingClientRect();

  const line = document.createElementNS("http://www.w3.org/2000/svg","line");
  line.setAttribute("x1", r1.left + r1.width/2 - s.left);
  line.setAttribute("y1", r1.bottom - s.top);
  line.setAttribute("x2", r2.left + r2.width/2 - s.left);
  line.setAttribute("y2", r2.top - s.top);
  line.setAttribute("stroke","gold");
  line.setAttribute("stroke-width","3");
  svg.appendChild(line);
}

/* =====================================================
   🧩 MINI-GAME HELPERS
===================================================== */
function showMiniGame(){
  miniGame.innerHTML = "";
  miniGame.classList.remove("hidden");
  miniGame.scrollIntoView({behavior:"smooth", block:"center"});
}

function hideMiniGame(){
  miniGame.classList.add("hidden");
}

function addText(t){
  const p = document.createElement("p");
  p.textContent = t;
  miniGame.appendChild(p);
}

function addButton(label, action){
  const b = document.createElement("button");
  b.textContent = label;
  b.onclick = action;
  miniGame.appendChild(b);
}

});
