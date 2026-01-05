document.addEventListener("DOMContentLoaded",()=>{

/* PIRATES */
const pirate2bis = document.getElementById("pirate2bis");
const pirate5bis = document.getElementById("pirate5bis");
const bubbleContainer = document.getElementById("bubbleContainer");

/* ============================
   💬 DIALOGUES
============================ */
let dialogueStep = 0;
const dialogues = [
  { who:"maitre", text:"Moussaillon ! Bienvenue sur le marché des trésors ! Ici, plein de pirates vendent des pierres précieuses… mais pour toi, qui débutes, faudra suivre mes conseils !", anchor:pirate5bis },
  { who:"apprenti", text:"J’suis prêt, capitaine !", anchor:pirate2bis },
  { who:"maitre", text:"Écoute bien ! D’abord, tu dois te mettre au niveau des autres pirates… parle comme eux, montre que tu connais tes pierres. Ensuite… sois plus malin et plus rapide qu’eux ! Faut que tous les clients viennent chez toi !", anchor:pirate5bis },
  { who:"apprenti", text:"Mais comment je fais ça ?", anchor:pirate2bis },
  { who:"maitre", text:"Regarde bien : la plupart ont une petite échoppe et vendent leurs pierres dans des petits sachets en velours. Les clients adorent ça ! Donc toi aussi, il te faudra une échoppe et des sachets. Mais attention… tes pierres ressemblent à celles des autres ! Faut que tu te démarques !", anchor:pirate5bis },
  { who:"apprenti", text:"Me démarquer… c’est-à-dire ?", anchor:pirate2bis },
  { who:"maitre", text:"Plusieurs stratégies, moussaillon :<br>• vendre moins cher<br>• vendre tes pierres dans des boîtes en bois qui sont plus luxueux que les sachets<br>• avoir une grande boutique visible<br>• aller chez les clients directement", anchor:pirate5bis },
  { who:"apprenti", text:"Ahhh… donc je choisis la meilleure stratégie selon mes clients !", anchor:pirate2bis },
  { who:"maitre", text:"Exactement ! Observe, teste, et deviens le pirate que tout le monde veut rencontrer.", anchor:pirate5bis },
  { who:"apprenti", text:"MERCI capitaine !", anchor:pirate2bis }
];

function createBubble(dialogue){
  bubbleContainer.innerHTML="";
  const div=document.createElement("div");
  div.className="dialogue-bubble";
  div.innerHTML=`<div class="name">${dialogue.who==="maitre"?"Maître pirate":"Apprenti pirate"}</div>${dialogue.text}`;
  const btn=document.createElement("button");
  btn.textContent = dialogueStep < dialogues.length-1 ? "Suite" : "OK, j’ai compris";
  btn.onclick = nextBubble;
  div.appendChild(btn);

  bubbleContainer.appendChild(div);

  const rect = dialogue.anchor.getBoundingClientRect();
  div.style.left = rect.left + "px";
  div.style.top = (rect.top - div.offsetHeight - 20) + "px";
}

function nextBubble(){
  dialogueStep++;
  if(dialogueStep < dialogues.length){
    createBubble(dialogues[dialogueStep]);
  } else {
    bubbleContainer.innerHTML="";
    launchMiniGame();
  }
}

pirate5bis.addEventListener("click",()=>{
  dialogueStep=0;
  createBubble(dialogues[0]);
});

/* ============================
   🎮 MINI JEU (déjà intégré)
============================ */
const fadeScreen=document.getElementById("fadeScreen");
const miniGameContainer=document.getElementById("miniGameContainer");
const gameQuestion=document.getElementById("gameQuestion");
const gameAnswers=document.getElementById("gameAnswers");
const gameFeedback=document.getElementById("gameFeedback");

const questions=[/* 👉 celles que tu as validées juste avant */];

let step=0, selected=[];

function launchMiniGame(){
  fadeScreen.style.display="flex";
  setTimeout(()=>{
    fadeScreen.style.display="none";
    startMiniGame();
  },1800);
}

/* (logique QCM identique à celle que je t’ai envoyée juste avant) */

/* ============================
   🏆 RÉCOMPENSE → BOOK → CONTINUER
============================ */
const rewardScreen=document.getElementById("rewardScreen");
const bookContainer=document.getElementById("bookContainer");
const continueBtn=document.getElementById("continueQuestBtn");

function showReward(){
  rewardScreen.style.display="flex";
  setTimeout(()=>{
    rewardScreen.style.display="none";
    bookContainer.style.display="flex";
  },2500);
}

/* BOOK */
const pages=document.querySelectorAll(".page");
let currentPage=0;
pages.forEach((p,i)=>p.style.zIndex=pages.length-i);

document.querySelector(".book").addEventListener("click",(e)=>{
  const r=e.currentTarget.getBoundingClientRect();
  if(e.clientX-r.left > r.width/2 && currentPage<pages.length){
    pages[currentPage++].classList.add("flipped");
  }
  if(currentPage===pages.length){
    continueBtn.style.display="block";
  }
});

continueBtn.addEventListener("click",()=>{
  bookContainer.style.display="none";
  continueBtn.style.display="none";
});

});
