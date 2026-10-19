'use strict';
const GH=new Proxy(function(){},{get:(t,k)=>k===Symbol.toPrimitive?()=>0:GH,set:()=>true,apply:()=>GH}),$=q=>document.querySelector(q)||GH,v=$('#v'),cv=$('#cv'),cx=cv.getContext('2d');
let W=1080,H=1920,subs=[],words=[],sel=null,mode='preset',pi=0,F=null,dirty=1,sid=0,pps=60,tt=0,hist=[],hi=-1,ct=0,stopAt=0,rt=0;
const G={x:0,y:0,sx:1,sy:1,op:1},GD={x:0,y:0,sx:1,sy:1,op:1};
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x)),ease=x=>1-Math.pow(1-clamp(x,0,1),3),msg=s=>$('#st').textContent=s;
const D=o=>({font:'Inter',size:70,color:'#ffffff',bold:1,italic:0,align:'c',case:'',lines:2,lineH:1.2,outline:0,olColor:'#000000',olW:8,shadow:1,shColor:'#000000',shBlur:12,bg:0,bgColor:'#000000',bgPad:20,anim:'pop',hlColor:'#ffe600',hlEffect:'pop',hlFont:'',hlSize:100,hlMode:'spoken',hlGlow:0,hlGlowInt:40,emoji:0,rotate:0,mix:0,y:.72,...o});
const mixP={mix:1,font:'Montserrat',hlFont:'Playfair Display',size:110,hlEffect:'none',anim:'none'};
const P=[{n:'Dynamic Mix',...mixP,align:'l',hlColor:'#ffffff'},{n:'Mix Gold',...mixP,align:'l',hlColor:'#ffd23f'},{n:'Mix Center',...mixP,y:.6,hlColor:'#ff6b6b'},
{n:'Bold Pop',font:'Anton',case:'U',size:110,lines:1,outline:1,olW:12,bold:0},{n:'Highlighter',font:'Montserrat',hlEffect:'box',hlColor:'#b6ff3b',anim:'fade'},
{n:'Serif Italic',font:'Playfair Display',italic:1,size:130,lines:1,hlEffect:'none',anim:'fade'},{n:'Neon',font:'Space Mono',shColor:'#39ff14',shBlur:34,hlColor:'#39ff14',hlGlow:1,hlGlowInt:60},
{n:'Red Impact',font:'Anton',case:'U',size:190,lines:1,color:'#ff1f1f',outline:1,olColor:'#ffffff',olW:14,bold:0},{n:'Yellow Label',font:'Anton',case:'U',size:80,color:'#111111',bg:1,bgColor:'#ffe600',shadow:0,bold:0,hlEffect:'none'},
{n:'Karaoke',font:'Montserrat',hlEffect:'karaoke',hlColor:'#4dd0ff',anim:'fade'},{n:'Big Word',font:'Anton',case:'U',size:240,lines:1,bold:0,hlEffect:'none'},
{n:'Clean Bar',font:'Montserrat',size:54,bg:1,shadow:0,hlEffect:'none',anim:'fade',y:.85},{n:'Typewriter',font:'Courier Prime',size:64,anim:'typing',hlEffect:'typing',hlColor:'#39ff14'},
{n:'Flash',font:'Bangers',size:110,case:'U',outline:1,olW:10,hlEffect:'flash',hlColor:'#ff3d81',hlGlow:1,hlGlowInt:50,bold:0}].map(p=>D(p));
const SC=[['#','Text','Font, size, color and alignment of the whole caption'],['font','Font','font'],['size','Size (px @1080)','n',20,400],['color','Text color','c'],['bold','Bold','t'],['italic','Italic','t'],['align','Alignment','s',{l:'Left',c:'Center',r:'Right'}],['case','Letter case','s',{'':'Normal',U:'UPPER',L:'lower'}],['lines','Nº of lines','s',{1:1,2:2,3:3}],['lineH','Line spacing','n',.8,2,.05],
['#','Text Outline','A stroke around every letter'],['outline','Enable outline','t'],['olColor','Outline color','c'],['olW','Outline width','n',0,40],
['#','Text Shadow','Soft drop shadow under the text'],['shadow','Enable shadow','t'],['shColor','Shadow color','c'],['shBlur','Shadow blur','n',0,80],
['#','Background','A box behind the whole caption'],['bg','Enable background','t'],['bgColor','Background color','c'],['bgPad','Background padding','n',0,80],
['#','Animation','How the caption appears. It replays automatically when you change it, or press ▶ Preview effect'],['anim','Entrance animation','s',{none:'None',fade:'Fade',pop:'Pop',slide:'Slide',typing:'Typing'}],
['#','Highlighted Word','Choose which words are highlighted (click words under Subtitle Text to mark them) and how they look. Effects replay automatically'],['hlMode','Which words','s',{spoken:'The word being spoken',marked:'Only words I mark'}],['hlEffect','Highlight effect','s',{none:'None',pop:'Pop',flash:'Flashing',typing:'Typing',box:'Box',karaoke:'Karaoke'}],['hlColor','Highlight color','c'],['hlFont','Highlight font (optional)','font'],['hlSize','Highlight size %','n',50,250],
['#','Highlight Glow','Glow around the highlighted word only, in the highlight color'],['hlGlow','Enable glow','t'],['hlGlowInt','Glow intensity','r',0,100],
['#','Extras','Emoji, rotation and layout'],['emoji','Auto emoji','t'],['rotate','Random rotate lines','t'],['mix','Dynamic mix layout','t']];
const STOP=new Set('a an the and or but of to in on at is it its for as by be was are i you we he she they that this with from not so if my me do'.split(' '));
const role=(w,i)=>{const c=w.w.toLowerCase().replace(/[^\p{L}']/gu,'');return c.length<=3||STOP.has(c)?0:(i+c.length)%2?1:2};
const EMO={love:'❤️',fire:'🔥',money:'💰',happy:'😊',sad:'😢',star:'⭐',win:'🏆',idea:'💡',time:'⏰',music:'🎵',smile:'😄',god:'🙏'};
const fl=new Set(),fq=n=>encodeURIComponent(n).replace(/%20/g,'+');
function ld(n,rich){const l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family='+fq(n)+(rich?':ital,wght@0,400;0,700;1,400;1,700':'')+'&display=swap';
 l.onload=()=>Promise.all(['400','700','italic 400','italic 700'].map(x=>document.fonts.load(`${x} 20px "${n}"`))).then(()=>{dirty=1;thumbs()});l.onerror=()=>{l.remove();rich&&ld(n,0)};document.head.append(l)}
const ef=n=>{if(!n||fl.has(n)||n==='sans-serif')return;fl.add(n);ld(n,1)};
const rr=(c,x,y,w,h,r)=>{c.beginPath();c.roundRect(x,y,w,h,r)};
const eff=s=>({...P[pi],...s.o});

function drawSub(c,W,H,t,sub,E,g){
 const k=W/1080,fs=E.size*k,ws=sub.words,sp=fs*.28;if(!ws.length)return;ef(E.font);ef(E.hlFont);
 const FS=(px,b,i,f)=>`${i?'italic ':''}${b?'700 ':'400 '}${px}px "${f}",sans-serif`,T=s=>E.case==='U'?s.toUpperCase():E.case==='L'?s.toLowerCase():s;
 const it=ws.map((w,i)=>{let px=fs,f=E.font,b=E.bold,ital=E.italic,col=E.color,r2=0;
  if(E.mix){let r=role(w,i);if(E.hlMode==='marked')r=w.h?2:Math.min(r,1);px=fs*[.38,1,1.25][r];b=r==1;ital=r==2?1:0;if(r==2){f=E.hlFont||E.font;col=E.hlColor;r2=1}}else if(E.hlMode==='marked'&&w.h&&E.hlFont)f=E.hlFont;
  c.font=FS(px,b,ital,f);const tx=T(w.w);return{w,i,tx,px,f,b,ital,col,r2,wd:c.measureText(tx).width}});
 if(E.emoji){const m=ws.map(w=>EMO[w.w.toLowerCase().replace(/[^a-z]/g,'')]).find(Boolean);if(m){c.font=FS(fs,0,0,'sans-serif');it.push({w:{s:0,e:1e9},i:-1,tx:m,px:fs,f:'sans-serif',b:0,ital:0,col:'#fff',wd:c.measureText(m).width,em:1})}}
 const tot=it.reduce((a,o)=>a+o.wd+sp,0),mw=Math.max(...it.map(o=>o.wd),Math.min(W*.86,tot/Math.max(1,E.lines)*1.08)),L=[[]];let cu=0;
 it.forEach(o=>{if(L.at(-1).length&&(E.mix||cu+o.wd>mw)){L.push([]);cu=0}L.at(-1).push(o);cu+=o.wd+sp});
 const lw=L.map(l=>l.reduce((a,o)=>a+o.wd+sp,-sp)),lh=L.map(l=>Math.max(...l.map(o=>o.px))*E.lineH),bw=Math.max(...lw),bh=lh.reduce((a,b)=>a+b,0);
 const bo=sub.box||{},sc=bo.s||1,a=ease((t-sub.s)/.22),ex=clamp((sub.e+.15-t)/.15,0,1);let al=g.op*ex,an=1,ty=0;
 if(E.anim==='pop'){an=.7+.3*a;al*=a}else if(E.anim==='fade')al*=a;else if(E.anim==='slide'){ty=(1-a)*fs*.6;al*=a}
 const cxp=W/2+(bo.x||0)*W+g.x*W/100,cyp=H*E.y+(bo.y||0)*H+g.y*H/100+ty,sx=g.sx*sc,sy=g.sy*sc,pd=E.bgPad*k;
 c.save();c.globalAlpha*=al;c.translate(cxp,cyp);c.scale(sx*an,sy*an);
 if(E.bg){c.fillStyle=E.bgColor;rr(c,-bw/2-pd,-bh/2-pd*.5,bw+2*pd,bh+pd,pd*.7);c.fill()}
 let y=-bh/2;
 L.forEach((l,li)=>{let x=E.align==='l'?-bw/2:E.align==='r'?bw/2-lw[li]:-lw[li]/2;
  l.forEach(o=>{const w=o.w,nx=ws[o.i+1],on=o.em||t>=w.s,cur=!o.em&&on&&t<(nx?nx.s:sub.e+1),past=!o.em&&on&&!cur,hl=E.hlEffect;
   if(on||!(E.anim==='typing'||E.mix)){c.save();c.translate(x+o.wd/2,y+lh[li]/2);if(E.rotate)c.rotate(Math.sin(o.i*12.9+sub.id)*.06);
    let ks=1,col=o.col;const mk=E.hlMode==='marked',hot=!o.em&&(mk?!!w.h:cur),kar=hl==='karaoke'&&(mk?!!w.h&&on:(cur||past)),age=t-w.s,dec=age<0?0:Math.pow(Math.max(0,1-age/.2),2),gl=E.hlGlow&&E.hlGlowInt>0&&(E.mix?o.r2:(hot||kar)),gb=(6+E.hlGlowInt*.5)*k;
    if(!E.mix){if(kar)col=E.hlColor;else if(hot){ks=E.hlSize/100;if(hl==='pop'){col=E.hlColor;ks*=1+.15*dec}else if(hl==='flash')col=Math.floor(t*8)%2?E.hlColor:o.col;else if(mk&&hl==='none')col=E.hlColor}}
    if(hot&&hl==='box'){if(gl){c.shadowColor=E.hlColor;c.shadowBlur=gb}c.fillStyle=E.hlColor;rr(c,-o.wd/2-o.px*.18,-o.px*.6,o.wd+o.px*.36,o.px*1.2,o.px*.2);c.fill();c.shadowBlur=0;c.shadowColor='transparent';col='#111111'}
    c.scale(ks,ks);if(E.mix)c.globalAlpha*=ease((t-w.s)/.25);c.font=FS(o.px,o.b,o.ital,o.f);c.textAlign='center';c.textBaseline='middle';
    if(gl){c.shadowColor=E.hlColor;c.shadowBlur=gb;c.shadowOffsetY=0;c.fillStyle=col;for(let q=0,np=1+(E.hlGlowInt/40|0);q<np;q++)c.fillText(o.tx,0,0);c.shadowColor='transparent';c.shadowBlur=0}
    if(E.shadow){c.shadowColor=E.shColor;c.shadowBlur=E.shBlur*k;c.shadowOffsetY=3*k}
    if(E.outline){c.lineWidth=E.olW*k;c.lineJoin='round';c.strokeStyle=E.olColor;c.strokeText(o.tx,0,0)}
    c.fillStyle=col;c.fillText(o.tx,0,0);
    if(hot&&hl==='typing'){const n=Math.ceil(o.tx.length*clamp((t-w.s)/Math.max(.1,w.e-w.s),0,1)),sw=c.measureText(o.tx.slice(0,n)).width;c.save();c.beginPath();c.rect(-o.wd/2,-o.px,sw,o.px*2);c.clip();c.fillStyle=E.hlColor;c.fillText(o.tx,0,0);c.restore()}
    c.restore()}
   x+=o.wd+sp});y+=lh[li]});
 sub._bb={x:cxp-bw*sx*an/2-pd,y:cyp-bh*sy*an/2,w:bw*sx*an+2*pd,h:bh*sy*an};c.restore()}

function cover(c,w,h){if(!v.videoWidth)return;const s=Math.max(w/v.videoWidth,h/v.videoHeight),dw=v.videoWidth*s,dh=v.videoHeight*s;c.drawImage(v,(w-dw)/2,(h-dh)/2,dw,dh)}
function paint(c,w,h,t,alpha){c.clearRect(0,0,w,h);if(!alpha){c.fillStyle='#000';c.fillRect(0,0,w,h);cover(c,w,h)}for(const s of subs)if(t>=s.s&&t<s.e+.15)drawSub(c,w,h,t,s,eff(s),G)}
function size(){const a=$('#asp').value,vw=v.videoWidth||1080,vh=v.videoHeight||1920;if(a==='o'){const k=1920/Math.max(vw,vh);W=(vw*k|0)&~1;H=(vh*k|0)&~1}else[W,H]=a==='9'?[1080,1920]:a==='1'?[1080,1080]:[1920,1080];
 cv.width=W;cv.height=H;cx.imageSmoothingQuality='high';$('#cw').style.aspectRatio=W+'/'+H;dirty=1}
$('#asp').onchange=size;

/* thumbnails: your own frame + subtitle */
const SS={id:0,s:0,e:3,words:['Dynamic','captions','like','this'].map((w,k)=>({w,s:k*.3,e:k*.3+.3})),o:{},box:{}},tcv=[];
function thumb(i){const c=tcv[i].getContext('2d'),w=135,h=240,t0=v.currentTime,s=subs.find(x=>t0<x.e)||subs[0]||SS,t=s===SS?.8:clamp(t0,s.s+.05,s.e-.01);
 c.fillStyle='#2a2d3d';c.fillRect(0,0,w,h);cover(c,w,h);drawSub(c,w,h,t,s,{...P[i],...(s===SS?{}:{})},GD)}
function thumbs(i){clearTimeout(tt);tt=setTimeout(()=>{(i==null?P.map((_,k)=>k):[i]).forEach(thumb)},150)}
P.forEach((p,i)=>{const d=document.createElement('div');d.className='card'+(i?'':' s');d.innerHTML=`<canvas width="135" height="240"></canvas><b>${p.n}</b><button>Edit</button>`;tcv[i]=d.firstChild;
 d.onclick=e=>{pi=i;if(e.target.tagName==='BUTTON')setMode('preset');document.querySelectorAll('.card').forEach(x=>x.classList.remove('s'));d.classList.add('s');renderForm();dirty=1};$('#sty').append(d)});
$('#fl').innerHTML=FONTS.map(f=>`<option value="${f}">`).join('');

/* editor form (shared by preset + subtitle) */
let solo=false;function setMode(m){solo=m==='sub';renderForm()}
const closed=new Set();
function renderForm(){const T=(!solo||!sel)?P[pi]:sel&&{...P[pi],...sel.o},f=$('#form');if(!T){f.innerHTML='<p class="hint">Select a subtitle on the timeline to edit it individually.</p>';return}
 let h=`<div class="who">${(!solo||!sel)?`Editing style: <b>${P[pi].n}</b><small>Every change applies to the whole video</small>`:`Editing <b>this subtitle only</b><small>Changes affect just this chunk</small>`}${sel?`<label class="solo"><input type="checkbox" id="solo" ${solo?'checked':''}> Only this subtitle</label>`:''}<button id="pv" style="margin-top:8px">▶ Preview effect</button></div>`,op=0;
 SC.forEach(([k,l,t,a,b,st])=>{if(k==='#'){if(op)h+='</details>';op=1;h+=`<details data-g="${l}" ${closed.has(l)?'':'open'}><summary><b>${l}</b><small>${t}</small></summary>`;return}
  h+=`<label>${l}`+(t==='t'?`<input type="checkbox" data-k="${k}" ${T[k]?'checked':''}>`:t==='c'?`<input type="color" data-k="${k}" value="${T[k]}">`:t==='n'?`<input type="number" data-k="${k}" value="${T[k]}" min="${a}" max="${b}" step="${st||1}">`:t==='r'?`<input type="range" data-k="${k}" value="${T[k]}" min="${a}" max="${b}">`:t==='font'?`<input list="fl" data-k="${k}" value="${T[k]}">`:`<select data-k="${k}">${Object.entries(a).map(([x,y])=>`<option value="${x}" ${String(T[k])===x?'selected':''}>${y}</option>`).join('')}</select>`)+'</label>'});
 f.innerHTML=h+(op?'</details>':'')}
const fm=e=>{const k=e.target.dataset.k;if(!k)return;const el=e.target,val=el.type==='checkbox'?+el.checked:el.type==='number'||el.type==='range'||k==='lines'?+el.value:el.value,T=(!solo||!sel)?P[pi]:sel&&sel.o;if(!T)return;T[k]=val;if(!solo||!sel)subs.forEach(x=>{delete x.o[k]});dirty=1;thumbs((!solo||!sel)?pi:null);if(AUTO.includes(k))schedReplay()};
const fe=$('#form');fe.oninput=e=>{if(!e.target.list)fm(e)};fe.onchange=e=>{if(e.target.id==='solo'){solo=e.target.checked;renderForm();dirty=1}else if(e.target.list)fm(e)};
fe.addEventListener('toggle',e=>{const d=e.target;if(d.dataset&&d.dataset.g)d.open?closed.delete(d.dataset.g):closed.add(d.dataset.g)},true);
fe.addEventListener('focusin',e=>{if(e.target.list){e.target.dataset.v=e.target.value;e.target.value=''}});
fe.addEventListener('focusout',e=>{if(e.target.list&&!e.target.value)e.target.value=e.target.dataset.v||''});
fe.addEventListener('click',e=>{if(e.target.id==='pv')replay()});
$('#rs').onclick=()=>{if(sel){sel.o={};sel.box={};renderForm();dirty=1}};

/* subtitles + timeline */
function group(){subs=[];let c=null,p=null;const m=+$('#wps').value||3;words.forEach(w=>{if(!c||c.words.length>=m||w.s-p.e>.7||/[.?!]$/.test(p.w)){c={id:++sid,s:w.s,e:w.e,words:[],o:{},box:{}};subs.push(c)}c.words.push(w);c.e=w.e;p=w});sel=null;txtSync();renderForm();renderTL();dirty=1;thumbs()}
function select(s){if(sel!==s)solo=false;sel=s;txtSync();renderForm();renderTL();dirty=1}
function renderTL(){const d=v.duration||0,tw=$('#tw');tw.style.width=d*pps+80+'px';let r='';for(let i=0;i<d;i++)r+=`<span style="left:${i*pps}px">${i%5?'':i+'s'}</span>`;$('#rul').innerHTML=r;
 $('#tk').innerHTML=subs.map((s,i)=>`<div class="b${s===sel?' s':''}" data-i="${i}" style="left:${s.s*pps}px;width:${Math.max(8,(s.e-s.s)*pps)}px">${s.words.map(w=>w.w).join(' ')}</div>`).join('');$('#vt').style.width=d*pps+'px'}
$('#tw').onpointerdown=e=>{const b=e.target.closest('.b');if(!b){v.currentTime=clamp((e.clientX-$('#tw').getBoundingClientRect().left)/pps,0,v.duration||0);return}
 const s=subs[+b.dataset.i];if(s!==sel)select(s);const r=b.getBoundingClientRect(),m=e.clientX-r.left<7?'l':r.right-e.clientX<7?'r':'m',x0=e.clientX,s0=s.s,e0=s.e,w0=s.words.map(w=>[w.s,w.e]);
 const mv=ev=>{const d=(ev.clientX-x0)/pps;if(m==='m'){const dd=Math.max(-s0,d);s.s=s0+dd;s.e=e0+dd;s.words.forEach((w,i)=>{w.s=w0[i][0]+dd;w.e=w0[i][1]+dd})}else if(m==='l')s.s=Math.min(s0+d,s.e-.1);else s.e=Math.max(e0+d,s.s+.1);renderTL();dirty=1},up=()=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up)};addEventListener('pointermove',mv);addEventListener('pointerup',up)};
$('#zm').oninput=e=>{pps=+e.target.value;renderTL()};
function txtSync(){const t=sel?sel.words.map(w=>w.w).join(' '):'';$('#txt').value=t;const x=$('#stx');x.value=t;x.disabled=!sel;chips()}
function setText(str,from){if(!sel)return;const n=str.trim().split(/\s+/).filter(Boolean);if(!n.length)return;
 if(n.length===sel.words.length)n.forEach((w,i)=>sel.words[i].w=w);else{const d=(sel.e-sel.s)/n.length;sel.words=n.map((w,k)=>({w,s:sel.s+k*d,e:sel.s+(k+1)*d}))}
 if(from!=='a')$('#stx').value=str;if(from!=='b')$('#txt').value=str;chips();renderTL();dirty=1}
$('#txt').oninput=e=>setText(e.target.value,'b');$('#stx').oninput=e=>setText(e.target.value,'a');
$('#tw').ondblclick=e=>{const b0=e.target.closest('.b');if(!b0)return;const s=subs[+b0.dataset.i];if(s!==sel)select(s);const b=$('#tk').children[subs.indexOf(s)];if(!b)return;
 const i=document.createElement('input');i.value=s.words.map(w=>w.w).join(' ');i.style.cssText='width:100%;min-width:200px;padding:2px 4px';b.style.minWidth='220px';b.style.zIndex=5;b.textContent='';b.append(i);i.focus();i.select();
 let ok=1;i.onpointerdown=ev=>ev.stopPropagation();i.ondblclick=ev=>ev.stopPropagation();i.onkeydown=ev=>{ev.stopPropagation();if(ev.key==='Enter')i.blur();if(ev.key==='Escape'){ok=0;i.blur()}};i.onblur=()=>{if(ok)setText(i.value);renderTL()}};
$('#sp').onclick=()=>{const t=v.currentTime,s=subs.find(x=>t>x.s&&t<x.e);if(!s)return;const a=s.words.filter(w=>w.s<t),b=s.words.filter(w=>w.s>=t);if(!a.length||!b.length)return;const n={id:++sid,s:b[0].s,e:s.e,words:b,o:{...s.o},box:{...s.box}};s.words=a;s.e=a.at(-1).e;subs.splice(subs.indexOf(s)+1,0,n);renderTL();dirty=1};
$('#ad').onclick=()=>{const t=v.currentTime,s={id:++sid,s:t,e:t+1.5,words:[{w:'New',s:t,e:t+.75},{w:'subtitle',s:t+.75,e:t+1.5}],o:{},box:{}};subs.push(s);subs.sort((a,b)=>a.s-b.s);select(s)};
addEventListener('keydown',e=>{const m=e.ctrlKey||e.metaKey,z=e.key.toLowerCase();if(m&&z==='z'&&!e.shiftKey){e.preventDefault();return undo()}if(m&&(z==='y'||(z==='z'&&e.shiftKey))){e.preventDefault();return redo()}if(/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;if(e.code==='Space'){e.preventDefault();$('#pp').click()}if(e.key==='Delete'&&sel){subs=subs.filter(x=>x!==sel);sel=null;txtSync();renderTL();renderForm();dirty=1}});

/* on-canvas box (drag = move, handle = resize) */
const bx=$('#box');bx.onpointerdown=e=>{if(!sel)return;e.preventDefault();const hd=e.target.id==='hd',r=cv.getBoundingClientRect(),b0=bx.getBoundingClientRect(),x0=e.clientX,y0=e.clientY,o=sel.box,ox=o.x||0,oy=o.y||0,s0=o.s||1;
 const mv=ev=>{if(hd)o.s=clamp(s0*(ev.clientX-b0.left)/b0.width,.2,5);else{o.x=ox+(ev.clientX-x0)/r.width;o.y=oy+(ev.clientY-y0)/r.height}dirty=1},up=()=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up)};addEventListener('pointermove',mv);addEventListener('pointerup',up)};
