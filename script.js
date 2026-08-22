const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const photos = [
  ["assets/memory-1.webp","Us, together ♡"],
  ["assets/memory-2.webp","Little moments"],
  ["assets/memory-3.webp","Adventure time"],
  ["assets/memory-4.webp","That smile"],
  ["assets/memory-5.webp","Just her ♡"],
  ["assets/memory-6.webp","Beautiful days"],
  ["assets/memory-7.webp","A smile worth remembering"]
];

let currentPhoto = 0;
let lang = localStorage.getItem("vk-language") || "en";

window.addEventListener("load", () => {
  setTimeout(() => $("#loader")?.classList.add("hide"), 550);
  applyLanguage(lang);
  spawnHearts();
});

function applyLanguage(next){
  lang = next;
  localStorage.setItem("vk-language", lang);
  $$("[data-en]").forEach(el => {
    el.innerHTML = lang === "hi" ? el.dataset.hi : el.dataset.en;
  });
  $$(".lang").forEach(b => b.classList.toggle("active", b.dataset.lang === lang));
  $("#langToggle").textContent = lang === "en" ? "हि" : "EN";
}

$$(".lang").forEach(btn => btn.addEventListener("click", () => applyLanguage(btn.dataset.lang)));
$("#langToggle")?.addEventListener("click", () => applyLanguage(lang === "en" ? "hi" : "en"));

$("#enterBtn")?.addEventListener("click", () => {
  $("#gate").animate(
    [{opacity:1, transform:"scale(1)"},{opacity:0, transform:"scale(1.04)"}],
    {duration:700,easing:"cubic-bezier(.7,0,.3,1)"}
  );
  setTimeout(() => {
    $("#gate").classList.add("hidden");
    $("#site").classList.remove("hidden");
    document.body.style.overflowX = "hidden";
    document.querySelector("#home")?.scrollIntoView({behavior:"smooth"});
    burstHearts(24);
  }, 620);
});

$$(".memory-card").forEach(card => {
  card.addEventListener("click", () => openLightbox(Number(card.dataset.index)));
});

function openLightbox(i){
  currentPhoto = i;
  $("#lightboxImg").src = photos[i][0];
  $("#lightboxImg").alt = photos[i][1];
  $("#lightboxCaption").textContent = `${String(i+1).padStart(2,"0")}  •  ${photos[i][1]}`;
  $("#lightbox").classList.add("open");
}
function closeLightbox(){ $("#lightbox").classList.remove("open"); }
$("#closeLightbox")?.addEventListener("click", closeLightbox);
$("#lightbox")?.addEventListener("click", e => { if(e.target.id === "lightbox") closeLightbox(); });
$("#prevPhoto")?.addEventListener("click", () => openLightbox((currentPhoto + photos.length - 1) % photos.length));
$("#nextPhoto")?.addEventListener("click", () => openLightbox((currentPhoto + 1) % photos.length));
document.addEventListener("keydown", e => {
  if(!$("#lightbox")?.classList.contains("open")) return;
  if(e.key==="Escape") closeLightbox();
  if(e.key==="ArrowLeft") openLightbox((currentPhoto + photos.length - 1) % photos.length);
  if(e.key==="ArrowRight") openLightbox((currentPhoto + 1) % photos.length);
});

$("#flipBtn")?.addEventListener("click", e => {
  e.stopPropagation();
  $("#promiseCard").classList.toggle("flipped");
});
$("#promiseCard")?.addEventListener("click", () => $("#promiseCard").classList.toggle("flipped"));

$("#wishBtn")?.addEventListener("click", () => {
  burstHearts(42);
  showToast(lang === "hi" ? "दुआ हमेशा बनी रहे ♥" : "May the love stay forever ♥");
  playTinyHeartSound();
});

function showToast(text){
  const t=$("#toast"); t.textContent=text; t.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer=setTimeout(()=>t.classList.remove("show"),2500);
}

function spawnHearts(){
  setInterval(()=>{
    const h=document.createElement("span");
    h.className="float-heart";
    h.textContent=["♥","♡","✦","·"][Math.floor(Math.random()*4)];
    h.style.left=Math.random()*100+"vw";
    h.style.bottom="-20px";
    h.style.fontSize=(10+Math.random()*18)+"px";
    h.style.animationDuration=(6+Math.random()*7)+"s";
    $(".hearts-layer").appendChild(h);
    setTimeout(()=>h.remove(),14000);
  },900);
}
function burstHearts(count){
  for(let i=0;i<count;i++){
    const h=document.createElement("span");
    h.className="float-heart";
    h.textContent=["♥","♡","✦"][Math.floor(Math.random()*3)];
    h.style.left=(45+Math.random()*10)+"vw";
    h.style.bottom=(15+Math.random()*20)+"vh";
    h.style.fontSize=(12+Math.random()*22)+"px";
    h.style.animationDuration=(1.8+Math.random()*2.4)+"s";
    $(".hearts-layer").appendChild(h);
    setTimeout(()=>h.remove(),5000);
  }
}

// Subtle 3D tilt — automatically disabled on touch devices.
if (window.matchMedia("(pointer:fine)").matches){
  $$(".tilt").forEach(el=>{
    el.addEventListener("pointermove", e=>{
      const r=el.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      el.style.transform=`perspective(900px) rotateX(${(-y*5).toFixed(2)}deg) rotateY(${(x*6).toFixed(2)}deg) translateY(-2px)`;
    });
    el.addEventListener("pointerleave", ()=>{
      el.style.transform="";
    });
  });
  document.addEventListener("pointermove", e=>{
    $(".cursor-glow").style.left=e.clientX+"px";
    $(".cursor-glow").style.top=e.clientY+"px";
  });
}

// Tiny generated "love note" sound — no audio file required.
let audioCtx;
function playTinyHeartSound(){
  try{
    audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
    const now=audioCtx.currentTime;
    [523.25,659.25,783.99].forEach((freq,i)=>{
      const o=audioCtx.createOscillator(), g=audioCtx.createGain();
      o.type="sine"; o.frequency.value=freq;
      g.gain.setValueAtTime(.0001,now+i*.08);
      g.gain.exponentialRampToValueAtTime(.06,now+i*.08+.02);
      g.gain.exponentialRampToValueAtTime(.0001,now+i*.08+.32);
      o.connect(g).connect(audioCtx.destination); o.start(now+i*.08); o.stop(now+i*.08+.35);
    });
  }catch(e){}
}
$("#musicBtn")?.addEventListener("click",()=>{
  playTinyHeartSound();
  showToast(lang==="hi" ? "♥ छोटी-सी love sound चल गई" : "♥ Tiny love sound played");
});
