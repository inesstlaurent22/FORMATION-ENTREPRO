document.addEventListener("DOMContentLoaded", () => {

  /* ========================================================
        0️⃣ ÉLÉMENTS DOM
  ======================================================== */
  const videoContainer = document.getElementById("videoContainer");
  const questVideo = document.getElementById("questVideo");
  const toggleSound = document.getElementById("toggleSound");
  const closeVideo = document.getElementById("closeVideo");
  const background = document.getElementById("background");

  const buttonsContainer = document.getElementById("buttonsContainer");
  const replayVideo = document.getElementById("replayVideo");
  const finishQuest = document.getElementById("finishQuest");

  const pirate2bis = document.getElementById("pirate2bis");
  const pirate5bis = document.getElementById("pirate5bis");
  const bubbleContainer = document.getElementById("bubbleContainer");

  // 🔍 sécurité anti-bug
  if (!videoContainer || !questVideo) {
    console.error("❌ ERREUR : videoContainer ou questVideo introuvable");
    return;
  }

  /* ========================================================
        1️⃣ ÉTAT INITIAL / AUTOPLAY
  ======================================================== */
  questVideo.setAttribute("playsinline", "");
  questVideo.setAttribute("webkit-playsinline", "");
  questVideo.muted = true; // obligatoire iOS

  // forcer affichage vidéo
  videoContainer.style.display = "flex";
  videoContainer.style.opacity = "1";
  videoContainer.style.visibility = "visible";

  // masquer le reste
  if (background) background.classList.remove("show");
  if (buttonsContainer) buttonsContainer.style.display = "none";

  if (pirate2bis) pirate2bis.style.display = "none";
  if (pirate5bis) pirate5bis.style.display = "none";
  if (replayVideo) replayVideo.style.display = "none";
  if (finishQuest) finishQuest.style.display = "none";

  /* ========================================================
        2️⃣ LANCEMENT VIDÉO
  ======================================================== */
  function startVideo() {

    console.log("▶️ tentative lecture vidéo");

    videoContainer.classList.add("show");
    questVideo.currentTime = 0;

    questVideo.play().catch(err => {
      console.warn("⛔ autoplay bloqué :", err);
      // bouton devient play
      if (toggleSound) toggleSound.textContent = "▶️ Lancer la vidéo";
      if (toggleSound) toggleSound.onclick = () => questVideo.play();
    });
  }

  // petit délai pour iOS
  setTimeout(startVideo, 100);

  /* ========================================================
        3️⃣ FIN VIDÉO → SCÈNE JEU
  ======================================================== */
  function showScene() {

    console.log("🎬 vidéo terminée → affichage scène");

    videoContainer.style.display = "none";

    if (background) background.classList.add("show");
    if (buttonsContainer) buttonsContainer.style.display = "flex";

    if (pirate2bis) pirate2bis.style.display = "block";
    if (pirate5bis) pirate5bis.style.display = "block";
    if (replayVideo) replayVideo.style.display = "block";
    if (finishQuest) finishQuest.style.display = "block";
  }

  questVideo.addEventListener("ended", showScene);

  if (closeVideo) {
    closeVideo.addEventListener("click", () => {
      questVideo.pause();
      showScene();
    });
  }

  /* ========================================================
        4️⃣ SON
  ======================================================== */
  if (toggleSound) {
    toggleSound.addEventListener("click", () => {
      questVideo.muted = !questVideo.muted;
      toggleSound.textContent = questVideo.muted ? "🔇" : "🔊";
    });
  }

  /* ========================================================
        5️⃣ REPLAY
  ======================================================== */
  if (replayVideo) {
    replayVideo.addEventListener("click", () => {
      videoContainer.style.display = "flex";
      if (background) background.classList.remove("show");
      if (buttonsContainer) buttonsContainer.style.display = "none";

      questVideo.currentTime = 0;
      questVideo.play();
    });
  }

  /* ========================================================
        6️⃣ FIN QUÊTE → DÉBLOCAGE PIRATE 3
  ======================================================== */
  const backMenu = document.getElementById("backMenu");
  if (backMenu) {
    backMenu.addEventListener("click", () => {
      localStorage.setItem("pirate3_unlocked", "true");
      window.location.href = "menu.html";
    });
  }

  /* ========================================================
        7️⃣ DIALOGUES PIRATES
  ======================================================== */

  // ... (ta partie dialogues peut rester identique)
});
