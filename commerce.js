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

video.onended = endVideo;
closeVideo.onclick = endVideo;

function endVideo(){
  fade("Chargement...", showBackground);
}

/* ================= 🌅 BACKGROUND ================= */

const background = document.getElementById("background");
const pirate2 = document.getElementById("pirate2bis");
const pirate5 = document.getElementById("pirate5bis");

function showBackground(){
  hideAll();
  background.style.display="block";

  pirate2.style.left="516px";
  pirate2.style.top="406px";
  pirate2.style.width="186px";

  pirate5.style.left="786px";
  pirate5.style.top="397px";
  pirate5.style.width="143px";

  state="background";
}

/* ================= 💬 DIALOGUES ================= */

const bubbleContainer = document.getElementById("bubbleContainer");
const skipBtn = document.getElementById("skipDialoguesBtn");

const dialogues = [
  {p:pirate5,t:"Bienvenue sur le marché des trésors !"},
  {p:pirate2,t:"Je suis prêt capitaine !"},
  {p:pirate5,t:"Observe, compare et choisis la meilleure stratégie."},
  {p:pirate2,t:"Ok, j’ai compris !"}
];

let dIndex=0;

pirate5.onclick=()=>{
  if(state!=="background")return;
  state="dialogue";
  dIndex=0;
  skipBtn.style.display="block";
  showBubble();
};

skipBtn.onclick=endDialogues;

function showBubble(){
  bubbleContainer.innerHTML="";
  const d=dialogues[dIndex];

  const bubble=document.createElement("div");
  bubble.className="dialogue-bubble";

  const text=document.createElement("div");
  text.className="text";

  const r=d.p.getBoundingClientRect();
  bubble.style.left=r.left+"px";
  bubble.style.top=(r.top-140)+"px";

  bubble.appendChild(text);
  bubbleContainer.appendChild(bubble);

  typeWriter(text,d.t,()=>{
    const btn=document.createElement("button");
    btn.textContent=dIndex===dialogues.length-1
      ? "Ok, j’ai compris"
      : "Suite";
    btn.onclick=()=>{
      dIndex++;
      dIndex<dialogues.length ? showBubble() : endDialogues();
    };
    bubble.appendChild(btn);
  });
}

function endDialogues(){
  skipBtn.style.display="none";
  bubbleContainer.innerHTML="";
  fade("Termines ce mini-jeu et tu pourras continuer ta quête", startQuiz);
}

function typeWriter(el,text,cb){
  let i=0;
  el.innerHTML="";
  const t=setInterval(()=>{
    el.innerHTML+=text[i++];
    if(i>=text.length){
      clearInterval(t);
      cb();
    }
  },28);
}

/* ================= 🌑 FADE ================= */

const fadeScreen=document.getElementById("fadeScreen");
const loaderBox=fadeScreen.querySelector(".loaderBox");

function fade(text,cb){
  loaderBox.textContent=text;
  fadeScreen.style.display="flex";
  setTimeout(()=>{
    fadeScreen.style.display="none";
    cb&&cb();
  },1600);
}

/* ================= 🎮 MINI JEU ================= */

const miniGame=document.getElementById("miniGameContainer");

function startQuiz(){
  hideAll();
  miniGame.style.display="flex";
}

/* ================= 🔥 NETTOYAGE ================= */

function hideAll(){
  videoContainer.classList.add("hidden");
  fadeScreen.classList.add("hidden");
  miniGame.classList.add("hidden");
  document.getElementById("rewardScreen").classList.add("hidden");
  document.getElementById("bookContainer")?.classList.add("hidden");
}

});
