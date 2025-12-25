const tresor = document.getElementById("tresor");
const loader = document.getElementById("loaderScreen");
const fade = document.getElementById("fadeScreen");
const mapGame = document.getElementById("mapGame");
const mapPieces = document.getElementById("mapPieces");
const victory = document.getElementById("victoryScreen");
const videoContainer = document.getElementById("videoContainer");
const video = document.getElementById("mainVideo");
const soundToggle = document.getElementById("soundToggle");
const exitVideo = document.getElementById("exitVideo");

let order = [];
const correct = ["piece1","piece2","piece3"];

/* COFFRE CLICK */
tresor.onclick = () => {
  explodeCenter(tresor);
  fade.classList.add("active");

  setTimeout(() => {
    loader.style.display = "flex";
  }, 800);

  setTimeout(() => {
    loader.style.display = "none";
    fade.classList.remove("active");
    startGame();
  }, 2800);
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
      if (img.classList.contains("selected")) return;
      img.classList.add("selected");
      order.push(p.id);

      const badge = document.createElement("div");
      badge.className = "order-number";
      badge.textContent = order.length;
      img.appendChild(badge);

      if (order.length === 3) checkResult();
    };

    mapPieces.appendChild(img);
  });
}

function checkResult() {
  mapGame.style.display = "none";

  if (JSON.stringify(order) === JSON.stringify(correct)) {
    victory.style.display = "flex";

    setTimeout(() => {
      victory.style.display = "none";
      fade.classList.add("active");
    }, 2500);

    setTimeout(() => {
      fade.classList.remove("active");
      videoContainer.style.display = "flex";
      video.play();
    }, 4000);
  } else {
    startGame();
  }
}

/* VIDEO CONTROLS */
soundToggle.onclick = () => {
  video.muted = !video.muted;
  soundToggle.textContent = video.muted ? "🔈" : "🔊";
};

exitVideo.onclick = () => {
  window.open("menu.html", "_blank");
};

/* GEMS */
const canvas = document.getElementById("gemCanvas");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
let gems = [];

class Gem {
  constructor(x,y){
    this.x=x; this.y=y;
    this.vx=(Math.random()-0.5)*10;
    this.vy=Math.random()*-12;
    this.life=1;
  }
  update(){
    this.vy+=0.4;
    this.x+=this.vx;
    this.y+=this.vy;
    this.life-=0.02;
  }
  draw(){
    ctx.globalAlpha=this.life;
    ctx.fillStyle="gold";
    ctx.fillRect(this.x,this.y,6,6);
    ctx.globalAlpha=1;
  }
}

function explodeCenter(el){
  const r=el.getBoundingClientRect();
  for(let i=0;i<80;i++){
    gems.push(new Gem(r.left+r.width/2,r.top+r.height/2));
  }
}

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  gems=gems.filter(g=>g.life>0);
  gems.forEach(g=>{g.update();g.draw();});
  requestAnimationFrame(animate);
}
animate();

function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
}
