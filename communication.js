document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     🎬 VIDEO INTRO
  ========================= */
  const videoIntro   = document.getElementById("videoIntro");
  const introVideo   = document.getElementById("introVideo");
  const toggleSound  = document.getElementById("toggleSound");
  const closeVideo   = document.getElementById("closeVideo");

  const loader       = document.getElementById("loader");
  const loaderText   = document.getElementById("loaderText");

  const scene        = document.getElementById("scene");
  const pirate3      = document.getElementById("pirate3");

  const dialogBox    = document.getElementById("dialogBox");
  const dialogText   = document.getElementById("dialogText");
  const nextDialog   = document.getElementById("nextDialog");

  const miniGame     = document.getElementById("miniGameContainer");

  /* =========================
     🎬 VIDEO (iOS SAFE)
  ========================= */
  introVideo.muted = true;
  introVideo.play().catch(()=>{});

  toggleSound.addEventListener("click", () => {
    introVideo.muted = !introVideo.muted;
  });

  closeVideo.addEventListener("click", endVideo);
  introVideo.addEventListener("ended", endVideo);

  function endVideo(){
    videoIntro.classList.add("hidden");

    loaderText.textContent = "Chargement…";
    loader.classList.remove("hidden");

    setTimeout(() => {
      loader.classList.add("hidden");
      scene.classList.remove("hidden");
    }, 1500);
  }

  /* =========================
     💬 SYSTEME DE DIALOGUE
  ========================= */
  let dialogs = [];
  let dialogIndex = 0;
  let dialogCallback = null;

  function playDialog(list, callback){
    dialogs = list;
    dialogIndex = 0;
    dialogCallback = callback;

    dialogBox.classList.remove("hidden");
    dialogText.textContent = dialogs[dialogIndex];

    nextDialog.onclick = () => {
      dialogIndex++;
      if(dialogIndex < dialogs.length){
        dialogText.textContent = dialogs[dialogIndex];
      }else{
        dialogBox.classList.add("hidden");
        if(dialogCallback) dialogCallback();
      }
    };
  }

  /* =========================
     🏴‍☠️ CLICK PIRATE 3
  ========================= */
  pirate3.addEventListener("click", () => {
    playDialog([
      "🏴‍☠️ Pirate 3 : Capitaine, ton trésor est prêt…",
      "🏴‍☠️ Pirate 2 : Mais si personne ne te connaît, personne ne viendra.",
      "🏴‍☠️ Pirate 3 : Apprenons à faire parler de ta marque dans tout le marché."
    ], startMiniGame1);
  });

  /* =========================
     🎮 MINI-JEU 1
     COMPRENDRE LA COMMUNICATION
  ========================= */
  let mg1Step = 0;

  function startMiniGame1(){
    miniGame.innerHTML = `
      <div class="mg1">

        <!-- INTRO -->
        <div id="mg1-step-0">
          <h1>🏴‍☠️ Mission : Faire connaître ta marque</h1>
          <p>
            Ton produit est prêt.<br><br>
            Mais dans le marché, les clients n’achètent que
            ce qu’ils <strong>connaissent</strong> et ce en quoi
            ils ont <strong>confiance</strong>.
          </p>
          <button class="btn-pirate" onclick="mg1Next()">Commencer</button>
        </div>

        <!-- OBJECTIF -->
        <div id="mg1-step-1" class="hidden">
          <h1>🎯 Objectif</h1>
          <p>
            Découvre les <strong>différents moyens</strong>
            de communication.<br><br>
            Chacun a un rôle précis :
            <strong>faire connaître, rassurer, créer un lien</strong>.
          </p>
          <button class="btn-pirate" onclick="mg1Next()">Continuer</button>
        </div>

        <!-- RÉSEAUX -->
        <div id="mg1-step-2" class="hidden">
          <h1>📣 Réseaux sociaux</h1>
          <p>
            Les réseaux servent surtout à :
          </p>
          <button class="btn-pirate" onclick="mg1Explain(2)">
            Montrer ton univers
          </button>
          <button class="btn-pirate" onclick="mg1Explain(2)">
            Te faire découvrir
          </button>
          <div class="feedback hidden" id="mg1-feedback-2">
            Les réseaux sociaux rendent ta marque visible.
          </div>
        </div>

        <!-- NEWSLETTER -->
        <div id="mg1-step-3" class="hidden">
          <h1>📜 Newsletter</h1>
          <p>
            La newsletter sert à :
          </p>
          <button class="btn-pirate" onclick="mg1Explain(3)">
            Rester présent dans l’esprit du client
          </button>
          <button class="btn-pirate" onclick="mg1Explain(3)">
            Donner des nouvelles utiles
          </button>
          <div class="feedback hidden" id="mg1-feedback-3">
            Le client ne t’oublie pas.
          </div>
        </div>

        <!-- PHONING -->
        <div id="mg1-step-4" class="hidden">
          <h1>🕊️ Phoning & mailing</h1>
          <p>
            Contacter directement un client permet de :
          </p>
          <button class="btn-pirate" onclick="mg1Explain(4)">
            Comprendre ses besoins
          </button>
          <button class="btn-pirate" onclick="mg1Explain(4)">
            Créer une relation humaine
          </button>
          <div class="feedback hidden" id="mg1-feedback-4">
            Le lien humain crée la confiance.
          </div>
        </div>

        <!-- VISITE -->
        <div id="mg1-step-5" class="hidden">
          <h1>⚓ Visite physique</h1>
          <p>
            En rencontrant les clients :
          </p>
          <button class="btn-pirate" onclick="mg1Explain(5)">
            Tu écoutes et rassures
          </button>
          <button class="btn-pirate" onclick="mg1Explain(5)">
            Tu crées une vraie connexion
          </button>
          <div class="feedback hidden" id="mg1-feedback-5">
            La confiance devient réelle.
          </div>
        </div>

        <!-- FINAL -->
        <div id="mg1-step-6" class="hidden">
          <h1>🎉 Mission réussie</h1>
          <p>
            Une bonne communication utilise
            <strong>plusieurs canaux</strong>.<br><br>
            👉 Elle fait connaître.<br>
            👉 Elle rassure.<br>
            👉 Elle prépare la vente.
          </p>
          <button class="btn-pirate" onclick="endMiniGame1()">
            Continuer l’aventure
          </button>
        </div>

      </div>
    `;

    miniGame.classList.remove("hidden");
    mg1Step = 0;
  }

  /* =========================
     🎮 LOGIQUE MINI-JEU 1
  ========================= */
  window.mg1Next = function(){
    document.getElementById(`mg1-step-${mg1Step}`).classList.add("hidden");
    mg1Step++;
    document.getElementById(`mg1-step-${mg1Step}`).classList.remove("hidden");
  };

  window.mg1Explain = function(step){
    document.getElementById(`mg1-feedback-${step}`).classList.remove("hidden");
    setTimeout(mg1Next, 1600);
  };

  function endMiniGame1(){
    miniGame.classList.add("hidden");

    playDialog([
      "🏴‍☠️ Pirate 2 : Le marché commence à te reconnaître.",
      "🏴‍☠️ Pirate 3 : Ta communication est en place."
    ], () => {
      // ➜ prêt pour mini-jeu 2
    });
  }

});
