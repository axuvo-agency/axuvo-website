/* ============================================================
   AXUVO — Site interactions
   Blocks: custom cursor · preloader · hero letters ·
           halftone canvas · marquee · scroll reveal ·
           manifesto highlight · review belts · work grid ·
           parallax · counters
   Edit the `reviews` and `projects` arrays below to change
   content. No build step required.
   ============================================================ */

/* ============ mobile menu ============ */
const navToggle=document.getElementById('navToggle'),mobileMenu=document.getElementById('mobileMenu');
function toggleMenu(open){
  const willOpen=open!==undefined?open:!mobileMenu.classList.contains('open');
  navToggle.classList.toggle('open',willOpen);
  mobileMenu.classList.toggle('open',willOpen);
  document.body.style.overflow=willOpen?'hidden':'';
}
navToggle.addEventListener('click',()=>toggleMenu());
document.querySelectorAll('.mm-link').forEach(a=>a.addEventListener('click',()=>toggleMenu(false)));

/* ============ custom cursor ============ */
const cursor=document.getElementById('cursor');
let cx=innerWidth/2,cy=innerHeight/2,tx=cx,ty=cy;
addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY});
(function moveCursor(){cx+=(tx-cx)*.35;cy+=(ty-cy)*.35;cursor.style.transform=`translate(${cx-  0}px,${cy}px) translate(-50%,-50%)`;requestAnimationFrame(moveCursor)})();
document.querySelectorAll('.hoverable').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cursor.classList.add('is-hover');cursor.dataset.label=el.dataset.label||'View'});
  el.addEventListener('mouseleave',()=>cursor.classList.remove('is-hover'));
});

/* ============ preloader ============ */
const pl=document.getElementById('preloader'),plc=document.getElementById('plcount');
let p=0;const plInt=setInterval(()=>{
  p=Math.min(100,p+Math.random()*14);
  plc.textContent=String(Math.floor(p)).padStart(3,'0');
  if(p>=100){clearInterval(plInt);setTimeout(()=>{pl.classList.add('done');heroIn()},250)}
},80);

/* ============ hero letters ============ */
function heroIn(){
  document.querySelectorAll('.hero-title .ch').forEach((c,i)=>{
    c.animate([{transform:'translateY(110%)',opacity:0},{transform:'translateY(0)',opacity:1}],
      {duration:1100,delay:i*90,easing:'cubic-bezier(.22,1,.36,1)',fill:'forwards'});
  });
}

