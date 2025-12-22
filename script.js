/* ================= THREE.JS COFFRE ================= */
const chestCanvas = document.getElementById("chestCanvas")
const renderer = new THREE.WebGLRenderer({ canvas: chestCanvas, alpha: true })
renderer.setSize(innerWidth, innerHeight)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(45, innerWidth/innerHeight, 0.1, 100)
camera.position.set(0, 2.5, 6)

const light = new THREE.DirectionalLight(0xffffff, 1.2)
light.position.set(5,5,5)
scene.add(light)
scene.add(new THREE.AmbientLight(0xffffff,0.5))

/* Coffre */
const base = new THREE.Mesh(
  new THREE.BoxGeometry(3,1.5,2),
  new THREE.MeshStandardMaterial({ color: 0x6b3e1e })
)
scene.add(base)

const lid = new THREE.Mesh(
  new THREE.BoxGeometry(3,0.6,2),
  new THREE.MeshStandardMaterial({ color: 0x8b5a2b })
)
lid.position.y = 1.05
lid.rotation.x = 0
scene.add(lid)

let opened = false
let hover = false

/* Animation */
function animateChest(){
  requestAnimationFrame(animateChest)

  base.rotation.y += hover ? 0.003 : 0.001
  lid.rotation.x += opened ? (-Math.PI/2 - lid.rotation.x)*0.08 : (0 - lid.rotation.x)*0.08

  renderer.render(scene, camera)
}
animateChest()

/* Hover / Click */
chestCanvas.addEventListener("mousemove",()=>hover=true)
chestCanvas.addEventListener("mouseleave",()=>hover=false)

chestCanvas.addEventListener("click",()=>{
  if(opened) return
  opened = true
  spawnGems(innerWidth/2, innerHeight/2)
  document.getElementById("mapGame").style.display="flex"
})

/* ================= GEMMES CANVAS ================= */
const fxCanvas = document.getElementById("fxCanvas")
const ctx = fxCanvas.getContext("2d")
fxCanvas.width = innerWidth
fxCanvas.height = innerHeight

let gems=[]

function spawnGems(x,y){
  for(let i=0;i<80;i++){
    gems.push({
      x,y,
      vx:(Math.random()-0.5)*10,
      vy:(Math.random()-1)*12,
      r:Math.random()*6+6,
      rot:Math.random()*Math.PI,
      col:`hsl(${Math.random()*360},90%,60%)`,
      life:1
    })
  }
}

function animateGems(){
  ctx.clearRect(0,0,fxCanvas.width,fxCanvas.height)
  gems.forEach(g=>{
    g.x+=g.vx
    g.y+=g.vy
    g.vy+=0.4
    g.rot+=0.1
    g.life-=0.01

    ctx.save()
    ctx.translate(g.x,g.y)
    ctx.rotate(g.rot)
    ctx.fillStyle=g.col
    ctx.beginPath()
    ctx.moveTo(0,-g.r)
    ctx.lineTo(g.r,g.r)
    ctx.lineTo(-g.r,g.r)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  })
  gems=gems.filter(g=>g.life>0)
  requestAnimationFrame(animateGems)
}
animateGems()

/* ================= MINI-JEU ================= */
let selected=null
const pieces=document.querySelectorAll(".piece")
const slots=document.querySelectorAll(".slot")

pieces.forEach(p=>{
  p.onclick=()=>{
    pieces.forEach(x=>x.classList.remove("selected"))
    selected=p
    p.classList.add("selected")
  }
})

slots.forEach(s=>{
  s.onclick=()=>{
    if(!selected) return
    if(s.dataset.id===selected.dataset.id){
      s.appendChild(selected)
      selected.classList.remove("selected")
      selected=null
      checkWin()
    }
  }
})

function checkWin(){
  if(document.querySelectorAll(".slot img").length===3){
    document.getElementById("mapGame").style.display="none"
    startVideo()
  }
}

/* ================= VIDÉO ================= */
const fade=document.getElementById("fade")
const loader=document.getElementById("videoLoader")
const videoContainer=document.getElementById("videoContainer")
const video=document.getElementById("mainVideo")

async function startVideo(){
  fade.classList.add("show")
  await new Promise(r=>setTimeout(r,1000))
  loader.style.display="flex"
  fade.classList.remove("show")
  await new Promise(r=>setTimeout(r,1500))
  loader.style.display="none"
  videoContainer.style.display="flex"
  video.play()
}

document.getElementById("menuButton").onclick=()=>location.href="menu.html"
document.getElementById("soundButton").onclick=()=>video.muted=!video.muted
