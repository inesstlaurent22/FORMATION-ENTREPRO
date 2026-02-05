document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   RÉFÉRENCES DOM
===================================================== */
const videoIntro  = document.getElementById("videoIntro");
const introVideo  = document.getElementById("introVideo");
const toggleSound = document.getElementById("toggleSound");
const closeVideo  = document.getElementById("closeVideo");

const scene     = document.getElementById("scene");
const pirate2   = document.getElementById("pirate2");
const pirate3   = document.getElementById("pirate3");

const dialogBox  = document.getElementById("dialogBox");
const dialogText = document.getElementById("dialogText");
const skipDialog = document.getElementById("skipDialog");

const miniGame = document.getElementById("miniGameContainer");

/* =====================================================
   🎬 VIDÉO INTRO
===================================================== */
introVideo.muted = true;
introVideo.play().catch(()=>{});

toggleSound.onclick = e=>{
  e.stopPropagation();
  introVideo.muted = !introVideo.muted;
  toggleSound.textContent = introVideo.muted ? "🔇" : "🔊";
};

closeVideo.onclick = e=>{
  e.stopPropagation();
  endVideo();
};

introVideo.onended = endVideo;

function endVideo(){
  introVideo.pause();
  videoIntro.classList.add("hidden");
  showPirateLoader(()=>scene.classList.remove("hidden"));
}

/* =====================================================
   🏴‍☠️ LOADER
===================================================== */
function showPirateLoader(cb){
  const f=document.createElement("div");
  f.id="fadeScreen";
  f.innerHTML=`
    <div class="loaderBox">
      <div class="loaderPirate"></div>
      <div class="loaderPirateEmoji">🏴‍☠️</div>
    </div>`;
  document.body.appendChild(f);
  setTimeout(()=>{f.remove();cb&&cb();},1400);
}

/* =====================================================
   💬 DIALOGUES
===================================================== */
let dialogs=[],dialogIndex=0,dialogCallback=null;

function playDialog(list,cb){
  dialogs=list;dialogIndex=0;dialogCallback=cb;
  dialogBox.classList.remove("hidden");
  skipDialog.classList.remove("hidden");
  showDialog();
}

function showDialog(){
  const d=dialogs[dialogIndex];
  dialogText.textContent=d.text;
  const t=d.speaker==="pirate2"?pirate2:pirate3;
  const r=t.getBoundingClientRect();
  dialogBox.style.left=`${r.left+r.width/2-dialogBox.offsetWidth/2}px`;
  dialogBox.style.top=`${r.top-dialogBox.offsetHeight-20}px`;
}

function endDialogs(){
  dialogBox.classList.add("hidden");
  skipDialog.classList.add("hidden");
  dialogCallback&&dialogCallback();
}

dialogBox.onclick=()=>{++dialogIndex<dialogs.length?showDialog():endDialogs();};
skipDialog.onclick=e=>{e.stopPropagation();endDialogs();};

/* =====================================================
   🧰 HELPERS
===================================================== */
function clearMiniGame(){miniGame.innerHTML="";miniGame.classList.remove("hidden");}
function hideMiniGame(){miniGame.classList.add("hidden");}
function addTitle(t){const h=document.createElement("h3");h.textContent=t;miniGame.appendChild(h);}
function addText(t,b=false){const p=document.createElement("p");p.innerHTML=b?`<strong>${t}</strong>`:t;miniGame.appendChild(p);}

/* =====================================================
   🔔 NOTIFICATION
===================================================== */
function showNotification(txt){
  const n=document.createElement("div");
  n.className="notification success";
  n.innerHTML=`<div class="glow-text">Bonne réponse</div><div>${txt}</div>`;
  document.body.appendChild(n);
  setTimeout(()=>n.remove(),900);
}

/* =====================================================
   🚀 DÉMARRAGE
===================================================== */
pirate3.onclick=()=>playDialog([
  {speaker:"pirate3",text:"Capitaine, ton trésor est prêt."},
  {speaker:"pirate2",text:"Mais sans communication, personne ne viendra."},
  {speaker:"pirate3",text:"Voyons comment attirer le marché."}
],startMiniGame1);

/* =====================================================
   🎯 MINI-JEU 1
===================================================== */
const quiz=[
 {t:"⚓ Visite physique",q:"Rencontrer un client permet de :",o:["Rassurer","Créer une connexion","Ignorer ses attentes"],g:[0,1]},
 {t:"📞 Phoning",q:"Le contact direct sert à :",o:["Comprendre les besoins","Créer une relation","Parler uniquement de prix"],g:[0,1]},
 {t:"📣 Réseaux sociaux",q:"Ils servent surtout à :",o:["Se faire connaître","Montrer son univers","Vendre immédiatement"],g:[0,1]},
 {t:"📧 Newsletter",q:"Une newsletter permet de :",o:["Rester présent","Créer un lien","Envoyer du spam"],g:[0,1]}
];

let qi=0,selected=[];

function startMiniGame1(){qi=0;showQuestion();}