/* ============ halftone canvases (signature) ============ */
function halftone(canvasId,mouseReactive){
  const cv=document.getElementById(canvasId),ctx=cv.getContext('2d');
  let W,H,dpr=Math.min(devicePixelRatio||1,2);
  let mx=-999,my=-999,t=0,visible=true,running=true;
  const isMobile=innerWidth<760;
  const gap=isMobile?18:14;              // coarser grid on phones = fewer draws
  function size(){W=cv.offsetWidth;H=cv.offsetHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
  size();addEventListener('resize',size);
  if(mouseReactive){cv.parentElement.addEventListener('mousemove',e=>{const r=cv.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top});
    cv.parentElement.addEventListener('mouseleave',()=>{mx=-999;my=-999});}
  // pause rendering when the canvas is off-screen (saves CPU/battery)
  new IntersectionObserver(es=>{visible=es[0].isIntersecting;if(visible&&!running){running=true;draw();}},{threshold:.01}).observe(cv);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function draw(){
    if(!visible){running=false;return;}          // stop the loop while hidden
    t+=.008;
    ctx.clearRect(0,0,W,H);
    for(let y=gap/2;y<H;y+=gap){
      for(let x=gap/2;x<W;x+=gap){
        let v=Math.sin(x*.006+t*1.4)*Math.cos(y*.008-t)*.5
             +Math.sin((x+y)*.004+t*.7)*.5;
        v=(v+1)/2;
        if(mx>-500){const d=Math.hypot(x-mx,y-my);v+=Math.max(0,1-d/220)*.9}
        v=Math.min(1,Math.max(0,v));
        const r=v*v*(gap*.46);
        if(r<.4)continue;
        const blue=Math.sin(x*.002+t*.5)>0.55;
        ctx.fillStyle=blue?`rgba(125,151,168,${.25+v*.6})`:`rgba(233,229,218,${.12+v*.75})`;
        ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();
      }
    }
    if(reduced){running=false;return;}
    requestAnimationFrame(draw);
  }
  draw();
}
halftone('halftone',true);
halftone('halftone2',true);

/* ============ marquee ============ */
const mq=document.getElementById('mq');
mq.innerHTML+=mq.innerHTML+mq.innerHTML;
let mqx=0,scrollVel=0,lastY=scrollY;
addEventListener('scroll',()=>{scrollVel=scrollY-lastY;lastY=scrollY},{passive:true});
(function mqLoop(){
  mqx-=1.2+Math.min(Math.abs(scrollVel)*.25,8);
  scrollVel*=.9;
  const half=mq.scrollWidth/3;
  if(-mqx>=half)mqx+=half;
  mq.style.transform=`translateX(${mqx}px)`;
  requestAnimationFrame(mqLoop);
})();

/* ============ reveal on scroll ============ */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in-view')}),{threshold:.18});
document.querySelectorAll('.rv,.sec-head,.cta').forEach(el=>io.observe(el));

/* ============ manifesto word-by-word ============ */
const mani=document.getElementById('mani');
const accents=['Google','reviews','website','Axuvo','five','stars','intelligent'];
mani.innerHTML=mani.textContent.split(' ').map(w=>{
  const acc=accents.some(a=>w.replace(/[^a-zA-Z]/g,'')===a);
  return `<span class="w${acc?' accent':''}">${w}</span>`;
}).join(' ');
const words=[...mani.querySelectorAll('.w')];
function maniScroll(){
  const r=mani.getBoundingClientRect();
  const prog=Math.min(1,Math.max(0,(innerHeight*.85-r.top)/(r.height+innerHeight*.4)));
  const lit=Math.floor(prog*words.length*1.4);
  words.forEach((w,i)=>w.classList.toggle('lit',i<lit));
}
addEventListener('scroll',maniScroll,{passive:true});maniScroll();

/* ============ review cards ============ */
const reviews=[
  ["Axuvo rebuilt our review flow — we went from 3.8 to 4.7 stars in four months. The widget is a work of art.","Priya N.","Restaurant chain"],
  ["The AI replies sound more like us than we do. Customers actually respond back.","Daniel K.","Dental clinic"],
  ["Our new website won us the biggest client in our history. Enough said.","Sara M.","Architecture firm"],
  ["They treat a review card like a hero section. Insane attention to detail.","Rohit V.","SaaS founder"],
  ["Reputation dashboard is the first tab I open every morning.","Elena T.","Hotel group"],
  ["Every agency says 'design-driven'. Axuvo actually is.","Marcus L.","E-commerce brand"],
  ["Scroll animations so smooth our bounce rate dropped 40%.","Aisha R.","Fintech startup"],
  ["The star rating widget alone doubled our click-throughs from Google.","Tom H.","Auto detailing"]
];
function starRow(){return `<div class="rev-stars">${'<svg viewBox="0 0 24 24"><use href="#star"/></svg>'.repeat(5)}</div>`}
function card([txt,name,role],alt){
  const bg=alt?'#0b0b0c':'#7d97a8',fg=alt?'#e9e5da':'#0b0b0c';
  return `<div class="rev-card${alt?' alt':''}">${starRow()}<div class="rev-txt">“${txt}”</div>
  <div class="rev-meta"><span class="avatar" style="background:${bg};color:${fg}">${name[0]}</span>${name} — ${role}</div></div>`;
}
const b1=document.getElementById('belt1'),b2=document.getElementById('belt2');
b1.innerHTML=(reviews.slice(0,4).map((r,i)=>card(r,i%2)).join('')).repeat(3);
b2.innerHTML=(reviews.slice(4).map((r,i)=>card(r,(i+1)%2)).join('')).repeat(3);
let bx1=0,bx2=0;
(function beltLoop(){
  const boost=Math.min(Math.abs(scrollVel)*.15,5);
  bx1-=.6+boost; bx2+=.6+boost;
  const h1=b1.scrollWidth/3,h2=b2.scrollWidth/3;
  if(-bx1>=h1)bx1+=h1; if(bx2>=0)bx2-=h2;
  b1.style.transform=`translateX(${bx1}px)`;
  b2.style.transform=`translateX(${bx2}px)`;
  requestAnimationFrame(beltLoop);
})();
bx2=-b2.scrollWidth/3;

/* ============ PRICING ============
   Edit tiers here — everything (cards + compare table + modal)
   is generated from this one array. */
const CHECK='<svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>';
const tiers=[
  {name:'Starter', price:'5,000', pop:false, loc:'1 location',
   perks:['Done-for-you funnel setup','Branded QR review cards','Google review dashboard','Happy → Google, unhappy → private']},
  {name:'Growth', price:'12,000', pop:true, loc:'1 location · +₹9,000 / extra',
   perks:['Everything in Starter','AI-written review replies','Automated WhatsApp review requests','Smart follow-ups if no reply','Monthly performance reporting']},
  {name:'Pro', price:'21,999', pop:false, loc:'Up to 3 locations',
   perks:['Everything in Growth','Priority support','Competitor review tracking','Multi-location dashboard']},
];
function tierCard(t){
  return `<div class="tier${t.pop?' pop':''}">
    ${t.pop?'<span class="badge">Most popular</span>':''}
    <div class="tname">${t.name}</div>
    <div class="tprice">₹${t.price}<em>/mo</em></div>
    <div class="tsetup">+ ₹9,999 one-time setup</div>
    <div class="tloc">${t.loc}</div>
    <ul>${t.perks.map(p=>`<li>${CHECK}${p}</li>`).join('')}</ul>
    <a class="tbtn hoverable" data-label="Start" href="mailto:axuvo.agency@gmail.com?subject=${encodeURIComponent(t.name+' plan enquiry')}">Choose ${t.name}</a>
  </div>`;
}
const tiersHTML=`<div class="tiers">${tiers.map(tierCard).join('')}</div>`;
document.getElementById('pricingTiers').innerHTML=tiersHTML;
document.getElementById('modalTiers').innerHTML=tiersHTML;

/* compare table (built from same tiers) */
const compareRows=[
  ['Done-for-you funnel setup',true,true,true],
  ['Branded QR review cards',true,true,true],
  ['Review dashboard',true,true,true],
  ['Private negative-feedback catch',true,true,true],
  ['AI-written review replies',false,true,true],
  ['Automated WhatsApp review requests',false,true,true],
  ['Smart follow-up reminders',false,true,true],
  ['Monthly reporting',false,true,true],
  ['Locations included','1','1','Up to 3'],
  ['Priority support',false,false,true],
  ['Competitor review tracking',false,false,true],
];
const YES='<svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>';
const NO='<span class="no">—</span>';
function cell(v){return v===true?YES:v===false?NO:`<span>${v}</span>`}
const compareHTML=`<table class="ctable">
  <thead><tr><th>Feature</th><th>Starter</th><th class="hi">Growth</th><th>Pro</th></tr></thead>
  <tbody>${compareRows.map(r=>`<tr><td class="feat">${r[0]}</td><td class="mid">${cell(r[1])}</td><td class="mid">${cell(r[2])}</td><td class="mid">${cell(r[3])}</td></tr>`).join('')}
  <tr><td class="feat">Monthly price</td><td class="mid">₹5,000</td><td class="mid">₹12,000</td><td class="mid">₹21,999</td></tr>
  </tbody></table>`;
document.getElementById('cmpWrap').innerHTML=compareHTML;
document.getElementById('modalCompare').innerHTML='<h3 style="font-weight:800;font-stretch:110%;text-transform:uppercase;letter-spacing:-.01em;margin-bottom:2vh;font-size:22px">Compare plans</h3>'+compareHTML;

/* compare toggle (inline section) */
const cmpToggle=document.getElementById('cmpToggle'),cmpWrap=document.getElementById('cmpWrap');
cmpToggle.addEventListener('click',()=>{
  cmpToggle.classList.toggle('open');cmpWrap.classList.toggle('open');
  document.getElementById('cmpLabel').textContent=cmpWrap.classList.contains('open')?'Hide comparison':'Compare all plans';
});

/* ============ pricing modal (nav "Pricing" opens focused view) ============ */
const priceModal=document.getElementById('priceModal');
function openPricing(e){if(e)e.preventDefault();priceModal.classList.add('open');priceModal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';}
document.getElementById('navPricing').addEventListener('click',openPricing);
function closeModal(){priceModal.classList.remove('open');priceModal.setAttribute('aria-hidden','true');document.body.style.overflow='';}
document.getElementById('pmClose').addEventListener('click',closeModal);
addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
priceModal.addEventListener('click',e=>{if(e.target===priceModal)closeModal();});

/* ============ live reply-tool demo ============ */
const demoData=[
  {name:'Meera', where:'Café · Kochi', stars:5, av:'M',
   text:'Loved the filter coffee and the ambience. Staff were so warm!',
   reply:'Thank you so much, Meera! We\u2019re thrilled you enjoyed the filter coffee and the vibe. Your kind words mean the world to our team — see you again soon! \u2615'},
  {name:'Arjun', where:'Salon · Kozhikode', stars:4, av:'A',
   text:'Great haircut, though I waited a little longer than expected.',
   reply:'Thanks for the honest feedback, Arjun! Glad you loved the cut. You\u2019re right about the wait — we\u2019re adding slots to fix that. Hope to see you next time!'},
  {name:'Fathima', where:'Dental Clinic · Thrissur', stars:5, av:'F',
   text:'Painless treatment and very clear explanation. Highly recommend.',
   reply:'This made our day, Fathima! Comfort and clarity are exactly what we aim for. Thank you for recommending us — wishing you a healthy smile always! \u2728'},
];
const dPills=document.getElementById('demoPills'),dOut=document.getElementById('dOut');
let typing=null;
function star5(n){let s='';for(let i=0;i<5;i++)s+=`<svg viewBox="0 0 24 24" style="${i<n?'':'opacity:.2'}"><use href="#star"/></svg>`;return s;}
function loadReview(i){
  const d=demoData[i];
  document.getElementById('dAv').textContent=d.av;
  document.getElementById('dMeta').textContent=`${d.name} · ${d.where}`;
  document.getElementById('dStars').innerHTML=star5(d.stars);
  document.getElementById('dText').textContent=d.text;
  [...dPills.children].forEach((b,bi)=>b.classList.toggle('active',bi===i));
  // typewriter
  clearInterval(typing);dOut.innerHTML='<span class="cur"></span>';
  let k=0;const full=d.reply;
  typing=setInterval(()=>{
    k++;dOut.innerHTML=full.slice(0,k).replace(/</g,'&lt;')+'<span class="cur"></span>';
    if(k>=full.length)clearInterval(typing);
  },18);
}
demoData.forEach((d,i)=>{
  const b=document.createElement('button');b.className='hoverable';b.dataset.label='Try';
  b.textContent=`${d.name} · ${d.stars}★`;b.addEventListener('click',()=>loadReview(i));
  dPills.appendChild(b);
});
// auto-run first demo when scrolled into view
const demoIO=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){loadReview(0);demoIO.disconnect();}}),{threshold:.4});
demoIO.observe(document.getElementById('demo'));