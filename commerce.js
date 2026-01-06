document.addEventListener("DOMContentLoaded", () => {

let state = "video";

/* ================= 🎬 VIDÉO ================= */

const video = document.getElementById("questVideo");
const videoContainer = document.getElementById("videoContainer");
const toggleSound = document.getElementById("toggleSound");
const closeVideo = document.getElementById("closeVideo");

toggleSound.onclick = () => {
  video.muted = !video.muted;
  toggleSound.textContent = video.muted ? "🔇" : "🔊";
};

function endVideo(){
  fade("Chargement...", () => {
    videoContainer.style.display = "none";
    showBackground();
  });
}

closeVideo.onclick = endVideo;
video.onended = endVideo;

/* ================= 🌅 BACKGROUND ================= */

function showBackground() {

  // 🔥 sécurité : on enlève tout ce qui peut bloquer
  fadeScreen.style.display = "none";
  videoContainer.style.display = "none";
  rewardScreen && (rewardScreen.style.display = "none");
  miniGameContainer && (miniGameContainer.style.display = "none");
  bookContainer && (bookContainer.style.display = "none");

  // 🎬 affichage background
  background.style.display = "block";
  background.style.opacity = "0";

  // 📍 placement pirates
  pirate2bis.style.left = "516px";
  pirate2bis.style.top = "406px";
  pirate2bis.style.width = "186px";
  pirate2bis.style.height = "178px";

  pirate5bis.style.left = "786px";
  pirate5bis.style.top = "397px";
  pirate5bis.style.width = "143px";
  pirate5bis.style.height = "187px";

  // ✨ fade in propre
  requestAnimationFrame(() => {
    background.style.opacity = "1";
  });

  state = "background";
}

/* ================= 💬 DIALOGUES ================= */

const dialogues = [
  {p: pirate5, t: "Bienvenue sur le marché des trésors !"},
  {p: pirate2, t: "Je suis prêt capitaine !"},
  {p: pirate5, t: "Observe, compare et fais les bons choix."},
  {p: pirate2, t: "Ok, j’ai compris !"}
];

let dIndex = 0;
const bubbleContainer = document.getElementById("bubbleContainer");

pirate5.onclick = () => {
  if(state !== "background") return;
  state = "dialogue";
  dIndex = 0;
  showBubble();
};

function showBubble(){
  bubbleContainer.innerHTML = "";
  const d = dialogues[dIndex];

  const bubble = document.createElement("div");
  bubble.className = "dialogue-bubble";
  bubble.textContent = "";

  const r = d.p.getBoundingClientRect();
  bubble.style.left = r.left + "px";
  bubble.style.top = (r.top - 120) + "px";

  bubbleContainer.appendChild(bubble);

  typeWriter(bubble, d.t, () => {
    const btn = document.createElement("button");
    btn.textContent = dIndex === dialogues.length -1 ? "Ok, j’ai compris" : "Suite";
    btn.onclick = () => {
      dIndex++;
      dIndex < dialogues.length ? showBubble() : startQuiz();
    };
    bubble.appendChild(btn);
  });
}

function typeWriter(el, text, cb){
  let i=0;
  el.innerHTML="";
  const t = setInterval(()=>{
    el.innerHTML += text[i++];
    if(i>=text.length){ clearInterval(t); cb(); }
  },30);
}

/* ================= 🌑 FADE ================= */

const fadeScreen = document.getElementById("fadeScreen");
const loaderBox = fadeScreen.querySelector(".loaderBox");

function fade(text, cb){
  loaderBox.textContent = text;
  fadeScreen.style.display="flex";
  setTimeout(()=>{
    fadeScreen.style.display="none";
    cb && cb();
  },1800);
}

/* ================= 🎮 QUIZ ================= */

const miniGame = document.getElementById("miniGameContainer");
const qEl = document.getElementById("gameQuestion");
const aEl = document.getElementById("gameAnswers");
const hint = document.getElementById("multiHint");
const counter = document.getElementById("counter");

const quiz = [
  {q:"Que doivent-ils observer ?", a:["Pierres","Concurrents","Météo"], c:[0,1]}
];

let qi=0, selected=[];

function startQuiz(){
  fade("Termine ce mini-jeu et tu pourras continuer ta quête", ()=>{
    state="quiz";
    miniGame.style.display="flex";
    showQuestion();
  });
}

function showQuestion(){
  selected=[];
  const q=quiz[qi];
  qEl.textContent=q.q;
  aEl.innerHTML="";
  hint.textContent = q.c.length>1 ? "Plusieurs réponses possibles" : "";
  counter.textContent = "";

  q.a.forEach((txt,i)=>{
    const b=document.createElement("button");
    b.textContent=txt;
    b.onclick=()=>{
      if(selected.includes(i)) return;
      selected.push(i);
      b.classList.add("selected");
      counter.textContent = selected.length+" / "+q.c.length;

      if(selected.length===q.c.length){
        setTimeout(()=>{
          selected.sort().join()==q.c.sort().join() ? win() : showQuestion();
        },500);
      }
    };
    aEl.appendChild(b);
  });
}

/* ================= 🏆 VICTOIRE ================= */

const reward = document.getElementById("rewardScreen");

function win(){
  miniGame.style.display="none";
  reward.style.display="flex";
  setTimeout(showBook,2500);
}

/* ================= 📖 LIVRE ================= */

const book = document.getElementById("bookContainer");
const rightPage = document.getElementById("rightPage");
const leftPage = document.getElementById("leftPage");
const continueBtn = document.getElementById("continueQuestBtn");

const pages = [
  "images/Businessplancov.png",
  "images/Businessplan1.png",
  "images/Businessplan2.png",
  "images/Businessplan3.png"
];

let pi=0;

function showBook(){
  reward.style.display="none";
  book.style.display="flex";
  updateBook();
}

function updateBook(){
  rightPage.src = pages[pi];
  leftPage.src = pi>0 ? "images/Businessplan4.jpg" : "";
  continueBtn.style.display = pi===pages.length-1 ? "block" : "none";
}

book.onclick = e=>{
  if(e.offsetX > book.clientWidth/2 && pi<pages.length-1){
    pi++; updateBook();
  }
};

continueBtn.onclick = ()=>{
  book.style.display="none";
  showBackground();
};

});
