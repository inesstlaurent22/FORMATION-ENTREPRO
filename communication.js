let renommee = 0;
let piratesCount = 0;
let gameFinished = false;

const renommeeFill = document.getElementById("renommeeFill");
const renommeeValue = document.getElementById("renommeeValue");
const harbor = document.getElementById("harbor");
const message = document.getElementById("message");

function useNetwork(type){
  if(gameFinished) return;

  let gain = 0;

  switch(type){
    case "insta":
      gain = 10;
      message.textContent = "📜 Tu montres ton trésor avec style.";
      break;
    case "tiktok":
      gain = 18;
      message.textContent = "📣 Ton cri résonne dans tout le port !";
      break;
    case "twitter":
      gain = 8;
      message.textContent = "🦜 Les pirates parlent de toi…";
      break;
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
  let count = Math.floor(amount / 5);

  for(let i=0;i<count;i++){
    piratesCount++;

    const pirate = document.createElement("div");
    pirate.className = "pirate";
    pirate.textContent = "🏴‍☠️";
    pirate.style.left = Math.random()*85 + "%";

    harbor.appendChild(pirate);

    setTimeout(()=>pirate.remove(),4000);
  }
}

function winGame(){
  gameFinished = true;
  message.innerHTML = `
    🏆 <strong>Victoire !</strong><br>
    Ton trésor se vend grâce à la criée pirate.<br>
    <em>Les réseaux font vendre.</em>
  `;

  // 👉 ICI tu peux brancher :
  // addPO(5000)
  // nextDialogue()
  // unlockQuest()
}
