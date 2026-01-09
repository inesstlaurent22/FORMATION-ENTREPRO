/* =====================================================
   🔧 RESET GLOBAL
===================================================== */
*{
  margin:0;
  padding:0;
  box-sizing:border-box;
}

html, body{
  width:100%;
  height:100%;
  overflow:hidden;
  font-family:"Trebuchet MS", sans-serif;
  background:#000;
}

.hidden{
  display:none !important;
}

/* =====================================================
   🎬 VIDÉO
===================================================== */
#videoContainer{
  position:fixed;
  inset:0;
  background:#000;
  z-index:3000;
}

#questVideo{
  width:100%;
  height:100%;
  object-fit:cover;
}

#videoControls{
  position:absolute;
  top:20px;
  right:20px;
  display:flex;
  gap:10px;
  z-index:3100;
}

#videoControls button{
  padding:12px 16px;
  font-size:16px;
  border-radius:14px;
  border:3px solid #3b1b00;
  background:linear-gradient(#ffd27d,#c89b58);
  color:#000;
  cursor:pointer;
  box-shadow:0 4px 0 #3b1b00;
}

#videoControls button:active{
  transform:translateY(3px);
  box-shadow:0 1px 0 #3b1b00;
}

/* =====================================================
   🌅 BACKGROUND
===================================================== */
#background{
  position:fixed;
  inset:0;
  z-index:1;
}

.fondImage{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  object-fit:cover;
}

/* =====================================================
   🏴‍☠️ PIRATES
===================================================== */
.pirate{
  position:absolute;
  z-index:40;
  pointer-events:auto;
  transition:transform .35s ease, filter .35s ease, opacity .35s ease;
}

/* Pirate apprenti — taille naturelle */
#pirate2bis{
  left:520px;
  top:410px;
  width:auto;
  height:auto;
  max-width:190px;
}

/* Pirate maître — seul interactif */
#pirate5bis{
  left:780px;
  top:395px;
  max-width:150px;
  cursor:pointer;
}

#pirate5bis.glow{
  filter:drop-shadow(0 0 28px gold);
  transform:scale(1.06);
}

/* Pirate client — arrive de la droite */
#pirate3bis{
  right:-320px;
  top:160px;
  max-width:240px;
  opacity:0;
  transition:right .8s ease, opacity .6s ease;
}

#pirate3bis.show{
  right:520px;
  opacity:1;
}

/* =====================================================
   💬 BULLES DE DIALOGUE
===================================================== */
#bubbleContainer{
  position:fixed;
  inset:0;
  z-index:200;
  pointer-events:none;
}

.dialogue-bubble{
  position:absolute;
  max-width:620px;
  background:#fdf4e3;
  color:#000;
  border:4px solid #8a5a20;
  border-radius:18px;
  padding:18px 22px;
  line-height:1.45;
  box-shadow:
    0 6px 0 #3b1b00,
    0 20px 40px rgba(0,0,0,.55);
  cursor:pointer;
  pointer-events:auto;
}

/* Bouton passer dialogues */
#skipDialoguesBtn{
  position:fixed;
  top:20px;
  right:20px;
  z-index:250;
  padding:10px 18px;
  background:#b81d13;
  color:white;
  border:none;
  border-radius:12px;
  font-weight:bold;
  cursor:pointer;
  box-shadow:0 4px 0 #5e0e09;
  display:none;
}

/* =====================================================
   🌑 LOADER / RÉCOMPENSE
===================================================== */
#fadeScreen{
  position:fixed;
  inset:0;
  display:none;
  justify-content:center;
  align-items:center;
  background:rgba(0,0,0,.95);
  z-index:2500;
}

.loaderBox{
  text-align:center;
  color:gold;
  font-size:26px;
  text-shadow:0 0 25px gold;
}

/* =====================================================
   🎮 MINI-JEUX
===================================================== */
#miniGameContainer{
  position:fixed;
  inset:0;
  display:flex;
  justify-content:center;
  align-items:center;
  background:rgba(0,0,0,.92);
  z-index:2000;
}

.quizBox{
  width:94%;
  max-width:620px;
  background:linear-gradient(#2b1a0d,#140a05);
  border:6px solid #6b3e18;
  padding:28px;
  box-shadow:0 0 40px rgba(0,0,0,.9);
  text-align:center;
}

#gameQuestion{
  font-size:20px;
  color:#fff;
  margin-bottom:16px;
}

#gameAnswers button{
  width:100%;
  margin-top:12px;
  padding:16px;
  font-size:16px;
  border-radius:14px;
  border:3px solid #3b1b00;
  background:linear-gradient(#ffd27d,#c89b58);
  color:#000;
  cursor:pointer;
  box-shadow:0 4px 0 #3b1b00;
  transition:.2s;
}

#gameAnswers button:hover{
  transform:scale(1.03);
  box-shadow:0 0 25px gold;
}

#gameAnswers button.selected{
  background:linear-gradient(#fff2b2,#ffd700);
  box-shadow:0 0 35px gold;
}

#gameFeedback{
  margin-top:14px;
  color:gold;
  font-size:18px;
}

/* =====================================================
   📖 LIVRE
===================================================== */
#bookContainer{
  position:fixed;
  inset:0;
  display:flex;
  justify-content:center;
  align-items:center;
  flex-direction:column;
  background:rgba(0,0,0,.88);
  z-index:2200;
}

#bookContainer::before{
  content:"Ton business plan est prêt";
  color:gold;
  font-size:26px;
  margin-bottom:18px;
  text-shadow:0 0 20px gold;
}

.book{
  display:flex;
  width:92vw;
  max-width:960px;
  aspect-ratio:14/9;
  background:#fff;
  box-shadow:0 0 40px rgba(0,0,0,.9);
}

.page{
  width:50%;
  height:100%;
  overflow:hidden;
}

.page img{
  width:100%;
  height:100%;
  object-fit:contain;
}

/* Bouton continuer */
#continueQuestBtn{
  position:absolute;
  top:20px;
  right:20px;
  padding:14px 26px;
  font-size:18px;
  font-weight:bold;
  background:linear-gradient(#ffd27d,#c89b58);
  color:#000;
  border:3px solid #3b1b00;
  border-radius:16px;
  cursor:pointer;
  z-index:2300;
  display:none;
}

/* =====================================================
   📱 RESPONSIVE MOBILE
===================================================== */
@media(max-width:768px){

  .dialogue-bubble{
    max-width:90vw;
    left:50%!important;
    transform:translateX(-50%);
  }

  #pirate2bis{
    left:30%;
    top:60%;
    max-width:130px;
  }

  #pirate5bis{
    left:55%;
    top:58%;
    max-width:120px;
  }

  #pirate3bis.show{
    right:20%;
  }

  .book{
    width:95vw;
    aspect-ratio:4/3;
  }
}