function boxUI(){const s=sel,t=v.currentTime;if(!s||!s._bb||t<s.s||t>s.e+.15){bx.style.display='none';return}const q=s._bb;bx.style.cssText=`display:block;left:${q.x/W*100}%;top:${q.y/H*100}%;width:${q.w/W*100}%;height:${q.h/H*100}%`}

/* global adjustment */
const gsz=k=>e=>{const x=Math.max(10,+e.target.value||100)/100;G[k]=x;if($('#gl').checked){G.sx=G.sy=x;$('#gw').value=$('#gh').value=Math.round(x*100)}dirty=1};
$('#gx').oninput=e=>{G.x=+e.target.value||0;dirty=1};$('#gy').oninput=e=>{G.y=+e.target.value||0;dirty=1};$('#gw').oninput=gsz('sx');$('#gh').oninput=gsz('sy');$('#go2').oninput=e=>{G.op=e.target.value/100;dirty=1};
$('#gr').onclick=()=>{Object.assign(G,GD);['gx','gy'].forEach(i=>$('#'+i).value=0);$('#gw').value=$('#gh').value=100;$('#go2').value=100;dirty=1};

/* file + player */
function setFile(f){if(!f)return;F=f;v.src=URL.createObjectURL(f);v.onloadedmetadata=()=>{size();renderTL();v.currentTime=.05};v.onseeked=()=>{dirty=1;thumbs()}}
const dz=$('#drop');dz.onclick=()=>$('#file').click();$('#file').onchange=e=>setFile(e.target.files[0]);dz.ondragover=e=>{e.preventDefault();dz.classList.add('on')};dz.ondragleave=()=>dz.classList.remove('on');dz.ondrop=e=>{e.preventDefault();dz.classList.remove('on');setFile(e.dataTransfer.files[0])};
$('#pp').onclick=()=>v.paused?v.play():v.pause();
const AUTO=['anim','hlEffect','hlColor','hlGlow','hlGlowInt','hlSize','hlFont','hlMode'];
function replay(){const t=v.currentTime,s=sel||subs.find(x=>t>=x.s&&t<=x.e+.2)||subs.find(x=>x.s>t)||subs[0];if(!s||!v.duration)return;stopAt=s.e+.35;v.currentTime=Math.max(0,s.s-.1);v.play()}
function schedReplay(){clearTimeout(rt);rt=setTimeout(replay,450)}
v.onpause=()=>{if(v.currentTime<stopAt-.05)stopAt=0};$('#rp').onclick=replay;
function chips(){const c=$('#chips');if(!sel){c.innerHTML='<small class="hint">Select a chunk on the timeline to choose its highlighted words.</small>';return}c.innerHTML=sel.words.map((w,i)=>`<button class="chip${w.h?' on':''}" data-i="${i}">${w.w.replace(/[<>&]/g,'')}</button>`).join('')}
$('#chips').addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b||!sel)return;const w=sel.words[+b.dataset.i],on=w.h?0:1,key=x=>x.w.toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
 if(e.shiftKey){const k=key(w);subs.forEach(s=>s.words.forEach(x=>{if(key(x)===k)x.h=on}))}else w.h=on;
 if(P[pi].hlMode!=='marked'){P[pi].hlMode='marked';subs.forEach(x=>delete x.o.hlMode);renderForm();msg('Highlight mode is now "Only words I mark".')}
 chips();dirty=1;schedReplay()});
