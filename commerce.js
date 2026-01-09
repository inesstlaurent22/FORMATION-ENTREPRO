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
   🎬 VIDÉO INTRO
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
  color:#000; /* texte noir */
  cursor:pointer;
  box-shadow:0 4px 0 #3b1b00;
}

#videoControls button:active{
  transform:translateY(3px) scale(.96);
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
  width:100%;
  height:100%;
  object-fit:cover;
}

/* =====================================================
   🏴‍☠️ PIRATES
===================================================== */
.pirate{
  position:absolute;
  z-index:50;
  transition:transform .3s ease, filter .3s ease;
}

.pirate.glow{
  transform:scale(1.06);
  filter:drop-shadow(0 0 28px gold);
}

#pirate2bis{
  width:186px;
  left:520px;
  top:406px;
}

#pirate5bis{
  width:143px;
  left:785px;
  top:397px;
  cursor:pointer;
}

#pirate3bis{
  width:235px;
  left:630px;
  top:180px;
  cursor:pointer;
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
  max-width:560px;
  background:#fdf4e3;
  color:#000;
  border:4px solid #8a5a20;
  border-radius:20px;
  padding:22px;
  line-height:1.45;
  box-shadow:
    0 6px 0 #3b1b00,
    0 22px 45px rgba(0,0,0,.55);
  cursor:pointer;
  pointer-events:auto;
}

/* =====================================================
   ⏭️ PASSER LES DIALOGUES
===================================================== */
#skipDialoguesBtn{
  position:fixed;
  top:20px;
  right:20px;
  padding:12px 20px;
  font-size:16px;
  font-weight:bold;
  border-radius:16px;
  border:3px solid #3b1b00;
  background:linear-gradient(#ffd27d,#c89b58);
  color:#000; /* texte noir */
  cursor:pointer;
  box-shadow:0 4px 0 #3b1b00;
  z-index:3200;
}

#skipDialoguesBtn:active{
  transform:translateY(3px) scale(.96);
  box-shadow:0 1px 0 #3b1b00;
}

/* =====================================================
   ⏳ LOADER
===================================================== */
#fadeScreen{
  position:fixed;
  inset:0;
  display:flex;
  justify-content:center;
  align-items:center;
  background:rgba(0,0,0,.95);
  z-index:2500;
}

.loaderBox{
  text-align:center;
  color:gold;
  font-size:28px;
  text-shadow:0 0 25px gold;
}

/* =====================================================
   🎮 MINI-JEU 1 — BUSINESS PLAN
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
  max-width:640px;
  background:linear-gradient(#2b1a0d,#140a05);
  border:6px solid #6b3e18;
  padding:30px;
  box-shadow:0 0 40px rgba(0,0,0,.9);
  text-align:center;
}

/* 🔥 Titre fort et différencié */
.quizTitle{
  font-size:32px;
  font-weight:900;
  color:#ffffff;
  text-shadow:0 0 18px gold;
  margin-bottom:18px;
  letter-spacing:1px;
}

.quizSeparator{
  height:3px;
  background:linear-gradient(90deg,transparent,gold,transparent);
  margin:10px 0 18px;
}

#gameQuestion{
  font-size:20px;
  color:#ffffff;
  margin-bottom:18px;
}

/* Boutons mini-jeu 1 */
#gameAnswers button{
  width:100%;
  margin-top:14px;
  padding:22px;
  font-size:20px;
  font-weight:bold;
  border-radius:18px;
  border:4px solid #3b1b00;
  background:linear-gradient(#ffd27d,#c89b58);
  color:#000; /* texte noir */
  cursor:pointer;
  box-shadow:
    0 6px 0 #3b1b00,
    0 0 25px rgba(255,215,0,.25);
}

#gameAnswers button:hover{
  transform:scale(1.05);
  box-shadow:
    0 6px 0 #3b1b00,
    0 0 35px gold;
}

#gameFeedback{
  margin-top:16px;
  font-size:18px;
  color:#ffd700;
}

/* =====================================================
   📖 LIVRE — BUSINESS PLAN
===================================================== */
#bookContainer{
  position:fixed;
  inset:0;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  background:rgba(0,0,0,.9);
  z-index:2200;
}

#bookTitle{
  color:#ffffff;
  font-size:26px;
  font-weight:bold;
  text-shadow:0 0 18px gold;
  margin-bottom:16px;
}

.book{
  display:flex;
  border:6px solid #6b3e18;
  border-radius:16px;
  overflow:hidden;
  background:#2b1a0d;
}

.page{
  width:420px;
  height:520px;
}

.page img{
  width:100%;
  height:100%;
  object-fit:contain; /* images visibles entièrement */
  background:#1b1008;
}

/* =====================================================
   ▶️ BOUTON POURSUIVRE LA QUÊTE
===================================================== */
#continueQuestBtn{
  position:fixed;
  top:20px;
  right:20px;
  padding:16px 28px;
  font-size:18px;
  font-weight:bold;
  border-radius:18px;
  border:4px solid #3b1b00;
  background:linear-gradient(#ffd27d,#c89b58);
  color:#000;
  cursor:pointer;
  box-shadow:0 6px 0 #3b1b00;
  z-index:3300;
}

#continueQuestBtn:hover{
  transform:scale(1.06);
  box-shadow:0 0 35px gold;
}

#continueQuestBtn:active{
  transform:translateY(4px) scale(.96);
  box-shadow:0 2px 0 #3b1b00;
}

/* =====================================================
   ☠️ BOUTON FINAL — CLIQUE POUR TERMINER
===================================================== */
.finalBtn{
  margin-top:18px;
  padding:14px 26px;
  font-size:18px;
  font-weight:bold;
  border-radius:16px;
  border:4px solid #3b1b00;
  background:linear-gradient(#ffd27d,#c89b58);
  color:#000;
  cursor:pointer;
  box-shadow:0 6px 0 #3b1b00;
}

.finalBtn:hover{
  transform:scale(1.05);
  box-shadow:0 0 30px gold;
}

/* =====================================================
   📱 RESPONSIVE
===================================================== */
@media(max-width:768px){

  .dialogue-bubble{
    max-width:90vw;
    left:50%!important;
    transform:translateX(-50%);
  }

  .book{
    transform:scale(.9);
  }

  #pirate2bis{
    left:30%;
    top:60%;
    width:140px;
  }

  #pirate5bis{
    left:55%;
    top:58%;
    width:120px;
  }

  #pirate3bis{
    left:40%;
    top:30%;
    width:160px;
  }
}
