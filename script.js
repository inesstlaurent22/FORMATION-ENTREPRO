document.addEventListener("DOMContentLoaded", () => {

  const tresor = document.getElementById("tresor");
  const loaderScreen = document.getElementById("loaderScreen");
  const loaderText = document.getElementById("loaderText");

  const mapGame = document.getElementById("mapGame");
  const mapPiecesContainer = document.getElementById("mapPieces");

  const victoryScreen = document.getElementById("victoryScreen");

  const errorMessage = document.getElementById("errorMessage");
  const errorSound = document.getElementById("errorSound");
  const clickSound = document.getElementById("clickSound");

  const videoContainer = document.getElementById("videoContainer");
  const mainVideo = document.getElementById("mainVideo");
  const closeVideo = document.getElementById("closeVideo");

  const correctPieces = ["1","2","3","4"];

  let foundPieces = [];

  /* 📌 affichage mini jeu après coffre */
  tresor.addEventListener("click", () => {

    clickSound.play();

    loaderScreen.style.display = "flex";
    loaderText.innerText = "Ouverture du coffre...";

    setTimeout(() => {
      loaderScreen.style.display = "none";
      mapGame.style.display = "block";
      generatePieces();
    }, 1200);
  });

function generatePieces() {

  mapPiecesContainer.innerHTML = "";
  foundPieces = [];

  const pieces = [
    { id: "gauche", src: "images/Carteminigauche.png" },
    { id: "milieu", src: "images/Carteminimilieu.png" },
    { id: "droite", src: "images/Carteminidroite.png" }
  ];

  pieces.forEach(p => {
    const piece = document.createElement("img");
    piece.src = p.src;
    piece.dataset.id = p.id;
    piece.classList.add("mapPiece");

    piece.addEventListener("click", () => handlePieceClick(piece));

    mapPiecesContainer.appendChild(piece);
  });
}

  /* 🎯 gestion clic pièce */
  function handlePieceClick(piece) {

    const id = piece.dataset.id;

    // bonne pièce
    if (correctPieces.includes(id) && !foundPieces.includes(id)) {
      foundPieces.push(id);
      piece.style.opacity = "0.4";

      if (foundPieces.length === correctPieces.length) {
        showVictory();
      }
      return;
    }

    // ❌ MAUVAISE PIÈCE
    errorSound.play();

    // texte clignotant
    errorMessage.style.display = "block";
    errorMessage.classList.remove("error-blink");
    void errorMessage.offsetWidth;
    errorMessage.classList.add("error-blink");

    // pièce secouée
    piece.classList.remove("shake");
    void piece.offsetWidth;
    piece.classList.add("shake");
  }

  /* 🏆 VICTOIRE */
  function showVictory() {
    mapGame.style.display = "none";
    victoryScreen.style.display = "flex";

    setTimeout(() => {
      videoContainer.style.display = "block";
      mainVideo.play();
    }, 1500);
  }

  /* 🎥 fermeture vidéo → fin cinématique */
  closeVideo.addEventListener("click", () => {
    mainVideo.pause();
    videoContainer.style.display = "none";
  });

});