$('#clrm').onclick=()=>{subs.forEach(s=>s.words.forEach(x=>x.h=0));chips();dirty=1};
const fmt=s=>(s/60|0)+':'+('0'+(s%60|0)).slice(-2);
(function frame(){const t=v.currentTime;if(stopAt&&!v.paused&&t>=stopAt){v.pause();stopAt=0}if(dirty){clearTimeout(ct);ct=setTimeout(commit,400)}if(!v.paused||dirty){paint(cx,W,H,t,false);dirty=0;boxUI()}$('#ph').style.left=t*pps+'px';$('#tm').textContent=fmt(t)+' / '+fmt(v.duration||0);$('#pp').textContent=v.paused?'▶':'⏸';requestAnimationFrame(frame)})();

/* whisper + srt */
$('#go').onclick=async()=>{if(!F)return msg('Drop a video first.');try{msg('Loading Whisper (first run downloads the model, then cached)…');
 const{pipeline}=await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3/+esm'),m=$('#model').value,asr=await pipeline('automatic-speech-recognition',m,{progress_callback:p=>p.status==='progress'&&msg('Downloading model '+(p.progress|0)+'%')});
 msg('Reading audio…');const au=(await new AudioContext({sampleRate:16000}).decodeAudioData(await F.arrayBuffer())).getChannelData(0),l=$('#lang').value,o={return_timestamps:'word',chunk_length_s:30,stride_length_s:5};
 if(!m.endsWith('.en')){o.task='transcribe';if(l)o.language=l}msg('Transcribing…');const r=await asr(au,o);
 words=r.chunks.map(c=>({w:c.text.trim(),s:c.timestamp[0],e:c.timestamp[1]??c.timestamp[0]+.4})).filter(w=>w.w);group();msg('Done: '+words.length+' words.')}catch(e){msg('Error: '+e.message)}};
