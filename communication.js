document.addEventListener("DOMContentLoaded", () => {

  const videoIntro  = document.getElementById("videoIntro");
  const introVideo  = document.getElementById("introVideo");
  const toggleSound = document.getElementById("toggleSound");
  const closeVideo  = document.getElementById("closeVideo");

  const scene       = document.getElementById("scene");
  const pirate5     = document.getElementById("pirate5");

  const loader      = document.getElementById("loader");
  const loaderText  = document.getElementById("loaderText");

  const dialogBox   = document.getElementById("dialogBox");
  const dialogText  = document.getElementById("dialogText");
  const nextDialog  = document.getElementById("nextDialog");

  const miniGame    = document.getElementById("miniGameContainer");

  /* ===== VIDEO ===== */
  introVideo.muted = false;

  toggleSound.onclick = () => {
    introVideo.muted = !introVideo.muted;
    toggleSound.textContent = introVideo.muted ? "🔇" : "🔊";
  };

  closeVideo.onclick = endVideo;
  introVideo.onended = endVideo;

  function endVideo(){
    videoIntro.classList.add("hidden");
    setTimeout(() => scene.classList.remove("hidden"), 100);
  }

  /* ===== LOADER ===== */
  function showLoader(text, cb){
    loaderText.textContent = text;
    loader.classList.remove("hidden");
    setTimeout(() => {
      loader.classList.add("hidden");
      if(cb) cb();
    }, 1400);
  }

  /* ===== CLICK PIRATE ===== */
  pirate3.onclick = () => {
    showLoader("Chargement…", startDialog);
  };

  /* ===== DIALOGUES ===== */
  let dialogs = [];
  let index = 0;
  let onEnd = null;

  function playDialog(list, cb){
    dialogs = list;
    index = 0;
    onEnd = cb;

    dialogBox.classList.remove("hidden");
    dialogText.textContent = dialogs[index];

    nextDialog.onclick = () => {
      index++;
      if(index < dialogs.length){
        dialogText.textContent = dialogs[index];
      }else{
        dialogBox.classList.add("hidden");
        if(onEnd) onEnd();
      }
    };
  }

  function startDialog(){
    playDialog([
      "🏴‍☠️ Pirate 3 : Capitaine, personne ne connaît encore ton étal…",
      "🏴‍☠️ Pirate 2 : Alors lançons une vraie campagne de communication."
    ], startMiniGame1);
  }

  /* ===== MINI-JEU 1 ===== */
  function startMiniGame1(){
    miniGame.innerHTML = `
      <h2>📣 Faire connaître ta marque</h2>
      <button>Réseaux sociaux</button>
      <button>Newsletter</button>
      <button>Phoning</button>
      <button>Mailing</button>
      <button>Visite physique</button>
    `;
    miniGame.classList.remove("hidden");

    const btns = miniGame.querySelectorAll("button");
    btns.forEach(b => {
      b.onclick = () => {
        b.disabled = true;
        b.style.opacity = .4;
        if([...btns].every(x => x.disabled)){
          miniGame.classList.add("hidden");
        }
      };
    });
  }

});
