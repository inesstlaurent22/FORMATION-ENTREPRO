const canvas=document.getElementById("fxCanvas")
const ctx=canvas.getContext("2d")
canvas.width=innerWidth
canvas.height=innerHeight

const tresor=document.getElementById("tresor")
const puzzle=document.getElementById("puzzleGame")
const fade=document.getElementById("fade")
const loader=document.getElementById("videoLoader")
const videoContainer=document.getElementById("videoContainer")
const video=document.getElementById("mainVideo")
const soundButton=document.getElementById("soundButton")
const menuButton=document.getElementById("menuButton")

let particles=[]

/* GEMMES */
function spawnGems(x,y){
  for(let i=0;i<120;i++){
    particles.push({
      x,y,
      vx:(Math.random()-.5)*14,
      vy:(Math.random()-.7)*14,
      r:Math.random()*6+4,
      rot:Math.random()*360,
      color:`hsl(${Math.random()*360},100%,60%)`
    })
  }
}

/* FUMÉE */
function smoke(x,y){
  for(let i=0;i<80;i++){
    particles.push({
      x,y,
      vx:(Math.random()-.5)*3,
      vy:(Math.random()-.8)*3,
      r:Math.random()*20+10,
      alpha:1,
      smoke:true
    })
  }
}

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height)
  particles.forEach(p=>{
    p.x+=p.vx
    p.y+=p.vy
    p.vy+=p.smoke?0.05:0.3
    ctx.save()
    ctx.globalAlpha=p.alpha||1
    ctx.fillStyle=p.smoke?"#aaa":p.color
    ctx.beginPath()
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2)
    ctx.fill()
    ctx.restore()
    if(p.smoke) p.alpha-=0.01
  })
  particles=particles.filter(p=>(p.alpha===undefined||p.alpha>0)&&p.y<innerHeight+50)
  requestAnimationFrame(animate)
}
animate()

/* CLIC COFFRE */
tresor.onclick=()=>{
  const r=tresor.getBoundingClientRect()
  spawnGems(r.left+r.width/2,r.top)
  puzzle.style.display="block"
}

/* PUZZLE */
let dragged=null
document.querySelectorAll(".piece").forEach(p=>{
  p.ondragstart=()=>dragged=p
})
document.querySelectorAll(".slot").forEach(slot=>{
  slot.ondragover=e=>e.preventDefault()
  slot.ondrop=()=>{
    if(dragged.dataset.slot===slot.dataset.slot){
      slot.appendChild(dragged)
      dragged.draggable=false
      checkPuzzle()
    }
  }
})

function checkPuzzle(){
  if(document.querySelectorAll(".slot img").length===3){
    puzzle.style.display="none"
    const r=tresor.getBoundingClientRect()
    smoke(r.left+r.width/2,r.top)
    startVideo()
  }
}

/* VIDEO */
function startVideo(){
  fade.classList.add("show")
  setTimeout(()=>{
    loader.style.display="flex"
    fade.classList.remove("show")
    setTimeout(()=>{
      loader.style.display="none"
      videoContainer.style.display="flex"
      video.play()
    },1500)
  },1000)
}

menuButton.onclick=()=>location.href="menu.html"
soundButton.onclick=()=>video.muted=!video.muted
video.onended=()=>fade.classList.add("show")
