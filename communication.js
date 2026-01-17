document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     🎬 VIDEO INTRO
  ===================================================== */
  const videoIntro  = document.getElementById("videoIntro");
  const introVideo  = document.getElementById("introVideo");
  const toggleSound = document.getElementById("toggleSound");
  const closeVideo  = document.getElementById("closeVideo");

  const loader      = document.getElementById("loader");
  const loaderText  = document.getElementById("loaderText");

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
    loader.classList.remove("hidden");
    loaderText.textContent = "Chargement…";
    setTimeout(()=>{
      loader.classList.add("hidden");
      scene.classList.remove("hidden");
    },1500);
  }

  /* =====================================================
     🧭 HUD MANAGEMENT (aucun cadran + dialogue en même temps)
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
     💬 DIALOGUES IMMERSIFS (clic sur bulle)
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
      if(dialogCallback) dialogCallback();
    }
  };

  /* =====================================================
     🏴‍☠️ DÉBUT DE LA QUÊTE
  ===================================================== */
  pirate3.onclick = () => {
    playDialog([
      { speaker:"pirate3", text:"Capitaine, ton trésor est prêt." },
      { speaker:"pirate2", text:"Mais personne ne sait qu’il existe." },
      { speaker:"pirate3", text:"La communication est la clé." }
    ], startMiniGame1);
  };

  /* =====================================================
     🎮 MINI-JEU 1 — VISIBILITÉ
  ===================================================== */
  function startMiniGame1(){
    miniGame.classList.remove("hidden");
    miniGame.innerHTML = "";

    addText("📣 La communication sert à se faire connaître.");
    addText("Sans visibilité, même le meilleur trésor reste invisible.", true);

    addButton("Continuer", () => {
      miniGame.classList.add("hidden");
      startClientsGauge();
    });
  }

  /* =====================================================
     🧭 JAUGE CLIENTS — CADRAN CENTRÉ
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
     💬 DIALOGUE ENTRE MINI-JEUX
  ===================================================== */
  function betweenMiniGamesDialog(){
    playDialog([
      { speaker:"pirate3", text:"Les clients commencent à venir." },
      { speaker:"pirate2", text:"Mais pour rester dans leur esprit, il faut une identité." }
    ], startMiniGame2);
  }

  /* =====================================================
     🎨 MINI-JEU 2 — IDENTITÉ VISUELLE (RACCOURCI)
  ===================================================== */
  function startMiniGame2(){
    miniGame.classList.remove("hidden");
    miniGame.innerHTML = "";

    addText("🎨 Identité visuelle");
    addText("Logo, couleurs et typographie permettent d’être reconnu.", true);

    addButton("Valider l’identité visuelle", () => {
      miniGame.classList.add("hidden");
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
     🎮 MINI-JEU 3 — RELIER PLATEFORMES & OBJECTIFS
  ===================================================== */
  function startMiniGame3(){
    miniGame.classList.remove("hidden");
    miniGame.innerHTML = "";

    let selectedPlatform = null;
    let completed = 0;

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

    addText("📲 Relie chaque plateforme à son objectif");

    const top = document.createElement("div");
    top.className = "visualChoices";

    platforms.forEach(p=>{
      const b = document.createElement("button");
      b.textContent = p.label;
      b.onclick = () => selectedPlatform = p;
      top.appendChild(b);
    });

    const bottom = document.createElement("div");
    bottom.className = "visualChoices";

    Object.keys(targets).forEach(key=>{
      const b = document.createElement("button");
      b.textContent = targets[key];
      b.onclick = () => {
        if(selectedPlatform && selectedPlatform.target === key){
          addText(`✅ ${selectedPlatform.label} → ${targets[key]}`, true);
          completed++;
          selectedPlatform = null;

          if(completed === 3){
            endQuest();
          }
        }
      };
      bottom.appendChild(b);
    });

    miniGame.appendChild(top);
    miniGame.appendChild(bottom);
  }

  /* =====================================================
     💎 FIN DE QUÊTE — VALIDATION + REDIRECTION
  ===================================================== */
  function endQuest(){
    miniGame.classList.add("hidden");
    loader.classList.remove("hidden");
    loaderText.textContent = "Bravo, tu as gagné cette quête";

    localStorage.setItem("pirate5Unlocked", "true");

    setTimeout(()=>{
      window.location.href = "menu.html";
    },2500);
  }

  /* =====================================================
     🧩 HELPERS UI
  ===================================================== */
  function addText(text, subtle=false){
    const p = document.createElement("p");
    p.textContent = text;
    if(subtle) p.style.opacity = ".8";
    miniGame.appendChild(p);
  }

  function addButton(label, action){
    const b = document.createElement("button");
    b.textContent = label;
    b.onclick = action;
    miniGame.appendChild(b);
  }

});
