const tresorButton = document.getElementById("tresor");
const loaderScreen = document.getElementById("loaderScreen");
const loaderText = document.getElementById("loaderText");
const mapGame = document.getElementById("mapGame");
const mapPiecesContainer = document.getElementById("mapPieces");
const videoContainer = document.getElementById("videoContainer");
const mainVideo = document.getElementById("mainVideo");

const clickSound = document.getElementById("clickSound");
const errorSound = document.getElementById("errorSound");

let selectedOrder = [];
const correctOrder = ["piece1", "piece2", "piece3"];

/* ===============================
   COFFRE
================================ */
tresorButton.addEventListener("click", () => {
  clickSound.play();

  const rect = tresorButton.getBoundingClientRect();
  explode(rect.left + rect.width / 2, rect.top + rect.height / 2);

  loaderText.textContent = "Le coffre s’ouvre…";
  loaderScreen.style.display = "flex";

  setTimeout(() => {
    loaderScreen.style.display = "none";
    startMiniGame();
  }, 2000);
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
    img.dataset.id = p.id;
    img.className = "map-piece";
    img.onclick = () => selectPiece(img);
    mapPiecesContainer.appendChild(img);
  });
}

function selectPiece(piece) {
  if (piece.classList.contains("selected")) return;

  clickSound.play();
  selectedOrder.push(piece.dataset.id);
  piece.classList.add("selected");
  piece.style.position = "relative";

  const badge = document.createElement("div");
  badge.className = "order-number";
  badge.textContent = selectedOrder.length;
  piece.appendChild(badge);

  if (selectedOrder.length === correctOrder.length) {
    checkResult();
  }
}

function checkResult() {
  mapGame.style.display = "none";

  if (JSON.stringify(selectedOrder) === JSON.stringify(correctOrder)) {
    loaderText.textContent = "Bravo ! L’aventure commence…";
    loaderScreen.style.display = "flex";

    setTimeout(() => {
      loaderScreen.style.display = "none";
      videoContainer.style.display = "flex";
      mainVideo.play();
    }, 2000);
  } else {
    errorSound.play();
    loaderText.textContent = "Mauvais ordre… réessaie !";
    loaderScreen.style.display = "flex";

    setTimeout(() => {
      loaderScreen.style.display = "none";
      startMiniGame();
    }, 2000);
  }
}

document.getElementById("closeVideo").onclick = () => {
  mainVideo.pause();
  videoContainer.style.display = "none";
};

/* ===============================
   GEMS
================================ */
const canvas = document.getElementById("gemCanvas");
const ctx = canvas.getContext("2d");
let gems = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Gem {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 10;
    this.vy = Math.random() * -12;
    this.life = 1;
    this.color = ["#ffd700","#00e5ff","#ff4081","#7c4dff"]
      [Math.floor(Math.random() * 4)];
  }
  update() {
    this.vy += 0.4;
    this.x += this.vx;
    this.y += this.vy;
    this.life -= 0.02;
  }
  draw() {
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, 6, 6);
    ctx.globalAlpha = 1;
  }
}

function explode(x, y) {
  for (let i = 0; i < 80; i++) gems.push(new Gem(x, y));
}

function animate() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  gems = gems.filter(g => g.life > 0);
  gems.forEach(g => { g.update(); g.draw(); });
  requestAnimationFrame(animate);
}
animate();

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
