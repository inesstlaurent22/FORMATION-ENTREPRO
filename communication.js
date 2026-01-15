document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     🎬 VIDEO INTRO
  ========================= */
  const videoIntro = document.getElementById("videoIntro");
  const introVideo = document.getElementById("introVideo");
  const toggleSound = document.getElementById("toggleSound");
  const closeVideo = document.getElementById("closeVideo");

  const scene = document.getElementById("scene");
  const pirate3 = document.getElementById("pirate3");

  const loader = document.getElementById("loader");
  const loaderText = document.getElementById("loaderText");

  const dialogBox = document.getElementById("dialogBox");
  const dialogText = document.getElementById("dialogText");
  const nextDialog = document.getElementById("nextDialog");

  const miniGameContainer = document.getElementById("miniGameContainer");

  /* =========================
     🎬 CONTROLES VIDEO
  ========================= */
  toggleSound.onclick = () => {
    introVideo.muted = !introVideo.muted;
    toggleSound.textContent = introVideo.muted ? "🔇" : "🔊";
  };

  closeVideo.onclick = endVideo;
  introVideo.onended = endVideo;

  function endVideo(){
    videoIntro.classList.add("hidden");
    scene.classList.remove("hidden");
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
    }, 1500);
  }

  /* =========================
     🏴‍☠️ PIRATE 3 → JEU 1
  ========================= */
  pirate3.addEventListener("click", () => {
    showLoader("Chargement…", startDialogIntro);
  });

  /* =========================
     💬 DIALOGUES
  ========================= */
  let dialogIndex = 0;
  let dialogs = [];

  function startDialogIntro(){
    dialogs = [
      "🏴‍☠️ Pirate 3 : Capitaine, personne ne connaît encore ta marchandise…",
      "🏴‍☠️ Pirate 2 : Alors il est temps de faire parler de toi dans tout le marché !"
    ];
    dialogIndex = 0;
    showDialog(nextToGame1);
  }

  function showDialog(onFinish){
    dialogBox.classList.remove("hidden");
    dialogText.textContent = dialogs[dialogIndex];

    nextDialog.onclick = () => {
      dialogIndex++;
      if(dialogIndex < dialogs.length){
        dialogText.textContent = dialogs[dialogIndex];
      }else{
        dialogBox.classList.add("hidden");
        if(onFinish) onFinish();
      }
    };
  }

  /* =========================
     🎮 MINI-JEU 1
     Formes de communication
  ========================= */
  function startMiniGame1(){
    miniGameContainer.innerHTML = `
      <h2>📣 Faire connaître ta marque</h2>
      <p>Sélectionne tous les moyens pour te faire connaître.</p>
      <button class="mg1">Réseaux sociaux</button>
      <button class="mg1">Newsletter</button>
      <button class="mg1">Phoning</button>
      <button class="mg1">Mailing</button>
      <button class="mg1">Visite physique</button>
    `;
    miniGameContainer.classList.remove("hidden");

    const buttons = miniGameContainer.querySelectorAll(".mg1");
    buttons.forEach(btn => {
      btn.onclick = () => {
        btn.disabled = true;
        btn.style.opacity = 0.4;
        checkGame1();
      };
    });
  }

  function checkGame1(){
    const remaining = miniGameContainer.querySelectorAll(".mg1:not(:disabled)").length;
    if(remaining === 0){
      miniGameContainer.classList.add("hidden");
      showLoader("Chargement…", dialogAfterGame1);
    }
  }

  function dialogAfterGame1(){
    dialogs = [
      "🏴‍☠️ Pirate 2 : Bien joué ! Plus on parle de toi, plus ta réputation grandit.",
      "🏴‍☠️ Pirate 3 : Mais il faut aussi attirer l’œil, capitaine…"
    ];
    dialogIndex = 0;
    showDialog(startMiniGame2);
  }

  /* =========================
     🎮 MINI-JEU 2
     Flyers & identité visuelle
  ========================= */
  function startMiniGame2(){
    miniGameContainer.innerHTML = `
      <h2>🧾 Créer des flyers efficaces</h2>
      <p>Quels éléments construisent l’identité visuelle ?</p>
      <label><input type="checkbox"> Logo</label><br>
      <label><input type="checkbox"> Couleurs</label><br>
      <label><input type="checkbox"> Ton & style d’écriture</label>
    `;
    miniGameContainer.classList.remove("hidden");

    miniGameContainer.querySelectorAll("input")
      .forEach(input => input.onchange = checkGame2);
  }

  function checkGame2(){
    const checked = miniGameContainer.querySelectorAll("input:checked").length;
    if(checked === 3){
      showProspectionCard();
    }
  }

  function showProspectionCard(){
    miniGameContainer.innerHTML = `
      <h2>La Prospection</h2>
      <p>
        La prospection consiste à aller chercher activement des clients
        grâce à des actions ciblées.
      </p>
      <button id="nextStep">Passer à la suite</button>
      <img src="identite-visuelle.png" class="appear">
      <p>L’identité visuelle de ta marque est prête</p>
    `;

    document.getElementById("nextStep").onclick = () => {
      miniGameContainer.classList.add("hidden");
      showLoader("Chargement…", dialogBeforeGame3);
    };
  }

  /* =========================
     🎮 MINI-JEU 3
     Réseaux = notoriété / vente
  ========================= */
  function dialogBeforeGame3(){
    dialogs = [
      "🏴‍☠️ Pirate 3 : Dernière étape capitaine… les réseaux sociaux !",
      "🏴‍☠️ Pirate 2 : Certains servent à te faire connaître, d’autres à vendre."
    ];
    dialogIndex = 0;
    showDialog(startMiniGame3);
  }

  function startMiniGame3(){
    miniGameContainer.innerHTML = `
      <h2>📱 Réseaux sociaux</h2>
      <p>
        Instagram, TikTok et Twitter servent à te faire connaître.<br>
        Facebook, LinkedIn, Shopify et Instagram Shopping servent à vendre.
      </p>
      <button id="winQuest">Valider</button>
    `;
    miniGameContainer.classList.remove("hidden");

    document.getElementById("winQuest").onclick = winQuest;
  }

  /* =========================
     🏆 FIN DE QUÊTE
  ========================= */
  function winQuest(){
    miniGameContainer.innerHTML = `
      <h2>🎉 Bravo</h2>
      <p>
        Tu as réussi ta campagne de communication.<br>
        Tous les clients du marché sont venus te voir.<br>
        Tu as vendu 50% de ton stock.
      </p>
      <div class="bar"><div style="width:50%"></div></div>
    `;

    showLoader("Bravo, tu as gagné la quête", () => {
      localStorage.setItem("pirate5Unlocked", "true");
      setTimeout(() => {
        window.location.href = "menu.html";
      }, 2000);
    });
  }

  /* =========================
     🚀 LANCEMENT INITIAL
  ========================= */
  introVideo.muted = false;
});
