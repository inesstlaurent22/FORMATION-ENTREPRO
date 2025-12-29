/* === tes constantes inchangées au début === */
const tresor = document.getElementById("tresor");
const loader = document.getElementById("loaderScreen");
const loaderText = document.getElementById("loaderText");
const mapGame = document.getElementById("mapGame");
const mapPieces = document.getElementById("mapPieces");
const victory = document.getElementById("victoryScreen");
const videoContainer = document.getElementById("videoContainer");
const video = document.getElementById("mainVideo");
const soundToggle = document.getElementById("soundToggle");
const closeVideo = document.getElementById("closeVideo");
const cinematicFade = document.getElementById("cinematicFade");

const clickSound = document.getElementById("clickSound");
const errorSound = document.getElementById("errorSound");

/* === GEMS (inchangé) === */
/* … ton code gemmes identique ici … */

/* ===================== MINI-JEU ===================== */
/* inchangé sauf responsive images */
let order = [];
const correct = ["piece1", "piece2", "piece3"];

function startGame() {
  tresor.classList.add("hide");
  order = [];
  mapPieces.innerHTML = "";
  mapGame.style.display = "flex";

  const pieces = [
    { id: "piece1", img: "images/Carteminigauche.png" },
    { id: "piece2", img: "images/Carteminimilieu.png" },
    { id: "piece3", img: "images/Carteminidroite.png" }
  ];

  shuffle(pieces);

  pieces.forEach(p => {
    const wrapper = document.createElement("div");
    wrapper.className = "map-piece-wrapper";

    const img = document.createElement("img");
    img.src = p.img;
    img.className = "map-piece inactive";

    wrapper.onclick = () => {
      if (wrapper.classList.contains("active")) return;

      clickSound.play();
      wrapper.classList.add("active");
      img.classList.remove("inactive");

      order.push(p.id);

      const num = document.createElement("div");
      num.className = "order-number";
      num.textContent = order.length;
      wrapper.appendChild(num);

      if (order.length === 3) checkResult();
    };

    wrapper.appendChild(img);
    mapPieces.appendChild(wrapper);
  });
}

/* ===================== VIDÉO ===================== */

function launchVideo() {
  videoContainer.style.display = "flex";
  video.currentTime = 0;
  video.play().catch(() => {});
}

/* 🔊 mute/unmute */
soundToggle.onclick = () => {
  video.muted = !video.muted;
  soundToggle.textContent = video.muted ? "🔇" : "🔉";
};

/* 👉👉 FULLSCREEN QUAND ON CLIQUE SUR LA VIDÉO */
video.addEventListener("click", async () => {
  if (!document.fullscreenElement) {
    if (video.requestFullscreen) await video.requestFullscreen();
  } else {
    if (document.exitFullscreen) await document.exitFullscreen();
  }
});

/* quitter vidéo ou fin → menu */
video.onended = goToMenu;
closeVideo.onclick = goToMenu;

function goToMenu() {
  cinematicFade.classList.add("active");
  setTimeout(() => {
    window.location.href = "menu.html";
  }, 1200);
}

/* utils shuffle inchangé */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
