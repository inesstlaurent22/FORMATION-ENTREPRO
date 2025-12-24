const tresor = document.getElementById("tresor");
const loader = document.getElementById("loaderScreen");
const loaderText = document.getElementById("loaderText");
const mapGame = document.getElementById("mapGame");
const mapPieces = document.getElementById("mapPieces");
const victory = document.getElementById("victoryScreen");
const videoContainer = document.getElementById("videoContainer");
const video = document.getElementById("mainVideo");
const soundToggle = document.getElementById("soundToggle");

let order = [];
const correct = ["piece1","piece2","piece3"];

/* COFFRE */
tresor.onclick = () => {
  loaderText.textContent = "Gagne ce mini jeux pour commencer ta quête 🥳";
  loader.style.display = "flex";

  setTimeout(() => {
    loader.style.display = "none";
    startGame();
  }, 2500);
};

/* MINI JEU */
function startGame() {
  order = [];
  mapPieces.innerHTML = "";
  mapGame.style.display = "flex";

  const pieces = [
    {id:"piece1", img:"images/Carteminigauche.png"},
    {id:"piece2", img:"images/Carteminimilieu.png"},
    {id:"piece3", img:"images/Carteminidroite.png"}
  ];

  shuffle(pieces);

  pieces.forEach(p => {
    const img = document.createElement("img");
    img.src = p.img;
    img.className = "map-piece";
    img.dataset.id = p.id;

    img.onclick = () => {
      if (img.querySelector(".order-number")) return;

      order.push(p.id);

      const num = document.createElement("div");
      num.className = "order-number";
      num.textContent = order.length;
      img.appendChild(num);

      if (order.length === 3) check();
    };

    mapPieces.appendChild(img);
  });
}

function check() {
  mapGame.style.display = "none";

  if (JSON.stringify(order) === JSON.stringify(correct)) {
    victory.style.display = "flex";

    setTimeout(() => {
      victory.style.display = "none";
      launchVideo();
    }, 3500);
  } else {
    loaderText.textContent = "Mauvais ordre… réessaie !";
    loader.style.display = "flex";

    setTimeout(() => {
      loader.style.display = "none";
      startGame();
    }, 2000);
  }
}

/* VIDÉO */
function launchVideo() {
  loaderText.textContent = "L’aventure commence…";
  loader.style.display = "flex";

  setTimeout(() => {
    loader.style.display = "none";
    videoContainer.style.display = "block";
    video.play();
  }, 2000);
}

/* SON */
soundToggle.onclick = () => {
  video.muted = !video.muted;
  soundToggle.textContent = video.muted ? "🔈" : "🔊";
};

/* UTILS */
function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
}
