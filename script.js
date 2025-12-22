const tresor = document.getElementById("tresor")
const canvas = document.getElementById("fxCanvas")
const ctx = canvas.getContext("2d")
const loader = document.getElementById("videoLoader")
const videoContainer = document.getElementById("videoContainer")
const video = document.getElementById("mainVideo")
const fade = document.getElementById("fade")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

/* ============================= */
/* GEMMES FX */
/* ============================= */

let particles = []

function spawnGems(x, y) {
  for (let i = 0; i < 80; i++) {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 10,
      vy: Math.random() * -12,
      life: 100
    })
  }
}

function animateFX() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  particles.forEach(p => {
    p.x += p.vx
    p.y += p.vy
    p.vy += 0.3
    p.life--

    ctx.fillStyle = "rgba(0,255,255,0.8)"
    ctx.beginPath()
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2)
    ctx.fill()
  })

  particles = particles.filter(p => p.life > 0)
  requestAnimationFrame(animateFX)
}

animateFX()

/* ============================= */
/* COFFRE CLICK */
/* ============================= */

let opened = false

tresor.onclick = () => {
  if (opened) return
  opened = true

  tresor.classList.add("open")

  const rect = tresor.getBoundingClientRect()
  spawnGems(rect.left + rect.width / 2, rect.top)

  setTimeout(() => {
    fade.classList.add("show")
  }, 600)

  setTimeout(() => {
    loader.style.display = "flex"
  }, 1400)

  setTimeout(() => {
    loader.style.display = "none"
    videoContainer.style.display = "flex"
    video.play()
  }, 2600)
}

/* ============================= */
/* SON */
/* ============================= */

document.getElementById("soundButton").onclick = () => {
  video.muted = !video.muted
}
