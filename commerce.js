document.addEventListener("DOMContentLoaded", () => {

  const videoContainer = document.getElementById("videoContainer");
  const questVideo = document.getElementById("questVideo");
  const toggleSound = document.getElementById("toggleSound");
  const closeVideo = document.getElementById("closeVideo");

  const background = document.getElementById("background");
  const pirate2bis = document.getElementById("pirate2bis");
  const pirate5bis = document.getElementById("pirate5bis");
  const bubbleContainer = document.getElementById("bubbleContainer");

  const overlayBlur = document.getElementById("overlayBlur");
  const loaderContainer = document.getElementById("loaderContainer");
  const miniGameContainer = document.getElementById("miniGameContainer");
  const victoryScreen = document.getElementById("victoryScreen");
  const fireworksCanvas = document.getElementById("fireworksCanvas");

  const gameQuestion = document.getElementById("gameQuestion");
  const gameAnswers = document.getElementById("gameAnswers");
  const gameFeedback = document.getElementById("gameFeedback");

  // État initial
  questVideo.muted = true;
  questVideo.loop = false;
  videoContainer.style.display="flex";
  background.style.display="none";
  pirate2bis.style.display="none";
  pirate5bis.style.display="none";
  miniGameContainer.style.display="none";
  overlayBlur.style.display="none";
  loaderContainer.style.display="none";
  victoryScreen.style.display="none";

  pirate2bis.style.left = "516px"; pirate2bis.style.top = "406px";
  pirate5bis.style.left = "785px"; pirate5bis.style.top = "397px";

  toggleSound.addEventListener("click", () => {
    questVideo.muted = !questVideo.muted;
    toggleSound.textContent = questVideo.muted ? "🔇" : "🔊";
  });
  closeVideo.addEventListener("click", () => {
    questVideo.pause();
    questVideo.dispatchEvent(new Event('ended'));
  });
  questVideo.play().catch(()=>{});

  questVideo.addEventListener("ended", () => {
    videoContainer.style.opacity=0;
    setTimeout(()=>{
      videoContainer.style.display="none";
      background.style.display="block";
      pirate2bis.style.display="flex";
      pirate5bis.style.display="flex";
    },500);
  });

  // Dialogues
  let dialogueStep=0;
  const dialogues=[
    {who:"maitre", text:"Moussaillon ! Bienvenue sur le marché des trésors ! Ici, plein de pirates vendent des pierres précieuses… mais pour toi, qui débutes, faudra suivre mes conseils !", anchor:pirate5bis},
    {who:"apprenti", text:"J’suis prêt, capitaine !", anchor:pirate2bis},
    {who:"maitre", text:"Écoute bien ! D’abord, tu dois te mettre au niveau des autres pirates… parle comme eux, montre que tu connais tes pierres. Ensuite… sois plus malin et plus rapide qu’eux ! Faut que tous les clients viennent chez toi !", anchor:pirate5bis},
    {who:"apprenti", text:"Mais comment je fais ça ?", anchor:pirate2bis},
    {who:"maitre", text:"Regarde bien : la plupart ont une petite échoppe et vendent leurs pierres dans des petits sachets en velours. Les clients adorent ça ! Donc toi aussi, il te faudra une échoppe et des sachets. Mais attention… tes pierres ressemblent à celles des autres ! Faut que tu te démarques !", anchor:pirate5bis},
    {who:"apprenti", text:"Me démarquer… c’est-à-dire ?", anchor:pirate2bis},
    {who:"maitre", text:"Plusieurs stratégies, moussaillon :<br>• vendre moins cher<br>• boîtes en bois luxe<br>• grande boutique visible<br>• aller chez les clients", anchor:pirate5bis},
    {who:"apprenti", text:"Ahhh… donc je choisis la meilleure stratégie selon mes clients !", anchor:pirate2bis},
    {who:"maitre", text:"Exactement ! Observe, teste, et deviens le pirate que tout le monde veut rencontrer.", anchor:pirate5bis},
    {who:"apprenti", text:"MERCI capitaine !", anchor:pirate2bis}
  ];

  function createBubble(dialogue,isLast=false){
    bubbleContainer.innerHTML="";
    const rect=dialogue.anchor.getBoundingClientRect();
    const div=document.createElement("div");
    div.className="bubble";
    const title=dialogue.who==="maitre"?"Maître pirate":"Apprenti pirate";
    div.innerHTML=`<div class="name"><strong>${title}</strong></div><hr><div>${dialogue.text}</div>`;

    if(isLast){
      const btn=document.createElement("button");
      btn.textContent="Ok, j'ai compris";
      btn.onclick=showLoader;
      div.appendChild(btn);
    } else {
      const btn=document.createElement("button");
      btn.textContent="Suite";
      btn.onclick=nextDialogue;
      div.appendChild(btn);
    }
    bubbleContainer.appendChild(div);
    div.style.maxWidth="300px"; div.style.wordWrap="break-word";
    let leftPos=rect.left+rect.width/2-150;
    let topPos=rect.top-div.offsetHeight-20;
    if(leftPos<10) leftPos=10;
    if(leftPos+300>window.innerWidth-10) leftPos=window.innerWidth-310;
    if(topPos<10) topPos=10;
    div.style.left=leftPos+"px"; div.style.top=topPos+"px";
  }

  function nextDialogue(){ dialogueStep++; createBubble(dialogues[dialogueStep], dialogueStep===dialogues.length-1); }
  pirate5bis.addEventListener("click", ()=>{ dialogueStep=0; createBubble(dialogues[0]); });

  // Loader fade-in
  function showLoader(){
    bubbleContainer.innerHTML="";
    loaderContainer.style.display="block";
    overlayBlur.style.display="block";
    overlayBlur.style.opacity=1;
    setTimeout(()=>{
      loaderContainer.style.display="none";
      launchMiniGame();
    },2500);
  }

  // MINI-JEU
  const steps=[
    {question:"Où les pirates ont-ils trouvé leurs pierres ?", answers:["Dans un coffre dans une grotte secrète","Ils les ont achetées au marché","La tante les leur a données"], correct:0},
    {question:"Qui fait partie de l'équipage pirate ?", answers:["Toi et les deux moussaillons","Juste le capitaine","Toute la famille pirate"], correct:0}
  ];
  let currentStep=0;

  function showStep(){
    if(currentStep<steps.length){
      const stepObj=steps[currentStep];
      gameQuestion.textContent=stepObj.question;
      gameAnswers.innerHTML=""; gameFeedback.textContent="";
      stepObj.answers.forEach((ans,i)=>{
        const btn=document.createElement("button");
        btn.textContent=ans;
        btn.addEventListener("click",()=> handleAnswer(i));
        gameAnswers.appendChild(btn);
      });
    } else showVictory();
  }

  function handleAnswer(i){
    if(i===steps[currentStep].correct){
      gameFeedback.textContent="✅ Bonne réponse !";
      setTimeout(()=>{currentStep++; showStep();},700);
    } else gameFeedback.textContent="❌ Essaie encore !";
  }

  function launchMiniGame(){
    miniGameContainer.style.display="flex"; miniGameContainer.style.opacity=1; currentStep=0; showStep();
  }

  // Victoire
  function showVictory(){
    miniGameContainer.style.display="none";
    overlayBlur.style.opacity=0; overlayBlur.style.display="none";
    victoryScreen.style.display="flex";
    startFireworks();
  }

  // Feu d'artifice simple
  function startFireworks(){
    const c=fireworksCanvas;
    c.width=window.innerWidth; c.height=window.innerHeight;
    const ctx=c.getContext("2d");
    const particles=[];
    for(let i=0;i<50;i++){
      particles.push({x:window.innerWidth/2, y:window.innerHeight/2, vx:(Math.random()-0.5)*10, vy:(Math.random()-1.5)*10, r:Math.random()*4+2, color:`hsl(${Math.random()*60+40},100%,50%)`});
    }
    const interval=setInterval(()=>{
      ctx.fillStyle="rgba(0,0,0,0.2)"; ctx.fillRect(0,0,c.width,c.height);
      particles.forEach(p=>{
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=p.color; ctx.fill();
        p.x+=p.vx; p.y+=p.vy; p.vy+=0.1;
        if(p.y>c.height) p.y=c.height/2; if(p.x>c.width) p.x=c.width/2;
      });
    },30);
    setTimeout(()=>clearInterval(interval),3000);
  }

});
