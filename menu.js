const pirates = document.querySelectorAll(".pirate")
const notif = document.getElementById("notification")
const bubble = document.getElementById("bubble")
const cinematic = document.getElementById("cinematic")
const resetBtn = document.getElementById("resetAdventure")

/*
ORDRE LOGIQUE :
2 → 1 → 3 → 4 → 5
*/
const order = [2, 1, 3, 4, 5]
let step = 0

/* === CHARGEMENT === */
const saved = Number(localStorage.getItem("step")) || 0
step = saved
updateUI()

function save() {
  localStorage.setItem("step", step)
}

function updateUI() {
  pirates.forEach(p => {
    const id = Number(p.dataset.id)
    p.className = "pirate locked"
    if (order.indexOf(id) <= step) {
      p.classList.remove("locked")
      p.classList.add("unlocked")
    }
  })

  if (order[step] === 2) {
    const p2 = document.querySelector('[data-id="2"]')
    bubble.style.display = "block"
    bubble.style.left = p2.offsetLeft + "px"
    bubble.style.top = (p2.offsetTop - 140) + "px"
    bubble.innerHTML =
      "Bravo Moussaillon 🏴‍☠️<br>L’aventure commence !"
  }
}

pirates.forEach(p => {
  p.onclick = () => {
    const id = Number(p.dataset.id)
    if (id !== order[step]) return

    cinematic.style.display = "flex"

    setTimeout(() => {
      cinematic.style.display = "none"
      step++
      save()

      notif.style.display = "block"
      setTimeout(() => notif.style.display = "none", 2000)

      const pages = {
        1: "commerce.html",
        3: "marketing.html",
        4: "finance.html",
        5: "legal.html"
      }

      if (pages[id]) window.open(pages[id], "_blank")

      setTimeout(() => location.reload(), 1200)
    }, 1800)
  }
})

resetBtn.onclick = () => {
  localStorage.removeItem("step")
  location.reload()
}
