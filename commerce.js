document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   DOM
===================================================== */
const background = document.getElementById("background");
const pirate2 = document.getElementById("pirate2bis");
const pirate5 = document.getElementById("pirate5bis");
const pirate3 = document.getElementById("pirate3bis");

const bubbleContainer = document.getElementById("bubbleContainer");
const skipBtn = document.getElementById("skipDialoguesBtn");
const fadeScreen = document.getElementById("fadeScreen");

const game1 = document.getElementById("communicationGame");
const q1 = document.getElementById("commQuestion");
const a1 = document.getElementById("commAnswers");

const game2 = document.getElementById("visualIdentityGame");
const visualChoices = document.getElementById("visualChoices");

const game3 = document.getElementById("merchantGame");

const videoContainer = document.getElementById("videoContainer");
const questVideo = document.getElementById("questVideo");
const closeVideo = document.getElementById("closeVideo");

/* =====================================================
   UTILS
===================================================== */
function showLoader(duration = 1200, cb){
  if(!fadeScreen){ cb && cb(); return; }
  fadeScreen.classList.remove("hidden");
  setTimeout(()=>{
    fadeScreen.classList.add("hidden");
    cb && cb();
  }, duration);
}

function shake(el){
  if(!el) return;
  el.classList.remove("screen-shake");
  void el.offsetWidth;
  el.classList.add("screen-shake");
  setTimeout(()=>el.classList.remove("screen-shake"),400);
}

/* =====================================================
   PROGRESSION
===================================================== */
const stepsUI = document.querySelectorAll(".progress-step");

function setProgress(step){
  stepsUI.forEach((el,i)=>{
    el.classList.toggle("done", i < step);
  });
}

/* =====================================================
   ANTI RETOUR
===================================================== */
history.pushState(null,null,location.href);
window.onpopstate = ()=> history.go(1);

/* =====================================================
   VIDEO
===================================================== */
let videoEnded = false;

function startVideo(){
  if(!questVideo) return;

  questVideo.muted = true;
  questVideo.setAttribute("playsinline","");
  questVideo.setAttribute("webkit-playsinline","");

  questVideo.play().catch(()=>{
    document.addEventListener("click", ()=> questVideo.play(), {once:true});
    setTimeout(endVideo,4000);
  });

  setTimeout(()=>{
    if(!videoEnded) endVideo();
  },8000);
}

startVideo();

if(questVideo) questVideo.addEventListener("ended", endVideo);
if(closeVideo) closeVideo.onclick = endVideo;

function endVideo(){
  if(videoEnded) return;
  videoEnded = true;

  if(questVideo){
    questVideo.pause();
    questVideo.src="";
  }

  if(videoContainer){
    videoContainer.classList.add("hidden");
  }

  showLoader(1200, ()=>{
    setProgress(1);
    showScene();
  });
}

/* =====================================================
   SCENE
===================================================== */
function showScene(){
  background?.classList.remove("hidden");
  pirate2?.classList.remove("hidden");
  pirate5?.classList.remove("hidden");

  if(pirate5){
    pirate5.classList.add("glowStart");
    pirate5.onclick = ()=>{
      pirate5.classList.remove("glowStart");
      pirate5.style.pointerEvents="none";
      startDialogues1();
    };
  }
}

/* =====================================================
   DIALOGUES
===================================================== */
let dialogues=[], index=0, callback=null, locked=false;

function playDialogues(list, cb){
  if(!bubbleContainer) return;

  dialogues = list;
  index = 0;
  callback = cb;

  skipBtn?.classList.remove("hidden");
  renderDialogue();
}

function renderDialogue(){
  bubbleContainer.innerHTML="";

  if(index >= dialogues.length){
    endDialogues();
    return;
  }

  const d = dialogues[index];

  if(d.onShow) d.onShow();

  const bubble = document.createElement("div");
  bubble.className="dialogue-bubble";
  bubble.innerHTML=d.text;

  const anchor = d.anchor;
  if(anchor){
    const r = anchor.getBoundingClientRect();
    bubble.style.left = r.left + r.width/2 + "px";
    bubble.style.top = r.top - 120 + "px";
    bubble.style.transform="translateX(-50%)";
  }else{
    bubble.style.left="50%";
    bubble.style.top="30%";
    bubble.style.transform="translate(-50%,-50%)";
  }

  bubble.onclick = ()=>{
    if(locked) return;
    locked=true;
    index++;
    requestAnimationFrame(()=>{
      locked=false;
      renderDialogue();
    });
  };

  bubbleContainer.appendChild(bubble);
}

