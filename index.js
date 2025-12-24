const tresorButton = document.getElementById("tresorButton");
const fadeScreen = document.getElementById("fadeScreen");
const loaderScreen = document.getElementById("loaderScreen");
const loaderText = document.getElementById("loaderText");
const mapGame = document.getElementById("mapGame");
const mapPiecesContainer = document.getElementById("mapPieces");
const videoContainer = document.getElementById("videoContainer");
const mainVideo = document.getElementById("mainVideo");

const clickSound = document.getElementById("clickSound");
const errorSound = document.getElementById("errorSound");

let gameStarted = false;
let selectedOrder = [];

const correctOrder = ["piece1", "piece2", "piece3"];

/* ===============================
   COFFRE
================================ */
tresorButton.addEventListener("click", () => {
  if (gameStarted) return;
  gameStarted = true;

  clickSound.play();
  fadeScreen.classList.add("active");

  setTimeout(() => {
    loaderText.textContent = "Gagne ce mini jeu pour commencer l’aventure";
    loaderScreen.style.display = "flex";
  }, 600);

  setTimeout(() => {
    loaderScreen.style.display = "none";
    fadeScreen.classList.remove("active");
    startMiniGame();
  }, 2400);
});

/* ===============================
   MINI JEU
================================ */
function startMiniGame() {
  selectedOrder = [];
  mapGame.style.display = "flex";
  mapPiecesContainer.innerHTML = "";

  const pieces = [
    { id: "piece1", img: "images/Carteminigauche.png" },
    { id: "piece2", img: "images/Carteminimilieu.png" },
    { id: "piece3", img: "images/Carteminidroite.png" }
  ];

  shuffleArray(pieces);

  pieces.forEach(p => {
    const img = document.createElement("img");
    img.src = p.img;
    img.className = "map-piece";
    img.dataset.id = p.id;

    img.addEventListener("click", () => selectPiece(img));
    mapPiecesContainer.appendChild(img);
  });
}

/* ===============================
   SÉLECTION
================================ */
function selectPiece(piece) {
  if (piece.classList.contains("selected")) return;

  clickSound.play();
  selectedOrder.push(piece.dataset.id);
  piece.classList.add("selected");

  const number = document.createElement("div");
  number.className = "order-number";
  number.textContent = selectedOrder.length;
  piece.appendChild(number);

  if (selectedOrder.length === correctOrder.length) {
    checkResult();
  }
}

/* ===============================
   RÉSULTAT
================================ */
function checkResult() {
  mapGame.style.display = "none";

  if (JSON.stringify(selectedOrder) === JSON.stringify(correctOrder)) {
    loaderText.textContent = "Bravo ! L’aventure commence...";
    loaderScreen.style.display = "flex";

    setTimeout(() => {
      loaderScreen.style.display = "none";
      videoContainer.style.display = "flex";
      mainVideo.play();
    }, 2000);
  } else {
    errorSound.play();
    loaderText.textContent = "Tu as échoué, réessaye !";
    loaderScreen.style.display = "flex";

    setTimeout(() => {
      loaderScreen.style.display = "none";
      startMiniGame();
    }, 2000);
  }
}

/* ===============================
   VIDÉO
================================ */
document.getElementById("closeVideo").addEventListener("click", () => {
  mainVideo.pause();
  videoContainer.style.display = "none";
});

/* ===============================
   UTILS
================================ */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
