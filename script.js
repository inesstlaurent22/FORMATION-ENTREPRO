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

const clickSound = document.getElementById("clickSound");
const errorSound = document.getElementById("errorSound");

const canvas = document.getElementById("gemCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gems = [];
let order = [];
const correct = ["piece1","piece2","piece3"];

/* 💎 GEMS – FORMES DIAMANT */
function explodeGems(x, y) {
  const colors = ["#ff4d4d", "#4dd2ff", "#b84dff", "#4dff88", "#ffd24d"];

  for (let i = 0; i < 30; i++) {
    gems.push({
      x,
      y,
      size: Math.random() * 10 + 8,
      dx: (Math.random() - 0.5) * 7,
      dy: (Math.random() - 0.5) * 7,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 70
    });
  }
}

function drawGem(g) {
  ctx.save();
  ctx.translate(g.x, g.y);
  ctx.rotate(Math.random());

  ctx.beginPath();
  ctx.moveTo(0, -g.size);
  ctx.lineTo(g.size, 0);
  ctx.lineTo(0, g.size);
  ctx.lineTo(-g.size, 0);
  ctx.closePath();

  ctx.fillStyle = g.color;
  ctx.shadowColor = g.color;
  ctx.shadowBlur = 20;
  ctx.fill();
  ctx.restore();
}

function animateGems() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  gems.forEach((g, i) => {
    g.x += g.dx;
    g.y += g.dy;
    g.life--;

    drawGem(g);
    if (g.life <= 0) gems.splice(i,1);
  });

  requestAnimationFrame(animateGems);
}
animateGems();

/* 🧰 COFFRE */
tresor.addEventListener("click", (e) => {
  clickSound.play();
  explodeGems(e.clientX, e.clientY);

  /* ⏳ 3 secondes avant le loader */
  setTimeout(() => {
    loaderText.textContent = "✨ Gagne ce mini jeux pour commencer ta quête ✨";
    loader.style.display = "flex";

    setTimeout(() => {
      loader.style.display = "none";
      startGame();
    }, 2500);

  }, 3000);
});

/* 🗺 MINI JEU */
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
    const wrapper = document.createElement("div");
    wrapper.className = "piece-wrapper";

    const img = document.createElement("img");
    img.src = p.img;
    img.className = "map-piece";

    img.onclick = () => {
      if (img.classList.contains("selected")) return;

      img.classList.add("selected");
      order.push(p.id);

      const number = document.createElement("div");
      number.className = "order-number";
      number.textContent = order.length;
      wrapper.appendChild(number);

      if (order.length === 3) checkResult();
    };

    wrapper.appendChild(img);
    mapPieces.appendChild(wrapper);
  });
}

function checkResult() {
  setTimeout(() => {
    mapGame.style.display = "none";

    if (JSON.stringify(order) === JSON.stringify(correct)) {
      victory.style.display = "flex";

      setTimeout(() => {
        victory.style.display = "none";
        launchVideo();
      }, 3500);

    } else {
      errorSound.play();
      loaderText.textContent = "❌ Mauvais ordre… réessaie !";
      loader.style.display = "flex";

      setTimeout(() => {
        loader.style.display = "none";
        startGame();
      }, 2000);
    }
  }, 700);
}

/* 🎬 VIDÉO */
function launchVideo() {
  loaderText.textContent = "🌊 L’aventure commence…";
  loader.style.display = "flex";

  setTimeout(() => {
    loader.style.display = "none";
    videoContainer.style.display = "flex";

    video.muted = false;
    video.currentTime = 0;
    video.play();
  }, 2000);
}

/* 🔊 SON */
soundToggle.onclick = () => {
  video.muted = !video.muted;
  soundToggle.textContent = video.muted ? "🔈" : "🔊";
};

/* ❌ FERMETURE */
closeVideo.onclick = () => {
  window.open("menu.html", "_blank");
};

/* UTILS */
function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
}
