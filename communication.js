document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     🎬 VIDEO INTRO
  ========================= */
  const videoIntro   = document.getElementById("videoIntro");
  const introVideo   = document.getElementById("introVideo");
  const toggleSound  = document.getElementById("toggleSound");
  const closeVideo   = document.getElementById("closeVideo");

  const scene        = document.getElementById("scene");
  const pirate5      = document.getElementById("pirate5");

  const loader       = document.getElementById("loader");
  const loaderText   = document.getElementById("loaderText");

  const dialogBox    = document.getElementById("dialogBox");
  const dialogText   = document.getElementById("dialogText");
  const nextDialog   = document.getElementById("nextDialog");

  const miniGame     = document.getElementById("miniGameContainer");

  /* =========================
     🔊 CONTROLES VIDEO
  ========================= */
  introVideo.muted = false;

  toggleSound.addEventListener("click", () => {
    introVideo.muted = !introVideo.muted;
    toggleSound.textContent = introVideo.muted ? "🔇" : "🔊";
  });

  closeVideo.addEventListener("click", endVideo);
  introVideo.addEventListener("ended", endVideo);

  function endVideo(){
    videoIntro.classList.add("hidden");

    // Sécurité iOS / Safari
    setTimeout(() => {
      scene.classList.remove("hidden");
    }, 100);
  }

  /* =========================
     ⏳ LOADER
  ========================= */
  function showLoader(text, callback){
    loaderText.textContent = text || "Chargement…";
    loader.classList.remove("hidden");

    setTimeout(() => {
      loader.classList.add("hidden");
      if(callback) callback();
    }, 1400);
  }

  /* =========================
     🏴‍☠️ CLICK PIRATE 5
  ========================= */
  pirate5.addEventListener("click", () => {
    showLoader("Chargement…", startIntroDialog);
  });

  /* =========================
     💬 DIALOGUES SYSTEM
  ========================= */
  let dialogs = [];
  let dialogIndex = 0;
  let onDialogEnd = null;

  function playDialog(list, onEnd){
    dialogs = list;
    dialogIndex = 0;
    onDialogEnd = onEnd;

    dialogBox.classList.remove("hidden");
    dialogText.textContent = dialogs[dialogIndex];

    nextDialog.onclick = () => {
      dialogIndex++;
      if(dialogIndex < dialogs.length){
        dialogText.textContent = dialogs[dialogIndex];
      }else{
        dialogBox.classList.add("hidden");
        if(onDialogEnd) onDialogEnd();
      }
    };
  }

  /* =========================
     💬 DIALOGUES INTRO
  ========================= */
  function startIntroDialog(){
    playDialog([
      "🏴‍☠️ Pirate 5 : Capitaine… personne ne connaît encore ton étal.",
      "🏴‍☠️ Pirate 2 : Alors il est temps de faire parler de ta marchandise !"
    ], startMiniGame1);
  }

  /* =========================
     🎮 MINI-JEU 1
     Faire connaître sa marque
  ========================= */
  function startMiniGame1(){
    miniGame.innerHTML = `
      <h2>📣 Faire connaître ta marque</h2>
      <p>Sélectionne TOUS les moyens de communication efficaces.</p>
      <button class="mg1">Réseaux sociaux</button>
      <button class="mg1">Newsletter</button>
      <button class="mg1">Phoning</button>
      <button class="mg1">Mailing</button>
      <button class="mg1">Visite physique</button>
    `;
    miniGame.classList.remove("hidden");

    miniGame.querySelectorAll(".mg1").forEach(btn => {
      btn.onclick = () => {
        btn.disabled = true;
        btn.style.opacity = 0.4;
        checkGame1();
      };
    });
  }

  function checkGame1(){
    const remaining = miniGame.querySelectorAll(".mg1:not(:disabled)").length;
    if(remaining === 0){
      miniGame.classList.add("hidden");
      showLoader("Chargement…", dialogAfterGame1);
    }
  }

  function dialogAfterGame1(){
    playDialog([
      "🏴‍☠️ Pirate 2 : Bien vu ! Plus on parle de toi, plus ta réputation grandit.",
      "🏴‍☠️ Pirate 5 : Mais il faut aussi être reconnaissable au premier regard…"
    ], startMiniGame2);
  }

  /* =========================
     🎮 MINI-JEU 2
     Identité visuelle
  ========================= */
  function startMiniGame2(){
    miniGame.innerHTML = `
      <h2>🧾 Créer des flyers efficaces</h2>
      <p>Quels éléments construisent l'identité visuelle ?</p>
      <label><input type="checkbox"> Logo</label><br>
      <label><input type="checkbox"> Couleurs</label><br>
      <label><input type="checkbox"> Ton & style d’écriture</label>
    `;
    miniGame.classList.remove("hidden");

    miniGame.querySelectorAll("input")
      .forEach(input => input.onchange = checkGame2);
  }

  function checkGame2(){
    const checked = miniGame.querySelectorAll("input:checked").length;
    if(checked === 3){
      showProspectionCard();
    }
  }

  function showProspectionCard(){
    miniGame.innerHTML = `
      <h2>La Prospection</h2>
      <p>
        La prospection consiste à aller chercher activement des clients
        grâce à une communication cohérente et visible.
      </p>
      <button id="nextStep">Passer à la suite</button>
      <img src="images/identite-visuelle.png" class="appear">
      <p>L’identité visuelle de ta marque est prête</p>
    `;

    document.getElementById("nextStep").onclick = () => {
      miniGame.classList.add("hidden");
      showLoader("Chargement…", dialogBeforeGame3);
    };
  }

  /* =========================
     🎮 MINI-JEU 3
     Réseaux : notoriété / vente
  ========================= */
  function dialogBeforeGame3(){
    playDialog([
      "🏴‍☠️ Pirate 5 : Dernière étape, capitaine.",
      "🏴‍☠️ Pirate 2 : Certains réseaux servent à te faire connaître…",
      "🏴‍☠️ Pirate 2 : …d’autres sont faits pour vendre."
    ], startMiniGame3);
  }

  function startMiniGame3(){
    miniGame.innerHTML = `
      <h2>📱 Réseaux sociaux</h2>
      <p>
        Instagram, TikTok et Twitter servent à te faire connaître.<br><br>
        Facebook, LinkedIn, Shopify et Instagram Shopping servent à vendre.
      </p>
      <button id="validateQuest">Valider</button>
    `;
    miniGame.classList.remove("hidden");

    document.getElementById("validateQuest").onclick = winQuest;
  }

  /* =========================
     🏆 FIN DE QUÊTE
  ========================= */
  function winQuest(){
    miniGame.innerHTML = `
      <h2>🎉 Bravo</h2>
      <p>
        Tu as réussi ta campagne de communication.<br>
        Tous les clients du marché sont venus te voir.<br>
        Tu as vendu 50% de ton stock.
      </p>
      <div class="bar">
        <div style="width:50%"></div>
      </div>
    `;

    showLoader("Bravo, tu as gagné la quête", () => {
      localStorage.setItem("pirate5Unlocked", "true");
      setTimeout(() => {
        window.location.href = "menu.html";
      }, 2000);
    });
  }

});
