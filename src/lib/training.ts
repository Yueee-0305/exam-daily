import plan from './plan.json';
export type Task={id:string;subject:string;kind:string;text:string;courseId?:string|null};
export type Day={date:string;phase:string;tasks:Task[]};
export type Values=Record<string,string>;
export const days:Day[]=plan.days;
export const courses=plan.courses;
export type Course=typeof courses[number]&{title?:string};
export const courseCatalogKey='course-catalog.v1';
export function getCourses(values:Values):Course[]{const raw=values[courseCatalogKey];if(!raw)return courses;const list=JSON.parse(raw);if(!Array.isArray(list)||list.length>1000||new Set(list.map(c=>c.id)).size!==list.length||list.some(c=>!c||typeof c.id!=='string'||!c.id||!['行测','申论'].includes(c.subject)||typeof c.module!=='string'||!c.module.trim()||c.module.length>60||c.module.includes('|')||typeof c.type!=='string'||(c.title!==undefined&&(typeof c.title!=='string'||!c.title.trim()||c.title.length>150))))throw Error('课程目录格式无效，请保留备份并检查');return list;}
export const exams=plan.exams;
export function getTasks(day:Day,values:Values):Task[]{
 const catalog=getCourses(values);
 return ['行测','申论'].flatMap(subject=>{
  const raw=values[`${day.date}.tasks-${subject==='行测'?'xc':'sl'}`];
  if(raw){try{const rows=JSON.parse(raw);if(Array.isArray(rows))return rows.filter(t=>!t.courseId||catalog.some(c=>c.id===t.courseId)).slice(0,5).map(t=>courseTask(t,catalog));}catch{}}
  return day.tasks.filter(t=>t.subject===subject&&(!t.courseId||catalog.some(c=>c.id===t.courseId))).slice(0,5).map(t=>courseTask(t,catalog));
 });
}
export function isDone(t:Task,date:string,values:Values){return t.courseId?values['course.'+t.courseId]==='true':values[`${date}.check.${t.id.toLowerCase()}`]==='true';}
function courseTask(t:Task,catalog:Course[]){const c=catalog.find(c=>c.id===t.courseId),old=courses.find(c=>c.id===t.courseId);return c&&(c.title||c.module!==old?.module)?{...t,text:old?t.text.replace(courseText(old),courseText(c)):courseText(c)}:t;}
export function courseText(c:Course){return c.title|| (c.number?`${c.module}第${c.number}课时`:c.type);}
export function learningProgress(subject:string,values:Values){
 const lessons=getCourses(values).filter(course=>course.subject===subject);
 const total=lessons.length;
 const completed=lessons.filter(course=>values['course.'+course.id]==='true').length;
 return {total,completed,percent:total?Math.round(completed/total*1000)/10:0};
}
