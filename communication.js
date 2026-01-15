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

  /* 🎬 VIDEO */
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

  /* 💬 DIALOGUE */
  pirate3.onclick = () => {
    dialogBox.classList.remove("hidden");
    dialogText.textContent =
      "Pour que tout le marché te connaisse, il faut maîtriser les moyens de communication.";
  };

  nextDialog.onclick = () => {
    dialogBox.classList.add("hidden");
    startMiniGame1();
  };

  /* 🎮 MINI JEU 1 – FORMES DE COMMUNICATION */
  function startMiniGame1(){
    miniGame.innerHTML = `
      <h2>📣 Mini-jeu : La Communication</h2>
      <p>Sélectionne tous les moyens efficaces pour te faire connaître.</p>
      <button class="btn-pirate mg">Réseaux sociaux</button>
      <button class="btn-pirate mg">Newsletter</button>
      <button class="btn-pirate mg">Phoning</button>
      <button class="btn-pirate mg">Mailing</button>
      <button class="btn-pirate mg">Visite physique</button>
    `;
    miniGame.classList.remove("hidden");

    const btns = miniGame.querySelectorAll(".mg");
    btns.forEach(btn=>{
      btn.onclick = () => {
        btn.disabled = true;
        btn.style.opacity = .5;

        if([...btns].every(b=>b.disabled)){
          miniGame.innerHTML = `
            <h2>✅ Bravo</h2>
            <p>Plus tu multiplies les canaux, plus ta marque est connue.</p>
            <button class="btn-pirate" id="endMG">Continuer</button>
          `;
          document.getElementById("endMG").onclick = () => {
            miniGame.classList.add("hidden");
          };
        }
      };
    });
  }

});
