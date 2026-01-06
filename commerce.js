document.addEventListener("DOMContentLoaded", () => {

let state = "video";

/* ================= 🎬 VIDÉO ================= */

const videoContainer = document.getElementById("videoContainer");
const video = document.getElementById("questVideo");
const toggleSound = document.getElementById("toggleSound");
const closeVideo = document.getElementById("closeVideo");

toggleSound.onclick = () => {
  video.muted = !video.muted;
  toggleSound.textContent = video.muted ? "🔇" : "🔊";
};

closeVideo.onclick = endVideo;
video.onended = endVideo;

function endVideo(){
  fade("Chargement...", showBackground);
}

/* ================= 🌅 BACKGROUND ================= */

const background = document.getElementById("background");
const pirate2 = document.getElementById("pirate2bis");
const pirate5 = document.getElementById("pirate5bis");

function showBackground(){

  hideAll();

  background.classList.remove("hidden");
  background.style.display = "block";

  pirate2.style.left = "516px";
  pirate2.style.top = "406px";
  pirate2.style.width = "186px";
  pirate2.style.height = "178px";

  pirate5.style.left = "786px";
  pirate5.style.top = "397px";
  pirate5.style.width = "143px";
  pirate5.style.height = "187px";

  state = "background";
}

/* ================= 💬 DIALOGUES ================= */

const bubbleContainer = document.getElementById("bubbleContainer");

const dialogues = [
  {p:pirate5,t:"Bienvenue sur le marché des trésors !"},
  {p:pirate2,t:"Je suis prêt capitaine !"},
  {p:pirate5,t:"Observe, compare et choisis la meilleure stratégie."},
  {p:pirate2,t:"Ok, j’ai compris !"}
];

let dIndex = 0;

pirate5.onclick = () => {
  if(state!=="background") return;
  state="dialogue";
  dIndex=0;
  showBubble();
};

function showBubble(){
  bubbleContainer.innerHTML="";
  const d = dialogues[dIndex];
  const b = document.createElement("div");
  b.className="dialogue-bubble";

  const r = d.p.getBoundingClientRect();
  b.style.left = r.left+"px";
  b.style.top = (r.top-120)+"px";

  bubbleContainer.appendChild(b);

  typeWriter(b,d.t,()=>{
    const btn=document.createElement("button");
    btn.textContent=dIndex===dialogues.length-1?"Ok, j’ai compris":"Suite";
    btn.onclick=()=>{
      dIndex++;
      dIndex<dialogues.length?showBubble():startQuiz();
    };
    b.appendChild(btn);
  });
}

function typeWriter(el,text,cb){
  let i=0;
  el.innerHTML="";
  const t=setInterval(()=>{
    el.innerHTML+=text[i++];
    if(i>=text.length){clearInterval(t);cb();}
  },30);
}

/* ================= 🌑 FADE ================= */

const fadeScreen = document.getElementById("fadeScreen");
const loaderBox = fadeScreen.querySelector(".loaderBox");

function fade(text,cb){
  loaderBox.textContent=text;
  fadeScreen.style.display="flex";
  fadeScreen.style.opacity="1";

  setTimeout(()=>{
    fadeScreen.style.opacity="0";
    setTimeout(()=>{
      fadeScreen.style.display="none";
      cb && cb();
    },500);
  },1200);
}

/* ================= 🎮 QUIZ ================= */

const miniGame = document.getElementById("miniGameContainer");

function startQuiz(){
  fade("Termine ce mini-jeu et tu pourras continuer ta quête",()=>{
    miniGame.style.display="flex";
  });
}

/* ================= 🔥 NETTOYAGE GLOBAL ================= */

const rewardScreen = document.getElementById("rewardScreen");
const bookContainer = document.getElementById("bookContainer");

function hideAll(){
  videoContainer.classList.add("hidden");
  fadeScreen.classList.add("hidden");
  miniGame.classList.add("hidden");
  rewardScreen.classList.add("hidden");
  bookContainer.classList.add("hidden");
}

});
