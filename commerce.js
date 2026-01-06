document.addEventListener("DOMContentLoaded",()=>{

/* ================= UTIL ================= */
function fade(text, cb){
  fadeScreen.querySelector(".loaderBox").textContent = text;
  fadeScreen.style.display="flex";
  setTimeout(()=>{
    fadeScreen.style.display="none";
    cb && cb();
  },1800);
}

/* ================= VIDÉO ================= */
const video=document.getElementById("questVideo");
const videoContainer=document.getElementById("videoContainer");
toggleSound.onclick=()=>{
  video.muted=!video.muted;
  toggleSound.textContent=video.muted?"🔇":"🔊";
};
closeVideo.onclick=endVideo;
video.onended=endVideo;

function endVideo(){
  videoContainer.style.display="none";
  fade("Chargement...",showBackground);
}

/* ================= BACKGROUND ================= */
const background=document.getElementById("background");
function showBackground(){
  background.classList.remove("hidden");
}

/* ================= DIALOGUES 1 ================= */
const dialogues1=[
 {p:pirate5bis,t:"Bienvenue sur le marché des trésors !"},
 {p:pirate2bis,t:"Je suis prêt capitaine !"},
 {p:pirate5bis,t:"Observe le marché avant de vendre."}
];

let d1=0;
pirate5bis.onclick=()=>showDialogue(dialogues1,()=>fade("Termines ce mini jeu",startQuiz));

/* ================= BUBBLES ================= */
function showDialogue(list, endCb){
  bubbleContainer.innerHTML="";
  const d=list[d1];
  const b=document.createElement("div");
  b.className="dialogue-bubble";
  b.textContent=d.t;
  const r=d.p.getBoundingClientRect();
  b.style.left=r.left+"px";
  b.style.top=(r.top-140)+"px";
  b.onclick=()=>{
    d1++;
    d1<list.length?showDialogue(list,endCb):(bubbleContainer.innerHTML="",endCb());
  };
  bubbleContainer.appendChild(b);
}

/* ================= QUIZ ================= */
const steps=[ /* TES 9 QUESTIONS */ ];
let step=0;

function startQuiz(){
  miniGameContainer.classList.remove("hidden");
  showQuestion();
}

function showQuestion(){
  const s=steps[step];
  question.textContent=s.question;
  answers.innerHTML="";
  progress.textContent=`${step+1}/${steps.length}`;
  s.answers.forEach((a,i)=>{
    const b=document.createElement("button");
    b.textContent=a;
    b.onclick=()=>{
      i===s.correct?(step++,step<steps.length?showQuestion():endQuiz()):showQuestion();
    };
    answers.appendChild(b);
  });
}

function endQuiz(){
  miniGameContainer.classList.add("hidden");
  fade("Bravo ! Ton business plan est prêt",showBook);
}

/* ================= LIVRE ================= */
const pages=["images/Businessplancov.png","images/Businessplan1.png","images/Businessplan2.png","images/Businessplan3.png"];
let pageIndex=+localStorage.getItem("bookIndex")||0;

function showBook(){
  bookContainer.classList.remove("hidden");
  updateBook();
}

function updateBook(){
  rightPage.src=pages[pageIndex];
  leftPage.src=pageIndex>0?"images/Businessplan4.jpg":"";
  continueQuestBtn.style.display=pageIndex===pages.length-1?"block":"none";
  localStorage.setItem("bookIndex",pageIndex);
}

document.querySelector(".book").onclick=e=>{
  const rect=e.currentTarget.getBoundingClientRect();
  if(e.clientX>rect.left+rect.width/2 && pageIndex<pages.length-1)pageIndex++;
  else if(pageIndex>0)pageIndex--;
  updateBook();
};

/* ================= RETOUR QUÊTE ================= */
continueQuestBtn.onclick=()=>{
  bookContainer.classList.add("hidden");
  spawnPirate3();
};

/* ================= PIRATE 3 ================= */
function spawnPirate3(){
  pirate3bis.classList.remove("hidden");
  setTimeout(()=>pirate3bis.classList.add("show"),50);
}

/* ================= DIALOGUES 2 ================= */
const dialogues2=[ /* TES DIALOGUES FOURNIS */ ];
let d2=0;

pirate3bis.onclick=()=>{
  d2=0;
  showDialogue(dialogues2,()=>fade("Dernier mini jeux",endMiniGame2));
};

/* ================= MINI JEU 2 ================= */
function endMiniGame2(){
  fade("Mini jeu réussi !",showEndScreen);
}

/* ================= FIN ================= */
function showEndScreen(){
  localStorage.setItem("quest_commerce_completed","true");
  endScreen.classList.remove("hidden");
  typeWriter(endSubtitle,"tu as gagné ...",()=>{
    document.querySelectorAll(".rewardBubble").forEach((b,i)=>{
      setTimeout(()=>b.style.opacity=1,i*700);
    });
    setTimeout(()=>location.href="menu.html",6000);
  });
}

function typeWriter(el,text,cb){
  let i=0;el.textContent="";
  const t=setInterval(()=>{
    el.textContent+=text[i++];
    if(i>=text.length){clearInterval(t);cb&&cb();}
  },80);
}

});
