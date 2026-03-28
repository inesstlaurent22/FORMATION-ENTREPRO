document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   📊 CONFIG PROGRESS BAR
===================================================== */

const stepsOrder = [
  "video",
  "dialogue1",
  "game1",
  "dialogue2",
  "game2",
  "book",
  "game3",
  "win"
];

function getProgress(){
  const saved = sessionStorage.getItem("quest_progress_map");
  return saved ? JSON.parse(saved) : {};
}

function saveProgress(map){
  sessionStorage.setItem("quest_progress_map", JSON.stringify(map));
}

function getStepIcon(step){
  const s = step.toLowerCase();
  if(s.includes("dialogue")) return "💬";
  if(s.includes("game")) return "🎮";
  if(s.includes("video")) return "🎬";
  if(s.includes("book")) return "📘";
  if(s.includes("win")) return "🏆";
  return "•";
}

/* =====================================================
   📊 BAR
===================================================== */

function createProgressBar(){

  if(document.getElementById("progressBar")) return;

  const bar = document.createElement("div");
  bar.id = "progressBar";

  stepsOrder.forEach(step=>{
    const item = document.createElement("div");
    item.className = "progress-step";
    item.dataset.step = step;
    item.textContent = getStepIcon(step);
    bar.appendChild(item);
  });

  document.body.appendChild(bar);
  updateProgressBar();
}

function updateProgressBar(){
  const progress = getProgress();
  document.querySelectorAll(".progress-step").forEach(el=>{
    const step = el.dataset.step;
    el.textContent = getStepIcon(step);

    if(progress[step]) el.classList.add("done");
    else el.classList.remove("done");
  });
}

function setProgress(stepName){
  const progress = getProgress();
  progress[stepName] = true;
  saveProgress(progress);
  updateProgressBar();

  const index = stepsOrder.indexOf(stepName);
  if(index !== -1){
    sessionStorage.setItem("quest_progress", index + 1);
  }
}

createProgressBar();

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

