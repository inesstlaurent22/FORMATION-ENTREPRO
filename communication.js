document.addEventListener("DOMContentLoaded", () => {

  const videoIntro = document.getElementById("videoIntro");
  const introVideo = document.getElementById("introVideo");
  const toggleSound = document.getElementById("toggleSound");
  const closeVideo = document.getElementById("closeVideo");

  const loader = document.getElementById("loader");
  const scene = document.getElementById("scene");

  const pirate3 = document.getElementById("pirate3");

  const dialogBox = document.getElementById("dialogBox");
  const dialogText = document.getElementById("dialogText");
  const nextDialog = document.getElementById("nextDialog");

  const miniGame = document.getElementById("miniGameContainer");

  /* ===== VIDEO ===== */
  introVideo.play().catch(()=>{});

  toggleSound.onclick = () => {
    introVideo.muted = !introVideo.muted;
  };

  closeVideo.onclick = endVideo;
  introVideo.onended = endVideo;

  function endVideo(){
    videoIntro.classList.add("hidden");
    loader.classList.remove("hidden");

    setTimeout(() => {
      loader.classList.add("hidden");
      scene.classList.remove("hidden");
    }, 1500);
  }

  /* ===== DIALOGUE ===== */
  pirate3.onclick = () => {
    dialogBox.classList.remove("hidden");
    dialogText.textContent =
      "Capitaine, pour que tout le marché te connaisse, il faut activer les bons signaux.";
  };

  nextDialog.onclick = () => {
    dialogBox.classList.add("hidden");
    startMiniGame1();
  };

  /* ===== MINI-JEU 1 : LES 4 SIGNAUX ===== */
  let mg1Current = 0;

  function startMiniGame1(){
    miniGame.innerHTML = `
      <div class="mg1">
        <div id="mg1-0">
          <h1>🏴‍☠️ Les 4 Signaux du Capitaine</h1>
          <p>Active les 4 signaux pour attirer les clients.</p>
          <button class="btn-pirate" onclick="mg1Next()">Commencer</button>
        </div>

        <div id="mg1-1" class="hidden">
          <h1>📣 Réseaux sociaux</h1>
          <button class="btn-pirate" onclick="mg1Success(1)">Découvre mon trésor !</button>
          <button class="btn-pirate" onclick="mg1Success(1)">Vente immédiate !!!</button>
          <div class="feedback hidden" id="fb1">Ils découvrent ta boutique.</div>
        </div>

        <div id="mg1-2" class="hidden">
          <h1>📜 Newsletter</h1>
          <button class="btn-pirate" onclick="mg1Success(2)">Message utile parfois</button>
          <button class="btn-pirate" onclick="mg1Success(2)">Tous les jours</button>
          <div class="feedback hidden" id="fb2">Tu restes présent sans déranger.</div>
        </div>

        <div id="mg1-3" class="hidden">
          <h1>🕊️ Phoning / Mailing</h1>
          <button class="btn-pirate" onclick="mg1Success(3)">Contacter au bon moment</button>
          <div class="feedback hidden" id="fb3">Le lien se crée.</div>
        </div>

        <div id="mg1-4" class="hidden">
          <h1>⚓ Visite physique</h1>
          <button class="btn-pirate" onclick="mg1Success(4)">Écouter le client</button>
          <div class="feedback hidden" id="fb4">La confiance s’installe.</div>
        </div>

        <div id="mg1-5" class="hidden">
          <h1>🎉 Mission réussie</h1>
          <p>Ta marque est maintenant connue.</p>
          <button class="btn-pirate" onclick="endMiniGame()">Continuer</button>
        </div>
      </div>
    `;
    miniGame.classList.remove("hidden");
    mg1Current = 0;
  }

  window.mg1Next = function(){
    document.getElementById(`mg1-${mg1Current}`).classList.add("hidden");
    mg1Current++;
    document.getElementById(`mg1-${mg1Current}`).classList.remove("hidden");
  };

  window.mg1Success = function(id){
    document.getElementById(`fb${id}`).classList.remove("hidden");
    setTimeout(mg1Next, 1200);
  };

  window.endMiniGame = function(){
    miniGame.classList.add("hidden");
  };

});