function showQuestion(){
  clearMiniGame();selected=[];
  const s=quiz[qi];
  addTitle(s.t);addText(s.q);addText("<span class='glow-red'>2 choix possibles</span>");
  s.o.forEach((txt,i)=>{
    const b=document.createElement("button");
    b.textContent=txt;
    b.onclick=()=>{
      b.classList.add("btn-pressed");
      setTimeout(()=>b.classList.remove("btn-pressed"),120);
      if(!selected.includes(i))selected.push(i);
      if(check(s)){
        showNotification("Bien joué !");
        qi++;qi<quiz.length?setTimeout(showQuestion,600):showPirateLoader(afterMiniGame1);
      }else if(selected.length>=2){
        document.body.classList.add("screen-shake");
        setTimeout(()=>document.body.classList.remove("screen-shake"),350);
        selected=[];
      }
    };
    miniGame.appendChild(b);
  });
}

function check(s){return s.g.every(i=>selected.includes(i))&&selected.every(i=>s.g.includes(i));}

function afterMiniGame1(){
  hideMiniGame();
  playDialog([
    {speaker:"pirate2",text:"Parfait."},
    {speaker:"pirate3",text:"Passons à ton identité visuelle."}
  ],startIdentityIntro);
}

/* =====================================================
   🎨 MINI-JEU 2
===================================================== */
function startIdentityIntro(){
  clearMiniGame();addTitle("L’identité visuelle");
  addText("Avant de créer ton univers :",true);
  const g=document.createElement("div");g.className="mg2-buttons";

  const info=document.createElement("button");info.textContent="En savoir plus";
  const box=document.createElement("div");box.className="info-box hidden";
  box.innerHTML="• À qui tu parles<br>• Ton message<br>• Ce que tu fais ressentir<br>• Ton style";
  info.onclick=()=>box.classList.toggle("hidden");

  const next=document.createElement("button");next.textContent="Continuer";next.onclick=logoExplanation;
  g.append(info,box,next);miniGame.appendChild(g);
}

function logoExplanation(){
  clearMiniGame();addTitle("Le logo");
  const next=document.createElement("button");next.textContent="Choisir un logo";next.onclick=startLogo;
  miniGame.appendChild(next);
}

function startLogo(){clearMiniGame();addTitle("Choisis ton logo");imageGroup(
 ["images/Logo1.PNG","images/Logo2.PNG","images/Logo3.PNG"],startColors);}

function startColors(){clearMiniGame();addTitle("Choisis ta palette");imageGroup(
 ["images/Couleur1.PNG","images/Couleur2.PNG","images/Couleur3.PNG"],startTypo);}

function startTypo(){clearMiniGame();addTitle("Choisis ta typographie");imageGroup(
 ["images/Typo1.PNG","images/Typo2.PNG","images/Typo3.PNG"],showIdentity);}

function showIdentity(){hideMiniGame();showPirateLoader(afterMiniGame2);}

function imageGroup(list,cb){
  const w=document.createElement("div");w.className="visualChoices";
  list.forEach(src=>{
    const c=document.createElement("div");
    const img=new Image();img.src=src;img.onclick=cb;
    const z=document.createElement("button");z.textContent="🔎";
    z.onclick=e=>{e.stopPropagation();showZoom(src);};
    c.append(img,z);w.appendChild(c);
  });
  miniGame.appendChild(w);
}

function showZoom(src){
  const f=document.createElement("div");
  f.id="fadeScreen";
  f.innerHTML=`<img src="${src}" style="max-width:90%;max-height:90%">`;
  document.body.appendChild(f);f.onclick=()=>f.remove();
}

/* =====================================================
   🔗 MINI-JEU 3
===================================================== */
function afterMiniGame2(){
  playDialog([
    {speaker:"pirate2",text:"Ton identité est prête."},
    {speaker:"pirate3",text:"Voyons comment la diffuser."}
  ],startMiniGame3);
}

function startMiniGame3(){
  clearMiniGame();addTitle("Les réseaux sociaux");
  const pRow=document.createElement("div");pRow.className="mg3-row";
  const tRow=document.createElement("div");tRow.className="mg3-row";
  let sel=null,ok=0;

  [["Instagram & TikTok","know"],["Facebook & LinkedIn","btob"],["Sites e-commerce","btoc"]]
  .forEach(p=>{const b=document.createElement("button");b.textContent=p[0];
    b.onclick=()=>sel={btn:b,key:p[1]};pRow.appendChild(b);});

  [["Se faire connaître","know"],["Vendre en BtoB","btob"],["Vendre en BtoC","btoc"]]
  .forEach(t=>{const b=document.createElement("button");b.textContent=t[0];
    b.onclick=()=>{if(sel&&sel.key===t[1]){
      showNotification("Bonne réponse");sel.btn.remove();b.remove();sel=null;++ok;
      if(ok===3)showPirateLoader(finish);}};tRow.appendChild(b);});

  miniGame.append(pRow,tRow);
}

/* =====================================================
   🏁 FIN
===================================================== */
function finish(){
  hideMiniGame();
  sessionStorage.setItem("unlock_pirate5","true");
  location.href="menu.html";
}

});
