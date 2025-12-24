const tresorButton = document.getElementById("tresorButton");
const fadeScreen = document.getElementById("fadeScreen");
const loaderScreen = document.getElementById("loaderScreen");
const loaderText = document.getElementById("loaderText");
const mapGame = document.getElementById("mapGame");
const mapPiecesContainer = document.getElementById("mapPieces");
const videoContainer = document.getElementById("videoContainer");
const finalVideo = document.getElementById("finalVideo");

const clickSound = document.getElementById("clickSound");
const errorSound = document.getElementById("errorSound");

const correctOrder = ["piece1", "piece2", "piece3"];
let selectedOrder = [];

/* ===============================
   🧰 LANCEMENT DU JEU
================================ */

tresorButton.addEventListener("click", () => {
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
   🧩 MINI JEU
================================ */

function startMiniGame() {
  mapGame.style.display = "flex";
  mapPiecesContainer.innerHTML = "";
  selectedOrder = [];

  const pieces = [
    { id: "piece1", img: "img/map1.png" },
    { id: "piece2", img: "img/map2.png" },
    { id: "piece3", img: "img/map3.png" }
  ];

  shuffleArray(pieces);

  pieces.forEach(piece => {
    const img = document.createElement("img");
    img.src = piece.img;
    img.classList.add("map-piece");
    img.dataset.id = piece.id;

    img.addEventListener("click", () => selectPiece(img));

    mapPiecesContainer.appendChild(img);
  });
}

/* ===============================
   🖱️ SÉLECTION DES PIÈCES
================================ */

function selectPiece(piece) {
  if (piece.classList.contains("selected")) return;

  clickSound.play();

  selectedOrder.push(piece.dataset.id);
  piece.classList.add("selected");

  const number = document.createElement("div");
  number.classList.add("order-number");
  number.textContent = selectedOrder.length;
  piece.appendChild(number);

  if (selectedOrder.length === correctOrder.length) {
    checkResult();
  }
}

/* ===============================
   ✅ / ❌ VÉRIFICATION
================================ */

function checkResult() {
  mapGame.style.display = "none";

  if (JSON.stringify(selectedOrder) === JSON.stringify(correctOrder)) {
    loaderText.textContent = "Bravo ! L’aventure commence...";
    loaderScreen.style.display = "flex";

    setTimeout(() => {
      loaderScreen.style.display = "none";
      showVideo();
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
   🎬 VIDÉO
================================ */

function showVideo() {
  videoContainer.style.display = "flex";
  finalVideo.play();
}

document.getElementById("closeVideo").addEventListener("click", () => {
  finalVideo.pause();
  videoContainer.style.display = "none";
});

/* ===============================
   🔀 MÉLANGE
================================ */

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
