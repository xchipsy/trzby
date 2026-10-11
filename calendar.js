const DAYS=['Po','Út','St','Čt','Pá','So','Ne'];
const FIXED={ '1-1':'Nový rok / Den obnovy samostatného českého státu','5-1':'Svátek práce','5-8':'Den vítězství','7-5':'Den slovanských věrozvěstů Cyrila a Metoděje','7-6':'Den upálení mistra Jana Husa','9-28':'Den české státnosti','10-28':'Den vzniku samostatného československého státu','11-17':'Den boje za svobodu a demokracii','12-24':'Štědrý den','12-25':'1. svátek vánoční','12-26':'2. svátek vánoční'};
function easter(year){const a=year%19,b=Math.floor(year/100),c=year%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k+7)%7,m=Math.floor((a+11*h+22*l)/451),month=Math.floor((h+l-7*m+114)/31),day=(h+l-7*m+114)%31+1;return new Date(year,month-1,day)}
function holidays(year){const map=new Map(Object.entries(FIXED)),e=easter(year);for(const [delta,name] of [[-2,'Velký pátek'],[1,'Velikonoční pondělí']]){const d=new Date(e);d.setDate(d.getDate()+delta);map.set(`${d.getMonth()+1}-${d.getDate()}`,name)}return map}
export function renderCalendar(container,year,month,closedDays=[],onChange){
  container.replaceChildren();const first=new Date(year,month-1,1),count=new Date(year,month,0).getDate(),offset=(first.getDay()+6)%7,closed=new Set(closedDays.map(Number)),holiday=holidays(year),grid=document.createElement('div');grid.className='calendar-grid';
  for(const name of DAYS){const el=document.createElement('div');el.className='calendar-heading';el.textContent=name;grid.append(el)}
  for(let i=0;i<offset;i++){const el=document.createElement('div');el.className='calendar-empty';grid.append(el)}
  for(let day=1;day<=count;day++){
    const b=document.createElement('button');b.type='button';b.className='calendar-day';const date=new Date(year,month-1,day),h=holiday.get(`${month}-${day}`);b.textContent=day;
    if([0,6].includes(date.getDay()))b.classList.add('weekend');if(h){b.classList.add('holiday');const star=document.createElement('span');star.className='holiday-symbol';star.textContent='✳';b.append(star)}
    const update=()=>{const isClosed=closed.has(day);b.classList.toggle('closed',isClosed);b.setAttribute('aria-pressed',String(isClosed));b.title=[h,isClosed?'Zavřeno':'Otevřeno'].filter(Boolean).join(' – ');b.setAttribute('aria-label',`${day}. ${month}. ${year}, ${b.title}`)};update();
    b.addEventListener('click',()=>{closed.has(day)?closed.delete(day):closed.add(day);update();onChange?.([...closed].sort((a,b)=>a-b))});grid.append(b);
  }
  container.append(grid);
}
