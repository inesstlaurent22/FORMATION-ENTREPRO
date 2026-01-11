document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   🔧 OUTILS
===================================================== */
const sleep = ms => new Promise(r => setTimeout(r, ms));
const vibrate = p => navigator.vibrate && navigator.vibrate(p);

/* =====================================================
   🎬 VIDEO INTRO
===================================================== */
const video = document.getElementById("questVideo");
const videoContainer = document.getElementById("videoContainer");

video.addEventListener("ended", async () => {
  videoContainer.classList.add("hidden");
  await sleep(600);
  startQuest();
});

/* =====================================================
   🏴‍☠️ ELEMENTS
===================================================== */
const pirate2 = document.getElementById("pirate2bis");
const pirate5 = document.getElementById("pirate5bis");
const pirate3 = document.getElementById("pirate3bis");

const bubbleContainer = document.getElementById("bubbleContainer");

const miniGame1 = document.getElementById("miniGameContainer");
const miniGame2 = document.getElementById("merchantGame");

const fadeScreen = document.getElementById("fadeScreen");
const loaderBox = document.querySelector(".loaderBox");

const bookContainer = document.getElementById("bookContainer");
const book = document.querySelector(".book");
const continueBtn = document.getElementById("continueQuestBtn");

/* =====================================================
   💬 DIALOGUES
===================================================== */
async function dialogue(text, duration = 2600) {
  bubbleContainer.innerHTML = `
    <div class="dialogue-bubble" style="left:50%;top:65%;transform:translateX(-50%)">
      ${text}
    </div>`;
  await sleep(duration);
  bubbleContainer.innerHTML = "";
}

/* =====================================================
   🚀 DÉBUT DE QUÊTE
===================================================== */
async function startQuest() {
  pirate2.classList.remove("hidden");
  pirate5.classList.remove("hidden");

  await dialogue("Bienvenue, entrepreneur. Prêt à créer ton empire ?");
  await dialogue("Chaque grande réussite commence par une première décision.");

  startMiniGame1();
}

/* =====================================================
   🎮 MINI JEU 1
===================================================== */
function startMiniGame1() {
  miniGame1.classList.remove("hidden");
}

window.validateMiniGame1 = async function(correct) {
  if (!correct) return;

  miniGame1.classList.add("hidden");
  await sleep(800);

  showGoldLoader();
};

/* =====================================================
   🪙 LOADER 5000 PIÈCES + ⏳
===================================================== */
async function showGoldLoader() {
  fadeScreen.classList.remove("hidden");

  let gold = 0;
  loaderBox.innerHTML = `
    <h1 class="bravoText">BRAVO</h1>
    <div id="goldCounter">0</div>
    <div>pièces d’or 🪙</div>
    <div id="loadingBook" style="margin-top:15px;display:none;">⏳ Chargement du livre...</div>
  `;

  const counter = document.getElementById("goldCounter");
  while (gold < 5000) {
    gold += 100;
    counter.textContent = gold;
    await sleep(40);
  }

  document.getElementById("loadingBook").style.display = "block";
  await preloadBookImages();
  fadeScreen.classList.add("hidden");

  openBook();
}

/* =====================================================
   📖 PRÉCHARGEMENT LIVRE
===================================================== */
function preloadBookImages() {
  const imgs = document.querySelectorAll(".page img");
  return Promise.all([...imgs].map(img => {
    if (img.complete) return Promise.resolve();
    return new Promise(res => img.onload = res);
  }));
}

/* =====================================================
   📖 LIVRE DIGITAL
===================================================== */
let pageIndex = 0;

function openBook() {
  bookContainer.classList.remove("hidden");
}

window.turnPage = async function() {
  book.classList.add("page-turn");
  vibrate(20);
  await sleep(900);
  book.classList.remove("page-turn");

  pageIndex++;
  if (pageIndex === document.querySelectorAll(".page").length - 1) {
    continueBtn.classList.remove("hidden");
  }
};

/* =====================================================
   ▶️ CONTINUER LA QUÊTE
===================================================== */
continueBtn.addEventListener("click", async () => {
  continueBtn.classList.add("hidden");
  bookContainer.classList.add("hidden");

  pirate3.classList.add("enter");
  await sleep(1400);

  await dialogue("Impressionnant. Mais sais-tu vendre ce plan ?");
  startMiniGame2();
});

/* =====================================================
   🎮 MINI JEU 2
===================================================== */
function startMiniGame2() {
  miniGame2.classList.remove("hidden");
}

window.validateMiniGame2 = async function(correct) {
  if (!correct) return;

  miniGame2.classList.add("hidden");

  await dialogue("Tu maîtrises désormais les fondations d’un vrai business.");
  await dialogue("Cette quête est presque terminée.");

  showBusinessPlanBox();
};

/* =====================================================
   📦 ENCADRÉ BUSINESS PLAN
===================================================== */
function showBusinessPlanBox() {
  bookContainer.classList.remove("hidden");
  bookContainer.innerHTML = `
    <div class="finalText">Ton business plan est prêt</div>
  `;

  setTimeout(showFinalVictory, 2600);
}

/* =====================================================
   🏆 VICTOIRE FINALE
===================================================== */
function showFinalVictory() {
  fadeScreen.classList.remove("hidden");
  fadeScreen.innerHTML = `
    <div class="loaderBox">
      <h1 class="bravoText">BRAVO</h1>
      <div>Tu as gagné cette quête</div>
    </div>
  `;

  setTimeout(explodeGems, 2200);
}

/* =====================================================
   💎 EXPLOSION DE GEMS
===================================================== */
function explodeGems() {
  for (let i = 0; i < 40; i++) {
    const gem = document.createElement("div");
    gem.textContent = "💎";
    gem.style.position = "fixed";
    gem.style.left = "50%";
    gem.style.top = "50%";
    gem.style.fontSize = "28px";
    gem.style.zIndex = "9999";
    document.body.appendChild(gem);

    const a = Math.random() * Math.PI * 2;
    const d = 250 + Math.random() * 200;

    gem.animate([
      { transform: "translate(0,0)", opacity: 1 },
      { transform: `translate(${Math.cos(a)*d}px, ${Math.sin(a)*d}px)`, opacity: 0 }
    ], { duration: 1600, easing: "ease-out" });

    setTimeout(() => gem.remove(), 1600);
  }

  setTimeout(() => window.location.href = "menu.html", 2400);
}

});
