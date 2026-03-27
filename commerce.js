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
   🔒 BLOQUE RETOUR EN ARRIÈRE DANS LA QUÊTE
===================================================== */
const minStepRequired = sessionStorage.getItem("quest_progress");

if(minStepRequired){

  // exemple : empêche retour à la vidéo si déjà passée
  if(parseInt(minStepRequired) >= 1 && videoContainer){
    videoContainer.classList.add("hidden");
    showScene();
  }
}
   
/* =====================================================
   PROGRESSION (ROBUSTE)
===================================================== */
const stepsUI = document.querySelectorAll(".progress-step");

function setProgress(stepName){

  const progress = getProgress();
  progress[stepName] = true;

  saveProgress(progress);
  updateProgressBar();

  // 🔒 garde ton système anti-retour (numérique)
  const index = stepsOrder.indexOf(stepName);
  if(index !== -1){
    sessionStorage.setItem("quest_progress", index + 1);
  }
}
   
/* =====================================================
   🚫 ANTI RETOUR COMPLET
===================================================== */

// bloque bouton retour navigateur
history.pushState(null, null, location.href);

window.addEventListener("popstate", () => {
  history.pushState(null, null, location.href);
});

// bloque swipe retour iOS / gestures
document.addEventListener("touchstart", (e) => {
  if(e.touches.length > 1){
    e.preventDefault();
  }
}, { passive:false });

// bloque refresh (F5 / reload)
window.addEventListener("beforeunload", function (e) {
  e.preventDefault();
  e.returnValue = "";
});

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

   setProgress("dialogue1");
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

