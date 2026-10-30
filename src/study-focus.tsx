export default function StudyFocus({date,customized,openEditor}:{date:string;customized:boolean;openEditor:(subject:string)=>void}){
 if(date<'2026-10-30'||date>'2026-12-05')return null;
 return <section className="card study-focus" aria-label="申论重点训练安排">
  <div className="card-heading"><h2>申论重点训练</h2><span>申论60% · 行测40%</span></div>
  <p>普通日约6小时：申论210分钟，行测150分钟。套卷替换对应专项，次日继续复盘。</p>
  {customized&&<p>当天有自定任务，已保留。需要新版安排时，在对应科目编辑中选择“恢复默认”。</p>}
  <details><summary>查看阶段安排</summary><div className="study-phases">
   <p>10月30日—11月8日：小题审题、材料取点与分层；每周大作文全文2篇，其余日练提纲与论证段。</p>
   <p>11月9—22日：江苏目标类别真题；每周申论整卷2套，作答后次日集中修改。</p>
   <p>11月23日—12月3日：整卷限时、字数与书写速度；12月2日完整模拟，固定答题顺序。</p>
   <p>12月4—5日：减量回看漏点、答案与写作框架，核对准考证和考试用品。</p>
   <p>申论整卷：11月10、14、17、21、24、28日及12月2日。行测整卷：11月7、14、21、28日及12月2日。</p>
   <p>申论复盘：题目要求、遗漏要点、表达问题、下次改法。先独立手写，再看解析，再重写。</p>
   <p>行测按判断、资料、数量、言语推进；已学模块穿插巩固。40%—80%为选题筛选条件。</p>
  </div></details>
  <div className="actions"><button className="outline" onClick={()=>openEditor('申论')}>调整申论任务</button><button className="outline" onClick={()=>openEditor('行测')}>调整行测任务</button></div>
 </section>;
}
