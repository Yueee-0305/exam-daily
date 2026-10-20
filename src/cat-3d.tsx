import {useEffect,useRef} from 'react';
type V=[number,number,number];
type Face={points:V[];normal:V};
const mesh:Face[]=[];
const point=(a:number,b:number):V=>[Math.sin(a)*Math.cos(b),Math.cos(a),Math.sin(a)*Math.sin(b)];
for(let i=0;i<12;i++)for(let j=0;j<20;j++){const a=i*Math.PI/12,b=j*Math.PI/10,d=(i+1)*Math.PI/12,e=(j+1)*Math.PI/10;for(const v of [[point(a,b),point(d,b),point(d,e)],[point(a,b),point(d,e),point(a,e)]]){const n=v.reduce((p,q)=>[p[0]+q[0],p[1]+q[1],p[2]+q[2]]as V,[0,0,0]as V);const length=Math.hypot(...n)||1;mesh.push({points:v,normal:n.map(x=>x/length)as V});}}
export default function Cat3D({active,onPet}:{active:boolean;onPet:()=>void}){const canvas=useRef<HTMLCanvasElement>(null),activeRef=useRef(active);activeRef.current=active;
useEffect(()=>{const c=canvas.current!,ctx=c.getContext('2d');if(!ctx)return;let raf=0,start=performance.now(),previous=0;const orange:V=[.88,.55,.24],cream:V=[1,.83,.57],pink:V=[.76,.40,.37],dark:V=[.14,.12,.10];
function draw(now:number){raf=requestAnimationFrame(draw);if(document.hidden||now-previous<40)return;previous=now;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,t=reduced?0:(now-start)/1000,cycle=t%24,walking=cycle>3&&cycle<9||cycle>14&&cycle<20,direction=cycle<12?-1:1;const x=cycle<=3?.45:cycle<9?.45-(cycle-3)*.15:cycle<=14?-.45:cycle<20?-.45+(cycle-14)*.15:.45,stretch=cycle>10&&cycle<13?Math.sin((cycle-10)/3*Math.PI):0,pet=activeRef.current,bounce=walking?Math.abs(Math.sin(t*8))*.055:Math.sin(t*2)*.013,yaw=pet?Math.sin(t*8)*.13:walking?direction*.75:Math.sin(t*.7)*.16;const r=c.getBoundingClientRect(),ratio=Math.min(devicePixelRatio||1,2);if(c.width!==Math.round(r.width*ratio)||c.height!==Math.round(r.height*ratio)){c.width=Math.round(r.width*ratio);c.height=Math.round(r.height*ratio);}const W=c.width,H=c.height,aspect=W/H,co=Math.cos(yaw),si=Math.sin(yaw);ctx!.clearRect(0,0,W,H);const faces:{p:V[];z:number;color:string}[]=[];
const rotate=(p:V):V=>[p[0]*co+p[2]*si,p[1],-p[0]*si+p[2]*co];
function ball(center:V,size:V,color:V){for(const f of mesh){const normal=rotate(f.normal.map((v,i)=>v/size[i])as V),length=Math.hypot(...normal);if(normal[2]/length<-.1)continue;const light=Math.max(0,(-.45*normal[0]+.65*normal[1]+.6*normal[2])/length),highlight=Math.pow(Math.max(0,normal[2]/length),22)*.07;const p=f.points.map(v=>{const q=rotate(v.map((n,i)=>n*size[i]+center[i])as V);q[0]+=x;q[1]+=bounce;return q;});const shade=color.map(v=>Math.min(255,Math.round((v*(.55+.45*light)+highlight)*255)));faces.push({p,z:p.reduce((sum,q)=>sum+q[2],0)/3,color:`rgb(${shade.join(',')})`});}}
ball([0,.08,0],[.75,.035,.46],[.48,.57,.39]);
for(let i=0;i<8;i++){const a=i/7*Math.PI*.9;ball([.48+Math.sin(a)*.48,.50+i*.10,-.20],[.15,.18,.15],orange);}
ball([0,1.0-stretch*.14,0],[.53+stretch*.15,.71-stretch*.19,.40],orange);ball([0,1.0-stretch*.12,.33],[.32,.45,.13],cream);
for(const side of [-1,1]){const stride=walking?Math.sin(t*8+side)*.10:0;ball([side*.29,.25+Math.max(0,stride),.24+stride],[.22,.19,.30],cream);ball([side*.43,pet?1.0+Math.max(0,Math.sin(t*8))* .28:.72-stretch*.2,.16],[.17,.37,.18],orange);}
const hy=1.97-stretch*.32;ball([0,hy,.07],[.69,.59,.52],orange);
for(const side of [-1,1]){ball([side*.43,hy+.48,.04],[.25,.36,.20],orange);ball([side*.44,hy+.48,.20],[.13,.23,.055],pink);ball([side*.25,hy+.02,.55],[.10,pet?.035:.14,.065],dark);ball([side*.23-.025,hy+.07,.607],[.026,.034,.018],[1,1,.93]);ball([side*.16,hy-.21,.53],[.21,.16,.13],cream);}
ball([0,hy-.16,.68],[.095,.065,.045],pink);ball([0,hy-.29,.62],[.028,.07,.025],dark);for(let i=-1;i<=1;i++)ball([i*.14,hy+.46,.38],[.045,.12,.04],[.63,.38,.16]);

faces.sort((a,b)=>a.z-b.z);for(const f of faces){ctx!.beginPath();f.p.forEach((p,i)=>{const px=W/2+p[0]/(2.2*aspect)*W/2,py=H/2-((p[1]-1.4)*.45+p[2]*.05)*H/2;i?ctx!.lineTo(px,py):ctx!.moveTo(px,py);});ctx!.closePath();ctx!.fillStyle=f.color;ctx!.strokeStyle=f.color;ctx!.lineWidth=.5;ctx!.fill();ctx!.stroke();}}
raf=requestAnimationFrame(draw);return()=>cancelAnimationFrame(raf);},[]);
return <button className="cat-3d" aria-label="和立体橘子互动" onClick={onPet}><canvas ref={canvas} aria-label="三维橘猫，走动、停歇与伸懒腰"/></button>;
}
