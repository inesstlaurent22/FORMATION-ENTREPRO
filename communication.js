document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   DOM
===================================================== */
const videoIntro  = document.getElementById("videoIntro");
const introVideo  = document.getElementById("introVideo");
const toggleSound = document.getElementById("toggleSound");
const closeVideo  = document.getElementById("closeVideo");

const scene   = document.getElementById("scene");
const pirate2 = document.getElementById("pirate2");
const pirate3 = document.getElementById("pirate3");

const dialogBox  = document.getElementById("dialogBox");
const dialogText = document.getElementById("dialogText");
const skipDialog = document.getElementById("skipDialog");

const miniGame = document.getElementById("miniGameContainer");

/* =====================================================
   VIDÉO
===================================================== */
introVideo.muted = true;
introVideo.play().catch(()=>{});

toggleSound.onclick = e => {
  e.stopPropagation();
  introVideo.muted = !introVideo.muted;
  toggleSound.textContent = introVideo.muted ? "🔇" : "🔊";
};

closeVideo.onclick = e => {
  e.stopPropagation();
  endVideo();
};

introVideo.onended = endVideo;

function endVideo(){
  introVideo.pause();
  videoIntro.classList.add("hidden");
  scene.classList.remove("hidden");
  showLoader();
}

/* =====================================================
   LOADER
===================================================== */
function showLoader(cb){
  const f = document.createElement("div");
  f.id = "fadeScreen";
  f.innerHTML = `<div class="loaderBox"></div>`;
  document.body.appendChild(f);
  setTimeout(()=>{
    f.remove();
    cb && cb();
  },1300);
}

/* =====================================================
   DIALOGUES
===================================================== */
let dialogs=[], index=0, callback=null;

function playDialog(list, cb){
  dialogs=list;
  index=0;
  callback=cb;
  dialogBox.classList.remove("hidden");
  skipDialog.classList.remove("hidden");
  showDialog();
}

function showDialog(){
  const d = dialogs[index];
  dialogText.textContent = d.text;
  const p = d.speaker==="pirate2"?pirate2:pirate3;
  const r = p.getBoundingClientRect();
  dialogBox.style.left = `${r.left+r.width/2-dialogBox.offsetWidth/2}px`;
  dialogBox.style.top  = `${r.top-dialogBox.offsetHeight-20}px`;
}

dialogBox.onclick = () => {
  index++;
  index < dialogs.length ? showDialog() : endDialogs();
};

skipDialog.onclick = e => {
  e.stopPropagation();
  endDialogs();
};

function endDialogs(){
  dialogBox.classList.add("hidden");
  skipDialog.classList.add("hidden");
  callback && callback();
}

/* =====================================================
   HELPERS
===================================================== */
function clearMiniGame(){
  miniGame.innerHTML="";
  miniGame.classList.remove("hidden");
}

function hideMiniGame(){
  miniGame.classList.add("hidden");
}

function title(t){
  const h=document.createElement("h3");
  h.textContent=t;
  miniGame.appendChild(h);
}

function pirateQuestion(txt){
  const p=document.createElement("div");
  p.className="pirate-question";
  p.innerHTML=txt;
  miniGame.appendChild(p);
}

/* =====================================================
   SHAKE
===================================================== */
function shake(){
  document.body.classList.add("screen-shake");
  setTimeout(()=>document.body.classList.remove("screen-shake"),350);
}

/* =====================================================
   START — PIRATE 3 GLOW
===================================================== */
pirate3.classList.add("glow");

pirate3.onclick = () => {
  pirate3.classList.remove("glow");
  playDialog([
    {speaker:"pirate3",text:"Capitaine, ton trésor est prêt."},
    {speaker:"pirate2",text:"Mais sans communication, personne ne viendra."},
    {speaker:"pirate3",text:"Voyons comment attirer le marché."}
  ], startMG1);
};

/* =====================================================
   MINI-JEU 1
===================================================== */
const quiz = [
  {
    t: "📣 Communication",
    q: "À quoi sert principalement la communication pour une marque ?",
    o: [
      "Être comprise par son public",
      "Créer une relation de confiance",
      "Parler uniquement de ses produits"
    ],
    g: [0, 1] // 2 bonnes réponses
  },
  {
    t: "🤝 Communication",
    q: "La communication permet de :",
    o: [
      "Attirer l’attention",
      "Créer de l’émotion",
      "Garantir des ventes immédiates"
    ],
    g: [0, 1] // 2 bonnes réponses
  },
  {
    t: "🎯 Communication",
    q: "Une bonne communication sert à :",
    o: [
      "Transmettre un message clair",
      "Se différencier des concurrents",
      "Construire une image de marque"
    ],
    g: [0, 1, 2] // 3 bonnes réponses
  },
  {
    t: "🧭 Communication",
    q: "La communication est essentielle pour :",
    o: [
      "Guider le public",
      "Créer du lien sur le long terme",
      "Remplacer la qualité d’un produit"
    ],
    g: [0, 1] // 2 bonnes réponses
  }
];

