import plan from './plan.json';
export type Task={id:string;subject:string;kind:string;text:string;courseId?:string|null};
export type Day={date:string;phase:string;tasks:Task[]};
export type Values=Record<string,string>;
export const days:Day[]=plan.days;
export const courses=plan.courses;
export const exams=plan.exams;
export function getTasks(day:Day,values:Values):Task[]{
 return ['行测','申论'].flatMap(subject=>{
  const raw=values[`${day.date}.tasks-${subject==='行测'?'xc':'sl'}`];
  if(raw){try{const rows=JSON.parse(raw);if(Array.isArray(rows))return rows.slice(0,5);}catch{}}
  return day.tasks.filter(t=>t.subject===subject).slice(0,5);
 });
}
export function isDone(t:Task,date:string,values:Values){return t.courseId?values['course.'+t.courseId]==='true':values[`${date}.check.${t.id.toLowerCase()}`]==='true';}
export function courseText(c:typeof courses[number]){return c.number?`${c.module}第${c.number}课时`:c.type;}
export function learningProgress(subject:string,values:Values){
 const lessons=courses.filter(course=>course.subject===subject);
 const total=lessons.length;
 const completed=lessons.filter(course=>values['course.'+course.id]==='true').length;
 return {total,completed,percent:total?Math.round(completed/total*1000)/10:0};
}
