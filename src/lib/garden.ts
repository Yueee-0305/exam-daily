export const speciesList=['桂花','银杏','樱花'] as const;
export const stages=[{name:'初生树苗',at:0},{name:'舒展新叶',at:5},{name:'茁壮幼树',at:25},{name:'枝叶渐丰',at:80},{name:'长成大树',at:180},{name:'满树繁盛',at:360}];
export type Garden={claimed:boolean;species:string|null;growth:number;earned:number;available:number;light:number;nutrition:number;rewardedToday:number};
export const emptyGarden:Garden={claimed:false,species:null,growth:0,earned:0,available:0,light:0,nutrition:0,rewardedToday:0};
export function growthStage(growth:number){let index=0;for(let i=0;i<stages.length;i++)if(growth>=stages[i].at)index=i;const next=stages[index+1];return {index,current:stages[index],next,progress:next?Math.min(100,(growth-stages[index].at)/(next.at-stages[index].at)*100):100};}
export function gardenFrom(profile:{species:string;growth:number}|null,earned:number,rewardedToday:number):Garden{if(!profile)return {...emptyGarden};const available=Math.max(0,earned-profile.growth);return {claimed:true,species:profile.species,growth:profile.growth,earned,available,light:available*2,nutrition:available,rewardedToday};}
