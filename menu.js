document.addEventListener("DOMContentLoaded", () => {

  const pirates = {
    1: document.getElementById("pirate1"),
    2: document.getElementById("pirate2"),
    3: document.getElementById("pirate3"),
    4: document.getElementById("pirate4"),
    5: document.getElementById("pirate5")
  };

  const notification = document.getElementById("notification");
  const bubble = document.getElementById("bubble");

  if (!pirates[1] || !pirates[2]) {
    console.error("Pirates non trouvés !");
    return;
  }

  /* ========= INITIALISATION ========= */
  if (!localStorage.getItem("menuVisited")) {
    localStorage.setItem("menuVisited", "yes");

    // seul Pirate 2 débloqué
    pirates[2].classList.add("unlocked");
    pirates[2].classList.remove("locked");

    pirates[1].classList.add("locked");
    pirates[3].classList.add("locked");
    pirates[4].classList.add("locked");
    pirates[5].classList.add("locked");

    localStorage.removeItem("p1_unlocked");
  }

  /* ========= CLIC SUR PIRATE 2 ========= */
  let pirate2Clicked = localStorage.getItem("pirate2Clicked");
  if (!pirate2Clicked) {
    pirates[2].addEventListener("click", () => {

      // déblocage Pirate 1
      localStorage.setItem("p1_unlocked", "yes");

      // bloquer le clic suivant
      localStorage.setItem("pirate2Clicked", "true");

      // reload page
      location.reload();
    });
  }

  /* ========= APRÈS CLIC SUR PIRATE 2 ========= */
  if (localStorage.getItem("p1_unlocked") === "yes") {

    pirates[1].classList.remove("locked");
    pirates[1].classList.add("unlocked");

    // notification et bulle
    notification.style.display = "block";
    setTimeout(() => { notification.style.top = "15px"; }, 50);

    bubble.style.display = "block";
  }

});
