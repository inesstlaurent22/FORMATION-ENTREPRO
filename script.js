const tresor=document.getElementById("tresor")
const miniGame=document.getElementById("miniGame")
const symbols=document.querySelectorAll(".symbols button")
const msg=document.getElementById("gameMessage")
const canvas=document.getElementById("fxCanvas")
const ctx=canvas.getContext("2d")

const loader=document.getElementById("videoLoader")
const videoContainer=document.getElementById("videoContainer")
const video=document.getElementById("mainVideo")
const soundButton=document.getElementById("soundButton")
const closeVideo=document.getElementById("closeVideo")

canvas.width=innerWidth
canvas.height=innerHeight

let order=[2,0,1]
let player=[]
let particles=[]

tresor.onclick=()=>{
  miniGame.style.display="flex"
  player=[]
  msg.textContent=""
}

symbols.forEach(btn=>{
  btn.onclick=()=>{
    player.push(+btn.dataset.id)
    if(player.length===order.length){
      checkOrder()
    }
  }
})

function checkOrder(){
  if(player.every((v,i)=>v===order[i])){
    msg.textContent="✔ Serment validé"
    explode()
    setTimeout(openTreasure,1000)
  }else{
    msg.textContent="✖ Mauvais ordre"
    shake()
    player=[]
  }
}

function openTreasure(){
  miniGame.style.display="none"
  tresor.classList.add("open")
  loader.style.display="flex"

  setTimeout(()=>{
    loader.style.display="none"
    videoContainer.style.display="flex"
    video.play()
  },1500)
}

/* PARTICULES CANVAS */
function explode(){
  for(let i=0;i<80;i++){
    particles.push({
      x:innerWidth/2,
      y:innerHeight/2,
      vx:(Math.random()-.5)*12,
      vy:(Math.random()-.8)*12,
      r:Math.random()*4+3,
      color:`hsl(${Math.random()*360},100%,60%)`
    })
  }
}

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height)
  particles.forEach(p=>{
    p.x+=p.vx
    p.y+=p.vy
    p.vy+=0.25
    ctx.fillStyle=p.color
    ctx.beginPath()
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2)
    ctx.fill()
  })
  particles=particles.filter(p=>p.y<innerHeight+50)
  requestAnimationFrame(animate)
}
animate()

function shake(){
  miniGame.querySelector(".scroll").animate([
    {transform:"translateX(0)"},
    {transform:"translateX(-10px)"},
    {transform:"translateX(10px)"},
    {transform:"translateX(0)"}
  ],{duration:400})
}

closeVideo.onclick=()=>location.href="menu.html"
soundButton.onclick=()=>{
  video.muted=!video.muted
}
