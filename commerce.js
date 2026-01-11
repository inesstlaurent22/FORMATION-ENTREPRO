document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   🔧 OUTILS
===================================================== */
function vibrate(p = 20) {
  if (navigator.vibrate) navigator.vibrate(p);
}

/* =====================================================
   🌑 ELEMENTS
===================================================== */
const fadeScreen      = document.getElementById("fadeScreen");
const bubbleContainer = document.getElementById("bubbleContainer");
const miniGame        = document.getElementById("miniGameContainer");
const gameFeedback    = document.getElementById("gameFeedback");
const bookContainer   = document.getElementById("bookContainer");
const book            = document.querySelector(".book");
const continueBtn     = document.getElementById("continueQuestBtn");

const pirate3 = document.getElementById("pirate3bis");

/* =====================================================
   💬 DIALOGUES
===================================================== */
function showDialogue(text, x = "50%", y = "65%", duration = 2200) {
  bubbleContainer.innerHTML = `
    <div class="dialogue-bubble" style="left:${x}; top:${y}">
      ${text}
    </div>
  `;

  setTimeout(() => {
    bubbleContainer.innerHTML = "";
  }, duration);
}

/* =====================================================
   🏴‍☠️ APPARITION PIRATE 3
===================================================== */
function enterPirate3() {
  pirate3.classList.add("enter");

  setTimeout(() => {
    showDialogue(
      "Je vois que tu avances bien… mais sais-tu structurer ton projet ?"
    );

    setTimeout(startMiniGame, 2600);
  }, 1200);
}

/* =====================================================
   🎮 MINI JEU
===================================================== */
function startMiniGame() {
  miniGame.classList.remove("hidden");
}

window.validateAnswer = function(correct) {
  vibrate(30);
  gameFeedback.classList.remove("success", "error");

  if (correct) {
    gameFeedback.textContent = "Excellente décision.";
    gameFeedback.classList.add("success");

    setTimeout(() => {
      miniGame.classList.add("hidden");
      afterMiniGameDialogues();
    }, 1400);
  } else {
    gameFeedback.textContent = "Réfléchis bien…";
    gameFeedback.classList.add("error");
  }
};

/* =====================================================
   💬 DIALOGUES POST MINI JEU
===================================================== */
function afterMiniGameDialogues() {
  showDialogue(
    "Tu as compris l’essentiel. Un bon business commence par une vision claire."
  );

  setTimeout(() => {
    showDialogue(
      "Il est temps de formaliser tout cela."
    );

    setTimeout(openBusinessPlan, 2600);
  }, 2600);
}

/* =====================================================
   📖 BUSINESS PLAN (LIVRE)
===================================================== */
let pageIndex = 0;

function openBusinessPlan() {
  bookContainer.classList.remove("hidden");
}

window.turnPage = function() {
  book.classList.add("page-turn");
  vibrate(25);

  setTimeout(() => {
    book.classList.remove("page-turn");
    pageIndex++;

    if (pageIndex >= 2) {
      continueBtn.classList.remove("hidden");
    }
  }, 900);
};

/* =====================================================
   ▶️ CONTINUER
===================================================== */
continueBtn.addEventListener("click", () => {
  vibrate(40);

  continueBtn.classList.add("hidden");
  bookContainer.classList.add("hidden");

  showDialogue(
    "Ton business plan est prêt."
  );

  setTimeout(showVictoryLoader, 2600);
});

/* =====================================================
   🪙 LOADER VICTOIRE
===================================================== */
function showVictoryLoader() {
  fadeScreen.classList.remove("hidden");

  fadeScreen.innerHTML = `
    <div class="loaderBox">
      <div class="bravoText">BRAVO</div>
      <div>Tu as gagné cette quête</div>
    </div>
  `;

  setTimeout(explodeGems, 2200);
}

/* =====================================================
   💎 EXPLOSION DE GEMS
===================================================== */
function explodeGems() {
  for (let i = 0; i < 30; i++) {
    const gem = document.createElement("div");
    gem.textContent = "💎";
    gem.style.position = "fixed";
    gem.style.left = "50%";
    gem.style.top = "50%";
    gem.style.fontSize = "26px";
    gem.style.zIndex = "5000";
    gem.style.transition = "transform 1.4s ease, opacity 1.4s ease";

    document.body.appendChild(gem);

    const angle = Math.random() * Math.PI * 2;
    const distance = 200 + Math.random() * 200;

    setTimeout(() => {
      gem.style.transform = `
        translate(${Math.cos(angle) * distance}px,
                  ${Math.sin(angle) * distance}px)
        rotate(${Math.random() * 720}deg)
      `;
      gem.style.opacity = "0";
    }, 50);

    setTimeout(() => gem.remove(), 1500);
  }

  setTimeout(() => {
    window.location.href = "menu.html";
  }, 2200);
}

/* =====================================================
   🚀 LANCEMENT SEQUENCE
===================================================== */
enterPirate3();

});