$('#wps').onchange=()=>words.length&&group();$('#imp').onclick=()=>$('#srt').click();
$('#srt').onchange=async e=>{const T=s=>{const[a,b,c]=s.replace(',','.').split(':');return+a*3600+ +b*60+ +c};words=[];(await e.target.files[0].text()).split(/\r?\n\r?\n/).forEach(b=>{const l=b.trim().split(/\r?\n/),i=l.findIndex(x=>x.includes('-->'));if(i<0)return;
 const[s,en]=l[i].split('-->').map(x=>T(x.trim())),w=l.slice(i+1).join(' ').split(/\s+/).filter(Boolean),d=(en-s)/w.length;w.forEach((x,k)=>words.push({w:x,s:s+k*d,e:s+(k+1)*d}))});group();msg('SRT imported.')};

/* fast export: WebCodecs (MP4 H.264+AAC, or VP9 WebM with alpha) */
async function exp(alpha){if(!window.VideoEncoder)return msg('Fast export needs Chrome or Edge.');if(!subs.length||!v.duration)return msg('Load a video and generate captions first.');
 try{v.pause();const fps=30,n=Math.floor(v.duration*fps),ec=document.createElement('canvas');ec.width=W;ec.height=H;const c=ec.getContext('2d');
 const M=await import(alpha?'https://cdn.jsdelivr.net/npm/webm-muxer@5/+esm':'https://cdn.jsdelivr.net/npm/mp4-muxer@5/+esm'),tg=new M.ArrayBufferTarget();
 const mx=new M.Muxer(alpha?{target:tg,video:{codec:'V_VP9',width:W,height:H,alpha:true}}:{target:tg,video:{codec:'avc',width:W,height:H},audio:{codec:'aac',numberOfChannels:2,sampleRate:48000},fastStart:'in-memory'});
 const ve=new VideoEncoder({output:(k,m)=>mx.addVideoChunk(k,m),error:e=>msg(e.message)});
 ve.configure(alpha?{codec:'vp09.00.10.08',width:W,height:H,bitrate:6e6,alpha:'keep'}:{codec:'avc1.640033',width:W,height:H,bitrate:14e6,framerate:fps});
 for(let i=0;i<n;i++){const t=i/fps;if(!alpha){v.currentTime=t;await new Promise(r=>v.addEventListener('seeked',r,{once:true}))}
  paint(c,W,H,t,alpha);const fr=new VideoFrame(ec,{timestamp:Math.round(i*1e6/fps),alpha:alpha?'keep':'discard'});ve.encode(fr,{keyFrame:i%60==0});fr.close();
  if(i%10==0){msg('Exporting '+Math.round(i/n*100)+'%');await new Promise(r=>setTimeout(r))}while(ve.encodeQueueSize>10)await new Promise(r=>setTimeout(r,5))}
 await ve.flush();ve.close();
 if(!alpha){msg('Encoding audio…');const ab=await new AudioContext({sampleRate:48000}).decodeAudioData(await F.arrayBuffer()),ae=new AudioEncoder({output:(k,m)=>mx.addAudioChunk(k,m),error:e=>msg(e.message)});
  ae.configure({codec:'mp4a.40.2',sampleRate:48000,numberOfChannels:2,bitrate:128000});const c0=ab.getChannelData(0),c1=ab.numberOfChannels>1?ab.getChannelData(1):c0;
  for(let o=0;o<c0.length;o+=48000){const len=Math.min(48000,c0.length-o),d=new Float32Array(len*2);d.set(c0.subarray(o,o+len));d.set(c1.subarray(o,o+len),len);
   const ad=new AudioData({format:'f32-planar',sampleRate:48000,numberOfFrames:len,numberOfChannels:2,timestamp:Math.round(o/48000*1e6),data:d});ae.encode(ad);ad.close()}await ae.flush();ae.close()}
 mx.finalize();const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([tg.buffer],{type:alpha?'video/webm':'video/mp4'}));a.download=alpha?'captions-alpha.webm':'captions.mp4';a.click();msg('Exported ✔');dirty=1}catch(e){msg('Export error: '+e.message)}}
