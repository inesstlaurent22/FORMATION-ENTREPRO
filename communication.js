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

  /* =====================================================
     🎬 VIDEO (iOS SAFE)
  ===================================================== */
  introVideo.muted = true;
  introVideo.play().catch(()=>{});

  toggleSound.addEventListener("click", () => {
    introVideo.muted = !introVideo.muted;
    introVideo.play().catch(()=>{});
    toggleSound.textContent = introVideo.muted ? "🔊" : "🔈";
  });

  function endVideo(){
    videoIntro.classList.add("hidden");
    loader.classList.remove("hidden");
    loaderText.textContent = "Chargement…";

    setTimeout(()=>{
      loader.classList.add("hidden");
      scene.classList.remove("hidden");
    },1500);
  }

  closeVideo.addEventListener("click", endVideo);
  introVideo.addEventListener("ended", endVideo);

  /* =====================================================
     💬 SYSTÈME DE DIALOGUES (clic sur bulle)
  ===================================================== */
  let dialogs = [];
  let dialogIndex = 0;
  let dialogCallback = null;

  function playDialog(list, callback){
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

  dialogBox.addEventListener("click", () => {
    dialogIndex++;
    if(dialogIndex < dialogs.length){
      showDialogLine();
    } else {
      dialogBox.classList.add("hidden");
      if(dialogCallback) dialogCallback();
    }
  });

  /* =====================================================
     🏴‍☠️ DÉBUT DE QUÊTE
  ===================================================== */
  pirate3.addEventListener("click", () => {
    playDialog([
      { speaker:"pirate3", text:"Capitaine, ton trésor est prêt." },
      { speaker:"pirate2", text:"Mais personne ne sait qu’il existe." },
      { speaker:"pirate3", text:"Il est temps d’apprendre à communiquer." }
    ], startMiniGame1);
  });

  /* =====================================================
     🎮 MINI-JEU 1 – COMMUNICATION
  ===================================================== */
  function startMiniGame1(){
    miniGame.classList.remove("hidden");
    miniGame.innerHTML = "";

    addText("📣 La communication sert à faire connaître ta marque.");
    addText(
      "Sans visibilité, même le meilleur trésor reste invisible.",
      true
    );

    addButton("Continuer", endMiniGame1);
  }

  function endMiniGame1(){
    miniGame.classList.add("hidden");
    startClientsGauge();
  }

  /* =====================================================
     🧭 JAUGE CLIENTS (CADRAN PIRATE)
  ===================================================== */
  function startClientsGauge(){
    const panel = document.createElement("div");
    panel.className = "piratePanel";

    panel.innerHTML = `
      <h4>Clients attirés par ta communication</h4>
      <div class="pirateProgressBar">
        <div class="pirateProgressFill"></div>
      </div>
      <div class="pirateProgressText">0 / 10</div>
    `;

    document.body.appendChild(panel);

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
          panel.remove();
          betweenMiniGamesDialog();
        },800);
      }
    },400);
  }

  /* =====================================================
     💬 DIALOGUES ENTRE MINI-JEUX
  ===================================================== */
  function betweenMiniGamesDialog(){
    playDialog([
      { speaker:"pirate3", text:"Les clients commencent à venir." },
      { speaker:"pirate2", text:"Mais pour rester dans leur esprit, il faut une identité." }
    ], startMiniGame2);
  }

  /* =====================================================
     🎨 MINI-JEU 2 – IDENTITÉ VISUELLE
  ===================================================== */
  function startMiniGame2(){
    miniGame.classList.remove("hidden");
    miniGame.innerHTML = "";

    addText("🎨 Identité visuelle");
    addText(
      "L’identité visuelle permet aux clients de reconnaître une marque immédiatement.",
      true
    );
    addText(
      "🎯 Objectif : créer une identité visuelle dont les clients se souviendront."
    );

    addButton("Commencer", chooseLogo);
  }

  function chooseLogo(){
    miniGame.innerHTML = "";
    addText("Choisis ton logo (choix libre)");
    addImages(["logo1.png","logo2.png","logo3.png"], chooseColors);
  }

  function chooseColors(){
    miniGame.innerHTML = "";
    addText("🎨 Les couleurs");

    addImages(
      ["colors_good.png","colors_bad1.png","colors_bad2.png"],
      (index)=>{
        if(index === 0){
          addText("✅ Bonne réponse !");
          addText(
            "Les couleurs doivent être cohérentes avec le style du logo. " +
            "Ce seront tes couleurs obligatoires pour flyers, newsletters et réseaux sociaux.",
            true
          );
          addButton("Continuer", chooseTypography);
        }
      }
    );
  }

  function chooseTypography(){
    miniGame.innerHTML = "";
    addText("✍️ Typographie");
    addText(
      "Le style d’écriture (polices, tons et mise en forme).",
      true
    );

    addImages(
      ["typo_good.png","typo_bad1.png","typo_bad2.png"],
      (index)=>{
        if(index === 0){
          addText("✅ Bonne réponse !");
          addText(
            "La typographie est très importante. " +
            "Comme le logo, tu devras la garder pour tous tes designs.",
            true
          );
          addButton("Finaliser", endMiniGame2);
        }
      }
    );
  }

  function endMiniGame2(){
    miniGame.innerHTML = "";
    addText(
      "🎉 Maintenant que tu as créé ton identité visuelle, " +
      "ta marque sera reconnue par tous et très rapidement."
    );

    setTimeout(()=>{
      animateIdentityVisual();
    },800);
  }

  /* =====================================================
     🖼️ ANIMATION IDENTITÉ VISUELLE
  ===================================================== */
  function animateIdentityVisual(){
    const img = document.createElement("img");
    img.src = "images/identity-final.png";
    img.id = "flyerCenter";
    document.body.appendChild(img);

    setTimeout(()=>{
      img.remove();
      socialMediaDialog();
    },1800);
  }

  /* =====================================================
     💬 DIALOGUES – RÉSEAUX & CAMPAGNES
  ===================================================== */
  function socialMediaDialog(){
    playDialog([
      { speaker:"pirate3", text:"Les réseaux sociaux boostent ta visibilité." },
      { speaker:"pirate2", text:"Et les campagnes bien ciblées attirent les bons clients." }
    ], startMiniGame3);
  }

  /* =====================================================
     🎮 MINI-JEU 3 – PLATEFORMES
  ===================================================== */
  function startMiniGame3(){
    miniGame.classList.remove("hidden");
    miniGame.innerHTML = "";

    addText("📲 Associe chaque plateforme à son rôle");

    addButton("TikTok / Instagram", ()=>{
      addText("👉 Faire connaître la marque", true);

      addButton("Shopify", ()=>{
        addText("👉 Vendre en BtoC", true);

        addButton("Facebook / LinkedIn", ()=>{
          addText("👉 Vendre en BtoB et se faire connaître", true);
          showBtoPanel();
        });
      });
    });
  }

  /* =====================================================
     📘 CADRAN BtoB / BtoC
  ===================================================== */
  function showBtoPanel(){
    miniGame.innerHTML = "";

    addText("📘 Différence BtoB / BtoC");
    addText("BtoC : vente directe aux particuliers.", true);
    addText("BtoB : vente à d’autres entreprises.", true);

    addButton("Continuer", endQuest);
  }

  /* =====================================================
     💎 FIN DE QUÊTE – GEMS + REDIRECTION
  ===================================================== */
  function endQuest(){
    miniGame.classList.add("hidden");

    loader.classList.remove("hidden");
    loaderText.textContent = "Bravo, tu as gagné cette quête";

    explodeGems();

    localStorage.setItem("pirate5Unlocked", "true");

    setTimeout(()=>{
      window.location.href = "menu.html";
    },2500);
  }

  function explodeGems(){
    for(let i=0;i<28;i++){
      const g = document.createElement("div");
      g.className = "gem";
      g.style.left = "50%";
      g.style.top  = "50%";
      g.style.setProperty("--x",`${Math.random()*400-200}px`);
      g.style.setProperty("--y",`${Math.random()*400-200}px`);
      document.body.appendChild(g);
      setTimeout(()=>g.remove(),1400);
    }
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
    b.addEventListener("click", action);
    miniGame.appendChild(b);
  }

  function addImages(list, callback){
    const div = document.createElement("div");
    div.className = "visualChoices";

    list.forEach((src, i)=>{
      const img = document.createElement("img");
      img.src = `images/${src}`;
      img.addEventListener("click", ()=>callback(i));
      div.appendChild(img);
    });

    miniGame.appendChild(div);
  }

});