let qi=0;
let selected=[];
let locked=false;

function startMG1(){
  qi=0;
  showQ();
}

function showQ(){
  clearMiniGame();
  selected=[];
  locked=false;

  const s=quiz[qi];
  title(s.t);
  pirateQuestion(s.q);

  const wrap=document.createElement("div");
  wrap.className="mg1-answers";

  s.o.forEach((txt,i)=>{
    const b=document.createElement("button");
    b.textContent=txt;

    b.onclick=()=>{
      if(locked) return;
      if(selected.includes(i)) return;

      selected.push(i);

      if(check(s)){
        locked=true;
        b.classList.add("pressed");

        setTimeout(()=>{
          qi++;
          qi < quiz.length
            ? showQ()
            : showLoader(afterMG1);
        },900); // laisse voir le bouton enfoncé
      } else {
        shake();
      }
    };

    wrap.appendChild(b);
  });

  miniGame.appendChild(wrap);
}

function check(s){
  return s.g.every(i=>selected.includes(i)) &&
         selected.every(i=>s.g.includes(i));
}

function afterMG1(){
  hideMiniGame();
  playDialog([
    {speaker:"pirate2",text:"Parfait."},
    {speaker:"pirate3",text:"Passons à ton identité visuelle."}
  ], startMG2Intro);
}

/* =====================================================
   MINI-JEU 2
===================================================== */
function startMG2Intro(){
  clearMiniGame();
  title("L’identité visuelle");

  const info=document.createElement("button");
  info.textContent="En savoir plus";
  info.className="primary";

  const box=document.createElement("div");
  box.className="info-box hidden";
  box.innerHTML="• À qui tu parles<br>• Ton message<br>• Ton style";

  info.onclick=()=>box.classList.toggle("hidden");

  const next=document.createElement("button");
  next.textContent="Continuer";
  next.className="secondary";
  next.onclick=startLogo;

  miniGame.append(info,box,next);
}

function imageGroup(list,cb){
  const w=document.createElement("div");
  w.className="visualChoices small horizontal";

  list.forEach(src=>{
    const img=new Image();
    img.src=src;
    img.onclick=cb;
    w.appendChild(img);
  });

  miniGame.appendChild(w);
}

function startLogo(){
  clearMiniGame();
  title("Choisis ton logo");
  imageGroup(
    ["images/Logo1.PNG","images/Logo2.PNG","images/Logo3.PNG"],
    startColors
  );
}

function startColors(){
  clearMiniGame();
  title("Choisis ta palette");
  imageGroup(
    ["images/Couleur1.PNG","images/Couleur2.PNG","images/Couleur3.PNG"],
    startTypo
  );
}

function startTypo(){
  clearMiniGame();
  title("Choisis ta typographie");
  imageGroup(
    ["images/Typo1.PNG","images/Typo2.PNG","images/Typo3.PNG"],
    ()=>showLoader(afterMG2)
  );
}

/* =====================================================
   MINI-JEU 3
===================================================== */
function afterMG2(){
  playDialog([
    {speaker:"pirate2",text:"Ton identité est prête."},
    {speaker:"pirate3",text:"Voyons comment la diffuser."}
  ], startMG3);
}

function startMG3(){
  clearMiniGame();
  title("Les réseaux sociaux");

  const left=document.createElement("div");
  left.className="mg3-column";

  const right=document.createElement("div");
  right.className="mg3-column";

  let sel=null;
  let ok=0;

  [
    ["Instagram & TikTok","know"],
    ["Facebook & LinkedIn","btob"],
    ["Sites e-commerce","btoc"]
  ].forEach(p=>{
    const b=document.createElement("button");
    b.textContent=p[0];
    b.classList.add("mg3-left-btn");
    b.onclick=()=>sel={btn:b,key:p[1]};
    left.appendChild(b);
  });

  [
    ["Se faire connaître","know"],
    ["Vendre en BtoB","btob"],
    ["Vendre en BtoC","btoc"]
  ].forEach(t=>{
    const b=document.createElement("button");
    b.textContent=t[0];
    b.onclick=()=>{
      if(sel && sel.key===t[1]){
        sel.btn.remove();
        b.remove();
        sel=null;
        ok++;
        if(ok===3) showLoader(finish);
      } else {
        shake();
      }
    };
    right.appendChild(b);
  });

  const c=document.createElement("div");
  c.className="mg3-container";
  c.append(left,right);
  miniGame.appendChild(c);
}

/* =====================================================
   FIN
===================================================== */
function finish(){
  hideMiniGame();
  sessionStorage.setItem("unlock_pirate5","true");
  location.href="menu.html";
}

});