$('#x1').onclick=()=>exp(0);$('#x2').onclick=()=>exp(1);
/* undo / redo + theme */
const snapS=()=>JSON.stringify({subs:subs.map(({_bb,...s})=>s),P,G,pi});
function commit(){clearTimeout(ct);const j=snapS();if(j===hist[hi])return;hist.length=hi+1;hist.push(j);if(hist.length>150)hist.shift();hi=hist.length-1}
function restore(){const st=JSON.parse(hist[hi]),id=sel&&sel.id;subs=st.subs;P.length=0;P.push(...st.P);Object.assign(G,st.G);pi=st.pi;sel=subs.find(s=>s.id===id)||null;
 document.querySelectorAll('.card').forEach((x,i)=>x.classList.toggle('s',i===pi));$('#gx').value=G.x;$('#gy').value=G.y;$('#gw').value=Math.round(G.sx*100);$('#gh').value=Math.round(G.sy*100);$('#go2').value=G.op*100;
 txtSync();renderForm();renderTL();dirty=1;thumbs();msg('')}
function undo(){commit();if(hi>0){hi--;restore()}}function redo(){commit();if(hi<hist.length-1){hi++;restore()}}
$('#un').onclick=undo;$('#re').onclick=redo;
$('#th').onclick=()=>{const t=document.documentElement.dataset.theme==='light'?'dark':'light';document.documentElement.dataset.theme=t;try{localStorage.setItem('th',t)}catch(e){}};
document.fonts.onloadingdone=()=>{dirty=1;thumbs()};
txtSync();renderForm();thumbs();commit();
if(!document.querySelector('#stx'))msg('⚠ Your HTML page is older than app.js. Re-upload the new index.html (as dynamic-captions.html) and hard-refresh with Ctrl+F5.');
