const canvas=document.getElementById("fxCanvas")
const ctx=canvas.getContext("2d")
canvas.width=innerWidth
canvas.height=innerHeight

const tresor=document.getElementById("tresor")
const miniGame=document.getElementById("miniGame")
const fade=document.getElementById("fade")
const loader=document.getElementById("videoLoader")
const videoContainer=document.getElementById("videoContainer")
const video=document.getElementById("mainVideo")
const soundButton=document.getElementById("soundButton")
const menuButton=document.getElementById("menuButton")

let particles=[]
const gems=["#FFD700","#00FFFF","#FF00FF","#1E90FF","#00FF7F"]

/* PARTICULES GEMMES */
function spawnGems(x,y){
  for(let i=0;i<120;i++){
    particles.push({
      x,y,
      vx:(Math.random()-.5)*14,
      vy:(Math.random()-.7)*14,
      r:Math.random()*6+4,
      rot:Math.random()*360,
      color:gems[Math.floor(Math.random()*gems.length)]
    })
  }
}

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height)
  particles.forEach(p=>{
    p.x+=p.vx
    p.y+=p.vy
    p.vy+=0.3
    p.rot+=4
    ctx.save()
    ctx.translate(p.x,p.y)
    ctx.rotate(p.rot*Math.PI/180)
    ctx.fillStyle=p.color
    ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r)
    ctx.restore()
  })
  particles=particles.filter(p=>p.y<innerHeight+50)
  requestAnimationFrame(animate)
}
animate()

/* FLOW */
tresor.onclick=()=>{
  const r=tresor.getBoundingClientRect()
  spawnGems(r.left+r.width/2,r.top)
  miniGame.style.display="flex"
}

/* MINI JEU SIMPLE */
let order=[2,0,1],player=[]
document.querySelectorAll(".symbols button").forEach(btn=>{
  btn.onclick=()=>{
    player.push(+btn.dataset.id)
    if(player.length===order.length){
      if(player.every((v,i)=>v===order[i])){
        miniGame.style.display="none"
        startVideo()
      }else{
        player=[]
      }
    }
  }
})

function startVideo(){
  tresor.classList.add("open")
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