function endDialogues(){
  bubbleContainer.innerHTML="";
  skipBtn?.classList.add("hidden");

  const cb = callback;
  callback=null;

  cb && showLoader(800, cb);
}

skipBtn?.addEventListener("click", endDialogues);

/* =====================================================
   DIALOGUES 1
===================================================== */
function startDialogues1(){
  playDialogues([
    {text:"Avant de vendre quoi que ce soit, il faut comprendre ton marché.",anchor:pirate5},
    {text:"Clients, concurrence, besoins...",anchor:pirate5},
    {text:"On ne connaît rien.",anchor:pirate2},
    {text:"Je vais t'expliquer.",anchor:pirate5}
  ], startMiniGame1);
}

/* =====================================================
   MINI JEU 1
===================================================== */
function startMiniGame1(){

  showLoader(800, ()=>{

    game1.classList.remove("hidden");

    const questions = [
      {
        question:"Pourquoi faire une étude de marché ?",
        answers:[
          {t:"Comprendre les clients",ok:true},
          {t:"Décorer",ok:false}
        ]
      }
    ];

    let current=0;

    function render(){
      q1.textContent=questions[current].question;
      a1.innerHTML="";

      questions[current].answers.forEach(q=>{
        const b=document.createElement("button");
        b.textContent=q.t;

        b.onclick=()=>{
          if(!q.ok){ shake(game1); return; }

          current++;

          if(current<questions.length){
            render();
          }else{
            game1.classList.add("hidden");
            setProgress(2);
            startDialogues2();
          }
        };

        a1.appendChild(b);
      });
    }

    render();
  });
}

/* =====================================================
   DIALOGUES 2
===================================================== */
function startDialogues2(){
  playDialogues([
    {text:"Parfait. Passons au business plan.",anchor:pirate5}
  ], startMiniGame2);
}

/* =====================================================
   MINI JEU 2
===================================================== */
function startMiniGame2(){

  showLoader(800, ()=>{

    game2.classList.remove("hidden");

    const questions=[
      {
        question:"À quoi sert un business plan ?",
        answers:[
          {t:"Convaincre",ok:true},
          {t:"Décorer",ok:false}
        ]
      }
    ];

    let current=0;

    function render(){
      visualChoices.innerHTML="";
      const q=document.createElement("div");
      q.textContent=questions[current].question;
      visualChoices.appendChild(q);

      questions[current].answers.forEach(a=>{
        const b=document.createElement("button");
        b.textContent=a.t;

        b.onclick=()=>{
          if(!a.ok){ shake(game2); return; }

          current++;

          if(current<questions.length){
            render();
          }else{
            game2.classList.add("hidden");
            setProgress(3);
            showBusinessPlanLoader();
          }
        };

        visualChoices.appendChild(b);
      });
    }

    render();
  });
}

/* =====================================================
   LIVRE → PUIS MG3
===================================================== */
function showBusinessPlanLoader(){
  const cont = document.createElement("button");
  cont.textContent="Continuer";
  document.body.appendChild(cont);

  cont.onclick=()=>{
    cont.remove();

    playDialogues([
      {text:"Passons à la prospection.",anchor:pirate5},
      {
        text:"Il est temps d'agir.",
        anchor:pirate5,
        onShow:()=>{
          pirate3?.classList.remove("hidden");
        }
      }
    ], ()=> startMiniGame3());
  };
}

/* =====================================================
   MINI JEU 3
===================================================== */
function startMiniGame3(){

  game3.classList.remove("hidden");

  const text = document.getElementById("strategyText");
  const choices = document.getElementById("strategyChoices");

  const steps=[
    {
      text:"Première étape ?",
      answers:[
        {label:"Base de données",correct:true},
        {label:"Appeler direct",correct:false}
      ]
    }
  ];

  let step=0;

  function render(){
    text.innerHTML=steps[step].text;
    choices.innerHTML="";

    steps[step].answers.forEach(a=>{
      const b=document.createElement("button");
      b.textContent=a.label;

      b.onclick=()=>{
        if(!a.correct){ shake(game3); return; }

        step++;

        if(step<steps.length){
          render();
        }else{
          game3.classList.add("hidden");
          showCommerceWin();
        }
      };

      choices.appendChild(b);
    });
  }

  render();
}

/* =====================================================
   VICTOIRE
===================================================== */
function showCommerceWin(){

  setProgress(4);

  const overlay=document.createElement("div");
  overlay.innerHTML="<h2>Bravo</h2>";
  document.body.appendChild(overlay);

  setTimeout(()=>{
    window.location.href="menu.html";
  },2000);
}

});