/* =====================================================
   DIALOGUES 2
===================================================== */
function startDialogues2(){
  playDialogues([
    {text:"Parfait. Passons au business plan.",anchor:pirate5}
  ], startMiniGame2);

   setProgress("dialogue2");
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

/* =====================================================
   LIVRE → PUIS MG3
===================================================== */
function showBusinessPlanLoader(){

   setProgress("book");

  const overlay = document.createElement("div");
  overlay.id = "identity-loader";

  overlay.innerHTML = `
    <div class="identity-center">
      <div class="book-wrapper">

        <h2 class="bp-title hidden" id="bpTitle">
          Bravo 🎉 Tu as créé ton business plan
        </h2>

        <div class="book-container">

          <div class="book-loading" id="bookLoading">⏳</div>

          <div class="book-pages hidden" id="bookPages">

            <div class="left-wrapper">
              <img id="leftPage" class="hidden">
            </div>

            <div class="right-wrapper">
              <img id="rightPage">
              <button id="zoomPageBtn" class="zoom-btn hidden">🔎</button>
            </div>

          </div>
        </div>

      </div>

      <button id="continueQuestBtn" class="hidden">
        Continuer la quête
      </button>

    </div>
  `;

  document.body.appendChild(overlay);

  const left = overlay.querySelector("#leftPage");
  const right = overlay.querySelector("#rightPage");
  const cont = overlay.querySelector("#continueQuestBtn");
  const loader = overlay.querySelector("#bookLoading");
  const pagesWrap = overlay.querySelector("#bookPages");
  const title = overlay.querySelector("#bpTitle");
  const zoomBtn = overlay.querySelector("#zoomPageBtn");

  const pages = [
    ["","images/Businessplancov.png"],
    ["images/Businessplan4.jpg","images/Businessplan1.jpg"],
    ["images/Businessplan4.jpg","images/Businessplan2.jpg"],
    ["images/Businessplan4.jpg","images/Businessplan3.jpg"]
  ];

  let step = 0;

  /* ===============================
     PRELOAD
  =============================== */
  let loaded = 0;
  const allImages = pages.flat().filter(Boolean);

  if(allImages.length === 0){
    finishLoading();
  }else{
    allImages.forEach(src=>{
      const img = new Image();
      img.onload = img.onerror = ()=>{
        loaded++;
        if(loaded >= allImages.length){
          finishLoading();
        }
      };
      img.src = src;
    });
  }

  function finishLoading(){
    loader.classList.add("hidden");
    pagesWrap.classList.remove("hidden");
    zoomBtn.classList.remove("hidden");
    title.classList.remove("hidden");
    title.classList.add("title-appear");
    update();
  }

  function update(){
    const [l, r] = pages[step];

    if(l){
      left.src = l;
      left.classList.remove("hidden");
    }else{
      left.classList.add("hidden");
    }

    right.src = r;

    cont.classList.toggle("hidden", step !== pages.length - 1);
  }

  function turnPage(direction){

    if(direction === "right" && step >= pages.length - 1) return;
    if(direction === "left" && step <= 0) return;

    const page = direction === "right" ? right : left;
    const anim = direction === "right" ? "turn-right" : "turn-left";

    page.classList.remove("turn-right","turn-left");
    void page.offsetWidth;
    page.classList.add(anim);

    page.addEventListener("animationend", () => {
      step += direction === "right" ? 1 : -1;
      update();
      page.classList.remove(anim);
    }, { once:true });
  }

  right.onclick = ()=> turnPage("right");
  left.onclick = ()=> turnPage("left");

  /* ===============================
     ZOOM
  =============================== */
  zoomBtn.onclick = ()=>{

    const src = pages[step][1];
    if(!src) return;

    const zoom = document.createElement("div");
    zoom.className = "page-zoom";

    const loaderZoom = document.createElement("div");
    loaderZoom.className = "book-loading";
    loaderZoom.textContent = "⏳";

    const img = document.createElement("img");
    img.style.display = "none";

    zoom.append(loaderZoom, img);
    document.body.appendChild(zoom);

    img.onload = ()=>{
      loaderZoom.remove();
      img.style.display = "block";
    };

    img.onerror = ()=>{
      loaderZoom.textContent = "Erreur";
    };

    img.src = src;

    zoom.onclick = (e)=>{
      if(e.target === zoom) zoom.remove();
    };
  };

  /* ===============================
     CONTINUER → DIALOGUE 3 + MG3
  =============================== */
  cont.onclick = () => {

    overlay.remove();

    playDialogues([
      { text:"Ton Business plan est solide, maintenant passons à la réalité du terrain.", anchor:pirate5 },
      { text:"La prospection consiste à chercher de nouveaux clients.", anchor:pirate5 },

      {
        text:"Il est temps d'affronter le marché.",
        anchor:pirate5,
        onShow: ()=>{
          if(pirate3){
            pirate3.classList.remove("hidden");
            pirate3.classList.add("glowStart");
          }
        }
      }

    ], ()=>{

      showLoader(600, ()=>{
        startMiniGame3();
      });

    });

  };
}

/* =====================================================
   MINI JEU 3
===================================================== */
function startMiniGame3(){

   setProgress("game3");

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
   🏆 VICTOIRE COMMUNICATION
===================================================== */
function showCommerceWin(){

   setProgress("win");

  // 🔥 Supprime loader pirate s'il est visible
  if(fadeScreen){
    fadeScreen.classList.add("hidden");
  }

  const overlay = document.createElement("div");
  overlay.id="communication-win";
  overlay.innerHTML=`
    <div class="win-box">
      <h2>🏴‍☠️ Bravo !</h2>
      <p>Tu as gagné la quête Commerce !</p>
      <div class="gems-container"></div>
    </div>`;

  document.body.appendChild(overlay);

  const gemsContainer = overlay.querySelector(".gems-container");

  requestAnimationFrame(()=>{
    launchGemsExplosion(gemsContainer);
  });

  /* 🔓 DÉBLOCAGES */
  sessionStorage.setItem("unlock_pirate3","true");
  sessionStorage.setItem("unlock_password_page","true");
  sessionStorage.setItem("fromCommerce","true");

  /* ⏳ Redirection après explosion */
  setTimeout(()=>{
    window.location.href="menu.html";
  },2500);
}

/* =====================================================
   💎 GEMS
===================================================== */
function launchGemsExplosion(container){
  const colors=["#ffd700","#00f2ff","#ff4fd8","#7cff00","#ff8c00"];
  for(let i=0;i<50;i++){
    const g=document.createElement("div");
    g.className="gem";
    const size=Math.random()*10+8;
    g.style.width=size+"px";
    g.style.height=size+"px";
    g.style.background=colors[Math.floor(Math.random()*colors.length)];
    g.style.left="50%";
    g.style.top="50%";

    const angle=Math.random()*Math.PI*2;
    const dist=Math.random()*260+80;
    g.style.setProperty("--x",Math.cos(angle)*dist+"px");
    g.style.setProperty("--y",Math.sin(angle)*dist+"px");

    container.appendChild(g);
  }
}

   function createProgressBar(){

  const bar = document.createElement("div");
  bar.id = "progressBar";

  stepsOrder.forEach(step=>{
    const item = document.createElement("div");
    item.className = "progress-step";
    item.dataset.step = step;
    item.textContent = step.includes("dialogue") ? "💬" : "🎮";
    bar.appendChild(item);
  });

  document.body.appendChild(bar);

  updateProgressBar();
}

function updateProgressBar(){

  const progress = getProgress();

  const steps = document.querySelectorAll(".progress-step");
  if(!steps.length) return; // ✅ sécurité

  steps.forEach(el=>{
    const step = el.dataset.step;

    progress[step]
      ? el.classList.add("done")
      : el.classList.remove("done");
  });
}

   createProgressBar();
   

});
