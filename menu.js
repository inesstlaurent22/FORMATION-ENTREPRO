const pirates = document.querySelectorAll(".pirate")
const notif = document.getElementById("notification")
const bubble = document.getElementById("bubble")
const cinematic = document.getElementById("cinematic")
const resetBtn = document.getElementById("resetAdventure")

let unlocked = 2

/* === CHARGEMENT SERVEUR === */
fetch("save_progress.php")
  .then(r => r.json())
  .then(d => unlocked = d.unlocked || 2)
  .catch(() => unlocked = Number(localStorage.getItem("unlocked")) || 2)
  .finally(updateUI)

function saveProgress(val) {
  localStorage.setItem("unlocked", val)
  fetch("save_progress.php", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ unlocked: val })
  })
}

function updateUI() {
  pirates.forEach(p => {
    const id = Number(p.dataset.id)
    p.className = "pirate " + (id <= unlocked ? "unlocked" : "locked")
  })

  if (unlocked === 2) {
    const p2 = document.querySelector('[data-id="2"]')
    bubble.style.display = "block"
    bubble.style.left = p2.offsetLeft + "px"
    bubble.style.top = (p2.offsetTop - 140) + "px"
  }
}

pirates.forEach(p => {
  p.onclick = () => {
    const id = Number(p.dataset.id)
    if (id !== unlocked) return

    cinematic.style.display = "flex"

    setTimeout(() => {
      cinematic.style.display = "none"
      unlocked++
      saveProgress(unlocked)

      notif.style.display = "block"
      setTimeout(() => notif.style.display = "none", 2000)

      const next = document.querySelector(`[data-id="${unlocked}"]`)
      if (next) next.classList.add("unlock-anim")

      const pages = {
        1:"commerce.html",
        3:"marketing.html",
        4:"finance.html",
        5:"legal.html"
      }
      if (pages[id]) window.open(pages[id], "_blank")

      setTimeout(() => location.reload(), 1200)
    }, 1800)
  }
})

resetBtn.onclick = () => {
  saveProgress(2)
  location.reload()
}
