document.addEventListener("DOMContentLoaded", () => {

/* =====================================================
   🔧 OUTILS
===================================================== */
function fade(text, cb){
  fadeScreen.querySelector(".loaderBox").innerHTML = text;
  fadeScreen.style.display = "flex";
  setTimeout(() => {
    fadeScreen.style.display = "none";
    cb && cb();
  }, 1800);
}

function typeWriter(el, text, cb){
  let i = 0;
  el.innerHTML = "";
  const t = setInterval(() => {
    el.innerHTML += text[i++];
    if(i >= text.length){
      clearInterval(t);
      cb && cb();
    }
  }, 25);
}

/* =====================================================
   🎬 VIDÉO
===================================================== */
const videoContainer = document.getElementById("videoContainer");
const video = document.getElementById("questVideo");
const toggleSound = document.getElementById("toggleSound");
const closeVideo = document.getElementById("closeVideo");

toggleSound.onclick = () => {
  video.muted = !video.muted;
  toggleSound.textContent = video.muted ? "🔇" : "🔊";
};
closeVideo.onclick = endVideo;
video.onended = endVideo;

function endVideo(){
  video.pause();
  videoContainer.style.display = "none";
  fade("Chargement...", showBackground);
}

/* =====================================================
   🌅 BACKGROUND
===================================================== */
const background = document.getElementById("background");
const pirate2 = document.getElementById("pirate2bis");
const pirate5 = document.getElementById("pirate5bis");
const pirate3 = document.getElementById("pirate3bis");

function showBackground(){
  background.classList.remove("hidden");
}

/* =====================================================
   💬 BULLES – GÉNÉRIQUE
===================================================== */
const bubbleContainer = document.getElementById("bubbleContainer");

function playDialogues(dialogues, onEnd){
  let index = 0;

  function show(){
    bubbleContainer.innerHTML = "";

    const d = dialogues[index];
    const bubble = document.createElement("div");
    bubble.className = "dialogue-bubble";

    const text = document.createElement("div");
    bubble.appendChild(text);

    const r = d.anchor.getBoundingClientRect();
    bubble.style.left = r.left + "px";
    bubble.style.top = (r.top - 160) + "px";

    bubbleContainer.appendChild(bubble);

    typeWriter(text, d.text, () => {
      bubble.onclick = () => {
        index++;
        index < dialogues.length ? show() : end();
      };
    });
  }

  function end(){
    bubbleContainer.innerHTML = "";
    onEnd && onEnd();
  }

  show();
}

/* =====================================================
   💬 DIALOGUES AVANT MINI-JEU 1 (TES TEXTES)
===================================================== */
const introDialogues = [
  { who:"maitre", text:"Moussaillon ! Bienvenue sur le marché des trésors ! Ici, plein de pirates vendent des pierres précieuses… mais pour toi, qui débutes, faudra suivre mes conseils !", anchor:pirate5 },
  { who:"apprenti", text:"J’suis prêt, capitaine !", anchor:pirate2 },
  { who:"maitre", text:"Écoute bien ! D’abord, tu dois te mettre au niveau des autres pirates… parle comme eux, montre que tu connais tes pierres. Ensuite… sois plus malin et plus rapide qu’eux ! Faut que tous les clients viennent chez toi !", anchor:pirate5 },
  { who:"apprenti", text:"Mais comment je fais ça ?", anchor:pirate2 },
  { who:"maitre", text:"Regarde bien : la plupart ont une petite échoppe et vendent leurs pierres dans des petits sachets en velours. Les clients adorent ça ! Donc toi aussi, il te faudra une échoppe et des sachets. Mais attention… tes pierres ressemblent à celles des autres ! Faut que tu te démarques !", anchor:pirate5 },
  { who:"apprenti", text:"Me démarquer… c’est-à-dire ?", anchor:pirate2 },
  { who:"maitre", text:"Plusieurs stratégies, moussaillon :<br>• vendre moins cher<br>• boîtes en bois luxe<br>• grande boutique visible<br>• aller chez les clients", anchor:pirate5 },
  { who:"apprenti", text:"Ahhh… donc je choisis la meilleure stratégie selon mes clients !", anchor:pirate2 },
  { who:"maitre", text:"Exactement ! Observe, teste, et deviens le pirate que tout le monde veut rencontrer.", anchor:pirate5 },
  { who:"apprenti", text:"MERCI capitaine !", anchor:pirate2 }
];

/* 👉 clic sur pirate 5 pour lancer */
pirate5.onclick = () => {
  playDialogues(introDialogues, () => {
    fade("Termines ce mini jeu pour poursuivre ta quête", startQuiz);
  });
};

/* =====================================================
   🎮 MINI-JEU 1 – QUIZ (CORRIGÉ)
===================================================== */
const miniGameContainer = document.getElementById("miniGameContainer");
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const progressEl = document.getElementById("progress");

const steps = [
  { question:"Où les pirates ont-ils trouvé leurs pierres ?", answers:["Dans un coffre dans une grotte secrète","Ils les ont achetées au marché","La tante les leur a données"], correct:0 },
  { question:"Qui fait partie de l'équipage pirate ?", answers:["Toi et les deux moussaillons","Juste le capitaine","Toute la famille pirate"], correct:0 },
  { question:"Quel est le but du projet des pirates ?", answers:["Construire un bateau","Partir en vacances","Garder les pierres pour décorer la cale"], correct:0 },
  { question:"Qu’est-ce que les pirates doivent observer sur le marché ?", answers:["Nos pierres","Les chapeaux des concurrents","La météo"], correct:0 },
  { question:"Que doivent-ils décrire pour leurs pierres ?", answers:["Caractéristiques, nombre, qualités et défauts","Seulement la couleur","Seulement la taille"], correct:0 },
  { question:"À quoi sert le modèle économique ?", answers:["Savoir combien de pierres vendre pour acheter le bateau","Savoir qui fait la vaisselle","Compter les mouettes"], correct:0 },
  { question:"Quelle stratégie les différencie des autres ?", answers:["Vendre les pierres dans des boîtes en bois","Crier très fort au marché","Vendre sans dire le prix"], correct:0 },
  { question:"Qu’est-ce que le plan financier ?", answers:["Un document qui prévoit les dépenses et les gains","Une carte au trésor","Une chanson de pirates"], correct:0 },
  { question:"À quoi sert le statut juridique ?", answers:["À dire comment l’activité pirate est organisée légalement","À choisir le nom du perroquet","À fabriquer des épées"], correct:0 }
];

let quizIndex = 0;

function startQuiz(){
  miniGameContainer.style.display = "flex";
  quizIndex = 0;
  showQuizQuestion();
}

function showQuizQuestion(){
  const q = steps[quizIndex];
  questionEl.textContent = q.question;
  answersEl.innerHTML = "";
  progressEl.textContent = `${quizIndex + 1}/${steps.length}`;

  q.answers.forEach((ans, i) => {
    const btn = document.createElement("button");
    btn.textContent = ans;
    btn.onclick = () => {
      if(i === q.correct){
        quizIndex++;
        quizIndex < steps.length ? showQuizQuestion() : endQuiz();
      } else {
        showQuizQuestion();
      }
    };
    answersEl.appendChild(btn);
  });
}

function endQuiz(){
  miniGameContainer.style.display = "none";
  fade("Bravo ! Ton business plan est prêt", showBook);
}

/* =====================================================
   📖 LIVRE + SUITE
   (inchangé par rapport à la version précédente)
===================================================== */

/* 👉 le reste de ton JS (livre, pirate 3, mini-jeu 2, fin)
   reste IDENTIQUE à la version que je t’ai envoyée juste avant
*/

});
