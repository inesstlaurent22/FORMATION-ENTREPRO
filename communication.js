document.addEventListener("DOMContentLoaded", () => {

  let renommee = 0;
  let gameFinished = false;

  const renommeeFill = document.getElementById("renommeeFill");
  const renommeeValue = document.getElementById("renommeeValue");
  const harbor = document.getElementById("harbor");
  const message = document.getElementById("message");

  message.textContent = "Fais du bruit dans le port pour vendre ton trésor !";

  // Boutons réseaux
  document.querySelectorAll(".network").forEach(btn => {
    btn.addEventListener("click", () => {
      useNetwork(btn.dataset.network);
    });
  });

  function useNetwork(type){
    if(gameFinished) return;

    let gain = 0;

    if(type === "insta"){
      gain = 10;
      message.textContent = "📜 Tu montres ton trésor avec style.";
    }

    if(type === "tiktok"){
      gain = 18;
      message.textContent = "📣 Ton cri résonne dans tout le port !";
    }

    if(type === "twitter"){
      gain = 8;
      message.textContent = "🦜 Les pirates parlent de toi…";
    }

    renommee = Math.min(100, renommee + gain);
    updateRenommee();
    spawnPirates(gain);

    if(renommee >= 100){
      winGame();
    }
  }

  function updateRenommee(){
    renommeeFill.style.width = renommee + "%";
    renommeeValue.textContent = renommee + "%";
  }

  function spawnPirates(amount){
    const count = Math.floor(amount / 5);

    for(let i = 0; i < count; i++){
      const pirate = document.createElement("div");
      pirate.className = "pirate";
      pirate.textContent = "🏴‍☠️";
      pirate.style.left = Math.random() * 85 + "%";

      harbor.appendChild(pirate);

      setTimeout(() => pirate.remove(), 4000);
    }
  }

  function winGame(){
    gameFinished = true;

    message.innerHTML = `
      🏆 <strong>Victoire !</strong><br>
      Ton trésor se vend grâce à la criée pirate.<br>
      <em>Les réseaux font vendre.</em>
    `;

    // 🔗 ICI branche ton jeu principal :
    // addPO(5000);
    // nextDialogue();
    // unlockQuest();
  }

});
