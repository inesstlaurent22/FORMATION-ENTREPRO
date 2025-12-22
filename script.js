const wait = ms => new Promise(r => setTimeout(r, ms))

/* ===== ELEMENTS ===== */
const tresor = document.getElementById("tresor")
const mapGame = document.getElementById("mapGame")
const pieces = document.querySelectorAll(".piece")
const slots = document.querySelectorAll(".slot")
const fade = document.getElementById("fade")
const loader = document.getElementById("videoLoader")
const videoContainer = document.getElementById("videoContainer")
const video = document.getElementById("mainVideo")
const soundButton = document.getElementById("soundButton")
const menuButton = document.getElementById("menuButton")

/* ===== GEMMES CANVAS ===== */
const canvas = document.getElementById("fxCanvas")
const ctx = canvas.getContext("2d")
canvas.width = innerWidth
canvas.height = innerHeight

let gems = []

function spawnGems(x, y) {
  for (let i = 0; i < 80; i++) {
    gems.push({
      x, y,
      vx:(Math.random()-0.5)*10,
      vy:(Math.random()-1)*12,
      r:Math.random()*7+6,
      rot:Math.random()*Math.PI,
      col:`hsl(${Math.random()*360},90%,60%)`,
      life:1
    })
  }
}

function animateGems() {
  ctx.clearRect(0,0,canvas.width,canvas.height)
  gems.forEach(g => {
    g.x += g.vx
    g.y += g.vy
    g.vy += 0.4
    g.rot += 0.1
    g.life -= 0.015

    ctx.save()
    ctx.translate(g.x, g.y)
    ctx.rotate(g.rot)
    ctx.fillStyle = g.col
    ctx.beginPath()
    ctx.moveTo(0,-g.r)
    ctx.lineTo(g.r,g.r)
    ctx.lineTo(-g.r,g.r)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  })
  gems = gems.filter(g => g.life > 0)
  requestAnimationFrame(animateGems)
}
animateGems()

/* ===== COFFRE ===== */
tresor.addEventListener("click", e => {
  tresor.classList.add("open")

  const r = tresor.getBoundingClientRect()
  spawnGems(r.left + r.width/2, r.top)

  mapGame.style.display = "flex"
})

/* ===== MINI JEU ===== */
let selected = null

pieces.forEach(p => {
  p.onclick = () => {
    pieces.forEach(x => x.classList.remove("selected"))
    selected = p
    p.classList.add("selected")
  }
})

slots.forEach(s => {
  s.onclick = () => {
    if (!selected) return
    if (s.dataset.id === selected.dataset.id) {
      s.appendChild(selected)
      selected.classList.remove("selected")
      selected = null
      checkWin()
    }
  }
})

function checkWin() {
  if (document.querySelectorAll(".slot img").length === 3) {
    mapGame.style.display = "none"
    startVideo()
  }
}

/* ===== VIDEO ===== */
async function startVideo() {
  fade.classList.add("show")
  await wait(1000)

  loader.style.display = "flex"
  fade.classList.remove("show")
  await wait(1500)

  loader.style.display = "none"
  videoContainer.style.display = "flex"
  video.play()
}

soundButton.onclick = () => video.muted = !video.muted
menuButton.onclick = () => location.href = "menu.html"
video.onended = () => fade.classList.add("show")
