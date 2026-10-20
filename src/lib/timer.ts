import type {Values} from './training';
export type TimerDraft={elapsedMs:number;runningSince:number|null;sessionId:string;submittedSeconds:number|null};
export function randomId(){const b=crypto.getRandomValues(new Uint8Array(16));b[6]=(b[6]&15)|64;b[8]=(b[8]&63)|128;const h=Array.from(b,x=>x.toString(16).padStart(2,'0')).join('');return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`;}
export function elapsed(draft:TimerDraft,now:number){return Math.min(86400000,Math.max(0,draft.elapsedMs+(draft.runningSince===null?0:Math.max(0,now-draft.runningSince))));}
export function clock(seconds:number){seconds=Math.max(0,Math.floor(seconds));const h=Math.floor(seconds/3600),m=Math.floor(seconds%3600/60),s=seconds%60;return(h?String(h).padStart(2,'0')+'：':'')+String(m).padStart(2,'0')+'：'+String(s).padStart(2,'0');}
export function trainingTotal(date:string,values:Values){return Object.entries(values).filter(([key])=>key.startsWith(date+'.timelog.')).reduce((sum,[,value])=>sum+(Number.isFinite(Number(value))?Number(value):0),0);}