function showLoader(duration = 800, cb){
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
   VIDEO
===================================================== */

let videoEnded = false;

function startVideo(){
  if(!questVideo){
    endVideo();
    return;
  }

  questVideo.muted = true;
  questVideo.setAttribute("playsinline","");
  questVideo.play().catch(()=>{
    document.addEventListener("click", ()=> questVideo.play(), {once:true});
    setTimeout(endVideo,4000);
  });

  setTimeout(()=>{
    if(!videoEnded) endVideo();
  },8000);
}

startVideo();

questVideo?.addEventListener("ended", endVideo);
closeVideo?.addEventListener("click", endVideo);

function endVideo(){
  if(videoEnded) return;
  videoEnded = true;

  questVideo?.pause();
  videoContainer?.classList.add("hidden");

  showLoader(800, ()=>{
    setProgress("video");
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

  pirate5?.classList.add("glowStart");
  pirate5.onclick = ()=>{
    pirate5.classList.remove("glowStart");
    pirate5.style.pointerEvents="none";
    startDialogues1();
  };
}

/* =====================================================
   DIALOGUES
===================================================== */

let dialogues=[], index=0, callback=null, locked=false;

function playDialogues(list, cb){
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

  const bubble = document.createElement("div");
  bubble.className="dialogue-bubble";
  bubble.innerHTML=dialogues[index].text;

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
  cb && showLoader(600, cb);
}

skipBtn?.addEventListener("click", endDialogues);

/* =====================================================
   FLOW
===================================================== */

function startDialogues1(){
  setProgress("dialogue1");

  playDialogues([
    {text:"Avant de vendre, il faut comprendre ton marché."},
    {text:"Clients, concurrence, besoins…"},
    {text:"Sinon tu avances à l’aveugle."}
  ], startMiniGame1);
}

/* ================= MINI GAME 1 ================= */

function startMiniGame1(){

  showLoader(600, ()=>{

    game1.classList.remove("hidden");

    const questions = [
      {
        question:"Pourquoi faire une étude de marché ?",
        answers:[
          {t:"Comprendre les clients",ok:true},
          {t:"Décorer",ok:false}
        ]
      },
      {
        question:"Que doit-on analyser ?",
        answers:[
          {t:"La concurrence",ok:true},
          {t:"La météo",ok:false}
        ]
      }
    ];

    let current=0;

    function render(){
      q1.textContent = questions[current].question;
      a1.innerHTML="";

      questions[current].answers.forEach(q=>{
        const b=document.createElement("button");
        b.textContent=q.t;

        b.onclick=()=>{
          if(!q.ok){ shake(game1); return; }

          current++;

          if(current < questions.length){
            render();
          }else{
            game1.classList.add("hidden");
            setProgress("game1");
            startDialogues2();
          }
        };

        a1.appendChild(b);
      });
    }

    render();
  });
}

/* ================= DIALOGUE 2 ================= */

function startDialogues2(){
  setProgress("dialogue2");

  playDialogues([
    {text:"Parfait. Passons au business plan."},
    {text:"C’est lui qui structure toute ta stratégie."}
  ], startMiniGame2);
}

/* ================= MINI GAME 2 ================= */

function startMiniGame2(){

  showLoader(600, ()=>{

    game2.classList.remove("hidden");

    const questions = [
      {
        question:"À quoi sert un business plan ?",
        answers:[
          {t:"Convaincre",ok:true},
          {t:"Décorer",ok:false}
        ]
      },
      {
        question:"Qui utilise le business plan ?",
        answers:[
          {t:"Les investisseurs",ok:true},
          {t:"Personne",ok:false}
        ]
      }
    ];

    let current=0;

    function render(){
      visualChoices.innerHTML="";

      const q=document.createElement("div");
      q.textContent = questions[current].question;
      visualChoices.appendChild(q);

      questions[current].answers.forEach(a=>{
        const b=document.createElement("button");
        b.textContent=a.t;

        b.onclick=()=>{
          if(!a.ok){ shake(game2); return; }

          current++;

          if(current < questions.length){
            render();
          }else{
            game2.classList.add("hidden");
            setProgress("game2");
            showBusinessPlanLoader();
          }
        };

        visualChoices.appendChild(b);
      });
    }

    render();
  });
}

/* ================= BOOK ================= */

function showBusinessPlanLoader(){
  setProgress("book");

  showLoader(800, ()=>{
    playDialogues([
      {text:"Ton business plan est solide."},
      {text:"Maintenant, va chercher des clients."}
    ], startMiniGame3);
  });
}

/* ================= MINI GAME 3 ================= */

function startMiniGame3(){

  setProgress("game3");

  game3.classList.remove("hidden");

  const text = document.getElementById("strategyText");
  const choices = document.getElementById("strategyChoices");

  const steps = [
    {
      text:"Première étape ?",
      answers:[
        {label:"Base de données",correct:true},
        {label:"Appeler direct",correct:false}
      ]
    },
    {
      text:"Deuxième étape ?",
      answers:[
        {label:"Qualifier les prospects",correct:true},
        {label:"Attendre",correct:false}
      ]
    }
  ];

  let step=0;

  function render(){
    text.innerHTML = steps[step].text;
    choices.innerHTML="";

    steps[step].answers.forEach(a=>{
      const b=document.createElement("button");
      b.textContent=a.label;

      b.onclick=()=>{
        if(!a.correct){ shake(game3); return; }

        step++;

        if(step < steps.length){
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

/* ================= WIN ================= */

function showCommerceWin(){

  setProgress("win");

  const overlay = document.createElement("div");
  overlay.innerHTML=`<h2>🏆 Bravo !</h2>`;
  document.body.appendChild(overlay);

  setTimeout(()=>{
    window.location.href="menu.html";
  },2000);
}

});
