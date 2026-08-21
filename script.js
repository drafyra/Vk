const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const canvas = $("#particleCanvas");
const ctx = canvas.getContext("2d");
let W, H, particles = [];
function resize(){ W=canvas.width=innerWidth*devicePixelRatio; H=canvas.height=innerHeight*devicePixelRatio; canvas.style.width=innerWidth+"px"; canvas.style.height=innerHeight+"px"; ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0); }
resize(); addEventListener("resize",resize);

for(let i=0;i<85;i++) particles.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.7+.3,a:Math.random(),s:Math.random()*.22+.05});
function particlesLoop(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  for(const p of particles){
    p.y-=p.s; p.a+=.008;
    if(p.y<-5)p.y=innerHeight+5;
    const alpha=.18+.18*Math.sin(p.a);
    ctx.fillStyle=`rgba(255,190,220,${alpha})`;
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
  }
  requestAnimationFrame(particlesLoop);
}
particlesLoop();

const colors=["♥","♡","❤","💗","💖","✨","✦"];
function spawnHearts(x,y,count=10){
  for(let i=0;i<count;i++){
    const el=document.createElement("span");
    el.className="float-heart";
    el.textContent=colors[Math.floor(Math.random()*colors.length)];
    el.style.left=x+"px"; el.style.top=y+"px";
    el.style.setProperty("--rise",(140+Math.random()*300)+"px");
    el.style.setProperty("--drift",(-100+Math.random()*200)+"px");
    el.style.setProperty("--scale",(0.65+Math.random()*1.25).toFixed(2));
    el.style.setProperty("--rot",(-50+Math.random()*100)+"deg");
    el.style.setProperty("--dur",(1.5+Math.random()*1.7)+"s");
    document.body.appendChild(el);
    setTimeout(()=>el.remove(),3600);
  }
}

let lastTouch=0;
addEventListener("pointerdown",(e)=>{
  // Ignore direct controls so buttons can have their own animation.
  if(e.target.closest("button, a, input, audio")) return;
  const now=Date.now();
  if(now-lastTouch<45) return; lastTouch=now;
  spawnHearts(e.clientX,e.clientY,12);
});

$("#heartBtn").addEventListener("click",(e)=>{
  const r=e.currentTarget.getBoundingClientRect();
  spawnHearts(r.left+r.width/2,r.top+r.height/2,28);
  showToast("❤️ Love sent into the universe…");
});

const music=$("#bgMusic"), musicBtn=$("#musicBtn"), musicLabel=$("#musicLabel");
let musicStarted=false;
async function startMusic(){
  try{ await music.play(); musicStarted=true; musicBtn.textContent="❚❚"; musicLabel.textContent="Playing"; }
  catch{ musicLabel.textContent="Tap music"; }
}
musicBtn.addEventListener("click",()=>{
  if(music.paused) startMusic();
  else {music.pause();musicBtn.textContent="♫";musicLabel.textContent="Music";}
});
$("#beginBtn").addEventListener("click",()=>{ startMusic(); $("#surprise").scrollIntoView({behavior:"smooth"}); });

const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.12});
$$(".reveal").forEach(el=>io.observe(el));

$$(".tilt").forEach(card=>{
  card.addEventListener("pointermove",e=>{
    if(innerWidth<800)return;
    const r=card.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(900px) rotateY(${x*7}deg) rotateX(${-y*7}deg)`;
  });
  card.addEventListener("pointerleave",()=>card.style.transform="");
});

const envelope=$("#envelope"), modal=$("#letterModal");
envelope.addEventListener("click",()=>{envelope.classList.toggle("open");setTimeout(()=>modal.classList.add("show"),550);});
$("#closeModal").addEventListener("click",()=>modal.classList.remove("show"));
modal.addEventListener("click",e=>{if(e.target===modal)modal.classList.remove("show")});

function showToast(text){const t=$("#toast");t.textContent=text;t.classList.add("show");clearTimeout(t._x);t._x=setTimeout(()=>t.classList.remove("show"),1700)}

function makeFirework(x,y){
  const layer=$("#fireworkLayer"), burst=document.createElement("div");
  burst.className="burst"; burst.style.left=x+"px";burst.style.top=y+"px";
  const shadows=[];
  const hue=Math.floor(Math.random()*360);
  for(let i=0;i<34;i++){
    const a=Math.PI*2*i/34, d=45+Math.random()*120;
    const dx=Math.cos(a)*d,dy=Math.sin(a)*d;
    shadows.push(`${dx}px ${dy}px 0 ${Math.max(1,Math.random()*3)}px hsl(${hue+Math.random()*50} 100% 75%)`);
  }
  burst.style.setProperty("--shadows",shadows.join(","));
  layer.appendChild(burst); setTimeout(()=>burst.remove(),1100);
}
function fireworks(){
  startMusic();
  const layer=$("#fireworkLayer");
  for(let i=0;i<16;i++) setTimeout(()=>makeFirework(50+Math.random()*innerWidth,18+Math.random()*innerHeight*.68),i*150);
  for(let i=0;i<90;i++) setTimeout(()=>spawnHearts(Math.random()*innerWidth,innerHeight+20,1),i*35);
  const text=document.createElement("div");text.className="firework-text";text.innerHTML="Vicky <span style='color:#ff4f91'>♥</span> Kashish<br><small style='font:500 14px Manrope;letter-spacing:.25em'>FOREVER & ALWAYS</small>";
  layer.appendChild(text);setTimeout(()=>text.remove(),3300);
  showToast("🎆 The sky is celebrating them!");
}
$("#fireworksBtn").addEventListener("click",fireworks);
$("#againBtn").addEventListener("click",()=>{fireworks();window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"})});

// A small automatic welcome burst after the user first interacts.
let welcomed=false;
addEventListener("pointerdown",()=>{
  if(welcomed)return;welcomed=true;
  setTimeout(()=>spawnHearts(innerWidth/2,innerHeight*.75,16),120);
},{once:true});

// Keep the music setup fully optional: browsers block autoplay until interaction.

// EXTRA SMART PHOTO TOUCH
$$(".memory-card").forEach(card=>{
  const img=card.querySelector("img"), thought=card.querySelector(".photo-thought");
  if(!img || !thought) return;
  const show=()=>{
    const already=card.classList.contains("smart-touched");
    $$(".memory-card.smart-touched").forEach(c=>c.classList.remove("smart-touched"));
    if(!already){
      card.classList.add("smart-touched");
      const r=card.getBoundingClientRect();
      spawnHearts(r.left+r.width/2,r.top+r.height*.52,10);
      showToast("💭 A little thought for this memory…");
    }
  };
  img.addEventListener("click",show);
});
